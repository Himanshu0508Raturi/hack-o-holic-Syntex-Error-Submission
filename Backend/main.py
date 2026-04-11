from fastapi import FastAPI, UploadFile, File, HTTPException
from schema import QueryRequest , QueryResponse , AgentState
from agentic_rag import ask_question
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
import io
import os
import librosa
import soundfile as sf
from transformers import pipeline

app = FastAPI(
    title="CampusAI API",
    version="1.0.0"
)

whisper_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "API is running live."}

@app.post("/query", response_model=QueryResponse)
def query_rag(request: QueryRequest):
    state = AgentState(question=request.question)
    result = ask_question(state)
    return QueryResponse(answer=result["ans"])

@app.post("/voice", response_model=QueryResponse)
async def voice_query(file: UploadFile = File(...)):
    raw_audio = await file.read()
    if not raw_audio:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

    filename = (file.filename or "").lower()
    content_type = (file.content_type or "").lower()
    is_wav = filename.endswith(".wav") or content_type in {"audio/wav", "audio/x-wav", "audio/wave"}

    text_query = ""

    # For WAV, decode bytes directly to avoid ffmpeg dependency.
    if is_wav:
        try:
            audio_array, sampling_rate = sf.read(io.BytesIO(raw_audio), dtype="float32", always_2d=False)
            if getattr(audio_array, "ndim", 1) > 1:
                audio_array = audio_array.mean(axis=1)

            target_sr = whisper_pipeline.feature_extractor.sampling_rate
            if sampling_rate != target_sr:
                audio_array = librosa.resample(audio_array, orig_sr=sampling_rate, target_sr=target_sr)
                sampling_rate = target_sr

            transcription = whisper_pipeline({"array": audio_array, "sampling_rate": sampling_rate})
            text_query = transcription.get("text", "").strip()
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Unable to decode WAV audio: {exc}") from exc
    else:
        temp_audio_path = None
        try:
            suffix = os.path.splitext(filename)[1] or ".webm"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio:
                temp_audio.write(raw_audio)
                temp_audio_path = temp_audio.name

            transcription = whisper_pipeline(temp_audio_path)
            text_query = transcription.get("text", "").strip()
        except Exception as exc:
            message = str(exc)
            if "ffmpeg was not found" in message or "No such file or directory: 'ffmpeg'" in message:
                raise HTTPException(
                    status_code=503,
                    detail="ffmpeg is not available on the server. Install ffmpeg, or upload WAV audio from the client.",
                ) from exc
            raise HTTPException(status_code=400, detail=f"Unable to transcribe uploaded audio: {message}") from exc
        finally:
            if temp_audio_path and os.path.exists(temp_audio_path):
                os.unlink(temp_audio_path)

    if not text_query:
        raise HTTPException(status_code=400, detail="Speech could not be transcribed from the audio.")

    # Pass to your RAG agent
    state = AgentState(question=text_query)
    result = ask_question(state)

    return QueryResponse(answer=result["ans"])
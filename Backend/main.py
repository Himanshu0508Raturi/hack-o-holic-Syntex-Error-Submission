from fastapi import FastAPI ,UploadFile, File
from schema import QueryRequest , QueryResponse , AgentState
from agentic_rag import ask_question
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
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
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_audio_path = temp_audio.name

    # Transcribe audio → text
    transcription = whisper_pipeline(temp_audio_path)
    text_query = transcription["text"]

    # Pass to your RAG agent
    state = AgentState(question=text_query)
    result = ask_question(state)

    return QueryResponse(answer=result["ans"])
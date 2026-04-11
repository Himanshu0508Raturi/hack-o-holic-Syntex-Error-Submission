import { motion } from "framer-motion";
import {
  GraduationCap, AlertTriangle, Lightbulb, Cpu, ArrowRight,
  Sparkles, Search, RefreshCw, Building2, Brain, Zap,
  Database, Server, Cloud, MessageSquare, GitBranch,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const problems = [
  { icon: AlertTriangle, title: "Fragmented Data", desc: "Academic materials, PYQs, notices scattered across platforms and groups" },
  { icon: Search, title: "Time Wasted", desc: "Students spend hours searching for the right academic resources" },
  { icon: RefreshCw, title: "Outdated Info", desc: "Risk of missing important updates and using stale materials" },
];

const features = [
  { icon: Zap, title: "Real-time Answers", desc: "Get instant responses to any academic query" },
  { icon: RefreshCw, title: "Self-Updating", desc: "Automatically syncs with latest campus data" },
  { icon: Building2, title: "Multi-Campus", desc: "Integrates data across departments and campuses" },
  { icon: Brain, title: "Smart Understanding", desc: "Context-aware query interpretation" },
  { icon: Sparkles, title: "AI-Powered", desc: "Advanced LLM for accurate, helpful responses" },
  { icon: Database, title: "Semantic Search", desc: "Vector-based retrieval for precise results" },
];

const steps = [
  { num: "01", title: "Query Input", desc: "Student enters a natural language question", icon: MessageSquare },
  { num: "02", title: "Agent Routing", desc: "Query routed to the most relevant specialist agent", icon: GitBranch },
  { num: "03", title: "Document Retrieval", desc: "Relevant documents fetched from vector database", icon: Database },
  { num: "04", title: "LLM Generation", desc: "AI generates a contextual, accurate answer", icon: Brain },
  { num: "05", title: "Response Delivery", desc: "Clean, formatted response displayed to the student", icon: Sparkles },
];

const archLayers = [
  { label: "Frontend", desc: "React Chat Interface", icon: MessageSquare },
  { label: "API Gateway", desc: "Spring Boot Backend", icon: Server },
  { label: "Agent Layer", desc: "Multi-Agent Router (Academic, PYQ, Notices)", icon: GitBranch },
  { label: "AI Service", desc: "Python/FastAPI + LLM", icon: Brain },
  { label: "Vector DB", desc: "Semantic Search & Retrieval", icon: Database },
  { label: "Automation", desc: "AWS EventBridge + Lambda", icon: Cloud },
];

export default function AboutPage() {
  return (
    <div className="overflow-y-auto h-full">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <motion.section {...fadeUp()} className="text-center">
          <div className="gradient-bg rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center glow">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3">
            About <span className="gradient-text">ScholrAI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An intelligent, multi-agent RAG system that centralizes fragmented campus data into one unified, AI-powered academic assistant.
          </p>
        </motion.section>

        {/* Problem */}
        <motion.section {...fadeUp(0.1)}>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">The Problem</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {problems.map((p, i) => (
              <Card key={i} className="glass border-none">
                <CardContent className="p-6">
                  <p.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Solution */}
        <motion.section {...fadeUp(0.1)}>
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Our Solution</h2>
          </div>
          <Card className="glass border-none">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">One Unified Interface</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    ScholrAI provides a single, intelligent chat interface where students can query any academic data — academic materials, previous year questions, campus notices, fee structures, and faculty information. Powered by retrieval-augmented generation, every answer is grounded in real, up-to-date data.
                  </p>
                </div>
                <div className="gradient-bg rounded-2xl p-8 flex items-center justify-center">
                  <Lightbulb className="h-16 w-16 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Architecture */}
        <motion.section {...fadeUp(0.1)}>
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">System Architecture</h2>
          </div>
          <div className="space-y-3">
            {archLayers.map((layer, i) => (
              <motion.div key={i} {...fadeUp(i * 0.06)}>
                <Card className="glass border-none">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="gradient-bg rounded-lg p-2.5 flex-shrink-0">
                      <layer.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-mono text-primary uppercase tracking-wider">{layer.label}</span>
                      <p className="text-sm text-foreground">{layer.desc}</p>
                    </div>
                    {i < archLayers.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section {...fadeUp(0.1)}>
          <div className="flex items-center gap-2 mb-6">
            <ArrowRight className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">How It Works</h2>
          </div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <span className="gradient-text font-mono font-bold text-lg">{step.num}</span>
                  {i < steps.length - 1 && <div className="w-px h-8 bg-border mt-1" />}
                </div>
                <Card className="glass border-none flex-1">
                  <CardContent className="p-4 flex items-center gap-3">
                    <step.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <motion.section {...fadeUp(0.1)}>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Key Features</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)}>
                <Card className="glass border-none hover:glow transition-shadow duration-300 cursor-default">
                  <CardContent className="p-6">
                    <f.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="h-8" />
      </div>
    </div>
  );
}

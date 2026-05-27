import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Navigation,
  User,
  ScanLine,
  LayoutDashboard,
} from "lucide-react";
import { useLocation } from "wouter";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
};

type SpeechRecognitionWindow = typeof window & {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
};

const ROUTES: Record<string, string> = {
  dashboard: "/dashboard",
  home: "/dashboard",
  complaint: "/complaints",
  complaints: "/complaints",
  "file complaint": "/complaints",
  scan: "/scan",
  "ai scan": "/scan",
  "quick scan": "/scan",
  road: "/roads",
  roads: "/roads",
  "road dna": "/roads",
  risk: "/risk-map",
  "risk map": "/risk-map",
  spending: "/spending",
  budget: "/spending",
  "public spending": "/spending",
  sensor: "/sensors",
  sensors: "/sensors",
  "sensor intel": "/sensors",
  contractor: "/contractors",
  contractors: "/contractors",
  analytics: "/analytics",
  setting: "/settings",
  settings: "/settings",
  profile: "/settings",
  sos: "/sos",
  emergency: "/sos",
};

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRouteFromText(text: string) {
  const lower = text.toLowerCase();

  for (const [keyword, route] of Object.entries(ROUTES)) {
    if (lower.includes(keyword)) return route;
  }

  return null;
}

function getBotReply(input: string) {
  const text = input.toLowerCase();

  if (text.includes("mg road") && (text.includes("money") || text.includes("spent") || text.includes("budget"))) {
    return "MG Road has an estimated maintenance allocation of 8.4 crore rupees in the RoadIntel demo dataset. I am opening Public Spending.";
  }

  if (text.includes("nh-48") || text.includes("nh48")) {
    return "NH 48 is tracked under the National Highway workflow. You can inspect it from Road DNA, Risk Map, or the spending dashboard.";
  }

  if (text.includes("contractor") || text.includes("corrupt") || text.includes("corruption")) {
    return "Contractor risk is estimated using repeated failures, repair delays, complaint density, and spending irregularities. I am opening Contractors.";
  }

  if (text.includes("pothole") || text.includes("complaint") || text.includes("report")) {
    return "You can file a road complaint with location, severity, issue type, and evidence. I am opening File Complaint.";
  }

  if (text.includes("sensor") || text.includes("vibration") || text.includes("iot")) {
    return "Sensor Intel shows live vibration, road stress, anomaly alerts, and predicted failures. I am opening Sensor Intel.";
  }

  if (text.includes("risk") || text.includes("danger") || text.includes("accident")) {
    return "The Risk Map highlights high-risk roads using complaints, sensor anomalies, repair history, and traffic impact.";
  }

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hello. I am your RoadIntel voice assistant. Say a page name like dashboard, AI scan, profile, risk map, sensors, or file complaint.";
  }

  if (text.includes("help") || text.includes("what can you do")) {
    return "I can navigate the website, answer RoadIntel questions, open pages, help you file complaints, explain risk, show spending, and speak responses aloud.";
  }

  return "I understood. You can say dashboard, AI scan, profile, file complaint, risk map, sensors, contractors, public spending, or emergency SOS.";
}

function findFemaleVoice() {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();

  const preferredNames = [
    "Google UK English Female",
    "Google US English",
    "Microsoft Neerja",
    "Microsoft Heera",
    "Microsoft Zira",
    "Samantha",
    "Karen",
    "Moira",
    "Tessa",
    "Female",
  ];

  for (const name of preferredNames) {
    const voice = voices.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase()),
    );
    if (voice) return voice;
  }

  return (
    voices.find(
      (v) =>
        v.lang.toLowerCase().includes("en-in") ||
        v.lang.toLowerCase().includes("en-us") ||
        v.lang.toLowerCase().includes("en-gb"),
    ) ?? null
  );
}

function speakFemale(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = findFemaleVoice();

  if (voice) utterance.voice = voice;

  utterance.lang = voice?.lang || "en-IN";
  utterance.rate = 0.92;
  utterance.pitch = 1.18;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

export default function FloatingRoadIntelBot() {
  const [, navigate] = useLocation();

  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [input, setInput] = useState("");

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I am your RoadIntel voice assistant. Say dashboard, AI scan, profile, risk map, sensors, or file complaint.",
      time: getTime(),
    },
  ]);

  const speechSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    const speechWindow = window as SpeechRecognitionWindow;
    return Boolean(
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition,
    );
  }, []);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  useEffect(() => {
    if (!speechSupported) return;

    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onerror = () => {
      setListening(false);
      addAssistantMessage(
        "Voice input could not start. Please allow microphone permission and try again.",
        false,
      );
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript.trim()) handleUserMessage(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore browser stop errors.
      }
    };
  }, [speechSupported]);

  function addAssistantMessage(text: string, shouldSpeak = voiceEnabled) {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text,
        time: getTime(),
      },
    ]);

    if (shouldSpeak) speakFemale(text);
  }

  function handleUserMessage(rawText?: string) {
    const text = (rawText ?? input).trim();
    if (!text) return;

    setInput("");
    setChatOpen(true);

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        text,
        time: getTime(),
      },
    ]);

    const route = getRouteFromText(text);
    const reply = getBotReply(text);

    window.setTimeout(() => {
      addAssistantMessage(reply);

      if (route) {
        window.setTimeout(() => {
          navigate(route);
          setOpen(false);
          setChatOpen(false);
        }, 650);
      }
    }, 300);
  }

  function startVoice() {
    setOpen(true);

    if (!speechSupported || !recognitionRef.current) {
      addAssistantMessage(
        "Voice input is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      setListening(false);
    }
  }

  function stopVoice() {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore browser stop errors.
    }
    setListening(false);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            window.setTimeout(() => startVoice(), 250);
          }}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #1f9d55, #1597c8)",
            boxShadow: "0 24px 55px rgba(21, 151, 200, 0.42)",
          }}
          aria-label="Open RoadIntel voice assistant"
        >
          <Bot className="w-8 h-8" />
        </button>
      )}

      {open && !chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm">
          <div className="relative w-full max-w-[520px] rounded-[32px] bg-white text-slate-900 shadow-2xl p-8 sm:p-9">
            <button
              onClick={() => {
                stopVoice();
                setOpen(false);
              }}
              className="absolute right-6 top-6 w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200"
              aria-label="Close voice assistant"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  className={`absolute inset-[-18px] rounded-full border-4 ${
                    listening ? "animate-ping" : ""
                  }`}
                  style={{ borderColor: "rgba(16, 185, 129, 0.22)" }}
                />
                <div
                  className="absolute inset-[-18px] rounded-full border-4"
                  style={{ borderColor: "rgba(20, 184, 166, 0.26)" }}
                />
                <button
                  onClick={listening ? stopVoice : startVoice}
                  className="relative w-28 h-28 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: "linear-gradient(135deg, #1f9d55, #1296b8)",
                    boxShadow: "0 18px 45px rgba(18, 150, 184, 0.3)",
                  }}
                  aria-label="Start or stop listening"
                >
                  {listening ? (
                    <Mic className="w-12 h-12" />
                  ) : (
                    <MicOff className="w-12 h-12" />
                  )}
                </button>
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                {listening ? "Listening..." : "Tap mic to speak"}
              </h2>

              <p className="mt-3 text-lg text-slate-500">
                Say a page name or command in English
              </p>

              <div className="grid grid-cols-3 gap-3 w-full mt-7">
                <button
                  onClick={() => handleUserMessage("Dashboard")}
                  className="rounded-2xl border border-slate-200 py-4 px-2 flex flex-col items-center gap-2 text-slate-600 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-6 h-6" />
                  <span className="text-sm sm:text-base font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => handleUserMessage("AI Scan")}
                  className="rounded-2xl border border-slate-200 py-4 px-2 flex flex-col items-center gap-2 text-slate-600 hover:bg-slate-50"
                >
                  <ScanLine className="w-6 h-6" />
                  <span className="text-sm sm:text-base font-medium">AI Scan</span>
                </button>

                <button
                  onClick={() => handleUserMessage("Profile")}
                  className="rounded-2xl border border-slate-200 py-4 px-2 flex flex-col items-center gap-2 text-slate-600 hover:bg-slate-50"
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm sm:text-base font-medium">Profile</span>
                </button>
              </div>

              <button
                onClick={() => setChatOpen(true)}
                className="mt-6 w-full rounded-2xl py-4 px-5 text-white font-bold flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #1f9d55, #1597c8)",
                }}
              >
                <Bot className="w-5 h-5" />
                Open RoadIntel Chat
              </button>

              <button
                onClick={() => setVoiceEnabled((current) => !current)}
                className="mt-4 text-sm text-slate-500 flex items-center gap-2"
              >
                {voiceEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Female voice enabled
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Voice muted
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {open && chatOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[620px] max-h-[calc(100vh-48px)] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
          }}
        >
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #1f9d55, #1597c8)",
            }}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <div className="font-bold text-white">RoadIntel Assistant</div>
              <div className="text-xs text-white/80">
                Female voice assisted navigator
              </div>
            </div>

            <button
              onClick={() => setVoiceEnabled((current) => !current)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 text-white"
              aria-label="Toggle voice"
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setChatOpen(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 text-white"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "rounded-br-md text-white"
                      : "rounded-bl-md"
                  }`}
                  style={{
                    background:
                      message.role === "user"
                        ? "linear-gradient(135deg, #1f9d55, #1597c8)"
                        : "hsl(var(--muted))",
                    border:
                      message.role === "assistant"
                        ? "1px solid hsl(var(--border))"
                        : "none",
                  }}
                >
                  <div className="text-sm leading-relaxed">{message.text}</div>
                  <div
                    className={`text-[10px] mt-1 ${
                      message.role === "user"
                        ? "text-white/75"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            ))}

            {listening && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Listening...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            className="p-4"
            style={{
              borderTop: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={listening ? stopVoice : startVoice}
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: listening
                    ? "rgba(220,38,38,0.15)"
                    : "rgba(16,185,129,0.13)",
                  color: listening ? "#dc2626" : "#10b981",
                }}
                aria-label="Voice input"
              >
                {listening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleUserMessage();
                }}
                placeholder="Ask or say: open sensors..."
                className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />

              <button
                onClick={() => handleUserMessage()}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #1f9d55, #1597c8)",
                }}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground mt-2">
              <Navigation className="w-3 h-3" />
              Try: “dashboard”, “AI scan”, “profile”, “risk map”
            </div>
          </div>
        </div>
      )}
    </>
  );
}
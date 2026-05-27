import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Navigation,
  Minimize2,
} from "lucide-react";
import { useLocation } from "wouter";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
};

type SpeechRecognitionType = typeof window & {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
};

const QUICK_COMMANDS = [
  "Open dashboard",
  "Show risk map",
  "File complaint",
  "Open sensors",
  "Show contractors",
  "Open public spending",
];

const ROUTES: Record<string, string> = {
  dashboard: "/dashboard",
  home: "/dashboard",
  complaint: "/complaints",
  complaints: "/complaints",
  "file complaint": "/complaints",
  scan: "/scan",
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
  sos: "/sos",
  emergency: "/sos",
};

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

function getRouteFromText(text: string) {
  const lower = text.toLowerCase();

  for (const [keyword, route] of Object.entries(ROUTES)) {
    if (lower.includes(keyword)) {
      return route;
    }
  }

  return null;
}

function getBotReply(input: string) {
  const text = input.toLowerCase();

  if (
    text.includes("mg road") &&
    (text.includes("money") || text.includes("spent") || text.includes("budget"))
  ) {
    return "MG Road has an estimated maintenance allocation of ₹8.4 crore in the current RoadIntel demo dataset. Opening Public Spending for more details.";
  }

  if (
    text.includes("nh-48") ||
    text.includes("nh48") ||
    text.includes("national highway")
  ) {
    return "NH-48 is handled by the National Highways authority workflow in RoadIntel. You can check its risk and maintenance status from Road DNA or Risk Map.";
  }

  if (
    text.includes("contractor") ||
    text.includes("corrupt") ||
    text.includes("corruption")
  ) {
    return "Contractor risk is calculated using repeated failures, budget leakage patterns, delayed repairs, and complaint density. Opening Contractors section.";
  }

  if (
    text.includes("pothole") ||
    text.includes("complaint") ||
    text.includes("report")
  ) {
    return "You can file a road issue with location, severity, evidence, and road type. Opening the complaint page.";
  }

  if (
    text.includes("sensor") ||
    text.includes("vibration") ||
    text.includes("iot")
  ) {
    return "Sensor Intel shows vibration, road stress, anomaly alerts, and predicted road failures. Opening Sensor Intel.";
  }

  if (
    text.includes("risk") ||
    text.includes("danger") ||
    text.includes("accident")
  ) {
    return "The Risk Map highlights high-risk roads using complaints, sensor anomalies, failure history, and repair urgency.";
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return "Hello. I am your RoadIntel assistant. You can ask me to open dashboard, file complaint, show risk map, open sensors, or explain road data.";
  }

  if (
    text.includes("help") ||
    text.includes("what can you do")
  ) {
    return "I can navigate the website, answer RoadIntel demo questions, help you file complaints, explain road risk, open sensors, show spending, and read responses aloud.";
  }

  return "I understood your request. You can ask me things like open dashboard, file complaint, show risk map, open sensors, show public spending, or show contractors.";
}

export default function FloatingRoadIntelBot() {
  const [, navigate] = useLocation();

  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [input, setInput] = useState("");

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I am RoadIntel Assistant. Ask me to open dashboard, file complaint, show sensors, risk map, contractors, or public spending.",
      time: getTime(),
    },
  ]);

  const speechSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    const speechWindow = window as SpeechRecognitionType;
    return Boolean(
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition,
    );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!speechSupported) return;

    const speechWindow = window as SpeechRecognitionType;
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
        "Voice input could not start. Please check microphone permission.",
        false,
      );
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript.trim()) {
        handleUserMessage(transcript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore browser stop errors
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

    if (shouldSpeak) speak(text);
  }

  function handleUserMessage(rawText?: string) {
    const text = (rawText ?? input).trim();
    if (!text) return;

    setInput("");
    setOpen(true);

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
        }, 500);
      }
    }, 350);
  }

  function startVoice() {
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
      // ignore browser stop errors
    }
    setListening(false);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #2563eb, #14b8a6)",
            boxShadow: "0 20px 45px rgba(20, 184, 166, 0.35)",
          }}
          aria-label="Open RoadIntel Assistant"
        >
          <Bot className="w-8 h-8" />
        </button>
      )}

      {open && (
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
              background: "linear-gradient(135deg, #0f172a, #12335c)",
              borderBottom: "1px solid hsl(var(--border))",
            }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #2563eb, #14b8a6)",
              }}
            >
              <Bot className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <div className="font-bold text-white">RoadIntel Assistant</div>
              <div className="text-xs text-slate-300">
                Voice assisted website navigator
              </div>
            </div>

            <button
              onClick={() => setVoiceEnabled((current) => !current)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: voiceEnabled
                  ? "rgba(20,184,166,0.18)"
                  : "rgba(255,255,255,0.08)",
                color: voiceEnabled ? "#14b8a6" : "#cbd5e1",
              }}
              aria-label="Toggle voice output"
              title={voiceEnabled ? "Voice output on" : "Voice output off"}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white"
              style={{ background: "rgba(255,255,255,0.08)" }}
              aria-label="Minimize assistant"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white"
              style={{ background: "rgba(255,255,255,0.08)" }}
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className="px-4 py-3 flex gap-2 overflow-x-auto"
            style={{
              background: "hsl(var(--muted))",
              borderBottom: "1px solid hsl(var(--border))",
            }}
          >
            {QUICK_COMMANDS.map((command) => (
              <button
                key={command}
                onClick={() => handleUserMessage(command)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(20,184,166,0.12)",
                  color: "#14b8a6",
                  border: "1px solid rgba(20,184,166,0.24)",
                }}
              >
                {command}
              </button>
            ))}
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
                        ? "linear-gradient(135deg, #0ea5e9, #14b8a6)"
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
                <div
                  className="rounded-2xl rounded-bl-md px-4 py-3 text-sm"
                  style={{
                    background: "rgba(20,184,166,0.12)",
                    border: "1px solid rgba(20,184,166,0.24)",
                    color: "#14b8a6",
                  }}
                >
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
                    : "rgba(20,184,166,0.12)",
                  color: listening ? "#dc2626" : "#14b8a6",
                }}
                title="Voice input"
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
                placeholder="Ask or say: open sensors, show risk map..."
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
                  background: "linear-gradient(135deg, #2563eb, #14b8a6)",
                }}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground mt-2">
              <Navigation className="w-3 h-3" />
              Try: “open dashboard”, “file complaint”, “show sensors”
            </div>
          </div>
        </div>
      )}
    </>
  );
}
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
  Maximize2,
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

type RouteCommand = {
  keywords: string[];
  route: string;
  reply: string;
};

const ROUTE_COMMANDS: RouteCommand[] = [
  {
    keywords: ["dashboard", "home", "main page", "overview"],
    route: "/dashboard",
    reply:
      "Opening the Dashboard. Here you can see the overall RoadIntel status, road risk summary, complaints, spending, and live system indicators.",
  },
  {
    keywords: ["complaint", "complaints", "file complaint", "report pothole", "pothole", "road issue"],
    route: "/complaints",
    reply:
      "Opening File Complaint. You can submit a road issue with location, severity, issue type, and evidence.",
  },
  {
    keywords: ["scan", "ai scan", "quick scan", "road scan"],
    route: "/scan",
    reply:
      "Opening AI Scan. Use this section to scan road damage and classify issues like potholes, cracks, or surface damage.",
  },
  {
    keywords: ["road dna", "roads", "road details", "road profile"],
    route: "/roads",
    reply:
      "Opening Road DNA. This page shows road-level details such as condition, repair history, risk patterns, and maintenance records.",
  },
  {
    keywords: ["risk", "risk map", "danger map", "accident risk", "high risk"],
    route: "/risk-map",
    reply:
      "Opening Risk Map. This helps identify dangerous road segments using complaints, sensor anomalies, repair history, and failure urgency.",
  },
  {
    keywords: ["spending", "public spending", "budget", "money", "funds", "expense"],
    route: "/spending",
    reply:
      "Opening Public Spending. Here you can inspect road budgets, spending patterns, repair allocations, and possible irregularities.",
  },
  {
    keywords: ["sensor", "sensors", "sensor intel", "iot", "vibration", "road stress"],
    route: "/sensors",
    reply:
      "Opening Sensor Intel. This section shows live vibration data, road stress, anomaly alerts, and predicted road failures.",
  },
  {
    keywords: ["contractor", "contractors", "corruption", "corrupt", "vendor"],
    route: "/contractors",
    reply:
      "Opening Contractors. This page helps compare contractors using repeated failures, delays, repair quality, and risk indicators.",
  },
  {
    keywords: ["analytics", "analysis", "reports", "insights", "charts", "statistics"],
    route: "/analytics",
    reply:
      "Opening Analytics. This section shows deeper insights, charts, trends, and performance indicators across RoadIntel data.",
  },
  {
    keywords: ["profile", "settings", "account", "language", "theme"],
    route: "/settings",
    reply:
      "Opening Settings. Here you can manage your profile, theme, language, and account preferences.",
  },
  {
    keywords: ["sos", "emergency", "help emergency", "accident help"],
    route: "/sos",
    reply:
      "Opening Emergency SOS. Use this section only for urgent road safety or emergency support actions.",
  },
];

const QUICK_COMMANDS = [
  "Open dashboard",
  "Show risk map",
  "File complaint",
  "Open sensors",
  "Analytics",
];

const FALLBACK_REPLIES = [
  "I can help with RoadIntel navigation. Try saying dashboard, analytics, risk map, file complaint, sensors, contractors, or public spending.",
  "I did not find an exact page command, but I can still guide you. Ask me about road risk, budgets, complaints, sensors, contractors, or analytics.",
  "Please say a RoadIntel page name clearly. For example: open analytics, show sensors, file complaint, or open public spending.",
  "I understood your message, but I need a clearer command. You can ask me to open dashboard, analytics, risk map, sensors, contractors, or settings.",
];

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[-_]/g, " ").trim();
}

function findRouteCommand(text: string) {
  const lower = normalizeText(text);

  return ROUTE_COMMANDS.find((command) =>
    command.keywords.some((keyword) => lower.includes(normalizeText(keyword))),
  );
}

function getSmartReply(input: string) {
  const text = normalizeText(input);

  const routeCommand = findRouteCommand(text);
  if (routeCommand) return routeCommand.reply;

  if (text.includes("mg road") && (text.includes("spent") || text.includes("money") || text.includes("budget"))) {
    return "MG Road has an estimated RoadIntel demo allocation of 8.4 crore rupees. For detailed budget records, open Public Spending.";
  }

  if (text.includes("nh 48") || text.includes("nh48")) {
    return "NH 48 is tracked as a high-priority highway segment. You can check its risk level in Risk Map, Road DNA, or Public Spending.";
  }

  if (text.includes("who are you") || text.includes("what are you")) {
    return "I am the RoadIntel voice assistant. I can navigate the website, explain road safety data, open pages, and help with complaints or analytics.";
  }

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hello. I am ready to help. You can say open dashboard, show analytics, file complaint, open sensors, or show risk map.";
  }

  if (text.includes("help") || text.includes("what can you do")) {
    return "I can open pages, answer RoadIntel questions, explain budgets, show road risk, help file complaints, and guide you through sensor and contractor data.";
  }

  if (text.includes("language")) {
    return "You can change the website language from Settings. RoadIntel supports English, Hindi, and Marathi if configured in your settings page.";
  }

  if (text.includes("dark") || text.includes("theme")) {
    return "Theme settings are available in the Settings page. You can switch between dark and light modes there.";
  }

  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

function getFemaleVoice() {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();

  const preferredFemaleVoices = [
    "Microsoft Neerja",
    "Microsoft Heera",
    "Microsoft Zira",
    "Google UK English Female",
    "Google US English",
    "Samantha",
    "Karen",
    "Moira",
    "Tessa",
    "Veena",
    "Rishi",
  ];

  for (const preferred of preferredFemaleVoices) {
    const voice = voices.find((v) =>
      v.name.toLowerCase().includes(preferred.toLowerCase()),
    );
    if (voice) return voice;
  }

  const indianEnglish = voices.find((v) => v.lang.toLowerCase() === "en-in");
  if (indianEnglish) return indianEnglish;

  const englishFemaleLike = voices.find((v) => {
    const name = v.name.toLowerCase();
    return (
      v.lang.toLowerCase().startsWith("en") &&
      (name.includes("female") ||
        name.includes("woman") ||
        name.includes("zira") ||
        name.includes("samantha") ||
        name.includes("karen"))
    );
  });

  if (englishFemaleLike) return englishFemaleLike;

  return voices.find((v) => v.lang.toLowerCase().startsWith("en")) ?? null;
}

function speakFemale(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getFemaleVoice();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-IN";
  }

  utterance.rate = 0.9;
  utterance.pitch = 1.22;
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
      text: "Hi, I am your RoadIntel voice assistant. Say dashboard, analytics, AI scan, profile, risk map, sensors, or file complaint.",
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
      window.speechSynthesis.getVoices();
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
        // ignore
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

    const routeCommand = findRouteCommand(text);
    const reply = getSmartReply(text);

    window.setTimeout(() => {
      addAssistantMessage(reply);

      if (routeCommand) {
        window.setTimeout(() => {
          navigate(routeCommand.route);
        }, 700);
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
      // ignore
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
              background: "linear-gradient(135deg, #12335c, #10213f)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb, #14b8a6)",
              }}
            >
              <Bot className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="font-bold text-white text-lg">RoadIntel Assistant</div>
              <div className="text-sm text-white/75">
                Voice assisted website navigator
              </div>
            </div>

            <button
              onClick={() => setVoiceEnabled((current) => !current)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white"
              aria-label="Toggle voice"
            >
              {voiceEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setChatOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white"
              aria-label="Minimize chat"
            >
              <Maximize2 className="w-5 h-5 rotate-180" />
            </button>

            <button
              onClick={() => {
                stopVoice();
                setChatOpen(false);
                setOpen(false);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="px-3 py-3 flex gap-2 overflow-x-auto"
            style={{
              background: "hsl(var(--muted))",
              borderBottom: "1px solid hsl(var(--border))",
            }}
          >
            {QUICK_COMMANDS.map((command) => (
              <button
                key={command}
                onClick={() => handleUserMessage(command)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold"
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
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
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
                placeholder="Ask or say: open sensors, show analytics..."
                className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />

              <button
                onClick={() => handleUserMessage()}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
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
              Try: “open dashboard”, “analytics”, “file complaint”, “show sensors”
            </div>
          </div>
        </div>
      )}
    </>
  );
}
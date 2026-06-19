import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
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
  MessageCircle,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Route,
  Wallet,
  Radio,
  FileText,
  ScanLine,
  TrendingDown,
  Users,
  BarChart3,
  Settings,
  Siren,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  intent?: string;
};

type RouteCommand = {
  label: string;
  route: string;
  icon: LucideIcon;
  keywords: string[];
  reply: string;
};

type SpeechRecognitionWindow = typeof window & {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
};

type RoadRecord = {
  name: string;
  city: string;
  health: number;
  risk: number;
  level: "critical" | "high" | "medium" | "low";
  failureWindow: string;
  action: string;
};

type ContractorRecord = {
  name: string;
  ras: number;
  quality: number;
  issue: string;
};

const ROUTE_COMMANDS: RouteCommand[] = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: ShieldCheck,
    keywords: ["dashboard", "home", "main page", "overview", "summary"],
    reply:
      "Opening Dashboard. It gives a clean overview of complaints, road health, risk, spending, and pilot activity.",
  },
  {
    label: "File Complaint",
    route: "/complaints",
    icon: FileText,
    keywords: [
      "complaint",
      "complaints",
      "file complaint",
      "report pothole",
      "report issue",
      "road issue",
      "citizen complaint",
    ],
    reply:
      "Opening File Complaint. You can submit a road issue and RoadIntel will route it to the correct authority.",
  },
  {
    label: "Quick Scan",
    route: "/scan",
    icon: ScanLine,
    keywords: ["scan", "quick scan", "road scan", "image scan", "pothole scan"],
    reply:
      "Opening Quick Scan. You can upload or select a road image to classify potholes, cracks, and surface damage.",
  },
  {
    label: "Road DNA",
    route: "/roads",
    icon: Route,
    keywords: ["road dna", "roads", "road profile", "road details", "road history"],
    reply:
      "Opening Road DNA. This shows road-level condition, repair history, risk signals, and maintenance context.",
  },
  {
    label: "Risk Map",
    route: "/risk-map",
    icon: TrendingDown,
    keywords: [
      "risk",
      "risk map",
      "danger map",
      "failure map",
      "high risk",
      "future risk",
      "predict failure",
    ],
    reply:
      "Opening Risk Map. This shows predicted road failure zones and priority actions for Pune / PCMC pilot roads.",
  },
  {
    label: "Public Spending",
    route: "/spending",
    icon: Wallet,
    keywords: [
      "spending",
      "public spending",
      "budget",
      "money",
      "funds",
      "corruption",
      "flag",
      "audit",
    ],
    reply:
      "Opening Public Spending. This helps compare road budget, spending, contractor quality, and repeat-repair flags.",
  },
  {
    label: "Sensor Intel",
    route: "/sensors",
    icon: Radio,
    keywords: [
      "sensor",
      "sensors",
      "sensor intel",
      "vibration",
      "iot",
      "roughness",
      "digital twin",
    ],
    reply:
      "Opening Sensor Intel. This page shows simulated sensor signals, vibration trends, and predicted road stress.",
  },
  {
    label: "Contractors",
    route: "/contractors",
    icon: Users,
    keywords: ["contractor", "contractors", "vendor", "ras", "accountability"],
    reply:
      "Opening Contractors. This page compares contractors using Road Accountability Score, quality, budget discipline, and repeat failures.",
  },
  {
    label: "Analytics",
    route: "/analytics",
    icon: BarChart3,
    keywords: ["analytics", "analysis", "charts", "statistics", "reports", "insights"],
    reply:
      "Opening Analytics. This shows realistic pilot-stage trends for complaints, road health, contractors, and city-wise issues.",
  },
  {
    label: "Settings",
    route: "/settings",
    icon: Settings,
    keywords: ["settings", "profile", "account", "theme", "dark mode", "light mode"],
    reply:
      "Opening Settings. You can manage profile actions, appearance, and account options.",
  },
  {
    label: "Emergency SOS",
    route: "/sos",
    icon: Siren,
    keywords: ["sos", "emergency", "accident", "urgent help", "road emergency"],
    reply:
      "Opening Emergency SOS. Use this only for urgent road safety or emergency support workflows.",
  },
];

const PILOT_ROADS: RoadRecord[] = [
  {
    name: "JM Road Patch Zone",
    city: "Pune",
    health: 42,
    risk: 86,
    level: "critical",
    failureWindow: "3-5 days",
    action: "Emergency patching and contractor inspection.",
  },
  {
    name: "FC Road Junction",
    city: "Pune",
    health: 56,
    risk: 74,
    level: "high",
    failureWindow: "1-2 weeks",
    action: "Drainage check and crack sealing.",
  },
  {
    name: "Wakad-Hinjewadi Road",
    city: "PCMC",
    health: 61,
    risk: 68,
    level: "high",
    failureWindow: "2-3 weeks",
    action: "Resurfacing inspection and vibration monitoring.",
  },
  {
    name: "Baner Link Road",
    city: "Pune",
    health: 72,
    risk: 49,
    level: "medium",
    failureWindow: "1-2 months",
    action: "Preventive maintenance before monsoon escalation.",
  },
];

const CONTRACTORS: ContractorRecord[] = [
  {
    name: "Shivneri Infra Works",
    ras: 91,
    quality: 92,
    issue: "Strong performer with low repeat-failure pattern.",
  },
  {
    name: "UrbanBuild Pune Services",
    ras: 58,
    quality: 58,
    issue: "Audit risk due to repeated patch failures and budget-quality mismatch.",
  },
  {
    name: "QuickPatch Civil Works",
    ras: 52,
    quality: 49,
    issue: "High repeat-failure rate; should be reviewed before new work allocation.",
  },
];

const QUICK_PROMPTS = [
  "Which road is highest risk?",
  "Explain Road Accountability Score",
  "How are complaints routed?",
  "Open risk map",
  "Show public spending",
  "What can you do?",
];

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createMessage(role: Message["role"], text: string, intent?: string): Message {
  return {
    id: `${role}-${Date.now()}-${text.slice(0, 8)}`,
    role,
    text,
    time: nowTime(),
    intent,
  };
}

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[-_]/g, " ").trim();
}

function findRouteCommand(text: string) {
  const normalized = normalizeText(text);

  return ROUTE_COMMANDS.find((command) =>
    command.keywords.some((keyword) => normalized.includes(normalizeText(keyword))),
  );
}

function findRoad(text: string) {
  const normalized = normalizeText(text);

  return PILOT_ROADS.find((road) => {
    const name = normalizeText(road.name);
    return (
      normalized.includes(name) ||
      name.split(" ").some((part) => part.length > 4 && normalized.includes(part))
    );
  });
}

function findContractor(text: string) {
  const normalized = normalizeText(text);

  return CONTRACTORS.find((contractor) => {
    const name = normalizeText(contractor.name);
    return (
      normalized.includes(name) ||
      name.split(" ").some((part) => part.length > 5 && normalized.includes(part))
    );
  });
}

function getDecisionReply(input: string) {
  const text = normalizeText(input);
  const routeCommand = findRouteCommand(text);
  const road = findRoad(text);
  const contractor = findContractor(text);

  if (routeCommand && (text.startsWith("open") || text.startsWith("show") || text.includes("go to"))) {
    return {
      text: routeCommand.reply,
      intent: "navigation",
      route: routeCommand.route,
    };
  }

  if (road) {
    return {
      text: `${road.name} is currently ${road.level.toUpperCase()} risk. Health score: ${road.health}/100. Failure risk: ${road.risk}/100. Predicted failure window: ${road.failureWindow}. Recommended action: ${road.action}`,
      intent: "road_detail",
    };
  }

  if (contractor) {
    return {
      text: `${contractor.name} has a Road Accountability Score of ${contractor.ras}/100 and quality score of ${contractor.quality}/100. Assessment: ${contractor.issue}`,
      intent: "contractor_detail",
    };
  }

  if (
    text.includes("highest risk") ||
    text.includes("top risk") ||
    text.includes("danger") ||
    text.includes("failure") ||
    text.includes("critical")
  ) {
    const top = [...PILOT_ROADS].sort((a, b) => b.risk - a.risk).slice(0, 3);

    return {
      text: `Top predicted failure risks are: 1) ${top[0].name} â€” ${top[0].risk}/100, ${top[0].failureWindow}; 2) ${top[1].name} â€” ${top[1].risk}/100, ${top[1].failureWindow}; 3) ${top[2].name} â€” ${top[2].risk}/100, ${top[2].failureWindow}. The first action should be field inspection and contractor verification.`,
      intent: "risk_summary",
    };
  }

  if (
    text.includes("health") ||
    text.includes("condition") ||
    text.includes("score")
  ) {
    const avgHealth = Math.round(
      PILOT_ROADS.reduce((sum, item) => sum + item.health, 0) / PILOT_ROADS.length,
    );

    return {
      text: `The pilot network average health score is ${avgHealth}/100 across Pune and PCMC sample roads. RoadIntel combines complaint density, simulated vibration, repair history, and contractor quality to explain the score.`,
      intent: "health_summary",
    };
  }

  if (
    text.includes("complaint") ||
    text.includes("route") ||
    text.includes("authority") ||
    text.includes("pmc") ||
    text.includes("pcmc") ||
    text.includes("pwd") ||
    text.includes("nhai")
  ) {
    return {
      text:
        "Complaint routing works by road ownership and severity. PMC handles Pune urban roads, PCMC handles Pimpri-Chinchwad roads, PWD handles state roads, and NHAI/MSRDC handles highway corridors. Critical cases get a 24-hour SLA, high severity gets around 48 hours, and medium cases are planned for 5-7 days.",
      intent: "complaint_routing",
    };
  }

  if (
    text.includes("spending") ||
    text.includes("budget") ||
    text.includes("money") ||
    text.includes("corruption") ||
    text.includes("audit")
  ) {
    return {
      text:
        "The spending layer compares approved budget, actual spend, road quality, and repeat repairs. A contractor is flagged when high spending is combined with poor road health or repeated repair failures. This is useful for transparent civic audit, not just dashboard reporting.",
      intent: "spending_audit",
    };
  }

  if (
    text.includes("sensor") ||
    text.includes("vibration") ||
    text.includes("roughness") ||
    text.includes("digital twin")
  ) {
    return {
      text:
        "Sensor Intel is presented as a simulated digital twin. It uses vibration, roughness, shock spikes, traffic load, and rainfall stress to estimate road deterioration. This avoids fake live-data claims while still showing a realistic engineering workflow.",
      intent: "sensor_summary",
    };
  }

  if (
    text.includes("contractor") ||
    text.includes("ras") ||
    text.includes("accountability")
  ) {
    return {
      text:
        "RAS means Road Accountability Score. It combines quality score, budget discipline, repeat-failure control, and timeliness. A low RAS means the contractor should be reviewed before receiving new road work.",
      intent: "contractor_ras",
    };
  }

  if (
    text.includes("what can you do") ||
    text.includes("help") ||
    text.includes("guide") ||
    text.includes("commands")
  ) {
    return {
      text:
        "I can help you navigate RoadIntel and explain the project. Try: open risk map, file complaint, show public spending, which road is highest risk, explain RAS, how are complaints routed, or what does Sensor Intel do?",
      intent: "help",
    };
  }

  if (routeCommand) {
    return {
      text: routeCommand.reply,
      intent: "navigation",
      route: routeCommand.route,
    };
  }

  return {
    text:
      "I can help with RoadIntelâ€™s Pune / PCMC pilot: road risk, complaint routing, public spending, contractor accountability, quick scan, sensors, and analytics. Try asking: â€œWhich road is highest risk?â€ or â€œExplain RAS.â€",
    intent: "fallback",
  };
}

function supportsSpeechRecognition() {
  if (typeof window === "undefined") return false;

  const speechWindow = window as SpeechRecognitionWindow;
  return Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition);
}

export default function FloatingRoadIntelBot() {
  const [, navigate] = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    createMessage(
      "assistant",
      "Hi, Iâ€™m RoadIntel Assistant. I can help you navigate the website and explain risk, complaints, sensors, spending, and contractor accountability.",
      "welcome",
    ),
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const speechAvailable = useMemo(() => supportsSpeechRecognition(), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, isOpen]);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  function stopSpeaking() {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
  }

  function speak(text: string) {
    if (!voiceEnabled || typeof window === "undefined") return;

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis?.getVoices?.() ?? [];
    const preferredVoice =
      voices.find((voice) => /female|zira|samantha|google uk english female/i.test(voice.name)) ??
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ??
      null;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis?.speak(utterance);
  }

  function stopListening() {
    try {
      recognitionRef.current?.stop?.();
      recognitionRef.current?.abort?.();
    } catch {
      // Browser recognition cleanup can throw if already stopped.
    }

    recognitionRef.current = null;
    setListening(false);
  }

  function closeBot() {
    stopListening();
    stopSpeaking();
    setIsOpen(false);
    setExpanded(false);
  }

  function toggleVoice() {
    setVoiceEnabled((current) => {
      if (current) stopSpeaking();
      return !current;
    });
  }

  function startListening() {
    if (!speechAvailable || typeof window === "undefined") {
      const reply =
        "Voice input is not supported in this browser. You can still type your question here.";
      setMessages((current) => [...current, createMessage("assistant", reply, "voice_unsupported")]);
      return;
    }

    stopSpeaking();

    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onerror = () => {
      setListening(false);
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "I could not hear clearly. Please try again or type your command.",
          "voice_error",
        ),
      ]);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = String(event.results?.[0]?.[0]?.transcript ?? "").trim();

      if (transcript) {
        void handleSend(transcript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  async function handleSend(forcedText?: string) {
    const text = (forcedText ?? input).trim();
    if (!text) return;

    setInput("");
    stopSpeaking();

    const userMessage = createMessage("user", text);
    setMessages((current) => [...current, userMessage]);
    setTyping(true);

    await new Promise((resolve) => window.setTimeout(resolve, 450));

    const decision = getDecisionReply(text);
    const assistantMessage = createMessage("assistant", decision.text, decision.intent);

    setMessages((current) => [...current, assistantMessage]);
    setTyping(false);

    if (decision.route) {
      navigate(decision.route);
    }

    speak(decision.text);
  }

  function handleQuickPrompt(prompt: string) {
    void handleSend(prompt);
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 transition hover:scale-105"
          aria-label="Open RoadIntel assistant"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {isOpen && (
        <section
          className={`fixed z-50 overflow-hidden border border-white/10 bg-[#07111F]/96 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl transition-all ${
            expanded
              ? "inset-3 rounded-3xl sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[720px] sm:w-[520px]"
              : "bottom-4 right-4 h-[620px] w-[calc(100vw-2rem)] rounded-3xl sm:w-[420px]"
          }`}
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h2
                  className="font-bold"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  RoadIntel Assistant
                </h2>

                <p className="text-xs text-slate-400">
                  Rule-based decision helper Â· demo-safe
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleVoice}
                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label={voiceEnabled ? "Mute voice" : "Enable voice"}
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Toggle assistant size"
              >
                {expanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={closeBot}
                className="rounded-xl p-2 text-slate-300 transition hover:bg-red-500/20 hover:text-red-300"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex h-[calc(100%-72px)] flex-col">
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white/[0.07] text-slate-100"
                    }`}
                  >
                    <p>{message.text}</p>

                    <div
                      className={`mt-2 text-[10px] ${
                        message.role === "user"
                          ? "text-blue-100/80"
                          : "text-slate-500"
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
                    <Bot className="h-4 w-4" />
                  </div>

                  <div className="rounded-2xl bg-white/[0.07] px-4 py-3 text-sm text-slate-300">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Ask about risk, complaints, spending, sensors, contractors, or navigation.
                </span>

                <span>{speechAvailable ? "Voice ready" : "Text only"}</span>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                    listening
                      ? "bg-red-500/20 text-red-300"
                      : "bg-white/[0.07] text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-label={listening ? "Stop listening" : "Start voice input"}
                >
                  {listening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>

                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="Ask RoadIntel..."
                  rows={1}
                  className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />

                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={!input.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              {listening && (
                <div className="mt-2 flex items-center gap-2 text-xs text-cyan-300">
                  <Navigation className="h-3.5 w-3.5 animate-pulse" />
                  Listening... say â€œopen risk mapâ€ or ask a question.
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { Check, Globe2 } from "lucide-react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

type LanguageCode = "en" | "hi";

const LANGUAGES: Array<{ code: LanguageCode; label: string; nativeLabel: string }> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

function setTranslateCookie(language: LanguageCode) {
  if (typeof document === "undefined") return;

  const value = language === "en" ? "/en/en" : `/en/${language}`;
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");
  const rootDomain = domainParts.length > 1 ? `.${domainParts.slice(-2).join(".")}` : hostname;

  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};domain=${hostname};path=/`;
  document.cookie = `googtrans=${value};domain=${rootDomain};path=/`;
}

function applyGoogleLanguage(language: LanguageCode) {
  setTranslateCookie(language);

  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) return false;

  select.value = language;
  select.dispatchEvent(new Event("change"));
  return true;
}

export default function GoogleTranslateToggle() {
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("roadintel-language") as LanguageCode) || "en";
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi",
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element",
      );
    };

    if (!document.getElementById("roadintel-google-translate-script")) {
      const script = document.createElement("script");
      script.id = "roadintel-google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInit?.();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("roadintel-language", activeLanguage);

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const applied = applyGoogleLanguage(activeLanguage);

      if (applied || attempts > 20) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [activeLanguage]);

  function chooseLanguage(language: LanguageCode) {
    setActiveLanguage(language);
    setIsOpen(false);
  }

  const active = LANGUAGES.find((language) => language.code === activeLanguage) ?? LANGUAGES[0];

  return (
    <>
      <div id="google_translate_element" aria-hidden="true" />

      <div className="fixed bottom-5 left-5 z-[80] text-sm print:hidden">
        <div className="relative">
          {isOpen && (
            <div
              className="absolute bottom-14 left-0 w-44 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
              style={{
                background: "rgba(15,23,42,0.98)",
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => chooseLanguage(language.code)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-slate-200 transition hover:bg-white/10"
                >
                  <span>
                    <span className="block font-semibold">{language.label}</span>
                    <span className="block text-xs text-slate-400">{language.nativeLabel}</span>
                  </span>

                  {activeLanguage === language.code && <Check className="h-4 w-4 text-cyan-300" />}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex items-center gap-2 rounded-2xl border px-4 py-3 font-bold text-white shadow-2xl transition hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.95), rgba(14,165,233,0.95))",
              borderColor: "rgba(255,255,255,0.14)",
            }}
            aria-label="Change website language"
          >
            <Globe2 className="h-4 w-4" />
            {active.nativeLabel}
          </button>
        </div>
      </div>
    </>
  );
}
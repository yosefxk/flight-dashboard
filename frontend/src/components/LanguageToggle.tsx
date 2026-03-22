"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50" style={{ direction: "ltr" }}>
      <button
        onClick={() => setLang(lang === "he" ? "en" : "he")}
        className="glass-panel rounded-lg px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
        title={lang === "he" ? "Switch to English" : "עבור לעברית"}
      >
        {lang === "he" ? "🇺🇸 EN" : "🇮🇱 עב"}
      </button>
    </div>
  );
}

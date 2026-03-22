"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function LanguageToggle() {
  const { lang } = useI18n();
  const targetLang = lang === "he" ? "en" : "he";
  const label = lang === "he" ? "🇺🇸 EN" : "🇮🇱 עב";
  const title = lang === "he" ? "Switch to English" : "עבור לעברית";

  return (
    <div className="fixed top-4 right-4 z-50" style={{ direction: "ltr" }}>
      <Link
        href={`/${targetLang}`}
        className="glass-panel rounded-lg px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all inline-block"
        title={title}
      >
        {label}
      </Link>
    </div>
  );
}

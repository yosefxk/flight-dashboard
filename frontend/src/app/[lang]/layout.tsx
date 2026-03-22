"use client";

import { I18nProvider, isValidLang, type Lang } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import { useParams } from "next/navigation";

export default function LangLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const lang: Lang = isValidLang(params.lang as string) ? (params.lang as Lang) : "en";

  return (
    <I18nProvider lang={lang}>
      <LanguageToggle />
      {children}
    </I18nProvider>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

const siteTitle = process.env.NEXT_PUBLIC_APP_TITLE || "Flight Dashboard";

export const metadata: Metadata = {
  title: siteTitle,
  description: "Real-time Ben Gurion Airport flight tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he">
      <body className="antialiased">
        <I18nProvider>
          <LanguageToggle />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

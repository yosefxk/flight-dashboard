import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

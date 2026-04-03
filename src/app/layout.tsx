import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";

import "./globals.css";

const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manara Network — Achat groupé corporate",
  description:
    "Portail d'achat groupé pour les salariés : offres exclusives, volumes cibles, prix négociés.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] font-[family-name:var(--font-body)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teamulate | A Full Marketing Department Without Building One",
  description:
    "Teamulate operates a managed AI marketing department inside the tools your B2B company already uses — with specialized workflows, visible approvals and human oversight.",
  // The rebuild is not live. Nothing in this repository may be indexed until
  // Chris approves canonical routes and a release (Implementation Brief §10).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1631",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

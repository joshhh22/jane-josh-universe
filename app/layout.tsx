import type { Metadata } from "next";
import { Inter, Syne, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { BgmPlayer } from "@/components/ui/BgmPlayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jane × Josh — Our Little Universe",
  description:
    "a tiny corner of the internet that belongs to jane & josh. welcome, we're happy you found it.",
  openGraph: {
    title: "Jane × Josh ✨",
    description: "our little digital universe",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${caveat.variable}`}>
      <body className="font-body bg-[#F8F3EA] text-[#171717] min-h-screen antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
            <CursorTrail />
            <BgmPlayer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

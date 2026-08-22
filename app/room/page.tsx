"use client";

export const dynamic = "force-dynamic";

import { Suspense, lazy } from "react";
import { NavBar } from "@/components/layout/NavBar";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight } from "lucide-react";

const OurRoom3D = lazy(() => import("@/components/3d/OurRoom"));

export default function RoomPage() {
  const objects = [
    { emoji: "🧸", label: "Teddy Bear", desc: "Jane Lore & stats", href: "/jane", bg: "#FFCCD5" },
    { emoji: "💌", label: "Love Letter", desc: "Mailbox archive", href: "/letters", bg: "#FEF08A" },
    { emoji: "🎧", label: "Headphones", desc: "Shared playlist", href: "/music", bg: "#D8D2FF" },
    { emoji: "📸", label: "Polaroid Camera", desc: "Memory photos", href: "/memories", bg: "#BAE6FD" },
    { emoji: "🌱", label: "Plant Pot", desc: "Surprise gift box", href: "/surprises", bg: "#BBF7D0" },
    { emoji: "🖥️", label: "Retro Computer", desc: "Secret love letter", href: "/secret", bg: "#FFAAA6" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCCD5] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Compass size={12} />
                <span>Interactive 3D Space</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                our little room ✨
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                click and interact with objects inside our shared bedroom
              </p>
            </div>

            <div className="bg-[#FFFDF9] border-2 border-[#2C2824] px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold text-[#7A7269]">
              💡 drag to orbit &bull; click items to navigate
            </div>
          </div>

          {/* 3D Canvas Box */}
          <div className="neu-box h-[480px] sm:h-[540px] bg-[#F5EBE0] border-[2.5px] border-[#2C2824] overflow-hidden relative shadow-[6px_6px_0px_#2C2824]">
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#FAF5EE]">
                  <span className="text-5xl animate-bounce">🏠</span>
                  <p className="font-hand text-2xl text-[#7A7269]">loading 3D furniture &amp; room...</p>
                </div>
              }
            >
              <OurRoom3D interactive={true} />
            </Suspense>
          </div>

          {/* Clickable Legend Grid */}
          <div className="space-y-3 pt-2">
            <h2 className="font-display font-black text-lg text-[#2C2824] flex items-center gap-2">
              <span>✨</span>
              <span>interactive objects in this room</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {objects.map((obj) => (
                <Link
                  key={obj.label}
                  href={obj.href}
                  className="neu-box p-3.5 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#2C2824] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-[#2C2824] flex items-center justify-center text-xl shadow-[2px_2px_0px_#2C2824] mb-2 group-hover:rotate-6 transition-transform"
                      style={{ backgroundColor: obj.bg }}
                    >
                      {obj.emoji}
                    </div>
                    <p className="font-display font-bold text-xs text-[#2C2824]">{obj.label}</p>
                    <p className="font-body text-[10px] text-[#7A7269] mt-0.5">{obj.desc}</p>
                  </div>

                  <div className="flex justify-end pt-2 text-[#7A7269] group-hover:text-[#2C2824]">
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Heart, Sparkles, ArrowLeft } from "lucide-react";

const LINES = [
  "> initializing secret room connection...",
  "> loading shared memory banks...",
  "> decrypting feelings...",
  "> verifying heart signatures...",
  "> connection established: 100% matched.",
  "",
  "hi jane. 🌸",
  "",
  "you found the secret room.",
  "i built this entire digital universe for you.",
  "every card, every pixel, every line of code.",
  "even the little teddy bear in the 3D room.",
  "(especially the teddy bear.)",
  "",
  "thank you for being my favorite person in the entire world.",
  "you make everything brighter, warmer, and so much happier.",
  "",
  "— josh 💗",
];

export default function SecretPage() {
  const [shown, setShown] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < LINES.length) {
        setShown((prev) => [...prev, LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 160);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1B18] text-[#FEF08A] p-4 sm:p-8 flex flex-col items-center justify-center font-mono selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#2C2824] border-[2.5px] border-[#FEF08A] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#FEF08A] space-y-6"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#FEF08A]/30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFAAA6] border border-[#FEF08A]" />
            <div className="w-3 h-3 rounded-full bg-[#FEF08A] border border-[#FEF08A]" />
            <div className="w-3 h-3 rounded-full bg-[#BBF7D0] border border-[#FEF08A]" />
          </div>
          <span className="text-xs text-[#FEF08A]/70 font-display font-bold">
            secret_universe.exe
          </span>
        </div>

        {/* Text Feed */}
        <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed min-h-[300px]">
          {shown.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                line.startsWith(">")
                  ? "text-[#BAE6FD]/80"
                  : line === ""
                  ? "h-2"
                  : line.startsWith("—")
                  ? "text-[#FFCCD5] font-bold text-base mt-3"
                  : line.includes("jane")
                  ? "text-[#FFCCD5] font-bold"
                  : "text-[#FAF5EE]"
              }
            >
              {line}
              {idx === shown.length - 1 && !done && (
                <span className="inline-block w-2 h-4 ml-1 bg-[#FEF08A] animate-pulse" />
              )}
            </motion.p>
          ))}
        </div>

        {/* Footer Actions */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-[#FEF08A]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-1.5 text-[#FFCCD5]">
              <Sparkles size={14} />
              <span>secret #1 / 7 discovered</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FEF08A] text-[#2C2824] font-display font-bold hover:scale-105 transition-transform"
            >
              <ArrowLeft size={13} />
              <span>return home</span>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

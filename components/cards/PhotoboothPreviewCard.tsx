"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ArrowRight, Sparkles, Heart } from "lucide-react";

export function PhotoboothPreviewCard() {
  return (
    <Link href="/photobooth" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-4 bg-[#FFE4E6] flex flex-col justify-between group overflow-hidden relative">
        {/* Decorative corner sparkles */}
        <div className="absolute top-2 right-2 opacity-70 group-hover:rotate-12 transition-transform">
          <Sparkles size={18} className="text-[#9F1239]" />
        </div>

        {/* Top Header Badge */}
        <div className="flex items-center justify-between">
          <div className="bg-[#FAF5EE] border border-[#23201D]/20 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold text-[#23201D] flex items-center gap-1.5">
            <span>🎞️</span>
            <span>JJ 4-Cuts Photobox</span>
          </div>

          <span className="text-[10px] font-display font-bold text-[#9F1239] bg-white/70 px-2 py-0.5 rounded-full border border-[#9F1239]/20">
            10 Cute Frames ✨
          </span>
        </div>

        {/* Center Preview Content: Mini Photostrips graphic */}
        <div className="my-auto py-2 flex items-center justify-center gap-3">
          {/* Mini Strip 1 */}
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            className="w-14 bg-white border-2 border-[#2C2824] rounded-lg shadow-[2px_2px_0px_#2C2824] p-1 space-y-1 -rotate-3"
          >
            <div className="w-full aspect-[4/3] rounded bg-[#FFCCD5] flex items-center justify-center text-xs">
              🌸
            </div>
            <div className="w-full aspect-[4/3] rounded bg-[#BAE6FD] flex items-center justify-center text-xs">
              💻
            </div>
            <div className="w-full aspect-[4/3] rounded bg-[#FEF08A] flex items-center justify-center text-xs">
              ✨
            </div>
            <div className="text-[6px] font-display font-bold text-center text-[#2C2824]">
              JJ 4-CUTS
            </div>
          </motion.div>

          {/* Mini Strip 2 */}
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            className="w-14 bg-[#18181B] border-2 border-[#2C2824] rounded-lg shadow-[2px_2px_0px_#2C2824] p-1 space-y-1 rotate-3"
          >
            <div className="w-full aspect-[4/3] rounded bg-[#27272A] flex items-center justify-center text-xs text-rose-400">
              ♡
            </div>
            <div className="w-full aspect-[4/3] rounded bg-[#27272A] flex items-center justify-center text-xs text-amber-300">
              ★
            </div>
            <div className="w-full aspect-[4/3] rounded bg-[#27272A] flex items-center justify-center text-xs text-cyan-300">
              🐱
            </div>
            <div className="text-[6px] font-mono font-bold text-center text-[#FEF08A]">
              KODAK 400
            </div>
          </motion.div>

          {/* Descriptive text */}
          <div className="min-w-0 pl-1">
            <h3 className="font-display font-black text-sm sm:text-base text-[#2C2824] leading-tight">
              our photobooth 📸
            </h3>
            <p className="font-hand text-sm text-[#7A7269] mt-0.5 leading-snug">
              strike 4 poses &amp; print our cute strip ♡
            </p>
          </div>
        </div>

        {/* Bottom Footer Action */}
        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span className="flex items-center gap-1">
            <Camera size={13} className="text-[#9F1239]" />
            <span>take a photostrip</span>
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

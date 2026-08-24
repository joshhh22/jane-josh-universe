"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { calculateLoveStats, getAnniversaryDate } from "@/lib/anniversaryStorage";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

export function AnniversaryPreviewCard() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startDate = useMemo(() => getAnniversaryDate(2026), []);
  const stats = useMemo(() => calculateLoveStats(startDate, now), [startDate, now]);

  return (
    <Link href="/journey" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-4 sm:p-5 bg-gradient-to-br from-[#FFCCD5] via-[#FFE4E6] to-[#FAF5EE] flex flex-col justify-between group overflow-hidden relative border-[2.5px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] rounded-2xl">
        {/* Top Badge */}
        <div className="flex items-center justify-between">
          <div className="bg-[#FFFDF9] border border-[#2C2824] px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold text-[#2C2824] flex items-center gap-1.5 shadow-sm">
            <Heart size={12} className="fill-rose-500 text-rose-500 animate-pulse" />
            <span>Official Since 28 Mei 2026</span>
          </div>

          <div className="flex items-center gap-1 bg-[#FFFDF9]/80 px-2 py-0.5 rounded-full border border-[#2C2824]/20 text-[10px] font-display font-bold text-[#2C2824]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Counter</span>
          </div>
        </div>

        {/* Center Live Ticker */}
        <div className="my-auto py-2 space-y-2">
          <div className="text-center">
            <p className="font-display font-black text-4xl sm:text-5xl text-[#2C2824] tracking-tight">
              {stats.days} <span className="text-xl sm:text-2xl font-normal text-[#7A7269]">days</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-display font-bold text-[#2C2824] mt-1">
              <span className="bg-[#FFFDF9] px-2 py-0.5 rounded-md border border-[#2C2824]/20">
                {String(stats.hours).padStart(2, "0")}h
              </span>
              <span>:</span>
              <span className="bg-[#FFFDF9] px-2 py-0.5 rounded-md border border-[#2C2824]/20">
                {String(stats.minutes).padStart(2, "0")}m
              </span>
              <span>:</span>
              <span className="bg-[#FFFDF9] px-2 py-0.5 rounded-md border border-[#2C2824]/20 text-rose-600">
                {String(stats.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>

          <p className="font-hand text-center text-base sm:text-lg text-[#2C2824] leading-snug">
            &ldquo;every second with Jane is my favorite eternity ♡&rdquo;
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#2C2824]/15 flex items-center justify-between text-xs font-display font-bold text-[#2C2824]">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" />
            <span>view love chronicle</span>
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

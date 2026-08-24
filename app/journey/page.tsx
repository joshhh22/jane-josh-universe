"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import confetti from "canvas-confetti";
import {
  calculateLoveStats,
  getAnniversaryDate,
  MILESTONES,
  LOVE_REASONS,
} from "@/lib/anniversaryStorage";
import {
  Heart,
  Sparkles,
  Clock,
  PartyPopper,
  Smile,
  Zap,
} from "lucide-react";

export default function JourneyPage() {
  const [now, setNow] = useState<Date>(new Date());
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);
  const [isCelebrated, setIsCelebrated] = useState(false);

  // Live Continuous Ticking Engine (every 30ms for smooth millisecond & heartbeat experience)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Fixed strictly to 28 Mei 2026
  const startDate = useMemo(() => getAnniversaryDate(2026), []);
  const stats = useMemo(() => calculateLoveStats(startDate, now), [startDate, now]);

  // Trigger Heart Confetti Blast
  const triggerCelebration = () => {
    setIsCelebrated(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF8FAB", "#FFCCD5", "#D8D2FF", "#FEF08A", "#BAE6FD"],
    });
    setTimeout(() => setIsCelebrated(false), 3000);
  };

  const handleNextReason = () => {
    setActiveReasonIndex((prev) => (prev + 1) % LOVE_REASONS.length);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCCD5] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Heart size={13} className="fill-[#2C2824] text-[#2C2824]" />
                <span>Our Official Love Chronicle</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-[#2C2824] tracking-tight">
                our love journey ⏳
              </h1>
              <p className="font-hand text-xl sm:text-2xl text-[#7A7269] mt-1">
                every second, minute, and day spent falling deeper in love with Jane ♡
              </p>
            </div>

            {/* Static Badge: Pacaran Sejak 28 Mei 2026 */}
            <div className="flex items-center gap-2 bg-[#FFFDF9] px-4 py-2 rounded-2xl border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824]">
              <Heart size={16} className="fill-rose-500 text-rose-500 animate-pulse flex-shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xs text-[#7A7269]">Pacaran Sejak:</span>
                <span className="font-display font-black text-xs px-2.5 py-1 bg-[#FFCCD5] border border-[#2C2824] rounded-lg text-[#2C2824]">
                  28 Mei 2026 🌸
                </span>
              </div>
            </div>
          </div>

          {/* ─── GRAND LIVE TICKING ODOMETER ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neu-box p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#EDE9FE] border-[3px] border-[#2C2824] shadow-[8px_8px_0px_#2C2824] relative overflow-hidden"
          >
            {/* Ambient Decorative Watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none">
              <Heart size={220} className="fill-[#2C2824]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#2C2824]/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-display font-black text-xs sm:text-sm uppercase tracking-widest text-[#2C2824]">
                    Continuous Live Love Meter
                  </span>
                </div>
                <div className="font-hand text-lg text-[#7A7269]">
                  Pacaran sejak 28 Mei 2026, 00:00:00 WIB
                </div>
              </div>

              {/* Big Aesthetic Digit Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {/* DAYS */}
                <div className="neu-box bg-[#FFCCD5] border-[2.5px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] p-4 text-center rounded-2xl">
                  <p className="font-display font-black text-4xl sm:text-6xl text-[#2C2824] tracking-tight">
                    {stats.days}
                  </p>
                  <p className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]/80 mt-1">
                    Days in Love
                  </p>
                </div>

                {/* HOURS */}
                <div className="neu-box bg-[#BAE6FD] border-[2.5px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] p-4 text-center rounded-2xl">
                  <p className="font-display font-black text-4xl sm:text-6xl text-[#2C2824] tracking-tight">
                    {String(stats.hours).padStart(2, "0")}
                  </p>
                  <p className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]/80 mt-1">
                    Hours
                  </p>
                </div>

                {/* MINUTES */}
                <div className="neu-box bg-[#FEF08A] border-[2.5px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] p-4 text-center rounded-2xl">
                  <p className="font-display font-black text-4xl sm:text-6xl text-[#2C2824] tracking-tight">
                    {String(stats.minutes).padStart(2, "0")}
                  </p>
                  <p className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]/80 mt-1">
                    Minutes
                  </p>
                </div>

                {/* SECONDS & MILLISECONDS */}
                <div className="neu-box bg-[#BBF7D0] border-[2.5px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] p-4 text-center rounded-2xl relative overflow-hidden">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display font-black text-4xl sm:text-6xl text-[#2C2824] tracking-tight">
                      {String(stats.seconds).padStart(2, "0")}
                    </span>
                    <span className="font-display font-bold text-xs sm:text-sm text-[#16A34A] w-6 text-left">
                      .{String(stats.milliseconds).padStart(2, "0")}s
                    </span>
                  </div>
                  <p className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]/80 mt-1">
                    Seconds
                  </p>
                </div>
              </div>

              {/* Heartbeat & Quick Stats Banner */}
              <div className="bg-[#FFFFFF]/90 p-4 rounded-2xl border-2 border-[#2C2824]/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 border border-[#2C2824] flex items-center justify-center text-rose-600 shadow-sm animate-bounce">
                    <Heart size={20} className="fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-display font-black text-sm text-[#2C2824]">
                      ~{stats.estimatedHeartbeats.toLocaleString()} Heartbeats Exchanged ♡
                    </p>
                    <p className="font-body text-xs text-[#7A7269]">
                      our hearts beating in sync since 28 Mei 2026
                    </p>
                  </div>
                </div>

                {/* Celebrate Button */}
                <button
                  onClick={triggerCelebration}
                  className="neu-btn neu-btn-pink text-xs py-2.5 px-5 shadow-[3px_3px_0px_#2C2824] flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <PartyPopper size={15} />
                  <span>Send Love Fireworks 🎉</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* ─── VITAL STATS GRID ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] space-y-1">
              <div className="flex items-center justify-between text-[#7A7269]">
                <span className="font-display font-bold text-xs uppercase tracking-wider">Total Hours</span>
                <Clock size={16} className="text-[#2C2824]" />
              </div>
              <p className="font-display font-black text-2xl text-[#2C2824]">
                {stats.totalHours.toLocaleString()} hrs
              </p>
              <p className="font-hand text-sm text-[#7A7269]">of non-stop loving you</p>
            </div>

            <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] space-y-1">
              <div className="flex items-center justify-between text-[#7A7269]">
                <span className="font-display font-bold text-xs uppercase tracking-wider">Total Minutes</span>
                <Zap size={16} className="text-[#2C2824]" />
              </div>
              <p className="font-display font-black text-2xl text-[#2C2824]">
                {stats.totalMinutes.toLocaleString()} mins
              </p>
              <p className="font-hand text-sm text-[#7A7269]">each minute a sweet memory</p>
            </div>

            <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] space-y-1">
              <div className="flex items-center justify-between text-[#7A7269]">
                <span className="font-display font-bold text-xs uppercase tracking-wider">Hugs &amp; Kisses</span>
                <Heart size={16} className="text-rose-500 fill-rose-500" />
              </div>
              <p className="font-display font-black text-2xl text-[#2C2824]">
                ~{stats.estimatedHugsKisses.toLocaleString()} hugs
              </p>
              <p className="font-hand text-sm text-[#7A7269]">warm virtual &amp; real cuddles</p>
            </div>

            <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] space-y-1">
              <div className="flex items-center justify-between text-[#7A7269]">
                <span className="font-display font-bold text-xs uppercase tracking-wider">Laughter Shared</span>
                <Smile size={16} className="text-amber-500" />
              </div>
              <p className="font-display font-black text-2xl text-[#2C2824]">
                ~{stats.estimatedLaughter.toLocaleString()} smiles
              </p>
              <p className="font-hand text-sm text-[#7A7269]">endless late night giggles</p>
            </div>
          </div>

          {/* ─── NEXT 28 MEI ANNIVERSARY COUNTDOWN ─── */}
          <div className="neu-box p-6 sm:p-8 bg-[#D8D2FF] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎂</span>
                <div>
                  <h2 className="font-display font-black text-xl text-[#2C2824]">
                    Next Anniversary: 28 Mei {stats.nextAnniv.targetYear} (1 Year Anniversary)
                  </h2>
                  <p className="font-hand text-base text-[#2C2824]/80">
                    Counting down the days until our 1-year celebration day ♡
                  </p>
                </div>
              </div>

              {/* Countdown Pill */}
              <div className="bg-[#FFFDF9] border-2 border-[#2C2824] px-4 py-2 rounded-xl shadow-[2px_2px_0px_#2C2824] flex items-center gap-3">
                <div className="text-center">
                  <span className="font-display font-black text-lg text-[#2C2824]">{stats.nextAnniv.days}</span>
                  <span className="font-display font-bold text-[10px] text-[#7A7269] block">DAYS</span>
                </div>
                <span className="font-display font-bold text-[#2C2824]">:</span>
                <div className="text-center">
                  <span className="font-display font-black text-lg text-[#2C2824]">{stats.nextAnniv.hours}</span>
                  <span className="font-display font-bold text-[10px] text-[#7A7269] block">HRS</span>
                </div>
                <span className="font-display font-bold text-[#2C2824]">:</span>
                <div className="text-center">
                  <span className="font-display font-black text-lg text-[#2C2824]">{stats.nextAnniv.minutes}</span>
                  <span className="font-display font-bold text-[10px] text-[#7A7269] block">MIN</span>
                </div>
                <span className="font-display font-bold text-[#2C2824]">:</span>
                <div className="text-center">
                  <span className="font-display font-black text-lg text-[#2C2824]">{stats.nextAnniv.seconds}</span>
                  <span className="font-display font-bold text-[10px] text-[#7A7269] block">SEC</span>
                </div>
              </div>
            </div>

            {/* Annual Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-display font-bold text-[#2C2824]">
                <span>Journey to 1 Year Anniversary</span>
                <span>{Math.floor(stats.nextAnniv.progressPercent)}% complete</span>
              </div>
              <div className="w-full h-4 bg-[#FFFDF9] border-2 border-[#2C2824] rounded-full overflow-hidden p-0.5 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FF8FAB] to-[#FEF08A] rounded-full"
                  style={{ width: `${stats.nextAnniv.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ─── MILESTONES ROADMAP / TIMELINE ─── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-2xl text-[#2C2824] flex items-center gap-2">
                  <span>🏆</span>
                  <span>Our Love Milestones</span>
                </h2>
                <p className="font-hand text-lg text-[#7A7269]">
                  badges unlocked across our journey since 28 Mei 2026 ♡
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MILESTONES.map((m) => {
                const isUnlocked = stats.days >= m.days;
                const progress = Math.min(100, Math.max(0, (stats.days / m.days) * 100));

                return (
                  <div
                    key={m.id}
                    className={`neu-box p-5 border-2 border-[#2C2824] rounded-2xl transition-all ${
                      isUnlocked
                        ? "bg-[#FFFDF9] shadow-[4px_4px_0px_#2C2824]"
                        : "bg-[#FAF5EE]/70 opacity-75 shadow-[2px_2px_0px_#2C2824]/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl border-2 border-[#2C2824] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#2C2824] flex-shrink-0 ${
                            isUnlocked ? "bg-[#FEF08A]" : "bg-[#FAF5EE]"
                          }`}
                        >
                          {m.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-black text-base text-[#2C2824]">
                              {m.title}
                            </h3>
                            {isUnlocked ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#BBF7D0] border border-[#16A34A] text-[#14532D] text-[10px] font-display font-bold">
                                UNLOCKED ✨
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-[#FAF5EE] border border-[#2C2824]/30 text-[#7A7269] text-[10px] font-display font-bold">
                                In {m.days - stats.days} Days
                              </span>
                            )}
                          </div>
                          <p className="font-display font-bold text-xs text-[#7A7269] mt-0.5">
                            {m.subtitle}
                          </p>
                          <p className="font-hand text-base text-[#2C2824] mt-2 leading-snug">
                            &ldquo;{m.description}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>

                    {!isUnlocked && (
                      <div className="mt-3 pt-3 border-t border-[#2C2824]/10 space-y-1">
                        <div className="flex justify-between text-[10px] font-display font-bold text-[#7A7269]">
                          <span>Progress</span>
                          <span>{Math.floor(progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#FAF5EE] border border-[#2C2824]/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF8FAB] rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── ROMANTIC LOVE REASON GENERATOR ─── */}
          <div className="neu-box p-6 sm:p-8 bg-[#BAE6FD] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#2C2824] text-xs font-display font-bold text-[#2C2824]">
              <span>💌</span>
              <span>Why Every Second with Jane is Precious</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeReasonIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-w-2xl mx-auto py-2"
              >
                <p className="font-hand text-2xl sm:text-3xl text-[#2C2824] leading-relaxed">
                  &ldquo;{LOVE_REASONS[activeReasonIndex]}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-2">
              <button
                onClick={handleNextReason}
                className="neu-btn neu-btn-white text-xs py-2.5 px-6 shadow-[3px_3px_0px_#2C2824] inline-flex items-center gap-2"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>Give Me Another Reason ♡</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

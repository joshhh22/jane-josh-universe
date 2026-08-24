"use client";

export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { RoomPreviewCard } from "@/components/cards/RoomPreviewCard";
import { JaneLorePreviewCard } from "@/components/cards/JaneLorePreviewCard";
import { AnniversaryPreviewCard } from "@/components/cards/AnniversaryPreviewCard";
import { MoodWidget } from "@/components/cards/MoodWidget";
import { LetterCountCard } from "@/components/cards/LetterCountCard";
import { MusicPreviewCard } from "@/components/cards/MusicPreviewCard";
import { MemoryPreviewCard } from "@/components/cards/MemoryPreviewCard";
import { DailyQuestionCard } from "@/components/cards/DailyQuestionCard";
import { StatsCard } from "@/components/cards/StatsCard";
import { PetWidget } from "@/components/cards/PetWidget";
import { SurpriseCountCard } from "@/components/cards/SurpriseCountCard";
import { Sparkles, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFD1DC] selection:text-[#23201D]">
      <div>
        <NavBar />

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
          {/* Header Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b-2 border-[#23201D]/10"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-[#23201D] shadow-[2px_2px_0px_#23201D] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-[#23201D]" />
                <span>Our Digital Universe</span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#23201D]">
                jane <span className="text-[#FF8FAB] font-normal">&amp;</span> josh
              </h1>
              <p className="font-hand text-xl sm:text-2xl text-[#6E675F] mt-1">
                a tiny interactive corner of the internet made just for us 🌸
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#FFFFFF] border-2 border-[#23201D] rounded-xl px-3.5 py-1.5 shadow-[2.5px_2.5px_0px_#23201D] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border border-[#23201D]" />
                <span className="font-display font-bold text-xs text-[#23201D]">universe server: online</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* ROW 1: 3D Room (7 cols) + Jane Lore (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="md:col-span-7 h-[360px] sm:h-[400px]"
            >
              <RoomPreviewCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-5 h-[360px] sm:h-[400px]"
            >
              <JaneLorePreviewCard />
            </motion.div>

            {/* ROW 2: 28 Mei Live Love Counter (6 cols) + Mood Widget (6 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="md:col-span-6 min-h-[220px]"
            >
              <AnniversaryPreviewCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-6 min-h-[220px]"
            >
              <MoodWidget />
            </motion.div>

            {/* ROW 3: 3 Metric Cards (4 cols each) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="md:col-span-4 min-h-[200px]"
            >
              <LetterCountCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-4 min-h-[200px]"
            >
              <SurpriseCountCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="md:col-span-4 min-h-[200px]"
            >
              <DailyQuestionCard />
            </motion.div>

            {/* ROW 4: Soundtrack (6 cols) + Memory Archive (6 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-6 min-h-[240px]"
            >
              <MusicPreviewCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="md:col-span-6 min-h-[240px]"
            >
              <MemoryPreviewCard />
            </motion.div>

            {/* ROW 5: Pet Widget (6 cols) + Stats Card (6 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-6 min-h-[240px]"
            >
              <PetWidget />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="md:col-span-6 min-h-[240px]"
            >
              <StatsCard />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t-2 border-[#23201D]/10 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 font-display font-bold text-xs text-[#23201D]">
            <span>made with</span>
            <Heart size={14} className="fill-[#FF8FAB] text-[#FF8FAB] animate-pulse" />
            <span>for jane bernadine by josh</span>
          </div>

          <p className="font-hand text-base text-[#6E675F]">
            psst... try pressing ↑ ↑ ↓ ↓ ← → ← → B A on your keyboard 🎮
          </p>
        </div>
      </footer>
    </div>
  );
}

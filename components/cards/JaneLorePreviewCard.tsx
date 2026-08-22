"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { JaneLore } from "@/lib/supabase/types";
import { Sparkles, ArrowRight } from "lucide-react";

const STAT_COLORS: Record<string, string> = {
  cute: "#FFD1DC",
  chaos: "#FEF08A",
  sleepiness: "#DDD6FE",
  loveliness: "#FF8FAB",
};

const DEFAULT_STATS = [
  { id: "1", category: "stats", key: "cute", value: "95", emoji: "🌸" },
  { id: "2", category: "stats", key: "chaos", value: "40", emoji: "⚡" },
  { id: "3", category: "stats", key: "sleepiness", value: "85", emoji: "😴" },
  { id: "4", category: "stats", key: "loveliness", value: "9999", emoji: "💗" },
];

export function JaneLorePreviewCard() {
  const supabase = createClient();
  const [stats, setStats] = useState<JaneLore[]>(DEFAULT_STATS as JaneLore[]);

  useEffect(() => {
    supabase
      .from("jane_lore")
      .select("*")
      .eq("category", "stats")
      .then(({ data }) => {
        if (data && data.length > 0) setStats(data);
      });
  }, []);

  return (
    <Link href="/jane" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-5 sm:p-6 bg-[#FFF0F3] flex flex-col justify-between group">
        {/* Card Header */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="badge-pill bg-[#FFFFFF]">
              <Sparkles size={11} />
              <span>Character Lore</span>
            </span>
            <span className="badge-pill bg-[#FEF08A]">
              LVL. ∞
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD1DC] border-2 border-[#23201D] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#23201D] group-hover:rotate-6 transition-transform flex-shrink-0">
              🌸
            </div>
            <div>
              <h2 className="font-display font-black text-xl leading-tight text-[#23201D]">
                JANE BERNADINE
              </h2>
              <p className="font-hand text-sm text-[#6E675F]">
                universe co-founder &amp; VIP ✦
              </p>
            </div>
          </div>
        </div>

        {/* RPG Stat Bars */}
        <div className="inner-tile p-3 space-y-2.5 my-auto">
          {stats.map((s) => {
            const isInfinite = s.key === "loveliness" || parseInt(s.value) > 100;
            const pct = isInfinite ? 100 : Math.min(100, parseInt(s.value) || 0);
            const color = STAT_COLORS[s.key] || "#FFD1DC";

            return (
              <div key={s.id || s.key} className="space-y-0.5">
                <div className="flex justify-between items-center text-[11px] font-display font-bold">
                  <span className="capitalize text-[#23201D] flex items-center gap-1">
                    <span>{s.emoji || "✨"}</span>
                    <span>{s.key}</span>
                  </span>
                  <span className="text-[#6E675F]">
                    {isInfinite ? "∞ MAX" : `${s.value}%`}
                  </span>
                </div>
                <div className="rpg-bar-container">
                  <div
                    className="rpg-bar-fill"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span>view complete lore profile</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

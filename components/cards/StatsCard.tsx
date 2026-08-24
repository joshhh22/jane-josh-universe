"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Sparkles } from "lucide-react";

interface Stats {
  letters: number;
  songs: number;
  memories: number;
  answers: number;
}

export function StatsCard() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats>({ letters: 0, songs: 0, memories: 0, answers: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("letters").select("*", { count: "exact", head: true }),
      supabase.from("songs").select("*", { count: "exact", head: true }),
      supabase.from("memories").select("*", { count: "exact", head: true }),
      supabase.from("daily_answers").select("*", { count: "exact", head: true }),
    ]).then(([l, s, m, a]) => {
      setStats({
        letters: l.count || 0,
        songs: s.count || 0,
        memories: m.count || 0,
        answers: a.count || 0,
      });
    });
  }, []);

  const metrics = [
    { label: "Letters Written", val: stats.letters, emoji: "💌", bg: "#FFE4E6" },
    { label: "Playlist Songs", val: stats.songs, emoji: "🎵", bg: "#EDE9FE" },
    { label: "Memories Kept", val: stats.memories, emoji: "📸", bg: "#E0F2FE" },
    { label: "Daily Answers", val: stats.answers, emoji: "💭", bg: "#FEF9C3" },
    { label: "Secret Rooms", val: "? / 7", emoji: "🔐", bg: "#FED7AA" },
    { label: "Love Index", val: "∞", badge: "MAX", emoji: "💗", bg: "#DCFCE7" },
  ];

  return (
    <div className="neu-card p-5 sm:p-6 bg-[#FFFFFF]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#23201D]/10">
        <div className="flex items-center gap-2">
          <span className="badge-pill bg-[#FEF08A]">
            <BarChart3 size={11} />
            <span>Universe Metrics</span>
          </span>
          <span className="font-hand text-base text-[#6E675F]">
            our real-time shared statistics
          </span>
        </div>
        <span className="font-hand text-xs text-[#6E675F]">
          &ldquo;terserah&rdquo; count: 9,999+ times 🌸
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-3 sm:p-3.5 rounded-2xl border-1.5 border-[#23201D] shadow-[2px_2px_0px_#23201D] flex flex-col justify-between overflow-hidden"
            style={{ backgroundColor: m.bg }}
          >
            <div className="flex justify-between items-center text-lg sm:text-xl mb-1">
              <span>{m.emoji}</span>
              <Sparkles size={11} className="opacity-30 text-[#23201D]" />
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="font-display font-black text-xl sm:text-2xl text-[#23201D] truncate">
                {m.val}
              </span>
              {m.badge && (
                <span className="text-[10px] font-display font-black px-1.5 py-0.5 bg-[#23201D] text-[#FFFFFF] rounded-md shadow-sm">
                  {m.badge}
                </span>
              )}
            </div>
            <div className="font-display font-bold text-[9px] sm:text-[10px] uppercase tracking-wider text-[#23201D]/75 leading-tight">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

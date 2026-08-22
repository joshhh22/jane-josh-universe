"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { JaneLore } from "@/lib/supabase/types";
import { Sparkles, Edit3, Check, X, ShieldCheck, Heart } from "lucide-react";

const CATEGORIES = [
  { key: "stats", label: "Character Stats & Attributes", emoji: "📊" },
  { key: "favorites", label: "Favorite Things", emoji: "💗" },
  { key: "habits", label: "Cute Habits & Quirks", emoji: "🌙" },
  { key: "facts", label: "Official Facts", emoji: "✨" },
];

const STAT_COLORS: Record<string, string> = {
  cute: "#FFCCD5",
  chaos: "#FEF08A",
  sleepiness: "#D8D2FF",
  loveliness: "#FFAAA6",
};

const DEFAULT_LORE = [
  { id: "1", category: "stats", key: "cute", value: "95", emoji: "🌸" },
  { id: "2", category: "stats", key: "chaos", value: "40", emoji: "⚡" },
  { id: "3", category: "stats", key: "sleepiness", value: "85", emoji: "😴" },
  { id: "4", category: "stats", key: "loveliness", value: "9999", emoji: "💗" },
  { id: "5", category: "favorites", key: "food", value: "Ayam Geprek 🍗🌶️", emoji: "🍗" },
  { id: "6", category: "favorites", key: "song", value: "Late night acoustic tracks", emoji: "🎵" },
  { id: "7", category: "favorites", key: "movie", value: "Studio Ghibli & Comfort films", emoji: "🎬" },
  { id: "8", category: "favorites", key: "place", value: "Any cozy couch under a blanket", emoji: "📍" },
  { id: "9", category: "habits", key: "morning", value: "Snoozing the alarm 5 times minimum", emoji: "☀️" },
  { id: "10", category: "facts", key: "signature_phrase", value: "'Terserah... tapi kamu yang pilih'", emoji: "✨" },
  { id: "11", category: "facts", key: "weakness", value: "Cute plushies & cold drinks", emoji: "🌟" },
];

export default function JanePage() {
  const { isJane, profile } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [loreList, setLoreList] = useState<JaneLore[]>(DEFAULT_LORE as JaneLore[]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const fetchLore = async () => {
    const { data } = await supabase.from("jane_lore").select("*").order("category");
    if (data && data.length > 0) setLoreList(data);
  };

  useEffect(() => {
    fetchLore();
  }, []);

  const saveLore = async (id: string, key: string, category: string) => {
    if (!editVal.trim()) return;

    await supabase
      .from("jane_lore")
      .upsert({ id, category, key, value: editVal.trim(), updated_at: new Date().toISOString() });

    showToast("Jane Lore™ updated successfully! 🌸", { emoji: "🌸", type: "love" });
    setEditingId(null);
    fetchLore();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Hero Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="neu-box p-6 sm:p-8 bg-[#FFCCD5] border-[2.5px] border-[#2C2824] relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFFDF9] border-[2.5px] border-[#2C2824] flex items-center justify-center text-5xl shadow-[4px_4px_0px_#2C2824] flex-shrink-0 rotate-2">
                🌸
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="sticker bg-[#FFFDF9] text-xs">
                    OFFICIAL CHARACTER PROFILE
                  </span>
                  <span className="sticker bg-[#FEF08A] text-xs">
                    LVL. ∞
                  </span>
                  {isJane && (
                    <span className="sticker bg-[#BBF7D0] text-xs">
                      ✍️ JANE EDIT MODE ACTIVE
                    </span>
                  )}
                </div>

                <h1 className="font-display font-black text-3xl sm:text-5xl text-[#2C2824] tracking-tight">
                  JANE BERNADINE
                </h1>
                <p className="font-hand text-xl sm:text-2xl text-[#2C2824]/80 mt-1">
                  the most special person in this entire digital universe ✦
                </p>
              </div>
            </div>
          </motion.div>

          {/* Lore Sections */}
          <div className="space-y-8">
            {CATEGORIES.map((cat) => {
              const items = loreList.filter((l) => l.category === cat.key);
              if (items.length === 0) return null;

              return (
                <section key={cat.key} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#2C2824]/15">
                    <span className="text-2xl">{cat.emoji}</span>
                    <h2 className="font-display font-black text-xl text-[#2C2824]">
                      {cat.label}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {items.map((item) => {
                      const isEditing = editingId === item.id;
                      const isStat = item.category === "stats";
                      const isInfinite = item.key === "loveliness" || parseInt(item.value) > 100;
                      const pct = isInfinite ? 100 : Math.min(100, parseInt(item.value) || 0);
                      const color = STAT_COLORS[item.key] || "#FFCCD5";

                      return (
                        <div
                          key={item.id || item.key}
                          className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.emoji || "✨"}</span>
                              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#7A7269]">
                                {item.key.replace(/_/g, " ")}
                              </span>
                            </div>

                            {isJane && !isEditing && (
                              <button
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditVal(item.value);
                                }}
                                className="p-1 rounded-lg border border-[#2C2824] bg-[#FAF5EE] hover:bg-[#FEF08A] transition-colors"
                                title="Edit this fact"
                              >
                                <Edit3 size={12} />
                              </button>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="flex gap-2 mt-1">
                              <input
                                value={editVal}
                                onChange={(e) => setEditVal(e.target.value)}
                                className="flex-1 border-2 border-[#2C2824] rounded-lg px-2.5 py-1 text-sm font-body bg-[#FAF5EE] focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => saveLore(item.id, item.key, item.category)}
                                className="p-1.5 rounded-lg bg-[#BBF7D0] border-2 border-[#2C2824]"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 rounded-lg bg-[#FFCCD5] border-2 border-[#2C2824]"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : isStat ? (
                            <div className="space-y-1.5 my-1">
                              <div className="flex justify-between text-xs font-display font-bold text-[#2C2824]">
                                <span>RATING</span>
                                <span>{isInfinite ? "∞ MAX" : `${item.value}%`}</span>
                              </div>
                              <div className="rpg-bar-container">
                                <div
                                  className="rpg-bar-fill"
                                  style={{ width: `${pct}%`, backgroundColor: color }}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="font-body text-sm text-[#2C2824] font-medium leading-relaxed my-1">
                              {item.value}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Josh's Dedicated Letter Note */}
          <div className="neu-box p-6 bg-[#FEF08A] border-[2.5px] border-[#2C2824] -rotate-1 shadow-[4px_4px_0px_#2C2824]">
            <p className="font-hand text-2xl text-[#2C2824] leading-relaxed">
              &ldquo;Jane is the kind of person who makes everything brighter just by existing.
              This page could never fit everything that makes her incredible &mdash; but it is a small tribute to my favorite person. 💗&rdquo;
            </p>
            <p className="font-display font-black text-right text-sm text-[#2C2824] mt-2">
              &mdash; Josh Benjamin Rompis
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

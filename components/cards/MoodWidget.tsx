"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";

const MOODS = [
  { emoji: "🥰", label: "lovey" },
  { emoji: "🙂", label: "good" },
  { emoji: "😴", label: "sleepy" },
  { emoji: "😭", label: "crying" },
  { emoji: "😡", label: "chaos" },
];

export function MoodWidget() {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("moods")
      .select("mood")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setCurrentMood(data.mood);
      });
  }, [user]);

  const setMood = async (emoji: string) => {
    if (!user || !isAdmin) return;
    await supabase.from("moods").insert({ user_id: user.id, mood: emoji });
    setCurrentMood(emoji);
    showToast(`Mood set to ${emoji} ✨`, { emoji, type: "love" });
  };

  return (
    <div className="neu-card h-full p-5 bg-[#FEF9C3] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>✨</span>
            <span>Mood Check</span>
          </span>
          {currentMood && (
            <span className="text-xl animate-bounce">{currentMood}</span>
          )}
        </div>
        <h3 className="font-display font-black text-sm text-[#23201D]">
          how are you feeling?
        </h3>
      </div>

      <div className="inner-tile p-2.5 my-2 flex items-center justify-between gap-1">
        {MOODS.map((m) => {
          const selected = currentMood === m.emoji;
          return (
            <button
              key={m.emoji}
              onClick={() => setMood(m.emoji)}
              disabled={!isAdmin}
              title={m.label}
              className={`p-1.5 rounded-xl text-xl transition-transform hover:scale-125 active:scale-95 ${
                selected ? "bg-[#FFCCD5] border-1.5 border-[#23201D] scale-110 shadow-sm" : ""
              } ${!isAdmin ? "cursor-default" : "cursor-pointer"}`}
            >
              {m.emoji}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-display font-bold text-[#6E675F] pt-1">
        <span>{user ? (isAdmin ? "tap to set mood" : "visitor mode") : "sign in to vote"}</span>
        <Link href="/daily" className="hover:text-[#23201D] underline">
          daily log →
        </Link>
      </div>
    </div>
  );
}

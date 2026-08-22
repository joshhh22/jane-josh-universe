"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { DailyQuestion, DailyAnswer } from "@/lib/supabase/types";
import { MessageSquare, Calendar, Sparkles, Send, Heart } from "lucide-react";

const MOODS = [
  { emoji: "🥰", label: "lovey" },
  { emoji: "🙂", label: "good" },
  { emoji: "😐", label: "meh" },
  { emoji: "😔", label: "sad" },
  { emoji: "😭", label: "crying" },
  { emoji: "😴", label: "sleepy" },
  { emoji: "😡", label: "chaos" },
];

export default function DailyPage() {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [answers, setAnswers] = useState<
    (DailyAnswer & { profiles: { username: string; display_name: string; avatar_emoji: string } })[]
  >([]);
  const [myAnswer, setMyAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [pastQuestions, setPastQuestions] = useState<DailyQuestion[]>([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const load = async () => {
      const { data: q } = await supabase
        .from("daily_questions")
        .select("*")
        .eq("question_date", today)
        .single();

      if (q) {
        setQuestion(q);
        const { data: a } = await supabase
          .from("daily_answers")
          .select("*, profiles(username, display_name, avatar_emoji)")
          .eq("question_id", q.id);

        if (a) setAnswers(a as typeof answers);
        if (user) {
          const mine = a?.find((r) => r.user_id === user.id);
          if (mine) {
            setSubmitted(true);
            setMyAnswer(mine.answer);
          }
        }
      } else {
        setQuestion({
          id: "default",
          question: "What made you smile today?",
          question_date: today,
          created_at: new Date().toISOString(),
        });
      }

      const { data: past } = await supabase
        .from("daily_questions")
        .select("*")
        .lt("question_date", today)
        .order("question_date", { ascending: false })
        .limit(5);

      if (past) setPastQuestions(past);

      if (user) {
        const { data: m } = await supabase
          .from("moods")
          .select("mood")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (m) setCurrentMood(m.mood);
      }
    };
    load();
  }, [user]);

  const submitAnswer = async () => {
    if (!user || !question || !myAnswer.trim()) return;
    await supabase
      .from("daily_answers")
      .upsert({ question_id: question.id, user_id: user.id, answer: myAnswer.trim() });

    showToast("Answer saved to our memory log! 💭", { emoji: "💭", type: "love" });
    setSubmitted(true);

    const { data: a } = await supabase
      .from("daily_answers")
      .select("*, profiles(username, display_name, avatar_emoji)")
      .eq("question_id", question.id);

    if (a) setAnswers(a as typeof answers);
  };

  const setMood = async (emoji: string) => {
    if (!user) return;
    await supabase.from("moods").insert({ user_id: user.id, mood: emoji });
    setCurrentMood(emoji);
    showToast(`Mood set to ${emoji} ✨`, { emoji, type: "love" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Calendar size={12} />
                <span>Daily Log</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                daily corner 💭
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Section 1: Mood check */}
          <div className="neu-box p-6 bg-[#FEF08A] border-[2.5px] border-[#2C2824]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-base text-[#2C2824] flex items-center gap-2">
                <span>✨</span>
                <span>how are you feeling today?</span>
              </h2>
              {currentMood && (
                <span className="sticker bg-[#FFFDF9] text-xs">
                  today: {currentMood}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 bg-[#FFFDF9] p-3 rounded-2xl border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824]">
              {MOODS.map((m) => {
                const selected = currentMood === m.emoji;
                return (
                  <button
                    key={m.emoji}
                    onClick={() => isAdmin && setMood(m.emoji)}
                    disabled={!isAdmin}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                      selected
                        ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824] scale-105"
                        : "border-transparent hover:border-[#2C2824]/30 hover:bg-[#FAF5EE]"
                    } ${!isAdmin ? "cursor-default opacity-75" : "cursor-pointer"}`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{m.emoji}</span>
                    <span className="text-[10px] font-display font-bold text-[#7A7269]">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {!isAdmin && (
              <p className="font-hand text-xs text-[#7A7269] mt-2 text-right">
                sign in as jane or josh to log your daily mood
              </p>
            )}
          </div>

          {/* Section 2: Today's Question */}
          <div className="neu-box p-6 bg-[#BAE6FD] border-[2.5px] border-[#2C2824]">
            <div className="flex items-center justify-between mb-2">
              <span className="sticker bg-[#FFFDF9] text-[11px]">
                <MessageSquare size={12} />
                <span>QUESTION OF THE DAY</span>
              </span>
            </div>

            <div className="bg-[#FFFDF9] p-5 rounded-2xl border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] my-3">
              <p className="font-hand text-2xl sm:text-3xl text-[#2C2824] text-center leading-snug">
                &ldquo;{question?.question || "What made you smile today?"}&rdquo;
              </p>
            </div>

            {/* Answer Feed */}
            <div className="space-y-3 my-4">
              {answers.length === 0 ? (
                <div className="bg-[#FFFDF9]/60 p-4 rounded-xl border-2 border-dashed border-[#2C2824]/20 text-center font-hand text-base text-[#7A7269]">
                  no one has answered today yet &bull; be the first! 🌸
                </div>
              ) : (
                answers.map((a) => (
                  <div
                    key={a.id}
                    className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                  >
                    <div className="flex items-center gap-2 mb-1.5 font-display font-bold text-xs text-[#2C2824]">
                      <span className="text-base">{a.profiles?.avatar_emoji || "👤"}</span>
                      <span>{a.profiles?.display_name || "Anonymous"}</span>
                    </div>
                    <p className="font-body text-sm text-[#2C2824] pl-6 leading-relaxed">
                      {a.answer}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Box */}
            {isAdmin && (
              <div className="mt-4 bg-[#FFFDF9] p-3.5 rounded-2xl border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824]">
                <label className="font-display font-bold text-xs text-[#2C2824] block mb-1.5">
                  {submitted ? "update your answer:" : "your answer:"}
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={myAnswer}
                    onChange={(e) => setMyAnswer(e.target.value)}
                    placeholder="write what's on your mind..."
                    rows={2}
                    className="flex-1 border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FAF5EE] focus:outline-none focus:bg-[#FFFDF9] resize-none"
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={!myAnswer.trim()}
                    className="neu-btn neu-btn-pink self-end py-2 px-4 text-xs disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>save</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Past Questions Archive */}
          {pastQuestions.length > 0 && (
            <div className="neu-box p-6 bg-[#FFFDF9] border-[2.5px] border-[#2C2824]">
              <h2 className="font-display font-bold text-base text-[#2C2824] mb-3 flex items-center gap-2">
                <span>📚</span>
                <span>past questions archive</span>
              </h2>
              <div className="space-y-2">
                {pastQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-[#FAF5EE] border border-[#2C2824]/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-hand text-base text-[#2C2824]">
                      &ldquo;{q.question}&rdquo;
                    </span>
                    <span className="font-display font-bold text-[#7A7269] flex-shrink-0">
                      {new Date(q.question_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

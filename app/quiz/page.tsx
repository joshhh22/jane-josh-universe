"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import type { QuizQuestion } from "@/lib/supabase/types";
import { Brain, Trophy, RotateCcw, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

const DEFAULT_QUESTIONS = [
  {
    id: "1",
    question: "What would Jane most likely be doing on a quiet Sunday morning?",
    options: ["Sleeping in cozy under the blanket 😴", "Going for an early run 🏃", "Cleaning the house 🧹", "Studying spreadsheets 📊"],
    correct_index: 0,
    hint: "she loves cozy rest",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Jane's reaction when a dinner plan gets cancelled last minute?",
    options: ["Super sad & crying 😭", "Secretly very relieved to stay home in pajamas 😌", "Instantly plans 3 new parties 🎉", "Gets mad at everyone 😤"],
    correct_index: 1,
    hint: "introvert comfort vibes",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    question: "What is Jane's official most-used phrase in any decision?",
    options: ["'Terserah... tapi kamu yang pilih'", "'Aku yang putusin semuanya'", "'Gak mau tahu'", "'Gas pol'"],
    correct_index: 0,
    hint: "classic Jane trademark",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    question: "If Jane could eat one comfort meal forever, it would be...",
    options: ["Hot ramen & savory noodles 🍜", "Dry salad without dressing 🥗", "Plain crackers 🍪", "Black coffee only ☕"],
    correct_index: 0,
    hint: "warm and cozy food",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    question: "How loved is Jane Bernadine in this universe?",
    options: ["A little bit", "Normal amount", "Infinitely without limit 💗", "Can't measure"],
    correct_index: 2,
    hint: "easiest question in the world",
    created_at: new Date().toISOString(),
  },
];

export default function QuizPage() {
  const supabase = createClient();
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUESTIONS as QuizQuestion[]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    supabase.from("quiz_questions").select("*").then(({ data }) => {
      if (data && data.length > 0) setQuestions(data);
    });
  }, []);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);

    const isCorrect = idx === questions[current].correct_index;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      setSelected(null);
      if (current + 1 >= questions.length) {
        setDone(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#FFCCD5", "#D8D2FF", "#FEF08A", "#BBF7D0"],
        });
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1200);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setDone(false);
    setStarted(false);
  };

  const q = questions[current];
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="text-center pb-4 border-b-2 border-[#2C2824]/15">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8D2FF] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
              <Brain size={12} />
              <span>How Well Do You Know Jane?</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
              the official jane quiz 🧠
            </h1>
            <p className="font-hand text-xl text-[#7A7269] mt-0.5">
              test your knowledge &bull; no cheating allowed 🌸
            </p>
          </div>

          {!started ? (
            <div className="neu-box p-8 sm:p-10 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] text-center space-y-5">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFCCD5] border-[2.5px] border-[#2C2824] flex items-center justify-center text-4xl shadow-[4px_4px_0px_#2C2824]">
                🌸
              </div>

              <div>
                <h2 className="font-display font-black text-2xl text-[#2C2824]">
                  ARE YOU READY?
                </h2>
                <p className="font-body text-sm text-[#7A7269] mt-1 max-w-sm mx-auto">
                  {questions.length} questions about habits, favorite things, and Jane lore.
                </p>
              </div>

              <button
                onClick={() => setStarted(true)}
                className="neu-btn neu-btn-pink text-sm py-2.5 px-8 shadow-[4px_4px_0px_#2C2824]"
              >
                start quiz now →
              </button>
            </div>
          ) : done ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="neu-box p-8 sm:p-10 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] text-center space-y-5"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FEF08A] border-[2.5px] border-[#2C2824] flex items-center justify-center text-4xl shadow-[4px_4px_0px_#2C2824]">
                <Trophy size={36} className="text-[#2C2824]" />
              </div>

              <div>
                <span className="sticker bg-[#BBF7D0] text-xs mb-2">
                  QUIZ COMPLETED
                </span>
                <div className="font-display font-black text-5xl text-[#2C2824] mt-2">
                  {pct}%
                </div>
                <p className="font-hand text-2xl text-[#2C2824] mt-1">
                  {pct === 100
                    ? "Perfect score! True soulmate tier 💗"
                    : pct >= 70
                    ? "Great job! Jane definitely approves ✨"
                    : "Not bad! Time to spend more time together 🌸"}
                </p>
                <p className="font-body text-xs text-[#7A7269] mt-1">
                  You scored {score} out of {questions.length} correct
                </p>
              </div>

              <button
                onClick={restart}
                className="neu-btn neu-btn-white text-xs py-2 px-6 shadow-[3px_3px_0px_#2C2824]"
              >
                <RotateCcw size={13} />
                <span>try again</span>
              </button>
            </motion.div>
          ) : (
            <div className="neu-box p-6 sm:p-8 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] space-y-6">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-display font-bold text-[#7A7269] mb-1.5">
                  <span>QUESTION {current + 1} OF {questions.length}</span>
                  <span>SCORE: {score}</span>
                </div>
                <div className="rpg-bar-container">
                  <div
                    className="rpg-bar-fill bg-[#FFCCD5]"
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-[#FAF5EE] p-5 rounded-2xl border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824]">
                <h2 className="font-display font-black text-lg sm:text-xl text-[#2C2824] leading-snug">
                  {q.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {(q.options as string[]).map((opt, i) => {
                  const isChosen = selected === i;
                  const isCorrect = i === q.correct_index;
                  const showResult = selected !== null;

                  let btnStyle = "bg-[#FFFDF9] hover:bg-[#FAF5EE]";
                  if (showResult) {
                    if (isCorrect) btnStyle = "bg-[#BBF7D0] border-[#2C2824]";
                    else if (isChosen) btnStyle = "bg-[#FFAAA6] border-[#2C2824]";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      className={`w-full p-4 rounded-xl border-2 border-[#2C2824] font-body text-sm text-left flex items-center justify-between gap-3 shadow-[2px_2px_0px_#2C2824] transition-all ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#FAF5EE] border border-[#2C2824] font-display font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-[#2C2824] font-medium">{opt}</span>
                      </div>

                      {showResult && isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-700 flex-shrink-0" />
                      )}
                      {showResult && isChosen && !isCorrect && (
                        <XCircle size={18} className="text-rose-700 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

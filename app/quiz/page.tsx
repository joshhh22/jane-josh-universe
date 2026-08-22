"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { QuizQuestion } from "@/lib/supabase/types";
import {
  Brain,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Play,
  Trash2,
  Heart,
  UserCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

// Starter Fallback Questions for Josh & Jane
const DEFAULT_JOSH_FOR_JANE: QuizQuestion[] = [
  {
    id: "j1",
    question: "If Jane could eat one comfort meal forever, it would be...",
    options: [
      "Ayam Geprek pedas 🍗🌶️",
      "Dry salad without dressing 🥗",
      "Plain crackers 🍪",
      "Black coffee only ☕",
    ],
    correct_index: 0,
    hint: "pedas dan gurih favorit jane!",
    creator: "josh",
    target: "jane",
    created_at: new Date().toISOString(),
  },
  {
    id: "j2",
    question: "What would Jane most likely be doing on a quiet Sunday morning?",
    options: [
      "Sleeping in cozy under the blanket 😴",
      "Going for a 10km marathon 🏃",
      "Cleaning the entire house 🧹",
      "Studying spreadsheets 📊",
    ],
    correct_index: 0,
    hint: "she loves maximum cozy rest",
    creator: "josh",
    target: "jane",
    created_at: new Date().toISOString(),
  },
  {
    id: "j3",
    question: "How loved is Jane Bernadine in this shared universe?",
    options: [
      "A little bit",
      "Normal amount",
      "Infinitely without limit 💗",
      "Can't measure",
    ],
    correct_index: 2,
    hint: "easiest question in the world",
    creator: "josh",
    target: "jane",
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_JANE_FOR_JOSH: QuizQuestion[] = [
  {
    id: "g1",
    question: "Siapa nama anak kucing virtual kesayangan kita di universe ini?",
    options: ["JJ 🐱", "Oyen 🐈", "Mochi 🐾", "Bobo 😴"],
    correct_index: 0,
    hint: "gabungan inisial Jane & Josh",
    creator: "jane",
    target: "josh",
    created_at: new Date().toISOString(),
  },
  {
    id: "g2",
    question: "Kalau Jane lagi bad mood atau cemberut, Josh harus apa?",
    options: [
      "Pesenin Ayam Geprek + kasih pelukan hangat 🍗🤗",
      "Ditinggal tidur 😴",
      "Dicuekin aja 🙈",
      "Diajak lari keliling lapangan 🏃",
    ],
    correct_index: 0,
    hint: "makanan enak dan perhatian penuh",
    creator: "jane",
    target: "josh",
    created_at: new Date().toISOString(),
  },
  {
    id: "g3",
    question: "Apa reaksi Josh pertama kali waktu Jane bilang 'I love you'?",
    options: [
      "Senyum lebar sampai salting parah 🥰",
      "Biasa aja 😐",
      "Kabur ketakutan 🏃",
      "Lupa ingatan 😵",
    ],
    correct_index: 0,
    hint: "salting level maksimal",
    creator: "jane",
    target: "josh",
    created_at: new Date().toISOString(),
  },
];

export default function QuizPage() {
  const { user, profile, isAdmin, isJane, isJosh } = useAuth();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const [activeTab, setActiveTab] = useState<"play" | "create" | "manage">("play");
  const [selectedTarget, setSelectedTarget] = useState<"jane" | "josh">("jane");
  const [dbQuestions, setDbQuestions] = useState<QuizQuestion[]>([]);

  // Quiz Gameplay State
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  // New Quiz Creator Form State
  const [newQuestion, setNewQuestion] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIdx, setCorrectIdx] = useState<number>(0);
  const [newHint, setNewHint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default target based on logged-in user:
  // If Josh logs in -> Plays questions made for Josh (target: "josh", creator: "jane")
  // If Jane logs in -> Plays questions made for Jane (target: "jane", creator: "josh")
  useEffect(() => {
    if (isJosh) {
      setSelectedTarget("josh");
    } else if (isJane) {
      setSelectedTarget("jane");
    }
  }, [isJosh, isJane]);

  // Fetch Questions from Supabase
  const fetchQuestions = async () => {
    try {
      const { data } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setDbQuestions(data as QuizQuestion[]);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter current active quiz questions
  const activeQuizList = useMemo(() => {
    const fromDb = dbQuestions.filter((q) => {
      // If target matches
      return (q.target || (q.creator === "josh" ? "jane" : "josh")) === selectedTarget;
    });

    if (fromDb.length > 0) return fromDb;

    // Fallback defaults
    return selectedTarget === "josh" ? DEFAULT_JANE_FOR_JOSH : DEFAULT_JOSH_FOR_JANE;
  }, [dbQuestions, selectedTarget]);

  // Handle Answer Selection
  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);

    const isCorrect = idx === activeQuizList[current].correct_index;
    if (isCorrect) {
      setScore((s) => s + 1);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#FEF08A", "#FFCCD5", "#BAE6FD"],
      });
    }

    setTimeout(() => {
      setSelected(null);
      if (current + 1 >= activeQuizList.length) {
        setDone(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#FFCCD5", "#FEF08A", "#BAE6FD", "#BBF7D0"],
        });
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1300);
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setStarted(true);
  };

  // Submit New Quiz Question
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !optA.trim() || !optB.trim()) {
      showToast("Please fill in question and at least 2 options!", { emoji: "✍️", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const creatorRole = isJane ? "jane" : "josh";
    const targetRole = isJane ? "josh" : "jane"; // Josh creates for Jane, Jane creates for Josh

    const options = [optA.trim(), optB.trim()];
    if (optC.trim()) options.push(optC.trim());
    if (optD.trim()) options.push(optD.trim());

    const payload = {
      question: newQuestion.trim(),
      options,
      correct_index: Math.min(correctIdx, options.length - 1),
      hint: newHint.trim() || null,
      creator: creatorRole,
      target: targetRole,
    };

    try {
      const { error } = await supabase.from("quiz_questions").insert(payload);
      if (error) {
        // Fallback in case columns aren't present
        await supabase.from("quiz_questions").insert({
          question: payload.question,
          options: payload.options,
          correct_index: payload.correct_index,
          hint: payload.hint,
        });
      }

      showToast(`Quiz question created for ${targetRole === "jane" ? "Jane 🌸" : "Josh 💻"}!`, {
        emoji: "🎉",
        type: "love",
      });

      setNewQuestion("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      setNewHint("");
      setCorrectIdx(0);
      setActiveTab("play");
      fetchQuestions();
    } catch (err) {
      console.error(err);
      showToast("Saved locally!", { emoji: "✨" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (id: string) => {
    await supabase.from("quiz_questions").delete().eq("id", id);
    setDbQuestions((prev) => prev.filter((q) => q.id !== id));
    showToast("Question deleted", { emoji: "🗑️" });
  };

  const q = activeQuizList[current];
  const targetLabel = selectedTarget === "jane" ? "Jane 🌸" : "Josh 💻";
  const creatorLabel = selectedTarget === "jane" ? "Josh 💻" : "Jane 🌸";

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Brain size={12} />
                <span>Couples Quiz Arena</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                jane × josh quiz 🧠
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                quizzes created with love to test how well we know each other ♡
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab("play");
                  setStarted(false);
                  setDone(false);
                }}
                className={`neu-btn text-xs py-2 px-3.5 flex items-center gap-1.5 ${
                  activeTab === "play" ? "neu-btn-pink" : "neu-btn-white"
                }`}
              >
                <Play size={13} />
                <span>Play Quiz</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActiveTab("create")}
                  className={`neu-btn text-xs py-2 px-3.5 flex items-center gap-1.5 ${
                    activeTab === "create" ? "neu-btn-yellow" : "neu-btn-white"
                  }`}
                >
                  <PlusCircle size={13} />
                  <span>Create Quiz</span>
                </button>
              )}
            </div>
          </div>

          {/* ══════════════════ TAB 1: PLAY QUIZ ══════════════════ */}
          {activeTab === "play" && (
            <div className="space-y-6">
              {/* Quiz Selection Switcher */}
              <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[4px_4px_0px_#2C2824] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <div>
                    <p className="font-display font-black text-sm text-[#2C2824]">
                      Playing: {creatorLabel}&apos;s Quiz for {targetLabel}
                    </p>
                    <p className="font-hand text-xs text-[#7A7269]">
                      {activeQuizList.length} question{activeQuizList.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FAF5EE] p-1 rounded-xl border-2 border-[#2C2824]/20">
                  <button
                    onClick={() => {
                      setSelectedTarget("jane");
                      setStarted(false);
                      setDone(false);
                      setCurrent(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
                      selectedTarget === "jane"
                        ? "bg-[#FFCCD5] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                        : "text-[#7A7269] hover:text-[#2C2824]"
                    }`}
                  >
                    🌸 For Jane (Made by Josh)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTarget("josh");
                      setStarted(false);
                      setDone(false);
                      setCurrent(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
                      selectedTarget === "josh"
                        ? "bg-[#BAE6FD] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                        : "text-[#7A7269] hover:text-[#2C2824]"
                    }`}
                  >
                    💻 For Josh (Made by Jane)
                  </button>
                </div>
              </div>

              {/* Start Screen */}
              {!started && !done && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="neu-box p-8 sm:p-12 text-center bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-5"
                >
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-4xl shadow-[4px_4px_0px_#2C2824] animate-bounce">
                    {selectedTarget === "jane" ? "🌸" : "💻"}
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2C2824]">
                      {creatorLabel}&apos;s Quiz for {targetLabel}
                    </h2>
                    <p className="font-hand text-xl text-[#7A7269]">
                      Are you ready to prove how well you remember every little detail?
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setStarted(true)}
                      className="neu-btn neu-btn-pink text-sm py-3 px-8 shadow-[4px_4px_0px_#2C2824] flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      <span>Start Quiz Now!</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Quiz In-Progress */}
              {started && !done && q && (
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="flex items-center justify-between text-xs font-display font-bold text-[#7A7269]">
                    <span>
                      Question {current + 1} of {activeQuizList.length}
                    </span>
                    <span>
                      Score: {score}/{current}
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF5EE] border-2 border-[#2C2824] rounded-full h-3.5 overflow-hidden">
                    <div
                      className="bg-[#FF8FAB] h-full transition-all duration-300"
                      style={{
                        width: `${((current + 1) / activeQuizList.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Question Card */}
                  <motion.div
                    key={q.id || current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="neu-box p-6 sm:p-8 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="sticker bg-[#FEF08A] text-[10px] py-0.5 px-2 font-bold">
                        Created by {creatorLabel}
                      </span>
                      <h2 className="font-display font-black text-xl sm:text-2xl text-[#2C2824] leading-snug">
                        {q.question}
                      </h2>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, idx) => {
                        let btnStyle = "bg-[#FAF5EE] hover:bg-[#FFFDF9] border-[#2C2824]";
                        if (selected !== null) {
                          if (idx === q.correct_index) {
                            btnStyle = "bg-[#BBF7D0] border-[#16A34A] text-[#14532D]";
                          } else if (idx === selected) {
                            btnStyle = "bg-[#FFCCD5] border-[#E11D48] text-[#881337]";
                          } else {
                            btnStyle = "opacity-40 bg-[#FAF5EE] border-[#2C2824]/20";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={selected !== null}
                            className={`p-4 rounded-xl border-2 text-left font-body font-semibold text-sm transition-all flex items-start gap-3 shadow-[2px_2px_0px_#2C2824] ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#FFFFFF] border border-[#2C2824] flex items-center justify-center text-xs font-display font-bold flex-shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {selected !== null && idx === q.correct_index && (
                              <CheckCircle2 size={18} className="text-[#16A34A] flex-shrink-0" />
                            )}
                            {selected === idx && idx !== q.correct_index && (
                              <XCircle size={18} className="text-[#E11D48] flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Hint / Reaction */}
                    {selected !== null && q.hint && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-[#FEF08A]/60 rounded-xl border border-[#2C2824]/20 text-xs font-hand text-[#2C2824] flex items-center gap-2"
                      >
                        <span>💡</span>
                        <span>{q.hint}</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Quiz Done / Results Screen */}
              {done && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="neu-box p-8 sm:p-12 text-center bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-6"
                >
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FEF08A] border-2 border-[#2C2824] flex items-center justify-center text-4xl shadow-[4px_4px_0px_#2C2824] animate-bounce">
                    🏆
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display font-black text-3xl text-[#2C2824]">
                      Quiz Completed!
                    </h2>
                    <p className="font-display font-black text-xl text-[#FF4D6D]">
                      Your Score: {score} / {activeQuizList.length}
                    </p>
                    <p className="font-hand text-xl text-[#7A7269] max-w-md mx-auto">
                      {score === activeQuizList.length
                        ? "100% PERFECT! You know your partner with your whole heart ♡"
                        : score >= activeQuizList.length / 2
                        ? "Great job! Almost perfect love memory! 🌸"
                        : "Hehe, time for more date nights to practice! ☕"}
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handleRestart}
                      className="neu-btn neu-btn-pink text-xs py-2.5 px-5 shadow-[3px_3px_0px_#2C2824] flex items-center gap-2"
                    >
                      <RotateCcw size={14} />
                      <span>Play Again</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* ══════════════════ TAB 2: CREATE QUIZ ══════════════════ */}
          {activeTab === "create" && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="neu-box p-6 sm:p-8 bg-[#FEF08A] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-6"
            >
              <div className="space-y-1 border-b-2 border-[#2C2824]/10 pb-3">
                <h2 className="font-display font-black text-2xl text-[#2C2824] flex items-center gap-2">
                  <span>✍️</span>
                  <span>
                    Create a Quiz Question for {isJane ? "Josh 💻" : "Jane 🌸"}
                  </span>
                </h2>
                <p className="font-hand text-lg text-[#7A7269]">
                  Write a question only you two would know the answer to!
                </p>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                {/* Question Input */}
                <div className="space-y-1.5">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                    Question Text
                  </label>
                  <input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. Di mana tempat pertama kali kita nonton bioskop bareng?"
                    required
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2.5 text-sm font-body bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824]"
                  />
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2 pt-2">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                    4 Multiple Choice Options (Select Radio Button for Correct Answer)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A */}
                    <div className="flex items-center gap-2 bg-[#FFFDF9] p-2 rounded-xl border-2 border-[#2C2824]">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 0}
                        onChange={() => setCorrectIdx(0)}
                        className="accent-[#FF4D6D] w-4 h-4 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">A:</span>
                      <input
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        placeholder="Option A (e.g. Grand Indonesia)"
                        required
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                    </div>

                    {/* Option B */}
                    <div className="flex items-center gap-2 bg-[#FFFDF9] p-2 rounded-xl border-2 border-[#2C2824]">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 1}
                        onChange={() => setCorrectIdx(1)}
                        className="accent-[#FF4D6D] w-4 h-4 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">B:</span>
                      <input
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        placeholder="Option B (e.g. Senayan City)"
                        required
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                    </div>

                    {/* Option C */}
                    <div className="flex items-center gap-2 bg-[#FFFDF9] p-2 rounded-xl border-2 border-[#2C2824]">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 2}
                        onChange={() => setCorrectIdx(2)}
                        className="accent-[#FF4D6D] w-4 h-4 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">C:</span>
                      <input
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        placeholder="Option C (Optional)"
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                    </div>

                    {/* Option D */}
                    <div className="flex items-center gap-2 bg-[#FFFDF9] p-2 rounded-xl border-2 border-[#2C2824]">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 3}
                        onChange={() => setCorrectIdx(3)}
                        className="accent-[#FF4D6D] w-4 h-4 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">D:</span>
                      <input
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        placeholder="Option D (Optional)"
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Hint / Note */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                    Sweet Reaction Note / Hint (Shown after answering)
                  </label>
                  <input
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="e.g. 'Pintar banget! Waktu itu kita nonton film kartun ♡'"
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2.5 text-sm font-body bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neu-btn neu-btn-pink text-xs py-3 px-6 shadow-[3px_3px_0px_#2C2824] flex items-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    <span>
                      {isSubmitting
                        ? "Saving Quiz..."
                        : `Save Quiz for ${isJane ? "Josh 💻" : "Jane 🌸"}`}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

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
  ListOrdered,
  HelpCircle,
  Check,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";

const STORAGE_KEY = "jane_josh_custom_quizzes_v2";

// Starter Fallback Questions
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
    created_at: "2026-01-01T00:00:00Z",
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
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "j3",
    question: "What is Jane's official trademark response in any decision?",
    options: [
      "'Terserah... tapi kamu yang pilihin' 🌸",
      "'Aku yang atur semuanya'",
      "'Gak mau tau'",
      "'Gas pol'",
    ],
    correct_index: 0,
    hint: "classic Jane logic",
    creator: "josh",
    target: "jane",
    created_at: "2026-01-03T00:00:00Z",
  },
  {
    id: "j4",
    question: "Apa hal yang paling bikin Jane gemas seharian?",
    options: [
      "Kucing JJ lagi bikin biskuit 🐱",
      "Tugas numpuk",
      "Macet di jalan",
      "Alarm pagi",
    ],
    correct_index: 0,
    hint: "anak bulu kita",
    creator: "josh",
    target: "jane",
    created_at: "2026-01-04T00:00:00Z",
  },
  {
    id: "j5",
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
    created_at: "2026-01-05T00:00:00Z",
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
    created_at: "2026-01-01T00:00:00Z",
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
    created_at: "2026-01-02T00:00:00Z",
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
    created_at: "2026-01-03T00:00:00Z",
  },
  {
    id: "g4",
    question: "Minuman favorit Jane kalau lagi nongkrong santai bareng Josh?",
    options: ["Matcha Latte / Iced Tea 🍵", "Jus Pare", "Air keran", "Kopi hitam pahit"],
    correct_index: 0,
    hint: "yang manis dan seger",
    creator: "jane",
    target: "josh",
    created_at: "2026-01-04T00:00:00Z",
  },
  {
    id: "g5",
    question: "Berapa banyak pelukan yang Jane butuhkan dari Josh setiap hari?",
    options: ["1 kali aja", "2 kali", "Unlimited sepanjang hari! 💖", "Gak usah"],
    correct_index: 2,
    hint: "selalu kangen",
    creator: "jane",
    target: "josh",
    created_at: "2026-01-05T00:00:00Z",
  },
];

export default function QuizPage() {
  const { user, profile, isAdmin, isJane, isJosh } = useAuth();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const [activeTab, setActiveTab] = useState<"play" | "create" | "manage">("play");
  const [selectedTarget, setSelectedTarget] = useState<"jane" | "josh">("jane");
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([
    ...DEFAULT_JOSH_FOR_JANE,
    ...DEFAULT_JANE_FOR_JOSH,
  ]);

  // Quiz Gameplay State
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  // New Question Form State
  const [newQuestion, setNewQuestion] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIdx, setCorrectIdx] = useState<number>(0);
  const [newHint, setNewHint] = useState("");
  const [targetFor, setTargetFor] = useState<"jane" | "josh">("jane");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from LocalStorage + Supabase
  const loadQuestions = async () => {
    let localSaved: QuizQuestion[] = [];
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(STORAGE_KEY);
        if (item) localSaved = JSON.parse(item);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const { data: dbData } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("created_at", { ascending: true });

      if (dbData && dbData.length > 0) {
        // Merge DB with local
        const merged = [...dbData];
        localSaved.forEach((loc) => {
          if (!merged.some((m) => m.id === loc.id || m.question === loc.question)) {
            merged.push(loc);
          }
        });
        setAllQuestions(merged);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    if (localSaved.length > 0) {
      setAllQuestions(localSaved);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Save to LocalStorage
  const persistQuestions = (updated: QuizQuestion[]) => {
    setAllQuestions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Set default target based on logged-in user:
  // If Josh logs in -> Target: "josh" (Plays quiz made FOR Josh)
  // If Jane logs in -> Target: "jane" (Plays quiz made FOR Jane)
  useEffect(() => {
    if (isJosh) {
      setSelectedTarget("josh");
      setTargetFor("jane"); // Josh creates for Jane
    } else if (isJane) {
      setSelectedTarget("jane");
      setTargetFor("josh"); // Jane creates for Josh
    }
  }, [isJosh, isJane]);

  // Questions filtered for currently selected target in Play Mode
  const activeQuizList = useMemo(() => {
    return allQuestions.filter(
      (q) => (q.target || (q.creator === "josh" ? "jane" : "josh")) === selectedTarget
    );
  }, [allQuestions, selectedTarget]);

  // Questions created by the current user (for Manage Tab)
  const myCreatedQuestions = useMemo(() => {
    const myRole = isJane ? "jane" : "josh";
    return allQuestions.filter((q) => q.creator === myRole || (!q.creator && q.target !== myRole));
  }, [allQuestions, isJane]);

  // Progress towards minimum 5 questions requirement
  const myTargetQuestionsCount = useMemo(() => {
    return allQuestions.filter((q) => q.target === targetFor).length;
  }, [allQuestions, targetFor]);

  // Handle Gameplay Selection
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
      showToast("Please fill question and at least 2 options!", { emoji: "✍️", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const creatorRole = isJane ? "jane" : "josh";
    const assignedTarget = targetFor;

    const options = [optA.trim(), optB.trim()];
    if (optC.trim()) options.push(optC.trim());
    if (optD.trim()) options.push(optD.trim());

    const newQ: QuizQuestion = {
      id: "q_" + Date.now(),
      question: newQuestion.trim(),
      options,
      correct_index: Math.min(correctIdx, options.length - 1),
      hint: newHint.trim() || null,
      creator: creatorRole,
      target: assignedTarget,
      created_at: new Date().toISOString(),
    };

    // 1. Immediately update client state & LocalStorage
    const updated = [newQ, ...allQuestions];
    persistQuestions(updated);

    // 2. Sync to Supabase in background
    try {
      await supabase.from("quiz_questions").insert({
        question: newQ.question,
        options: newQ.options,
        correct_index: newQ.correct_index,
        hint: newQ.hint,
        creator: newQ.creator,
        target: newQ.target,
      });
    } catch (err) {
      console.error("Supabase sync:", err);
    }

    showToast(
      `Question added! (${myTargetQuestionsCount + 1}/5 for ${
        assignedTarget === "jane" ? "Jane 🌸" : "Josh 💻"
      })`,
      { emoji: "🎉", type: "love" }
    );

    // Reset Form
    setNewQuestion("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setNewHint("");
    setCorrectIdx(0);
    setIsSubmitting(false);

    // Switch to manage tab so user sees their new question immediately
    setActiveTab("manage");
  };

  // Delete Question
  const handleDeleteQuestion = async (id: string) => {
    const updated = allQuestions.filter((q) => q.id !== id);
    persistQuestions(updated);

    try {
      await supabase.from("quiz_questions").delete().eq("id", id);
    } catch (err) {
      console.error(err);
    }

    showToast("Question deleted 🗑️", { emoji: "🗑️" });
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
                create custom quizzes for each other &amp; test how well we remember ♡
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2">
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
                <>
                  <button
                    onClick={() => setActiveTab("create")}
                    className={`neu-btn text-xs py-2 px-3.5 flex items-center gap-1.5 ${
                      activeTab === "create" ? "neu-btn-yellow" : "neu-btn-white"
                    }`}
                  >
                    <PlusCircle size={13} />
                    <span>Create Quiz</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("manage")}
                    className={`neu-btn text-xs py-2 px-3.5 flex items-center gap-1.5 ${
                      activeTab === "manage" ? "bg-[#BAE6FD] text-[#2C2824]" : "neu-btn-white"
                    }`}
                  >
                    <ListOrdered size={13} />
                    <span>Manage ({myCreatedQuestions.length})</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ══════════════════ TAB 1: PLAY QUIZ ══════════════════ */}
          {activeTab === "play" && (
            <div className="space-y-6">
              {/* Quiz Selection Switcher */}
              <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[4px_4px_0px_#2C2824] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-display font-black text-sm text-[#2C2824]">
                      Playing: {creatorLabel}&apos;s Quiz for {targetLabel}
                    </p>
                    <p className="font-hand text-xs text-[#7A7269]">
                      {activeQuizList.length} question{activeQuizList.length !== 1 ? "s" : ""} in this pack
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
                    🌸 For Jane (From Josh)
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
                    💻 For Josh (From Jane)
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
                      Total {activeQuizList.length} questions prepared with love. Ready to test your memory?
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setStarted(true)}
                      className="neu-btn neu-btn-pink text-sm py-3 px-8 shadow-[4px_4px_0px_#2C2824] flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      <span>Start {targetLabel}&apos;s Quiz!</span>
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
              {/* Header & 5 Questions Target Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2C2824]/10 pb-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-[#2C2824] flex items-center gap-2">
                    <span>✍️</span>
                    <span>
                      Create Quiz Question for {targetFor === "jane" ? "Jane 🌸" : "Josh 💻"}
                    </span>
                  </h2>
                  <p className="font-hand text-lg text-[#7A7269]">
                    Set a question only you two would know the answer to!
                  </p>
                </div>

                {/* 5-Questions Badge */}
                <div className="bg-[#FFFDF9] border-2 border-[#2C2824] p-2.5 rounded-xl shadow-[2px_2px_0px_#2C2824] text-center flex-shrink-0">
                  <p className="text-[10px] font-display font-bold uppercase tracking-wider text-[#7A7269]">
                    Quiz Pack Progress
                  </p>
                  <p className="font-display font-black text-sm text-[#FF4D6D]">
                    {myTargetQuestionsCount} / 5 Questions Added
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                {/* Target Selector */}
                <div className="space-y-1.5">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                    This Question is For:
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTargetFor("jane")}
                      className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        targetFor === "jane"
                          ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                          : "bg-[#FFFDF9] border-[#2C2824]/30"
                      }`}
                    >
                      <span>🌸 For Jane (Jane will answer)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetFor("josh")}
                      className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        targetFor === "josh"
                          ? "bg-[#BAE6FD] border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                          : "bg-[#FFFDF9] border-[#2C2824]/30"
                      }`}
                    >
                      <span>💻 For Josh (Josh will answer)</span>
                    </button>
                  </div>
                </div>

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
                <div className="space-y-2 pt-1">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                    4 Multiple Choice Options (Click Radio Button to Mark Correct Answer)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A */}
                    <div
                      onClick={() => setCorrectIdx(0)}
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${
                        correctIdx === 0
                          ? "bg-[#BBF7D0] border-[#16A34A] shadow-[2px_2px_0px_#16A34A]"
                          : "bg-[#FFFDF9] border-[#2C2824]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 0}
                        onChange={() => setCorrectIdx(0)}
                        className="accent-[#16A34A] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">A:</span>
                      <input
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        placeholder="Option A (Required)"
                        required
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                      {correctIdx === 0 && <Check size={14} className="text-[#16A34A] flex-shrink-0" />}
                    </div>

                    {/* Option B */}
                    <div
                      onClick={() => setCorrectIdx(1)}
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${
                        correctIdx === 1
                          ? "bg-[#BBF7D0] border-[#16A34A] shadow-[2px_2px_0px_#16A34A]"
                          : "bg-[#FFFDF9] border-[#2C2824]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 1}
                        onChange={() => setCorrectIdx(1)}
                        className="accent-[#16A34A] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">B:</span>
                      <input
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        placeholder="Option B (Required)"
                        required
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                      {correctIdx === 1 && <Check size={14} className="text-[#16A34A] flex-shrink-0" />}
                    </div>

                    {/* Option C */}
                    <div
                      onClick={() => setCorrectIdx(2)}
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${
                        correctIdx === 2
                          ? "bg-[#BBF7D0] border-[#16A34A] shadow-[2px_2px_0px_#16A34A]"
                          : "bg-[#FFFDF9] border-[#2C2824]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 2}
                        onChange={() => setCorrectIdx(2)}
                        className="accent-[#16A34A] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">C:</span>
                      <input
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        placeholder="Option C (Optional)"
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                      {correctIdx === 2 && <Check size={14} className="text-[#16A34A] flex-shrink-0" />}
                    </div>

                    {/* Option D */}
                    <div
                      onClick={() => setCorrectIdx(3)}
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${
                        correctIdx === 3
                          ? "bg-[#BBF7D0] border-[#16A34A] shadow-[2px_2px_0px_#16A34A]"
                          : "bg-[#FFFDF9] border-[#2C2824]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctIdx === 3}
                        onChange={() => setCorrectIdx(3)}
                        className="accent-[#16A34A] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-display font-bold text-xs text-[#2C2824]">D:</span>
                      <input
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        placeholder="Option D (Optional)"
                        className="w-full bg-transparent text-sm font-body focus:outline-none"
                      />
                      {correctIdx === 3 && <Check size={14} className="text-[#16A34A] flex-shrink-0" />}
                    </div>
                  </div>
                </div>

                {/* Hint / Note */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                    Sweet Reaction Note / Clue (Shown after answering)
                  </label>
                  <input
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="e.g. 'Pintar banget! Waktu itu kita nonton film kartun ♡'"
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2.5 text-sm font-body bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-3 flex items-center justify-between">
                  <span className="font-hand text-sm text-[#7A7269]">
                    {myTargetQuestionsCount < 5
                      ? `Add ${5 - myTargetQuestionsCount} more to reach standard 5-question pack!`
                      : "🎉 Minimum 5 questions reached!"}
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neu-btn neu-btn-pink text-xs py-3 px-6 shadow-[3px_3px_0px_#2C2824] flex items-center gap-2 disabled:opacity-50"
                  >
                    <PlusCircle size={14} />
                    <span>
                      {isSubmitting
                        ? "Saving..."
                        : `Add Question to ${targetFor === "jane" ? "Jane's" : "Josh's"} Quiz`}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ══════════════════ TAB 3: MANAGE QUIZZES ══════════════════ */}
          {activeTab === "manage" && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[4px_4px_0px_#2C2824] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-black text-lg text-[#2C2824]">
                    📋 All Custom &amp; Active Quizzes ({allQuestions.length})
                  </h2>
                  <p className="font-hand text-xs text-[#7A7269]">
                    View all questions or delete outdated ones with one click!
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("create")}
                  className="neu-btn neu-btn-yellow text-xs py-2 px-4 shadow-[2px_2px_0px_#2C2824] flex items-center gap-1.5"
                >
                  <PlusCircle size={13} />
                  <span>Add New Question</span>
                </button>
              </div>

              {/* Question List */}
              <div className="space-y-3">
                {allQuestions.map((questionItem, idx) => {
                  const isForJane = questionItem.target === "jane" || questionItem.creator === "josh";

                  return (
                    <div
                      key={questionItem.id || idx}
                      className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`sticker text-[9px] py-0.5 px-2 font-bold ${
                                isForJane ? "bg-[#FFCCD5]" : "bg-[#BAE6FD]"
                              }`}
                            >
                              {isForJane ? "🌸 For Jane" : "💻 For Josh"}
                            </span>
                            <span className="font-display font-bold text-xs text-[#7A7269]">
                              Q#{idx + 1}
                            </span>
                          </div>
                          <p className="font-display font-black text-sm text-[#2C2824]">
                            {questionItem.question}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteQuestion(questionItem.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex-shrink-0"
                          title="Delete this question"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Options with Highlighted Correct Answer */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {questionItem.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-body flex items-center gap-2 ${
                              oIdx === questionItem.correct_index
                                ? "bg-[#BBF7D0] border-[#16A34A] text-[#14532D] font-bold"
                                : "bg-[#FAF5EE] border-[#2C2824]/20 text-[#7A7269]"
                            }`}
                          >
                            <span className="w-4 h-4 rounded bg-[#FFFFFF] flex items-center justify-center text-[10px] font-bold border border-current">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="truncate">{opt}</span>
                            {oIdx === questionItem.correct_index && (
                              <span className="ml-auto text-[10px] font-bold text-[#16A34A]">
                                ✓ Correct
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {questionItem.hint && (
                        <p className="text-[11px] font-hand text-[#7A7269] italic pt-1 border-t border-[#2C2824]/10">
                          💡 Clue: {questionItem.hint}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

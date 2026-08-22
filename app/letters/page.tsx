"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Letter } from "@/lib/supabase/types";
import { Send, Mail, MailOpen, X, ChevronDown, Sparkles, Heart } from "lucide-react";

const MOODS = ["💗", "🥰", "🌸", "✨", "😊", "😔", "🎉", "💭"];

function LetterCard({
  letter,
  profiles,
  currentUserId,
  onRead,
}: {
  letter: Letter;
  profiles: Record<string, { display_name: string; avatar_emoji: string; username: string }>;
  currentUserId?: string;
  onRead: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const sender = profiles[letter.sender];
  const isForMe = letter.recipient === currentUserId;
  const isUnread = !letter.is_read && isForMe;

  const handleToggle = () => {
    setOpen(!open);
    if (isUnread && !open) onRead(letter.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`neu-box p-5 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] cursor-pointer transition-all ${
        isUnread ? "bg-[#FFCCD5]/40 border-[#FFAAA6]" : ""
      }`}
      onClick={handleToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-xl shadow-[2px_2px_0px_#2C2824] flex-shrink-0">
            {isUnread ? "💌" : "📨"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display font-black text-sm text-[#2C2824] truncate">
                {sender?.avatar_emoji || "👤"} {sender?.display_name || "Someone"}
              </p>
              {letter.mood && <span className="text-sm">{letter.mood}</span>}
              {isUnread && (
                <span className="sticker bg-[#FEF08A] text-[9px] py-0.5 px-2">
                  NEW
                </span>
              )}
            </div>
            {letter.title && (
              <p className="font-display font-bold text-xs text-[#7A7269] truncate mt-0.5">
                &ldquo;{letter.title}&rdquo;
              </p>
            )}
            <p className="font-body text-[11px] text-[#7A7269]/80 mt-0.5">
              {new Date(letter.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg border border-[#2C2824]/20 bg-[#FAF5EE]">
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t-2 border-[#2C2824]/15 bg-[#FAF5EE] p-4 rounded-xl border border-[#2C2824]/10">
              <p className="font-body text-sm text-[#2C2824] leading-relaxed whitespace-pre-wrap">
                {letter.body}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LettersPage() {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [profiles, setProfiles] = useState<
    Record<string, { display_name: string; avatar_emoji: string; username: string }>
  >({});
  const [recipient, setRecipient] = useState<{ id: string; display_name: string; avatar_emoji: string } | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedMood, setSelectedMood] = useState("💗");
  const [sending, setSending] = useState(false);

  const fetchLetters = async () => {
    const { data: ps } = await supabase.from("profiles").select("id, username, display_name, avatar_emoji");
    if (ps) {
      const map: typeof profiles = {};
      ps.forEach((p) => {
        map[p.id] = p;
      });
      setProfiles(map);
      const other = ps.find((p) => p.id !== user?.id);
      if (other) setRecipient(other);
    }

    const { data: ls } = await supabase.from("letters").select("*").order("created_at", { ascending: false });
    if (ls) setLetters(ls as Letter[]);
  };

  useEffect(() => {
    fetchLetters();
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("letters").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, is_read: true } : l)));
  };

  const sendLetter = async () => {
    if (!user || !recipient || !body.trim()) return;
    setSending(true);

    await supabase.from("letters").insert({
      sender: user.id,
      recipient: recipient.id,
      title: title.trim() || null,
      body: body.trim(),
      mood: selectedMood,
    });

    showToast(`Letter sent to ${recipient.display_name}! 💌`, { emoji: "💌", type: "love" });
    setTitle("");
    setBody("");
    setShowCompose(false);
    setSending(false);
    fetchLetters();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCCD5] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Mail size={12} />
                <span>Our Private Post</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                our mailbox 💌
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                {letters.length} letter{letters.length !== 1 ? "s" : ""} exchanged so far
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowCompose(!showCompose)}
                className="neu-btn neu-btn-pink text-xs py-2 px-4 shadow-[3px_3px_0px_#2C2824]"
              >
                <Send size={13} />
                <span>write a new letter</span>
              </button>
            )}
          </div>

          {/* Compose Form Modal/Box */}
          <AnimatePresence>
            {showCompose && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-box p-6 bg-[#FEF08A] border-[2.5px] border-[#2C2824] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-base text-[#2C2824] flex items-center gap-2">
                      <span>✍️</span>
                      <span>
                        letter to {recipient?.avatar_emoji || "🌸"} {recipient?.display_name || "Jane"}
                      </span>
                    </h2>
                    <button
                      onClick={() => setShowCompose(false)}
                      className="p-1 rounded-lg hover:bg-[#FAF5EE]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="letter subject (optional)..."
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                  />

                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="write your thoughts, feelings, or cute stories here..."
                    rows={5}
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none resize-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs text-[#2C2824]">mood tag:</span>
                      <div className="flex gap-1.5">
                        {MOODS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedMood(m)}
                            className={`text-lg p-1 rounded-lg border-2 transition-transform ${
                              selectedMood === m
                                ? "bg-[#FFCCD5] border-[#2C2824] scale-110"
                                : "border-transparent hover:scale-110"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={sendLetter}
                      disabled={!body.trim() || sending}
                      className="neu-btn neu-btn-pink text-xs py-2 px-5 disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span>{sending ? "delivering..." : "send letter 💌"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letter list */}
          {letters.length === 0 ? (
            <div className="neu-box p-12 bg-[#FFFDF9] border-2 border-dashed border-[#2C2824]/20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-3xl shadow-[3px_3px_0px_#2C2824]">
                📭
              </div>
              <p className="font-hand text-2xl text-[#2C2824]">the mailbox is waiting</p>
              <p className="font-body text-xs text-[#7A7269]">
                write the very first letter to start our personal archive 🌸
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {letters.map((l) => (
                <LetterCard
                  key={l.id}
                  letter={l}
                  profiles={profiles}
                  currentUserId={user?.id}
                  onRead={markRead}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

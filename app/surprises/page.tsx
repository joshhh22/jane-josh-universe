"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Surprise } from "@/lib/supabase/types";
import { Gift, Plus, X, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

const TYPES = [
  { key: "text", label: "Cute Message", emoji: "💬" },
  { key: "joke", label: "Inside Joke", emoji: "😂" },
  { key: "song", label: "Secret Song", emoji: "🎵" },
];

function SurpriseBox({ surprise, onOpen }: { surprise: Surprise; onOpen: () => void }) {
  const [opened, setOpened] = useState(surprise.is_opened);
  const [animating, setAnimating] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setAnimating(true);
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFCCD5", "#D8D2FF", "#FEF08A", "#BBF7D0"],
      });
      setOpened(true);
      setAnimating(false);
      onOpen();
    }, 600);
  };

  return (
    <div className="neu-box p-6 bg-[#FFAAA6] border-[2.5px] border-[#2C2824] flex flex-col items-center text-center gap-3">
      {!opened ? (
        <>
          <motion.div
            animate={animating ? { rotate: [0, -12, 12, -12, 0], scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="text-6xl sm:text-7xl cursor-pointer select-none py-2 hover:scale-110 transition-transform"
            onClick={handleOpen}
          >
            🎁
          </motion.div>
          <h3 className="font-display font-black text-lg text-[#2C2824]">
            you have an unopened surprise!
          </h3>
          <p className="font-hand text-base text-[#2C2824]/80">
            sent with love &bull; tap the button below to open
          </p>
          <button
            onClick={handleOpen}
            className="neu-btn neu-btn-yellow text-xs py-2 px-6 shadow-[3px_3px_0px_#2C2824]"
          >
            {animating ? "opening gift..." : "unwrap surprise 🎁"}
          </button>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full space-y-3"
        >
          <span className="sticker bg-[#FFFDF9] text-xs">
            <span>✨</span>
            <span>SURPRISE REVEALED</span>
          </span>
          {surprise.title && (
            <h3 className="font-display font-black text-xl text-[#2C2824]">
              &ldquo;{surprise.title}&rdquo;
            </h3>
          )}
          <div className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] text-left">
            <p className="font-body text-sm text-[#2C2824] leading-relaxed whitespace-pre-wrap">
              {surprise.content}
            </p>
          </div>
          <p className="font-hand text-xs text-[#2C2824]/70">
            opened with love 💗
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function SurprisesPage() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [surprises, setSurprises] = useState<Surprise[]>([]);
  const [recipient, setRecipient] = useState<{ id: string; display_name: string; avatar_emoji: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", content_type: "text" });
  const [sending, setSending] = useState(false);

  const fetchSurprises = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("surprises")
      .select("*")
      .or(`to_user.eq.${user.id},from_user.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (data) setSurprises(data as Surprise[]);

    const { data: ps } = await supabase.from("profiles").select("id, display_name, avatar_emoji, username");
    if (ps) {
      const other = ps.find((p) => p.id !== user.id);
      if (other) setRecipient(other);
    }
  };

  useEffect(() => {
    fetchSurprises();
  }, [user]);

  const sendSurprise = async () => {
    if (!user || !recipient || !form.content.trim()) return;
    setSending(true);

    await supabase.from("surprises").insert({
      from_user: user.id,
      to_user: recipient.id,
      content_type: form.content_type as Surprise["content_type"],
      content: form.content.trim(),
      title: form.title.trim() || null,
    });

    showToast(`Surprise package hidden for ${recipient.display_name}! 🎁`, { emoji: "🎁", type: "love" });
    setForm({ title: "", content: "", content_type: "text" });
    setShowForm(false);
    setSending(false);
    fetchSurprises();
  };

  const openSurprise = async (id: string) => {
    await supabase.from("surprises").update({ is_opened: true, opened_at: new Date().toISOString() }).eq("id", id);
    fetchSurprises();
  };

  const myPending = surprises.filter((s) => s.to_user === user?.id && !s.is_opened);
  const myOpened = surprises.filter((s) => s.to_user === user?.id && s.is_opened);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFAAA6] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Gift size={12} />
                <span>Mystery Box</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                surprise box 🎁
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                leave sweet notes and mystery gifts for each other
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="neu-btn neu-btn-pink text-xs py-2 px-4 shadow-[3px_3px_0px_#2C2824]"
              >
                <Plus size={13} />
                <span>leave a surprise</span>
              </button>
            )}
          </div>

          {/* Form */}
          <AnimatePresence>
            {showForm && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-box p-6 bg-[#FEF08A] border-[2.5px] border-[#2C2824] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-base text-[#2C2824] flex items-center gap-2">
                      <span>🎁</span>
                      <span>hide a surprise for {recipient?.avatar_emoji || "🌸"} {recipient?.display_name || "Jane"}</span>
                    </h2>
                    <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-[#FAF5EE]">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setForm({ ...form, content_type: t.key })}
                        className={`px-3 py-1.5 rounded-xl border-2 font-display font-bold text-xs flex items-center gap-1.5 transition-all ${
                          form.content_type === t.key
                            ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                            : "bg-[#FFFDF9] border-[#2C2824]/30 hover:border-[#2C2824]"
                        }`}
                      >
                        <span>{t.emoji}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>

                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="surprise title (e.g. Open when you need a smile)..."
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                  />

                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="write your secret note or message..."
                    rows={4}
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none resize-none"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={sendSurprise}
                      disabled={!form.content.trim() || sending}
                      className="neu-btn neu-btn-pink text-xs py-2 px-5 disabled:opacity-50"
                    >
                      <Gift size={13} />
                      <span>{sending ? "hiding gift..." : "hide surprise 🎁"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pending Surprises */}
          {myPending.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display font-black text-xl text-[#2C2824] flex items-center gap-2">
                <span>✨</span>
                <span>unopened surprises for you</span>
              </h2>
              <div className="space-y-3">
                {myPending.map((s) => (
                  <SurpriseBox key={s.id} surprise={s} onOpen={() => openSurprise(s.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Opened Surprises Archive */}
          {myOpened.length > 0 && (
            <div className="neu-box p-6 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] space-y-3">
              <h2 className="font-display font-bold text-base text-[#2C2824]">
                opened surprises archive
              </h2>
              <div className="space-y-2">
                {myOpened.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-[#FAF5EE] border border-[#2C2824]/20 space-y-1"
                  >
                    {s.title && (
                      <p className="font-display font-bold text-xs text-[#2C2824]">&ldquo;{s.title}&rdquo;</p>
                    )}
                    <p className="font-body text-xs text-[#7A7269]">{s.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!user && (
            <div className="neu-box p-12 bg-[#FFFDF9] border-2 border-dashed border-[#2C2824]/20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-[#FFAAA6] border-2 border-[#2C2824] flex items-center justify-center text-3xl shadow-[3px_3px_0px_#2C2824]">
                🎁
              </div>
              <p className="font-hand text-2xl text-[#2C2824]">sign in to reveal your surprises</p>
              <p className="font-body text-xs text-[#7A7269]">
                only Jane and Josh can unwrap their personalized gift boxes 🌸
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

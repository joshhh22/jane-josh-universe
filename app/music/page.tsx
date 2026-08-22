"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Song } from "@/lib/supabase/types";
import { Plus, ExternalLink, Music, Disc, X, Sparkles } from "lucide-react";

export default function MusicPage() {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();

  type SongWithProfile = Song & { profiles: { display_name: string; avatar_emoji: string; username: string } };
  const [songs, setSongs] = useState<SongWithProfile[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", url: "", reason: "" });
  const [adding, setAdding] = useState(false);

  const fetchSongs = async () => {
    const { data } = await supabase
      .from("songs")
      .select("*, profiles(display_name, avatar_emoji, username)")
      .order("created_at", { ascending: false });
    if (data) setSongs(data as SongWithProfile[]);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const addSong = async () => {
    if (!user || !form.title.trim() || !form.artist.trim()) return;
    setAdding(true);

    await supabase.from("songs").insert({
      title: form.title.trim(),
      artist: form.artist.trim(),
      url: form.url.trim() || null,
      added_by: user.id,
      reason: form.reason.trim() || null,
    });

    showToast(`${form.title} added to our soundtrack! 🎵`, { emoji: "🎧", type: "love" });
    setForm({ title: "", artist: "", url: "", reason: "" });
    setShowAdd(false);
    setSendingSong(false);
    fetchSongs();
  };

  const [sendingSong, setSendingSong] = useState(false);

  const janeSongs = songs.filter((s) => s.profiles?.username === "jane");
  const joshSongs = songs.filter((s) => s.profiles?.username === "josh");
  const otherSongs = songs.filter((s) => s.profiles?.username !== "jane" && s.profiles?.username !== "josh");

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8D2FF] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Music size={12} />
                <span>Our Shared Mixtape</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                our soundtrack 🎧
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                {songs.length} song{songs.length !== 1 ? "s" : ""} on our eternal playlist
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="neu-btn neu-btn-lavender text-xs py-2 px-4 shadow-[3px_3px_0px_#2C2824]"
              >
                <Plus size={13} />
                <span>add a song</span>
              </button>
            )}
          </div>

          {/* Add Song Form */}
          <AnimatePresence>
            {showAdd && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-box p-6 bg-[#D8D2FF] border-[2.5px] border-[#2C2824] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-base text-[#2C2824] flex items-center gap-2">
                      <span>🎵</span>
                      <span>add a song to the mixtape</span>
                    </h2>
                    <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-[#FAF5EE]">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="song title *"
                      className="border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                    />
                    <input
                      value={form.artist}
                      onChange={(e) => setForm({ ...form, artist: e.target.value })}
                      placeholder="artist name *"
                      className="border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                    />
                    <input
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder="spotify / youtube link (optional)"
                      className="sm:col-span-2 border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                    />
                    <textarea
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      placeholder="why does this song remind you of us?"
                      rows={2}
                      className="sm:col-span-2 border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={addSong}
                      disabled={!form.title.trim() || !form.artist.trim() || adding}
                      className="neu-btn neu-btn-pink text-xs py-2 px-5 disabled:opacity-50"
                    >
                      <Plus size={13} />
                      <span>{adding ? "adding..." : "add track 🎵"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Split Pick Section */}
          {songs.length === 0 ? (
            <div className="neu-box p-12 bg-[#FFFDF9] border-2 border-dashed border-[#2C2824]/20 text-center flex flex-col items-center justify-center gap-3">
              <Disc size={40} className="text-[#7A7269] animate-spin" style={{ animationDuration: "8s" }} />
              <p className="font-hand text-2xl text-[#2C2824]">the jukebox is quiet</p>
              <p className="font-body text-xs text-[#7A7269]">
                add songs that define our shared universe ♪
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jane's Picks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-[#2C2824]/15">
                  <span className="text-xl">🌸</span>
                  <h2 className="font-display font-black text-lg text-[#2C2824]">jane&apos;s picks</h2>
                  <span className="sticker bg-[#FFCCD5] text-[10px] ml-auto">
                    {janeSongs.length} TRACKS
                  </span>
                </div>

                <div className="space-y-3">
                  {janeSongs.length === 0 ? (
                    <p className="font-hand text-sm text-[#7A7269] p-4 text-center">
                      no tracks added by Jane yet 🌸
                    </p>
                  ) : (
                    janeSongs.map((s) => (
                      <div
                        key={s.id}
                        className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl">🎵</span>
                            <div className="min-w-0">
                              <p className="font-display font-bold text-sm text-[#2C2824] truncate">
                                {s.title}
                              </p>
                              <p className="font-body text-xs text-[#7A7269] truncate">
                                {s.artist}
                              </p>
                            </div>
                          </div>
                          {s.url && (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="neu-btn neu-btn-pink p-1.5 text-xs rounded-lg"
                              title="Listen"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        {s.reason && (
                          <p className="font-hand text-xs text-[#2C2824]/80 pl-7 italic">
                            &ldquo;{s.reason}&rdquo;
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Josh's Picks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-[#2C2824]/15">
                  <span className="text-xl">💻</span>
                  <h2 className="font-display font-black text-lg text-[#2C2824]">josh&apos;s picks</h2>
                  <span className="sticker bg-[#BAE6FD] text-[10px] ml-auto">
                    {joshSongs.length} TRACKS
                  </span>
                </div>

                <div className="space-y-3">
                  {joshSongs.length === 0 ? (
                    <p className="font-hand text-sm text-[#7A7269] p-4 text-center">
                      no tracks added by Josh yet 💻
                    </p>
                  ) : (
                    joshSongs.map((s) => (
                      <div
                        key={s.id}
                        className="neu-box p-4 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl">🎧</span>
                            <div className="min-w-0">
                              <p className="font-display font-bold text-sm text-[#2C2824] truncate">
                                {s.title}
                              </p>
                              <p className="font-body text-xs text-[#7A7269] truncate">
                                {s.artist}
                              </p>
                            </div>
                          </div>
                          {s.url && (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="neu-btn neu-btn-blue p-1.5 text-xs rounded-lg"
                              title="Listen"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        {s.reason && (
                          <p className="font-hand text-xs text-[#2C2824]/80 pl-7 italic">
                            &ldquo;{s.reason}&rdquo;
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

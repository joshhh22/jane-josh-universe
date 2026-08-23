"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Song } from "@/lib/supabase/types";
import {
  Plus,
  ExternalLink,
  Music,
  Disc,
  X,
  Sparkles,
  Heart,
  Trash2,
  Play,
  Volume2,
} from "lucide-react";

const STORAGE_SONGS_KEY = "jane_josh_songs_v2";

// Default Song Letter Cards with Real Album Covers & Sentimental Letters
const DEFAULT_SONGS: (Song & { album_cover?: string; recipient?: string })[] = [
  {
    id: "song_1",
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    album_cover: "https://i.scdn.co/image/ab67616d0000b273b40092285e683416e9c93a0b",
    url: "https://open.spotify.com/track/3AVrVz5rKTrbeAcgpEt6uk",
    reason: "i still use the playlist u made pas aku sedih... it still helps somehow",
    recipient: "jane",
    added_by: "josh_id",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "song_2",
    title: "seasons",
    artist: "wave to earth",
    album_cover: "https://i.scdn.co/image/ab67616d0000b2737c35e3810243491d90c00d4d",
    url: "https://open.spotify.com/track/1P0sF0b686e0lU5tY7o45S",
    reason: "lagu ini selalu ngingetin aku waktu kita naik mobil malem-malem sambil liatin lampu kota bareng kamu ♡",
    recipient: "josh",
    added_by: "jane_id",
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "song_3",
    title: "double take",
    artist: "dhruv",
    album_cover: "https://i.scdn.co/image/ab67616d0000b273a7d9de748c9df48d08cbda2c",
    url: "https://open.spotify.com/track/2qX5YezrzNTDEQ9Mu4Aq4M",
    reason: "do you remember the day i first realized i was completely in love with you? this song captures that exact feeling.",
    recipient: "jane",
    added_by: "josh_id",
    created_at: "2026-01-03T00:00:00Z",
  },
  {
    id: "song_4",
    title: "Lover",
    artist: "Taylor Swift",
    album_cover: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
    url: "https://open.spotify.com/track/1dGr1c8CrMLDpV6mPb2Ovg",
    reason: "can i go where you go? can we always be this close forever and ever and ever? 💗",
    recipient: "josh",
    added_by: "jane_id",
    created_at: "2026-01-04T00:00:00Z",
  },
];

// Quick Song Presets for Easy Adding
const SONG_PRESETS = [
  {
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    cover: "https://i.scdn.co/image/ab67616d0000b273b40092285e683416e9c93a0b",
    url: "https://open.spotify.com/track/3AVrVz5rKTrbeAcgpEt6uk",
  },
  {
    title: "seasons",
    artist: "wave to earth",
    cover: "https://i.scdn.co/image/ab67616d0000b2737c35e3810243491d90c00d4d",
    url: "https://open.spotify.com/track/1P0sF0b686e0lU5tY7o45S",
  },
  {
    title: "double take",
    artist: "dhruv",
    cover: "https://i.scdn.co/image/ab67616d0000b273a7d9de748c9df48d08cbda2c",
    url: "https://open.spotify.com/track/2qX5YezrzNTDEQ9Mu4Aq4M",
  },
  {
    title: "Lover",
    artist: "Taylor Swift",
    cover: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
    url: "https://open.spotify.com/track/1dGr1c8CrMLDpV6mPb2Ovg",
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    cover: "https://i.scdn.co/image/ab67616d0000b27339794cb4c28bb0f15c7e145f",
    url: "https://open.spotify.com/track/0T5iIrttAqIkxKaTw4zSPi",
  },
  {
    title: "About You",
    artist: "The 1975",
    cover: "https://i.scdn.co/image/ab67616d0000b2731c3603d7c54162e088d447a1",
    url: "https://open.spotify.com/track/1fDFclhg60MuWGDvdwxvd9",
  },
];

// Spotify Icon Component
function SpotifyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.307c-.218.358-.684.472-1.042.254-2.853-1.743-6.444-2.138-10.675-1.171-.41.094-.823-.162-.917-.572-.093-.41.163-.823.573-.917 4.634-1.06 8.59-.617 11.807 1.346.358.218.472.684.254 1.042zm1.47-3.268c-.276.448-.863.593-1.311.317-3.264-2.006-8.24-2.588-12.099-1.417-.504.153-1.037-.137-1.19-.64-.153-.503.137-1.037.64-1.19 4.417-1.341 9.907-.69 13.643 1.619.448.276.593.863.317 1.311zm.126-3.414c-3.914-2.324-10.366-2.538-14.11-1.399-.6.182-1.237-.163-1.42-.763-.182-.6.164-1.237.763-1.42 4.305-1.307 11.416-1.06 15.918 1.612.54.32.716 1.02.396 1.56-.32.54-1.02.716-1.56.396z" />
    </svg>
  );
}

// ─── MUSIC LETTER CARD (Matches Screenshot Exactly) ──────────
function MusicLetterCard({
  song,
  isAdmin,
  onDelete,
}: {
  song: Song & { album_cover?: string | null; recipient?: string | null };
  isAdmin: boolean;
  onDelete: (id: string) => void;
}) {
  const isForJane = song.recipient === "jane";
  const recipientName = isForJane ? "jane" : "josh";
  const defaultCover =
    song.album_cover ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="neu-box bg-[#FFFDF9] border-[2px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform"
    >
      {/* Top Header Row */}
      <div className="p-4 pb-1 flex items-center justify-between">
        {/* Recipient Pill */}
        <div className="bg-[#FAF5EE] border border-[#2C2824]/20 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-display font-bold text-[#2C2824]">
          <span className="text-[#7A7269] font-normal">To:</span>
          <span>{recipientName}</span>
        </div>

        {/* Delete Button (If Admin) */}
        {isAdmin && (
          <button
            onClick={() => onDelete(song.id)}
            className="p-1.5 text-[#7A7269] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete this song letter"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Center Body: Handwritten Mini Letter Note */}
      <div className="px-5 py-4 min-h-[110px] flex items-center">
        <p className="font-hand text-xl sm:text-2xl text-[#2C2824] leading-relaxed whitespace-pre-wrap">
          {song.reason || "this song will always remind me of you..."}
        </p>
      </div>

      {/* Bottom Row: Spotify Song Banner */}
      <div className="p-3.5 bg-[#F3F4F6] border-t-2 border-[#2C2824]/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Album Cover Art */}
          <img
            src={defaultCover}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover border border-[#2C2824]/15 shadow-sm flex-shrink-0 bg-[#2C2824]"
            onError={(e) => {
              // Fallback image if broken
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80";
            }}
          />
          <div className="min-w-0">
            <p className="font-display font-black text-sm text-[#2C2824] truncate">
              {song.title}
            </p>
            <p className="font-body text-xs text-[#7A7269] truncate">
              {song.artist}
            </p>
          </div>
        </div>

        {/* Spotify Logo Link */}
        {song.url ? (
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#2C2824] hover:text-[#1DB954] hover:scale-110 transition-all flex-shrink-0"
            title="Open & listen on Spotify"
          >
            <SpotifyIcon className="w-6 h-6" />
          </a>
        ) : (
          <div className="p-2 text-[#2C2824]/40 flex-shrink-0">
            <SpotifyIcon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN MUSIC PAGE ───────────────────────────────────────────
export default function MusicPage() {
  const { user, profile, isAdmin, isJane, isJosh } = useAuth();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const [songs, setSongs] = useState<(Song & { album_cover?: string | null; recipient?: string | null })[]>(DEFAULT_SONGS);
  const [filter, setFilter] = useState<"all" | "jane" | "josh">("all");
  const [showAdd, setShowAdd] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formArtist, setFormArtist] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCover, setFormCover] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formRecipient, setFormRecipient] = useState<"jane" | "josh">("jane");
  const [adding, setAdding] = useState(false);

  // Load from Storage + Supabase
  const loadSongs = async () => {
    let localSaved: (Song & { album_cover?: string | null; recipient?: string | null })[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_SONGS_KEY);
        if (stored) localSaved = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const { data: dbSongs } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbSongs && dbSongs.length > 0) {
        const merged = [...dbSongs];
        localSaved.forEach((loc) => {
          if (!merged.some((m) => m.id === loc.id || m.title === loc.title)) {
            merged.push(loc);
          }
        });
        setSongs(merged);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    if (localSaved.length > 0) {
      setSongs(localSaved);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const persistSongs = (updated: typeof songs) => {
    setSongs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_SONGS_KEY, JSON.stringify(updated));
    }
  };

  // Auto-set recipient based on logged in user
  useEffect(() => {
    if (isJosh) setFormRecipient("jane");
    if (isJane) setFormRecipient("josh");
  }, [isJosh, isJane]);

  // Quick Preset Click
  const handleSelectPreset = (preset: typeof SONG_PRESETS[0]) => {
    setFormTitle(preset.title);
    setFormArtist(preset.artist);
    setFormCover(preset.cover);
    setFormUrl(preset.url);
  };

  // Add Song Letter
  const addSong = async () => {
    if (!formTitle.trim() || !formArtist.trim() || !formReason.trim()) {
      showToast("Please fill in song title, artist, and your letter message!", {
        emoji: "✍️",
        type: "error",
      });
      return;
    }

    setAdding(true);

    const newSong = {
      id: "song_" + Date.now(),
      title: formTitle.trim(),
      artist: formArtist.trim(),
      url: formUrl.trim() || `https://open.spotify.com/search/${encodeURIComponent(formTitle + " " + formArtist)}`,
      album_cover: formCover.trim() || "https://i.scdn.co/image/ab67616d0000b273b40092285e683416e9c93a0b",
      recipient: formRecipient,
      reason: formReason.trim(),
      added_by: user?.id || "guest",
      created_at: new Date().toISOString(),
    };

    // Immediate local update
    const updated = [newSong, ...songs];
    persistSongs(updated);

    // Supabase background sync
    try {
      await supabase.from("songs").insert({
        title: newSong.title,
        artist: newSong.artist,
        url: newSong.url,
        album_cover: newSong.album_cover,
        recipient: newSong.recipient,
        reason: newSong.reason,
        added_by: user?.id,
      });
    } catch (err) {
      console.error(err);
    }

    showToast(`Music letter sent to ${formRecipient === "jane" ? "Jane 🌸" : "Josh 💻"}!`, {
      emoji: "🎵",
      type: "love",
    });

    setFormTitle("");
    setFormArtist("");
    setFormUrl("");
    setFormCover("");
    setFormReason("");
    setShowAdd(false);
    setAdding(false);
  };

  // Delete Song
  const handleDeleteSong = async (id: string) => {
    const updated = songs.filter((s) => s.id !== id);
    persistSongs(updated);

    try {
      await supabase.from("songs").delete().eq("id", id);
    } catch (err) {
      console.error(err);
    }

    showToast("Song letter removed 🗑️", { emoji: "🗑️" });
  };

  // Filter songs
  const filteredSongs = useMemo(() => {
    if (filter === "jane") return songs.filter((s) => s.recipient === "jane");
    if (filter === "josh") return songs.filter((s) => s.recipient === "josh");
    return songs;
  }, [songs, filter]);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8D2FF] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Music size={12} />
                <span>Our Spotify Mixtape Letters</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                our soundtrack &amp; letters 🎧
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                songs we dedicated to each other with sweet handwritten notes ♡
              </p>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#FFFDF9] p-1 rounded-xl border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824]">
                {[
                  { id: "all", label: "All Songs" },
                  { id: "jane", label: "To: Jane 🌸" },
                  { id: "josh", label: "To: Josh 💻" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as typeof filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-display font-bold transition-all ${
                      filter === f.id
                        ? "bg-[#FFCCD5] border border-[#2C2824] text-[#2C2824] shadow-sm"
                        : "text-[#7A7269] hover:text-[#2C2824]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="neu-btn neu-btn-pink text-xs py-2 px-4 shadow-[3px_3px_0px_#2C2824] flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Dedicate a Song</span>
                </button>
              )}
            </div>
          </div>

          {/* Add Song Letter Modal */}
          <AnimatePresence>
            {showAdd && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-box p-6 sm:p-8 bg-[#EDE9FE] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-5">
                  <div className="flex items-center justify-between border-b-2 border-[#2C2824]/10 pb-3">
                    <h2 className="font-display font-black text-xl text-[#2C2824] flex items-center gap-2">
                      <span>💌</span>
                      <span>Dedicate a Spotify Song Letter</span>
                    </h2>
                    <button
                      onClick={() => setShowAdd(false)}
                      className="p-1 rounded-lg hover:bg-[#FAF5EE]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Quick Preset Selector */}
                  <div className="space-y-1.5">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]">
                      Quick Song Presets (Click to autofill):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SONG_PRESETS.map((p) => (
                        <button
                          key={p.title}
                          type="button"
                          onClick={() => handleSelectPreset(p)}
                          className="px-2.5 py-1 rounded-lg bg-[#FFFDF9] border border-[#2C2824] text-xs font-display font-bold text-[#2C2824] hover:bg-[#FEF08A] transition-colors"
                        >
                          🎵 {p.title} - {p.artist}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Recipient Selector */}
                    <div className="space-y-1.5">
                      <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                        Dedicate To:
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormRecipient("jane")}
                          className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            formRecipient === "jane"
                              ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                              : "bg-[#FFFDF9] border-[#2C2824]/30"
                          }`}
                        >
                          <span>🌸 To: Jane (Jane will receive this)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormRecipient("josh")}
                          className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            formRecipient === "josh"
                              ? "bg-[#BAE6FD] border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                              : "bg-[#FFFDF9] border-[#2C2824]/30"
                          }`}
                        >
                          <span>💻 To: Josh (Josh will receive this)</span>
                        </button>
                      </div>
                    </div>

                    {/* Handwritten Mini Letter */}
                    <div className="space-y-1.5">
                      <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                        Handwritten Mini Letter Message *
                      </label>
                      <textarea
                        value={formReason}
                        onChange={(e) => setFormReason(e.target.value)}
                        placeholder="e.g. 'i still use the playlist u made pas aku sedih... it still helps somehow'"
                        rows={3}
                        required
                        className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2.5 text-base font-hand bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824] resize-none"
                      />
                    </div>

                    {/* Song Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-display font-bold text-xs text-[#2C2824]">
                          Song Title *
                        </label>
                        <input
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Apocalypse"
                          required
                          className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-display font-bold text-xs text-[#2C2824]">
                          Artist Name *
                        </label>
                        <input
                          value={formArtist}
                          onChange={(e) => setFormArtist(e.target.value)}
                          placeholder="e.g. Cigarettes After Sex"
                          required
                          className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-display font-bold text-xs text-[#2C2824]">
                          Album Cover Image URL (Optional)
                        </label>
                        <input
                          value={formCover}
                          onChange={(e) => setFormCover(e.target.value)}
                          placeholder="e.g. https://i.scdn.co/image/... (or paste any image link)"
                          className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-display font-bold text-xs text-[#2C2824]">
                          Spotify Track Link (Optional)
                        </label>
                        <input
                          value={formUrl}
                          onChange={(e) => setFormUrl(e.target.value)}
                          placeholder="e.g. https://open.spotify.com/track/3AVrVz5rKTrbeAcgpEt6uk"
                          className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAdd(false)}
                        className="neu-btn neu-btn-white text-xs py-2 px-4"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addSong}
                        disabled={!formTitle.trim() || !formArtist.trim() || !formReason.trim() || adding}
                        className="neu-btn neu-btn-pink text-xs py-2.5 px-6 shadow-[3px_3px_0px_#2C2824] disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Heart size={14} className="fill-current" />
                        <span>{adding ? "Saving..." : "Send Song Letter 🎵"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Song Letters Grid (2 Columns on Desktop) */}
          {filteredSongs.length === 0 ? (
            <div className="neu-box p-12 bg-[#FFFDF9] border-2 border-dashed border-[#2C2824]/20 text-center space-y-3">
              <Disc size={40} className="text-[#7A7269] animate-spin mx-auto" style={{ animationDuration: "8s" }} />
              <p className="font-hand text-2xl text-[#2C2824]">no song letters found</p>
              <p className="font-body text-xs text-[#7A7269]">
                be the first to dedicate a song with a handwritten note ♡
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSongs.map((song) => (
                <MusicLetterCard
                  key={song.id}
                  song={song}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteSong}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

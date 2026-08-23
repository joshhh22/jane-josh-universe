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
  Music,
  Disc,
  X,
  Sparkles,
  Heart,
  Trash2,
  Search,
  Check,
  Loader2,
} from "lucide-react";

const STORAGE_SONGS_KEY = "jane_josh_songs_v3_from";

// Default Song Letter Cards with Verified High-Res Album Art
const DEFAULT_SONGS: (Song & { album_cover?: string; sender_name?: string })[] = [
  {
    id: "song_1",
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/3AVrVz5rKTrbeAcgpEt6uk",
    reason: "i still use the playlist u made pas aku sedih... it still helps somehow",
    added_by: "josh_id",
    sender_name: "josh",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "song_2",
    title: "seasons",
    artist: "wave to earth",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/c5/61/fac561dc-8db4-b2e9-d3db-6e246da72bfa/5054197890017.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/1P0sF0b686e0lU5tY7o45S",
    reason: "lagu ini selalu ngingetin aku waktu kita naik mobil malem-malem sambil liatin lampu kota bareng kamu ♡",
    added_by: "jane_id",
    sender_name: "jane",
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "song_3",
    title: "double take",
    artist: "dhruv",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/dc/72/7e/dc727e4b-a63e-324c-be9f-86f78f8cb080/196589088628.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/2qX5YezrzNTDEQ9Mu4Aq4M",
    reason: "do you remember the day i first realized i was completely in love with you? this song captures that exact feeling.",
    added_by: "josh_id",
    sender_name: "josh",
    created_at: "2026-01-03T00:00:00Z",
  },
  {
    id: "song_4",
    title: "Lover",
    artist: "Taylor Swift",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/74/d3/18/74d31835-cc01-9a7c-54be-930f7c22df65/19UMGIM70868.rgb.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/1dGr1c8CrMLDpV6mPb2Ovg",
    reason: "can i go where you go? can we always be this close forever and ever and ever? 💗",
    added_by: "jane_id",
    sender_name: "jane",
    created_at: "2026-01-04T00:00:00Z",
  },
];

// Popular Song Presets with Verified High-Res Covers
const SONG_PRESETS = [
  {
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/3AVrVz5rKTrbeAcgpEt6uk",
  },
  {
    title: "seasons",
    artist: "wave to earth",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/c5/61/fac561dc-8db4-b2e9-d3db-6e246da72bfa/5054197890017.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/1P0sF0b686e0lU5tY7o45S",
  },
  {
    title: "double take",
    artist: "dhruv",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/dc/72/7e/dc727e4b-a63e-324c-be9f-86f78f8cb080/196589088628.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/2qX5YezrzNTDEQ9Mu4Aq4M",
  },
  {
    title: "Lover",
    artist: "Taylor Swift",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/74/d3/18/74d31835-cc01-9a7c-54be-930f7c22df65/19UMGIM70868.rgb.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/1dGr1c8CrMLDpV6mPb2Ovg",
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/21/f4/bf/21f4bf39-3994-0f18-6363-2287413697e8/22UMGIM78051.rgb.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/track/0T5iIrttAqIkxKaTw4zSPi",
  },
  {
    title: "About You",
    artist: "The 1975",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/7e/4d/78/7e4d7883-e18e-eb7c-47b8-f0331005bc1d/22UMGIM92150.rgb.jpg/600x600bb.jpg",
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

// ─── MUSIC LETTER CARD (Matches Screenshot Exactly with "From:") ──────────
function MusicLetterCard({
  song,
  isAdmin,
  onDelete,
}: {
  song: Song & { album_cover?: string | null; sender_name?: string | null };
  isAdmin: boolean;
  onDelete: (id: string) => void;
}) {
  const isFromJane = song.sender_name === "jane";
  const senderLabel = isFromJane ? "jane" : "josh";
  const defaultCover =
    song.album_cover ||
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg";

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
        {/* Sender Pill: "From: marcel" style */}
        <div className="bg-[#FAF5EE] border border-[#2C2824]/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-display font-bold text-[#2C2824]">
          <span className="text-[#7A7269] font-normal">From:</span>
          <span>{senderLabel}</span>
          <span>{isFromJane ? "🌸" : "💻"}</span>
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
          {/* Real High-Res Album Cover Art */}
          <img
            src={defaultCover}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover border border-[#2C2824]/15 shadow-sm flex-shrink-0 bg-[#2C2824]"
            onError={(e) => {
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

  const [songs, setSongs] = useState<(Song & { album_cover?: string | null; sender_name?: string | null })[]>(DEFAULT_SONGS);
  const [filter, setFilter] = useState<"all" | "jane" | "josh">("all");
  const [showAdd, setShowAdd] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formArtist, setFormArtist] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCover, setFormCover] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formSender, setFormSender] = useState<"jane" | "josh">("josh");
  const [adding, setAdding] = useState(false);
  const [isFetchingArt, setIsFetchingArt] = useState(false);

  // Load from Storage + Supabase
  const loadSongs = async () => {
    let localSaved: (Song & { album_cover?: string | null; sender_name?: string | null })[] = [];
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
        const formatted = dbSongs.map((s) => ({
          ...s,
          sender_name: s.recipient === "josh" ? "jane" : "josh",
        }));
        setSongs(formatted);
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

  // Auto-set sender based on logged in user
  useEffect(() => {
    if (isJane) setFormSender("jane");
    if (isJosh) setFormSender("josh");
  }, [isJosh, isJane]);

  // Automatic Album Art Fetcher using Apple/Spotify Search API
  const fetchAlbumArt = async (title: string, artist: string) => {
    if (!title.trim()) return;
    setIsFetchingArt(true);
    try {
      const query = `${title} ${artist}`.trim();
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=1`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const rawArt: string = data.results[0].artworkUrl100;
        const highResArt = rawArt.replace("100x100bb.jpg", "600x600bb.jpg");
        setFormCover(highResArt);
        if (!formArtist && data.results[0].artistName) {
          setFormArtist(data.results[0].artistName);
        }
        showToast("Official album cover found! 🎨", { emoji: "✨" });
      }
    } catch (err) {
      console.error("Failed to fetch artwork:", err);
    } finally {
      setIsFetchingArt(false);
    }
  };

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

    const targetUser = formSender === "josh" ? "jane" : "josh";
    const finalCover =
      formCover.trim() ||
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg";

    const newSong = {
      id: "song_" + Date.now(),
      title: formTitle.trim(),
      artist: formArtist.trim(),
      url: formUrl.trim() || `https://open.spotify.com/search/${encodeURIComponent(formTitle + " " + formArtist)}`,
      album_cover: finalCover,
      sender_name: formSender,
      recipient: targetUser,
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
        recipient: targetUser,
        reason: newSong.reason,
        added_by: user?.id,
      });
    } catch (err) {
      console.error(err);
    }

    showToast(`Music letter sent From: ${formSender === "jane" ? "Jane 🌸" : "Josh 💻"}!`, {
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
    if (filter === "jane") return songs.filter((s) => s.sender_name === "jane");
    if (filter === "josh") return songs.filter((s) => s.sender_name === "josh");
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
                handwritten letters attached to our favorite songs ♡
              </p>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#FFFDF9] p-1 rounded-xl border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824]">
                {[
                  { id: "all", label: "All Songs" },
                  { id: "jane", label: "From: Jane 🌸" },
                  { id: "josh", label: "From: Josh 💻" },
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
                  <span>Dedicate a Song Letter</span>
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
                      <span>
                        Dedicate a Spotify Song Letter from {formSender === "jane" ? "Jane 🌸" : "Josh 💻"}
                      </span>
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
                    {/* Sender Selector */}
                    <div className="space-y-1.5">
                      <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                        Letter Sent From:
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormSender("josh")}
                          className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            formSender === "josh"
                              ? "bg-[#BAE6FD] border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                              : "bg-[#FFFDF9] border-[#2C2824]/30"
                          }`}
                        >
                          <span>💻 From: Josh (Josh gives to Jane)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormSender("jane")}
                          className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            formSender === "jane"
                              ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                              : "bg-[#FFFDF9] border-[#2C2824]/30"
                          }`}
                        >
                          <span>🌸 From: Jane (Jane gives to Josh)</span>
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
                        <div className="flex gap-1.5">
                          <input
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            onBlur={() => {
                              if (formTitle && !formCover) fetchAlbumArt(formTitle, formArtist);
                            }}
                            placeholder="e.g. Apocalypse"
                            required
                            className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => fetchAlbumArt(formTitle, formArtist)}
                            className="p-2.5 rounded-xl border-2 border-[#2C2824] bg-[#FEF08A] hover:bg-[#FDE047] flex-shrink-0"
                            title="Auto-search Spotify album cover"
                          >
                            {isFetchingArt ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                          </button>
                        </div>
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

                      {/* Live Album Cover Artwork Preview */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-display font-bold text-xs text-[#2C2824] flex items-center justify-between">
                          <span>Album Cover Art (Auto-detected from Spotify / Apple Music):</span>
                          {formCover && <span className="text-emerald-700 text-[10px] font-bold">✓ Cover Attached</span>}
                        </label>
                        <div className="flex items-center gap-3">
                          {formCover && (
                            <img
                              src={formCover}
                              alt="Cover Preview"
                              className="w-14 h-14 rounded-xl object-cover border-2 border-[#2C2824] shadow-sm flex-shrink-0 bg-[#2C2824]"
                            />
                          )}
                          <input
                            value={formCover}
                            onChange={(e) => setFormCover(e.target.value)}
                            placeholder="Cover image URL (Auto-filled on search)"
                            className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-xs font-body bg-[#FFFDF9] focus:outline-none"
                          />
                        </div>
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
                        <span>{adding ? "Saving..." : `Send Song Letter from ${formSender} 🎵`}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Song Letters Grid */}
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

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo, useRef } from "react";
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
  Heart,
  Trash2,
  Search,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";

const STORAGE_SONGS_KEY = "jane_josh_songs_real_user_only";

// Search Result Item Type
interface SearchTrackResult {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl: string;
  previewUrl?: string;
  spotifyUrl: string;
}

// Spotify Icon Component
function SpotifyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.307c-.218.358-.684.472-1.042.254-2.853-1.743-6.444-2.138-10.675-1.171-.41.094-.823-.162-.917-.572-.093-.41.163-.823.573-.917 4.634-1.06 8.59-.617 11.807 1.346.358.218.472.684.254 1.042zm1.47-3.268c-.276.448-.863.593-1.311.317-3.264-2.006-8.24-2.588-12.099-1.417-.504.153-1.037-.137-1.19-.64-.153-.503.137-1.037.64-1.19 4.417-1.341 9.907-.69 13.643 1.619.448.276.593.863.317 1.311zm.126-3.414c-3.914-2.324-10.366-2.538-14.11-1.399-.6.182-1.237-.163-1.42-.763-.182-.6.164-1.237.763-1.42 4.305-1.307 11.416-1.06 15.918 1.612.54.32.716 1.02.396 1.56-.32.54-1.02.716-1.56.396z" />
    </svg>
  );
}

// ─── MUSIC LETTER CARD ───────────────────────────────────────────
function MusicLetterCard({
  song,
  isAdmin,
  onDelete,
}: {
  song: Song & { album_cover?: string | null; sender_name?: string | null };
  isAdmin: boolean;
  onDelete: (song: Song & { album_cover?: string | null; sender_name?: string | null }) => void;
}) {
  const isFromJane = song.sender_name === "jane";
  const senderLabel = isFromJane ? "jane" : "josh";
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
        {/* Sender Pill */}
        <div className="bg-[#FAF5EE] border border-[#2C2824]/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-display font-bold text-[#2C2824]">
          <span className="text-[#7A7269] font-normal">From:</span>
          <span>{senderLabel}</span>
          <span>{isFromJane ? "🌸" : "💻"}</span>
        </div>

        {/* Delete Button */}
        {isAdmin && (
          <button
            onClick={() => onDelete(song)}
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
          {/* High-Res Album Cover Art */}
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

  // Pure clean state: NO DUMMY SONGS
  const [songs, setSongs] = useState<(Song & { album_cover?: string | null; sender_name?: string | null })[]>([]);
  const [filter, setFilter] = useState<"all" | "jane" | "josh">("all");
  const [showAdd, setShowAdd] = useState(false);

  // Search Combobox State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchTrackResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SearchTrackResult | null>(null);

  // Form State
  const [formReason, setFormReason] = useState("");
  const [formSender, setFormSender] = useState<"jane" | "josh">("josh");
  const [adding, setAdding] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Load strictly user added songs from LocalStorage & Supabase
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Clean all old dummy keys
        localStorage.removeItem("jane_josh_songs_v2");
        localStorage.removeItem("jane_josh_songs_v3_from");
        localStorage.removeItem("jane_josh_songs_v4_search");
        localStorage.removeItem("jane_josh_songs_v5_permanent");
        localStorage.removeItem("jane_josh_songs_v6_sync");
        localStorage.removeItem("jane_josh_songs_v7_clean");
        localStorage.removeItem("jane_josh_songs_v8_master");
        localStorage.removeItem("jane_josh_deleted_song_keys_v1");
        localStorage.removeItem("jane_josh_deleted_song_keys_v2");

        const stored = localStorage.getItem(STORAGE_SONGS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSongs(parsed);
          }
        }
      } catch (e) {
        console.error("LocalStorage load error:", e);
      }
    }

    // Fetch from Supabase
    fetchSupabaseSongs();
  }, []);

  const fetchSupabaseSongs = async () => {
    try {
      const { data: dbSongs } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbSongs && dbSongs.length > 0) {
        // Filter out any default dummy rows from old seed
        const realDbSongs = dbSongs.filter(
          (s) =>
            s.title !== "Apocalypse" &&
            s.title !== "seasons" &&
            s.title !== "double take" &&
            s.title !== "Lover"
        );

        if (realDbSongs.length > 0) {
          setSongs((current) => {
            const map = new Map<string, any>();
            current.forEach((s) => map.set(s.title.toLowerCase(), s));
            realDbSongs.forEach((dbS) => {
              const key = dbS.title.toLowerCase();
              if (!map.has(key)) {
                map.set(key, {
                  ...dbS,
                  sender_name: dbS.recipient === "josh" ? "jane" : "josh",
                });
              }
            });
            const merged = Array.from(map.values());
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_SONGS_KEY, JSON.stringify(merged));
            }
            return merged;
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  // Handle Search Input & Debounce
  useEffect(() => {
    if (!searchQuery.trim() || selectedTrack) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            searchQuery
          )}&media=music&entity=song&limit=8`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const mapped: SearchTrackResult[] = data.results.map((item: any) => ({
            trackId: item.trackId,
            trackName: item.trackName,
            artistName: item.artistName,
            artworkUrl: item.artworkUrl100?.replace("100x100bb.jpg", "600x600bb.jpg") || item.artworkUrl60,
            previewUrl: item.previewUrl,
            spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(item.trackName + " " + item.artistName)}`,
          }));
          setSearchResults(mapped);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTrack]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTrack = (track: SearchTrackResult) => {
    setSelectedTrack(track);
    setSearchQuery(track.trackName + " - " + track.artistName);
    setShowDropdown(false);
    showToast(`Selected: ${track.trackName} 🎵`, { emoji: "✨" });
  };

  const handleResetSelectedTrack = () => {
    setSelectedTrack(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Add Song Letter
  const addSong = async () => {
    if (!selectedTrack || !formReason.trim()) {
      showToast("Please search & select a song, and write your mini letter!", {
        emoji: "✍️",
        type: "error",
      });
      return;
    }

    setAdding(true);

    const targetUser = formSender === "josh" ? "jane" : "josh";
    const newSongId = "song_" + Date.now();
    const fallbackUserId =
      user?.id ||
      (formSender === "josh"
        ? "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe"
        : "f4c3869d-c368-4bd6-bf45-f2f2ff5ab832");

    const newSong = {
      id: newSongId,
      title: selectedTrack.trackName,
      artist: selectedTrack.artistName,
      url: selectedTrack.spotifyUrl,
      album_cover: selectedTrack.artworkUrl,
      sender_name: formSender,
      recipient: targetUser,
      reason: formReason.trim(),
      added_by: fallbackUserId,
      created_at: new Date().toISOString(),
    };

    // 1. Immediately persist to LocalStorage and State
    const updated = [newSong, ...songs];
    persistSongs(updated);

    // 2. Background Sync to Supabase
    try {
      await supabase.from("songs").insert({
        title: newSong.title,
        artist: newSong.artist,
        url: newSong.url,
        album_cover: newSong.album_cover,
        recipient: targetUser,
        reason: newSong.reason,
        added_by: fallbackUserId,
      });
    } catch (err) {
      console.error("Supabase insert:", err);
    }

    showToast(`Music letter sent From: ${formSender === "jane" ? "Jane 🌸" : "Josh 💻"}!`, {
      emoji: "🎵",
      type: "love",
    });

    handleResetSelectedTrack();
    setFormReason("");
    setShowAdd(false);
    setAdding(false);
  };

  // Delete Song
  const handleDeleteSong = async (
    songToDelete: Song & { album_cover?: string | null; sender_name?: string | null }
  ) => {
    // 1. Immediately remove from State and LocalStorage
    const updated = songs.filter(
      (s) =>
        s.id !== songToDelete.id &&
        s.title?.trim().toLowerCase() !== songToDelete.title?.trim().toLowerCase()
    );
    persistSongs(updated);

    // 2. Delete from Supabase
    try {
      if (songToDelete.id) {
        await supabase.from("songs").delete().eq("id", songToDelete.id);
      }
      if (songToDelete.title) {
        await supabase.from("songs").delete().ilike("title", songToDelete.title);
      }
    } catch (err) {
      console.error("Supabase delete error:", err);
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
                        Dedicate a Song Letter from {formSender === "jane" ? "Jane 🌸" : "Josh 💻"}
                      </span>
                    </h2>
                    <button
                      onClick={() => setShowAdd(false)}
                      className="p-1 rounded-lg hover:bg-[#FAF5EE]"
                    >
                      <X size={18} />
                    </button>
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

                    {/* ─── LIVE SONG SEARCH COMBOBOX ─── */}
                    <div className="space-y-1.5 relative" ref={searchContainerRef}>
                      <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                        Song
                      </label>

                      {!selectedTrack ? (
                        <div className="relative">
                          <input
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setShowDropdown(true);
                            }}
                            onFocus={() => {
                              if (searchResults.length > 0) setShowDropdown(true);
                            }}
                            placeholder="Search and select your song (e.g. Every Way, Best Part, Lucky, Lover)"
                            className="w-full border-2 border-[#2C2824] rounded-xl px-4 py-2.5 pl-10 text-sm font-body bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824]"
                          />
                          <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7269]"
                          />
                          {isSearching && (
                            <Loader2
                              size={16}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A7269] animate-spin"
                            />
                          )}

                          {/* Dropdown Results List */}
                          <AnimatePresence>
                            {showDropdown && searchResults.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute left-0 right-0 top-full mt-1.5 bg-[#FFFDF9] border-2 border-[#2C2824] rounded-xl shadow-[4px_4px_0px_#2C2824] max-h-64 overflow-y-auto z-50 divide-y divide-[#2C2824]/10"
                              >
                                {searchResults.map((track) => (
                                  <div
                                    key={track.trackId}
                                    onClick={() => handleSelectTrack(track)}
                                    className="p-2.5 px-3 flex items-center gap-3 hover:bg-[#FEF08A] cursor-pointer transition-colors"
                                  >
                                    <img
                                      src={track.artworkUrl}
                                      alt={track.trackName}
                                      className="w-10 h-10 rounded-md object-cover border border-[#2C2824]/20 flex-shrink-0 bg-[#2C2824]"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-display font-bold text-sm text-[#2C2824] truncate">
                                        {track.trackName}
                                      </p>
                                      <p className="font-body text-xs text-[#7A7269] truncate">
                                        {track.artistName}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        /* Selected Track Banner */
                        <div className="bg-[#BBF7D0] border-2 border-[#16A34A] rounded-xl p-3 flex items-center justify-between shadow-[2px_2px_0px_#16A34A]">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={selectedTrack.artworkUrl}
                              alt={selectedTrack.trackName}
                              className="w-12 h-12 rounded-lg object-cover border border-[#16A34A] flex-shrink-0 shadow-sm"
                            />
                            <div className="min-w-0">
                              <p className="font-display font-black text-sm text-[#14532D] truncate flex items-center gap-1.5">
                                <span>{selectedTrack.trackName}</span>
                                <Check size={15} className="text-[#16A34A] flex-shrink-0" />
                              </p>
                              <p className="font-body text-xs text-[#166534] truncate">
                                {selectedTrack.artistName}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleResetSelectedTrack}
                            className="neu-btn neu-btn-white text-xs py-1.5 px-3 flex items-center gap-1 flex-shrink-0 shadow-none border-[#16A34A]"
                          >
                            <RotateCcw size={12} />
                            <span>Change Song</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Handwritten Mini Letter */}
                    <div className="space-y-1.5">
                      <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                        Handwritten Mini Letter Message *
                      </label>
                      <textarea
                        value={formReason}
                        onChange={(e) => setFormReason(e.target.value)}
                        placeholder="e.g. 'thankss for loving me as always bebeeeee ♡'"
                        rows={3}
                        required
                        className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2.5 text-base font-hand bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824] resize-none"
                      />
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
                        disabled={!selectedTrack || !formReason.trim() || adding}
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
                  key={song.id || song.title}
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

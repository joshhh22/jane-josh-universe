"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  getCachedSongs,
  setCachedSongs,
  parseSongRow,
  type CustomSongItem,
} from "@/lib/musicStorage";
import { ArrowRight, Disc } from "lucide-react";

export function MusicPreviewCard() {
  const supabase = useMemo(() => createClient(), []);
  const [songs, setSongs] = useState<CustomSongItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch all songs from Supabase Cloud DB
  const fetchCloudSongs = useCallback(async () => {
    try {
      const { data: dbSongs } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbSongs) {
        const real = dbSongs.filter((s) => {
          const t = s.title?.trim().toLowerCase();
          return t !== "apocalypse" && t !== "seasons" && t !== "double take" && t !== "lover";
        });

        const parsed = real.map(parseSongRow);
        setSongs(parsed);
        setCachedSongs(parsed);
      }
    } catch (err) {
      console.error(err);
    }
  }, [supabase]);

  // Initial load & Realtime cross-device subscription
  useEffect(() => {
    const cached = getCachedSongs();
    if (cached.length > 0) {
      setSongs(cached);
    }

    fetchCloudSongs();

    const channel = supabase
      .channel("realtime-bento-music-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "songs" },
        () => {
          fetchCloudSongs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchCloudSongs]);

  // Auto-cycle songs every 4 seconds with smooth fade-in
  useEffect(() => {
    if (songs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % songs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [songs.length]);

  const activeSong = songs.length > 0 ? songs[currentIndex % songs.length] : null;
  const isFromJane = activeSong?.sender_name === "jane";

  return (
    <Link href="/music" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-4 bg-[#EDE9FE] flex flex-col justify-between group overflow-hidden">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          {activeSong ? (
            <div className="bg-[#FAF5EE] border border-[#23201D]/20 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold text-[#23201D] flex items-center gap-1">
              <span className="text-[#6E675F] font-normal">From:</span>
              <span>{activeSong.sender_name || "josh"}</span>
              <span>{isFromJane ? "🌸" : "💻"}</span>
            </div>
          ) : (
            <div className="bg-[#FAF5EE] border border-[#23201D]/20 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold text-[#23201D] flex items-center gap-1">
              <span>🎧 Our Mixtape</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {songs.length > 1 && (
              <span className="text-[10px] font-display font-bold text-[#6E675F]">
                {((currentIndex % songs.length) + 1)}/{songs.length}
              </span>
            )}
            <Disc size={16} className="text-[#23201D] animate-spin" style={{ animationDuration: "6s" }} />
          </div>
        </div>

        {/* Dynamic Fading Content */}
        <div className="my-auto py-2">
          {activeSong ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSong.id || activeSong.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="space-y-2.5"
              >
                {/* Handwritten Mini Letter */}
                <p className="font-hand text-base sm:text-lg text-[#23201D] line-clamp-2 leading-snug px-1">
                  &ldquo;{activeSong.reason || "songs dedicated with love ♡"}&rdquo;
                </p>

                {/* Spotify Bottom Bar with Real Album Art */}
                <div className="bg-[#FFFFFF]/90 p-2 rounded-xl border border-[#23201D]/15 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        activeSong.album_cover ||
                        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80"
                      }
                      alt={activeSong.title}
                      className="w-9 h-9 rounded-lg object-cover border border-[#23201D]/20 flex-shrink-0 bg-[#23201D]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-display font-black text-xs text-[#23201D] truncate">
                        {activeSong.title}
                      </p>
                      <p className="font-body text-[10px] text-[#6E675F] truncate">
                        {activeSong.artist}
                      </p>
                    </div>
                  </div>

                  <div className="text-[#1DB954] flex-shrink-0 pr-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.307c-.218.358-.684.472-1.042.254-2.853-1.743-6.444-2.138-10.675-1.171-.41.094-.823-.162-.917-.572-.093-.41.163-.823.573-.917 4.634-1.06 8.59-.617 11.807 1.346.358.218.472.684.254 1.042zm1.47-3.268c-.276.448-.863.593-1.311.317-3.264-2.006-8.24-2.588-12.099-1.417-.504.153-1.037-.137-1.19-.64-.153-.503.137-1.037.64-1.19 4.417-1.341 9.907-.69 13.643 1.619.448.276.593.863.317 1.311zm.126-3.414c-3.914-2.324-10.366-2.538-14.11-1.399-.6.182-1.237-.163-1.42-.763-.182-.6.164-1.237.763-1.42 4.305-1.307 11.416-1.06 15.918 1.612.54.32.716 1.02.396 1.56-.32.54-1.02.716-1.56.396z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-2 space-y-1">
              <p className="font-hand text-base text-[#6E675F]">
                no songs yet &bull; dedicate our first song letter ♪
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span>open mixtape ({songs.length})</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

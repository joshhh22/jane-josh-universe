"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Song } from "@/lib/supabase/types";
import { ArrowRight } from "lucide-react";

export function MusicPreviewCard() {
  const supabase = createClient();
  const [latestSong, setLatestSong] = useState<(Song & { album_cover?: string | null; recipient?: string | null }) | null>({
    id: "song_1",
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    album_cover: "https://i.scdn.co/image/ab67616d0000b273b40092285e683416e9c93a0b",
    reason: "i still use the playlist u made pas aku sedih... it still helps somehow",
    recipient: "jane",
    added_by: "josh_id",
    url: "https://open.spotify.com/track/3AVrVz5rKTrbeAcgpEt6uk",
    created_at: new Date().toISOString(),
  });

  useEffect(() => {
    supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setLatestSong(data as typeof latestSong);
      });
  }, []);

  return (
    <Link href="/music" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-4 bg-[#EDE9FE] flex flex-col justify-between group">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="bg-[#FAF5EE] border border-[#23201D]/20 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold text-[#23201D]">
            <span>To: {latestSong?.recipient || "jane"}</span>
          </div>
          <span className="font-hand text-xs text-[#6E675F]">spotify letter 🎵</span>
        </div>

        {/* Mini Letter Body Preview */}
        <div className="my-2 py-1 px-1">
          <p className="font-hand text-base sm:text-lg text-[#23201D] line-clamp-2 leading-tight">
            &ldquo;{latestSong?.reason || "songs we dedicated to each other with sweet notes..."}&rdquo;
          </p>
        </div>

        {/* Spotify Bottom Bar with Album Art */}
        <div className="bg-[#FFFFFF]/90 p-2 rounded-xl border border-[#23201D]/15 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={
                latestSong?.album_cover ||
                "https://i.scdn.co/image/ab67616d0000b273b40092285e683416e9c93a0b"
              }
              alt={latestSong?.title || "Album Cover"}
              className="w-8 h-8 rounded-lg object-cover border border-[#23201D]/20 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80";
              }}
            />
            <div className="min-w-0">
              <p className="font-display font-black text-[11px] text-[#23201D] truncate">
                {latestSong?.title || "Apocalypse"}
              </p>
              <p className="font-body text-[9px] text-[#6E675F] truncate">
                {latestSong?.artist || "Cigarettes After Sex"}
              </p>
            </div>
          </div>

          <div className="text-[#1DB954] flex-shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.307c-.218.358-.684.472-1.042.254-2.853-1.743-6.444-2.138-10.675-1.171-.41.094-.823-.162-.917-.572-.093-.41.163-.823.573-.917 4.634-1.06 8.59-.617 11.807 1.346.358.218.472.684.254 1.042zm1.47-3.268c-.276.448-.863.593-1.311.317-3.264-2.006-8.24-2.588-12.099-1.417-.504.153-1.037-.137-1.19-.64-.153-.503.137-1.037.64-1.19 4.417-1.341 9.907-.69 13.643 1.619.448.276.593.863.317 1.311zm.126-3.414c-3.914-2.324-10.366-2.538-14.11-1.399-.6.182-1.237-.163-1.42-.763-.182-.6.164-1.237.763-1.42 4.305-1.307 11.416-1.06 15.918 1.612.54.32.716 1.02.396 1.56-.32.54-1.02.716-1.56.396z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

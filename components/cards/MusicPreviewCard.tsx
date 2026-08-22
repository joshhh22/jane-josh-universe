"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Song } from "@/lib/supabase/types";
import { Music, Disc, ArrowRight } from "lucide-react";

export function MusicPreviewCard() {
  const supabase = createClient();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2)
      .then(({ data }) => {
        if (data) setSongs(data);
      });
  }, []);

  return (
    <Link href="/music" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-5 bg-[#EDE9FE] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>🎧</span>
            <span>Our Soundtrack</span>
          </span>
          <Disc size={18} className="text-[#23201D] animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        <div className="my-auto py-2 space-y-2">
          {songs.length === 0 ? (
            <div className="inner-tile p-3 text-center">
              <p className="font-hand text-base text-[#6E675F]">
                no songs yet &bull; add our favorite playlist ♪
              </p>
            </div>
          ) : (
            songs.map((s) => (
              <div
                key={s.id}
                className="inner-tile px-3 py-2 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="font-display font-bold text-xs truncate text-[#23201D]">{s.title}</p>
                  <p className="font-body text-[11px] text-[#6E675F] truncate">{s.artist}</p>
                </div>
                <span className="text-sm">🎵</span>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span>play mixtape</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

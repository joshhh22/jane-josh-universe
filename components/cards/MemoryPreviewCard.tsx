"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Memory } from "@/lib/supabase/types";
import { Camera, ArrowRight } from "lucide-react";

export function MemoryPreviewCard() {
  const supabase = createClient();
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setMemories(data);
      });
  }, []);

  return (
    <Link href="/memories" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-5 bg-[#F0FDF4] flex flex-col justify-between group">
        <div className="flex items-center justify-between gap-2">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>📸</span>
            <span>Memory Archive</span>
          </span>
          <span className="badge-pill bg-[#FEF08A]">
            {memories.length} Photos
          </span>
        </div>

        {memories.length === 0 ? (
          <div className="my-auto py-3">
            <div className="inner-tile p-4 text-center space-y-1">
              <div className="text-2xl">📷</div>
              <p className="font-hand text-base text-[#6E675F]">
                no memories yet &bull; add our first snapshot together 🌸
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
            {memories.map((m, i) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className={`polaroid-card ${
                  i === 0 ? "-rotate-2" : i === 1 ? "rotate-1" : "-rotate-1"
                }`}
              >
                <div className="w-full h-16 sm:h-20 bg-[#FDFBF7] rounded border border-[#23201D]/20 overflow-hidden relative flex items-center justify-center">
                  {m.image_url ? (
                    <Image
                      src={m.image_url}
                      alt={m.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xl opacity-40">📷</span>
                  )}
                </div>
                <p className="font-hand text-xs text-center text-[#23201D] mt-1 truncate">
                  {m.title}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span>open photo scrapbook</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

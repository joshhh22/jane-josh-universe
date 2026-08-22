"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { Mail, ArrowRight } from "lucide-react";

export function LetterCountCard() {
  const { user } = useAuth();
  const supabase = createClient();
  const [count, setCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase
      .from("letters")
      .select("*", { count: "exact", head: true })
      .then(({ count: c }) => {
        if (c !== null) setCount(c);
      });

    if (user) {
      supabase
        .from("letters")
        .select("*", { count: "exact", head: true })
        .eq("recipient", user.id)
        .eq("is_read", false)
        .then(({ count: unread }) => {
          if (unread !== null) setUnreadCount(unread);
        });
    }
  }, [user]);

  return (
    <Link href="/letters" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-5 bg-[#FFE4E6] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>💌</span>
            <span>Our Mailbox</span>
          </span>
          {unreadCount > 0 ? (
            <span className="badge-pill bg-[#FEF08A] text-[#23201D] animate-bounce">
              {unreadCount} NEW
            </span>
          ) : (
            <span className="font-hand text-xs text-[#6E675F]">letters &amp; notes</span>
          )}
        </div>

        <div className="my-auto py-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-4xl sm:text-5xl text-[#23201D]">
              {count}
            </span>
            <span className="font-hand text-xl text-[#23201D]/75">
              letters exchanged
            </span>
          </div>
          <p className="font-body text-xs text-[#6E675F] mt-1">
            sealed with love &amp; memories
          </p>
        </div>

        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span>open mailbox</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

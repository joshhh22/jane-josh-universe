"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { Gift, ArrowRight } from "lucide-react";

export function SurpriseCountCard() {
  const { user } = useAuth();
  const supabase = createClient();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("surprises")
      .select("*", { count: "exact", head: true })
      .eq("to_user", user.id)
      .eq("is_opened", false)
      .then(({ count }) => {
        if (count !== null) setPending(count);
      });
  }, [user]);

  return (
    <Link href="/surprises" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-5 bg-[#FED7AA] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>🎁</span>
            <span>Surprise Box</span>
          </span>
          {pending > 0 && (
            <span className="badge-pill bg-[#FFCCD5] animate-pulse">
              {pending} Waiting
            </span>
          )}
        </div>

        <div className="my-auto py-2 flex items-center gap-3">
          <div className="text-4xl sm:text-5xl animate-bounce flex-shrink-0">
            {pending > 0 ? "🎁" : "📦"}
          </div>
          <div>
            <p className="font-display font-black text-lg text-[#23201D] leading-tight">
              {pending > 0 ? `${pending} new surprise!` : "secret notes"}
            </p>
            <p className="font-hand text-base text-[#23201D]/80">
              {pending > 0 ? "ready to be unboxed" : "leave a cute mystery gift"}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span>open surprise box</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

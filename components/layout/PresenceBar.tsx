"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export function PresenceBar() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const supabase = createClient();

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) setProfiles(data);
  };

  useEffect(() => {
    fetchProfiles();

    const channel = supabase
      .channel("presence-bar")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, fetchProfiles)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (profiles.length === 0) return null;

  const jane = profiles.find((p) => p.username === "jane");
  const josh = profiles.find((p) => p.username === "josh");

  return (
    <div className="w-full border-b-2 border-[#171717]/10 bg-[#FFFDF8] px-4 py-2 flex items-center gap-4 text-xs font-body">
      {[jane, josh].filter(Boolean).map((p) => p && (
        <div key={p.id} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full border border-[#171717]/20 ${p.is_online ? "bg-green-400 animate-pulse" : "bg-gray-300"}`} />
          <span className="font-medium text-[#171717]/70">
            {p.avatar_emoji} {p.display_name}
            <span className="text-[#171717]/40 ml-1 font-normal">
              {p.is_online ? "is here ♡" : "stepped out"}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

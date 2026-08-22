"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Pet } from "@/lib/supabase/types";

const CAT_FACES = {
  happy: "(=^･ω･^=) ♡",
  normal: "(=^･ｪ･^=)",
  hungry: "(=TェT=) 🍙",
  sleepy: "( -.-)zzZ",
};

export function PetWidget() {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [pet, setPet] = useState<Pet | null>({
    id: "1",
    name: "Biscuit",
    hunger: 75,
    happiness: 85,
    last_fed_by: null,
    last_played_by: null,
    last_fed_at: null,
    last_played_at: null,
    updated_at: new Date().toISOString(),
  });

  const fetchPet = async () => {
    const { data } = await supabase.from("pet").select("*").limit(1).single();
    if (data) setPet(data);
  };

  useEffect(() => {
    fetchPet();
  }, []);

  const getMoodState = () => {
    if (!pet) return "normal";
    if (pet.hunger < 40) return "hungry";
    if (pet.happiness > 75) return "happy";
    if (pet.happiness < 40) return "sleepy";
    return "normal";
  };

  const doAction = async (action: "feed" | "pet" | "play") => {
    if (!user || !pet || !isAdmin) return;

    const updates: Partial<Pet> = { updated_at: new Date().toISOString() };
    let msg = "";

    if (action === "feed") {
      updates.hunger = Math.min(100, (pet.hunger || 0) + 25);
      updates.last_fed_by = user.id;
      updates.last_fed_at = new Date().toISOString();
      msg = `${profile?.display_name || "You"} fed ${pet.name} 🍙`;
    } else if (action === "pet") {
      updates.happiness = Math.min(100, (pet.happiness || 0) + 15);
      msg = `${profile?.display_name || "You"} pet ${pet.name} 🐾`;
    } else {
      updates.happiness = Math.min(100, (pet.happiness || 0) + 25);
      updates.last_played_by = user.id;
      updates.last_played_at = new Date().toISOString();
      msg = `${profile?.display_name || "You"} played with ${pet.name} 🎾`;
    }

    setPet((prev) => (prev ? { ...prev, ...updates } : null));
    showToast(msg, { emoji: "🐱", type: "love" });

    await supabase.from("pet").update(updates).eq("id", pet.id);
    await supabase.from("pet_actions").insert({
      user_id: user.id,
      username: profile?.username || "user",
      action,
    });
  };

  const mood = getMoodState();

  return (
    <div className="neu-card h-full p-5 bg-[#DCFCE7] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>🐱</span>
            <span>{pet?.name || "Biscuit"}</span>
          </span>
          <span className="font-hand text-xs text-[#23201D]">our shared pet</span>
        </div>

        {/* Pet Display Card */}
        <div className="inner-tile p-3 my-1 text-center">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="font-mono text-base font-bold text-[#23201D] py-0.5"
          >
            {CAT_FACES[mood as keyof typeof CAT_FACES]}
          </motion.div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#23201D]/10 text-[10px] font-display font-bold">
            <div>
              <div className="flex justify-between text-[#6E675F] mb-0.5">
                <span>HUNGER</span>
                <span>{pet?.hunger || 0}%</span>
              </div>
              <div className="rpg-bar-container">
                <div
                  className="rpg-bar-fill bg-[#FEF08A]"
                  style={{ width: `${pet?.hunger || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[#6E675F] mb-0.5">
                <span>HAPPY</span>
                <span>{pet?.happiness || 0}%</span>
              </div>
              <div className="rpg-bar-container">
                <div
                  className="rpg-bar-fill bg-[#FFD1DC]"
                  style={{ width: `${pet?.happiness || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        {isAdmin ? (
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => doAction("feed")}
              className="neu-btn neu-btn-yellow text-[11px] py-1 px-1"
            >
              🍙 Feed
            </button>
            <button
              onClick={() => doAction("pet")}
              className="neu-btn neu-btn-pink text-[11px] py-1 px-1"
            >
              🤗 Pet
            </button>
            <button
              onClick={() => doAction("play")}
              className="neu-btn neu-btn-white text-[11px] py-1 px-1"
            >
              🎾 Play
            </button>
          </div>
        ) : (
          <p className="text-center font-hand text-xs text-[#6E675F]">
            sign in as josh or jane to play with {pet?.name} ♡
          </p>
        )}
      </div>
    </div>
  );
}

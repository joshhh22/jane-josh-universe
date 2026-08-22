"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Pet } from "@/lib/supabase/types";

const CAT_FACES = {
  super_happy: "(=^･ω･^=) ♡✨",
  happy: "(=^･ｪ･^=) 🌸",
  normal: "(=^･ω･^=)",
  hungry: "(=TェT=) 🍙",
  starving: "(=;ェ;=) 🍙💦",
  lonely: "( -.-)zzZ 📦",
  drama_queen: "(=QAQ=) 🐾",
};

export function PetWidget() {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);
  
  const [pet, setPet] = useState<Pet | null>({
    id: "1",
    name: "JJ",
    hunger: 100,
    happiness: 100,
    last_fed_by: null,
    last_played_by: null,
    last_fed_at: new Date().toISOString(),
    last_played_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Calculate real-time decay based on elapsed real-world time
  const calculateDecay = (rawPet: Pet): Pet => {
    const now = Date.now();
    const lastFed = rawPet.last_fed_at ? new Date(rawPet.last_fed_at).getTime() : now;
    const lastPlayed = rawPet.last_played_at ? new Date(rawPet.last_played_at).getTime() : now;

    // Decay rate: ~4% hunger per hour, ~3% happiness per hour
    const hoursSinceFed = Math.max(0, (now - lastFed) / (1000 * 60 * 60));
    const hoursSincePlayed = Math.max(0, (now - lastPlayed) / (1000 * 60 * 60));

    const hungerLoss = Math.floor(hoursSinceFed * 4);
    const happyLoss = Math.floor(hoursSincePlayed * 3);

    return {
      ...rawPet,
      name: rawPet.name || "JJ",
      hunger: Math.max(0, Math.min(100, (rawPet.hunger ?? 100) - hungerLoss)),
      happiness: Math.max(0, Math.min(100, (rawPet.happiness ?? 100) - happyLoss)),
    };
  };

  const fetchPet = async () => {
    try {
      const { data } = await supabase.from("pet").select("*").limit(1).single();
      if (data) {
        setPet(calculateDecay(data));
      }
    } catch (err) {
      console.error("Failed to load pet:", err);
    }
  };

  useEffect(() => {
    fetchPet();

    // Realtime Supabase Subscription: Syncs immediately when Jane or Josh interacts
    const channel = supabase
      .channel("pet-realtime-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "pet" }, (payload) => {
        if (payload.new) {
          setPet(calculateDecay(payload.new as Pet));
        }
      })
      .subscribe();

    // Periodic client-side decay tick every 60 seconds
    const interval = setInterval(() => {
      setPet((prev) => (prev ? calculateDecay(prev) : null));
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [supabase]);

  // Determine dynamic emotion & drama state
  const getMoodState = () => {
    if (!pet) return { face: CAT_FACES.normal, status: "JJ is resting peacefully" };
    
    if (pet.hunger === 0 && pet.happiness === 0) {
      return {
        face: CAT_FACES.drama_queen,
        status: "JJ is doing dramatic fainting! Demands snacks & love! 😾",
      };
    }
    if (pet.hunger <= 15) {
      return {
        face: CAT_FACES.starving,
        status: "JJ is staring at the empty bowl crying for food! 🍙💦",
      };
    }
    if (pet.happiness <= 20) {
      return {
        face: CAT_FACES.lonely,
        status: "JJ is sulking in a cardboard box... needs pets! 📦",
      };
    }
    if (pet.hunger < 50) {
      return {
        face: CAT_FACES.hungry,
        status: "JJ's tummy is rumbling for a snack 🍙",
      };
    }
    if (pet.hunger >= 80 && pet.happiness >= 80) {
      return {
        face: CAT_FACES.super_happy,
        status: "JJ is purring loudly & making biscuits on your lap! 🌸",
      };
    }
    if (pet.happiness >= 60) {
      return {
        face: CAT_FACES.happy,
        status: "JJ is happy and watching birds outside 🕊️",
      };
    }
    return {
      face: CAT_FACES.normal,
      status: "JJ is chilling cozy in the room 🐱",
    };
  };

  const doAction = async (action: "feed" | "pet" | "play") => {
    if (!user || !pet || !isAdmin) return;

    const nowIso = new Date().toISOString();
    const updates: Partial<Pet> = {
      name: "JJ",
      updated_at: nowIso,
    };
    let msg = "";

    if (action === "feed") {
      updates.hunger = Math.min(100, (pet.hunger || 0) + 30);
      updates.last_fed_by = user.id;
      updates.last_fed_at = nowIso;
      msg = `${profile?.display_name || "You"} fed JJ delicious treats! 🍙`;
    } else if (action === "pet") {
      updates.happiness = Math.min(100, (pet.happiness || 0) + 20);
      msg = `${profile?.display_name || "You"} gave JJ gentle chin scratches! 🐾`;
    } else {
      updates.happiness = Math.min(100, (pet.happiness || 0) + 30);
      updates.last_played_by = user.id;
      updates.last_played_at = nowIso;
      msg = `${profile?.display_name || "You"} played laser pointer with JJ! 🎾`;
    }

    setPet((prev) => (prev ? { ...prev, ...updates } : null));
    showToast(msg, { emoji: "🐱", type: "love" });

    // Sync to Supabase
    await supabase.from("pet").update(updates).eq("id", pet.id);
    await supabase.from("pet_actions").insert({
      user_id: user.id,
      username: profile?.username || "user",
      action,
    });
  };

  const { face, status } = getMoodState();
  const isDanger = (pet?.hunger || 0) <= 20 || (pet?.happiness || 0) <= 20;

  return (
    <div className={`neu-card h-full p-5 flex flex-col justify-between transition-colors ${
      isDanger ? "bg-[#FED7AA]" : "bg-[#DCFCE7]"
    }`}>
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>🐱</span>
            <span>JJ</span>
          </span>
          <span className="font-hand text-xs text-[#23201D]">our shared pet</span>
        </div>

        {/* Pet Display Card */}
        <div className="inner-tile p-3 my-1 text-center">
          <motion.div
            animate={{
              y: isDanger ? [0, -4, 0] : [0, -2, 0],
              scale: isDanger ? [1, 1.05, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: isDanger ? 1.2 : 2 }}
            className="font-mono text-base font-bold text-[#23201D] py-0.5"
          >
            {face}
          </motion.div>

          <p className="font-hand text-xs text-[#6E675F] mt-0.5 truncate px-1">
            {status}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#23201D]/10 text-[10px] font-display font-bold">
            <div>
              <div className="flex justify-between text-[#6E675F] mb-0.5">
                <span>HUNGER</span>
                <span className={pet?.hunger && pet.hunger <= 20 ? "text-rose-600 font-black" : ""}>
                  {pet?.hunger || 0}%
                </span>
              </div>
              <div className="rpg-bar-container">
                <div
                  className="rpg-bar-fill transition-all"
                  style={{
                    width: `${pet?.hunger || 0}%`,
                    backgroundColor: (pet?.hunger || 0) <= 20 ? "#FFAAA6" : "#FEF08A",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[#6E675F] mb-0.5">
                <span>HAPPY</span>
                <span className={pet?.happiness && pet.happiness <= 20 ? "text-rose-600 font-black" : ""}>
                  {pet?.happiness || 0}%
                </span>
              </div>
              <div className="rpg-bar-container">
                <div
                  className="rpg-bar-fill transition-all"
                  style={{
                    width: `${pet?.happiness || 0}%`,
                    backgroundColor: (pet?.happiness || 0) <= 20 ? "#FFAAA6" : "#FFD1DC",
                  }}
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
              title="Feed JJ treats"
            >
              🍙 Feed
            </button>
            <button
              onClick={() => doAction("pet")}
              className="neu-btn neu-btn-pink text-[11px] py-1 px-1"
              title="Pet JJ softly"
            >
              🤗 Pet
            </button>
            <button
              onClick={() => doAction("play")}
              className="neu-btn neu-btn-white text-[11px] py-1 px-1"
              title="Play with toy mouse"
            >
              🎾 Play
            </button>
          </div>
        ) : (
          <p className="text-center font-hand text-xs text-[#6E675F]">
            sign in as josh or jane to take care of JJ ♡
          </p>
        )}
      </div>
    </div>
  );
}

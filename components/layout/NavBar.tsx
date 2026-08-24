"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { LogIn, LogOut, Menu, X, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

const NAV_ITEMS = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/journey", label: "28 Mei", emoji: "⏳" },
  { href: "/room", label: "Our Room", emoji: "🛋️" },
  { href: "/letters", label: "Letters", emoji: "💌" },
  { href: "/music", label: "Music", emoji: "🎧" },
  { href: "/memories", label: "Memories", emoji: "📸" },
  { href: "/jane", label: "Jane Lore™", emoji: "🌸" },
  { href: "/daily", label: "Daily", emoji: "💭" },
  { href: "/surprises", label: "Surprises", emoji: "🎁" },
  { href: "/quiz", label: "Quiz", emoji: "🧠" },
];

export function NavBar() {
  const pathname = usePathname();
  const { user, profile, signOut, isAdmin } = useAuth();
  const [logoClicks, setLogoClicks] = useState(0);
  const [showSecretMsg, setShowSecretMsg] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next === 7) {
      setShowSecretMsg(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.1 },
        colors: ["#FFCCD5", "#D8D2FF", "#FEF08A", "#BBF7D0"],
      });
      setTimeout(() => setShowSecretMsg(false), 4000);
      setLogoClicks(0);
    }
  };

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 py-3.5 backdrop-blur-md bg-[#FAF5EE]/90 border-b-[2.5px] border-[#2C2824]">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleLogoClick}
            className="group flex items-center gap-2.5 font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#2C2824] hover:scale-105 transition-transform"
            title="Psst... try clicking this 7 times"
          >
            <span className="w-8 h-8 rounded-xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-sm shadow-[2px_2px_0px_#2C2824] group-hover:rotate-12 transition-transform">
              🌸
            </span>
            <span className="flex items-center gap-1.5">
              <span>jane</span>
              <span className="text-[#FFAAA6] text-sm">✦</span>
              <span>josh</span>
            </span>
          </button>

          {/* Secret Toast on 7 clicks */}
          <AnimatePresence>
            {showSecretMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute top-12 left-0 z-50 whitespace-nowrap bg-[#FEF08A] border-2 border-[#2C2824] rounded-xl px-3 py-1.5 shadow-[3px_3px_0px_#2C2824] font-hand text-base text-[#2C2824] flex items-center gap-1.5"
              >
                <Heart size={14} className="fill-[#FFAAA6] text-[#FFAAA6]" />
                <span>Secret unlocked: you found our tiny world! 💗</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#FFFDF9] border-2 border-[#2C2824] p-1.5 rounded-2xl shadow-[3px_3px_0px_#2C2824]">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all ${
                  active
                    ? "bg-[#FFCCD5] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] -translate-y-0.5 text-[#2C2824]"
                    : "text-[#7A7269] hover:text-[#2C2824] hover:bg-[#FAF5EE]"
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Status / Login Button */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 bg-[#BBF7D0] border-2 border-[#2C2824] px-3 py-1 rounded-xl shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold text-[#2C2824]">
                <span>{profile?.avatar_url || "💻"}</span>
                <span className="capitalize">{profile?.username || "Josh"}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                onClick={() => signOut()}
                className="neu-btn neu-btn-white text-xs py-1.5 px-3 flex items-center gap-1 shadow-[2px_2px_0px_#2C2824]"
                title="Sign out of universe"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="neu-btn neu-btn-pink text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-[2px_2px_0px_#2C2824]"
            >
              <LogIn size={13} />
              <span>Sign in</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border-2 border-[#2C2824] bg-[#FFFDF9] shadow-[2px_2px_0px_#2C2824] text-[#2C2824]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 pt-3 border-t-2 border-[#2C2824]/15 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 pb-2">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2.5 rounded-xl border-2 font-display font-bold text-xs flex items-center gap-2 transition-all ${
                      active
                        ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-[#2C2824]"
                        : "bg-[#FFFDF9] border-[#2C2824]/30 text-[#7A7269]"
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

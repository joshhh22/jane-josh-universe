"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { Eye, EyeOff, Lock, Mail, Heart, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { signIn, isAdmin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError("Incorrect email or password. Who are you? 👀");
    } else {
      router.replace("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] flex flex-col items-center justify-center p-4 selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="neu-box p-8 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[8px_8px_0px_#2C2824] space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFCCD5] border-[2.5px] border-[#2C2824] flex items-center justify-center text-3xl shadow-[3px_3px_0px_#2C2824] animate-bounce">
              🌸
            </div>
            <h1 className="font-display font-black text-3xl text-[#2C2824] tracking-tight">
              welcome back
            </h1>
            <p className="font-hand text-xl text-[#7A7269]">
              jane &amp; josh private universe login ✦
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2.5 text-sm font-body bg-[#FAF5EE] focus:bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] block">
                password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2.5 pr-10 text-sm font-body bg-[#FAF5EE] focus:bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7269] hover:text-[#2C2824]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#FFAAA6]/30 border-2 border-[#FFAAA6] text-center font-hand text-base text-[#2C2824]"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="neu-btn neu-btn-pink w-full py-3 text-sm font-display font-bold uppercase tracking-wider shadow-[4px_4px_0px_#2C2824] disabled:opacity-50"
            >
              {loading ? "authenticating..." : "enter our universe ✨"}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#2C2824]/10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-hand text-lg text-[#7A7269] hover:text-[#2C2824] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>just visiting? return to home</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

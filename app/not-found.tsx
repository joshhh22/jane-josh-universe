"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-float">🌸</div>
        <h1 className="font-display font-extrabold text-4xl mb-2">404</h1>
        <p className="font-hand text-xl text-[#171717]/50 mb-6">
          this page doesn't exist in our universe
        </p>
        <Link href="/" className="neu-btn neu-btn-pink">
          ← go back home
        </Link>
      </div>
    </div>
  );
}

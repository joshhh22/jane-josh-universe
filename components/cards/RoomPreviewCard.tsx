"use client";

import { Suspense, lazy } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const OurRoom3D = lazy(() => import("@/components/3d/OurRoom"));

export function RoomPreviewCard() {
  return (
    <div className="neu-card h-full flex flex-col overflow-hidden relative group bg-[#F5EBE0]">
      {/* Header Pill */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
        <span className="badge-pill bg-[#FFFFFF]">
          <span>🏠</span>
          <span>Our 3D Room</span>
        </span>
      </div>

      {/* Explore Button */}
      <Link
        href="/room"
        className="absolute top-3.5 right-3.5 z-20 neu-btn neu-btn-pink text-xs py-1 px-3 shadow-[2px_2px_0px_#23201D] flex items-center gap-1 group-hover:scale-105 transition-transform"
      >
        <span>step inside</span>
        <ArrowUpRight size={13} />
      </Link>

      {/* 3D Canvas */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#FAF5EE]">
              <span className="text-4xl animate-bounce">🏠</span>
              <p className="font-hand text-base text-[#6E675F]">loading 3d room...</p>
            </div>
          }
        >
          <OurRoom3D interactive={false} />
        </Suspense>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-2.5 left-3.5 z-20 pointer-events-none">
        <span className="bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#23201D]/20 px-2.5 py-0.5 rounded-full font-hand text-xs text-[#23201D] shadow-sm">
          💡 drag to rotate &amp; view
        </span>
      </div>
    </div>
  );
}

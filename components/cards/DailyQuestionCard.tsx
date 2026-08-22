"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { DailyQuestion } from "@/lib/supabase/types";
import { MessageCircle, ArrowRight } from "lucide-react";

export function DailyQuestionCard() {
  const supabase = createClient();
  const [question, setQuestion] = useState<DailyQuestion | null>({
    id: "1",
    question: "What made you smile today?",
    question_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  });
  const [answersCount, setAnswersCount] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    supabase
      .from("daily_questions")
      .select("*")
      .eq("question_date", today)
      .single()
      .then(({ data }) => {
        if (data) setQuestion(data);
      });

    supabase
      .from("daily_answers")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        if (count !== null) setAnswersCount(count);
      });
  }, []);

  return (
    <Link href="/daily" className="block h-full">
      <div className="neu-card neu-card-hover h-full p-5 bg-[#E0F2FE] flex flex-col justify-between group">
        {/* Card Header with non-wrapping pills */}
        <div className="flex items-center justify-between gap-2">
          <span className="badge-pill bg-[#FFFFFF]">
            <span>💭</span>
            <span>Daily Question</span>
          </span>
          <span className="badge-pill bg-[#FEF08A]">
            {answersCount} Answers
          </span>
        </div>

        {/* Question Quote Box */}
        <div className="my-auto py-3">
          <div className="inner-tile p-4">
            <p className="font-hand text-xl sm:text-2xl text-[#23201D] leading-snug text-center">
              &ldquo;{question?.question || "What made you smile today?"}&rdquo;
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-2 border-t border-[#23201D]/15 flex items-center justify-between text-xs font-display font-bold text-[#23201D]">
          <span>write or view answers</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

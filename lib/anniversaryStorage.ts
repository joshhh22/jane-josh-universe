export interface LoveMilestone {
  id: string;
  days: number;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
}

export const MILESTONES: LoveMilestone[] = [
  {
    id: "day-1",
    days: 1,
    title: "The Beginning",
    subtitle: "28 Mei 2026 — Where Our Universe Began",
    emoji: "🌸",
    description: "The sweetest day when Josh & Jane officially chose each other ♡",
  },
  {
    id: "day-30",
    days: 30,
    title: "1 Month of Magic",
    subtitle: "30 Days of Sweet Talks",
    emoji: "💌",
    description: "One month of daily goodmornings, late night laughs, and butterflies.",
  },
  {
    id: "day-100",
    days: 100,
    title: "Century of Love",
    subtitle: "100 Days Together",
    emoji: "💯",
    description: "100 continuous days of growing closer, understanding each other, and loving deeper.",
  },
  {
    id: "day-200",
    days: 200,
    title: "200 Days of Us",
    subtitle: "Halfway to a Year",
    emoji: "✨",
    description: "Through every mood, every call, and every memory — you remain my favorite person.",
  },
  {
    id: "day-365",
    days: 365,
    title: "1 Full Year",
    subtitle: "365 Days of Loving Jane",
    emoji: "🎂",
    description: "365 days of holding your hand in spirit and in heart. 1 year down, forever to go!",
  },
  {
    id: "day-500",
    days: 500,
    title: "Half a Thousand Days",
    subtitle: "500 Days Milestone",
    emoji: "🌟",
    description: "500 days and every single day I still find new reasons to adore you.",
  },
  {
    id: "day-730",
    days: 730,
    title: "2 Full Years",
    subtitle: "730 Days of Forever",
    emoji: "💍",
    description: "Two complete trips around the sun together. Stronger and sweeter than ever.",
  },
  {
    id: "day-1000",
    days: 1000,
    title: "1,000 Days Club",
    subtitle: "To Infinity & Beyond",
    emoji: "🚀",
    description: "A thousand days of pure unconditional love. Our love story is our favorite masterpiece.",
  },
];

export const LOVE_REASONS = [
  "Because your laugh is literally the sweetest sound in the universe.",
  "Because you always know how to make my day 1000x brighter just by existing.",
  "Because having you in my life feels like finding home in another person.",
  "Because our 28 Mei 2026 date is the best decision we ever made ♡",
  "Because you are effortlessly gorgeous, cute, and full of warmth.",
  "Because even in silence, being with you feels so calm and safe.",
  "Because I fall for you a little more every single morning.",
  "Because nobody understands my weird jokes quite like you do!",
  "Because your happiness is my favorite priority in this world.",
];

export function getAnniversaryDate(year: number = 2026): Date {
  return new Date(year, 4, 28, 0, 0, 0); // Month 4 is May (0-indexed)
}

export function calculateLoveStats(startDate: Date, now: Date = new Date()) {
  const diffMs = Math.max(0, now.getTime() - startDate.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((diffMs % 1000) / 10); // 2 digits (0-99)

  // Average human resting heartbeat: ~78 bpm
  const estimatedHeartbeats = Math.floor(totalMinutes * 78);
  const estimatedHugsKisses = Math.floor(totalDays * 12);
  const estimatedLaughter = Math.floor(totalDays * 18);

  // Next 28 Mei calculation (Targeting May 28, 2027)
  const currentYear = now.getFullYear();
  let nextAnniv = new Date(currentYear, 4, 28, 0, 0, 0);
  if (now.getTime() >= nextAnniv.getTime()) {
    nextAnniv = new Date(currentYear + 1, 4, 28, 0, 0, 0);
  }

  const prevAnniv = new Date(nextAnniv.getFullYear() - 1, 4, 28, 0, 0, 0);
  const nextDiffMs = Math.max(0, nextAnniv.getTime() - now.getTime());
  const nextDays = Math.floor(nextDiffMs / (1000 * 60 * 60 * 24));
  const nextHours = Math.floor((nextDiffMs / (1000 * 60 * 60)) % 24);
  const nextMinutes = Math.floor((nextDiffMs / (1000 * 60)) % 60);
  const nextSeconds = Math.floor((nextDiffMs / 1000) % 60);

  const totalCycleMs = nextAnniv.getTime() - prevAnniv.getTime();
  const elapsedInCycleMs = now.getTime() - prevAnniv.getTime();
  const nextProgressPercent = Math.min(100, Math.max(0, (elapsedInCycleMs / totalCycleMs) * 100));

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    estimatedHeartbeats,
    estimatedHugsKisses,
    estimatedLaughter,
    nextAnniv: {
      date: nextAnniv,
      days: nextDays,
      hours: nextHours,
      minutes: nextMinutes,
      seconds: nextSeconds,
      progressPercent: nextProgressPercent,
      targetYear: nextAnniv.getFullYear(),
    },
  };
}

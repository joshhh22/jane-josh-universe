import type { Song } from "@/lib/supabase/types";

export const STORAGE_SONGS_KEY = "jane_josh_songs_v9_perfect";
export const STORAGE_BLACKLIST_KEY = "jane_josh_deleted_blacklist_v4";

export type CustomSongItem = Song & {
  album_cover?: string | null;
  sender_name?: string | null;
};

export const getBlacklist = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_BLACKLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addToBlacklist = (keys: (string | null | undefined)[]) => {
  if (typeof window === "undefined") return;
  const current = getBlacklist();
  keys.forEach((k) => {
    const clean = k?.trim().toLowerCase();
    if (clean && !current.includes(clean)) current.push(clean);
  });
  localStorage.setItem(STORAGE_BLACKLIST_KEY, JSON.stringify(current));
};

export const removeFromBlacklist = (key: string | null | undefined) => {
  if (typeof window === "undefined" || !key) return;
  const clean = key.trim().toLowerCase();
  const current = getBlacklist().filter((k) => k !== clean);
  localStorage.setItem(STORAGE_BLACKLIST_KEY, JSON.stringify(current));
};

export const getCleanLocalSongs = (): CustomSongItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const blacklist = getBlacklist();
    const raw = localStorage.getItem(STORAGE_SONGS_KEY);
    if (!raw) return [];
    const parsed: CustomSongItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s) => {
      const cleanTitle = s.title?.trim().toLowerCase();
      const isBlacklisted =
        (s.id && blacklist.includes(s.id.toLowerCase())) ||
        (cleanTitle && blacklist.includes(cleanTitle));
      return !isBlacklisted;
    });
  } catch {
    return [];
  }
};

export const saveCleanLocalSongs = (songs: CustomSongItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_SONGS_KEY, JSON.stringify(songs));
};

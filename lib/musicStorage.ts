import type { Song } from "@/lib/supabase/types";

export const STORAGE_SONGS_KEY = "jane_josh_songs_master_v10";

export type CustomSongItem = Song & {
  album_cover?: string | null;
  sender_name?: string | null;
};

// Initial Real Songs created by user
export const INITIAL_REAL_SONGS: CustomSongItem[] = [
  {
    id: "song_always",
    title: "Always",
    artist: "Daniel Caesar",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/dc/72/7e/dc727e4b-a63e-324c-be9f-86f78f8cb080/196589088628.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/search/Always%20Daniel%20Caesar",
    reason: "I LOVE YOUU EVERYDAY",
    added_by: "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe",
    sender_name: "josh",
    created_at: "2026-08-23T18:00:00.000Z",
  },
  {
    id: "song_heaven",
    title: "Heaven",
    artist: "Bryan Adams",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/74/d3/18/74d31835-cc01-9a7c-54be-930f7c22df65/19UMGIM70868.rgb.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/search/Heaven%20Bryan%20Adams",
    reason: "i loveee youu!!!",
    added_by: "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe",
    sender_name: "josh",
    created_at: "2026-08-23T18:01:00.000Z",
  },
  {
    id: "song_kabar_bahagia",
    title: "Kabar Bahagia",
    artist: "rumahsakit",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/c5/61/fac561dc-8db4-b2e9-d3db-6e246da72bfa/5054197890017.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/search/Kabar%20Bahagia%20rumahsakit",
    reason: "yess u are my kabar bahagia jugaaaa",
    added_by: "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe",
    sender_name: "josh",
    created_at: "2026-08-23T18:02:00.000Z",
  },
  {
    id: "song_panasea",
    title: "Panasea",
    artist: "rumahsakit",
    album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/search/Panasea%20rumahsakit",
    reason: "KAU PANASEA BAGIKUU SELAMANYAAA",
    added_by: "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe",
    sender_name: "josh",
    created_at: "2026-08-23T18:03:00.000Z",
  },
];

// Helper to check if a title is a stale test title
export function isStaleTestTitle(title?: string | null): boolean {
  if (!title) return true;
  const t = title.trim().toLowerCase();
  return (
    t === "apocalypse" ||
    t === "seasons" ||
    t === "double take" ||
    t === "lover" ||
    t === "every way" ||
    t === "best part"
  );
}

// Helper to encode metadata into URL
export function encodeSongUrl(spotifyUrl: string, artworkUrl?: string | null, sender?: string | null): string {
  const base = spotifyUrl || "https://open.spotify.com";
  const params = new URLSearchParams();
  if (artworkUrl) params.set("cover", artworkUrl);
  if (sender) params.set("sender", sender);
  const paramStr = params.toString();
  return paramStr ? `${base}#${paramStr}` : base;
}

// Helper to decode metadata from URL
export function parseSongRow(rawSong: any): CustomSongItem {
  let cleanUrl = rawSong.url || "";
  let album_cover: string | null = rawSong.album_cover || null;
  let sender_name: string | null = rawSong.sender_name || (rawSong.recipient === "josh" ? "jane" : "josh");

  if (rawSong.url && rawSong.url.includes("#")) {
    const [baseUrl, hash] = rawSong.url.split("#");
    cleanUrl = baseUrl;
    try {
      const params = new URLSearchParams(hash);
      const coverParam = params.get("cover");
      const senderParam = params.get("sender");
      if (coverParam) album_cover = decodeURIComponent(coverParam);
      if (senderParam) sender_name = senderParam;
    } catch (e) {
      console.error("URL parse error:", e);
    }
  }

  // Fallback high-res covers
  if (!album_cover) {
    if (rawSong.title === "Always") {
      album_cover = "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/dc/72/7e/dc727e4b-a63e-324c-be9f-86f78f8cb080/196589088628.jpg/600x600bb.jpg";
    } else if (rawSong.title === "Heaven") {
      album_cover = "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/74/d3/18/74d31835-cc01-9a7c-54be-930f7c22df65/19UMGIM70868.rgb.jpg/600x600bb.jpg";
    } else if (rawSong.title === "Kabar Bahagia") {
      album_cover = "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/c5/61/fac561dc-8db4-b2e9-d3db-6e246da72bfa/5054197890017.jpg/600x600bb.jpg";
    } else if (rawSong.title === "Panasea") {
      album_cover = "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg";
    } else {
      album_cover = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80";
    }
  }

  return {
    ...rawSong,
    url: cleanUrl,
    album_cover,
    sender_name: sender_name || "josh",
  };
}

export const getCachedSongs = (): CustomSongItem[] => {
  if (typeof window === "undefined") return INITIAL_REAL_SONGS;
  try {
    const raw = localStorage.getItem(STORAGE_SONGS_KEY);
    if (!raw) return INITIAL_REAL_SONGS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out stale test titles
      const filtered = parsed.filter((s) => !isStaleTestTitle(s.title));
      return filtered.length > 0 ? filtered : INITIAL_REAL_SONGS;
    }
    return INITIAL_REAL_SONGS;
  } catch {
    return INITIAL_REAL_SONGS;
  }
};

export const setCachedSongs = (songs: CustomSongItem[]) => {
  if (typeof window === "undefined") return;
  const filtered = songs.filter((s) => !isStaleTestTitle(s.title));
  localStorage.setItem(STORAGE_SONGS_KEY, JSON.stringify(filtered));
};

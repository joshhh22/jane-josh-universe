import type { Song } from "@/lib/supabase/types";

export const STORAGE_SONGS_KEY = "jane_josh_songs_cloud_v1";

export type CustomSongItem = Song & {
  album_cover?: string | null;
  sender_name?: string | null;
};

// Default high-res fallback cover
export const DEFAULT_FALLBACK_COVER =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80";

// Helper to encode metadata into standard URL format safely for Supabase schema
export function encodeSongUrl(spotifyUrl: string, artworkUrl?: string | null, sender?: string | null): string {
  const base = spotifyUrl || "https://open.spotify.com";
  const params = new URLSearchParams();
  if (artworkUrl) params.set("cover", artworkUrl);
  if (sender) params.set("sender", sender);
  const paramStr = params.toString();
  return paramStr ? `${base}#${paramStr}` : base;
}

// Helper to decode metadata from standard URL format
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

  // Fallback covers for specific songs if missing
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
      album_cover = DEFAULT_FALLBACK_COVER;
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
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_SONGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const setCachedSongs = (songs: CustomSongItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_SONGS_KEY, JSON.stringify(songs));
};

import type { Song } from "@/lib/supabase/types";

export type CustomSongItem = Song & {
  album_cover?: string | null;
  sender_name?: string | null;
};

// Safe URL encoder to preserve real high-res album cover & sender in cloud
export function encodeSongUrl(spotifyUrl: string, artworkUrl?: string | null, sender?: string | null): string {
  const base = spotifyUrl || "https://open.spotify.com";
  const params = new URLSearchParams();
  if (artworkUrl) params.set("cover", artworkUrl);
  if (sender) params.set("sender", sender);
  const paramStr = params.toString();
  return paramStr ? `${base}#${paramStr}` : base;
}

// Parse row from database
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

  return {
    ...rawSong,
    url: cleanUrl,
    album_cover:
      album_cover ||
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
    sender_name: sender_name || "josh",
  };
}

// Clear all legacy storage keys on the client
export function clearAllLegacyStorage() {
  if (typeof window === "undefined") return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("jane_josh_")) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

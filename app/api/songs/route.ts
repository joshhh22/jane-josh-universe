import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nndxgxeqbcppoycabpuw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = "force-dynamic";

// Active cloud deleted set
const globalDeletedTitles = new Set<string>([
  "every way",
  "best part",
  "apocalypse",
  "seasons",
  "double take",
  "lover",
  "hey jude",
]);

// Memory storage for live songs added via API
const memorySongs: any[] = [];

// 1. GET: Fetch all active songs for all devices
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });

    const all = [...memorySongs, ...(data || [])];

    // Filter out deleted titles and deduplicate
    const map = new Map<string, any>();
    all.forEach((s) => {
      const cleanTitle = s.title?.trim().toLowerCase();
      if (cleanTitle && !globalDeletedTitles.has(cleanTitle) && !map.has(cleanTitle)) {
        map.set(cleanTitle, s);
      }
    });

    const clean = Array.from(map.values());
    return NextResponse.json({ songs: clean });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Add a new song
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, artist, url, reason, added_by } = body;

    if (!title || !artist) {
      return NextResponse.json({ error: "Title and artist are required" }, { status: 400 });
    }

    const cleanTitle = title.trim().toLowerCase();
    globalDeletedTitles.delete(cleanTitle);

    const newSong = {
      id: "song_" + Date.now(),
      title,
      artist,
      url,
      reason: reason || "",
      added_by: added_by || "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe",
      created_at: new Date().toISOString(),
    };

    // Add to memory list
    memorySongs.unshift(newSong);

    // Also attempt Supabase insert
    try {
      await supabase.from("songs").insert({
        title,
        artist,
        url,
        reason: reason || "",
        added_by: newSong.added_by,
      });
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ song: newSong });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. DELETE: Delete a song by Title or ID
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, title } = body;

    if (title) {
      const cleanTitle = title.trim().toLowerCase();
      globalDeletedTitles.add(cleanTitle);

      // Remove from memorySongs
      const idx = memorySongs.findIndex((m) => m.title?.trim().toLowerCase() === cleanTitle);
      if (idx !== -1) memorySongs.splice(idx, 1);
    }

    if (id) {
      globalDeletedTitles.add(id.toLowerCase());
      const idx = memorySongs.findIndex((m) => m.id === id);
      if (idx !== -1) memorySongs.splice(idx, 1);

      if (id.length > 20) {
        try {
          await supabase.from("songs").delete().eq("id", id);
        } catch (e) {}
      }
    }

    if (title) {
      try {
        await supabase.from("songs").delete().ilike("title", title);
      } catch (e) {}
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

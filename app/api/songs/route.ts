import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nndxgxeqbcppoycabpuw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Create server-side supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = "force-dynamic";

// Filter out stale test seed titles
function isStale(title?: string | null) {
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

// 1. GET: Fetch all clean songs
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const clean = (data || []).filter((s) => !isStale(s.title));
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

    const { data, error } = await supabase
      .from("songs")
      .insert({
        title,
        artist,
        url,
        reason: reason || "",
        added_by: added_by || "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ song: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. DELETE: Delete a song by ID and Title
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, title } = body;

    if (id && id.length > 20) {
      await supabase.from("songs").delete().eq("id", id);
    }
    if (title) {
      await supabase.from("songs").delete().ilike("title", title);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

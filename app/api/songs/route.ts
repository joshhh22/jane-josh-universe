import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isStaleLegacySong } from "@/lib/musicStorage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nndxgxeqbcppoycabpuw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Base public client
const publicSupabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = "force-dynamic";

// Helper to get client with optional auth token
function getClient(req?: Request) {
  const authHeader = req?.headers.get("Authorization");
  if (authHeader) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });
  }
  return publicSupabase;
}

// 1. GET: Fetch all active songs directly from Supabase PostgreSQL
export async function GET(req: Request) {
  try {
    const supabase = getClient(req);
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out only the known zombie test seed IDs and deduplicate by title
    const map = new Map<string, any>();
    (data || []).forEach((s) => {
      if (isStaleLegacySong(s.id)) return;
      const cleanTitle = s.title?.trim().toLowerCase();
      if (cleanTitle && !map.has(cleanTitle)) {
        map.set(cleanTitle, s);
      }
    });

    const clean = Array.from(map.values());
    return NextResponse.json({ songs: clean });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Add a new song permanently in Supabase PostgreSQL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, artist, url, reason, added_by } = body;

    if (!title || !artist) {
      return NextResponse.json({ error: "Title and artist are required" }, { status: 400 });
    }

    const supabase = getClient(req);

    const { data, error } = await supabase
      .from("songs")
      .insert({
        title: title.trim(),
        artist: artist.trim(),
        url: url || "",
        reason: reason?.trim() || "",
        added_by: added_by || "c3e9efa1-a933-43f3-91ad-dba9cf8d9fbe",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase API insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ song: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. DELETE: Delete a song permanently from Supabase PostgreSQL
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, title } = body;

    const supabase = getClient(req);

    let deleted = false;

    if (id) {
      const { error } = await supabase.from("songs").delete().eq("id", id);
      if (!error) deleted = true;
    }

    if (title) {
      const { error } = await supabase.from("songs").delete().ilike("title", title);
      if (!error) deleted = true;
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


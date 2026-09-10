import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (typeof window !== "undefined" && clientInstance) {
    return clientInstance;
  }

  // During build/prerender, env vars may not be present
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
  const newClient = createBrowserClient<Database>(url, key);

  if (typeof window !== "undefined") {
    clientInstance = newClient;
  }

  return newClient;
}


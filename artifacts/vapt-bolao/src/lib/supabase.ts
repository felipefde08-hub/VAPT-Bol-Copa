import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;

if (!supabase) {
  console.warn("⚠️ Supabase não configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
}

export type BolaoEntry = {
  name: string;
  email: string;
  whatsapp: string;
  coupon_code: string;
  timestamp: number;
  group_picks?: Record<string, string[]>;
  champion?: string;
  runner_up?: string;
  top_scorer?: string;
  best_player?: string;
  best_goalkeeper?: string;
  neymar_goes_copa?: boolean | null;
  completed?: boolean;
};

export async function saveEntry(entry: BolaoEntry): Promise<void> {
  if (!supabase) {
    console.error("❌ saveEntry: Supabase client is null. Env vars ausentes no Vercel.");
    return;
  }

  const { error } = await supabase
    .from("bolao_entries")
    .upsert(entry, { onConflict: "email" });

  if (error) {
    console.error("❌ saveEntry error:", error.message, error.details, error.hint);
  } else {
    console.log("✅ Entrada salva:", entry.email);
  }
}

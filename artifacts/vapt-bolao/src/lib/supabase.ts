import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;

export type BolaoEntry = {
  name: string;
  email: string;
  whatsapp: string;
  coupon_code: string;
  timestamp: number;
  group_picks: Record<string, string[]>;
  champion: string;
  runner_up: string;
  top_scorer: string;
  best_player: string;
  best_goalkeeper: string;
  neymar_goes_copa: boolean | null;
};

export async function saveEntry(entry: BolaoEntry): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error } = await supabase
    .from("bolao_entries")
    .upsert(entry, { onConflict: "email" });

  return { error: error?.message ?? null };
}

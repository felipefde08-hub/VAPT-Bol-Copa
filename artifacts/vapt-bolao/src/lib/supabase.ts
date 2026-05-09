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
  group_picks?: Record<string, string[]>;
  champion?: string;
  runner_up?: string;
  top_scorer?: string;
  best_player?: string;
  best_goalkeeper?: string;
  neymar_goes_copa?: boolean | null;
  completed?: boolean;
};

/* Usuários anônimos só precisam de INSERT + UPDATE (upsert por email).
   Nenhum SELECT é feito aqui — anônimos não lêem os dados. */
export async function saveEntry(entry: BolaoEntry): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("bolao_entries")
    .upsert(entry, { onConflict: "email" });
}

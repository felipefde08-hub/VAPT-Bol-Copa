import { createClient } from "@supabase/supabase-js";

const url  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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

export async function saveEntry(entry: BolaoEntry): Promise<void> {
  if (!supabase) {
    console.error("❌ Supabase não configurado — verifique as env vars VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.");
    return;
  }

  // Tenta INSERT primeiro
  const { error: insertError } = await supabase
    .from("bolao_entries")
    .insert(entry);

  if (!insertError) {
    console.log("✅ Salvo (insert):", entry.email);
    return;
  }

  // Se o email já existe (código 23505 = unique violation), faz UPDATE
  if (insertError.code === "23505") {
    const { error: updateError } = await supabase
      .from("bolao_entries")
      .update(entry)
      .eq("email", entry.email);

    if (!updateError) {
      console.log("✅ Atualizado (update):", entry.email);
    } else {
      console.error("❌ Update falhou:", updateError.message, updateError.details);
    }
    return;
  }

  console.error("❌ Insert falhou:", insertError.message, insertError.details, insertError.hint);
}

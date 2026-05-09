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

export async function saveEntry(entry: BolaoEntry): Promise<string | null> {
  if (!supabase) {
    const msg = "Supabase não configurado (env vars ausentes no Vercel)";
    console.error("❌", msg);
    return msg;
  }

  // Tenta INSERT primeiro
  const { error: insertError } = await supabase
    .from("bolao_entries")
    .insert(entry);

  if (!insertError) {
    console.log("✅ Salvo:", entry.email);
    return null;
  }

  // Email já existe → UPDATE
  if (insertError.code === "23505") {
    const { error: updateError } = await supabase
      .from("bolao_entries")
      .update(entry)
      .eq("email", entry.email);

    if (!updateError) {
      console.log("✅ Atualizado:", entry.email);
      return null;
    }
    const msg = `Update falhou: ${updateError.message}`;
    console.error("❌", msg);
    return msg;
  }

  const msg = `Insert falhou: ${insertError.message} (code: ${insertError.code})`;
  console.error("❌", msg);
  return msg;
}

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EntryData } from "@/pages/bolao";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  name:     z.string().min(2, "Nome é obrigatório"),
  email:    z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "Mínimo 10 dígitos").regex(/^[0-9]+$/, "Apenas números"),
});

const PRIZES = [
  { icon: "🎁", label: "Só por participar",           value: "Frete Grátis"     },
  { icon: "🏆", label: "Acertar o Campeão",           value: "20% de desconto"  },
  { icon: "🥈", label: "Acertar o Vice-Campeão",      value: "10% de desconto"  },
  { icon: "⚽", label: "Artilheiro / Melhor Jogador", value: "10% de desconto"  },
  { icon: "🧤", label: "Melhor Goleiro",              value: "10% de desconto"  },
];

function rowToEntry(row: Record<string, unknown>): Partial<EntryData> {
  return {
    name:           row.name as string,
    email:          row.email as string,
    whatsapp:       row.whatsapp as string,
    couponCode:     row.coupon_code as string,
    timestamp:      row.timestamp as number,
    groupPicks:     (row.group_picks as Record<string, string[]>) || {},
    champion:       (row.champion as string)       || "",
    runnerUp:       (row.runner_up as string)      || "",
    topScorer:      (row.top_scorer as string)     || "",
    bestPlayer:     (row.best_player as string)    || "",
    bestGoalkeeper: (row.best_goalkeeper as string)|| "",
    neymarGoesCopa: row.neymar_goes_copa as boolean | null,
  };
}

export default function RegistrationStep({
  onNext,
  initialData,
}: {
  onNext: (data: Partial<EntryData>, targetStep?: number) => void;
  initialData: Partial<EntryData>;
}) {
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverError, setRecoverError] = useState("");
  const [showRecover, setShowRecover] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:     initialData.name     || "",
      email:    initialData.email    || "",
      whatsapp: initialData.whatsapp || "",
    },
  });

  const generateCoupon = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return `VAPT-COPA-${code}`;
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    const couponCode = initialData.couponCode || generateCoupon();
    onNext({ ...values, couponCode, timestamp: initialData.timestamp || Date.now() });
    setLoading(false);
  };

  const handleRecover = async () => {
    if (!recoverEmail || !supabase) return;
    setRecovering(true);
    setRecoverError("");
    const { data: row } = await supabase
      .from("bolao_entries")
      .select("*")
      .eq("email", recoverEmail.trim().toLowerCase())
      .maybeSingle();
    if (!row) {
      setRecoverError("Nenhum palpite encontrado com esse e-mail.");
      setRecovering(false);
      return;
    }
    const entry = rowToEntry(row);
    const completed = row.completed && Object.keys(row.group_picks || {}).length > 0;
    onNext(entry, completed ? 3 : 2);
    setRecovering(false);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    borderColor: "rgba(255,255,255,0.15)",
  };

  return (
    <div className="space-y-5 slide-up">
      {/* Banner */}
      <div
        className="rounded-2xl p-4 text-center border"
        style={{ background: "rgba(255,215,0,0.08)", borderColor: "rgba(255,215,0,0.25)" }}
      >
        <p className="font-bold text-lg" style={{ color: "#FFD700" }}>🎁 Só por participar: Frete Grátis!</p>
        <p className="text-white/55 text-sm mt-1">
          Acerte o Campeão e ganhe 20% OFF. Palpites certos valem ainda mais!
        </p>
      </div>

      {/* Formulário */}
      <div
        className="rounded-2xl p-6 border"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/75 font-semibold text-sm">Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field}
                    className="h-12 text-white placeholder:text-white/25 border" style={inputStyle} />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/75 font-semibold text-sm">E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field}
                    className="h-12 text-white placeholder:text-white/25 border" style={inputStyle} />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )} />

            <FormField control={form.control} name="whatsapp" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/75 font-semibold text-sm">WhatsApp (apenas números)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="17999999999" {...field}
                    className="h-12 text-white placeholder:text-white/25 border" style={inputStyle} />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )} />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl text-white font-bold text-lg transition-all btn-green-glow hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#00C851", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Aguarde..." : "⚽ Garantir Frete Grátis & Iniciar Palpites"}
            </button>
          </form>
        </Form>
      </div>

      {/* Recuperar palpites */}
      {!showRecover ? (
        <button
          type="button"
          onClick={() => setShowRecover(true)}
          className="w-full text-center text-sm transition-colors hover:opacity-80"
          style={{ color: "#0057FF" }}
        >
          Já participei — ver meus palpites
        </button>
      ) : (
        <div
          className="rounded-2xl p-5 border space-y-3"
          style={{ background: "rgba(0,87,255,0.07)", borderColor: "rgba(0,87,255,0.25)" }}
        >
          <p className="text-white/70 text-sm text-center font-semibold">
            🔍 Digite o e-mail que usou no cadastro
          </p>
          <input
            type="email"
            value={recoverEmail}
            onChange={e => { setRecoverEmail(e.target.value); setRecoverError(""); }}
            onKeyDown={e => e.key === "Enter" && handleRecover()}
            placeholder="seu@email.com"
            className="w-full h-12 px-4 rounded-xl text-white text-center border"
            style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.15)", outline: "none" }}
          />
          {recoverError && (
            <p className="text-red-400 text-xs text-center">{recoverError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setShowRecover(false); setRecoverError(""); setRecoverEmail(""); }}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white/50 border border-white/10 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleRecover}
              disabled={recovering || !recoverEmail}
              className="flex-1 h-11 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#0057FF", opacity: recovering || !recoverEmail ? 0.6 : 1 }}
            >
              {recovering ? "Buscando..." : "Recuperar"}
            </button>
          </div>
        </div>
      )}

      {/* Premiações */}
      <div>
        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3 text-center">Prêmios por acerto</p>
        <div className="grid gap-2">
          {PRIZES.map((prize) => (
            <div key={prize.label} className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="text-2xl w-8 text-center flex-shrink-0">{prize.icon}</span>
              <p className="text-white/80 text-sm font-medium flex-1">{prize.label}</p>
              <span className="font-bold text-sm flex-shrink-0" style={{ color: "#FFD700" }}>{prize.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

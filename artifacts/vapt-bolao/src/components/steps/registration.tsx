import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EntryData } from "@/pages/bolao";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  name:      z.string().min(2, "Nome é obrigatório"),
  email:     z.string().email("E-mail inválido"),
  whatsapp:  z.string().min(10, "Mínimo 10 dígitos").regex(/^[0-9]+$/, "Apenas números"),
  password:  z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const PRIZES = [
  { icon: "🏆", label: "Acertar o Campeão",          value: "Cupom R$150" },
  { icon: "🥈", label: "Acertar o Vice-Campeão",      value: "Cupom R$80"  },
  { icon: "⚽", label: "Artilheiro / Melhor Jogador", value: "Cupom R$50"  },
  { icon: "🧤", label: "Melhor Goleiro",              value: "Cupom R$30"  },
];

function rowToEntry(row: Record<string, unknown>): Partial<EntryData> {
  return {
    name:           row.name as string,
    email:          row.email as string,
    whatsapp:       row.whatsapp as string,
    couponCode:     row.coupon_code as string,
    timestamp:      row.timestamp as number,
    groupPicks:     (row.group_picks as Record<string, string[]>) || {},
    champion:       (row.champion as string) || "",
    runnerUp:       (row.runner_up as string) || "",
    topScorer:      (row.top_scorer as string) || "",
    bestPlayer:     (row.best_player as string) || "",
    bestGoalkeeper: (row.best_goalkeeper as string) || "",
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
  const [authError, setAuthError] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:     initialData.name     || "",
      email:    initialData.email    || "",
      whatsapp: initialData.whatsapp || "",
      password: "",
    },
  });

  const generateCoupon = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return `VAPT-COPA-${code}`;
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setAuthError("");
    setLoading(true);

    /* Sem Supabase configurado → prossegue normalmente */
    if (!supabase) {
      const couponCode = initialData.couponCode || generateCoupon();
      onNext({ ...values, couponCode, timestamp: initialData.timestamp || Date.now() });
      setLoading(false);
      return;
    }

    /* Tenta criar conta */
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name } },
    });

    /* Email já existe: erro explícito OU identities vazio (comportamento do Supabase) */
    const alreadyExists =
      signUpError?.message?.toLowerCase().includes("already") ||
      signUpError?.status === 422 ||
      (signUpData?.user?.identities?.length === 0);

    if (signUpError && !alreadyExists) {
      setAuthError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    if (alreadyExists) {
      /* Email já existe — faz login */
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        setAuthError("Senha incorreta para este e-mail.");
        setLoading(false);
        return;
      }

      /* Carrega dados existentes */
      const { data: row } = await supabase
        .from("bolao_entries")
        .select("*")
        .eq("email", values.email)
        .maybeSingle();

      if (row) {
        const entry = rowToEntry(row);
        const completed = row.completed && Object.keys(row.group_picks || {}).length > 0;
        onNext(entry, completed ? 3 : 2);
        setLoading(false);
        return;
      }
    }

    /* Conta criada (nova) → gera cupom e avança */
    const couponCode = initialData.couponCode || generateCoupon();
    onNext({ ...values, couponCode, timestamp: initialData.timestamp || Date.now() });
    setLoading(false);
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
        <p className="font-bold text-lg" style={{ color: "#FFD700" }}>🎁 Cadastro = Frete Grátis!</p>
        <p className="text-white/55 text-sm mt-1">
          Crie sua conta gratuita e garanta seu cupom imediatamente.
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

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/75 font-semibold text-sm">
                  Senha <span className="text-white/35 font-normal">(para acessar seus palpites depois)</span>
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Mínimo 6 caracteres" {...field}
                    className="h-12 text-white placeholder:text-white/25 border" style={inputStyle} />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )} />

            {authError && (
              <div className="rounded-xl p-3 text-center text-sm" style={{ background: "rgba(255,68,68,0.1)", color: "#FF6666" }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl text-white font-bold text-lg transition-all btn-green-glow hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#00C851", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verificando..." : "⚽ Garantir Frete Grátis & Iniciar Palpites"}
            </button>

            <p className="text-center text-white/30 text-xs">
              Já participou? Use o mesmo e-mail e senha para continuar de onde parou.
            </p>
          </form>
        </Form>
      </div>

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

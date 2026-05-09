import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EntryData } from "@/pages/bolao";

const schema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp deve ter pelo menos 10 dígitos").regex(/^[0-9]+$/, "Apenas números"),
});

const PRIZES = [
  { icon: "🏆", label: "Acertar o Campeão", value: "Cupom R$150" },
  { icon: "🥈", label: "Acertar o Vice-Campeão", value: "Cupom R$80" },
  { icon: "⚽", label: "Artilheiro / Melhor Jogador", value: "Cupom R$50" },
  { icon: "🧤", label: "Melhor Goleiro", value: "Cupom R$30" },
];

export default function RegistrationStep({
  onNext,
  initialData,
}: {
  onNext: (data: Partial<EntryData>) => void;
  initialData: Partial<EntryData>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      whatsapp: initialData.whatsapp || "",
    },
  });

  const generateCoupon = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return `VAPT-COPA-${code}`;
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    const couponCode = initialData.couponCode || generateCoupon();
    onNext({ ...values, couponCode, timestamp: initialData.timestamp || Date.now() });
  };

  return (
    <div className="space-y-5 slide-up">
      {/* Banner frete grátis */}
      <div
        className="rounded-2xl p-4 text-center border"
        style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.05))",
          borderColor: "rgba(255,215,0,0.25)",
        }}
      >
        <p className="font-bold text-lg" style={{ color: "#FFD700" }}>🎁 Cadastro = Frete Grátis!</p>
        <p className="text-white/55 text-sm mt-1">
          Preencha seus dados para garantir seu primeiro cupom imediatamente.
        </p>
      </div>

      {/* Card do formulário */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/75 font-semibold text-sm">Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu nome completo"
                      {...field}
                      className="h-12 text-white placeholder:text-white/25 border"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        borderColor: "rgba(255,255,255,0.15)",
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/75 font-semibold text-sm">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                      className="h-12 text-white placeholder:text-white/25 border"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        borderColor: "rgba(255,255,255,0.15)",
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/75 font-semibold text-sm">WhatsApp (apenas números)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="17999999999"
                      {...field}
                      className="h-12 text-white placeholder:text-white/25 border"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        borderColor: "rgba(255,255,255,0.15)",
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full h-14 rounded-xl text-white font-bold text-lg transition-all btn-green-glow hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#00C851" }}
            >
              ⚽ Garantir Frete Grátis &amp; Iniciar Palpites
            </button>
          </form>
        </Form>
      </div>

      {/* Premiações */}
      <div>
        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3 text-center">
          Prêmios por acerto
        </p>
        <div className="grid gap-2">
          {PRIZES.map((prize) => (
            <div
              key={prize.label}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-2xl w-8 text-center flex-shrink-0">{prize.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium">{prize.label}</p>
              </div>
              <span className="font-bold text-sm flex-shrink-0" style={{ color: "#FFD700" }}>
                {prize.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

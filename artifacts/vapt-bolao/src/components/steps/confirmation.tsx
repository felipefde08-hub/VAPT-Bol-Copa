import React, { useMemo } from "react";
import { EntryData } from "@/pages/bolao";

const CONFETTI_COLORS = ["#FFD700", "#0057FF", "#00C851", "#FF6B6B", "#FFA500", "#FF69B4", "#00BFFF"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${5 + (i * 3.4) % 90}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: `${(i * 0.12) % 2}s`,
        duration: `${2.5 + (i * 0.17) % 2}s`,
        size: i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 5,
        shape: i % 2 === 0 ? "rounded-sm" : "rounded-full",
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.shape}`}
          style={{
            left: p.left,
            top: "-20px",
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `confetti-fall ${p.duration} ease-in ${p.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

const SUMMARY_ROWS = [
  { label: "Campeão 🏆", key: "champion" as const },
  { label: "Vice-Campeão 🥈", key: "runnerUp" as const },
  { label: "Artilheiro ⚽", key: "topScorer" as const },
  { label: "Melhor Jogador ⭐", key: "bestPlayer" as const },
  { label: "Melhor Goleiro 🧤", key: "bestGoalkeeper" as const },
];

export default function ConfirmationStep({ data }: { data: EntryData }) {
  const shareMessage = encodeURIComponent(
    `Fiz minha aposta no Bolão Copa 2026 da VAPT! Use meu cupom ${data.couponCode} e ganhe frete grátis no app VAPT! 🏆⚽`
  );
  const shareUrl = `https://wa.me/?text=${shareMessage}`;

  const firstName = data.name.split(" ")[0];

  return (
    <div className="space-y-6 slide-up">
      <Confetti />

      {/* Celebração */}
      <div className="text-center space-y-3 pt-2">
        <div className="text-6xl mb-2 trophy-bounce">🎉</div>
        <h2 className="font-display text-3xl text-white">Palpites Registrados!</h2>
        <p className="text-white/60 text-base px-4">
          Boa sorte, <span className="text-white font-bold">{firstName}</span>! Aqui está seu prêmio garantido:
        </p>
      </div>

      {/* Cupom dourado */}
      <div
        className="relative rounded-2xl p-[2px] card-gold-glow"
        style={{
          background: "linear-gradient(135deg, #FFD700, #FFA500, #FFD700)",
        }}
      >
        {/* Entalhes estilo ticket */}
        <div
          className="absolute top-1/2 -left-3 w-6 h-6 rounded-full -translate-y-1/2"
          style={{ background: "#0a0a1a" }}
        />
        <div
          className="absolute top-1/2 -right-3 w-6 h-6 rounded-full -translate-y-1/2"
          style={{ background: "#0a0a1a" }}
        />

        <div
          className="rounded-2xl p-8 text-center border-2 border-dashed relative"
          style={{
            background: "linear-gradient(135deg, #0f1a2e, #0d2137)",
            borderColor: "rgba(255,215,0,0.35)",
          }}
        >
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase mb-3 font-sans"
            style={{ color: "rgba(255,215,0,0.6)" }}
          >
            Cupom Frete Grátis
          </p>

          <div
            className="text-3xl md:text-4xl font-display tracking-widest font-bold px-6 py-3 rounded-xl border inline-block"
            style={{
              color: "#FFD700",
              background: "rgba(255,215,0,0.08)",
              borderColor: "rgba(255,215,0,0.25)",
              textShadow: "0 0 20px rgba(255,215,0,0.5)",
            }}
          >
            {data.couponCode}
          </div>

          <p className="text-white/40 text-sm mt-4 font-sans">Válido para 1 pedido no app VAPT</p>

          <div className="mt-4 flex justify-center gap-1">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-lg">⭐</span>
            ))}
          </div>
        </div>
      </div>

      {/* Compartilhar WhatsApp */}
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full h-14 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background: "#25D366",
          boxShadow: "0 0 20px rgba(37,211,102,0.35)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Compartilhar no WhatsApp
      </a>

      <p
        className="text-center text-sm font-sans"
        style={{ color: "rgba(255,215,0,0.7)" }}
      >
        Mostre pro seus amigos e desafie eles! 🔥
      </p>

      {/* Resumo da aposta */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{
            background: "rgba(0,87,255,0.15)",
            borderColor: "rgba(0,87,255,0.2)",
          }}
        >
          <h3 className="font-display text-xl text-white">Resumo da sua Aposta</h3>
        </div>

        <div className="divide-y" style={{ divideColor: "rgba(255,255,255,0.06)" }}>
          {SUMMARY_ROWS.map((row) => (
            <div
              key={row.key}
              className="flex justify-between items-center px-4 py-3"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <span className="text-white/55 text-sm font-sans">{row.label}</span>
              <span className="font-bold text-white text-sm text-right max-w-[55%]">{data[row.key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA comprar */}
      <a
        href="https://vaptbr.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-bold text-sm text-white border transition-all hover:opacity-80"
        style={{
          borderColor: "rgba(255,215,0,0.3)",
          background: "rgba(255,215,0,0.06)",
          color: "#FFD700",
        }}
      >
        🛵 Compre já em vaptbr.com com frete grátis!
      </a>
    </div>
  );
}

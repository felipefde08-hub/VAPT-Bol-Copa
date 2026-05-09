import React, { useState, useEffect, lazy, Suspense } from "react";

const LineupModal = lazy(() => import("@/components/lineup-modal"));

const vaptLogo = "/vapt-logo.jpeg";
const VAPT_SITE = "https://vaptbr.com";

const STEP_LABELS = ["Cadastro", "Palpites", "Cupom"];

export default function Layout({ children, step, onBack }: { children: React.ReactNode; step: number; onBack?: () => void }) {
  const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;
  const [logoError, setLogoError] = useState(false);
  const [participants, setParticipants] = useState(0);
  const [showLineup, setShowLineup] = useState(false);

  useEffect(() => {
    /* Simula contador crescente a partir de um base salvo em localStorage */
    const base = parseInt(localStorage.getItem("vapt-participant-base") || "0", 10) || 1240;
    setParticipants(base);
    const interval = setInterval(() => {
      setParticipants(prev => {
        const next = prev + Math.floor(Math.random() * 3);
        localStorage.setItem("vapt-participant-base", String(next));
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden font-sans">
      {/* Modal de escalação */}
      {showLineup && (
        <Suspense fallback={null}>
          <LineupModal onClose={() => setShowLineup(false)} />
        </Suspense>
      )}

      {/* Barra de progresso fixa no topo */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${progressValue}%`,
            background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
            backgroundSize: "200% 100%",
            animation: "gold-shimmer 3s linear infinite",
          }}
        />
      </div>

      {/* Header */}
      <header className="pt-10 pb-6 px-4 text-center relative z-10">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-4 top-4 flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm font-sans"
          >
            ← Voltar
          </button>
        )}
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <a href={VAPT_SITE} target="_blank" rel="noopener noreferrer" className="inline-block">
            {!logoError ? (
              <img
                src={vaptLogo}
                alt="VAPT"
                className="h-14 w-auto rounded-xl shadow-lg"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-3xl font-display font-bold" style={{ color: "#0057FF" }}>VAPT</span>
            )}
          </a>
        </div>

        {/* Troféu animado */}
        <div className="mb-2">
          <span className="trophy-bounce text-5xl">🏆</span>
        </div>

        {/* Título dourado */}
        <h1 className="text-gold-shimmer font-display text-4xl md:text-5xl leading-tight mb-2">
          BOLÃO COPA 2026
        </h1>

        {/* Subtítulo */}
        <p className="text-white/60 text-sm font-sans mb-4">
          Faça seus palpites e ganhe cupons exclusivos
        </p>

        {/* Contador de participantes */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-[#00C851] animate-pulse" />
          <span className="text-white/70 text-xs font-sans">
            <span className="font-bold text-white">{participants.toLocaleString("pt-BR")}</span> participantes
          </span>
        </div>

        {/* Botão escalação */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setShowLineup(true)}
            className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2 rounded-full border transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "rgba(0,87,255,0.15)",
              borderColor: "rgba(0,87,255,0.4)",
              color: "#fff",
              boxShadow: "0 0 12px rgba(0,87,255,0.2)",
            }}
          >
            🏟️ Monte a Escalação
          </button>
        </div>

        {/* Steps */}
        <div className="flex justify-center gap-3">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            const done = s < step;
            const active = s === step;
            return (
              <div key={s} className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    background: done ? "#FFD700" : active ? "#0057FF" : "rgba(255,255,255,0.1)",
                    color: done ? "#0a0a1a" : "#fff",
                    boxShadow: active ? "0 0 12px rgba(0,87,255,0.6)" : "none",
                  }}
                >
                  {done ? "✓" : s}
                </div>
                <span className={`text-[10px] font-sans ${active ? "text-white" : "text-white/40"}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex flex-col px-4 pb-28 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="py-8 text-center px-4 relative z-10 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(8px)" }}
      >
        <a href={VAPT_SITE} target="_blank" rel="noopener noreferrer" className="inline-block mb-3">
          {!logoError ? (
            <img src={vaptLogo} alt="VAPT" className="h-8 w-auto rounded-lg mx-auto" />
          ) : (
            <span className="font-display text-xl" style={{ color: "#0057FF" }}>VAPT</span>
          )}
        </a>
        <p className="text-sm font-medium text-white/70 mb-1">Pediu, chegou em até 1 hora · vaptbr.com</p>
        <p className="text-xs text-white/40 mb-5">São José do Rio Preto, SP</p>
        <a
          href={VAPT_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl text-white transition-all btn-green-glow hover:opacity-90"
          style={{ background: "#00C851" }}
        >
          🛵 Compre já e use o cupom de frete grátis!
        </a>

        <div className="mt-6">
          <a
            href="#/admin"
            className="text-white/15 hover:text-white/40 transition-colors"
            style={{ fontSize: "10px" }}
          >
            admin
          </a>
        </div>
      </footer>
    </div>
  );
}

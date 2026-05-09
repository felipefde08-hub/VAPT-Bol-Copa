import React, { useState, useRef, useEffect } from "react";

type Pos = { id: string; abbr: string; label: string };

const FORMATION: Pos[][] = [
  // Ataque — topo do campo
  [
    { id: "lw",  abbr: "AE",  label: "Ala Esquerdo"     },
    { id: "st",  abbr: "CA",  label: "Centroavante"      },
    { id: "rw",  abbr: "AD",  label: "Ala Direito"       },
  ],
  // Meio
  [
    { id: "cm1", abbr: "MEI", label: "Meia"              },
    { id: "cm2", abbr: "MEI", label: "Meia"              },
    { id: "cm3", abbr: "MEI", label: "Meia"              },
  ],
  // Defesa
  [
    { id: "lb",  abbr: "LE",  label: "Lateral Esquerdo"  },
    { id: "cb1", abbr: "ZAG", label: "Zagueiro"          },
    { id: "cb2", abbr: "ZAG", label: "Zagueiro"          },
    { id: "rb",  abbr: "LD",  label: "Lateral Direito"   },
  ],
  // Goleiro — base do campo
  [
    { id: "gk",  abbr: "GOL", label: "Goleiro"           },
  ],
];

const STORAGE_KEY = "vapt-bolao-lineup";

function loadPlayers(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

export default function LineupModal({ onClose }: { onClose: () => void }) {
  const [players, setPlayers] = useState<Record<string, string>>(loadPlayers);
  const [editing, setEditing] = useState<Pos | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (id: string, value: string) => {
    const next = { ...players, [id]: value };
    setPlayers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filled = Object.values(players).filter(Boolean).length;
  const allFilled = filled === 11;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(5,5,20,0.97)", backdropFilter: "blur(8px)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇧🇷</span>
          <div>
            <p className="font-display text-xl text-white leading-none">ESCALAÇÃO DO BRASIL</p>
            <p className="text-xs font-sans" style={{ color: "rgba(255,215,0,0.7)" }}>
              Formação 4-3-3 • {filled}/11 jogadores
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all text-lg"
        >
          ✕
        </button>
      </div>

      {/* Campo + edição */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-4 gap-4">

        {/* Campo de futebol */}
        <div
          className="relative w-full flex-shrink-0"
          style={{
            maxWidth: "340px",
            aspectRatio: "2/3",
            borderRadius: "10px",
            border: "3px solid rgba(255,255,255,0.25)",
            overflow: "hidden",
            background: "linear-gradient(180deg, #1a7a1a 0%, #1d8c1d 20%, #1a7a1a 40%, #1d8c1d 60%, #1a7a1a 80%, #1d8c1d 100%)",
          }}
        >
          {/* Linhas do campo (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.45 }}
          >
            {/* Borda */}
            <rect x="8" y="8" width="184" height="284" stroke="white" strokeWidth="2" />
            {/* Linha do meio */}
            <line x1="8" y1="150" x2="192" y2="150" stroke="white" strokeWidth="1.5" />
            {/* Círculo central */}
            <circle cx="100" cy="150" r="30" stroke="white" strokeWidth="1.5" />
            <circle cx="100" cy="150" r="2" fill="white" />
            {/* Grande área de cima */}
            <rect x="45" y="8" width="110" height="52" stroke="white" strokeWidth="1.5" />
            {/* Pequena área de cima */}
            <rect x="72" y="8" width="56" height="24" stroke="white" strokeWidth="1.5" />
            {/* Grande área de baixo */}
            <rect x="45" y="240" width="110" height="52" stroke="white" strokeWidth="1.5" />
            {/* Pequena área de baixo */}
            <rect x="72" y="268" width="56" height="24" stroke="white" strokeWidth="1.5" />
            {/* Pênalti cima */}
            <circle cx="100" cy="68" r="2" fill="white" />
            {/* Pênalti baixo */}
            <circle cx="100" cy="232" r="2" fill="white" />
          </svg>

          {/* Jogadores — posicionados em rows */}
          <div
            className="absolute inset-0 flex flex-col justify-around"
            style={{ padding: "6% 3%" }}
          >
            {FORMATION.map((row, ri) => (
              <div
                key={ri}
                className="flex justify-around items-center"
              >
                {row.map((pos) => {
                  const name = players[pos.id] || "";
                  const isEditing = editing?.id === pos.id;
                  const firstName = name.split(" ")[0];
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setEditing(isEditing ? null : pos)}
                      className="flex flex-col items-center gap-0.5 transition-transform active:scale-95"
                      style={{ minWidth: 0 }}
                    >
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "50%",
                          border: `2px solid ${name ? "#FFD700" : "rgba(255,255,255,0.55)"}`,
                          background: name ? "rgba(0,87,255,0.85)" : "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: name
                            ? "0 0 12px rgba(255,215,0,0.45), 0 2px 8px rgba(0,0,0,0.5)"
                            : "0 2px 8px rgba(0,0,0,0.5)",
                          transition: "all 0.2s",
                        }}
                      >
                        {name ? (
                          <span style={{ color: "#fff", fontSize: "7px", fontWeight: "800", textAlign: "center", lineHeight: 1.2, padding: "0 3px", wordBreak: "break-word" }}>
                            {firstName.length > 8 ? firstName.slice(0, 7) + "." : firstName}
                          </span>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "20px", lineHeight: 1 }}>+</span>
                        )}
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "8px", fontWeight: "700", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                        {pos.abbr}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Badge da formação */}
          <div
            className="absolute top-2 right-2 font-display text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.6)", color: "#FFD700", fontSize: "10px" }}
          >
            4-3-3
          </div>
        </div>

        {/* Input de edição */}
        {editing ? (
          <div
            className="w-full rounded-2xl p-4 border flex-shrink-0"
            style={{
              maxWidth: "340px",
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(0,87,255,0.4)",
            }}
          >
            <p className="text-white/50 text-xs text-center mb-3 font-sans">
              ✏️ <span style={{ color: "#FFD700" }}>{editing.label}</span> — digite o nome
            </p>
            <input
              ref={inputRef}
              value={players[editing.id] || ""}
              onChange={(e) => set(editing.id, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditing(null); }}
              placeholder={`Ex: ${editing.id === "gk" ? "Alisson" : editing.id === "st" ? "Vini Jr" : "Jogador"}`}
              className="w-full h-12 px-4 rounded-xl text-white text-center font-bold text-base"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "2px solid rgba(0,87,255,0.6)",
                outline: "none",
              }}
            />
            <button
              onClick={() => setEditing(null)}
              className="w-full mt-3 h-10 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "#0057FF" }}
            >
              ✓ Confirmar
            </button>
          </div>
        ) : (
          <div
            className="w-full rounded-2xl p-3 text-center flex-shrink-0"
            style={{ maxWidth: "340px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {allFilled ? (
              <p className="text-sm font-bold" style={{ color: "#00C851" }}>
                ✅ Escalação completa! Brasil escalado! 🇧🇷
              </p>
            ) : (
              <p className="text-xs text-white/40 font-sans">
                Toque em um jogador para escalar • {11 - filled} posições restantes
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

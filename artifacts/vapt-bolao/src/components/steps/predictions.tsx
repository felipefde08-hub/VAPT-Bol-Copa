import React, { useState } from "react";
import { EntryData } from "@/pages/bolao";
import { GROUPS, ALL_TEAMS } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATACANTES, GOLEIROS } from "@/lib/players";

function TeamFlag({ code, name }: { code: string | null; name: string }) {
  const [err, setErr] = useState(false);
  if (!code || err) {
    return <span className="text-2xl w-10 text-center flex-shrink-0">🌐</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/48x36/${code}.png`}
      srcSet={`https://flagcdn.com/96x72/${code}.png 2x`}
      alt={name}
      className="w-10 h-[30px] object-cover rounded flex-shrink-0"
      onError={() => setErr(true)}
    />
  );
}

const SPECIAL_BETS = [
  { key: "champion",       label: "🏆 Campeão",       prize: "20% OFF",      type: "team"    },
  { key: "runnerUp",       label: "🥈 Vice-Campeão",   prize: "10% OFF",      type: "team"    },
  { key: "topScorer",      label: "⚽ Artilheiro",     prize: "10% OFF",      type: "player"  },
  { key: "bestPlayer",     label: "⭐ Melhor Jogador", prize: "10% OFF",      type: "player"  },
  { key: "bestGoalkeeper", label: "🧤 Melhor Goleiro", prize: "10% OFF",      type: "keeper"  },
] as const;

export default function PredictionsStep({
  onNext,
  initialData,
}: {
  onNext: (data: Partial<EntryData>) => void;
  initialData: Partial<EntryData>;
}) {
  const [groupPicks, setGroupPicks] = useState<Record<string, string[]>>(initialData.groupPicks || {});
  const [champion, setChampion] = useState(initialData.champion || "");
  const [runnerUp, setRunnerUp] = useState(initialData.runnerUp || "");
  const [topScorer, setTopScorer] = useState(initialData.topScorer || "");
  const [bestPlayer, setBestPlayer] = useState(initialData.bestPlayer || "");
  const [bestGoalkeeper, setBestGoalkeeper] = useState(initialData.bestGoalkeeper || "");
  const [neymarGoesCopa, setNeymarGoesCopa] = useState<boolean | null>(
    initialData.neymarGoesCopa !== undefined ? initialData.neymarGoesCopa : null
  );

  const stateMap: Record<string, [string, (v: string) => void]> = {
    champion: [champion, setChampion],
    runnerUp: [runnerUp, setRunnerUp],
    topScorer: [topScorer, setTopScorer],
    bestPlayer: [bestPlayer, setBestPlayer],
    bestGoalkeeper: [bestGoalkeeper, setBestGoalkeeper],
  };

  const handleGroupToggle = (groupName: string, teamName: string) => {
    setGroupPicks((prev) => {
      const cur = prev[groupName] || [];
      if (cur.includes(teamName)) return { ...prev, [groupName]: cur.filter((t) => t !== teamName) };
      if (cur.length < 2) return { ...prev, [groupName]: [...cur, teamName] };
      return prev;
    });
  };

  const completedGroups = Object.keys(GROUPS).filter((g) => groupPicks[g]?.length === 2).length;
  const totalGroups = Object.keys(GROUPS).length;

  const isFormValid = () => {
    const groupsValid = Object.keys(GROUPS).every((g) => groupPicks[g]?.length === 2);
    return groupsValid && champion && runnerUp && topScorer && bestPlayer && bestGoalkeeper;
  };

  const handleSubmit = () => {
    if (isFormValid()) onNext({ groupPicks, champion, runnerUp, topScorer, bestPlayer, bestGoalkeeper, neymarGoesCopa });
  };

  return (
    <div className="space-y-6 slide-up">
      {/* Header grupos */}
      <div className="text-center">
        <h2 className="font-display text-2xl text-white mb-1">Fase de Grupos</h2>
        <p className="text-white/50 text-sm">Selecione os 2 times que avançam em cada grupo</p>
        <div className="inline-flex items-center gap-2 mt-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
          <span className="text-xs text-white/60 font-sans">
            Grupos completos:{" "}
            <span className="font-bold" style={{ color: completedGroups === totalGroups ? "#00C851" : "#FFD700" }}>
              {completedGroups}/{totalGroups}
            </span>
          </span>
        </div>
      </div>

      {/* Grupos */}
      <div className="grid gap-4">
        {Object.entries(GROUPS).map(([groupName, teams]) => {
          const picks = groupPicks[groupName] || [];
          const isComplete = picks.length === 2;

          return (
            <div
              key={groupName}
              className="rounded-2xl overflow-hidden border transition-all duration-300"
              style={{
                borderColor: isComplete ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.08)",
                boxShadow: isComplete ? "0 0 20px rgba(255,215,0,0.08)" : "none",
              }}
            >
              {/* Header do grupo */}
              <div
                className="flex justify-between items-center px-4 py-3"
                style={{ background: "#0057FF" }}
              >
                <span className="font-display text-xl text-white">{groupName}</span>
                <span
                  className="text-sm font-bold font-sans"
                  style={{ color: isComplete ? "#FFD700" : "rgba(255,255,255,0.6)" }}
                >
                  {picks.length}/2 selecionados
                </span>
              </div>

              {/* Grid de times — 2 colunas */}
              <div
                className="p-3 grid grid-cols-2 gap-2"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                {teams.map((team) => {
                  const isSelected = picks.includes(team.name);
                  const disabled = !isSelected && picks.length >= 2;

                  return (
                    <button
                      key={team.name}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleGroupToggle(groupName, team.name)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all duration-200"
                      style={{
                        borderColor: isSelected
                          ? "#FFD700"
                          : disabled
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(255,255,255,0.1)",
                        background: isSelected
                          ? "rgba(0,87,255,0.2)"
                          : disabled
                          ? "rgba(255,255,255,0.01)"
                          : "rgba(255,255,255,0.04)",
                        boxShadow: isSelected ? "0 0 14px rgba(255,215,0,0.25)" : "none",
                        opacity: disabled ? 0.35 : 1,
                        cursor: disabled ? "not-allowed" : "pointer",
                        transform: isSelected ? "scale(1.01)" : "scale(1)",
                      }}
                    >
                      <TeamFlag code={team.code} name={team.name} />
                      <span className="text-xs font-bold text-white leading-tight text-center break-words w-full">
                        {team.name}
                      </span>
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "#FFD700", color: "#0a0a1a" }}
                        >
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apostas Especiais */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ background: "rgba(255,215,0,0.1)", borderBottom: "1px solid rgba(255,215,0,0.15)" }}
        >
          <span className="text-xl">⭐</span>
          <span className="font-display text-xl text-white">Apostas Especiais</span>
        </div>

        <div className="p-4 space-y-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          {SPECIAL_BETS.map((bet) => {
            const [value, setValue] = stateMap[bet.key];
            return (
              <div key={bet.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-white/80 font-semibold text-sm">{bet.label}</Label>
                  <span className="text-xs font-bold" style={{ color: "#FFD700" }}>
                    {bet.prize}
                  </span>
                </div>
                {bet.type === "team" ? (
                  <Select value={value} onValueChange={setValue}>
                    <SelectTrigger
                      className="h-12 text-white border"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        borderColor: value ? "rgba(0,87,255,0.5)" : "rgba(255,255,255,0.15)",
                      }}
                    >
                      <SelectValue placeholder={`Selecione ${bet.key === "champion" ? "o campeão" : "o vice"}`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                      {ALL_TEAMS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <Input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={
                        bet.type === "keeper"
                          ? "Digite ou escolha o goleiro..."
                          : "Digite ou escolha o jogador..."
                      }
                      list={`list-${bet.key}`}
                      className="h-12 text-white placeholder:text-white/25 border"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        borderColor: value ? "rgba(0,87,255,0.5)" : "rgba(255,255,255,0.15)",
                      }}
                    />
                    <datalist id={`list-${bet.key}`}>
                      {(bet.type === "keeper" ? GOLEIROS : ATACANTES).map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pergunta bônus — Neymar */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,215,0,0.2)" }}
      >
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ background: "rgba(255,215,0,0.07)", borderBottom: "1px solid rgba(255,215,0,0.12)" }}
        >
          <span className="text-xl">🤔</span>
          <span className="font-display text-xl text-white">Pergunta Bônus</span>
          <span className="ml-auto text-xs font-sans" style={{ color: "rgba(255,215,0,0.6)" }}>valha um ponto extra!</span>
        </div>

        <div className="p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-white font-bold text-lg text-center mb-4">
            🇧🇷 Neymar vai pra Copa 2026?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setNeymarGoesCopa(true)}
              className="h-14 rounded-xl font-bold text-lg transition-all border-2"
              style={{
                borderColor: neymarGoesCopa === true ? "#00C851" : "rgba(255,255,255,0.12)",
                background: neymarGoesCopa === true ? "rgba(0,200,81,0.2)" : "rgba(255,255,255,0.04)",
                color: neymarGoesCopa === true ? "#00C851" : "rgba(255,255,255,0.6)",
                boxShadow: neymarGoesCopa === true ? "0 0 16px rgba(0,200,81,0.3)" : "none",
                transform: neymarGoesCopa === true ? "scale(1.03)" : "scale(1)",
              }}
            >
              ✅ SIM
            </button>
            <button
              type="button"
              onClick={() => setNeymarGoesCopa(false)}
              className="h-14 rounded-xl font-bold text-lg transition-all border-2"
              style={{
                borderColor: neymarGoesCopa === false ? "#FF4444" : "rgba(255,255,255,0.12)",
                background: neymarGoesCopa === false ? "rgba(255,68,68,0.2)" : "rgba(255,255,255,0.04)",
                color: neymarGoesCopa === false ? "#FF6666" : "rgba(255,255,255,0.6)",
                boxShadow: neymarGoesCopa === false ? "0 0 16px rgba(255,68,68,0.3)" : "none",
                transform: neymarGoesCopa === false ? "scale(1.03)" : "scale(1)",
              }}
            >
              ❌ NÃO
            </button>
          </div>
          {neymarGoesCopa !== null && (
            <p className="text-center text-xs mt-3 font-sans" style={{ color: "rgba(255,255,255,0.4)" }}>
              {neymarGoesCopa
                ? "Torce para ele voltar! 🙏"
                : "Aposentadoria confirmada em 2025... 😢"}
            </p>
          )}
        </div>
      </div>

      {/* Botão finalizar — sticky */}
      <div className="sticky bottom-4 z-20 pt-2">
        <button
          className="w-full h-14 rounded-xl font-bold text-lg transition-all"
          disabled={!isFormValid()}
          onClick={handleSubmit}
          style={{
            background: isFormValid() ? "#00C851" : "rgba(255,255,255,0.08)",
            color: isFormValid() ? "#fff" : "rgba(255,255,255,0.3)",
            boxShadow: isFormValid() ? "0 0 24px rgba(0,200,81,0.4)" : "none",
            cursor: isFormValid() ? "pointer" : "not-allowed",
          }}
        >
          {isFormValid()
            ? "✅ Finalizar Palpites!"
            : `Complete os grupos (${completedGroups}/${totalGroups}) e apostas especiais`}
        </button>
      </div>
    </div>
  );
}

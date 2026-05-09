import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "vaptadmin@gmail.com";

type Entry = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  coupon_code: string;
  group_picks: Record<string, string[]> | null;
  champion: string | null;
  runner_up: string | null;
  top_scorer: string | null;
  best_player: string | null;
  best_goalkeeper: string | null;
  neymar_goes_copa: boolean | null;
  completed: boolean;
  created_at: string;
};

const ADMIN_KEY = "vapt-admin-authed";

/* ─── Login ─────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      localStorage.setItem(ADMIN_KEY, "1");
      onLogin();
    } else {
      setErr("E-mail não autorizado.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#0a0a1a,#0d2137)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 border"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,215,0,0.2)" }}
      >
        <a href="#/" className="flex items-center gap-1 text-white/40 hover:text-white text-sm mb-6 transition-colors">
          ← Voltar ao Bolão
        </a>

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="font-display text-3xl text-white">ADMIN</h1>
          <p className="text-white/40 text-sm mt-1">Bolão Copa 2026 · VAPT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }}
            placeholder="seu@email.com"
            autoFocus
            style={{
              width: "100%", height: "48px", borderRadius: "12px",
              background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.15)",
              color: "#fff", padding: "0 16px", fontSize: "15px", outline: "none",
            }}
          />
          {err && <p className="text-red-400 text-sm text-center">{err}</p>}
          <button
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#0057FF" }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Row expandível ─────────────────────────────── */
function EntryRow({ e }: { e: Entry }) {
  const [open, setOpen] = useState(false);
  const date = new Date(e.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  const groupCount = e.group_picks ? Object.keys(e.group_picks).length : 0;

  return (
    <>
      <tr
        className="border-b cursor-pointer hover:bg-white/5 transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
        onClick={() => setOpen(o => !o)}
      >
        <td className="px-4 py-3">
          <div className="font-bold text-white text-sm">{e.name}</div>
          <div className="text-white/40 text-xs">{e.email}</div>
        </td>
        <td className="px-4 py-3 text-white/60 text-sm">{e.whatsapp}</td>
        <td className="px-4 py-3">
          <span className="font-mono text-xs font-bold" style={{ color: "#FFD700" }}>{e.coupon_code}</span>
        </td>
        <td className="px-4 py-3 text-white text-sm">{e.champion || "—"}</td>
        <td className="px-4 py-3 text-white/70 text-sm">{e.runner_up || "—"}</td>
        <td className="px-4 py-3 text-center">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: e.completed ? "rgba(0,200,81,0.15)" : "rgba(255,165,0,0.15)",
              color: e.completed ? "#00C851" : "#FFA500",
            }}
          >
            {e.completed ? "✓ Completo" : "⏳ Parcial"}
          </span>
        </td>
        <td className="px-4 py-3 text-white/40 text-xs">{date}</td>
        <td className="px-4 py-3 text-center text-white/40 text-xs">{open ? "▲" : "▼"}</td>
      </tr>

      {open && (
        <tr style={{ background: "rgba(0,87,255,0.05)" }}>
          <td colSpan={8} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Apostas especiais */}
              <div
                className="rounded-xl p-4 border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="font-display text-base text-white mb-3">Apostas Especiais</p>
                {[
                  ["🏆 Campeão", e.champion],
                  ["🥈 Vice",    e.runner_up],
                  ["⚽ Artilheiro", e.top_scorer],
                  ["⭐ Melhor Jogador", e.best_player],
                  ["🧤 Melhor Goleiro", e.best_goalkeeper],
                  ["🤔 Neymar vai?", e.neymar_goes_copa == null ? null : e.neymar_goes_copa ? "SIM ✅" : "NÃO ❌"],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between py-1 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="text-white/50 text-xs">{label as string}</span>
                    <span className="text-white text-xs font-bold">{(value as string) || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Grupos */}
              <div
                className="rounded-xl p-4 border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="font-display text-base text-white mb-3">Grupos ({groupCount}/12)</p>
                {e.group_picks
                  ? Object.entries(e.group_picks).map(([group, teams]) => (
                      <div key={group} className="flex justify-between py-1 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <span className="text-white/50 text-xs">{group}</span>
                        <span className="text-white text-xs font-bold text-right">{teams.join(" · ")}</span>
                      </div>
                    ))
                  : <p className="text-white/30 text-xs">Grupos não preenchidos</p>
                }
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ─── Dashboard ──────────────────────────────────── */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetch = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("bolao_entries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("❌ Admin fetch error:", error.message, error.details);
    setEntries(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = entries.filter(e =>
    !search ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.coupon_code.toLowerCase().includes(search.toLowerCase())
  );

  const total     = entries.length;
  const completed = entries.filter(e => e.completed).length;
  const partial   = total - completed;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0a0a1a,#0d2137)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
        style={{ background: "rgba(10,10,26,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="text-white/40 hover:text-white transition-colors text-xl mr-1"
            title="Voltar ao Bolão"
          >
            ←
          </a>
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-display text-xl text-white leading-none">ADMIN — BOLÃO COPA 2026</p>
            <p className="text-white/40 text-xs">VAPT · vaptadmin@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetch}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            ↻ Atualizar
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total",    value: total,     color: "#FFD700" },
            { label: "Completos", value: completed, color: "#00C851" },
            { label: "Parciais",  value: partial,   color: "#FFA500" },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-2xl p-5 border text-center"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="font-display text-4xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-white/50 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Busca */}
        <div className="mb-4">
          <input
            placeholder="🔍  Buscar por nome, email ou cupom..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 px-4 rounded-xl text-white text-sm"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              outline: "none",
            }}
          />
        </div>

        {/* Tabela */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {loading ? (
            <div className="py-20 text-center text-white/40">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <p className="text-white/40">Nenhum participante encontrado</p>
              {!search && <p className="text-white/25 text-xs">Os cadastros feitos antes da configuração do Supabase não foram salvos.<br/>Novos cadastros aparecerão aqui automaticamente.</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(0,87,255,0.15)", borderBottom: "1px solid rgba(0,87,255,0.2)" }}>
                    {["Participante", "WhatsApp", "Cupom", "Campeão", "Vice", "Status", "Data", ""].map(h => (
                      <th key={h} className="px-4 py-3 font-display text-sm text-white/70 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => <EntryRow key={e.id} e={e} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-white/20 text-xs text-center mt-4">
          {filtered.length} de {total} participantes · Clique em uma linha para ver detalhes
        </p>
      </div>
    </div>
  );
}

/* ─── Página principal ───────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(ADMIN_KEY) === "1");

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setAuthed(false);
  };

  return authed
    ? <Dashboard onLogout={handleLogout} />
    : <LoginScreen onLogin={() => setAuthed(true)} />;
}

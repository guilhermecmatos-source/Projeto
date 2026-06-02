import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./lib/api";
import "./styles.css";

const queryClient = new QueryClient();

type Role = "SOLICITANTE" | "MOTORISTA" | "GESTOR" | "COORDENADOR_TRANSPORTE" | "ADMINISTRADOR";
type Theme = "dark" | "light" | "corporate";
type FieldType = "text" | "number" | "date" | "textarea" | "select" | "email" | "password";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

interface MenuItem {
  path: string;
  label: string;
  roles: Role[];
}

const MENU: MenuItem[] = [
  { path: "/dashboard", label: "Command Center", roles: ["SOLICITANTE", "MOTORISTA", "GESTOR", "COORDENADOR_TRANSPORTE", "ADMINISTRADOR"] },
  { path: "/veiculos", label: "Fleet Intelligence", roles: ["COORDENADOR_TRANSPORTE", "ADMINISTRADOR"] },
  { path: "/motoristas", label: "Operações", roles: ["COORDENADOR_TRANSPORTE", "ADMINISTRADOR"] },
  { path: "/usuarios", label: "Gestão de Usuários", roles: ["GESTOR", "ADMINISTRADOR"] },
  { path: "/ruvs", label: "SMART RUV", roles: ["SOLICITANTE", "GESTOR", "COORDENADOR_TRANSPORTE", "ADMINISTRADOR"] },
  { path: "/viagens", label: "Movimentação do Veículo", roles: ["MOTORISTA", "COORDENADOR_TRANSPORTE", "ADMINISTRADOR"] },
  { path: "/alteracao-rota", label: "Alteração de Rota", roles: ["COORDENADOR_TRANSPORTE", "ADMINISTRADOR"] },
  { path: "/estoque", label: "Estoque", roles: ["GESTOR", "ADMINISTRADOR"] },
  { path: "/clientes", label: "Clientes", roles: ["GESTOR", "ADMINISTRADOR", "SOLICITANTE"] },
  { path: "/pedidos", label: "Pedidos", roles: ["GESTOR", "ADMINISTRADOR", "SOLICITANTE"] },
  { path: "/comando", label: "Mission Control", roles: ["GESTOR", "COORDENADOR_TRANSPORTE", "ADMINISTRADOR"] },
  { path: "/relatorios", label: "Analytics", roles: ["GESTOR", "ADMINISTRADOR"] },
  { path: "/ceo-ai", label: "CEO AI", roles: ["GESTOR", "ADMINISTRADOR", "COORDENADOR_TRANSPORTE"] },
  { path: "/descobertas", label: "Discovery Engine", roles: ["GESTOR", "ADMINISTRADOR"] },
  { path: "/configuracoes", label: "Configurações", roles: ["ADMINISTRADOR", "GESTOR"] }
];

const vehicleFields: FieldDef[] = [
  { key: "plate", label: "Placa", type: "text", required: true },
  { key: "model", label: "Modelo", type: "text", required: true },
  { key: "brand", label: "Marca", type: "text", required: true },
  { key: "year", label: "Ano", type: "number", required: true },
  { key: "fuel", label: "Combustível", type: "select", options: ["ALCOOL", "DIESEL", "GASOLINA", "ELETRICO", "HIBRIDO"], required: true },
  { key: "capacity", label: "Capacidade", type: "number", required: true },
  { key: "situation", label: "Situação", type: "select", options: ["ATIVO", "MANUTENCAO", "INATIVO"], required: true },
  { key: "km", label: "Quilometragem", type: "number", required: true },
  { key: "lastMaintenanceDate", label: "Última manutenção", type: "date", required: true }
];

const driverFields: FieldDef[] = [
  { key: "name", label: "Nome", type: "text", required: true },
  { key: "cpf", label: "CPF", type: "text", required: true },
  { key: "cnh", label: "CNH", type: "text", required: true },
  { key: "category", label: "Categoria", type: "text", required: true },
  { key: "cnhExpiry", label: "Validade da CNH", type: "date", required: true },
  { key: "phone", label: "Telefone", type: "text", required: true },
  { key: "status", label: "Status", type: "select", options: ["ATIVO", "AFASTADO", "INATIVO"], required: true }
];

const userFields: FieldDef[] = [
  { key: "name", label: "Nome", type: "text", required: true },
  { key: "email", label: "E-mail", type: "email", required: true },
  { key: "password", label: "Senha", type: "password", required: true },
  { key: "role", label: "Cargo", type: "select", options: ["SOLICITANTE", "MOTORISTA", "GESTOR", "COORDENADOR_TRANSPORTE", "ADMINISTRADOR"], required: true },
  { key: "unit", label: "Unidade", type: "text", required: true }
];

const ruvFields: FieldDef[] = [
  { key: "authorizationNo", label: "Número da autorização", type: "text", required: true },
  { key: "emissionDate", label: "Data de emissão", type: "date", required: true },
  { key: "unit", label: "Unidade", type: "text", required: true },
  { key: "center", label: "Centro", type: "text", required: true },
  { key: "expectedDate", label: "Data prevista", type: "date", required: true },
  { key: "departureTime", label: "Horário saída", type: "text", required: true },
  { key: "returnTime", label: "Horário retorno", type: "text", required: true },
  { key: "destination", label: "Destino", type: "text", required: true },
  { key: "service", label: "Serviço", type: "text", required: true },
  { key: "objective", label: "Objetivo", type: "textarea", required: true },
  { key: "passengers", label: "Passageiros", type: "textarea", required: true },
  { key: "vehicleType", label: "Tipo", type: "select", options: ["Passageiro", "Ônibus", "Cavalo Mecânico", "Caminhão Grande", "Caminhão Pequeno", "Unidade Móvel", "Micro-ônibus", "Pick-up"], required: true },
  { key: "fuelType", label: "Combustível", type: "select", options: ["ALCOOL", "DIESEL", "GASOLINA", "ELETRICO", "HIBRIDO"], required: true },
  { key: "requesterId", label: "ID Requisitante", type: "number", required: true },
  { key: "driverId", label: "ID Motorista", type: "number" },
  { key: "vehicleId", label: "ID Veículo", type: "number" }
];

const tripFields: FieldDef[] = [
  { key: "ruvId", label: "ID da RUV", type: "number", required: true },
  { key: "driverId", label: "ID Motorista", type: "number" },
  { key: "location", label: "Local", type: "text", required: true },
  { key: "startedAt", label: "Hora de saída", type: "date" },
  { key: "arrivedAt", label: "Hora de chegada", type: "date" },
  { key: "odometerStart", label: "Hodômetro inicial", type: "number", required: true },
  { key: "odometerEnd", label: "Hodômetro final", type: "number", required: true },
  { key: "fuelLiters", label: "Litros abastecidos", type: "number" },
  { key: "fuelCost", label: "Valor abastecido", type: "number" },
  { key: "observations", label: "Observações", type: "textarea" }
];

const inventoryFields: FieldDef[] = [
  { key: "name", label: "Produto", type: "text", required: true },
  { key: "supplier", label: "Fornecedor", type: "text", required: true },
  { key: "quantity", label: "Quantidade", type: "number", required: true },
  { key: "minQuantity", label: "Quantidade mínima", type: "number", required: true },
  { key: "unitCost", label: "Custo unitário", type: "number", required: true }
];

const clientFields: FieldDef[] = [
  { key: "name", label: "Nome", type: "text", required: true },
  { key: "email", label: "E-mail", type: "email" },
  { key: "phone", label: "Telefone", type: "text" }
];

const orderFields: FieldDef[] = [
  { key: "code", label: "Código", type: "text", required: true },
  { key: "clientId", label: "ID Cliente", type: "number", required: true },
  { key: "totalValue", label: "Valor total", type: "number", required: true },
  { key: "status", label: "Status", type: "select", options: ["PENDENTE", "APROVADO", "CANCELADO", "EM_TRANSITO", "CONCLUIDO"], required: true }
];

const incidentFields: FieldDef[] = [
  { key: "title", label: "Título", type: "text", required: true },
  { key: "description", label: "Descrição", type: "textarea", required: true }
];

function getUser() {
  return JSON.parse(localStorage.getItem("nexus_user") || "{}") as { id: number; role: Role; name: string; email: string };
}

function classByTheme(theme: Theme) {
  if (theme === "light") return "bg-slate-100 text-slate-900";
  if (theme === "corporate") return "bg-blue-950 text-blue-50";
  return "bg-slate-950 text-slate-100";
}

function Login() {
  const [email, setEmail] = React.useState("admin@nexusai.com");
  const [password, setPassword] = React.useState("admin123");
  const [error, setError] = React.useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("nexus_token", data.token);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));
      location.href = "/dashboard";
    } catch {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: Futuristic command-map panel */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#05060a] via-[#070814] to-[#0a0d1f]" />
        <div className="absolute -top-32 -left-20 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
             style={{ background: "radial-gradient(circle at 30% 30%, rgba(91,124,254,0.8), transparent 60%)" }} />
        <div className="absolute -bottom-40 -right-20 w-[620px] h-[620px] rounded-full blur-3xl opacity-25"
             style={{ background: "radial-gradient(circle at 40% 40%, rgba(168,85,247,0.9), transparent 58%)" }} />

        <div className="relative z-10 h-full p-12 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl glass neon-border flex items-center justify-center">
              <span className="text-white font-bold tracking-tight">N</span>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">NEXUS AI</div>
              <div className="text-xs text-[color:var(--nexus-muted)] tracking-[0.22em] uppercase">Command Intelligence</div>
            </div>
          </div>

          <div className="mt-10 flex-1 grid grid-rows-[auto_1fr_auto] gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-semibold leading-tight">
                Operações em tempo real,
                <span className="block" style={{ color: "rgba(91,124,254,0.95)" }}>decisões em segundos.</span>
              </h2>
              <p className="mt-4 text-sm text-[color:var(--nexus-muted)]">
                Mobilidade corporativa, logística, frota, estoque e inteligência empresarial — com visual premium e foco em performance.
              </p>
            </div>

            {/* Map/Network visualization */}
            <div className="relative rounded-3xl glass-strong neon-border p-6 overflow-hidden shimmer">
              <div className="absolute inset-0 opacity-60"
                   style={{ background: "radial-gradient(700px 300px at 20% 20%, rgba(34,211,238,0.12), transparent 60%)" }} />
              <div className="absolute inset-0" />

              <svg viewBox="0 0 900 420" className="relative z-10 w-full h-[320px]">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(91,124,254,0.8)" />
                    <stop offset="60%" stopColor="rgba(168,85,247,0.7)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0.55)" />
                  </linearGradient>
                  <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" />
                  </filter>
                </defs>
                {/* paths */}
                <path d="M80,320 C210,120 360,120 470,220 C580,320 700,300 820,160" stroke="url(#g1)" strokeWidth="3" fill="none" opacity="0.9"/>
                <path d="M120,90 C240,170 320,230 430,250 C540,270 680,240 780,90" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none"/>
                <path d="M60,220 C160,260 240,260 330,220 C420,180 560,160 740,240" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none"/>
                {/* nodes */}
                {[
                  { x: 80, y: 320, c: "rgba(34,211,238,0.9)" },
                  { x: 200, y: 160, c: "rgba(91,124,254,0.95)" },
                  { x: 470, y: 220, c: "rgba(168,85,247,0.95)" },
                  { x: 820, y: 160, c: "rgba(34,211,238,0.85)" },
                  { x: 780, y: 90, c: "rgba(91,124,254,0.85)" },
                  { x: 120, y: 90, c: "rgba(168,85,247,0.85)" }
                ].map((n, i) => (
                  <g key={i}>
                    <circle cx={n.x} cy={n.y} r="10" fill={n.c} filter="url(#blur)" opacity="0.45" />
                    <circle cx={n.x} cy={n.y} r="5" fill={n.c} />
                    <circle cx={n.x} cy={n.y} r="12" fill="none" stroke="rgba(255,255,255,0.14)" />
                  </g>
                ))}
              </svg>

              <div className="relative z-10 grid grid-cols-3 gap-3 mt-4">
                <MiniStat label="Veículos ativos" value="12" accent="rgba(34,211,238,0.9)" />
                <MiniStat label="RUVs pendentes" value="4" accent="rgba(168,85,247,0.9)" />
                <MiniStat label="Economia (30d)" value="R$ 187k" accent="rgba(91,124,254,0.9)" />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[color:var(--nexus-muted)]">
              <div className="h-px flex-1 bg-white/10" />
              <span>Premium UI • Glass • Neon • Motion</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Premium glass login card */}
      <div className="relative flex items-center justify-center p-6 lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl glass neon-border p-8 lg:p-9 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-30"
               style={{ background: "radial-gradient(circle at 30% 30%, rgba(91,124,254,0.9), transparent 65%)" }} />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-25"
               style={{ background: "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.9), transparent 65%)" }} />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Acessar o Nexus AI</h1>
                <p className="text-sm text-[color:var(--nexus-muted)] mt-1">Dark premium • operações • inteligência</p>
              </div>
              <div className="w-10 h-10 rounded-2xl glass-strong neon-ring flex items-center justify-center">
                <span className="text-sm font-bold">AI</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs tracking-wide text-[color:var(--nexus-muted)]">E-mail</label>
                <input className="mt-2 w-full rounded-2xl px-4 py-3 input-premium" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs tracking-wide text-[color:var(--nexus-muted)]">Senha</label>
                <input className="mt-2 w-full rounded-2xl px-4 py-3 input-premium" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button className="w-full py-3 rounded-2xl btn-premium transition font-semibold">
                Entrar
              </button>
              {error && <p className="text-[color:var(--nexus-red)] text-sm">{error}</p>}
              <div className="text-xs text-[color:var(--nexus-muted)] flex justify-between">
                <span>Demo: admin@nexusai.com</span>
                <span>Senha: admin123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--nexus-muted)]">{label}</div>
      <div className="mt-1 text-lg font-semibold" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  return localStorage.getItem("nexus_token") ? <>{children}</> : <Navigate to="/" replace />;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>((localStorage.getItem("nexus_theme") as Theme) || "dark");
  const [open, setOpen] = React.useState(false);
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();
  const visibleMenu = MENU.filter((m) => m.roles.includes(user.role));

  React.useEffect(() => {
    localStorage.setItem("nexus_theme", theme);
    // Theme presets (real-time)
    const root = document.documentElement;
    if (theme === "dark") {
      root.style.setProperty("--nexus-bg", "#05060a");
      root.style.setProperty("--nexus-surface", "rgba(16, 18, 29, 0.72)");
      root.style.setProperty("--nexus-neon", "#5b7cfe");
      root.style.setProperty("--nexus-neon2", "#a855f7");
    } else if (theme === "light") {
      root.style.setProperty("--nexus-bg", "#f6f7fb");
      root.style.setProperty("--nexus-surface", "rgba(255, 255, 255, 0.72)");
      root.style.setProperty("--nexus-neon", "#2563eb");
      root.style.setProperty("--nexus-neon2", "#7c3aed");
    } else {
      root.style.setProperty("--nexus-bg", "#060b18");
      root.style.setProperty("--nexus-surface", "rgba(10, 20, 45, 0.62)");
      root.style.setProperty("--nexus-neon", "#2dd4bf");
      root.style.setProperty("--nexus-neon2", "#60a5fa");
    }
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("nexus_user");
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${classByTheme(theme)} relative`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <div className="md:hidden sticky top-0 z-40 flex justify-between items-center px-4 py-3 border-b border-white/10 glass-strong">
        <button className="px-3 py-2 rounded-xl glass hover:neon-ring transition" onClick={() => setOpen((v) => !v)}>Menu</button>
        <span className="font-semibold tracking-tight">NEXUS AI</span>
      </div>

      <div className="md:flex">
        <aside className={`${open ? "block" : "hidden"} md:block w-full md:w-[300px] p-4 md:p-5 md:sticky md:top-0 md:h-screen`}>
          <div className="rounded-3xl glass-strong neon-border p-5 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl glass neon-ring flex items-center justify-center">
                  <span className="font-bold">N</span>
                </div>
                <div>
                  <div className="font-semibold tracking-tight">NEXUS AI</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--nexus-muted)]">Enterprise</div>
                </div>
              </div>
              <div className="text-xs text-[color:var(--nexus-muted)]">{user.role}</div>
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-1 gap-2">
              {visibleMenu.map((m) => (
                <Link
                  key={m.path}
                  to={m.path}
                  onClick={() => setOpen(false)}
                  className={`group relative overflow-hidden px-3 py-2.5 rounded-2xl text-sm transition ${
                    location.pathname === m.path
                      ? "bg-white/8 border border-white/12"
                      : "bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/12"
                  }`}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                        style={{ background: "radial-gradient(320px 120px at 10% 50%, rgba(91,124,254,0.18), transparent 60%)" }} />
                  <span className="relative z-10 flex items-center justify-between">
                    <span>{m.label}</span>
                    <span className="text-[color:var(--nexus-muted)] group-hover:text-white/80 transition">›</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-5 grid gap-2">
              <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)} className="w-full rounded-2xl px-3 py-2 bg-white/5 border border-white/10 text-sm">
                <option value="dark">Dark premium</option>
                <option value="light">Light</option>
                <option value="corporate">Corporate</option>
              </select>
              <button onClick={logout} className="w-full rounded-2xl px-3 py-2 bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-400/25 text-sm transition">
                Sair
              </button>
              <div className="text-[10px] text-[color:var(--nexus-muted)] leading-relaxed">
                Sessão: <b className="text-white/80">{user.name}</b>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-10">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, hint }: { title: string; value: string | number; hint: string }) {
  return (
    <div className="rounded-3xl glass neon-border p-5 hover:neon-ring transition">
      <p className="text-[10px] uppercase text-[color:var(--nexus-muted)] tracking-[0.22em]">{title}</p>
      <p className="text-3xl font-semibold mt-2 tracking-tight">{value}</p>
      <p className="text-xs text-[color:var(--nexus-muted)] mt-1">{hint}</p>
    </div>
  );
}

function DashboardPage() {
  const user = getUser();
  const { data } = useQuery({
    queryKey: ["command-center"],
    queryFn: async () => (await api.get("/dashboard/command-center")).data,
    refetchInterval: 6000
  });
  const { data: activity } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => (await api.get("/dashboard/activity")).data,
    refetchInterval: 3500
  });

  const cards = data?.cards;
  const health = data?.health;
  const util = (data?.charts?.utilization || []) as number[];
  const cons = (data?.charts?.consumption || []) as number[];
  const events = (activity?.events || []) as any[];

  const maxCons = Math.max(1, ...cons);

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Command Center</h1>
            <p className="text-sm text-[color:var(--nexus-muted)] mt-2">KPIs premium • mapa operacional • alertas • transições suaves</p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-2xl glass px-4 py-2 text-xs text-white/80 border border-white/10">
              Sessão: <b className="text-white">{user.role}</b>
            </div>
            <div className="rounded-2xl glass px-4 py-2 text-xs text-white/80 border border-white/10">
              Status: <b className="text-[color:var(--nexus-green)]">LIVE</b>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Veículos Ativos" value={cards?.vehiclesActive ?? 0} hint="Operação em campo" />
        <StatCard title="Em Manutenção" value={cards?.vehiclesMaintenance ?? 0} hint="Disponibilidade impactada" />
        <StatCard title="Solicitações Pendentes" value={cards?.requestsPending ?? 0} hint="Aguardando aprovação" />
        <StatCard title="Solicitações Aprovadas" value={cards?.requestsApproved ?? 0} hint="Fluxo liberado" />
        <StatCard title="Motoristas Disponíveis" value={cards?.driversAvailable ?? 0} hint="Equipe pronta" />
        <StatCard title="Consumo do Mês" value={`R$ ${Number(cards?.consumptionMonth ?? 0).toLocaleString("pt-BR")}`} hint="Combustível + custos" />
        <StatCard title="Economia Gerada" value={`R$ ${Number(cards?.savingsGenerated ?? 0).toLocaleString("pt-BR")}`} hint="Otimização + IA" />
        <StatCard title="Quilometragem Total" value={`${Number(cards?.kmTotal ?? 0).toLocaleString("pt-BR")} km`} hint="Frota consolidada" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 rounded-3xl glass neon-border p-6 overflow-hidden shimmer">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg tracking-tight">Mapa operacional (simulado)</h2>
              <p className="text-xs text-[color:var(--nexus-muted)] mt-1">Veículos, rotas e conectividade</p>
            </div>
            <div className="text-xs text-[color:var(--nexus-muted)] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "rgba(34,211,238,0.9)", boxShadow: "0 0 18px rgba(34,211,238,0.9)" }} />
              Atualizando
            </div>
          </div>
          <div className="mt-4 aspect-[16/7] rounded-3xl border border-white/10 bg-black/30 relative overflow-hidden">
            <div className="absolute inset-0 grid-overlay opacity-50" />
            <div className="absolute inset-0"
                 style={{ background: "radial-gradient(700px 280px at 15% 30%, rgba(91,124,254,0.18), transparent 65%)" }} />
            <div className="absolute inset-0"
                 style={{ background: "radial-gradient(700px 280px at 85% 60%, rgba(168,85,247,0.16), transparent 65%)" }} />
            {/* dots */}
            <Dot x="18%" y="58%" c="rgba(34,211,238,0.9)" />
            <Dot x="36%" y="36%" c="rgba(91,124,254,0.95)" />
            <Dot x="56%" y="52%" c="rgba(168,85,247,0.95)" />
            <Dot x="74%" y="30%" c="rgba(34,211,238,0.85)" />
            <Dot x="82%" y="62%" c="rgba(91,124,254,0.85)" />
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[color:var(--nexus-muted)] uppercase tracking-[0.18em]">Saúde da Frota</div>
                  <div className="text-lg font-semibold mt-1">{health?.label || "—"}</div>
                </div>
                <div className="w-16 h-16 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center">
                  <div className="text-2xl font-semibold" style={{ color: health?.score >= 90 ? "rgba(52,211,153,0.95)" : health?.score >= 80 ? "rgba(251,191,36,0.95)" : "rgba(251,113,133,0.95)" }}>
                    {health?.score ?? "—"}
                  </div>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min(100, Number(health?.score || 0))}%`,
                    background: "linear-gradient(90deg, rgba(34,211,238,0.8), rgba(91,124,254,0.8), rgba(168,85,247,0.75))"
                  }}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-[color:var(--nexus-muted)] uppercase tracking-[0.18em]">Timeline Operacional</div>
              <div className="mt-3 space-y-2">
                {events.slice(0, 4).map((e: any) => (
                  <div key={e.id} className="flex items-start gap-3">
                    <div className="mt-1 w-2.5 h-2.5 rounded-full"
                      style={{
                        background:
                          e.severity === "critical"
                            ? "rgba(251,113,133,0.85)"
                            : e.severity === "warn"
                              ? "rgba(251,191,36,0.85)"
                              : e.severity === "success"
                                ? "rgba(52,211,153,0.85)"
                                : "rgba(34,211,238,0.85)",
                        boxShadow: "0 0 18px rgba(255,255,255,0.12)"
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-sm">{e.title}</div>
                      <div className="text-xs text-[color:var(--nexus-muted)]">{e.meta}</div>
                    </div>
                    <div className="text-[10px] text-[color:var(--nexus-muted)]">
                      {new Date(e.ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl glass neon-border p-6">
          <h2 className="font-semibold text-lg tracking-tight">Atividade em tempo real</h2>
          <p className="text-xs text-[color:var(--nexus-muted)] mt-1">Eventos e alertas surgem automaticamente</p>
          <div className="mt-4 grid gap-3 max-h-[520px] overflow-auto pr-1">
            {events.map((e: any) => (
              <AlertChip
                key={e.id}
                title={e.title}
                meta={e.meta}
                accent={
                  e.severity === "critical"
                    ? "rgba(251,113,133,0.75)"
                    : e.severity === "warn"
                      ? "rgba(251,191,36,0.75)"
                      : e.severity === "success"
                        ? "rgba(52,211,153,0.75)"
                        : "rgba(34,211,238,0.75)"
                }
              />
            ))}
          </div>
          <div className="mt-4 grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[color:var(--nexus-muted)] uppercase tracking-[0.18em]">Gráfico de utilização</div>
                <div className="text-[10px] text-[color:var(--nexus-muted)]">12 períodos</div>
              </div>
              <div className="mt-3 flex items-end gap-1 h-20">
                {util.map((v, i) => (
                  <div key={i} className="flex-1 rounded-lg" style={{ height: `${v}%`, background: "linear-gradient(180deg, rgba(91,124,254,0.85), rgba(168,85,247,0.4))" }} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[color:var(--nexus-muted)] uppercase tracking-[0.18em]">Gráfico de consumo</div>
                <div className="text-[10px] text-[color:var(--nexus-muted)]">12 períodos</div>
              </div>
              <div className="mt-3 flex items-end gap-1 h-20">
                {cons.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-lg"
                    style={{
                      height: `${Math.max(8, Math.round((v / maxCons) * 100))}%`,
                      background: "linear-gradient(180deg, rgba(34,211,238,0.75), rgba(91,124,254,0.35))"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Dot({ x, y, c }: { x: string; y: string; c: string }) {
  return (
    <div className="absolute floaty" style={{ left: x, top: y }}>
      <div className="w-3.5 h-3.5 rounded-full" style={{ background: c, boxShadow: `0 0 24px ${c}` }} />
      <div className="w-10 h-10 -mt-7 -ml-3.5 rounded-full border border-white/10" />
    </div>
  );
}

function AlertChip({ title, meta, accent }: { title: string; meta: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/7 transition">
      <div className="flex items-center justify-between">
        <div className="text-sm">{title}</div>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 18px ${accent}` }} />
      </div>
      <div className="text-xs text-[color:var(--nexus-muted)] mt-1">{meta}</div>
    </div>
  );
}

function normalizePayload(values: Record<string, string>, fields: FieldDef[]) {
  const payload: Record<string, unknown> = {};
  fields.forEach((f) => {
    const raw = values[f.key];
    if (raw === undefined || raw === "") return;
    if (f.type === "number") payload[f.key] = Number(raw);
    else if (f.type === "date") payload[f.key] = new Date(raw).toISOString();
    else payload[f.key] = raw;
  });
  if (payload.password) {
    payload.passwordHash = payload.password;
    delete payload.password;
  }
  return payload;
}

function FormField({ field, value, onChange }: { field: FieldDef; value: string; onChange: (value: string) => void }) {
  if (field.type === "textarea") {
    return (
      <div>
        <label className="text-xs text-slate-400">{field.label}</label>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 min-h-24" />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div>
        <label className="text-xs text-slate-400">{field.label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2">
          <option value="">Selecione</option>
          {(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div>
      <label className="text-xs text-slate-400">{field.label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={field.type === "password" ? "password" : field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" />
    </div>
  );
}

function CrudPage({ title, endpoint, fields, customActions }: { title: string; endpoint: string; fields: FieldDef[]; customActions?: (item: any, reload: () => void) => React.ReactNode }) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState("");
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: [endpoint], queryFn: async () => (await api.get(`/${endpoint}`)).data });
  const createMutation = useMutation({
    mutationFn: async () => api.post(`/${endpoint}`, normalizePayload(values, fields)),
    onSuccess: () => {
      setValues({});
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setError("");
    },
    onError: () => setError("Não foi possível salvar. Verifique permissões e campos obrigatórios.")
  });

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-[420px] rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-slate-400 mt-1">Cadastro e gestão operacional.</p>
          <div className="grid gap-2 mt-4">
            {fields.map((field) => (
              <FormField
                key={field.key}
                field={field}
                value={values[field.key] || ""}
                onChange={(next) => setValues((prev) => ({ ...prev, [field.key]: next }))}
              />
            ))}
          </div>
          <button onClick={() => createMutation.mutate()} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold">
            Salvar registro
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 overflow-auto">
          <h2 className="font-semibold text-lg mb-3">Registros</h2>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="py-2 pr-3">ID</th>
                  {fields.slice(0, 4).map((field) => <th key={field.key} className="py-2 pr-3">{field.label}</th>)}
                  {customActions && <th className="py-2">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {(query.data || []).map((item: any) => (
                  <tr key={item.id} className="border-b border-slate-800/70">
                    <td className="py-2 pr-3">{item.id}</td>
                    {fields.slice(0, 4).map((field) => <td key={field.key} className="py-2 pr-3">{String(item[field.key] ?? "-")}</td>)}
                    {customActions && <td className="py-2">{customActions(item, () => queryClient.invalidateQueries({ queryKey: [endpoint] }))}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function RuvPage() {
  return (
    <CrudPage
      title="SMART RUV"
      endpoint="ruvs"
      fields={ruvFields}
      customActions={(item, reload) => (
        <div className="flex gap-1">
          <button className="px-2 py-1 rounded bg-emerald-600 text-xs" onClick={async () => { await api.post(`/ruvs/${item.id}/approve`, { signature: "ASSINATURA DIGITAL", transport: true }); reload(); }}>Aprovar</button>
          <button className="px-2 py-1 rounded bg-rose-600 text-xs" onClick={async () => { await api.post(`/ruvs/${item.id}/reject`, { reason: "Dados inconsistentes" }); reload(); }}>Reprovar</button>
        </div>
      )}
    />
  );
}

function RouteChangePage() {
  const [ruvId, setRuvId] = React.useState("");
  const [justification, setJustification] = React.useState("");
  const [msg, setMsg] = React.useState("");
  return (
    <AppLayout>
      <div className="max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
        <h1 className="text-2xl font-bold">Alteração de Rota</h1>
        <p className="text-sm text-slate-400 mt-1">Solicitação, aprovação e histórico de mudança operacional.</p>
        <div className="grid gap-2 mt-4">
          <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="ID da RUV" value={ruvId} onChange={(e) => setRuvId(e.target.value)} />
          <textarea className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 min-h-24" placeholder="Justificativa da alteração" value={justification} onChange={(e) => setJustification(e.target.value)} />
          <button className="rounded-xl bg-indigo-600 py-3" onClick={async () => { await api.post(`/route-change/${ruvId}`, { justification }); setMsg("Alteração registrada com sucesso."); }}>Registrar alteração</button>
          {msg && <p className="text-emerald-400 text-sm">{msg}</p>}
        </div>
      </div>
    </AppLayout>
  );
}

function CommandPage() {
  return (
    <CrudPage
      title="Centro de Comando"
      endpoint="command/incidents"
      fields={incidentFields}
      customActions={(item, reload) => (
        <button className="px-2 py-1 rounded bg-amber-600 text-xs" onClick={async () => { await api.post(`/command/incidents/${item.id}/resolve`, { corrective: "Equipe acionada e ocorrência resolvida" }); reload(); }}>
          Resolver Problema
        </button>
      )}
    />
  );
}

function ReportsPage() {
  const { data } = useQuery({ queryKey: ["reports"], queryFn: async () => (await api.get("/reports/overview")).data });
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(data || {}).map(([k, v]) => <StatCard key={k} title={k} value={String(v)} hint="Indicador operacional" />)}
      </div>
      <div className="mt-4 rounded-2xl border border-slate-700 p-5 bg-slate-900/60">
        <p className="text-sm text-slate-300">Exportação PDF e Excel habilitável no backend para produção (endpoint dedicado).</p>
      </div>
    </AppLayout>
  );
}

function CeoAiPage() {
  const quick = [
    "Onde estou perdendo dinheiro?",
    "Qual veículo mais roda?",
    "Quais solicitações estão atrasadas?",
    "Qual veículo possui maior custo?",
    "Qual motorista realizou mais viagens?",
    "Qual unidade mais utiliza veículos?"
  ];

  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<{ role: "user" | "assistant"; content: string; ts: number }[]>([
    { role: "assistant", content: "Pergunte qualquer coisa sobre a operação. Eu uso os dados do sistema para responder.", ts: Date.now() }
  ]);
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (q: string) => {
    const question = q.trim();
    if (!question) return;
    setMessages((m) => [...m, { role: "user", content: question, ts: Date.now() }]);
    setLoading(true);
    try {
      const { data } = await api.post("/ai/ceo", { question });
      setMessages((m) => [...m, { role: "assistant", content: String(data.answer || ""), ts: Date.now() }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Não consegui analisar agora. Verifique se a API está online.", ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 rounded-3xl glass neon-border p-5">
          <h1 className="text-xl font-semibold tracking-tight">CEO AI</h1>
          <p className="text-xs text-[color:var(--nexus-muted)] mt-1">Atalhos inteligentes</p>
          <div className="mt-4 grid gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 px-3 py-2 text-sm transition"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--nexus-muted)]">Dica</div>
            <div className="text-xs text-white/80 mt-1">Pergunte sobre custo, utilização, atrasos e eficiência.</div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-3xl glass neon-border p-5 flex flex-col min-h-[620px]">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="text-lg font-semibold tracking-tight">Pergunte qualquer coisa sobre a operação</div>
              <div className="text-xs text-[color:var(--nexus-muted)] mt-1">Respostas baseadas nos dados atuais do sistema (e simulação quando necessário)</div>
            </div>
            <div className="text-xs text-[color:var(--nexus-muted)]">ONLINE</div>
          </div>

          <div className="flex-1 overflow-auto py-4 space-y-3 pr-1">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm border ${
                    m.role === "user"
                      ? "bg-white/8 border-white/12"
                      : "bg-black/30 border-white/10"
                  }`}
                >
                  <div className="text-[11px] text-[color:var(--nexus-muted)] mb-1">
                    {m.role === "user" ? "Você" : "CEO AI"} • {new Date(m.ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-3xl px-4 py-3 text-sm border bg-black/30 border-white/10">
                  <div className="text-[11px] text-[color:var(--nexus-muted)] mb-1">CEO AI</div>
                  <div className="text-sm">Analisando dados…</div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            className="pt-4 border-t border-white/10 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const q = input;
              setInput("");
              send(q);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ex: "Qual veículo mais roda?"'
              className="flex-1 rounded-2xl px-4 py-3 input-premium"
            />
            <button type="submit" className="rounded-2xl px-4 py-3 btn-premium font-semibold">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

function DiscoveriesPage() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["discoveries"],
    queryFn: async () => (await api.get("/ai/discoveries")).data,
    refetchInterval: 15000
  });

  const discoveries = (data?.discoveries || []) as { id: string; title: string; value: string; description: string; confidence: number }[];

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">NEXUS DISCOVERY ENGINE</h1>
          <p className="text-sm text-[color:var(--nexus-muted)] mt-2">Laboratório de IA • descobertas automáticas • percepção de valor</p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-2xl px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/8 transition text-sm"
        >
          {isFetching ? "Atualizando…" : "Atualizar descobertas"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
          {discoveries.map((d) => (
            <div key={d.id} className="rounded-3xl glass neon-border p-6 overflow-hidden shimmer">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--nexus-muted)]">Descoberta #{d.id}</div>
              <div className="mt-2 text-xl font-semibold tracking-tight">{d.title}</div>
              <div className="mt-3 text-3xl font-semibold" style={{ color: "rgba(34,211,238,0.95)" }}>{d.value}</div>
              <div className="mt-3 text-sm text-white/80">{d.description}</div>
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--nexus-muted)]">Confiança</div>
                <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full" style={{ width: `${Math.round(d.confidence * 100)}%`, background: "linear-gradient(90deg, rgba(91,124,254,0.85), rgba(168,85,247,0.7))" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl glass neon-border p-6">
          <div className="text-xs text-[color:var(--nexus-muted)] uppercase tracking-[0.18em]">Lab Console</div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
            <div className="text-white/80">• Monitorando frota, viagens, solicitações e consumo.</div>
            <div className="text-white/80 mt-1">• Detectando anomalias e oportunidades automaticamente.</div>
            <div className="text-white/80 mt-1">• Atualização periódica a cada ~15s.</div>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--nexus-muted)]">Próximas evoluções</div>
            <ul className="mt-2 text-sm text-white/80 space-y-1">
              <li>• Detecção por desvio padrão de custo/km</li>
              <li>• Subutilização por janela e unidade</li>
              <li>• Alertas proativos com recomendação</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SettingsPage() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-[color:var(--nexus-muted)] mt-2">Sistema • SMTP • Usuários • Permissões • IA • Backup • Auditoria • Temas</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: "⚙ Sistema", desc: "Ambiente, integração, rotinas" },
          { title: "📧 SMTP", desc: "E-mails automáticos operacionais" },
          { title: "👥 Usuários", desc: "Gestão e onboarding" },
          { title: "🔒 Permissões", desc: "RBAC por cargo e módulos" },
          { title: "🤖 IA", desc: "CEO AI e Discovery Engine" },
          { title: "💾 Backup", desc: "Retenção e restauração" },
          { title: "📜 Auditoria", desc: "Logs e trilha de eventos" },
          { title: "🎨 Temas", desc: "Premium realtime switch" }
        ].map((c) => (
          <button key={c.title} className="text-left rounded-3xl glass neon-border p-5 hover:neon-ring transition">
            <div className="text-lg font-semibold tracking-tight">{c.title}</div>
            <div className="text-sm text-[color:var(--nexus-muted)] mt-2">{c.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-3xl glass neon-border p-6">
        <div className="text-xs text-[color:var(--nexus-muted)] uppercase tracking-[0.18em]">Temas Premium (troca em tempo real)</div>
        <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { name: "Dark Premium", vars: { bg: "#05060a", neon: "#5b7cfe", neon2: "#a855f7" } },
            { name: "Midnight Blue", vars: { bg: "#050816", neon: "#22d3ee", neon2: "#5b7cfe" } },
            { name: "Corporate Black", vars: { bg: "#05060a", neon: "#2dd4bf", neon2: "#60a5fa" } },
            { name: "Glass Neon", vars: { bg: "#05060a", neon: "#a855f7", neon2: "#22d3ee" } }
          ].map((t) => (
            <button
              key={t.name}
              className="rounded-3xl border border-white/10 bg-white/5 hover:bg-white/8 p-5 transition"
              onClick={() => {
                const root = document.documentElement;
                root.style.setProperty("--nexus-bg", t.vars.bg);
                root.style.setProperty("--nexus-neon", t.vars.neon);
                root.style.setProperty("--nexus-neon2", t.vars.neon2);
              }}
            >
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="mt-3 flex gap-2">
                <span className="w-4 h-4 rounded-full" style={{ background: t.vars.neon }} />
                <span className="w-4 h-4 rounded-full" style={{ background: t.vars.neon2 }} />
                <span className="w-4 h-4 rounded-full" style={{ background: t.vars.bg, border: "1px solid rgba(255,255,255,0.12)" }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/veiculos" element={<Protected><CrudPage title="Gestão de Veículos" endpoint="vehicles" fields={vehicleFields} /></Protected>} />
          <Route path="/motoristas" element={<Protected><CrudPage title="Gestão de Motoristas" endpoint="drivers" fields={driverFields} /></Protected>} />
          <Route path="/usuarios" element={<Protected><CrudPage title="Gestão de Usuários" endpoint="users" fields={userFields} /></Protected>} />
          <Route path="/ruvs" element={<Protected><RuvPage /></Protected>} />
          <Route path="/viagens" element={<Protected><CrudPage title="Movimentação do Veículo" endpoint="trips" fields={tripFields} /></Protected>} />
          <Route path="/alteracao-rota" element={<Protected><RouteChangePage /></Protected>} />
          <Route path="/estoque" element={<Protected><CrudPage title="Estoque" endpoint="inventory" fields={inventoryFields} /></Protected>} />
          <Route path="/clientes" element={<Protected><CrudPage title="Clientes" endpoint="clients" fields={clientFields} /></Protected>} />
          <Route path="/pedidos" element={<Protected><CrudPage title="Pedidos" endpoint="orders" fields={orderFields} /></Protected>} />
          <Route path="/comando" element={<Protected><CommandPage /></Protected>} />
          <Route path="/relatorios" element={<Protected><ReportsPage /></Protected>} />
          <Route path="/ceo-ai" element={<Protected><CeoAiPage /></Protected>} />
          <Route path="/descobertas" element={<Protected><DiscoveriesPage /></Protected>} />
          <Route path="/configuracoes" element={<Protected><SettingsPage /></Protected>} />
          <Route path="*" element={<Navigate to={localStorage.getItem("nexus_token") ? "/dashboard" : "/"} />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

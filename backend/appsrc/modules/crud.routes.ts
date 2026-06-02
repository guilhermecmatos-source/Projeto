import { Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { allow, auth } from "../middleware/auth";
import bcrypt from "bcryptjs";

const router = Router();
router.use(auth);

type ActivityType =
  | "SOLICITACAO_CRIADA"
  | "SOLICITACAO_APROVADA"
  | "VEICULO_LIBERADO"
  | "VIAGEM_INICIADA"
  | "ABASTECIMENTO_REGISTRADO"
  | "PROBLEMA_RESOLVIDO"
  | "ALTERACAO_ROTA";

interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  meta: string;
  ts: number;
  severity: "info" | "warn" | "critical" | "success";
}

const activityBuffer: ActivityEvent[] = [];
function pushActivity(evt: Omit<ActivityEvent, "id" | "ts">) {
  activityBuffer.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    ...evt
  });
  if (activityBuffer.length > 50) activityBuffer.length = 50;
}

router.get("/dashboard/summary", async (_req, res) => {
  const [vehicles, drivers, pendingRuvs, incidents] = await Promise.all([
    prisma.vehicle.count({ where: { situation: "ATIVO" } }),
    prisma.driver.count({ where: { status: "ATIVO" } }),
    prisma.ruv.count({ where: { status: "CRIADA" } }),
    prisma.commandIncident.count({ where: { status: "ABERTO" } })
  ]);
  res.json({ vehicles, drivers, pendingRuvs, incidents, operationalSavings: 122000, monthlyCost: 341000 });
});

router.get("/dashboard/command-center", async (_req, res) => {
  const [
    vehiclesActive,
    vehiclesMaintenance,
    requestsPending,
    requestsApproved,
    driversAvailable,
    tripsMonth,
    kmTotalRows
  ] = await Promise.all([
    prisma.vehicle.count({ where: { situation: "ATIVO" } }),
    prisma.vehicle.count({ where: { situation: "MANUTENCAO" } }),
    prisma.ruv.count({ where: { status: "CRIADA" } }),
    prisma.ruv.count({ where: { status: { in: ["APROVADA_GESTOR", "APROVADA_TRANSPORTE", "EM_EXECUCAO", "CONCLUIDA"] } } }),
    prisma.driver.count({ where: { status: "ATIVO" } }),
    prisma.trip.findMany({ select: { fuelCost: true, distanceKm: true, createdAt: true } }),
    prisma.vehicle.findMany({ select: { km: true } })
  ]);

  const kmTotal = (kmTotalRows || []).reduce((s, v) => s + (v.km || 0), 0);

  const now = Date.now();
  const monthAgo = now - 1000 * 60 * 60 * 24 * 30;
  const tripsLast30 = (tripsMonth || []).filter((t) => t.createdAt.getTime() >= monthAgo);
  const consumptionMonth = tripsLast30.reduce((s, t) => s + Number(t.fuelCost || 0), 0);
  const kmMonth = tripsLast30.reduce((s, t) => s + Number(t.distanceKm || 0), 0);

  // “Saúde” da frota: penaliza manutenção + solicitações pendentes (heurística simples)
  const healthBase = 96;
  const health = Math.max(
    65,
    Math.round(healthBase - vehiclesMaintenance * 6 - Math.min(12, requestsPending) * 1.2)
  );

  // Séries simuladas coerentes com o estado atual (para percepção de sistema vivo)
  const utilizationSeries = Array.from({ length: 12 }).map((_, i) => {
    const wave = Math.sin((i / 12) * Math.PI * 2) * 7;
    const base = Math.min(92, 58 + vehiclesActive * 2 + wave);
    return Math.max(24, Math.round(base));
  });
  const consumptionSeries = Array.from({ length: 12 }).map((_, i) => {
    const wave = Math.sin((i / 12) * Math.PI * 2 + 1.2) * 1200;
    const base = Math.max(1500, Math.round(consumptionMonth / 6 + wave));
    return base;
  });

  // Economia gerada (simulada) proporcional ao volume
  const savingsGenerated = Math.max(12000, Math.round(consumptionMonth * 0.11 + vehiclesActive * 850));

  res.json({
    cards: {
      vehiclesActive,
      vehiclesMaintenance,
      requestsPending,
      requestsApproved,
      driversAvailable,
      consumptionMonth,
      savingsGenerated,
      kmTotal,
      kmMonth
    },
    health: { score: health, label: health >= 90 ? "Excelente" : health >= 80 ? "Boa" : "Atenção" },
    charts: {
      utilization: utilizationSeries,
      consumption: consumptionSeries
    }
  });
});

router.get("/dashboard/activity", async (_req, res) => {
  // Se não houver eventos, solta alguns simulados para percepção de operação viva.
  if (activityBuffer.length === 0) {
    pushActivity({ type: "SOLICITACAO_CRIADA", title: "Solicitação criada", meta: "RUV-0001 • SENAI Centro", severity: "info" });
    pushActivity({ type: "VEICULO_LIBERADO", title: "Veículo liberado", meta: "ABC1D23 • Sprinter", severity: "success" });
    pushActivity({ type: "VIAGEM_INICIADA", title: "Motorista iniciou viagem", meta: "Carlos Motorista • Campinas", severity: "info" });
    pushActivity({ type: "ABASTECIMENTO_REGISTRADO", title: "Abastecimento registrado", meta: "R$ 420,00 • 52L", severity: "warn" });
  }
  res.json({ events: activityBuffer.slice(0, 20) });
});

router.get("/users", allow(Role.ADMINISTRADOR, Role.GESTOR), async (_req, res) => res.json(await prisma.user.findMany()));
router.post("/users", allow(Role.ADMINISTRADOR), async (req, res) => {
  const payload = req.body;
  const passwordHash = await bcrypt.hash(String(payload.passwordHash || "admin123"), 10);
  res.json(await prisma.user.create({ data: { ...payload, passwordHash } }));
});

router.get("/vehicles", async (_req, res) => res.json(await prisma.vehicle.findMany()));
router.post("/vehicles", allow(Role.ADMINISTRADOR, Role.COORDENADOR_TRANSPORTE), async (req, res) => {
  res.json(await prisma.vehicle.create({ data: req.body }));
});
router.put("/vehicles/:id", allow(Role.ADMINISTRADOR, Role.COORDENADOR_TRANSPORTE), async (req, res) => {
  res.json(await prisma.vehicle.update({ where: { id: Number(req.params.id) }, data: req.body }));
});
router.delete("/vehicles/:id", allow(Role.ADMINISTRADOR), async (req, res) => {
  await prisma.vehicle.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

router.get("/drivers", async (_req, res) => res.json(await prisma.driver.findMany()));
router.post("/drivers", allow(Role.ADMINISTRADOR, Role.COORDENADOR_TRANSPORTE), async (req, res) => {
  res.json(await prisma.driver.create({ data: req.body }));
});

router.get("/ruvs", async (_req, res) => res.json(await prisma.ruv.findMany({ include: { requester: true, driver: true, vehicle: true } })));
router.post("/ruvs", allow(Role.SOLICITANTE, Role.ADMINISTRADOR), async (req, res) => {
  const created = await prisma.ruv.create({ data: req.body });
  pushActivity({ type: "SOLICITACAO_CRIADA", title: "Solicitação criada", meta: `${created.authorizationNo} • ${created.unit}`, severity: "info" });
  res.json(created);
});
router.post("/ruvs/:id/approve", allow(Role.GESTOR, Role.COORDENADOR_TRANSPORTE, Role.ADMINISTRADOR), async (req, res) => {
  const status = req.body.transport ? "APROVADA_TRANSPORTE" : "APROVADA_GESTOR";
  const ruv = await prisma.ruv.update({ where: { id: Number(req.params.id) }, data: { status: status as any, signature: req.body.signature || "ASSINADO" } });
  pushActivity({ type: "SOLICITACAO_APROVADA", title: "Solicitação aprovada", meta: `${ruv.authorizationNo} • ${status}`, severity: "success" });
  if (status === "APROVADA_TRANSPORTE") pushActivity({ type: "VEICULO_LIBERADO", title: "Veículo liberado", meta: `${ruv.authorizationNo}`, severity: "success" });
  res.json(ruv);
});
router.post("/ruvs/:id/reject", allow(Role.GESTOR, Role.COORDENADOR_TRANSPORTE, Role.ADMINISTRADOR), async (req, res) => {
  const ruv = await prisma.ruv.update({
    where: { id: Number(req.params.id) },
    data: { status: "REJEITADA", rejectionReason: req.body.reason || "Sem justificativa" }
  });
  res.json(ruv);
});

router.post("/trips", allow(Role.MOTORISTA, Role.ADMINISTRADOR), async (req, res) => {
  const data = req.body;
  const distanceKm = (data.odometerEnd || 0) - (data.odometerStart || 0);
  const avgConsumption = data.fuelLiters ? distanceKm / data.fuelLiters : 0;
  const tripCost = Number(data.fuelCost || 0);
  const efficiency = avgConsumption;
  const created = await prisma.trip.create({ data: { ...data, distanceKm, avgConsumption, tripCost, efficiency } });
  pushActivity({ type: "VIAGEM_INICIADA", title: "Motorista iniciou viagem", meta: `RUV ${created.ruvId} • ${created.location || "operação"}`, severity: "info" });
  if (created.fuelCost && created.fuelCost > 0) {
    pushActivity({ type: "ABASTECIMENTO_REGISTRADO", title: "Abastecimento registrado", meta: `R$ ${created.fuelCost.toFixed(2)} • RUV ${created.ruvId}`, severity: "warn" });
  }
  res.json(created);
});

router.get("/inventory", async (_req, res) => res.json(await prisma.inventoryItem.findMany()));
router.post("/inventory", allow(Role.GESTOR, Role.ADMINISTRADOR), async (req, res) => res.json(await prisma.inventoryItem.create({ data: req.body })));

router.get("/clients", async (_req, res) => res.json(await prisma.client.findMany()));
router.post("/clients", async (req, res) => res.json(await prisma.client.create({ data: req.body })));

router.get("/orders", async (_req, res) => res.json(await prisma.order.findMany({ include: { client: true } })));
router.post("/orders", async (req, res) => res.json(await prisma.order.create({ data: req.body })));

router.get("/command/incidents", async (_req, res) => res.json(await prisma.commandIncident.findMany()));
router.post("/command/incidents", async (req, res) => res.json(await prisma.commandIncident.create({ data: req.body })));
router.post("/command/incidents/:id/resolve", async (req, res) => {
  const incident = await prisma.commandIncident.update({
    where: { id: Number(req.params.id) },
    data: { status: "RESOLVIDO", corrective: req.body.corrective || "Ação corretiva aplicada" }
  });
  await prisma.audit.create({ data: { action: "RESOLVE_INCIDENT", entity: "CommandIncident", entityId: String(incident.id), details: incident.corrective || "" } });
  pushActivity({ type: "PROBLEMA_RESOLVIDO", title: "Problema resolvido", meta: `${incident.title}`, severity: "success" });
  res.json(incident);
});

router.post("/route-change/:id", allow(Role.COORDENADOR_TRANSPORTE, Role.ADMINISTRADOR), async (req, res) => {
  const ruv = await prisma.ruv.update({ where: { id: Number(req.params.id) }, data: { routeChangeNotes: req.body.justification || "Alteração aprovada" } });
  pushActivity({ type: "ALTERACAO_ROTA", title: "Alteração de rota", meta: `${ruv.authorizationNo} • registrada`, severity: "info" });
  res.json(ruv);
});

router.get("/reports/overview", async (_req, res) => {
  const [vehicles, drivers, ruvs, trips, stock] = await Promise.all([
    prisma.vehicle.count(),
    prisma.driver.count(),
    prisma.ruv.count(),
    prisma.trip.count(),
    prisma.inventoryItem.count()
  ]);
  res.json({ vehicles, drivers, ruvs, trips, stock });
});

router.get("/audit", allow(Role.ADMINISTRADOR, Role.GESTOR), async (_req, res) => res.json(await prisma.audit.findMany({ orderBy: { createdAt: "desc" }, take: 100 })));

router.post("/ai/ceo", async (req, res) => {
  const question = String(req.body.question || "").toLowerCase();
  const [vehicles, trips, ruvs, drivers] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.trip.findMany({ include: { ruv: true, driver: true } }),
    prisma.ruv.findMany(),
    prisma.driver.findMany()
  ]);

  const totalFuel = trips.reduce((s, t) => s + Number(t.fuelCost || 0), 0);
  const totalKm = trips.reduce((s, t) => s + Number(t.distanceKm || 0), 0);

  const mostKmVehicle = vehicles.slice().sort((a, b) => (b.km || 0) - (a.km || 0))[0];
  const mostCostTrip = trips.slice().sort((a, b) => (Number(b.tripCost || 0) - Number(a.tripCost || 0)))[0];
  const delayed = ruvs.filter((r) => r.status === "CRIADA").slice(0, 5);

  // Driver most trips
  const tripsByDriver: Record<string, number> = {};
  trips.forEach((t) => {
    const key = t.driverId ? String(t.driverId) : "none";
    tripsByDriver[key] = (tripsByDriver[key] || 0) + 1;
  });
  const bestDriverId = Object.entries(tripsByDriver).sort((a, b) => b[1] - a[1])[0]?.[0];
  const bestDriver = drivers.find((d) => String(d.id) === bestDriverId);

  // Unit usage
  const byUnit: Record<string, number> = {};
  ruvs.forEach((r) => (byUnit[r.unit] = (byUnit[r.unit] || 0) + 1));
  const topUnit = Object.entries(byUnit).sort((a, b) => b[1] - a[1])[0];

  if (question.includes("perdendo dinheiro") || question.includes("reduzir custos")) {
    return res.json({
      answer:
        `Resumo financeiro-operacional (últimos registros):\n` +
        `- Custo combustível total: R$ ${totalFuel.toFixed(2)}\n` +
        `- Quilometragem registrada: ${totalKm.toFixed(1)} km\n\n` +
        `Pontos de atenção:\n` +
        `1) Solicitações pendentes: ${ruvs.filter((r) => r.status === "CRIADA").length}\n` +
        `2) Viagem de maior custo: R$ ${(mostCostTrip?.tripCost || 0).toFixed(2)} (RUV ${mostCostTrip?.ruvId})\n` +
        `3) Frota com manutenção/ociosidade pode estar gerando custo fixo.\n\n` +
        `Sugestão imediata: priorize aprovação de RUVs críticos e padronize abastecimentos por rota/unidade.`
    });
  }
  if (question.includes("qual veiculo mais roda") || question.includes("quilometragem")) {
    return res.json({ answer: mostKmVehicle ? `Veículo com maior quilometragem: ${mostKmVehicle.plate} • ${mostKmVehicle.km} km.` : "Sem dados de frota." });
  }
  if (question.includes("atrasad") || question.includes("pendente")) {
    return res.json({
      answer:
        delayed.length
          ? `Solicitações em atraso (pendentes):\n${delayed.map((d) => `- ${d.authorizationNo} • ${d.unit} • ${d.destination}`).join("\n")}`
          : "Nenhuma solicitação pendente."
    });
  }
  if (question.includes("maior custo") || question.includes("custa mais")) {
    return res.json({ answer: mostCostTrip ? `Maior custo registrado: R$ ${(mostCostTrip.tripCost || 0).toFixed(2)} no RUV ${mostCostTrip.ruvId}.` : "Sem viagens registradas." });
  }
  if (question.includes("motorista") && (question.includes("mais viagens") || question.includes("mais rota"))) {
    return res.json({ answer: bestDriver ? `Motorista com mais viagens registradas: ${bestDriver.name}.` : "Sem viagens vinculadas a motoristas." });
  }
  if (question.includes("unidade") && (question.includes("mais utiliza") || question.includes("mais usa"))) {
    return res.json({ answer: topUnit ? `Unidade com maior utilização: ${topUnit[0]} (${topUnit[1]} solicitações).` : "Sem dados por unidade." });
  }

  return res.json({
    answer:
      `Eu posso analisar custos, frota, motoristas, solicitações, consumo e utilização.\n\n` +
      `Exemplos:\n` +
      `- Onde estou perdendo dinheiro?\n` +
      `- Qual veículo mais roda?\n` +
      `- Quais solicitações estão atrasadas?\n` +
      `- Qual veículo possui maior custo?\n` +
      `- Qual motorista realizou mais viagens?\n` +
      `- Qual unidade mais utiliza veículos?`
  });
});

router.get("/ai/discoveries", async (_req, res) => {
  const [vehicles, trips, drivers] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.trip.findMany(),
    prisma.driver.findMany()
  ]);

  const avgCost = trips.length ? trips.reduce((s, t) => s + Number(t.tripCost || 0), 0) / trips.length : 0;
  const maxCost = trips.slice().sort((a, b) => Number(b.tripCost || 0) - Number(a.tripCost || 0))[0];
  const underUsed = vehicles.filter((v) => (v.km || 0) < 15000).slice(0, 2);
  const bestEff = trips.slice().sort((a, b) => Number(b.efficiency || 0) - Number(a.efficiency || 0))[0];
  const driver = bestEff?.driverId ? drivers.find((d) => d.id === bestEff.driverId) : undefined;

  const discoveries = [
    {
      id: "001",
      title: "Economia potencial identificada",
      value: "R$ 18.200 / ano",
      description: "Consolidação de rotas e padronização de abastecimento por unidade podem reduzir variação de custos.",
      confidence: 0.78
    },
    {
      id: "002",
      title: "Custo operacional acima da média",
      value: maxCost ? `+${Math.round(((Number(maxCost.tripCost || 0) - avgCost) / Math.max(1, avgCost)) * 100)}%` : "+23%",
      description: maxCost ? `Viagem com custo elevado detectada (RUV ${maxCost.ruvId}).` : "Viagens pontuais acima do padrão indicam oportunidade de otimização.",
      confidence: 0.72
    },
    {
      id: "003",
      title: "Potencial de redução em rota",
      value: "-11%",
      description: "Ajuste de janela de saída e consolidação de paradas pode reduzir tempo e consumo.",
      confidence: 0.66
    },
    {
      id: "004",
      title: "Veículos subutilizados",
      value: underUsed.length ? underUsed.map((v) => v.plate).join(", ") : "V-08",
      description: "Redistribuir demandas e criar escala pode elevar utilização e reduzir custo fixo por km.",
      confidence: 0.81
    },
    {
      id: "005",
      title: "Melhor eficiência operacional",
      value: driver?.name || "João",
      description: "Motorista com melhor relação consumo/km nos registros atuais.",
      confidence: 0.7
    }
  ];

  res.json({ discoveries });
});

export default router;

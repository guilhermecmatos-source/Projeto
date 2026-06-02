/** Dados mock para demonstração sem MySQL */

export const mockCompany = { id: 1, name: 'Logística Brasil S.A.', segment: 'logistica' };

export const mockUser = {
  id: 1,
  companyId: 1,
  email: 'admin@fleetai.com',
  name: 'Administrador Fleet',
  role: 'admin',
};

export const mockVehicles = [
  { id: 1, plate: 'ABC-1D23', name: 'Volvo FH 540', type: 'caminhao', brand: 'Volvo', status: 'em_rota', latitude: -23.5505, longitude: -46.6333, capacityKg: 25000 },
  { id: 2, plate: 'DEF-4E56', name: 'Mercedes Actros', type: 'caminhao', brand: 'Mercedes', status: 'disponivel', latitude: -23.5629, longitude: -46.6544, capacityKg: 23000 },
  { id: 3, plate: 'GHI-7F89', name: 'Fiat Strada', type: 'carro', brand: 'Fiat', status: 'em_rota', latitude: -23.5489, longitude: -46.6388, capacityKg: 800 },
  { id: 4, plate: 'JKL-0G12', name: 'Honda CG 160', type: 'moto', brand: 'Honda', status: 'disponivel', latitude: -23.555, longitude: -46.64, capacityKg: 50 },
  { id: 5, plate: 'DRN-001', name: 'Drone Entrega Alpha', type: 'drone', brand: 'FleetTech', status: 'disponivel', latitude: -23.551, longitude: -46.635, capacityKg: 5, autonomyKm: 15 },
  { id: 6, plate: 'ROB-001', name: 'Robô Armazém R1', type: 'robo', brand: 'AutoLog', status: 'em_rota', latitude: -23.552, longitude: -46.637, capacityKg: 200, autonomyKm: 8 },
];

export const mockDrivers = [
  { id: 1, name: 'João Pereira', cpf: '111.222.333-44', status: 'em_viagem', rating: 4.8, phone: '(11) 99999-0001' },
  { id: 2, name: 'Ana Costa', cpf: '222.333.444-55', status: 'disponivel', rating: 4.9, phone: '(11) 99999-0002' },
  { id: 3, name: 'Carlos Mendes', cpf: '333.444.555-66', status: 'disponivel', rating: 4.5, phone: '(11) 99999-0003' },
];

export const mockRoutes = [
  { id: 1, name: 'SP Centro → Guarulhos', code: 'RT-001', distanceKm: 28.5, estimatedDurationMin: 65, status: 'em_andamento', plannedDate: new Date().toISOString().split('T')[0] },
  { id: 2, name: 'CD Osasco → Zona Leste', code: 'RT-002', distanceKm: 35.2, estimatedDurationMin: 90, status: 'planejada', plannedDate: new Date().toISOString().split('T')[0] },
  { id: 3, name: 'Campinas → Jundiaí', code: 'RT-003', distanceKm: 42, estimatedDurationMin: 55, status: 'concluida', plannedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
];

export const mockProducts = [
  { id: 1, sku: 'SKU-001', name: 'Óleo Lubrificante 5L', category: 'Manutenção', currentStock: 120, minStock: 50, unitPrice: 89.9 },
  { id: 2, sku: 'SKU-002', name: 'Pneu 295/80 R22.5', category: 'Pneus', currentStock: 8, minStock: 20, unitPrice: 1890 },
  { id: 3, sku: 'SKU-003', name: 'Kit Freio Caminhão', category: 'Peças', currentStock: 45, minStock: 30, unitPrice: 520 },
  { id: 4, sku: 'SKU-004', name: 'Embalagem Caixa P', category: 'Embalagem', currentStock: 320, minStock: 500, unitPrice: 5.9 },
];

export const mockClients = [
  { id: 1, name: 'Supermercado Central', city: 'São Paulo', region: 'Sudeste', totalPurchases: 1250000 },
  { id: 2, name: 'Distribuidora Norte', city: 'Campinas', region: 'Sudeste', totalPurchases: 890000 },
  { id: 3, name: 'Indústria Alimentos Sul', city: 'Curitiba', region: 'Sul', totalPurchases: 2100000 },
];

export const mockOrders = [
  { id: 1, orderNumber: 'PED-2024-001', clientName: 'Supermercado Central', status: 'em_transito', totalAmount: 45000, itemsCount: 120 },
  { id: 2, orderNumber: 'PED-2024-002', clientName: 'Distribuidora Norte', status: 'confirmado', totalAmount: 28500, itemsCount: 85 },
  { id: 3, orderNumber: 'PED-2024-003', clientName: 'Indústria Alimentos Sul', status: 'pendente', totalAmount: 92000, itemsCount: 340 },
];

export const mockKpis = {
  revenue: 2850000,
  operationalCost: 1420000,
  savingsGenerated: 187500,
  deliveriesCount: 1247,
  onTimeRate: 94.2,
  fleetUtilization: 78.5,
  revenueTrend: [2650000, 2680000, 2720000, 2780000, 2810000, 2830000, 2850000],
  costTrend: [1400000, 1390000, 1385000, 1410000, 1405000, 1415000, 1420000],
  savingsTrend: [168000, 172000, 175000, 178000, 182000, 185000, 187500],
};

export const mockAlerts = [
  { id: 1, type: 'critico', module: 'estoque', title: 'Estoque crítico: Pneu 295/80', message: 'SKU-002 abaixo do mínimo (8/20)', createdAt: new Date().toISOString() },
  { id: 2, type: 'aviso', module: 'rotas', title: 'Atraso previsto RT-001', message: 'IA prevê atraso de 15 min', createdAt: new Date().toISOString() },
  { id: 3, type: 'ia', module: 'ceo', title: 'Oportunidade de economia', message: 'Consolidar rotas zona leste: R$ 12.400/mês', createdAt: new Date().toISOString() },
];

export const mockIncidents = [
  { id: 1, type: 'atraso', severity: 'media', title: 'Atraso na entrega RT-001', status: 'em_tratamento', vehicleId: 1 },
  { id: 2, type: 'estoque', severity: 'alta', title: 'Ruptura iminente SKU-002', status: 'aberta' },
  { id: 3, type: 'veiculo', severity: 'baixa', title: 'Sensor temperatura drone', status: 'aberta', vehicleId: 5 },
];

export const mockAiPredictions = [
  { id: 1, type: 'atraso', entity: 'RT-001', confidence: 87, message: 'Probabilidade de atraso de 12-18 min devido ao trânsito' },
  { id: 2, type: 'gargalo', entity: 'CD Osasco', confidence: 72, message: 'Pico de separação previsto entre 14h-16h' },
  { id: 3, type: 'rota', entity: 'Zona Leste', confidence: 91, message: 'Rota alternativa via Av. Radial reduz 8 km e R$ 45 de combustível' },
];

export const mockBranches = [
  { id: 1, name: 'Matriz São Paulo', city: 'São Paulo', region: 'Sudeste', isDistributionCenter: true, employeeCount: 450, monthlyCost: 890000 },
  { id: 2, name: 'CD Campinas', city: 'Campinas', region: 'Sudeste', isDistributionCenter: true, employeeCount: 120, monthlyCost: 245000 },
  { id: 3, name: 'Filial Curitiba', city: 'Curitiba', region: 'Sul', isDistributionCenter: false, employeeCount: 85, monthlyCost: 165000 },
];

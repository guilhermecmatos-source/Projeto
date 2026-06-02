export interface SimulationInput {
  scenarioType: 'filial' | 'frota' | 'cd' | 'demanda' | 'custom';
  parameters: Record<string, number | string>;
}

export function runSimulation(input: SimulationInput) {
  const { scenarioType, parameters } = input;
  let projectedRevenue = 2850000;
  let projectedCost = 1420000;
  let roi = 0;
  const impacts: string[] = [];

  switch (scenarioType) {
    case 'filial': {
      const city = String(parameters.city || 'Interior SP');
      const employees = Number(parameters.employees || 50);
      projectedCost += employees * 4500 + 180000;
      projectedRevenue += employees * 12000;
      roi = ((projectedRevenue - projectedCost) / projectedCost) * 100;
      impacts.push(`Nova filial em ${city} com ${employees} funcionários`);
      impacts.push(`Investimento inicial estimado: R$ ${(employees * 4500 + 180000).toLocaleString('pt-BR')}`);
      impacts.push(`Payback estimado: 14-18 meses`);
      break;
    }
    case 'frota': {
      const vehicles = Number(parameters.vehicles || 5);
      const type = String(parameters.vehicleType || 'caminhao');
      const costPerVehicle = type === 'drone' ? 85000 : type === 'robo' ? 120000 : 450000;
      projectedCost += vehicles * (costPerVehicle / 12 + 15000);
      projectedRevenue += vehicles * 85000;
      roi = 22.5;
      impacts.push(`+${vehicles} veículos tipo ${type}`);
      impacts.push(`Capacidade de entrega: +${vehicles * 180} entregas/mês`);
      impacts.push(`Custo operacional mensal adicional: R$ ${(vehicles * 15000).toLocaleString('pt-BR')}`);
      break;
    }
    case 'cd': {
      const area = Number(parameters.areaM2 || 5000);
      projectedCost += area * 45 + 320000;
      projectedRevenue += area * 28;
      roi = 18.2;
      impacts.push(`Novo CD com ${area} m²`);
      impacts.push(`Redução de lead time regional: 35%`);
      break;
    }
    case 'demanda': {
      const growth = Number(parameters.growthPercent || 30) / 100;
      projectedRevenue *= 1 + growth;
      projectedCost *= 1 + growth * 0.65;
      roi = ((projectedRevenue - projectedCost) / projectedCost) * 100;
      impacts.push(`Demanda +${parameters.growthPercent || 30}%`);
      impacts.push(`Necessidade de frota adicional: ${Math.ceil(growth * 12)} veículos`);
      impacts.push(`Contratação sugerida: ${Math.ceil(growth * 25)} colaboradores`);
      break;
    }
    default:
      impacts.push('Cenário customizado processado');
  }

  return {
    scenarioType,
    parameters,
    projectedRevenue: Math.round(projectedRevenue),
    projectedCost: Math.round(projectedCost),
    projectedProfit: Math.round(projectedRevenue - projectedCost),
    projectedRoi: Math.round(roi * 10) / 10,
    impacts,
    generatedAt: new Date().toISOString(),
  };
}

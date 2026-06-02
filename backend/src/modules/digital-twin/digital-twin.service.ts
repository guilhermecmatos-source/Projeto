export interface TwinScenarioInput {
  eventType: 'veiculo_quebra' | 'contratacao' | 'nova_unidade' | 'demanda' | 'outro';
  params: Record<string, unknown>;
}

export function simulateTwinScenario(input: TwinScenarioInput) {
  const { eventType, params } = input;
  const baseRevenue = 2850000;
  const baseCost = 1420000;

  switch (eventType) {
    case 'veiculo_quebra': {
      const vehicleName = String(params.vehicleName || 'Volvo FH 540');
      const days = Number(params.downtimeDays || 3);
      const dailyImpact = 15000;
      return {
        eventType,
        title: `E se ${vehicleName} quebrar?`,
        financialImpact: -dailyImpact * days,
        operationalImpact: `${days} dias de capacidade reduzida. ${Math.ceil(days * 6)} entregas realocadas ou atrasadas.`,
        projections: {
          revenue: baseRevenue - dailyImpact * days,
          cost: baseCost + days * 2500,
          deliveriesDelayed: days * 6,
          alternativeVehicles: ['Mercedes Actros', 'Drone Alpha'],
        },
        recommendations: ['Ativar veículo reserva DEF-4E56', 'Contrato de guincho preventivo', 'Seguro frota revisão'],
      };
    }
    case 'contratacao': {
      const count = Number(params.employees || 10);
      const role = String(params.role || 'operacional');
      const monthlyCost = count * (role === 'motorista' ? 6500 : 4500);
      return {
        eventType,
        title: `E se contratar +${count} ${role}(s)?`,
        financialImpact: -monthlyCost,
        operationalImpact: `Capacidade +${count * 8}% em ${role === 'motorista' ? 'entregas' : 'separação'}.`,
        projections: {
          revenue: baseRevenue + count * 22000,
          cost: baseCost + monthlyCost,
          paybackMonths: Math.ceil(monthlyCost / (count * 22000)),
        },
        recommendations: ['Fasear contratação em 2 ondas', 'Treinamento integrado 2 semanas'],
      };
    }
    case 'nova_unidade': {
      const city = String(params.city || 'Sorocaba');
      return {
        eventType,
        title: `E se abrir unidade em ${city}?`,
        financialImpact: -380000,
        operationalImpact: 'Cobertura regional +45%. Lead time -2.5 dias.',
        projections: {
          revenue: baseRevenue * 1.15,
          cost: baseCost + 380000,
          roiMonths: 16,
          breakEvenMonth: 14,
        },
        recommendations: ['Usar CD Campinas como hub inicial', 'Piloto 6 meses antes de filial completa'],
      };
    }
    case 'demanda': {
      const percent = Number(params.growthPercent || 30);
      const factor = 1 + percent / 100;
      return {
        eventType,
        title: `E se a demanda crescer ${percent}%?`,
        financialImpact: baseRevenue * (factor - 1) - baseCost * (factor - 1) * 0.65,
        operationalImpact: `Gargalo em CD e frota. Necessário +${Math.ceil(percent / 2.5)} veículos.`,
        projections: {
          revenue: baseRevenue * factor,
          cost: baseCost * (1 + (factor - 1) * 0.65),
          fleetNeeded: Math.ceil(percent / 2.5),
          stockIncrease: `${Math.ceil(percent * 1.2)}%`,
        },
        recommendations: ['Simulação completa em /simulations', 'Contrato flexível de frota terceirizada'],
      };
    }
    default:
      return {
        eventType: 'outro',
        title: 'Cenário customizado',
        financialImpact: 0,
        operationalImpact: 'Configure parâmetros específicos.',
        projections: { revenue: baseRevenue, cost: baseCost },
        recommendations: [],
      };
  }
}

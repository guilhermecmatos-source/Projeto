-- Fleet AI - Dados iniciais para demonstração
USE fleet_ai;

INSERT INTO companies (id, name, cnpj, segment, plan) VALUES
(1, 'Logística Brasil S.A.', '12.345.678/0001-90', 'logistica', 'enterprise');

-- Senha: fleetai123 (bcrypt hash simulado - em produção usar bcrypt real)
INSERT INTO users (company_id, email, password_hash, name, role) VALUES
(1, 'admin@fleetai.com', '$2b$10$FleetAI.Demo.Hash.For.TCC.Project2024', 'Administrador Fleet', 'admin'),
(1, 'gerente@fleetai.com', '$2b$10$FleetAI.Demo.Hash.For.TCC.Project2024', 'Maria Silva', 'manager');

INSERT INTO vehicles (company_id, plate, name, type, brand, model, status, latitude, longitude, capacity_kg) VALUES
(1, 'ABC-1D23', 'Volvo FH 540', 'caminhao', 'Volvo', 'FH 540', 'em_rota', -23.5505, -46.6333, 25000),
(1, 'DEF-4E56', 'Mercedes Actros', 'caminhao', 'Mercedes', 'Actros', 'disponivel', -23.5629, -46.6544, 23000),
(1, 'GHI-7F89', 'Fiat Strada', 'carro', 'Fiat', 'Strada', 'em_rota', -23.5489, -46.6388, 800),
(1, 'JKL-0G12', 'Honda CG 160', 'moto', 'Honda', 'CG 160', 'disponivel', -23.5550, -46.6400, 50),
(1, 'DRN-001', 'Drone Entrega Alpha', 'drone', 'FleetTech', 'X-200', 'disponivel', -23.5510, -46.6350, 5),
(1, 'ROB-001', 'Robô Armazém R1', 'robo', 'AutoLog', 'R1-Pro', 'em_rota', -23.5520, -46.6370, 200);

INSERT INTO drivers (company_id, name, cpf, license_number, status, rating) VALUES
(1, 'João Pereira', '111.222.333-44', '12345678901', 'em_viagem', 4.8),
(1, 'Ana Costa', '222.333.444-55', '23456789012', 'disponivel', 4.9),
(1, 'Carlos Mendes', '333.444.555-66', '34567890123', 'disponivel', 4.5);

INSERT INTO routes (company_id, name, code, origin_address, destination_address, distance_km, estimated_duration_min, status, planned_date) VALUES
(1, 'SP Centro → Guarulhos', 'RT-001', 'Av. Paulista, 1000', 'Rod. Presidente Dutra, km 225', 28.5, 65, 'em_andamento', CURDATE()),
(1, 'CD Osasco → Zona Leste', 'RT-002', 'CD Osasco', 'Mooca, SP', 35.2, 90, 'planejada', CURDATE()),
(1, 'Campinas → Jundiaí', 'RT-003', 'Campinas', 'Jundiaí', 42.0, 55, 'concluida', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

INSERT INTO trips (route_id, vehicle_id, driver_id, status, fuel_cost, toll_cost, delay_minutes) VALUES
(1, 1, 1, 'em_andamento', 450.00, 85.50, 12),
(3, 2, 3, 'concluida', 380.00, 42.00, 0);

INSERT INTO products (company_id, sku, name, category, min_stock, current_stock, unit_cost, unit_price) VALUES
(1, 'SKU-001', 'Óleo Lubrificante 5L', 'Manutenção', 50, 120, 45.00, 89.90),
(1, 'SKU-002', 'Pneu 295/80 R22.5', 'Pneus', 20, 8, 1200.00, 1890.00),
(1, 'SKU-003', 'Kit Freio Caminhão', 'Peças', 30, 45, 280.00, 520.00),
(1, 'SKU-004', 'Embalagem Caixa P', 'Embalagem', 500, 320, 2.50, 5.90);

INSERT INTO clients (company_id, name, document, email, city, state, region, total_purchases) VALUES
(1, 'Supermercado Central', '98.765.432/0001-10', 'compras@supercentral.com', 'São Paulo', 'SP', 'Sudeste', 1250000.00),
(1, 'Distribuidora Norte', '87.654.321/0001-20', 'pedidos@distnorte.com', 'Campinas', 'SP', 'Sudeste', 890000.00),
(1, 'Indústria Alimentos Sul', '76.543.210/0001-30', 'logistica@ialsul.com', 'Curitiba', 'PR', 'Sul', 2100000.00);

INSERT INTO orders (company_id, client_id, order_number, status, total_amount, items_count, expected_delivery) VALUES
(1, 1, 'PED-2024-001', 'em_transito', 45000.00, 120, DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(1, 2, 'PED-2024-002', 'confirmado', 28500.00, 85, DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
(1, 3, 'PED-2024-003', 'pendente', 92000.00, 340, DATE_ADD(CURDATE(), INTERVAL 5 DAY));

INSERT INTO kpi_snapshots (company_id, period_date, revenue, operational_cost, savings_generated, deliveries_count, on_time_rate, fleet_utilization) VALUES
(1, CURDATE(), 2850000.00, 1420000.00, 187500.00, 1247, 94.2, 78.5),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 2720000.00, 1385000.00, 175000.00, 1198, 93.8, 76.2),
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 2650000.00, 1400000.00, 168000.00, 1150, 92.5, 74.0);

INSERT INTO alerts (company_id, type, module, title, message) VALUES
(1, 'critico', 'estoque', 'Estoque crítico: Pneu 295/80', 'SKU-002 abaixo do mínimo (8/20 unidades)'),
(1, 'aviso', 'rotas', 'Atraso previsto RT-001', 'IA prevê atraso de 15 min na rota SP → Guarulhos'),
(1, 'ia', 'ceo', 'Oportunidade de economia', 'Consolidar rotas zona leste pode economizar R$ 12.400/mês'),
(1, 'info', 'frota', 'Manutenção programada', 'Veículo DEF-4E56 - revisão em 3 dias');

INSERT INTO incidents (company_id, type, severity, title, description, status, vehicle_id) VALUES
(1, 'atraso', 'media', 'Atraso na entrega RT-001', 'Trânsito intenso na Marginal', 'em_tratamento', 1),
(1, 'estoque', 'alta', 'Ruptura iminente SKU-002', 'Reposição urgente necessária', 'aberta', NULL),
(1, 'veiculo', 'baixa', 'Sensor temperatura drone', 'Leitura acima do normal - monitorando', 'aberta', 5);

INSERT INTO branches (company_id, name, city, state, region, is_distribution_center, employee_count, monthly_cost) VALUES
(1, 'Matriz São Paulo', 'São Paulo', 'SP', 'Sudeste', TRUE, 450, 890000.00),
(1, 'CD Campinas', 'Campinas', 'SP', 'Sudeste', TRUE, 120, 245000.00),
(1, 'Filial Curitiba', 'Curitiba', 'PR', 'Sul', FALSE, 85, 165000.00);

-- Fleet AI - Schema MySQL
-- Plataforma SaaS de decisão empresarial em logística e operações

CREATE DATABASE IF NOT EXISTS fleet_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fleet_ai;

-- Empresas (multi-tenant)
CREATE TABLE companies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  segment ENUM('logistica', 'supermercado', 'distribuidora', 'industria', 'transportadora', 'automacao') DEFAULT 'logistica',
  plan ENUM('starter', 'professional', 'enterprise') DEFAULT 'professional',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Usuários
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'operator', 'viewer') DEFAULT 'operator',
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Veículos (caminhões, carros, motos, drones, robôs)
CREATE TABLE vehicles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  plate VARCHAR(20),
  name VARCHAR(255) NOT NULL,
  type ENUM('caminhao', 'carro', 'moto', 'drone', 'robo') NOT NULL DEFAULT 'caminhao',
  brand VARCHAR(100),
  model VARCHAR(100),
  year SMALLINT,
  capacity_kg DECIMAL(10,2),
  fuel_type ENUM('diesel', 'gasolina', 'eletrico', 'hibrido', 'na') DEFAULT 'diesel',
  status ENUM('disponivel', 'em_rota', 'manutencao', 'inativo') DEFAULT 'disponivel',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  autonomy_km DECIMAL(8,2) COMMENT 'Para drones/robôs',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_vehicles_status (status),
  INDEX idx_vehicles_type (type)
);

-- Motoristas
CREATE TABLE drivers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  license_number VARCHAR(20),
  license_category VARCHAR(5),
  phone VARCHAR(20),
  email VARCHAR(255),
  status ENUM('disponivel', 'em_viagem', 'folga', 'inativo') DEFAULT 'disponivel',
  rating DECIMAL(3,2) DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Rotas
CREATE TABLE routes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  origin_address TEXT,
  origin_lat DECIMAL(10,8),
  origin_lng DECIMAL(11,8),
  destination_address TEXT,
  destination_lat DECIMAL(10,8),
  destination_lng DECIMAL(11,8),
  distance_km DECIMAL(10,2),
  estimated_duration_min INT,
  status ENUM('planejada', 'em_andamento', 'concluida', 'cancelada') DEFAULT 'planejada',
  planned_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Viagens (execução de rotas)
CREATE TABLE trips (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  route_id INT UNSIGNED NOT NULL,
  vehicle_id INT UNSIGNED,
  driver_id INT UNSIGNED,
  started_at TIMESTAMP NULL,
  finished_at TIMESTAMP NULL,
  actual_distance_km DECIMAL(10,2),
  fuel_cost DECIMAL(12,2),
  toll_cost DECIMAL(12,2),
  other_cost DECIMAL(12,2),
  status ENUM('agendada', 'em_andamento', 'concluida', 'atrasada', 'cancelada') DEFAULT 'agendada',
  delay_minutes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- Produtos / Estoque
CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  sku VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  unit VARCHAR(20) DEFAULT 'un',
  min_stock INT DEFAULT 10,
  current_stock INT DEFAULT 0,
  unit_cost DECIMAL(12,2),
  unit_price DECIMAL(12,2),
  warehouse_location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY uk_company_sku (company_id, sku)
);

-- Movimentações de estoque
CREATE TABLE stock_movements (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  type ENUM('entrada', 'saida', 'ajuste') NOT NULL,
  quantity INT NOT NULL,
  reference VARCHAR(100),
  notes TEXT,
  created_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Clientes
CREATE TABLE clients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  document VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state CHAR(2),
  region VARCHAR(50),
  segment VARCHAR(100),
  total_purchases DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Pedidos
CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  client_id INT UNSIGNED,
  order_number VARCHAR(50) NOT NULL,
  status ENUM('pendente', 'confirmado', 'em_separacao', 'em_transito', 'entregue', 'cancelado') DEFAULT 'pendente',
  total_amount DECIMAL(14,2) NOT NULL,
  items_count INT DEFAULT 0,
  delivery_address TEXT,
  expected_delivery DATE,
  route_id INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL
);

-- KPIs e métricas (cache/dashboard)
CREATE TABLE kpi_snapshots (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  period_date DATE NOT NULL,
  revenue DECIMAL(14,2) DEFAULT 0,
  operational_cost DECIMAL(14,2) DEFAULT 0,
  savings_generated DECIMAL(14,2) DEFAULT 0,
  deliveries_count INT DEFAULT 0,
  on_time_rate DECIMAL(5,2) DEFAULT 0,
  fleet_utilization DECIMAL(5,2) DEFAULT 0,
  stock_turnover DECIMAL(8,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY uk_company_period (company_id, period_date)
);

-- Alertas
CREATE TABLE alerts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  type ENUM('critico', 'aviso', 'info', 'ia') NOT NULL,
  module VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_alerts_unread (company_id, is_read)
);

-- Ocorrências (Centro de Comando)
CREATE TABLE incidents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  type VARCHAR(50) NOT NULL,
  severity ENUM('baixa', 'media', 'alta', 'critica') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('aberta', 'em_tratamento', 'resolvida') DEFAULT 'aberta',
  vehicle_id INT UNSIGNED,
  route_id INT UNSIGNED,
  auto_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL
);

-- Simulações empresariais
CREATE TABLE simulations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  scenario_type ENUM('filial', 'frota', 'cd', 'demanda', 'custom') NOT NULL,
  parameters JSON NOT NULL,
  results JSON,
  projected_revenue DECIMAL(14,2),
  projected_cost DECIMAL(14,2),
  projected_roi DECIMAL(8,2),
  created_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Gêmeo Digital - cenários what-if
CREATE TABLE digital_twin_scenarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  event_type ENUM('veiculo_quebra', 'contratacao', 'nova_unidade', 'demanda', 'outro') NOT NULL,
  input_params JSON NOT NULL,
  impact_summary JSON,
  financial_impact DECIMAL(14,2),
  operational_impact TEXT,
  created_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Histórico CEO AI
CREATE TABLE ceo_ai_conversations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  data_sources JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Previsões IA
CREATE TABLE ai_predictions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  prediction_type ENUM('atraso', 'rota', 'gargalo', 'estoque', 'demanda') NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT UNSIGNED,
  confidence DECIMAL(5,2),
  prediction_data JSON NOT NULL,
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Filiais / unidades (para simulações)
CREATE TABLE branches (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state CHAR(2),
  region VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_distribution_center BOOLEAN DEFAULT FALSE,
  employee_count INT DEFAULT 0,
  monthly_cost DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

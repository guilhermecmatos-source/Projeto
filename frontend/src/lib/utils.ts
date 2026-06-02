import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export const vehicleTypeLabels: Record<string, string> = {
  caminhao: 'Caminhão',
  carro: 'Carro',
  moto: 'Moto',
  drone: 'Drone',
  robo: 'Robô',
};

export const statusColors: Record<string, string> = {
  disponivel: 'text-fleet-success',
  em_rota: 'text-fleet-cyan',
  em_viagem: 'text-fleet-cyan',
  em_andamento: 'text-fleet-cyan',
  manutencao: 'text-fleet-warning',
  critico: 'text-fleet-danger',
  alta: 'text-fleet-danger',
  media: 'text-fleet-warning',
  baixa: 'text-fleet-muted',
};

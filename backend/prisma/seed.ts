import { PrismaClient, Role, FuelType, RuvStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nexusai.com" },
    update: {},
    create: {
      name: "Administrador Nexus",
      email: "admin@nexusai.com",
      passwordHash: adminPassword,
      role: Role.ADMINISTRADOR,
      unit: "Matriz"
    }
  });

  const driver = await prisma.driver.upsert({
    where: { cpf: "12345678901" },
    update: {},
    create: {
      name: "Carlos Motorista",
      cpf: "12345678901",
      cnh: "CNH12345",
      category: "D",
      cnhExpiry: new Date("2028-01-10"),
      phone: "11999990000",
      status: "ATIVO"
    }
  });

  const vehicle = await prisma.vehicle.upsert({
    where: { plate: "ABC1D23" },
    update: {},
    create: {
      plate: "ABC1D23",
      model: "Sprinter",
      brand: "Mercedes",
      year: 2022,
      fuel: FuelType.DIESEL,
      capacity: 15,
      situation: "ATIVO",
      km: 52300,
      lastMaintenanceDate: new Date("2026-05-01")
    }
  });

  await prisma.ruv.upsert({
    where: { authorizationNo: "RUV-0001" },
    update: {},
    create: {
      authorizationNo: "RUV-0001",
      emissionDate: new Date(),
      unit: "SENAI Centro",
      center: "Logistica",
      expectedDate: new Date(),
      departureTime: "08:00",
      returnTime: "18:00",
      destination: "Campinas",
      service: "Visita técnica",
      objective: "Apoio operação",
      passengers: "Equipe técnica",
      vehicleType: "Micro-ônibus",
      fuelType: FuelType.DIESEL,
      status: RuvStatus.CRIADA,
      requesterId: admin.id,
      driverId: driver.id,
      vehicleId: vehicle.id
    }
  });

  const existingItem = await prisma.inventoryItem.findFirst({ where: { name: "Pneu 295" } });
  if (!existingItem) await prisma.inventoryItem.create({ data: { name: "Pneu 295", supplier: "Pneus Brasil", quantity: 15, minQuantity: 8, unitCost: 980 } });

  let client = await prisma.client.findFirst({ where: { name: "Distribuidora Alfa" } });
  if (!client) {
    client = await prisma.client.create({ data: { name: "Distribuidora Alfa", email: "compras@alfa.com", phone: "1133334444" } });
  }
  await prisma.order.upsert({
    where: { code: "PED-1001" },
    update: {},
    create: { code: "PED-1001", clientId: client.id, totalValue: 22450, status: "PENDENTE" }
  });
}

main().finally(async () => prisma.$disconnect());

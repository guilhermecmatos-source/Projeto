const { PrismaClient, Role, FuelType, RuvStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nexusai.com" },
    update: {},
    create: { name: "Administrador Nexus", email: "admin@nexusai.com", passwordHash: adminPassword, role: Role.ADMINISTRADOR, unit: "Matriz" }
  });

  const driver = await prisma.driver.upsert({
    where: { cpf: "12345678901" },
    update: {},
    create: { name: "Carlos Motorista", cpf: "12345678901", cnh: "CNH12345", category: "D", cnhExpiry: new Date("2028-01-10"), phone: "11999990000", status: "ATIVO" }
  });

  const vehicle = await prisma.vehicle.upsert({
    where: { plate: "ABC1D23" },
    update: {},
    create: { plate: "ABC1D23", model: "Sprinter", brand: "Mercedes", year: 2022, fuel: FuelType.DIESEL, capacity: 15, situation: "ATIVO", km: 52300, lastMaintenanceDate: new Date("2026-05-01") }
  });

  await prisma.ruv.upsert({
    where: { authorizationNo: "RUV-0001" },
    update: {},
    create: {
      authorizationNo: "RUV-0001", emissionDate: new Date(), unit: "SENAI Centro", center: "Logistica", expectedDate: new Date(),
      departureTime: "08:00", returnTime: "18:00", destination: "Campinas", service: "Visita técnica", objective: "Apoio operação",
      passengers: "Equipe técnica", vehicleType: "Micro-ônibus", fuelType: FuelType.DIESEL, status: RuvStatus.CRIADA,
      requesterId: admin.id, driverId: driver.id, vehicleId: vehicle.id
    }
  });
}

main().finally(async () => prisma.$disconnect());

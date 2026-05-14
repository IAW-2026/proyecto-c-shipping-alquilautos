//archivo de inicializacion de Prisma
//inicializa prisma
//configura el adapter
//configura pool de conexiones
//evita multiples conexiones

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

//Crea un pool de conexiones reutilizables hacia Neon/Postgres
const pool = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
});

//Crea el adaptador que permite a Prisma usar el pool de 'pg'
const adapter = new PrismaPg(pool);

//objeto global para guardar una única instancia de Prisma
//  y evitar múltiples conexiones durante el hot reload de Next.js
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

//Inicializa Prisma: si ya existe una conexión global la reutiliza,
//  si no, crea una nueva usando nuestro adaptador
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

//guarda la instancia de Prisma para reutilizarla mas adelane
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

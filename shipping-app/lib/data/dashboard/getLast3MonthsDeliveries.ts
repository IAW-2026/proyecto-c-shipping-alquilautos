//cuenta entregas cuya fecha de entrega corresponde al mes X (para los ultimos 3 meses)
import { prisma } from "@/lib/prisma";

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

async function countMonth(monthDate: Date) {
  const start = getMonthStart(monthDate);
  const end = getMonthEnd(monthDate);

  return prisma.coordinacion.count({
    where: {
      tipo: "ENTREGA",
      estado: "CONFIRMADA",
      fecha: {
        gte: start,
        lte: end,
      },
    },
  });
}

export async function getLast3MonthsDeliveries() {
  const now = new Date();

  const m0 = new Date(now.getFullYear(), now.getMonth(), 1);
  const m1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const m2 = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const [current, prev, prev2] = await Promise.all([
    countMonth(m0),
    countMonth(m1),
    countMonth(m2),
  ]);

  return [
    {
      mes: m2.toLocaleString("es-AR", { month: "short" }),
      entregas: prev2,
    },
    {
      mes: m1.toLocaleString("es-AR", { month: "short" }),
      entregas: prev,
    },
    {
      mes: m0.toLocaleString("es-AR", { month: "short" }),
      entregas: current,
    },
  ];
}

import { prisma } from "@/lib/prisma";

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getUTCDay();

  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(0, 0, 0, 0);

  return d;
}

function getEndOfWeek(start: Date) {
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  return end;
}

export async function getWeeklyReturnsComparison() {
  const now = new Date();

  // Semana actual
  const startCurrent = getStartOfWeek(now);
  const endCurrent = getEndOfWeek(startCurrent);

  // Semana pasada
  const startPrev = new Date(startCurrent);
  startPrev.setUTCDate(startPrev.getUTCDate() - 7);

  const endPrev = new Date(endCurrent);
  endPrev.setUTCDate(endPrev.getUTCDate() - 7);

  const [current, previous] = await Promise.all([
    prisma.historialEstado.count({
      where: {
        estado: "DEVUELTO",
        fechaHora: {
          gte: startCurrent,
          lte: endCurrent,
        },
      },
    }),

    prisma.historialEstado.count({
      where: {
        estado: "DEVUELTO",
        fechaHora: {
          gte: startPrev,
          lte: endPrev,
        },
      },
    }),
  ]);

  const variation = previous ? ((current - previous) / previous) * 100 : 0;

  return {
    current,
    previous,
    variation,
  };
}

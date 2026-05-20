//obtencion de datos para recuadros del dashboard

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [entregasActivas, pendientesCoordinar, devoluciones, canceladas] =
    await Promise.all([
      prisma.entrega.count({
        where: {
          estado: "EN_USO",
        },
      }),

      prisma.entrega.count({
        where: {
          estado: "PENDIENTE",
        },
      }),

      prisma.entrega.count({
        where: {
          estado: "DEVUELTO",
        },
      }),

      prisma.entrega.count({
        where: {
          estado: "CANCELADO",
        },
      }),
    ]);

  return {
    entregasActivas,
    pendientesCoordinar,
    devoluciones,
    canceladas,
  };
}

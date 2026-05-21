//obtencion de datos para grafico de lineas

import { prisma } from "@/lib/prisma";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export async function getDeliveryChartWeekly() {
  const entregas = await prisma.entrega.findMany({
    where: {
      estado: {
        in: ["ENTREGADO", "DEVUELTO"],
      },
    },

    include: {
      coordinaciones: true,
    },
  });

  const result = DAYS.map((day) => ({
    day,
    entregas: 0,
    devoluciones: 0,
  }));

  entregas.forEach((entrega) => {
    // Coordinación de ENTREGA (contempla entregas en estado ENTREGADO o EN_USO)
    const entregaCoord = entrega.coordinaciones.find(
      (c) => c.tipo === "ENTREGA",
    );

    if (entregaCoord) {
      const dayIndex = new Date(entregaCoord.fecha).getDay();

      result[dayIndex].entregas += 1;
    }

    // Coordinación de DEVOLUCIÓN (contempla entregas en estado DEVUELTO)
    if (entrega.estado === "DEVUELTO") {
      const devolucionCoord = entrega.coordinaciones.find(
        (c) => c.tipo === "DEVOLUCION",
      );

      if (devolucionCoord) {
        const dayIndex = new Date(devolucionCoord.fecha).getDay();

        result[dayIndex].devoluciones += 1;
      }
    }
  });

  return result;
}

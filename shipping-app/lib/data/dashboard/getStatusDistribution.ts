import { prisma } from "@/lib/prisma";

import { STATUS_COLORS } from "@/lib/config/statusColors";

export async function getStatusDistribution() {
  const groupedStatuses = await prisma.entrega.groupBy({
    by: ["estado"],
    _count: {
      estado: true,
    },
  });

  return groupedStatuses.map((status) => ({
    name: status.estado,
    value: status._count.estado,
    color: STATUS_COLORS[status.estado].color.chart,
  }));
}

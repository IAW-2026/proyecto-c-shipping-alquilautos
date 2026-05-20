import { prisma } from "@/lib/prisma";

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "#22d3ee",
  COORDINADA: "#10b981",
  ENTREGADO: "#a78bfa",
  EN_USO: "#f59e0b",
  DEVUELTO: "#60a5fa",
  CANCELADO: "#ef4444",
};

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
    color: STATUS_COLORS[status.estado],
  }));
}

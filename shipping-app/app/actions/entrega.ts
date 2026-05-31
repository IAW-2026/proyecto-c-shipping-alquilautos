"use server";

import { prisma } from "@/lib/prisma";

export async function marcarComoEntregado(id_entrega: string) {
  const entrega = await prisma.entrega.findUnique({
    where: { id: id_entrega },
    include: {
      coordinaciones: true,
    },
  });

  if (!entrega) {
    throw new Error("Entrega no encontrada");
  }

  if (entrega.estado !== "COORDINADA") {
    throw new Error("Estado inválido");
  }

  const coordEntrega = entrega.coordinaciones.find((c) => c.tipo === "ENTREGA");

  if (!coordEntrega || !coordEntrega.hora_seleccionada) {
    throw new Error("Coordinación inválida");
  }

  //fecha-hora actual
  const ahora = new Date();

  //fecha-hora de la entrega (junto fecha con hora)
  const fechaHoraEntrega = new Date(coordEntrega.fecha);
  const [h, m] = coordEntrega.hora_seleccionada.split(":");
  fechaHoraEntrega.setHours(Number(h), Number(m), 0, 0);

  if (ahora < fechaHoraEntrega) {
    throw new Error("Aún no se puede marcar como entregado");
  }

  const updated = await prisma.entrega.update({
    where: { id: id_entrega },
    data: {
      estado: "ENTREGADO",
    },
  });

  await prisma.historialEstado.create({
    data: {
      id_entrega,
      estado: "ENTREGADO",
      descripcion: "Entrega realizada por operador logístico",
    },
  });

  return updated;
}

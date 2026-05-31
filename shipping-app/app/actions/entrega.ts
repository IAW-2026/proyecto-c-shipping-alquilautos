"use server"; //server action (funcion que puede llamar el cliente)

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
  const ahora = new Date(); //server action toma fecha-hora del servidor (UTC)

  //fecha-hora de la entrega (junto fecha con hora)
  const fechaHoraEntrega = new Date(coordEntrega.fecha);
  const [h, m] = coordEntrega.hora_seleccionada.split(":");
  fechaHoraEntrega.setHours(Number(h) + 3, Number(m), 0, 0); //+3 porque toma hora del servidor (UTC)

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

export async function marcarComoDevuelto(id_entrega: string) {
  const entrega = await prisma.entrega.findUnique({
    where: { id: id_entrega },
    include: {
      coordinaciones: true,
    },
  });

  if (!entrega) {
    throw new Error("Entrega no encontrada");
  }

  if (entrega.estado !== "ENTREGADO") {
    throw new Error("Estado inválido");
  }

  const coordDevolucion = entrega.coordinaciones.find(
    (c) => c.tipo === "DEVOLUCION",
  );

  if (!coordDevolucion || !coordDevolucion.hora_seleccionada) {
    throw new Error("Coordinación de devolución inválida");
  }

  //fecha-hora actual
  const ahora = new Date(); //server action toma hora del servidor (UTC)

  //fecha-hora de la devolucion (junto fecha con hora)
  const fechaHoraDevolucion = new Date(coordDevolucion.fecha);
  const [h, m] = coordDevolucion.hora_seleccionada.split(":");
  fechaHoraDevolucion.setHours(Number(h) + 3, Number(m), 0, 0); //+3 porque toma hora del servidor (UTC)

  if (ahora < fechaHoraDevolucion) {
    throw new Error("Aún no se puede marcar como devuelto");
  }

  const updated = await prisma.entrega.update({
    where: { id: id_entrega },
    data: {
      estado: "DEVUELTO",
    },
  });

  await prisma.historialEstado.create({
    data: {
      id_entrega,
      estado: "DEVUELTO",
      descripcion: "Vehículo devuelto por cliente",
    },
  });

  return updated;
}

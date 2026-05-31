"use server"; //server action (funcion que puede llamar el cliente)

import { prisma } from "@/lib/prisma";
import { fromZonedTime } from "date-fns-tz";

//para convertir a fecha-hora argentina
const TZ = "America/Argentina/Buenos_Aires";
function parseFechaHoraArgentina(fecha: Date | string, horaStr: string): Date {
  const soloFecha =
    typeof fecha === "string"
      ? fecha.slice(0, 10)
      : fecha.toISOString().slice(0, 10);
  const isoSinZona = `${soloFecha}T${horaStr}:00`;
  return fromZonedTime(isoSinZona, TZ);
}

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
  const ahora = new Date(); //server action toma fecha-hora del servidor

  //fecha-hora de la entrega (junto fecha con hora)
  const fechaHoraEntrega = parseFechaHoraArgentina(
    coordEntrega.fecha,
    coordEntrega.hora_seleccionada,
  );

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
  const fechaHoraDevolucion = parseFechaHoraArgentina(
    coordDevolucion.fecha,
    coordDevolucion.hora_seleccionada,
  );

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

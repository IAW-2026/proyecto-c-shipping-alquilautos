/*server action para testear marcar como ENTREGADO/DEVUELTO
    - no hace chequeo de horario
*/

"use server"; //server action (funcion que puede llamar el cliente)

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

//para convertir a fecha-hora argentina

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

  //notificar a seller
  //obtengo token de la sesion actual
  const { getToken } = await auth();
  const token = await getToken();
  await fetch(
    `${process.env.SELLER_APP_URL}/api/reserva/${entrega.id_reserva}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //envio el token
      },
      body: JSON.stringify({
        estado: "Entregada",
      }),
    },
  );

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

  //notificar a seller
  //obtengo token de la sesion actual
  const { getToken } = await auth();
  const token = await getToken();
  await fetch(
    `${process.env.SELLER_APP_URL}/api/reserva/${entrega.id_reserva}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //envio el token
      },
      body: JSON.stringify({
        estado: "Finalizada",
      }),
    },
  );

  return updated;
}

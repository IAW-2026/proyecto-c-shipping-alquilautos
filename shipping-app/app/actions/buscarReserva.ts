"use server"; //server action (funcion que puede llamar el cliente)

import { prisma } from "@/lib/prisma";

export async function buscarReserva(id_reserva: string) {
  const entrega = await prisma.entrega.findFirst({
    where: { id_reserva },
    include: { coordinaciones: true },
  });

  return entrega ?? null; //devuelve null si no encuentra nada
}

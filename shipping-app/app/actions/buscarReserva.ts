"use server"; //server action (funcion que puede llamar el cliente)

import { prisma } from "@/lib/prisma";

export async function buscarReserva(query: string) {
  const entregas = await prisma.entrega.findMany({
    where: {
      OR: [
        {
          id_reserva: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          id: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: { coordinaciones: true },
  });

  return entregas;
}

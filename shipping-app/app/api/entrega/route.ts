import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Obtiene el JSON enviado
    const body = await req.json();

    // Guarda una nueva entrega en la DB
    const entrega = await prisma.entrega.create({
      data: {
        idReserva: body.idReserva,
        idVehiculo: body.idVehiculo,
        idPropietario: body.idPropietario,
        idComprador: body.idComprador,
        observaciones: body.observaciones,
      },
    });

    // Devuelve la entrega creada
    return Response.json(entrega, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Error creando entrega" }, { status: 500 });
  }
}

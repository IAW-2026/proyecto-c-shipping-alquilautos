import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Obtiene el JSON enviado
    const body = await req.json();

    // Guarda una nueva entrega en la DB
    const entrega = await prisma.entrega.create({
      data: {
        id_reserva: body.id_reserva,
        id_vehiculo: body.id_vehiculo,
        id_propietario: body.id_propietario,
        id_comprador: body.id_comprador,
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

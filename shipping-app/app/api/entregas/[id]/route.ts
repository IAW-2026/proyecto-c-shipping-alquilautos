/*consultar estado de una entrega
  - puede acceder: buyer/seller
*/

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "buyer" && role !== "seller") {
      return Response.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Busca la entrega por id_reserva
    const entrega = await prisma.entrega.findUnique({
      where: {
        id_reserva: id,
      },
    });

    if (!entrega) {
      return Response.json({ error: "Entrega no encontrada" }, { status: 404 });
    }

    // Devuelve el estado actual de la entrega
    return Response.json({
      id_entrega: entrega.id,
      estado: entrega.estado,
      observaciones: entrega.observaciones,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error consultando entrega" },
      { status: 500 },
    );
  }
}

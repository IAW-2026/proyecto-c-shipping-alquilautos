import { NextResponse } from "next/server";
import { getWeeklyReturnsComparison } from "@/lib/data/dashboard/getWeeklyReturnsComparison";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json(
        { data: null, error: "No autenticado" },
        { status: 401 },
      );
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "adminGlobal") {
      return Response.json(
        { data: null, error: "No autorizado" },
        { status: 403 },
      );
    }

    //obtengo los datos
    const data = await getWeeklyReturnsComparison();
    return Response.json({
      data,
      error: null,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        data: null,
        error: "Error obteniendo la comparación semanal de devoluciones",
      },
      { status: 500 },
    );
  }
}

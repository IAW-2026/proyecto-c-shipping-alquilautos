import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/data/dashboard/getDashboardStats";
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
    const data = await getDashboardStats();
    return Response.json({
      data,
      error: null,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { data: null, error: "Error obteniendo las estadísticas del dashboard" },
      { status: 500 },
    );
  }
}

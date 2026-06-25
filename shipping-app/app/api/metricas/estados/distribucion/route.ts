import { NextResponse } from "next/server";
import { getStatusDistribution } from "@/lib/data/dashboard/getStatusDistribution";

export async function GET() {
  const data = await getStatusDistribution();
  return NextResponse.json(data);
}

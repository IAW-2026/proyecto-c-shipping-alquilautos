import { NextResponse } from "next/server";
import { getDeliveryChartData } from "@/lib/data/dashboard/getDeliveryChartData";

export async function GET() {
  const data = await getDeliveryChartData();

  return NextResponse.json(data);
}

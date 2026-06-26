export const dynamic = "force-dynamic";

import {
  EntregasActivasCard,
  DevolucionesCard,
  PendientesCard,
  CanceladasCard,
} from "@/components/admin/StatCard";
import DashboardChart from "@/components/admin/DashboardChart";
import StatusChart from "@/components/admin/StatusChart";

import { getDashboardStats } from "@/lib/data/dashboard/getDashboardStats";
import { getDeliveryChartData } from "@/lib/data/dashboard/getDeliveryChartData";
import { getStatusDistribution } from "@/lib/data/dashboard/getStatusDistribution";
import { getWeeklyDeliveriesComparison } from "@/lib/data/dashboard/getWeeklyDeliveriesComparison";
import { getWeeklyReturnsComparison } from "@/lib/data/dashboard/getWeeklyReturnsComparison";

export default async function DashboardPage() {
  const [
    stats,
    deliveryChartData,
    statusDistribution,
    deliverysComparison,
    returnsComparison,
  ] = await Promise.all([
    getDashboardStats(),
    getDeliveryChartData(),
    getStatusDistribution(),
    getWeeklyDeliveriesComparison(),
    getWeeklyReturnsComparison(),
  ]);

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EntregasActivasCard
          title="Entregas activas"
          value={stats.entregasActivas}
          change={deliverysComparison.variation}
        />

        <PendientesCard
          title="Pendientes de coordinar"
          value={stats.pendientesCoordinar}
        />

        <DevolucionesCard
          title="Devoluciones esta semana"
          value={returnsComparison.current}
          change={returnsComparison.variation}
        />

        <CanceladasCard title="Canceladas" value={stats.canceladas} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 min-w-0">
          <DashboardChart data={deliveryChartData} />
        </div>
        <div className="min-w-0">
          <StatusChart data={statusDistribution} />
        </div>
      </div>
    </div>
  );
}

import StatCard from "@/components/admin/StatCard";
import DashboardChart from "@/components/admin/DashboardChart";
import StatusChart from "@/components/admin/StatusChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Entregas activas" value="24" change="+12%" />
        <StatCard title="Pendientes de coordinar" value="6" change="-4%" />
        <StatCard title="Devoluciones" value="6" change="+8%" />
        <StatCard title="Canceladas" value="6" change="-2%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>

        <StatusChart />
      </div>
    </div>
  );
}

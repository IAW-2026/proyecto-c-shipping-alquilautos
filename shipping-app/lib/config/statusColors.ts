export const STATUS_COLORS = {
  PENDIENTE: {
    label: "Pendiente",
    color: {
      chart: "#f97316",
      ui: "bg-orange-500/10 text-orange-400",
      active: "bg-orange-500/30 text-orange-300 border border-orange-500/50",
    },
  },

  COORDINADA: {
    label: "Coordinada",
    color: {
      chart: "#22d3ee",
      ui: "bg-blue-500/10 text-blue-400",
      active: "bg-blue-500/30 text-blue-300 border border-blue-500/50",
    },
  },

  ENTREGADO: {
    label: "Entregado",
    color: {
      chart: "#10b981",
      ui: "bg-green-500/10 text-green-400",
      active: "bg-green-500/30 text-green-300 border border-green-500/50",
    },
  },

  DEVUELTO: {
    label: "Devuelto",
    color: {
      chart: "#64748b",
      ui: "bg-slate-700 text-slate-300",
      active: "bg-slate-500/30 text-slate-200 border border-slate-400/50",
    },
  },

  CANCELADO: {
    label: "Cancelado",
    color: {
      chart: "#ef4444",
      ui: "bg-red-500/10 text-red-400",
      active: "bg-red-500/30 text-red-300 border border-red-500/50",
    },
  },
} as const;

export const STATUS_COLORS = {
  PENDIENTE: {
    label: "Pendiente",
    color: {
      chart: "#f97316",
      ui: "bg-orange-500/10 text-orange-400",
    },
  },

  COORDINADA: {
    label: "Coordinada",
    color: {
      chart: "#22d3ee",
      ui: "bg-blue-500/10 text-blue-400",
    },
  },

  ENTREGADO: {
    label: "Entregado",
    color: {
      chart: "#10b981",
      ui: "bg-green-500/10 text-green-400",
    },
  },

  DEVUELTO: {
    label: "Devuelto",
    color: {
      chart: "#64748b",
      ui: "bg-slate-700 text-slate-300",
    },
  },

  CANCELADO: {
    label: "Cancelado",
    color: {
      chart: "#ef4444",
      ui: "bg-red-500/10 text-red-400",
    },
  },
} as const;

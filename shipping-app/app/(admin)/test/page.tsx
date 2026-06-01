/* para testear endpoints:
    - crear entrega
    - solicitar horarios disponibles
    - confirmar horarios seleccinados
    - cancelar reserva
*/
"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "crear" | "horario" | "cancelar";

interface ApiResponse {
  status: number;
  data: unknown;
  ms: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split("T")[0];
}

function inOneWeek() {
  return new Date(Date.now() + 7 * 86_400_000).toISOString().split("T")[0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "post" | "patch" | "buyer" | "seller" | "both";
}) {
  const styles: Record<string, string> = {
    post: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    patch: "bg-amber-50 text-amber-700 border border-amber-200",
    buyer: "bg-blue-50 text-blue-700 border border-blue-200",
    seller: "bg-violet-50 text-violet-700 border border-violet-200",
    both: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-[12px] text-gray-500">{children}</label>
  );
}

function Input({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-900 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-500"
    />
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-[12px] text-gray-500 dark:border-gray-800 dark:bg-gray-900">
      <span className="mt-0.5 shrink-0">💡</span>
      <span>{children}</span>
    </div>
  );
}

function ResponseBox({ result }: { result: ApiResponse | null | "loading" }) {
  if (!result) return null;

  if (result === "loading") {
    return (
      <div className="mt-3 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-[12px] font-medium text-gray-500 dark:bg-gray-800">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Esperando respuesta...
        </div>
      </div>
    );
  }

  const ok = result.status >= 200 && result.status < 300;

  return (
    <div className="mt-3 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
      <div
        className={`flex items-center justify-between px-3 py-2 text-[12px] font-medium ${
          ok
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
        }`}
      >
        <span>
          {ok ? "✓" : "✗"} HTTP {result.status} {ok ? "OK" : "Error"}
        </span>
        <span className="font-normal opacity-70">{result.ms}ms</span>
      </div>
      <pre className="max-h-48 overflow-auto bg-gray-50 p-3 font-mono text-[12px] text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        {JSON.stringify(result.data, null, 2)}
      </pre>
    </div>
  );
}

// ─── Tab: Crear entrega ───────────────────────────────────────────────────────

function TabCrear() {
  const [fields, setFields] = useState({
    id_reserva: "reserva-001",
    id_vehiculo: "vehiculo-123",
    id_propietario: "user-seller-abc",
    id_alquilador: "user-buyer-xyz",
    observaciones: "Vehículo en buen estado, revisar neumáticos",
    fecha_inicio: today(),
    fecha_fin: inOneWeek(),
    hora_inicio_entrega: "09:00",
    hora_fin_entrega: "12:00",
    hora_inicio_devolucion: "18:00",
    hora_fin_devolucion: "20:00",
  });

  const [result, setResult] = useState<ApiResponse | null | "loading">(null);

  const set = (key: keyof typeof fields) => (v: string) =>
    setFields((f) => ({ ...f, [key]: v }));

  async function handleSubmit() {
    setResult("loading");
    const t = Date.now();
    try {
      const r = await fetch("/api/entrega", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          fecha_inicio: fields.fecha_inicio + "T00:00:00.000Z",
          fecha_fin: fields.fecha_fin + "T00:00:00.000Z",
        }),
      });
      const data = await r.json();
      setResult({ status: r.status, data, ms: Date.now() - t });
    } catch (e) {
      setResult({
        status: 0,
        data: { error: (e as Error).message },
        ms: Date.now() - t,
      });
    }
  }

  return (
    <div>
      <Hint>
        Crea una entrega nueva con dos coordinaciones (ENTREGA y DEVOLUCIÓN) y
        un historial inicial en estado PENDIENTE.
      </Hint>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>id_reserva</FieldLabel>
          <Input value={fields.id_reserva} onChange={set("id_reserva")} />
        </div>
        <div>
          <FieldLabel>id_vehiculo</FieldLabel>
          <Input value={fields.id_vehiculo} onChange={set("id_vehiculo")} />
        </div>
        <div>
          <FieldLabel>id_propietario</FieldLabel>
          <Input
            value={fields.id_propietario}
            onChange={set("id_propietario")}
          />
        </div>
        <div>
          <FieldLabel>id_alquilador</FieldLabel>
          <Input value={fields.id_alquilador} onChange={set("id_alquilador")} />
        </div>
      </div>

      <div className="mt-3">
        <FieldLabel>observaciones</FieldLabel>
        <Input value={fields.observaciones} onChange={set("observaciones")} />
      </div>

      <SectionDivider label="Coordinación de entrega" />

      <div className="grid grid-cols-3 gap-3">
        <div>
          <FieldLabel>fecha_inicio</FieldLabel>
          <Input
            type="date"
            value={fields.fecha_inicio}
            onChange={set("fecha_inicio")}
          />
        </div>
        <div>
          <FieldLabel>hora_inicio_entrega</FieldLabel>
          <Input
            type="time"
            value={fields.hora_inicio_entrega}
            onChange={set("hora_inicio_entrega")}
          />
        </div>
        <div>
          <FieldLabel>hora_fin_entrega</FieldLabel>
          <Input
            type="time"
            value={fields.hora_fin_entrega}
            onChange={set("hora_fin_entrega")}
          />
        </div>
      </div>

      <SectionDivider label="Coordinación de devolución" />

      <div className="grid grid-cols-3 gap-3">
        <div>
          <FieldLabel>fecha_fin</FieldLabel>
          <Input
            type="date"
            value={fields.fecha_fin}
            onChange={set("fecha_fin")}
          />
        </div>
        <div>
          <FieldLabel>hora_inicio_devolucion</FieldLabel>
          <Input
            type="time"
            value={fields.hora_inicio_devolucion}
            onChange={set("hora_inicio_devolucion")}
          />
        </div>
        <div>
          <FieldLabel>hora_fin_devolucion</FieldLabel>
          <Input
            type="time"
            value={fields.hora_fin_devolucion}
            onChange={set("hora_fin_devolucion")}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-gray-700 active:scale-[.98] dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          ▶ Ejecutar
        </button>
      </div>

      <ResponseBox result={result} />
    </div>
  );
}

// ─── Tab: Confirmar horarios ──────────────────────────────────────────────────

function TabHorario() {
  const [idReserva, setIdReserva] = useState("reserva-001");
  const [horaEntrega, setHoraEntrega] = useState("10:00");
  const [horaDevolucion, setHoraDevolucion] = useState("19:00");
  const [rawJson, setRawJson] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [result, setResult] = useState<ApiResponse | null | "loading">(null);

  // Estado para los horarios disponibles
  const [horarios, setHorarios] = useState<
    {
      tipo: string;
      hora_inicio_disponible: string;
      hora_fin_disponible: string;
    }[]
  >([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  //Fetch al cambiar idReserva
  useEffect(() => {
    if (!idReserva.trim()) return;
    setLoadingHorarios(true);
    fetch(`/api/horario/${encodeURIComponent(idReserva)}`)
      .then((r) => r.json())
      .then((data) => setHorarios(data.horarios ?? []))
      .catch(() => setHorarios([]))
      .finally(() => setLoadingHorarios(false));
  }, [idReserva]);

  //Helper para encontrar el rango de un tipo
  const getRango = (tipo: string) =>
    horarios.find((h) => h.tipo.toLowerCase() === tipo.toLowerCase());

  useEffect(() => {
    const body = {
      id_reserva: idReserva,
      horarios: [
        { tipo: "ENTREGA", hora_seleccionada: horaEntrega },
        { tipo: "DEVOLUCION", hora_seleccionada: horaDevolucion },
      ],
    };
    setRawJson(JSON.stringify(body, null, 2));
    setJsonError("");
  }, [idReserva, horaEntrega, horaDevolucion]);

  function handleRawChange(v: string) {
    setRawJson(v);
    try {
      JSON.parse(v);
      setJsonError("");
    } catch (e) {
      setJsonError("JSON inválido: " + (e as Error).message);
    }
  }

  async function handleSubmit() {
    let body: unknown;
    try {
      body = JSON.parse(rawJson);
    } catch (e) {
      setResult({
        status: 400,
        data: { error: "JSON inválido: " + (e as Error).message },
        ms: 0,
      });
      return;
    }

    setResult("loading");
    const t = Date.now();
    try {
      const r = await fetch("/api/entrega/horario", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      setResult({ status: r.status, data, ms: Date.now() - t });
    } catch (e) {
      setResult({
        status: 0,
        data: { error: (e as Error).message },
        ms: Date.now() - t,
      });
    }
  }

  return (
    <div>
      <Hint>
        El buyer confirma los horarios elegidos. El estado pasa a COORDINADA y
        se notifica al seller via SELLER_APP_URL.
      </Hint>

      <div>
        <FieldLabel>id_reserva</FieldLabel>
        <Input value={idReserva} onChange={setIdReserva} />
      </div>

      <SectionDivider label="Horarios seleccionados" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>hora_seleccionada (tipo ENTREGA)</FieldLabel>
          <Input type="time" value={horaEntrega} onChange={setHoraEntrega} />
          {/* rango disponible */}
          {getRango("entrega") && (
            <p className="mt-1 text-[11px] text-gray-400">
              Disponible: {getRango("entrega")!.hora_inicio_disponible} –{" "}
              {getRango("entrega")!.hora_fin_disponible}
            </p>
          )}
        </div>
        <div>
          <FieldLabel>hora_seleccionada (tipo DEVOLUCION)</FieldLabel>
          <Input
            type="time"
            value={horaDevolucion}
            onChange={setHoraDevolucion}
          />
          {getRango("devolucion") && (
            <p className="mt-1 text-[11px] text-gray-400">
              Disponible: {getRango("devolucion")!.hora_inicio_disponible} –{" "}
              {getRango("devolucion")!.hora_fin_disponible}
            </p>
          )}
        </div>
      </div>

      <SectionDivider label="Body JSON (editable)" />

      <textarea
        value={rawJson}
        onChange={(e) => handleRawChange(e.target.value)}
        rows={10}
        className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-[12px] text-gray-800 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
      />
      {jsonError && (
        <p className="mt-1 text-[12px] text-red-500">{jsonError}</p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!!jsonError}
          className="rounded-md bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-gray-700 active:scale-[.98] disabled:opacity-40 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          ▶ Ejecutar
        </button>
      </div>

      <ResponseBox result={result} />
    </div>
  );
}

// ─── Tab: Cancelar ────────────────────────────────────────────────────────────

function TabCancelar() {
  const [idReserva, setIdReserva] = useState("reserva-001");
  const [result, setResult] = useState<ApiResponse | null | "loading">(null);

  async function handleSubmit() {
    if (!idReserva.trim()) {
      setResult({
        status: 400,
        data: { error: "id_reserva es requerido" },
        ms: 0,
      });
      return;
    }

    setResult("loading");
    const t = Date.now();
    try {
      const r = await fetch(`/api/cancelar/${encodeURIComponent(idReserva)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await r.json();
      setResult({ status: r.status, data, ms: Date.now() - t });
    } catch (e) {
      setResult({
        status: 0,
        data: { error: (e as Error).message },
        ms: Date.now() - t,
      });
    }
  }

  return (
    <div>
      <Hint>
        Cancela la entrega y todas sus coordinaciones. Si el estado previo era
        PENDIENTE, también notifica al seller.
      </Hint>

      <div>
        <FieldLabel>id_reserva (se usa en la URL)</FieldLabel>
        <Input value={idReserva} onChange={setIdReserva} />
      </div>

      <div className="mt-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 font-mono text-[12px] text-gray-500 dark:border-gray-800 dark:bg-gray-900">
        PATCH /api/cancelar/
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {idReserva || "[id]"}
        </span>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-medium text-red-700 transition hover:bg-red-100 active:scale-[.98] dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
        >
          ✕ Cancelar entrega
        </button>
      </div>

      <ResponseBox result={result} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: {
  id: Tab;
  label: string;
  method: string;
  role: string;
  roleVariant: "buyer" | "seller" | "both";
}[] = [
  {
    id: "crear",
    label: "Crear entrega",
    method: "POST",
    role: "seller",
    roleVariant: "seller",
  },
  {
    id: "horario",
    label: "Confirmar horarios",
    method: "PATCH",
    role: "buyer",
    roleVariant: "buyer",
  },
  {
    id: "cancelar",
    label: "Cancelar",
    method: "PATCH",
    role: "buyer/seller",
    roleVariant: "both",
  },
];

export default function TestPanelPage() {
  const [activeTab, setActiveTab] = useState<Tab>("crear");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Panel de prueba — API Entregas
          </h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Probá los endpoints directamente. Las cookies de sesión de Clerk se
            envían automáticamente.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-1 flex gap-1 border-b border-gray-200 dark:border-gray-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-3 pb-2 pt-1 text-[13px] font-medium transition ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <Badge variant={tab.method === "POST" ? "post" : "patch"}>
                {tab.method}
              </Badge>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          {/* Card header */}
          {TABS.filter((t) => t.id === activeTab).map((tab) => (
            <div key={tab.id} className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
                  {tab.label}
                </h2>
                <p className="mt-0.5 font-mono text-[12px] text-gray-400">
                  {tab.method}{" "}
                  {tab.id === "crear"
                    ? "/api/entrega"
                    : tab.id === "horario"
                      ? "/api/entrega/horario"
                      : "/api/cancelar/[id]"}
                </p>
              </div>
              <Badge variant={tab.roleVariant}>{tab.role}</Badge>
            </div>
          ))}

          {/* Tab content */}
          {activeTab === "crear" && <TabCrear />}
          {activeTab === "horario" && <TabHorario />}
          {activeTab === "cancelar" && <TabCancelar />}
        </div>
      </div>
    </div>
  );
}

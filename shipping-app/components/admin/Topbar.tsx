import { UserButton } from "@clerk/nextjs";

export default function Topbar() {
  return (
    <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950">
      <input
        placeholder="Buscar entrega, reserva..."
        className="bg-slate-900 px-3 py-1 rounded w-96 text-sm"
      />

      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          },
        }}
      />
    </div>
  );
}

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  //No autenticado
  if (!userId) {
    return redirectToSignIn();
  }
  //obtencion de role
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  // No admin
  if (role !== "admin") {
    redirect("/unauthorized");
  }
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        <main className="p-6 overflow-y-auto pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}

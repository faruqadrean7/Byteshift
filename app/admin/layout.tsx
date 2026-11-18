import AdminSidebar from "@/components/admin/AdminSidebar";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Admin · Byteshift Studio",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 md:grid md:grid-cols-[16rem_1fr] selection:bg-blue-500 selection:text-slate-100">
      <AdminSidebar email={user.email ?? null} />
      <div className="min-h-screen bg-[#060B18]">{children}</div>
    </div>
  );
}

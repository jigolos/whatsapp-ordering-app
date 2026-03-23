import { AdminShell } from "@/components/admin/admin-shell";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  return <AdminShell role={session.user.role}>{children}</AdminShell>;
}

import { AdminShell } from "@/components/admin/admin-shell";
import { requireRole } from "@/lib/auth/session";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["platform_admin"]);
  return <AdminShell role="platform_admin">{children}</AdminShell>;
}

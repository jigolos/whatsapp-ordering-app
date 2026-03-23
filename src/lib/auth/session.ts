import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    if (session.user.role === "platform_admin") {
      redirect("/platform/overview");
    }
    redirect("/admin");
  }
  return session;
}

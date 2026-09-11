import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="admin-shell min-h-screen">
      <AdminNav name={admin.name} />
      <main className="mx-auto w-[min(1400px,calc(100%-2rem))] py-8 lg:py-10">{children}</main>
    </div>
  );
}

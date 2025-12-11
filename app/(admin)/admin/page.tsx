"use client";

import { AdminDashboard } from "@/components/admin/Dashboard";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    const routeMap: Record<string, string> = {
      'admin-create-room': '/admin/create',
      'admin-rooms': '/admin/rooms',
      'admin-quota': '/admin/quota',
      'admin-dashboard': '/admin',
      'voter-landing': '/voter',
    };
    router.push(routeMap[view] || '/admin');
  };

  return <AdminDashboard onNavigate={handleNavigate} />;
}

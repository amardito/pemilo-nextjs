"use client";

import { CreateRoom } from "@/components/admin/CreateRoom";
import { useRouter } from "next/navigation";

export default function CreateRoomPage() {
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

  return <CreateRoom onNavigate={handleNavigate} />;
}

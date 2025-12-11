"use client";

import { RoomList } from "@/components/admin/RoomList";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
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

  const handleSelectRoom = (id: string) => {
    router.push(`/admin/room/${id}`);
  };

  return <RoomList onNavigate={handleNavigate} onSelectRoom={handleSelectRoom} />;
}

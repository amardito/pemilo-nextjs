"use client";

import { RoomDetail } from "@/components/admin/RoomDetail";
import { useRouter, useParams } from "next/navigation";

export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

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

  return <RoomDetail roomId={roomId} onNavigate={handleNavigate} />;
}

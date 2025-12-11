"use client";

import { RoomDetail } from "@/components/admin/RoomDetail";
import { useParams } from "next/navigation";

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.id as string;

  return <RoomDetail roomId={roomId} />;
}

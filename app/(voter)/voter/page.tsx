"use client";

import { VoterLanding } from "@/components/voter/VoterLanding";
import { useRouter } from "next/navigation";

export default function VoterPage() {
  const router = useRouter();

  const handleJoinRoom = (roomId: string) => {
    router.push(`/voter/room/${roomId}`);
  };

  return <VoterLanding onJoinRoom={handleJoinRoom} />;
}

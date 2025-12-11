"use client";

import { VotingRoom } from "@/components/voter/VotingRoom";
import { useRouter, useParams } from "next/navigation";

export default function VotingRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const handleExit = () => {
    router.push('/voter');
  };

  return <VotingRoom roomId={roomId} onExit={handleExit} />;
}

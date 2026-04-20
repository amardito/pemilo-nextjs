"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportsPage() {
  const { eventId } = useParams<{ eventId: string }>();

  async function handleExportTokens() {
    const blob = await api.voters.exportTokens(eventId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tokens_${eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExportTurnout() {
    const blob = await api.voters.exportTurnout(eventId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `turnout_${eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900">Export Data</h1>

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-900">Token Pemilih</h2>
          <p className="text-sm text-gray-500 mt-1">
            Download CSV berisi nama, NIM, kelas, dan token untuk setiap pemilih.
          </p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={handleExportTokens}>
            <Download size={16} className="mr-1" /> Download Token CSV
          </Button>
        </div>

        <hr />

        <div>
          <h2 className="font-semibold text-gray-900">Data Turnout</h2>
          <p className="text-sm text-gray-500 mt-1">
            Download CSV berisi nama, NIM, status sudah/belum memilih, dan waktu vote.
          </p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={handleExportTurnout}>
            <Download size={16} className="mr-1" /> Download Turnout CSV
          </Button>
        </div>
      </div>
    </div>
  );
}

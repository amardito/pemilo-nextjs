"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useVoters, useImportVoters, useGenerateTokens } from "@/lib/queries/voters";
import { useEvent } from "@/lib/queries/events";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Upload, Download, Key, Search, AlertTriangle, Info } from "lucide-react";
import type { Event, VoterListResponse, ImportResult } from "@/lib/types";

export default function VotersPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const { data: eventData } = useEvent(eventId);
  const event = eventData?.data as Event | undefined;

  const [search, setSearch] = useState("");
  const [hasVoted, setHasVoted] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useVoters(eventId, {
    page,
    per_page: 20,
    q: search || undefined,
    has_voted: hasVoted || undefined,
  });

  const importVoters = useImportVoters(eventId);
  const generateTokens = useGenerateTokens(eventId);
  const fileRef = useRef<HTMLInputElement>(null);

  const voterData = data?.data as VoterListResponse | undefined;
  const voters = voterData?.voters ?? [];
  const total = voterData?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importVoters.mutateAsync(file);
      setImportResult(res.data as ImportResult);
    } catch (err) {
      if (err instanceof ApiError && err.message.toLowerCase().includes("maximum number of voters")) {
        setLimitReached(true);
        return;
      }
      throw err;
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDownloadTemplate() {
    const blob = await api.voters.downloadTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_pemilih.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

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
    <div className="space-y-6">
      {/* Flow guide */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-2 mb-3">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-blue-800">Cara menambahkan pemilih</p>
        </div>
        <ol className="space-y-2 text-sm text-blue-900 ml-5 list-decimal">
          <li>
            <span className="font-medium">Download template CSV</span> — klik tombol <em>Template CSV</em> untuk mendapatkan format yang benar.
          </li>
          <li>
            <span className="font-medium">Isi data pemilih</span> — tambahkan baris untuk setiap pemilih dengan kolom <code className="bg-blue-100 px-1 rounded text-xs">full_name</code>, <code className="bg-blue-100 px-1 rounded text-xs">nim</code>, dan <code className="bg-blue-100 px-1 rounded text-xs">class_name</code>.
          </li>
          <li>
            <span className="font-medium">Import CSV</span> — klik tombol <em>Import CSV</em> lalu pilih file yang sudah diisi. Data duplikat akan dilewati otomatis.
          </li>
          <li>
            <span className="font-medium">Generate Token</span> — klik <em>Generate Token</em> untuk membuat kode unik setiap pemilih. Lakukan sekali sebelum event dibuka.
          </li>
          <li>
            <span className="font-medium">Export Token</span> — download CSV token lalu bagikan ke masing-masing pemilih. Token digunakan untuk login di halaman voting.
          </li>
          <li>
            <span className="font-medium">Buka event</span> — buka halaman <em>Setup</em> dan klik <em>Buka Voting</em>. Pemilih dapat mulai memilih setelah event dibuka.
          </li>
          <li>
            <span className="font-medium">Pantau turnout</span> — gunakan <em>Export Turnout</em> untuk melihat siapa saja yang sudah memilih.
          </li>
        </ol>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-gray-900">Pemilih</h1>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            disabled={importVoters.isPending}
          >
            <Upload size={16} className="mr-1" />
            {importVoters.isPending ? "Mengimpor..." : "Import CSV"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownloadTemplate}
          >
            <Download size={16} className="mr-1" /> Template CSV
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => generateTokens.mutate()}
            disabled={generateTokens.isPending}
          >
            <Key size={16} className="mr-1" />
            {generateTokens.isPending ? "Generating..." : "Generate Token"}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportTokens}>
            <Download size={16} className="mr-1" /> Export Token
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportTurnout}>
            <Download size={16} className="mr-1" /> Export Turnout
          </Button>
        </div>
      </div>

      {/* Voter limit modal */}
      <Modal open={limitReached} onClose={() => setLimitReached(false)}>
        <h2 className="text-lg font-semibold mb-4">Batas Pemilih Tercapai</h2>
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Kuota pemilih penuh</p>
              <p className="mt-1 text-sm text-amber-700">
                Paket <span className="font-semibold">{event?.package}</span> hanya mendukung maksimal{" "}
                <span className="font-semibold">{event?.max_voters} pemilih</span>. Upgrade paket untuk mengimpor lebih banyak pemilih.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setLimitReached(false)}>Batal</Button>
            <Button onClick={() => { setLimitReached(false); router.push(`/admin/events/${eventId}/billing`); }}>
              Upgrade Paket
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import result */}
      {importResult && (
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-green-700 font-medium">
            {importResult.imported_count} pemilih berhasil diimpor
          </p>
          {importResult.rejected.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-red-600 font-medium">
                {importResult.rejected.length} baris ditolak:
              </p>
              <ul className="mt-1 text-xs text-red-500 space-y-0.5 max-h-32 overflow-auto">
                {importResult.rejected.map((r, i) => (
                  <li key={i}>
                    Baris {r.row}: {r.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
            onClick={() => setImportResult(null)}
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari nama / NIM..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {[
            { label: "Semua", value: "" },
            { label: "Belum", value: "false" },
            { label: "Sudah", value: "true" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setHasVoted(tab.value); setPage(1); }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                hasVoted === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Nama</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">NIM</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Kelas</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Waktu Vote</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Memuat...
                </td>
              </tr>
            ) : voters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data pemilih
                </td>
              </tr>
            ) : (
              voters.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="px-4 py-2">{v.full_name}</td>
                  <td className="px-4 py-2 font-mono text-xs">{v.nim_raw}</td>
                  <td className="px-4 py-2">{v.class_name ?? "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        v.has_voted
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {v.has_voted ? "Sudah" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {v.voted_at
                      ? new Date(v.voted_at).toLocaleString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-gray-600 flex items-center">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useVoters, useImportVoters, useGenerateTokens } from "@/lib/queries/voters";
import { useEvent } from "@/lib/queries/events";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Upload, Download, Key, Search, AlertTriangle, Info, Copy, Check } from "lucide-react";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopyToken(voterId: string, token: string) {
    navigator.clipboard.writeText(token).then(() => {
      setCopiedId(voterId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

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
      <div className="rounded-2xl border border-[#2E4CA6]/50 bg-[#121D59] p-4">
        <div className="flex items-start gap-2 mb-3">
          <Info size={16} className="text-[#5983D9] shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-[#e8eaf6]">Cara menambahkan pemilih</p>
        </div>
        <ol className="space-y-2 text-sm text-[#5983D9] ml-5 list-decimal">
          <li>
            <span className="font-medium text-[#e8eaf6]">Download template CSV</span> — klik tombol <em>Template CSV</em> untuk mendapatkan format yang benar.
          </li>
          <li>
            <span className="font-medium text-[#e8eaf6]">Isi data pemilih</span> — tambahkan baris untuk setiap pemilih dengan kolom <code className="bg-[#0A0E26] px-1 rounded text-xs text-[#EAF205]">full_name</code>, <code className="bg-[#0A0E26] px-1 rounded text-xs text-[#EAF205]">nim</code>, dan <code className="bg-[#0A0E26] px-1 rounded text-xs text-[#EAF205]">class_name</code>.
          </li>
          <li>
            <span className="font-medium text-[#e8eaf6]">Import CSV</span> — klik tombol <em>Import CSV</em> lalu pilih file yang sudah diisi. Data duplikat akan dilewati otomatis.
          </li>
          <li>
            <span className="font-medium text-[#e8eaf6]">Generate Token</span> — klik <em>Generate Token</em> untuk membuat kode unik setiap pemilih. Lakukan sekali sebelum event dibuka.
          </li>
          <li>
            <span className="font-medium text-[#e8eaf6]">Export Token</span> — download CSV token lalu bagikan ke masing-masing pemilih. Token digunakan untuk login di halaman voting.
          </li>
          <li>
            <span className="font-medium text-[#e8eaf6]">Buka event</span> — buka halaman <em>Setup</em> dan klik <em>Buka Voting</em>. Pemilih dapat mulai memilih setelah event dibuka.
          </li>
          <li>
            <span className="font-medium text-[#e8eaf6]">Pantau turnout</span> — gunakan <em>Export Turnout</em> untuk melihat siapa saja yang sudah memilih.
          </li>
        </ol>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-[#e8eaf6]">Pemilih</h1>
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
        <h2 className="text-lg font-semibold mb-4 text-[#e8eaf6]">Batas Pemilih Tercapai</h2>
        <div className="space-y-4">
          <div className="flex gap-3 rounded-xl bg-amber-900/20 border border-amber-600/30 p-4">
            <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-300">Kuota pemilih penuh</p>
              <p className="mt-1 text-sm text-amber-400/80">
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
        <div className="rounded-2xl border border-[#2E4CA6]/40 bg-[#121D59] p-4">
          <p className="text-sm text-emerald-400 font-medium">
            {importResult.imported_count} pemilih berhasil diimpor
          </p>
          {importResult.rejected.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-red-400 font-medium">
                {importResult.rejected.length} baris ditolak:
              </p>
              <ul className="mt-1 text-xs text-red-400/80 space-y-0.5 max-h-32 overflow-auto">
                {importResult.rejected.map((r, i) => (
                  <li key={i}>
                    Baris {r.row}: {r.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            className="mt-2 text-xs text-[#5983D9]/60 hover:text-[#5983D9]"
            onClick={() => setImportResult(null)}
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5983D9]/50" />
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
                  ? "bg-[#EAF205] text-[#0A0E26] font-semibold"
                  : "bg-[#121D59] border border-[#2E4CA6]/40 text-[#5983D9] hover:bg-[#2E4CA6]/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#2E4CA6]/40 bg-[#121D59] overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#2E4CA6]/30 bg-[#0A0E26]/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-[#5983D9]">Nama</th>
              <th className="px-4 py-2 text-left font-medium text-[#5983D9]">NIM</th>
              <th className="px-4 py-2 text-left font-medium text-[#5983D9]">Kelas</th>
              <th className="px-4 py-2 text-left font-medium text-[#5983D9]">Status</th>
              <th className="px-4 py-2 text-left font-medium text-[#5983D9]">Waktu Vote</th>
              <th className="px-4 py-2 text-left font-medium text-[#5983D9]">Token</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#5983D9]">
                  Memuat...
                </td>
              </tr>
            ) : voters.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#5983D9]">
                  Tidak ada data pemilih
                </td>
              </tr>
            ) : (
              voters.map((v) => (
                <tr key={v.id} className="border-b border-[#2E4CA6]/20 last:border-0">
                  <td className="px-4 py-2 text-[#e8eaf6]">{v.full_name}</td>
                  <td className="px-4 py-2 font-mono text-xs text-[#5983D9]">{v.nim_raw}</td>
                  <td className="px-4 py-2 text-[#5983D9]">{v.class_name ?? "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        v.has_voted
                          ? "bg-emerald-900/30 border border-emerald-600/40 text-emerald-300"
                          : "bg-[#0A0E26] border border-[#2E4CA6]/40 text-[#5983D9]"
                      }`}
                    >
                      {v.has_voted ? "Sudah" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-[#5983D9]/60">
                    {v.voted_at
                      ? new Date(v.voted_at).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {v.token ? (
                      <button
                        onClick={() => handleCopyToken(v.id, v.token!)}
                        title="Salin token"
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[#5983D9] hover:bg-[#2E4CA6]/30 hover:text-[#e8eaf6] transition-colors"
                      >
                        {copiedId === v.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-[#5983D9]/40">-</span>
                    )}
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
          <span className="text-sm text-[#5983D9] flex items-center">
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

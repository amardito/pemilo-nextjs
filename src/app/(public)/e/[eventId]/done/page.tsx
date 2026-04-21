"use client";

import { CheckCircle } from "lucide-react";

const CLOSE_FALLBACK_DELAY_MILLISECONDS = 700;

export default function VoteDonePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0A0E26] px-4 py-8 text-[#e8eaf6]">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-5 rounded-2xl border border-[#2E4CA6]/40 bg-[#121D59] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF205] text-[#0A0E26] shadow-[0_0_30px_rgba(234,242,5,0.4)] motion-safe:animate-bounce motion-reduce:animate-none">
            <CheckCircle size={44} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#e8eaf6]">Suara Kamu Berhasil Dicatat! 🎉</h1>
          <p className="text-[#5983D9]">
            Terima kasih sudah berpartisipasi. Suaramu telah direkam secara aman dan terenkripsi di sistem Pemilo.
          </p>
          <button
            type="button"
            onClick={() => {
              window.close();
              setTimeout(() => {
                if (window.history.length > 1) {
                  window.history.back();
                }
              }, CLOSE_FALLBACK_DELAY_MILLISECONDS);
            }}
            className="w-full rounded-xl bg-[#EAF205] px-4 py-3 text-sm font-semibold text-[#0A0E26] transition hover:bg-yellow-300 shadow-[0_0_16px_rgba(234,242,5,0.25)]"
          >
            Tutup Halaman
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-[#5983D9]/60">Powered by Pemilo</p>
    </div>
  );
}

"use client";

import { CheckCircle } from "lucide-react";

const CLOSE_FALLBACK_DELAY_MILLISECONDS = 700;

export default function VoteDonePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#261C16] px-4 py-8 text-[#FAF0EB]">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-5 rounded-2xl border border-[#F26241]/40 bg-[#321F14] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F26241] text-[#FAF0EB] shadow-[0_0_30px_rgba(242,98,65,0.4)] motion-safe:animate-bounce motion-reduce:animate-none">
            <CheckCircle size={44} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#FAF0EB]">Suara Kamu Berhasil Dicatat! 🎉</h1>
          <p className="text-[#A69A97]">
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
            className="w-full rounded-xl bg-[#F26241] px-4 py-3 text-sm font-semibold text-[#FAF0EB] transition hover:bg-[#F29580] shadow-[0_0_16px_rgba(242,98,65,0.25)]"
          >
            Tutup Halaman
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-[#A69A97]/60">Powered by Pemilo</p>
    </div>
  );
}

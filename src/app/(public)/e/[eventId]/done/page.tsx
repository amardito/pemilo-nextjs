"use client";

import { CheckCircle } from "lucide-react";

const CLOSE_FALLBACK_DELAY_MILLISECONDS = 700;

export default function VoteDonePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-4 py-8 text-white">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-5 rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg motion-safe:animate-bounce motion-reduce:animate-none">
            <CheckCircle size={44} />
          </div>
          <h1 className="text-3xl font-extrabold">Suara Kamu Berhasil Dicatat! 🎉</h1>
          <p className="text-green-100">
            Terima kasih sudah berpartisipasi. Suaramu telah direkam secara aman dan terenkripsi di sistem Pemilo.
          </p>
          <button
            type="button"
            onClick={() => {
              window.close();
              setTimeout(() => {
                if (!document.hidden && window.history.length > 1) {
                  window.history.back();
                }
              }, CLOSE_FALLBACK_DELAY_MILLISECONDS);
            }}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Tutup Halaman
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-green-100/90">Powered by Pemilo</p>
    </div>
  );
}

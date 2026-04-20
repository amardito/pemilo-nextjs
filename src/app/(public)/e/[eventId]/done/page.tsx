"use client";

import { CheckCircle } from "lucide-react";

export default function VoteDonePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="text-center space-y-4 max-w-sm">
        <CheckCircle size={64} className="mx-auto text-green-500" />
        <h1 className="text-2xl font-bold text-gray-900">Suara Terkirim!</h1>
        <p className="text-gray-600">
          Terima kasih telah berpartisipasi dalam pemilihan. Suaramu telah tercatat dengan aman.
        </p>
        <p className="text-sm text-gray-400">
          Kamu bisa menutup halaman ini.
        </p>
      </div>
    </div>
  );
}

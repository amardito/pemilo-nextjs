import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900">Pemilo</h1>
        <p className="text-lg text-gray-600">
          Platform pemilihan digital untuk sekolah &amp; kampus.
          Aman, rahasia, mudah digunakan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Masuk sebagai Panitia
          </Link>
        </div>
        <p className="text-xs text-gray-400">
          Pemilih? Gunakan link event dari panitia.
        </p>
      </div>
    </div>
  );
}

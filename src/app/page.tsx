import Link from "next/link";

const features = [
  {
    icon: "🔒",
    title: "Aman & Rahasia",
    desc: "Setiap pemilih mendapat token unik satu-kali-pakai. Suara tidak dapat dilacak ke identitas pemilih.",
  },
  {
    icon: "⚡",
    title: "Realtime Dashboard",
    desc: "Pantau perolehan suara langsung tanpa perlu refresh. Grafik live update setiap 2 detik.",
  },
  {
    icon: "📋",
    title: "Import Massal",
    desc: "Upload data pemilih via CSV sekaligus hingga ribuan baris. Tidak perlu input satu per satu.",
  },
  {
    icon: "🎯",
    title: "Token Otomatis",
    desc: "Sistem generate dan distribusikan token voting ke seluruh pemilih dalam satu klik.",
  },
  {
    icon: "📊",
    title: "Ekspor Hasil",
    desc: "Download rekap absensi & hasil voting format CSV, siap lampirkan ke laporan kepanitiaan.",
  },
  {
    icon: "📱",
    title: "Pemilih Bisa dari HP",
    desc: "Antarmuka publik responsif — pemilih cukup buka link, masukkan token, dan pilih.",
  },
];

const steps = [
  { num: "01", title: "Buat Event", desc: "Isi nama, tanggal buka & tutup, dan paket pemilih yang dibutuhkan." },
  { num: "02", title: "Tambah Paslon", desc: "Input pasangan calon beserta foto, visi, misi, dan anggota tim." },
  { num: "03", title: "Import Pemilih", desc: "Upload CSV berisi nama, NIM, dan kelas. Sistem validasi otomatis." },
  { num: "04", title: "Generate Token", desc: "Satu klik, semua pemilih mendapat token unik yang siap disebarkan." },
  { num: "05", title: "Buka Voting", desc: "Aktifkan event — pemilih langsung bisa mengakses link voting." },
  { num: "06", title: "Pantau & Tutup", desc: "Lihat live turnout di dashboard, tutup event saat waktu habis." },
];

const plans = [
  {
    name: "Free",
    price: "Gratis",
    sub: "selamanya",
    highlight: false,
    voters: "Maks. 100 pemilih",
    features: ["1 event aktif", "Import CSV", "Token generator", "Dashboard realtime", "Ekspor hasil"],
    cta: "Mulai Gratis",
    href: "/login",
  },
  {
    name: "Starter",
    price: "Rp 49.000",
    sub: "per event",
    highlight: true,
    voters: "Maks. 500 pemilih",
    features: ["1 event aktif", "Import CSV", "Token generator", "Dashboard realtime", "Ekspor hasil", "Prioritas support"],
    cta: "Pilih Starter",
    href: "/login",
  },
  {
    name: "Pro",
    price: "Rp 99.000",
    sub: "per event",
    highlight: false,
    voters: "Maks. 2.000 pemilih",
    features: ["1 event aktif", "Import CSV", "Token generator", "Dashboard realtime", "Ekspor hasil", "Prioritas support", "Audit log lengkap"],
    cta: "Pilih Pro",
    href: "/login",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-blue-600 tracking-tight">Pemilo</span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-blue-600 transition-colors">Cara Kerja</a>
            <a href="#harga" className="hover:text-blue-600 transition-colors">Harga</a>
          </nav>
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-28 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.07)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl space-y-6">
          <div className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 ring-1 ring-white/20">
            🗳️ Platform Pemilihan Digital
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Pemilihan Kampus <br className="hidden sm:block" />
            <span className="text-blue-200">Tanpa Ribet.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-blue-100">
            Pemilo membantu panitia OSIS, BEM, dan organisasi kampus mengelola pemilihan digital yang aman, transparan, dan bisa dipantau secara langsung.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/login"
              className="rounded-lg bg-white px-7 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-lg"
            >
              Buat Event Sekarang →
            </Link>
            <a
              href="#cara-kerja"
              className="rounded-lg border border-white/30 px-7 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Lihat Cara Kerja
            </a>
          </div>
          <p className="text-xs text-blue-200">Gratis untuk hingga 100 pemilih. Tidak perlu kartu kredit.</p>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-y border-gray-100 bg-gray-50 py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 text-sm text-gray-500">
          <span>✅ Token satu-kali-pakai</span>
          <span>✅ Tidak perlu install aplikasi</span>
          <span>✅ Bisa ratusan pemilih sekaligus</span>
          <span>✅ Live dashboard</span>
          <span>✅ Ekspor CSV otomatis</span>
        </div>
      </div>

      {/* Features */}
      <section id="fitur" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Semua yang Kamu Butuhkan</h2>
            <p className="mt-3 text-gray-500">Dirancang khusus untuk panitia pemilihan — dari skala kelas hingga universitas.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Cara Kerjanya Simpel</h2>
            <p className="mt-3 text-gray-500">Dari setup hingga pengumuman hasil, semua selesai dalam hitungan menit.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Harga Transparan</h2>
            <p className="mt-3 text-gray-500">Bayar per event, bukan per bulan. Tidak ada biaya tersembunyi.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-7 flex flex-col ${
                  p.highlight
                    ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                {p.highlight && (
                  <div className="mb-3 self-start rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-white">
                    Paling Populer
                  </div>
                )}
                <div className="mb-1 text-sm font-medium opacity-75">{p.name}</div>
                <div className="text-3xl font-extrabold">{p.price}</div>
                <div className={`text-xs mb-4 ${p.highlight ? "text-blue-100" : "text-gray-400"}`}>{p.sub}</div>
                <div className={`mb-5 text-sm font-semibold ${p.highlight ? "text-blue-100" : "text-blue-600"}`}>{p.voters}</div>
                <ul className="space-y-2 mb-8 flex-1">
                  {p.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2 text-sm ${p.highlight ? "text-blue-50" : "text-gray-600"}`}>
                      <span className={p.highlight ? "text-white" : "text-blue-500"}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-center transition-colors ${
                    p.highlight
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="text-3xl font-bold">Siap Gelar Pemilihan?</h2>
          <p className="text-blue-100">Daftar gratis sekarang dan buat event pertamamu dalam 5 menit.</p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-lg"
          >
            Mulai Gratis →
          </Link>
          <p className="text-xs text-blue-200">Pemilih? Gunakan link event dari panitia.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Pemilo. Platform pemilihan digital untuk sekolah &amp; kampus.
      </footer>
    </div>
  );
}

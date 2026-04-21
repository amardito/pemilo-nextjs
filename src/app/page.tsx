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
    voters: "Maks. 30 pemilih",
    features: ["1 event aktif", "Maks. 2 paslon", "Import CSV", "Token generator", "Dashboard realtime", "Ekspor hasil"],
    cta: "Mulai Gratis",
    href: "/login",
  },
  {
    name: "Starter",
    price: "Rp 79.000 / event",
    sub: "sekali bayar",
    highlight: true,
    voters: "Maks. 200 pemilih",
    features: ["1 event aktif", "Maks. 6 paslon", "Import CSV", "Token generator", "Dashboard realtime", "Ekspor hasil", "Prioritas support"],
    cta: "Pilih Starter",
    href: "/login",
  },
  {
    name: "Pro",
    price: "Rp 149.000 / event",
    sub: "sekali bayar",
    highlight: false,
    voters: "Maks. 1.500 pemilih",
    features: ["1 event aktif", "Maks. 12 paslon", "Import CSV", "Token generator", "Dashboard realtime", "Ekspor hasil", "Prioritas support", "Audit log lengkap"],
    cta: "Pilih Pro",
    href: "/login",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0E26] text-[#e8eaf6] font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#2E4CA6]/30 bg-[#0A0E26]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-extrabold tracking-tight text-[#EAF205]">Pemilo</span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-[#5983D9]">
            <a href="#fitur" className="hover:text-[#EAF205] transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-[#EAF205] transition-colors">Cara Kerja</a>
            <a href="#harga" className="hover:text-[#EAF205] transition-colors">Harga</a>
          </nav>
          <Link
            href="/login"
            className="rounded-lg bg-[#EAF205] px-4 py-2 text-sm font-semibold text-[#0A0E26] hover:bg-yellow-300 transition-colors shadow-[0_0_16px_rgba(234,242,5,0.2)]"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-32 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(89,131,217,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(46,76,166,0.1)_0%,_transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl space-y-6">
          <div className="inline-block rounded-full bg-[#121D59] border border-[#2E4CA6] px-4 py-1.5 text-sm font-medium text-[#5983D9]">
            🗳️ Platform Pemilihan Digital
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Pemilihan Kampus{" "}
            <br className="hidden sm:block" />
            <span className="text-[#EAF205]">Tanpa Ribet.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-[#5983D9]">
            Pemilo membantu panitia OSIS, BEM, dan organisasi kampus mengelola pemilihan digital yang aman, transparan, dan bisa dipantau secara langsung.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/login"
              className="rounded-lg bg-[#EAF205] px-7 py-3 text-sm font-semibold text-[#0A0E26] hover:bg-yellow-300 transition-colors shadow-[0_0_24px_rgba(234,242,5,0.3)]"
            >
              Buat Event Sekarang →
            </Link>
            <a
              href="#cara-kerja"
              className="rounded-lg border border-[#2E4CA6] px-7 py-3 text-sm font-medium text-[#5983D9] hover:bg-[#121D59] transition-colors"
            >
              Lihat Cara Kerja
            </a>
          </div>
          <p className="text-xs text-[#5983D9]/70">Gratis untuk hingga 30 pemilih. Tidak perlu kartu kredit.</p>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-y border-[#2E4CA6]/30 bg-[#121D59]/40 py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 text-sm text-[#5983D9]">
          <span>✅ Token satu-kali-pakai</span>
          <span>✅ Tidak perlu install aplikasi</span>
          <span>✅ Dukung hingga 1.500 pemilih</span>
          <span>✅ Live dashboard</span>
          <span>✅ Ekspor CSV otomatis</span>
        </div>
      </div>

      {/* Features */}
      <section id="fitur" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#e8eaf6]">Semua yang Kamu Butuhkan</h2>
            <p className="mt-3 text-[#5983D9]">Dirancang khusus untuk panitia pemilihan — dari skala kelas hingga universitas.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[#2E4CA6]/40 bg-[#121D59]/60 p-6 shadow-lg hover:border-[#5983D9]/60 hover:bg-[#121D59] transition-all duration-200"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="font-semibold text-[#e8eaf6]">{f.title}</h3>
                <p className="mt-1 text-sm text-[#5983D9] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="bg-[#121D59]/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#e8eaf6]">Cara Kerjanya Simpel</h2>
            <p className="mt-3 text-[#5983D9]">Dari setup hingga pengumuman hasil, semua selesai dalam hitungan menit.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#EAF205] text-[#0A0E26] flex items-center justify-center text-xs font-bold shadow-[0_0_12px_rgba(234,242,5,0.3)]">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-[#e8eaf6]">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-[#5983D9] leading-relaxed">{s.desc}</p>
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
            <h2 className="text-3xl font-bold text-[#e8eaf6]">Harga Transparan</h2>
            <p className="mt-3 text-[#5983D9]">Bayar per event, bukan per bulan. Tidak ada biaya tersembunyi.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-7 flex flex-col transition-all duration-200 ${
                  p.highlight
                    ? "border-[#EAF205] bg-[#121D59] shadow-[0_0_40px_rgba(234,242,5,0.15)] scale-105"
                    : "border-[#2E4CA6]/40 bg-[#121D59]/60 hover:border-[#2E4CA6]"
                }`}
              >
                {p.highlight && (
                  <div className="mb-3 self-start rounded-full bg-[#EAF205]/10 border border-[#EAF205]/30 px-3 py-0.5 text-xs font-semibold text-[#EAF205]">
                    Paling Populer
                  </div>
                )}
                <div className="mb-1 text-sm font-medium text-[#5983D9]">{p.name}</div>
                <div className="text-3xl font-extrabold text-[#e8eaf6]">{p.price}</div>
                <div className="text-xs mb-4 text-[#5983D9]/70">{p.sub}</div>
                <div className={`mb-5 text-sm font-semibold ${p.highlight ? "text-[#EAF205]" : "text-[#5983D9]"}`}>
                  {p.voters}
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-[#5983D9]">
                      <span className={p.highlight ? "text-[#EAF205]" : "text-[#5983D9]"}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-center transition-colors ${
                    p.highlight
                      ? "bg-[#EAF205] text-[#0A0E26] hover:bg-yellow-300 shadow-[0_0_16px_rgba(234,242,5,0.25)]"
                      : "bg-[#2E4CA6] text-[#e8eaf6] hover:bg-[#5983D9]"
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
      <section className="relative overflow-hidden bg-[#121D59] border-y border-[#2E4CA6]/40 px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,242,5,0.05)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <h2 className="text-3xl font-bold text-[#e8eaf6]">Siap Gelar Pemilihan?</h2>
          <p className="text-[#5983D9]">Daftar gratis sekarang dan buat event pertamamu dalam 5 menit.</p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-[#EAF205] px-8 py-3 text-sm font-semibold text-[#0A0E26] hover:bg-yellow-300 transition-colors shadow-[0_0_24px_rgba(234,242,5,0.3)]"
          >
            Mulai Gratis →
          </Link>
          <p className="text-xs text-[#5983D9]/70">Pemilih? Gunakan link event dari panitia.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2E4CA6]/30 bg-[#0A0E26] px-6 py-8 text-center text-xs text-[#5983D9]/60">
        © {new Date().getFullYear()} Pemilo. Platform pemilihan digital untuk sekolah &amp; kampus.
      </footer>
    </div>
  );
}

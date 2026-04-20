import Link from "next/link";
import styles from "../role-page.module.css";

export default function VoterPage() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.card}>
        <header className={styles.header}>
          <h1>Halaman Pemilih</h1>
          <p>Fitur awal untuk pemilih melakukan proses pemungutan suara.</p>
        </header>
        <ul className={styles.list}>
          <li>Masuk dengan akun pemilih yang valid.</li>
          <li>Lihat daftar kandidat yang tersedia.</li>
          <li>Kirimkan suara ke kandidat pilihan.</li>
        </ul>
        <Link className={styles.link} href="/">
          ← Kembali ke beranda
        </Link>
      </main>
    </div>
  );
}

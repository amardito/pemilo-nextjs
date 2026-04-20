import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Pemilo</h1>
          <p>Mulai implementasi aplikasi pemilihan untuk Admin dan Pemilih.</p>
        </div>
        <section className={styles.grid}>
          <Link className={styles.card} href="/admin">
            <h2>Panitia</h2>
            <p>Kelola event pemilihan, data kandidat, dan daftar pemilih.</p>
          </Link>
          <Link className={styles.card} href="/voter">
            <h2>Pemilih</h2>
            <p>Masuk ke sistem dan kirimkan suara untuk kandidat pilihan.</p>
          </Link>
        </section>
      </main>
    </div>
  );
}

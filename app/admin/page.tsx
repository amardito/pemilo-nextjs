import Link from "next/link";
import styles from "../role-page.module.css";

export default function AdminPage() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.card}>
        <header className={styles.header}>
          <h1>Dashboard Panitia</h1>
          <p>Fitur awal untuk pengelolaan proses pemilihan.</p>
        </header>
        <ul className={styles.list}>
          <li>Kelola event pemilihan.</li>
          <li>Kelola kandidat pada setiap event.</li>
          <li>Kelola daftar pemilih yang berhak memilih.</li>
        </ul>
        <Link className={styles.link} href="/">
          ← Kembali ke beranda
        </Link>
      </main>
    </div>
  );
}

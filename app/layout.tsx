import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pemilo",
  description: "Platform pemilihan untuk panitia dan pemilih",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useLogin, useRegister } from "@/lib/queries/events";
import { setToken, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import type { AuthResponse } from "@/lib/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();
  const register = useRegister();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        const res = await register.mutateAsync({ email, password, name });
        const auth = res.data as AuthResponse;
        setToken(auth.token);
      } else {
        const res = await login.mutateAsync({ email, password });
        const auth = res.data as AuthResponse;
        setToken(auth.token);
      }
      router.push("/admin/events");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E26] md:grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-[#121D59] border-r border-[#2E4CA6]/40 p-10 text-[#e8eaf6]">
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-[#EAF205]">Pemilo</p>
          <p className="mt-3 text-sm text-[#5983D9]">Platform pemilihan digital yang aman dan mudah digunakan.</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold leading-tight text-[#e8eaf6]">Kelola pemilihan kampus dari satu dashboard</h2>
          <ul className="space-y-2 text-sm text-[#5983D9]">
            <li>• Generate token unik satu-kali-pakai</li>
            <li>• Pantau turnout dan hasil secara realtime</li>
            <li>• Rekap hasil siap ekspor CSV</li>
          </ul>
        </div>
        <p className="text-xs text-[#5983D9]/60">© {new Date().getFullYear()} Pemilo</p>
      </div>

      <div className="flex items-center justify-center px-4 py-8 md:px-8 bg-[#0A0E26]">
        <div className="w-full max-w-md rounded-2xl bg-[#121D59] border border-[#2E4CA6]/40 p-6 shadow-2xl shadow-black/40 md:p-8">
          <div className="mb-6 text-center md:hidden">
            <p className="text-xl font-extrabold text-[#EAF205]">Pemilo</p>
          </div>

          <div className="mb-5 rounded-xl bg-[#0A0E26] border border-[#2E4CA6]/40 p-1" role="tablist" aria-label="Mode autentikasi">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                role="tab"
                aria-selected={!isRegister}
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  !isRegister ? "bg-[#2E4CA6] text-[#e8eaf6] shadow-sm" : "text-[#5983D9] hover:text-[#e8eaf6]"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isRegister}
                onClick={() => {
                  setIsRegister(true);
                  setError("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isRegister ? "bg-[#2E4CA6] text-[#e8eaf6] shadow-sm" : "text-[#5983D9] hover:text-[#e8eaf6]"
                }`}
              >
                Daftar
              </button>
            </div>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#e8eaf6]">{isRegister ? "Buat Akun Panitia" : "Masuk ke Dashboard"}</h1>
            <p className="mt-1 text-sm text-[#5983D9]">
              {isRegister ? "Daftarkan akun untuk mulai membuat event" : "Lanjutkan untuk mengelola event pemilihan"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-[#5983D9] mb-1">
                  Nama
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#5983D9] mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5983D9] mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 text-[#5983D9] hover:text-[#e8eaf6]"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-300 bg-red-900/30 border border-red-600/30 p-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={login.isPending || register.isPending}
            >
              {login.isPending || register.isPending
                ? "Memproses..."
                : isRegister
                ? "Daftar"
                : "Masuk"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

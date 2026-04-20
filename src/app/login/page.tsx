"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useLogin, useRegister } from "@/lib/queries/events";
import { setToken, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthResponse } from "@/lib/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Pemilo</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isRegister ? "Buat akun panitia" : "Masuk sebagai panitia"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
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

        <p className="text-center text-sm text-gray-500">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isRegister ? "Masuk" : "Daftar"}
          </button>
        </p>
      </div>
    </div>
  );
}

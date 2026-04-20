"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VotePrepareResponse } from "@/lib/types";

export default function VoterLoginPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = (await api.public.prepare(eventId, {
        token: token.toUpperCase(),
        nim,
      })) as VotePrepareResponse;

      // Store vote session in sessionStorage
      sessionStorage.setItem(
        `pemilo_vote_${eventId}`,
        JSON.stringify({
          token: token.toUpperCase(),
          nim,
          voter_display: res.voter_display,
          slates: res.slates,
        })
      );

      router.push(`/e/${eventId}/vote`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Login Pemilih</h1>
          <p className="mt-1 text-sm text-gray-500">
            Masukkan token dan NIM untuk memilih
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token
            </label>
            <Input
              value={token}
              onChange={(e) =>
                setToken(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 8)
                )
              }
              placeholder="8 karakter (huruf & angka)"
              maxLength={8}
              className="font-mono tracking-widest text-center text-lg uppercase"
              autoFocus
              required
            />
            <p className="mt-1 text-xs text-gray-400">8 karakter, huruf/angka</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIM
            </label>
            <Input
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Masukkan NIM"
              maxLength={50}
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
            disabled={loading || token.length !== 8}
          >
            {loading ? "Memverifikasi..." : "Lanjutkan"}
          </Button>
        </form>
      </div>
    </div>
  );
}

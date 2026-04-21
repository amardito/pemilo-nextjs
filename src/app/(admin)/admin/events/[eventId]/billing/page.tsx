"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useEvent } from "@/lib/queries/events";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Event, PackageType, UpgradeResponse, ApiSuccessResponse } from "@/lib/types";
import { PACKAGE_LIMITS } from "@/lib/types";
import { Check } from "lucide-react";

const packages: { key: PackageType; label: string }[] = [
  { key: "FREE", label: "Free" },
  { key: "STARTER", label: "Starter" },
  { key: "PRO", label: "Pro" },
];

export default function BillingPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data, isLoading } = useEvent(eventId);
  const event = data?.data as Event | undefined;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) return <p className="text-[#A69A97]">Memuat...</p>;
  if (!event) return <p className="text-red-400">Event tidak ditemukan</p>;

  async function handleUpgrade(pkg: PackageType) {
    setLoading(true);
    setError("");
    try {
      const res = (await api.payment.upgrade(eventId, pkg)) as ApiSuccessResponse<UpgradeResponse>;
      if (res.data?.payment_url) {
        // Keep button disabled — page is redirecting to payment gateway.
        window.location.href = res.data.payment_url;
        return;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Gagal memproses upgrade");
      }
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold text-[#FAF0EB]">Billing</h1>

      <div className="rounded-2xl border border-[#F26241]/30 bg-[#321F14] p-6">
        <p className="text-sm text-[#A69A97]">
          Paket saat ini: <span className="font-semibold text-[#FAF0EB]">{event.package}</span>
        </p>
        <p className="text-sm text-[#A69A97]/70 mt-1">
          Max {event.max_slates} pasangan &middot; Max {event.max_voters} pemilih
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-900/30 border border-red-600/30 p-3 rounded-xl">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {packages.map(({ key, label }) => {
          const limits = PACKAGE_LIMITS[key];
          const isCurrent = event.package === key;

          return (
            <div
              key={key}
              className={`rounded-2xl border p-5 transition-all ${
                isCurrent
                  ? "border-[#F26241]/60 bg-[#321F14] shadow-[0_0_20px_rgba(242,98,65,0.1)]"
                  : "border-[#F26241]/20 bg-[#321F14]/60"
              }`}
            >
              <h3 className="font-semibold text-[#FAF0EB] text-lg">{label}</h3>
              <p className="text-2xl font-bold mt-2 text-[#F26241]">
                {limits.price === 0 ? "Gratis" : `Rp${limits.price.toLocaleString("id-ID")}`}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#A69A97]">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  Max {limits.maxSlates} pasangan
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  Max {limits.maxVoters} pemilih
                </li>
              </ul>

              {isCurrent ? (
                <p className="mt-4 text-sm text-[#F26241] font-medium">Paket aktif</p>
              ) : key !== "FREE" ? (
                <Button
                  className="mt-4 w-full"
                  size="sm"
                  onClick={() => handleUpgrade(key)}
                  disabled={loading}
                >
                  {loading ? "Memproses..." : `Upgrade ke ${label}`}
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

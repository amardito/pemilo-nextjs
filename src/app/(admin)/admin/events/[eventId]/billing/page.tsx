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

  if (isLoading) return <p className="text-[#5983D9]">Memuat...</p>;
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
      <h1 className="text-xl font-bold text-[#e8eaf6]">Billing</h1>

      <div className="rounded-2xl border border-[#2E4CA6]/40 bg-[#121D59] p-6">
        <p className="text-sm text-[#5983D9]">
          Paket saat ini: <span className="font-semibold text-[#e8eaf6]">{event.package}</span>
        </p>
        <p className="text-sm text-[#5983D9]/70 mt-1">
          Max {event.max_slates} paslon &middot; Max {event.max_voters} pemilih
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
                  ? "border-[#EAF205]/40 bg-[#121D59] shadow-[0_0_20px_rgba(234,242,5,0.1)]"
                  : "border-[#2E4CA6]/40 bg-[#121D59]/60"
              }`}
            >
              <h3 className="font-semibold text-[#e8eaf6] text-lg">{label}</h3>
              <p className="text-2xl font-bold mt-2 text-[#EAF205]">
                {limits.price === 0 ? "Gratis" : `Rp${limits.price.toLocaleString("id-ID")}`}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#5983D9]">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  Max {limits.maxSlates} paslon
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  Max {limits.maxVoters} pemilih
                </li>
              </ul>

              {isCurrent ? (
                <p className="mt-4 text-sm text-[#EAF205] font-medium">Paket aktif</p>
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

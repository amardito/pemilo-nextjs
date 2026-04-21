"use client";

import { useParams } from "next/navigation";
import { useStatsWS } from "@/lib/hooks/useStatsWS";
import { useEvent } from "@/lib/queries/events";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Event } from "@/lib/types";

const COLORS = ["#F26241", "#F29580", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export default function DashboardPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: eventData } = useEvent(eventId);
  const { stats, status } = useStatsWS(eventId);

  const event = eventData?.data as Event | undefined;

  if (!stats) {
    return <p className="text-[#A69A97]">Memuat dashboard...</p>;
  }

  const turnoutPercent =
    stats.total_voters > 0
      ? Math.round((stats.voted_count / stats.total_voters) * 100)
      : 0;

  const chartData = stats.votes_by_slate.map((s) => ({
    name: `#${s.number} ${s.name}`,
    votes: s.votes,
  }));

  const dotClassMap: Record<string, string> = {
    open: "inline-block w-2 h-2 rounded-full bg-emerald-400",
    connecting: "inline-block w-2 h-2 rounded-full bg-[#F26241] animate-pulse",
    closed: "inline-block w-2 h-2 rounded-full bg-red-400",
    error: "inline-block w-2 h-2 rounded-full bg-red-400",
  };
  const statusLabelMap: Record<string, string> = {
    open: "Live",
    connecting: "Menghubungkan…",
    closed: "Terputus – mencoba kembali",
    error: "Terputus – mencoba kembali",
  };
  const dotClass = dotClassMap[status] ?? dotClassMap["error"];
  const statusLabel = statusLabelMap[status] ?? statusLabelMap["error"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#FAF0EB]">Dashboard</h1>
        {event && <StatusBadge status={event.status} />}
        <span className="text-xs ml-auto flex items-center gap-1">
          <span className={dotClass} />
          <span className="text-[#A69A97]/70">{statusLabel}</span>
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Pemilih" value={stats.total_voters} />
        <SummaryCard label="Sudah Memilih" value={stats.voted_count} color="text-emerald-400" />
        <SummaryCard label="Belum Memilih" value={stats.not_voted_count} color="text-[#A69A97]" />
        <SummaryCard label="Turnout" value={`${turnoutPercent}%`} color="text-[#F26241]" />
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-[#F26241]/30 bg-[#321F14] p-4">
        <h2 className="font-semibold text-[#FAF0EB] mb-4">Perolehan Suara</h2>
        {chartData.length === 0 ? (
          <p className="text-[#A69A97] text-sm">Belum ada suara masuk</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F26241" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#A69A97" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#A69A97" }} />
              <Tooltip
                contentStyle={{ background: "#261C16", border: "1px solid #F26241", borderRadius: "8px", color: "#FAF0EB" }}
                labelStyle={{ color: "#F26241" }}
              />
              <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Turnout progress */}
      <div className="rounded-2xl border border-[#F26241]/30 bg-[#321F14] p-4">
        <h2 className="font-semibold text-[#FAF0EB] mb-2">Turnout</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-[#261C16] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F26241] transition-all duration-500 shadow-[0_0_8px_rgba(242,98,65,0.4)]"
              style={{ width: `${turnoutPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[#A69A97] w-16 text-right">
            {stats.voted_count}/{stats.total_voters}
          </span>
        </div>
      </div>

      {/* Latest voters */}
      <div className="rounded-2xl border border-[#F26241]/30 bg-[#321F14] p-4">
        <h2 className="font-semibold text-[#FAF0EB] mb-3">Terakhir Memilih</h2>
        {stats.latest_voters.length === 0 ? (
          <p className="text-sm text-[#A69A97]">Belum ada yang memilih</p>
        ) : (
          <ul className="divide-y divide-[#F26241]/20">
            {stats.latest_voters.map((v, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="text-[#FAF0EB]">
                  {v.full_name}
                  {v.class_name && (
                    <span className="text-[#A69A97] ml-2">({v.class_name})</span>
                  )}
                </span>
                <span className="text-[#A69A97]/60 text-xs">
                  {new Date(v.voted_at).toLocaleTimeString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = "text-[#FAF0EB]",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#F26241]/30 bg-[#321F14] p-4">
      <p className="text-xs text-[#A69A97] uppercase font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

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
  LabelList,
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

  const totalVotes = stats.votes_by_slate.reduce((sum, s) => sum + s.votes, 0);

  const chartData = stats.votes_by_slate.map((s) => ({
    name: `#${s.number} ${s.name}`,
    votes: s.votes,
    percent: totalVotes > 0 ? Math.round((s.votes / totalVotes) * 100) : 0,
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
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
              barCategoryGap="35%"
              maxBarSize={120}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F26241" opacity={0.15} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#A69A97" }}
                axisLine={{ stroke: "#F26241", opacity: 0.3 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#A69A97", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(242,98,65,0.08)" }} />
              <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
                <LabelList
                  dataKey="votes"
                  position="top"
                  style={{ fill: "#FAF0EB", fontSize: 13, fontWeight: 600 }}
                />
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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; payload: { percent: number } }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  const value = item.value;
  const percent = item.payload.percent;
  return (
    <div className="rounded-xl border border-[#F26241]/60 bg-[#1e130e] px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-[#F26241] mb-1">{label}</p>
      <p className="text-sm text-[#FAF0EB]">
        <span className="text-[#A69A97]">Suara: </span>
        <span className="font-bold">{value.toLocaleString("id-ID")}</span>
      </p>
      <p className="text-sm text-[#FAF0EB]">
        <span className="text-[#A69A97]">Persentase: </span>
        <span className="font-bold">{percent}%</span>
      </p>
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

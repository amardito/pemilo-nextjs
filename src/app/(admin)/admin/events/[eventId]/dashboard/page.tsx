"use client";

import { useParams } from "next/navigation";
import { useStats } from "@/lib/queries/stats";
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

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export default function DashboardPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: eventData } = useEvent(eventId);
  const { data: stats, isLoading } = useStats(eventId, 3000);

  const event = eventData?.data as Event | undefined;

  if (isLoading || !stats) {
    return <p className="text-gray-500">Memuat dashboard...</p>;
  }

  const turnoutPercent =
    stats.total_voters > 0
      ? Math.round((stats.voted_count / stats.total_voters) * 100)
      : 0;

  const chartData = stats.votes_by_slate.map((s) => ({
    name: `#${s.number} ${s.name}`,
    votes: s.votes,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        {event && <StatusBadge status={event.status} />}
        <span className="text-xs text-gray-400 ml-auto">
          Auto-refresh 3 detik
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Pemilih" value={stats.total_voters} />
        <SummaryCard label="Sudah Memilih" value={stats.voted_count} color="text-green-600" />
        <SummaryCard label="Belum Memilih" value={stats.not_voted_count} color="text-gray-500" />
        <SummaryCard label="Turnout" value={`${turnoutPercent}%`} color="text-blue-600" />
      </div>

      {/* Bar chart */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Perolehan Suara</h2>
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada suara masuk</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
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
      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold text-gray-900 mb-2">Turnout</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${turnoutPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 w-16 text-right">
            {stats.voted_count}/{stats.total_voters}
          </span>
        </div>
      </div>

      {/* Latest voters */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Terakhir Memilih</h2>
        {stats.latest_voters.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada yang memilih</p>
        ) : (
          <ul className="divide-y">
            {stats.latest_voters.map((v, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span>
                  {v.full_name}
                  {v.class_name && (
                    <span className="text-gray-400 ml-2">({v.class_name})</span>
                  )}
                </span>
                <span className="text-gray-400 text-xs">
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
  color = "text-gray-900",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

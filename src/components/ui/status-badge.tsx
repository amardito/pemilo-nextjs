import { cn } from "@/lib/cn";
import type { EventStatus } from "@/lib/types";

const statusStyles: Record<EventStatus, string> = {
  DRAFT: "bg-[#121D59] text-[#5983D9] border border-[#2E4CA6]",
  SCHEDULED: "bg-yellow-900/30 text-yellow-300 border border-yellow-600/40",
  OPEN: "bg-emerald-900/30 text-emerald-300 border border-emerald-600/40",
  CLOSED: "bg-red-900/30 text-red-300 border border-red-600/40",
  LOCKED: "bg-purple-900/30 text-purple-300 border border-purple-600/40",
};

export function StatusBadge({
  status,
  className,
}: {
  status: EventStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}

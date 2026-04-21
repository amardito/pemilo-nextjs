import { cn } from "@/lib/cn";
import type { EventStatus } from "@/lib/types";

const statusStyles: Record<EventStatus, string> = {
  DRAFT: "bg-[#321F14] text-[#A69A97] border border-[#F26241]/40",
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

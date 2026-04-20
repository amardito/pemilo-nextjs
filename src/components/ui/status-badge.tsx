import { cn } from "@/lib/cn";
import type { EventStatus } from "@/lib/types";

const statusStyles: Record<EventStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SCHEDULED: "bg-yellow-100 text-yellow-800",
  OPEN: "bg-green-100 text-green-800",
  CLOSED: "bg-red-100 text-red-800",
  LOCKED: "bg-purple-100 text-purple-800",
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

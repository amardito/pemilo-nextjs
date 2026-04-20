"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/lib/queries/events";
import { clearToken } from "@/lib/api";
import { LayoutDashboard, Users, BarChart3, FileText, CreditCard, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

function navItems(eventId: string) {
  return [
    { href: `/admin/events/${eventId}/setup`, label: "Setup", icon: Settings },
    { href: `/admin/events/${eventId}/slates`, label: "Paslon", icon: Users },
    { href: `/admin/events/${eventId}/voters`, label: "Pemilih", icon: FileText },
    { href: `/admin/events/${eventId}/dashboard`, label: "Dashboard", icon: BarChart3 },
    { href: `/admin/events/${eventId}/exports`, label: "Export", icon: LayoutDashboard },
    { href: `/admin/events/${eventId}/billing`, label: "Billing", icon: CreditCard },
  ];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && isError) {
      router.push("/login");
    }
  }, [mounted, isLoading, isError, router]);

  if (!mounted || isLoading) {
    return (
      <div suppressHydrationWarning className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (isError) return null;

  // Extract eventId from pathname
  const match = pathname.match(/\/admin\/events\/([^/]+)/);
  const eventId = match?.[1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/admin/events" className="font-bold text-lg text-blue-600">
            Pemilo
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {data?.data?.name}
            </span>
            <button
              onClick={() => {
                clearToken();
                router.push("/login");
              }}
              className="text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl flex">
        {/* Sidebar (event-level pages only) */}
        {eventId && (
          <aside className="hidden md:flex w-52 flex-col gap-1 border-r bg-white p-3 min-h-[calc(100vh-3.5rem)]">
            {navItems(eventId).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

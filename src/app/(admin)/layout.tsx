"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEvent, useMe } from "@/lib/queries/events";
import { clearToken } from "@/lib/api";
import { Users, BarChart3, FileText, CreditCard, Settings, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function navItems(eventId: string) {
  return [
    { href: `/admin/events/${eventId}/setup`, label: "Setup", icon: Settings },
    { href: `/admin/events/${eventId}/slates`, label: "Paslon", icon: Users },
    { href: `/admin/events/${eventId}/voters`, label: "Pemilih", icon: FileText },
    { href: `/admin/events/${eventId}/dashboard`, label: "Dashboard", icon: BarChart3 },
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { data, isLoading, isError } = useMe();
  const match = pathname.match(/\/admin\/events\/([^/]+)/);
  const eventId = match?.[1];
  const { data: eventData } = useEvent(eventId ?? "");
  const currentEventTitle = eventData?.data?.title;
  const sidebarItems = eventId ? navItems(eventId) : [];

  useEffect(() => {
    if (!isLoading && isError) {
      router.push("/login");
    }
  }, [isLoading, isError, router]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSidebarOpen]);

  if (isLoading) {
    return (
      <div suppressHydrationWarning className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (isError) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {eventId && (
              <button
                type="button"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Buka menu"
              >
                <Menu size={18} />
              </button>
            )}
            <Link href="/admin/events" className="font-bold text-lg text-blue-600">
              Pemilo
            </Link>
          </div>
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
          <aside className="hidden md:flex w-56 flex-col gap-1 border-r bg-white p-3 min-h-[calc(100vh-3.5rem)]">
            {currentEventTitle && (
              <div className="mb-2 rounded-lg bg-blue-50 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-blue-700">Event Aktif</p>
                <p className="line-clamp-2 text-sm font-semibold text-blue-900">{currentEventTitle}</p>
              </div>
            )}
            {sidebarItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-r-lg border-l-2 px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                      : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
        <main className="flex-1 p-3 md:p-6">{children}</main>
      </div>

      {eventId && mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Tutup menu"
          />
          <aside className="relative h-full w-72 max-w-[85vw] border-r bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-blue-600">Menu Event</p>
              <button
                type="button"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Tutup sidebar"
              >
                <X size={18} />
              </button>
            </div>
            {currentEventTitle && (
              <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-blue-700">Event Aktif</p>
                <p className="line-clamp-2 text-sm font-semibold text-blue-900">{currentEventTitle}</p>
              </div>
            )}
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-2 rounded-r-lg border-l-2 px-3 py-2 text-sm transition-colors ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                        : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

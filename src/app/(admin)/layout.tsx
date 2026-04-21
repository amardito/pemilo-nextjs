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
      <div suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-[#0A0E26]">
        <p className="text-[#5983D9]">Memuat...</p>
      </div>
    );
  }

  if (isError) return null;

  return (
    <div className="min-h-screen bg-[#0A0E26]">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-[#2E4CA6]/30 bg-[#0A0E26]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {eventId && (
              <button
                type="button"
                className="rounded-md p-2 text-[#5983D9] hover:bg-[#121D59] hover:text-[#e8eaf6] md:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Buka menu"
              >
                <Menu size={18} />
              </button>
            )}
            <Link href="/admin/events" className="font-extrabold text-lg text-[#EAF205] tracking-tight">
              Pemilo
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#5983D9]">
              {data?.data?.name}
            </span>
            <button
              onClick={() => {
                clearToken();
                router.push("/login");
              }}
              className="text-[#5983D9] hover:text-[#e8eaf6]"
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
          <aside className="hidden md:flex w-56 flex-col gap-1 border-r border-[#2E4CA6]/30 bg-[#0A0E26] p-3 min-h-[calc(100vh-3.5rem)]">
            {currentEventTitle && (
              <div className="mb-2 rounded-xl bg-[#121D59] border border-[#2E4CA6]/40 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-[#5983D9]">Event Aktif</p>
                <p className="line-clamp-2 text-sm font-semibold text-[#e8eaf6]">{currentEventTitle}</p>
              </div>
            )}
            {sidebarItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all duration-150 ${
                    active
                      ? "border-[#EAF205]/30 bg-[#121D59] text-[#EAF205] font-medium shadow-[0_0_12px_rgba(234,242,5,0.1)]"
                      : "border-transparent text-[#5983D9] hover:bg-[#121D59] hover:text-[#e8eaf6]"
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Tutup menu"
          />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-[#2E4CA6]/40 bg-[#0A0E26] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-extrabold text-[#EAF205]">Menu Event</p>
              <button
                type="button"
                className="rounded-md p-2 text-[#5983D9] hover:bg-[#121D59] hover:text-[#e8eaf6]"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Tutup sidebar"
              >
                <X size={18} />
              </button>
            </div>
            {currentEventTitle && (
              <div className="mb-3 rounded-xl bg-[#121D59] border border-[#2E4CA6]/40 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-[#5983D9]">Event Aktif</p>
                <p className="line-clamp-2 text-sm font-semibold text-[#e8eaf6]">{currentEventTitle}</p>
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
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all ${
                      active
                        ? "border-[#EAF205]/30 bg-[#121D59] text-[#EAF205] font-medium"
                        : "border-transparent text-[#5983D9] hover:bg-[#121D59] hover:text-[#e8eaf6]"
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

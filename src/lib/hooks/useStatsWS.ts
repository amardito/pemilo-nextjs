"use client";

import { useEffect, useRef, useState } from "react";
import type { StatsResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/** Convert http(s):// → ws(s):// keeping the rest of the URL intact. */
function toWsBase(apiBase: string): string {
  return apiBase.replace(/^http/, "ws");
}

type Status = "connecting" | "open" | "closed" | "error";

interface UseStatsWSResult {
  stats: StatsResponse | null;
  status: Status;
}

/**
 * Opens a WebSocket connection to GET /api/events/:eventId/stats/ws
 * and returns live stats pushed by the server every ~2 s.
 *
 * Reconnects automatically (exponential back-off, max 30 s) when the
 * connection drops. Closes cleanly when the component unmounts or eventId
 * changes (navigating away from the dashboard).
 */
export function useStatsWS(eventId: string): UseStatsWSResult {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [status, setStatus] = useState<Status>("connecting");
  // wsRef is only kept so we can call close() in the cleanup.
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!eventId) return;

    // Each effect invocation gets its OWN cancelled flag and delay counter.
    // This prevents a stale onclose from a previous WebSocket (e.g. React
    // StrictMode double-invoke) scheduling a reconnect after cleanup.
    let cancelled = false;
    let reconnectDelay = 1000;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      if (cancelled) return;

      const token =
        globalThis.window === undefined
          ? null
          : localStorage.getItem("pemilo_token");

      if (!token) {
        setStatus("error");
        return;
      }

      const url = `${toWsBase(API_BASE)}/events/${eventId}/stats/ws?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;
      setStatus("connecting");

      ws.onopen = () => {
        if (cancelled) { ws.close(); return; }
        setStatus("open");
        reconnectDelay = 1000; // reset back-off on success
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const data = JSON.parse(event.data as string) as Record<string, unknown>;
          if (data["error"]) {
            console.error("[useStatsWS] server error:", data["error"]);
            return;
          }
          setStats(data as unknown as StatsResponse);
        } catch (e) {
          console.error("[useStatsWS] parse error:", e);
        }
      };

      ws.onerror = () => {
        if (cancelled) return;
        setStatus("error");
      };

      ws.onclose = () => {
        // Use the closure-local `cancelled` flag — NOT a shared ref — so that
        // this handler can never accidentally fire for a stale connection after
        // a new effect invocation has already started.
        if (cancelled) return;
        setStatus("closed");
        const delay = Math.min(reconnectDelay, 30_000);
        reconnectDelay = delay * 2;
        reconnectTimer = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [eventId]);

  return { stats, status };
}


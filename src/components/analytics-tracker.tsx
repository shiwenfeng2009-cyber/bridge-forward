"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import { createClient } from "@/lib/supabase/client";

const VISITOR_KEY = "bridge-forward-anonymous-visitor";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { mode } = useLanguage();

  useEffect(() => {
    if (!pathname) return;
    const sessionKey = `bridge-view:${pathname}:${mode}`;
    if (sessionStorage.getItem(sessionKey)) return;
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, visitorId);
    }
    const width = window.innerWidth;
    const deviceClass = width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
    let referrerHost: string | null = null;
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : null; } catch {}
    try {
      createClient().from("page_views").insert({
        visitor_id: visitorId,
        path: pathname,
        language: mode,
        referrer_host: referrerHost,
        device_class: deviceClass,
      }).then(({ error }) => { if (!error) sessionStorage.setItem(sessionKey, "1"); });
    } catch {
      // Analytics must never make the public site unusable when browser-side
      // environment variables were omitted from a deployment artifact.
    }
  }, [pathname, mode]);

  return null;
}

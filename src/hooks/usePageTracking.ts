/**
 * GA4 Page View Tracking for React Router SPA
 * Fires a page_view event on every route change.
 *
 * Requires:
 *   1. gtag.js loaded in index.html
 *   2. VITE_GA_MEASUREMENT_ID set in .env (or .env.local)
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;

    window.gtag("config", GA_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}

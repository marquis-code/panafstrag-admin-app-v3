import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return;

  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || import.meta.env.VITE_BASE_URL;

  if (!apiBase) return;

  const pingBackend = () => {
    // Fire and forget lightweight ping to wake up the Render free-tier server
    fetch(`${apiBase}/health`, { method: 'GET', mode: 'no-cors' })
      .catch(() => { /* Ignore errors, just want to wake it up */ });
  };

  // 1. Eager wake-up on page load
  pingBackend();

  // 2. Keep-alive ping every 14 minutes (Render sleeps after 15 minutes of inactivity)
  const FOURTEEN_MINUTES = 14 * 60 * 1000;
  setInterval(pingBackend, FOURTEEN_MINUTES);
});

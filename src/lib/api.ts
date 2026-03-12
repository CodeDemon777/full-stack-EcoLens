const configuredApiBase = import.meta.env.VITE_API_BASE?.trim();

// Keep API calls same-origin by default; local dev uses Vite proxy for /api.
const defaultApiBase = new URL("/api", window.location.origin).toString();

export const API_BASE = (configuredApiBase || defaultApiBase).replace(/\/+$/, "");

const configuredApiBase = import.meta.env.VITE_API_BASE?.trim();

const defaultApiBase = import.meta.env.DEV
  ? `http://${window.location.hostname || "localhost"}:5000/api`
  : new URL("/api", window.location.origin).toString();

export const API_BASE = (configuredApiBase || defaultApiBase).replace(/\/+$/, "");

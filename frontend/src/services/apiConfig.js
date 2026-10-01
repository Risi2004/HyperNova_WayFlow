// Centralized API configuration for WayFlow
// In local development, defaults to http://localhost:5000/api
// In production (Vercel / Netlify), users often configure VITE_API_URL as:
// https://wayflow.onrender.com OR https://wayflow.onrender.com/api
// This helper auto-normalizes so both formats work seamlessly!
let rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '')

if (!rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`
}

export const API_BASE = rawBase


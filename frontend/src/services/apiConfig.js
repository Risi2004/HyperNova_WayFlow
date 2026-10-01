// Centralized API configuration for WayFlow
// In local development, defaults to http://localhost:5000/api
// In production (Vercel / Netlify), configure VITE_API_URL in project settings:
// e.g. https://wayflow-backend.onrender.com/api
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const API_BASE = rawBase.replace(/\/+$/, '')

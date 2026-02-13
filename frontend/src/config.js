let apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Ensure protocol exists, otherwise browser treats it as relative path
if (!apiUrl.startsWith("http")) {
  apiUrl = `https://${apiUrl}`;
}
export const API_URL = apiUrl.replace(/\/$/, "");

export const API_BASE_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:8888"
    : "/api"; // This will now properly route through nginx

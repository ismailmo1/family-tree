export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://fam-api.ismailmo.com"
    : "http://localhost:8001";

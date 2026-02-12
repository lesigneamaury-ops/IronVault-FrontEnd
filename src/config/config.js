// Configuration file - exports API base URL
// Uses environment variable VITE_API_URL from .env file, or defaults to local backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005/api";
export { API_URL };

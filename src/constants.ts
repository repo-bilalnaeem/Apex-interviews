export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

// Base URL for the application
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://folio3-internship-project.vercel.app"
    : "http://localhost:3000";

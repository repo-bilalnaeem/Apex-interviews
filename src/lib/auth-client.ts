import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // In browser, use the current origin (which includes the correct port)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  // Fallback for server-side
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

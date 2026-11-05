import "server-only";

/**
 * Public origin used in links sent by email. Never derived from the request's
 * Host header, so a forged header cannot point activation links elsewhere.
 */
export function getAppUrl(): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  throw new Error("Missing APP_URL");
}

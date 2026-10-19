/**
 * Route access model:
 * - Public routes: no session required
 * - Auth routes: sign-in/up flows; redirect to dashboard when already signed in
 * - Private routes: session required (pages and most API routes)
 */

export const DEFAULT_REDIRECT = "/dashboard";

export const authPrefix = "/api/auth";

/** Exact paths for auth pages (also matched by prefix below). */
export const authRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/auth/reset",
  "/auth/reset-password",
];

/** Page prefixes that require a signed-in user. */
export const privateRoutePrefixes = [
  "/dashboard",
  "/space/",
  "/buy-premium",
];

/**
 * API paths that are intentionally public (no session).
 * All other `/api/*` routes require authentication at the middleware layer.
 */
export const publicApiPrefixes = [authPrefix, "/api/update_feedback"];

/**
 * First URL segments reserved for app routes — not valid public space names.
 * Prevents `/dashboard` etc. from being treated as a space slug.
 */
export const reservedPathSegments = new Set([
  "dashboard",
  "space",
  "buy-premium",
  "auth",
  "api",
  "embed",
  "not-found",
  "404",
  "_next",
  "og",
]);

export function isAuthRoute(pathname: string): boolean {
  return (
    authRoutes.includes(pathname) ||
    pathname.startsWith("/auth/")
  );
}

export function isPrivatePageRoute(pathname: string): boolean {
  return privateRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix)
  );
}

export function isPublicApiRoute(pathname: string): boolean {
  return publicApiPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}`)
  );
}

/** Any `/api/*` route that is not explicitly public requires a session. */
export function isPrivateApiRoute(pathname: string): boolean {
  if (!pathname.startsWith("/api/")) {
    return false;
  }
  return !isPublicApiRoute(pathname);
}

export function requiresAuthentication(pathname: string): boolean {
  return isPrivatePageRoute(pathname) || isPrivateApiRoute(pathname);
}

export function isReservedSpaceSegment(segment: string): boolean {
  return reservedPathSegments.has(segment.toLowerCase());
}

/** @deprecated Use `isPrivatePageRoute` — kept for any external imports */
export const protectedRoutes = privateRoutePrefixes;

export function getSafeRedirectPath(path) {
  if (!path || typeof path !== "string") return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.startsWith("/login")) return null;

  return path;
}

export function buildLoginUrl(redirectPath) {
  const safePath = getSafeRedirectPath(redirectPath);

  if (!safePath) {
    return "/login";
  }

  return `/login?redirect=${encodeURIComponent(safePath)}`;
}

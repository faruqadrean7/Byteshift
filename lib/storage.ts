/**
 * Helpers for Public Media / Upload URLs.
 */
export function publicMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (path.startsWith("/")) {
    return path;
  }
  return `/${path.replace(/^\/+/, "")}`;
}

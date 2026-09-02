/**
 * Normalizes an arbitrary title into a URL-safe slug:
 * lowercase, spaces -> hyphens, strip special chars, collapse/trim hyphens.
 * e.g. "My New Teledrama!!" -> "my-new-teledrama"
 *
 * Pure function with zero dependencies so it can run identically on the
 * client (live preview while typing) and the server (source of truth).
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

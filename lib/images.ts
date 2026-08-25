/**
 * Resolves a `listing_images.storage_path` to something an `<img>`/`next/image`
 * can load.
 *
 * Rows may hold either a fully-qualified URL (what the upload path writes), a
 * root-relative path (the bundled placeholder art in `public/`), or a bare
 * object key inside the `listing-images` bucket (hand-inserted or seeded rows).
 */
const BUCKET = 'listing-images';

export const PLACEHOLDER_IMAGE = '/archive-desk.jpg';

export function resolveImageUrl(storagePath?: string | null): string {
  if (!storagePath) return PLACEHOLDER_IMAGE;

  const path = storagePath.trim();
  if (!path) return PLACEHOLDER_IMAGE;

  // Already a URL, a root-relative asset, or an inline data URI.
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/') || path.startsWith('data:')) {
    return path;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return PLACEHOLDER_IMAGE;

  const key = path.replace(new RegExp(`^${BUCKET}/`), '');
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/${key}`;
}

/** Primary image for a listing, falling back to the first one, then the placeholder. */
export function primaryImageUrl(
  images?: { storage_path: string; is_primary?: boolean }[] | null,
): string {
  if (!images || images.length === 0) return PLACEHOLDER_IMAGE;
  const primary = images.find((img) => img.is_primary) ?? images[0];
  return resolveImageUrl(primary?.storage_path);
}

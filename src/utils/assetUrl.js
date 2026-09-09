/**
 * Converts a public asset path into a base-aware URL using Vite's runtime base path (import.meta.env.BASE_URL).
 * Ensures compatibility with both localhost ('/') and GitHub Pages ('/portfolio/').
 * Idempotent: Never double-prefixes if the URL already contains the base path.
 *
 * @param {string} path - Absolute or relative public path (e.g., '/assets/models/elder_wand.glb' or 'profile.jpg')
 * @returns {string} Fully qualified base-aware path
 */
export const assetUrl = (path) => {
  if (!path || typeof path !== 'string') return path;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const rawBase = import.meta.env.BASE_URL || '/';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const baseNoSlashes = base.replace(/^\/+|\/+$/g, '');

  let cleanPath = path.replace(/^\/+/, '');

  if (baseNoSlashes && cleanPath.startsWith(`${baseNoSlashes}/`)) {
    cleanPath = cleanPath.slice(baseNoSlashes.length + 1);
  } else if (baseNoSlashes && cleanPath === baseNoSlashes) {
    cleanPath = '';
  }

  return `${base}${cleanPath}`;
};

export default assetUrl;

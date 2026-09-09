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

  const base = import.meta.env.BASE_URL || '/';

  // If already prefixed with base URL, return as-is
  if (base !== '/' && (path === base || path.startsWith(base))) {
    return path;
  }

  const cleanBase = base.replace(/^\/+/, '');
  if (base !== '/' && cleanBase && path.startsWith(cleanBase)) {
    return `/${path}`;
  }

  const cleanPath = path.replace(/^\/+/, '');
  return `${base}${cleanPath}`;
};

export default assetUrl;

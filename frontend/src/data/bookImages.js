import { resolveMediaUrl } from './api.js';

const bookMockupAssets = import.meta.glob('../assets/mockups/*', { eager: true, query: '?url', import: 'default' });

export const homeBookMockupPaths = [
  '/assets/mockups/hp-antologji-personale.png',
  '/assets/mockups/hp-ekspozite-me-enderra.png',
  '/assets/mockups/hp-rivali-adamit.png',
  '/assets/mockups/hp-flirt.png',
];

const homeBookMockupsBySlug = {
  'antologji-personale': homeBookMockupPaths[0],
  'ekspozite-me-enderra': homeBookMockupPaths[1],
  'rivali-i-adamit': homeBookMockupPaths[2],
  flirt: homeBookMockupPaths[3],
};

function resolveMockupPath(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path) || path.startsWith('/uploads/')) return resolveMediaUrl(path);

  const filename = path.split('/').pop();
  return Object.entries(bookMockupAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1]
    ?? resolveMediaUrl(path);
}

export function getHomeBookMockupPath(book, siteSettings, index) {
  return siteSettings?.[`homeFeaturedBookMockupPath${index + 1}`]
    || homeBookMockupsBySlug[book?.slug]
    || homeBookMockupPaths[index]
    || '';
}

export function getBookMockupImage(book, options = {}) {
  const { preferHomeMockup = false, siteSettings, index = 0 } = options;
  const paths = [
    preferHomeMockup ? getHomeBookMockupPath(book, siteSettings, index) : '',
    book?.mockupImagePath,
    book?.mockupImage,
  ];

  return paths.map(resolveMockupPath).find(Boolean) || '';
}

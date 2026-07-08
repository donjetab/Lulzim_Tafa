import { useEffect, useState } from 'react';
import {
  aboutIntroParagraphs,
  awards,
  biography,
  books,
  galleryImages,
  newsArticles,
  poemLanguages,
  poems,
  quickFacts,
  siteSettings,
  testimonials,
} from './content.js';
import { mediaSpotlightLinks } from './mediaSpotlight.js';
import { videoPoetryItems } from './videoPoetry.js';

export const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (['5173', '5174'].includes(window.location.port) ? 'http://127.0.0.1:5000' : '');
const APP_BASE = import.meta.env.BASE_URL || '/';
const assetModules = import.meta.glob('../assets/**/*', { eager: true, query: '?url', import: 'default' });
const assetUrlMap = new Map(Object.entries(assetModules).map(([assetPath, url]) => [
  `/assets/${assetPath.split('../assets/')[1]}`,
  url,
]));

function parseJsonArray(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function settingMap(settings) {
  return new Map((Array.isArray(settings) ? settings : []).map((setting) => [setting.key, setting.value]));
}

const contentTranslationFields = {
  books: ['title', 'category', 'location', 'summary', 'description'],
  poems: ['title', 'excerpt', 'body'],
  news: ['title', 'category', 'excerpt', 'body', 'galleryImagesJson', 'relatedSourcesJson'],
  awards: ['title', 'description', 'location'],
  gallery: ['caption'],
  testimonials: ['quote', 'authorName', 'authorTitle'],
  'video-poetry': ['title'],
};

function contentTranslationKey(collection, id, field, language) {
  return `content.${collection}.${id}.${field}.${language}`;
}

function applyContentTranslations(collection, item, settings, language = 'en') {
  if (language === 'en' || !item?.id) return item;

  const values = settings instanceof Map ? settings : settingMap(settings);
  const fields = contentTranslationFields[collection] ?? [];
  const translatedFields = fields.reduce((nextFields, field) => {
    const translatedValue = values.get(contentTranslationKey(collection, item.id, field, language));
    return translatedValue === undefined ? nextFields : { ...nextFields, [field]: translatedValue };
  }, {});

  return Object.keys(translatedFields).length ? { ...item, ...translatedFields } : item;
}

function applyContentTranslationList(collection, items, settings, language = 'en') {
  return items.map((item) => applyContentTranslations(collection, item, settings, language));
}

function normalizeSiteSettings(settings, socialLinks = siteSettings.socialLinks, language = 'en') {
  const values = settingMap(settings);
  const getSetting = (key, fallback) => values.get(`${key}.${language}`) ?? values.get(key) ?? fallback;

  return {
    ...siteSettings,
    logo: getSetting('logo', siteSettings.logo),
    subtitle: getSetting('subtitle', siteSettings.subtitle),
    heroTitle: getSetting('heroTitle', siteSettings.heroTitle),
    heroText: getSetting('heroText', siteSettings.heroText),
    location: getSetting('location', siteSettings.location),
    heroImagePath: values.get('heroImagePath') ?? '/assets/backgrounds/hero-portrait.png',
    heroBackgroundPath: values.get('heroBackgroundPath') ?? '/assets/backgrounds/main-background.png',
    quoteParallaxPath: values.get('quoteParallaxPath') ?? '/assets/decorative/parallax.png',
    homeFeaturedBookMockupPath1: values.get('homeFeaturedBookMockupPath1') ?? '/assets/mockups/hp-antologji-personale.png',
    homeFeaturedBookMockupPath2: values.get('homeFeaturedBookMockupPath2') ?? '/assets/mockups/hp-ekspozite-me-enderra.png',
    homeFeaturedBookMockupPath3: values.get('homeFeaturedBookMockupPath3') ?? '/assets/mockups/hp-rivali-adamit.png',
    homeFeaturedBookMockupPath4: values.get('homeFeaturedBookMockupPath4') ?? '/assets/mockups/hp-flirt.png',
    aboutPortraitPath: values.get('aboutPortraitPath') ?? '/assets/gallery/about1.jpg',
    biography: parseJsonArray(getSetting('biography', null), biography),
    aboutIntroParagraphs: parseJsonArray(getSetting('aboutIntroParagraphs', null), aboutIntroParagraphs),
    quickFacts: parseJsonArray(getSetting('quickFacts', null), quickFacts),
    mediaSpotlightLinks: parseJsonArray(values.get('mediaSpotlightLinks'), mediaSpotlightLinks),
    socialLinks: socialLinks.map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
      icon: link.iconPath || link.icon || 'website',
    })),
  };
}

function normalizeBook(book) {
  return {
    ...book,
    coverImage: book.coverImagePath ?? book.coverImage ?? '',
    mockupImage: book.mockupImagePath ?? book.mockupImage ?? '',
    featured: book.isFeatured ?? book.featured ?? false,
  };
}

function normalizePoem(poem) {
  return {
    ...poem,
    language: poem.languageName ?? poem.language?.name ?? poem.language ?? '',
    paperAsset: poem.paperImagePath ?? poem.paperAsset ?? '',
    featured: poem.isFeatured ?? poem.featured ?? false,
  };
}

function slugFromText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getYouTubeVideoId(url = '') {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, '');
    const searchVideoId = parsedUrl.searchParams.get('v');
    if (searchVideoId) return searchVideoId;

    if (host === 'youtu.be') {
      return parsedUrl.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (parsedUrl.pathname.includes('/embed/')) {
      return parsedUrl.pathname.split('/embed/')[1]?.split('/')[0] || '';
    }

    if (parsedUrl.pathname.includes('/shorts/')) {
      return parsedUrl.pathname.split('/shorts/')[1]?.split('/')[0] || '';
    }
  } catch {
    return url.match(/[?&]v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?&]+)/)?.[1] || '';
  }

  return '';
}

function getYouTubeThumbnailUrl(url = '') {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
}

function normalizeNews(article) {
  const videoType = article.videoType ?? '';
  const videoUrl = article.videoUrl ?? '';
  const youtubeThumbnail = String(videoType).toLowerCase() === 'youtube' ? getYouTubeThumbnailUrl(videoUrl) : '';
  const image = article.imagePath ?? article.image ?? youtubeThumbnail;
  const thumbnail = article.thumbnailImagePath ?? article.thumbnail ?? image ?? youtubeThumbnail;
  const relatedSources = parseJsonArray(article.relatedSourcesJson, article.relatedSources ?? []);
  const gallery = parseJsonArray(article.galleryImagesJson, article.galleryImages ?? []);
  const titleSlug = slugFromText(article.title);
  const savedSlug = article.slug ?? '';
  const publicSlug = savedSlug.startsWith('video-') && titleSlug ? titleSlug : savedSlug || titleSlug;

  return {
    ...article,
    slug: publicSlug,
    savedSlug,
    image,
    thumbnail,
    galleryImages: gallery,
    relatedSources,
    isExternal: article.isExternal ?? false,
    hiddenFromList: article.hiddenFromList ?? false,
    videoType,
    videoUrl,
    videoPreviewUrl: article.videoType === 'local' ? article.videoUrl : '',
    featured: article.isFeatured ?? article.featured ?? false,
  };
}

function normalizeAward(award) {
  return {
    ...award,
    icon: award.iconPath ?? award.icon ?? '',
    image: award.certificateImagePath ?? award.image ?? '',
    featured: award.isFeatured ?? award.featured ?? false,
  };
}

function normalizeGalleryImage(image) {
  return {
    ...image,
    src: image.imagePath ?? image.src ?? image.image ?? '',
    image: image.imagePath ?? image.src ?? image.image ?? '',
    caption: image.caption ?? '',
    featured: image.isFeatured ?? image.featured ?? false,
  };
}

function normalizeVideoPoetry(item) {
  const url = item.url || (item.filename ? `/assets/video_poetry/${item.filename}` : '');

  return {
    ...item,
    url,
    thumbnail: item.thumbnailImagePath ?? item.thumbnail ?? '',
    featured: item.isFeatured ?? item.featured ?? false,
  };
}

function newestFirst(items) {
  return [...items].sort((first, second) => (Number(second.id) || 0) - (Number(first.id) || 0));
}

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export function resolveMediaUrl(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  if (path.startsWith('/assets/')) return assetUrlMap.get(path) ?? `${APP_BASE}${path.slice(1)}`;
  return path;
}

export function useCmsData(loader, fallback, deps = []) {
  const [data, setData] = useState(fallback);
  const [isLoading, setIsLoading] = useState(Boolean(API_BASE));

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!API_BASE) {
        setData(fallback);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const nextData = await loader();
        if (isMounted) setData(nextData);
      } catch (error) {
        console.warn('CMS request failed, using local fallback:', error);
        if (isMounted) setData(fallback);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, isLoading };
}

export const fallbackData = {
  siteSettings,
  books,
  poems: newestFirst(poems),
  poemLanguages,
  newsArticles,
  awards,
  galleryImages: newestFirst(galleryImages),
  testimonials: newestFirst(testimonials),
  biography,
  aboutIntroParagraphs,
  quickFacts,
  mediaSpotlightLinks,
  videoPoetryItems,
};

export const cms = {
  getSiteSettings: async (language = 'en') => {
    const [settings, socialLinks] = await Promise.all([
      request('/api/site-settings'),
      request('/api/site-settings/social-links'),
    ]);
    return normalizeSiteSettings(settings, socialLinks, language);
  },
  getBooks: async (language = 'en') => {
    const [items, settings] = await Promise.all([request('/api/books'), request('/api/site-settings')]);
    return applyContentTranslationList('books', items, settings, language).map(normalizeBook);
  },
  getBook: async (slug, language = 'en') => {
    const [item, settings] = await Promise.all([request(`/api/books/${slug}`), request('/api/site-settings')]);
    return normalizeBook(applyContentTranslations('books', item, settings, language));
  },
  getPoems: async (poemLanguage, language = 'en') => {
    const [items, settings] = await Promise.all([
      request(`/api/poems${poemLanguage ? `?language=${encodeURIComponent(poemLanguage)}` : ''}`),
      request('/api/site-settings'),
    ]);
    return newestFirst(applyContentTranslationList('poems', items, settings, language).map(normalizePoem));
  },
  getPoem: async (slug, language = 'en') => {
    const [item, settings] = await Promise.all([request(`/api/poems/${slug}`), request('/api/site-settings')]);
    return normalizePoem(applyContentTranslations('poems', item, settings, language));
  },
  getPoemLanguages: async () => (await request('/api/poems/languages')).map((language) => language.name ?? language.Name ?? language),
  getNews: async (language = 'en') => {
    const [items, settings] = await Promise.all([request('/api/news'), request('/api/site-settings')]);
    return applyContentTranslationList('news', items, settings, language).map(normalizeNews);
  },
  getNewsArticle: async (slug, language = 'en') => {
    const [item, settings] = await Promise.all([request(`/api/news/${slug}`), request('/api/site-settings')]);
    return normalizeNews(applyContentTranslations('news', item, settings, language));
  },
  getAwards: async (language = 'en') => {
    const [items, settings] = await Promise.all([request('/api/awards'), request('/api/site-settings')]);
    return applyContentTranslationList('awards', items, settings, language).map(normalizeAward);
  },
  getAward: async (slug, language = 'en') => {
    const [item, settings] = await Promise.all([request(`/api/awards/${slug}`), request('/api/site-settings')]);
    return normalizeAward(applyContentTranslations('awards', item, settings, language));
  },
  getGallery: async (language = 'en') => {
    const [items, settings] = await Promise.all([request('/api/gallery'), request('/api/site-settings')]);
    return newestFirst(applyContentTranslationList('gallery', items, settings, language).map(normalizeGalleryImage));
  },
  getTestimonials: async (language = 'en') => {
    const [items, settings] = await Promise.all([request('/api/testimonials'), request('/api/site-settings')]);
    return newestFirst(applyContentTranslationList('testimonials', items, settings, language));
  },
  getBiography: async () => (await cms.getSiteSettings()).biography,
  getQuickFacts: async () => (await cms.getSiteSettings()).quickFacts,
  getMediaSpotlightLinks: async () => (await cms.getSiteSettings()).mediaSpotlightLinks,
  getVideoPoetry: async (language = 'en') => {
    const [items, settings] = await Promise.all([request('/api/video-poetry'), request('/api/site-settings')]);
    return applyContentTranslationList('video-poetry', items, settings, language).map(normalizeVideoPoetry);
  },
  getVideoPoetryItem: async (slug, language = 'en') => {
    const [item, settings] = await Promise.all([request(`/api/video-poetry/${slug}`), request('/api/site-settings')]);
    return normalizeVideoPoetry(applyContentTranslations('video-poetry', item, settings, language));
  },
};

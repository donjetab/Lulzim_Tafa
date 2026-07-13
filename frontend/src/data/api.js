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
  || (['5173', '5174'].includes(window.location.port) ? `${window.location.protocol}//${window.location.hostname}:5000` : '');
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

function translationMap(translations) {
  const values = new Map();
  (Array.isArray(translations) ? translations : []).forEach((translation) => {
    const key = translation.key;
    if (!key) return;
    const value = translation.value ?? '';
    const existing = values.get(key);
    if (value || existing === undefined) values.set(key, value);
  });
  return values;
}

function pageSectionMap(sections) {
  return new Map((Array.isArray(sections) ? sections : []).map((section) => [section.sectionKey, section]));
}

function normalizePageSection(section) {
  let extra = {};

  try {
    extra = section?.extraJson ? JSON.parse(section.extraJson) : {};
  } catch {
    extra = {};
  }

  return {
    ...section,
    extra,
  };
}

function normalizeSiteSettings(settings, socialLinks = siteSettings.socialLinks, translations = [], pageSections = {}) {
  const values = settingMap(settings);
  const translatedValues = translationMap(translations);
  const homeSections = pageSectionMap(pageSections.home);
  const aboutSections = pageSectionMap(pageSections.about);
  const mediaSections = pageSectionMap(pageSections.media);
  const getTranslation = (key, fallback) => translatedValues.get(key) ?? values.get(key) ?? fallback;
  const homeHero = homeSections.get('hero');
  const biographySection = aboutSections.get('biography');
  const aboutIntroSection = aboutSections.get('intro');
  const quickFactsSection = aboutSections.get('quick-facts');
  const mediaLinksSection = mediaSections.get('spotlight-links');

  return {
    ...siteSettings,
    logo: getTranslation('logo', siteSettings.logo),
    subtitle: getTranslation('subtitle', siteSettings.subtitle),
    heroTitle: homeHero?.title ?? getTranslation('heroTitle', siteSettings.heroTitle),
    heroText: homeHero?.content ?? getTranslation('heroText', siteSettings.heroText),
    location: getTranslation('location', siteSettings.location),
    heroImagePath: values.get('heroImagePath') ?? '/assets/backgrounds/hero-portrait.png',
    heroBackgroundPath: values.get('heroBackgroundPath') ?? '/assets/backgrounds/main-background.png',
    quoteParallaxPath: values.get('quoteParallaxPath') ?? '/assets/decorative/parallax.png',
    homeFeaturedBookMockupPath1: values.get('homeFeaturedBookMockupPath1') ?? '/assets/mockups/hp-antologji-personale.png',
    homeFeaturedBookMockupPath2: values.get('homeFeaturedBookMockupPath2') ?? '/assets/mockups/hp-ekspozite-me-enderra.png',
    homeFeaturedBookMockupPath3: values.get('homeFeaturedBookMockupPath3') ?? '/assets/mockups/hp-rivali-adamit.png',
    homeFeaturedBookMockupPath4: values.get('homeFeaturedBookMockupPath4') ?? '/assets/mockups/hp-flirt.png',
    aboutPortraitPath: values.get('aboutPortraitPath') ?? '/assets/gallery/about1.jpg',
    biography: parseJsonArray(biographySection?.content ?? values.get('biography'), biography),
    aboutIntroParagraphs: parseJsonArray(aboutIntroSection?.content ?? values.get('aboutIntroParagraphs'), aboutIntroParagraphs),
    quickFacts: parseJsonArray(quickFactsSection?.extraJson ?? values.get('quickFacts'), quickFacts),
    mediaSpotlightLinks: parseJsonArray(mediaLinksSection?.extraJson ?? values.get('mediaSpotlightLinks'), mediaSpotlightLinks),
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
    videoPreviewUrl: String(videoType).toLowerCase() === 'local' ? videoUrl : '',
    featured: article.isFeatured ?? article.featured ?? false,
  };
}

function normalizeAward(award) {
  return {
    ...award,
    slug: award.slug || slugFromText(award.title),
    icon: award.iconPath ?? award.icon ?? '',
    image: award.certificateImagePath ?? award.image ?? '',
    layout: award.layout ?? '',
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

function getFallbackVideoPoetryItem(slug) {
  return videoPoetryItems.find((item) => item.slug === slug || item.id === slug) ?? null;
}

function newestFirst(items) {
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((first, second) => {
      const secondId = Number(second.item?.id);
      const firstId = Number(first.item?.id);
      const hasNumericIds = Number.isFinite(secondId) && Number.isFinite(firstId);

      if (hasNumericIds && secondId !== firstId) return secondId - firstId;
      return second.index - first.index;
    })
    .map(({ item }) => item);
}

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  const responseText = await response.text();
  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    const message = typeof responseData === 'string'
      ? responseData
      : responseData?.message || responseData?.error || `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return responseData;
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
  videoPoetryItems: newestFirst(videoPoetryItems),
};

export const cms = {
  getSiteSettings: async (language = 'en') => {
    const translationRequests = language === 'en'
      ? [request('/api/site-translations?lang=en'), Promise.resolve([])]
      : [
          request('/api/site-translations?lang=en'),
          request(`/api/site-translations?lang=${encodeURIComponent(language)}`),
        ];
    const [settings, socialLinks, englishTranslations, languageTranslations, homeSections, aboutSections, mediaSections] = await Promise.all([
      request('/api/site-settings'),
      request('/api/site-settings/social-links'),
      ...translationRequests,
      request(`/api/page-sections/home?lang=${encodeURIComponent(language)}`),
      request(`/api/page-sections/about?lang=${encodeURIComponent(language)}`),
      request(`/api/page-sections/media?lang=${encodeURIComponent(language)}`),
    ]);
    const translations = language === 'en'
      ? englishTranslations
      : [...englishTranslations, ...languageTranslations];
    return normalizeSiteSettings(settings, socialLinks, translations, {
      home: homeSections,
      about: aboutSections,
      media: mediaSections,
    });
  },
  getBooks: async (language = 'en') => {
    const items = await request(`/api/books?lang=${encodeURIComponent(language)}`);
    return items.map(normalizeBook);
  },
  getBook: async (slug, language = 'en') => {
    const item = await request(`/api/books/${slug}?lang=${encodeURIComponent(language)}`);
    return normalizeBook(item);
  },
  getPoems: async (poemLanguage, language = 'en') => {
    const items = await request(`/api/poems${poemLanguage ? `?language=${encodeURIComponent(poemLanguage)}` : ''}`);
    return newestFirst(items.map(normalizePoem));
  },
  getPoem: async (slug, language = 'en') => {
    const item = await request(`/api/poems/${slug}`);
    return normalizePoem(item);
  },
  getPoemLanguages: async () => (await request('/api/poems/languages')).map((language) => language.name ?? language.Name ?? language),
  getNews: async (language = 'en') => {
    const items = await request(`/api/news?lang=${encodeURIComponent(language)}`);
    return items.map(normalizeNews);
  },
  getNewsArticle: async (slug, language = 'en') => {
    const item = await request(`/api/news/${slug}?lang=${encodeURIComponent(language)}`);
    return normalizeNews(item);
  },
  getAwards: async (language = 'en') => {
    const items = await request(`/api/awards?lang=${encodeURIComponent(language)}`);
    return items.map(normalizeAward);
  },
  getAward: async (slug, language = 'en') => {
    const item = await request(`/api/awards/${slug}?lang=${encodeURIComponent(language)}`);
    return normalizeAward(item);
  },
  getGallery: async (language = 'en') => {
    const items = await request(`/api/gallery?lang=${encodeURIComponent(language)}`);
    return newestFirst(items.map(normalizeGalleryImage));
  },
  getTestimonials: async (language = 'en') => {
    const items = await request(`/api/testimonials?lang=${encodeURIComponent(language)}`);
    return newestFirst(items);
  },
  getBiography: async (language = 'en') => (await cms.getSiteSettings(language)).biography,
  getQuickFacts: async (language = 'en') => (await cms.getSiteSettings(language)).quickFacts,
  getMediaSpotlightLinks: async (language = 'en') => (await cms.getSiteSettings(language)).mediaSpotlightLinks,
  getPageSections: async (pageKey, language = 'en') => {
    const sections = await request(`/api/page-sections/${encodeURIComponent(pageKey)}?lang=${encodeURIComponent(language)}`);
    return Array.isArray(sections) ? sections.map(normalizePageSection) : [];
  },
  getVideoPoetry: async (language = 'en') => {
    const items = await request(`/api/video-poetry?lang=${encodeURIComponent(language)}`);
    const sourceItems = Array.isArray(items) && items.length > 0 ? items : videoPoetryItems;
    return newestFirst(sourceItems.map(normalizeVideoPoetry));
  },
  getVideoPoetryItem: async (slug, language = 'en') => {
    try {
      const item = await request(`/api/video-poetry/${slug}?lang=${encodeURIComponent(language)}`);
      return normalizeVideoPoetry(item);
    } catch {
      const fallbackItem = getFallbackVideoPoetryItem(slug);
      if (!fallbackItem) throw new Error(`Video poetry item "${slug}" was not found.`);
      return normalizeVideoPoetry(fallbackItem);
    }
  },
};

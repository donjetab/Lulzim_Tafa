export const NEWS_CATEGORIES = {
  news: 'News',
  interview: 'Interview',
};

export const NEWS_SOURCES = {
  atv: {
    key: 'atv',
    label: 'ATV',
    hostname: 'atvlive.tv',
  },
  klan: {
    key: 'klan',
    label: 'Klan Kosova',
    hostname: 'klankosova.tv',
  },
  kultplus: {
    key: 'kultplus',
    label: 'KultPlus',
    hostname: 'kultplus.com',
  },
  epoka: {
    key: 'epoka',
    label: 'Epoka e Re',
    hostname: 'epokaere.com',
  },
  rtk: {
    key: 'rtk',
    label: 'RTK',
    hostname: 'rtklive.com',
  },
  facebook: {
    key: 'facebook',
    label: 'Facebook',
    hostname: 'facebook.com',
  },
  youtube: {
    key: 'youtube',
    label: 'YouTube',
    hostname: 'youtube.com',
  },
  officialVideoArchive: {
    key: 'officialVideoArchive',
    label: 'Official video archive',
    hostname: 'lulzimtafa.al',
  },
};

const DEFAULT_NEWS_ARTICLE = {
  category: NEWS_CATEGORIES.news,
  body: [],
  isExternal: false,
  externalUrl: '',
  sourceUrl: '',
  galleryImages: [],
  featured: false,
};

export function createNewsArticle(article, defaults = {}) {
  const isExternal = article.isExternal ?? defaults.isExternal ?? DEFAULT_NEWS_ARTICLE.isExternal;
  const sourceUrl = article.sourceUrl ?? article.externalUrl ?? article.url ?? defaults.sourceUrl ?? DEFAULT_NEWS_ARTICLE.sourceUrl;
  const externalUrl = article.externalUrl ?? article.url ?? defaults.externalUrl ?? (isExternal ? sourceUrl : DEFAULT_NEWS_ARTICLE.externalUrl);

  return {
    ...DEFAULT_NEWS_ARTICLE,
    ...defaults,
    ...article,
    category: article.category ?? defaults.category ?? DEFAULT_NEWS_ARTICLE.category,
    body: article.body ?? defaults.body ?? DEFAULT_NEWS_ARTICLE.body,
    isExternal,
    externalUrl,
    sourceUrl,
    galleryImages: article.galleryImages ?? defaults.galleryImages ?? DEFAULT_NEWS_ARTICLE.galleryImages,
    featured: article.featured ?? defaults.featured ?? DEFAULT_NEWS_ARTICLE.featured,
  };
}

export function createInternalNewsArticle(article) {
  return createNewsArticle(article, { isExternal: false });
}

export function createExternalNewsArticle(sourceKey, article) {
  const source = NEWS_SOURCES[sourceKey];
  const url = article.url ?? article.externalUrl ?? article.sourceUrl ?? '';

  return createNewsArticle(
    {
      ...article,
      externalUrl: url,
      sourceUrl: url,
    },
    {
      isExternal: true,
      sourceKey: source?.key ?? sourceKey,
      sourceLabel: source?.label ?? 'External source',
    },
  );
}

export function createExternalNewsCollection(sourceKey, articles) {
  return articles.map((article) => createExternalNewsArticle(sourceKey, article));
}

export function getNewsSourceName(article) {
  if (article.sourceLabel) return article.sourceLabel;

  const prefix = article.title.match(/^([^:]+):/)?.[1]?.trim();
  if (prefix) return prefix;

  const url = article.externalUrl || article.sourceUrl || '';
  const source = Object.values(NEWS_SOURCES).find(({ hostname }) => url.includes(hostname));

  return source?.label ?? (article.isExternal ? 'External source' : 'Related article');
}

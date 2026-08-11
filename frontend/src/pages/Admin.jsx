import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { languageOptions, translationGroups, translations } from '../i18n/LanguageContext.jsx';
import adminLogo from '../assets/logo/logo_landscape.png';
import aboutPortraitImage from '../assets/gallery/about1.jpg';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (['5173', '5174'].includes(window.location.port) ? `${window.location.protocol}//${window.location.hostname}:5000` : '');
const APP_BASE = import.meta.env.BASE_URL || '/';

const homepageDefaults = {
  logo: 'Lulzim Tafa',
  subtitle: 'Academic & Author',
  heroTitle: '',
  heroText: '',
  location: '',
  heroImagePath: '/assets/backgrounds/hero-portrait.png',
  heroBackgroundPath: '/assets/backgrounds/main-background.png',
  quoteParallaxPath: '/assets/decorative/parallax.png',
  homeFeaturedBookMockupPath1: '/assets/mockups/hp-antologji-personale.png',
  homeFeaturedBookMockupPath2: '/assets/mockups/hp-ekspozite-me-enderra.png',
  homeFeaturedBookMockupPath3: '/assets/mockups/hp-rivali-adamit.png',
  homeFeaturedBookMockupPath4: '/assets/mockups/hp-flirt.png',
};

const homepageFields = [
  ['logo', 'Main name shown in hero'],
  ['subtitle', 'Short line under the name'],
  ['heroTitle', 'Homepage main headline', 'textarea'],
  ['heroText', 'Homepage intro paragraph', 'textarea'],
  ['location', 'Location text'],
  ['heroImagePath', 'Homepage portrait image'],
  ['quoteParallaxPath', 'Quote parallax image'],
  ['homeFeaturedBookMockupPath1', 'Homepage book mockup 1'],
  ['homeFeaturedBookMockupPath2', 'Homepage book mockup 2'],
  ['homeFeaturedBookMockupPath3', 'Homepage book mockup 3'],
  ['homeFeaturedBookMockupPath4', 'Homepage book mockup 4'],
];

const homepageFieldLabels = Object.fromEntries(homepageFields.map(([key, label]) => [key, label]));
const homepageFieldTypes = Object.fromEntries(homepageFields.map(([key, , type = 'text']) => [key, type]));

const localizedSiteSettingKeys = new Set([
  'logo',
  'subtitle',
  'heroTitle',
  'heroText',
  'location',
  'biography',
  'aboutIntroParagraphs',
  'quickFacts',
]);

const globalSiteSettingKeys = new Set([
  'heroImagePath',
  'heroBackgroundPath',
  'quoteParallaxPath',
  'homeFeaturedBookMockupPath1',
  'homeFeaturedBookMockupPath2',
  'homeFeaturedBookMockupPath3',
  'homeFeaturedBookMockupPath4',
  'aboutPortraitPath',
  'mediaSpotlightLinks',
]);

function languageSettingKey(key, language) {
  return localizedSiteSettingKeys.has(key) ? `${key}.${language}` : key;
}

function translationRecordKey(key, language) {
  return `translation.${language}.${key}`;
}

function getSettingRecord(records, key, language) {
  return records.get(languageSettingKey(key, language)) ?? records.get(key);
}

function getSettingValue(records, key, fallback, language) {
  return getSettingRecord(records, key, language)?.value ?? fallback;
}

function buildDraftFromSettings(records, defaults, keys, language) {
  return keys.reduce((draft, key) => ({
    ...draft,
    [key]: formatSiteSettingValue(key, getSettingValue(records, key, defaults[key], language)),
  }), { ...defaults });
}

function buildTranslationDraft(records, language) {
  return translationGroups.reduce((draft, group) => {
    group.keys.forEach((key) => {
      const setting = records.get(translationRecordKey(key, language)) ?? records.get(key);
      draft[key] = setting?.value ?? translations[language]?.[key] ?? translations.en[key] ?? '';
    });
    return draft;
  }, {});
}

function addTranslationsToRecords(records, translations, options = {}) {
  (Array.isArray(translations) ? translations : []).forEach((translation) => {
    const language = translation.languageCode?.trim().toLowerCase();
    const existing = records.get(translation.key);
    if (language) {
      records.set(translationRecordKey(translation.key, language), translation);
      if (localizedSiteSettingKeys.has(translation.key)) {
        records.set(languageSettingKey(translation.key, language), translation);
      }
    }
    if (options.force || (translation.value ?? '') || !existing) records.set(translation.key, translation);
  });
}

function setSectionSettingRecord(records, key, language, value) {
  const record = { key, value };
  records.set(key, record);

  if (localizedSiteSettingKeys.has(key)) {
    records.set(languageSettingKey(key, language), {
      key: languageSettingKey(key, language),
      value,
    });
  }
}

const siteSettingDefaults = {
  ...homepageDefaults,
  aboutPortraitPath: '/assets/gallery/about1.jpg',
  biography: '',
  aboutIntroParagraphs: '',
  quickFacts: [],
  mediaSpotlightLinks: [],
};

const siteSettingParagraphKeys = new Set([
  'biography',
  'aboutIntroParagraphs',
]);

const siteSettingStructuredKeys = new Set([
  ...siteSettingParagraphKeys,
  'quickFacts',
  'mediaSpotlightLinks',
]);

const siteSettingGroups = [
  {
    title: 'About page biography content',
    fields: [
      ['aboutIntroParagraphs', 'About page opening paragraphs', 'json'],
      ['biography', 'Long biography paragraphs', 'textarea-large'],
      ['quickFacts', 'At a Glance facts', 'json'],
      ['aboutPortraitPath', 'About page portrait image'],
    ],
  },
];

const mediaSettingGroups = [
  {
    title: 'Media Spotlight links',
    fields: [
      ['mediaSpotlightLinks', 'News page Media Spotlight list', 'json-large'],
    ],
  },
];

const poetryHouseDefaults = {
  heroEyebrow: 'Poetry House',
  heroTitle: 'The Poetry House',
  heroSubtitle: 'Theatre & Library',
  heroContent: 'A dedicated space for poetry performance in Prishtina, founded by Lulzim Tafa and presented through the news reports connected to its opening.',
  heroCtaLabel: 'Read the opening report',
  videoEyebrow: 'Video',
  videoTitle: 'Poetry Theatre Opening',
  videoContent: 'The video presentation follows the public opening of the Poetry Theatre and the atmosphere around the new cultural space.',
  videoUrl: 'https://www.youtube.com/embed/SpK74zn2qkU',
  galleryEyebrow: 'Gallery',
  galleryTitle: 'Inside the Poetry House',
  galleryContent: 'Selected moments from the theatre space, arranged as a small visual carousel.',
  galleryImages: [
    { src: '/assets/poetry-house/8X4A4854-1920x1280.webp', label: 'Poetry Theatre stage' },
    { src: '/assets/poetry-house/8X4A4829-1920x1280.webp', label: 'Poetry House audience' },
    { src: '/assets/poetry-house/5G7A4747-1-1920x1280.webp', label: 'Poetry Theatre opening' },
  ],
  newsEyebrow: 'Related News',
  newsTitle: 'Poetry Theatre Reports',
  newsContent: 'Articles connected to the inauguration and public story of the Poetry House and Poetry Theatre.',
  newsEmptyText: 'No related reports have been added yet.',
  externalNews: [
    {
      id: 'korrespodenti-poetry-theatre',
      source: 'Korrespodenti',
      title: 'Ne Prishtine Inaugurohet Teatri i Poezise',
      date: '2025-06-19T16:54:46+01:00',
      url: 'https://korrespodenti.com/lajme/ne-prishtine-inaugurohet-teatri-i-poezise/',
      image: '/assets/poetry-house/5G7A4747-1-1920x1280.webp',
      excerpt: 'External report about the inauguration of the Poetry Theatre in Prishtina.',
    },
    {
      id: 'atv-poetry-theatre',
      source: 'ATV',
      title: 'Ne Prishtine Inaugurohet Teatri i Poezise',
      date: '2025-06-19T13:46:07+00:00',
      url: 'https://atvlive.tv/ne-prishtine-inaugurohet-teatri-i-poezise/',
      image: '/assets/poetry-house/8X4A4829-1920x1280.webp',
      excerpt: 'External report about the inauguration of the Poetry Theatre in Prishtina.',
    },
  ],
};

const poetryHouseGroups = [
  {
    title: 'Hero section',
    description: 'Main Poetry House page title, subtitle, intro copy, and opening-report button text.',
    fields: [
      ['heroEyebrow', 'Eyebrow'],
      ['heroTitle', 'Title'],
      ['heroSubtitle', 'Subtitle'],
      ['heroContent', 'Intro paragraph', 'textarea'],
      ['heroCtaLabel', 'Opening report button'],
    ],
  },
  {
    title: 'Video section',
    description: 'Embedded video link and the text beside it.',
    fields: [
      ['videoEyebrow', 'Eyebrow'],
      ['videoTitle', 'Title'],
      ['videoContent', 'Description', 'textarea'],
      ['videoUrl', 'Embed video URL'],
    ],
  },
  {
    title: 'Gallery section',
    description: 'Carousel heading and image list.',
    fields: [
      ['galleryEyebrow', 'Eyebrow'],
      ['galleryTitle', 'Title'],
      ['galleryContent', 'Description', 'textarea'],
      ['galleryImages', 'Gallery images', 'poetryHouseGallery'],
    ],
  },
  {
    title: 'Related news section',
    description: 'Heading, empty state, and external news cards shown after site news.',
    fields: [
      ['newsEyebrow', 'Eyebrow'],
      ['newsTitle', 'Title'],
      ['newsContent', 'Description', 'textarea'],
      ['newsEmptyText', 'Empty state text'],
      ['externalNews', 'External news cards', 'poetryHouseExternalNews'],
    ],
  },
];

const moduleConfigs = [
  {
    key: 'home',
    label: 'Home Page',
    icon: 'H',
  },
  {
    key: 'page-text',
    label: 'Page Labels',
    icon: 'L',
  },
  {
    key: 'news',
    label: 'News',
    icon: 'N',
    endpoint: '/api/news',
    uploadFolder: 'news',
    empty: {
      slug: '',
      title: '',
      category: 'News',
      date: new Date().toISOString().slice(0, 10),
      excerpt: '',
      body: '',
      imagePath: '',
      thumbnailImagePath: '',
      sourceUrl: '',
      externalUrl: '',
      galleryImagesJson: '[]',
      relatedSourcesJson: '[]',
      isExternal: false,
      isFeatured: false,
      hiddenFromList: false,
      videoType: '',
      videoUrl: '',
    },
    fields: [
      ['slug', 'Slug'],
      ['title', 'Title'],
      ['category', 'Category'],
      ['date', 'Date', 'date'],
      ['excerpt', 'Excerpt', 'textarea'],
      ['imagePath', 'Main image'],
      ['thumbnailImagePath', 'Thumbnail image'],
      ['sourceUrl', 'Source URL'],
      ['externalUrl', 'External URL'],
      ['videoType', 'Video type'],
      ['videoUrl', 'Video URL'],
      ['galleryImagesJson', 'Gallery image JSON', 'textarea'],
      ['relatedSourcesJson', 'Related source JSON', 'textarea'],
      ['body', 'Article body', 'richtext'],
      ['isExternal', 'External article', 'checkbox'],
      ['hiddenFromList', 'Hide duplicate', 'checkbox'],
    ],
  },
  {
    key: 'books',
    label: 'Books',
    icon: 'B',
    endpoint: '/api/books',
    uploadFolder: 'books',
    empty: {
      slug: '',
      title: '',
      category: 'Poetry book',
      year: '',
      location: '',
      summary: '',
      description: '',
      coverImagePath: '',
      mockupImagePath: '',
      isFeatured: false,
      displayOrder: 0,
      images: [],
    },
    fields: [
      ['title', 'Title'],
      ['category', 'Category'],
      ['year', 'Year', 'number'],
      ['location', 'Location'],
      ['summary', 'Summary', 'textarea'],
      ['description', 'Description', 'textarea'],
      ['coverImagePath', 'Cover image'],
      ['mockupImagePath', 'Mockup image'],
    ],
  },
  {
    key: 'poems',
    label: 'Poetry',
    icon: 'P',
    endpoint: '/api/poems',
    uploadFolder: 'poems',
    empty: {
      slug: '',
      title: '',
      excerpt: '',
      body: '',
      paperImagePath: '',
      poemLanguageId: '',
      isFeatured: false,
      displayOrder: 0,
    },
    fields: [
      ['title', 'Title'],
      ['poemLanguageId', 'Language', 'poemLanguage'],
      ['body', 'Poem body', 'textarea'],
    ],
  },
  {
    key: 'video-poetry',
    label: 'Video Poetry',
    icon: 'V',
    endpoint: '/api/video-poetry',
    uploadFolder: 'videos',
    empty: {
      slug: '',
      title: '',
      type: 'youtube',
      url: '',
      filename: '',
      thumbnailImagePath: '',
      previewFit: '',
      previewTime: '',
      isFeatured: false,
      displayOrder: 0,
    },
    fields: [
      ['title', 'Title'],
      ['type', 'Type', 'videoPoetryType'],
      ['url', 'YouTube link', 'videoPoetryUrl'],
      ['url', 'Local video', 'videoPoetryUpload'],
    ],
  },
  {
    key: 'awards',
    label: 'Awards',
    icon: 'A',
    endpoint: '/api/awards',
    uploadFolder: 'awards',
    empty: {
      slug: '',
      title: '',
      description: '',
      year: '',
      location: '',
      iconPath: '',
      certificateImagePath: '',
      isFeatured: false,
      displayOrder: 0,
    },
    fields: [
      ['title', 'Title'],
      ['description', 'Description', 'textarea'],
      ['year', 'Year', 'number'],
      ['location', 'Location'],
      ['iconPath', 'Icon', 'awardIcon'],
      ['certificateImagePath', 'Certificate image'],
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    icon: 'G',
    endpoint: '/api/gallery',
    uploadFolder: 'gallery',
    empty: { imagePath: '', caption: '', isFeatured: false, displayOrder: 0 },
    fields: [
      ['imagePath', 'Image'],
      ['caption', 'Caption'],
    ],
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    icon: 'T',
    endpoint: '/api/testimonials',
    uploadFolder: 'testimonials',
    empty: { quote: '', authorName: '', authorTitle: '', isFeatured: false, displayOrder: 0 },
    fields: [
      ['quote', 'Quote', 'textarea'],
      ['authorName', 'Author'],
      ['authorTitle', 'Location'],
    ],
  },
  {
    key: 'settings',
    label: 'Biography & Site Info',
    icon: 'S',
    endpoint: '/api/site-settings',
    uploadFolder: 'settings',
    empty: { key: '', value: '' },
    fields: [
      ['key', 'Key'],
      ['value', 'Value', 'textarea'],
    ],
  },
  {
    key: 'media-links',
    label: 'Media Links',
    icon: 'M',
  },
  {
    key: 'poetry-house',
    label: 'Poetry House',
    icon: 'P',
  },
  {
    key: 'edit-user',
    label: 'Edit User',
    icon: 'U',
  },
];

const moduleNavGroups = [
  {
    title: 'Website Text & Settings',
    description: 'Main page copy, labels, biography, and site-wide text.',
    moduleKeys: ['home', 'page-text', 'settings', 'media-links', 'poetry-house'],
  },
  {
    title: 'Content Collections',
    description: 'Editable records used across the public website.',
    moduleKeys: ['news', 'books', 'poems', 'video-poetry', 'awards', 'gallery', 'testimonials'],
  },
];

const moduleDescriptions = {
  home: 'Edit the main visible content of the homepage: name, subtitle, intro, and hero images.',
  'page-text': 'Translate fixed page labels: menus, section titles, buttons, search labels, and empty states.',
  settings: 'Edit biography, About page paragraphs, quick facts, and shared site information.',
  'media-links': 'Edit the Media Spotlight links shown on the News page.',
  'poetry-house': 'Edit the Poetry House page hero, video, gallery, and related external reports.',
  news: 'Manage news and interview articles. Switch to ALB to translate existing article text.',
  books: 'Manage book records. Switch to ALB to translate book titles and descriptions.',
  poems: 'Manage written poems. Switch to ALB to translate poem title, excerpt, and body.',
  'video-poetry': 'Manage video poetry items. Switch to ALB to translate video titles.',
  awards: 'Manage awards. Switch to ALB to translate award title, description, and location.',
  gallery: 'Manage gallery images and captions. Switch to ALB to translate captions.',
  testimonials: 'Manage testimonials. Switch to ALB to translate quotes and author details.',
  'edit-user': 'Update the admin name, login username, and password requirements.',
};

const modulesWithoutAdminLanguageSwitch = new Set(['poems', 'edit-user']);

function getModuleConfig(key) {
  return moduleConfigs.find((config) => config.key === key);
}

function getSiteSettingGroupsForConfig(configKey) {
  return configKey === 'media-links' ? mediaSettingGroups : siteSettingGroups;
}

function getSiteSettingKeysForConfig(configKey) {
  return getSiteSettingGroupsForConfig(configKey)
    .flatMap((group) => group.fields.map(([key]) => key));
}

const translationFieldLabels = {
  'nav.home': 'Menu: Home',
  'nav.about': 'Menu: About',
  'nav.biography': 'Submenu: Biography',
  'nav.othersAbout': 'Submenu: Others About LT',
  'nav.books': 'Menu: Books',
  'nav.poetry': 'Menu: Poetry',
  'nav.writtenPoetry': 'Submenu: Written Poetry',
  'nav.videoPoetry': 'Submenu: Video Poetry',
  'nav.poetryHouse': 'Menu: Poetry House',
  'nav.newsInterviews': 'Menu: News & Interviews',
  'nav.interviews': 'Footer/Menu: Interviews',
  'nav.news': 'Footer/Menu: News',
  'nav.gallery': 'Menu: Gallery',
  'nav.awards': 'Menu: Awards',
  'gallery.eyebrow': 'Small heading above the gallery title',
  'gallery.title': 'Gallery page title',
  'gallery.text': 'Gallery page subtitle',
  'awards.eyebrow': 'Small heading above the awards title',
  'awards.title': 'Awards page title',
  'footer.description': 'Footer: short description',
  'footer.navigation': 'Footer heading: Navigation',
  'footer.work': 'Footer heading: Work',
  'footer.stayInTouch': 'Footer heading: Stay in Touch',
  'footer.credit': 'Footer copyright/credit line',
  'language.label': 'Language label',
  'language.switchTo': 'Language switch button label',
};

function getTranslationFieldLabel(key) {
  if (translationFieldLabels[key]) return translationFieldLabels[key];

  const [section, ...parts] = key.split('.');
  const label = parts
    .join(' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const sectionLabels = {
    home: 'Homepage',
    about: 'About page',
    books: 'Books page',
    poetry: 'Poetry page',
    news: 'News page',
    gallery: 'Gallery page',
    awards: 'Awards page',
  };

  return `${sectionLabels[section] || section}: ${label}`;
}

const translationGroupDetails = {
  Navigation: {
    badge: 'NAV',
    description: 'Main menu, dropdown labels, and footer navigation text.',
  },
  Homepage: {
    badge: 'HOME',
    description: 'Homepage section titles, buttons, intro text, and quote.',
  },
  About: {
    badge: 'ABOUT',
    description: 'About page headings, testimonial intro text, and gallery labels.',
  },
  Books: {
    badge: 'BOOKS',
    description: 'Books page hero, library heading, and book preview labels.',
  },
  Poetry: {
    badge: 'POETRY',
    description: 'Poetry page hero, search controls, tabs, and empty states.',
  },
  News: {
    badge: 'NEWS',
    description: 'News page hero, search controls, filters, and media labels.',
  },
  Gallery: {
    badge: 'GALLERY',
    description: 'Gallery page header title, small heading, and descriptive subtitle.',
  },
  Awards: {
    badge: 'AWARDS',
    description: 'Awards page header title and small heading.',
  },
  Footer: {
    badge: 'FOOT',
    description: 'Footer headings, footer description, credit line, and language labels.',
  },
};

const homepageTranslationKeys = translationGroups.find((group) => group.title === 'Homepage')?.keys ?? [];
const aboutTranslationKeys = translationGroups.find((group) => group.title === 'About')?.keys ?? [];
const editableTranslationGroups = translationGroups.filter((group) => !['About', 'Homepage'].includes(group.title));

const homepageContentSections = [
  {
    title: 'Hero text',
    description: 'This is the first visible block on the public homepage.',
    fields: ['logo', 'subtitle', 'heroText', 'location'],
    translationKeys: ['home.exploreBooks', 'home.readPoetry'],
  },
  {
    title: 'Homepage pictures',
    description: 'Click the portrait thumbnail to open a larger image review.',
    preview: 'images',
    fields: ['heroImagePath'],
  },
];

const homepageTextSections = [
  {
    title: 'Books section',
    description: 'Heading, short copy, the books button, and the four homepage mockups.',
    preview: 'books',
    keys: ['home.featuredBooks', 'home.latestBooks', 'home.booksText', 'home.viewAllBooks'],
    fields: [
      'homeFeaturedBookMockupPath1',
      'homeFeaturedBookMockupPath2',
      'homeFeaturedBookMockupPath3',
      'homeFeaturedBookMockupPath4',
    ],
  },
  {
    title: 'Poetry section',
    description: 'Poetry copy, quote, parallax image, and the poetry button.',
    preview: 'poetry',
    keys: ['home.poetryEyebrow', 'home.poetryTitle', 'home.poetryText', 'home.explorePoetry', 'home.quote'],
    fields: ['quoteParallaxPath'],
  },
  {
    title: 'News section',
    description: 'News heading and the news button.',
    preview: 'news',
    keys: ['home.latestNews', 'home.newsTitle', 'home.viewAllNews'],
  },
];

const homeFeaturedBookSlugs = ['antologji-personale', 'ekspozite-me-enderra', 'rivali-i-adamit', 'flirt'];
const homeBookMockups = [
  '/assets/mockups/hp-antologji-personale.png',
  '/assets/mockups/hp-ekspozite-me-enderra.png',
  '/assets/mockups/hp-rivali-adamit.png',
  '/assets/mockups/hp-flirt.png',
];

const adminContentTranslationFields = {
  books: ['title', 'category', 'location', 'summary', 'description'],
  news: ['title', 'category', 'excerpt', 'body', 'galleryImagesJson', 'relatedSourcesJson'],
  awards: ['title', 'description', 'location'],
  gallery: ['caption'],
  testimonials: ['quote', 'authorName', 'authorTitle'],
  'video-poetry': ['title'],
};

function contentTranslationKey(collection, id, field, language) {
  return `content.${collection}.${id}.${field}.${language}`;
}

function applyAdminContentTranslations(collection, item, records, language) {
  if (language === 'en' || !item?.id) return item;

  const fields = adminContentTranslationFields[collection] ?? [];
  const translatedFields = fields.reduce((nextFields, field) => {
    const translatedRecord = records.get(contentTranslationKey(collection, item.id, field, language));
    return translatedRecord && translatedRecord.value ? { ...nextFields, [field]: translatedRecord.value } : nextFields;
  }, {});

  return Object.keys(translatedFields).length ? { ...item, ...translatedFields } : item;
}

function getPreviewTranslation(draft, language, key) {
  return draft[key] ?? translations[language]?.[key] ?? translations.en[key] ?? '';
}

function TranslationGroupPreview({ group, draft, language }) {
  const text = (key) => getPreviewTranslation(draft, language, key);

  if (group.title === 'Navigation') {
    return (
      <div className="admin-label-preview is-navigation" aria-label="Navigation text preview">
        <strong>Lulzim Tafa</strong>
        <span>{text('nav.home')}</span>
        <span>{text('nav.about')}</span>
        <span>{text('nav.books')}</span>
        <span>{text('nav.poetry')}</span>
        <span>{text('nav.newsInterviews')}</span>
      </div>
    );
  }

  if (group.title === 'Homepage') {
    return (
      <div className="admin-label-preview is-homepage" aria-label="Homepage text preview">
        <p>{text('home.subtitle')}</p>
        <h3>{text('home.poetryTitle')}</h3>
        <div>
          <span>{text('home.exploreBooks')}</span>
          <span>{text('home.readPoetry')}</span>
        </div>
      </div>
    );
  }

  if (group.title === 'Books') {
    return (
      <div className="admin-label-preview is-page-title" aria-label="Books page text preview">
        <p>{text('books.eyebrow')}</p>
        <h3>{text('books.title')}</h3>
        <span>{text('books.libraryTitle')}</span>
      </div>
    );
  }

  if (group.title === 'Poetry') {
    return (
      <div className="admin-label-preview is-page-title" aria-label="Poetry page text preview">
        <p>{text('poetry.eyebrow')}</p>
        <h3>{text('poetry.title')}</h3>
        <span>{text('poetry.searchPlaceholder')}</span>
      </div>
    );
  }

  if (group.title === 'News') {
    return (
      <div className="admin-label-preview is-page-title" aria-label="News page text preview">
        <p>{text('news.eyebrow')}</p>
        <h3>{text('news.title')}</h3>
        <span>{text('news.searchNewsPlaceholder')}</span>
      </div>
    );
  }

  if (group.title === 'Footer') {
    return (
      <div className="admin-label-preview is-footer" aria-label="Footer text preview">
        <strong>{text('footer.navigation')}</strong>
        <span>{text('footer.work')}</span>
        <span>{text('footer.stayInTouch')}</span>
        <small>{text('footer.credit')}</small>
      </div>
    );
  }

  return null;
}

function HomepagePreview({ draft, translationDraft, language }) {
  const text = (key) => getPreviewTranslation(translationDraft, language, key);
  const backgroundImage = resolveAdminImagePath(draft.heroBackgroundPath);
  const portraitImage = resolveAdminImagePath(draft.heroImagePath);

  return (
    <section className="admin-home-full-preview" aria-label="Homepage preview">
      <div className="admin-home-full-preview-hero" style={backgroundImage ? { backgroundImage: `linear-gradient(90deg, rgba(248, 246, 242, 0.92), rgba(248, 246, 242, 0.58)), url(${backgroundImage})` } : undefined}>
        <div className="admin-home-preview-nav">
          <strong>{draft.logo || 'Lulzim Tafa'}</strong>
          <span>{text('nav.home') || 'Home'}</span>
          <span>{text('nav.books') || 'Books'}</span>
          <span>{text('nav.poetry') || 'Poetry'}</span>
          <span>{text('nav.newsInterviews') || 'News'}</span>
        </div>
        <div className="admin-home-preview-hero-grid">
          <div>
            <p>{draft.subtitle}</p>
            <h2>{draft.title || draft.logo || 'Lulzim Tafa'}</h2>
            <span>{draft.heroText || text('home.intro')}</span>
            <div className="admin-home-preview-actions">
              <em>{text('home.exploreBooks')}</em>
              <em>{text('home.readPoetry')}</em>
            </div>
          </div>
          {portraitImage ? <img src={portraitImage} alt="" /> : null}
        </div>
      </div>
    </section>
  );
}

function HomeImageReview({ label, path, variant = 'portrait' }) {
  const image = resolveAdminImagePath(path);

  return (
    <figure className={`admin-home-image-review is-${variant}`}>
      {image ? (
        <a href={image} target="_blank" rel="noreferrer" title={`Open ${label} larger`}>
          <img src={image} alt="" />
        </a>
      ) : (
        <span>No image selected</span>
      )}
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function HomepageSectionPreview({ type, draft, translationDraft, language, previewBooks = [] }) {
  const text = (key) => getPreviewTranslation(translationDraft, language, key);
  const backgroundImage = resolveAdminImagePath(draft.heroBackgroundPath);
  const portraitImage = resolveAdminImagePath(draft.heroImagePath);

  if (type === 'hero') {
    return (
      <div className="admin-home-section-preview is-hero" style={backgroundImage ? { backgroundImage: `linear-gradient(90deg, rgba(248, 246, 242, 0.94), rgba(248, 246, 242, 0.66)), url(${backgroundImage})` } : undefined}>
        <div>
          <p>{draft.subtitle || text('home.subtitle')}</p>
          <h3>{draft.logo || 'Lulzim Tafa'}</h3>
          <span>{draft.heroText || text('home.intro')}</span>
          {draft.location ? <small>{draft.location}</small> : null}
        </div>
        {portraitImage ? <img src={portraitImage} alt="" /> : null}
      </div>
    );
  }

  if (type === 'images') {
    return (
      <div className="admin-home-picture-grid">
        <HomeImageReview label="Portrait image" path={draft.heroImagePath} />
      </div>
    );
  }

  if (type === 'hero-buttons') {
    return (
      <div className="admin-home-section-preview is-buttons">
        <div className="admin-home-preview-actions">
          <em>{text('home.exploreBooks')}</em>
          <em>{text('home.readPoetry')}</em>
        </div>
      </div>
    );
  }

  if (type === 'books') {
    return (
      <div className="admin-home-section-preview is-books-front">
        <article className="admin-home-books-heading">
          <p>{text('home.featuredBooks')}</p>
          <h3>{text('home.latestBooks')}</h3>
          <span>{text('home.booksText')}</span>
        </article>
        {previewBooks.length ? (
          <div className="admin-home-book-front-preview home-book-row" aria-label="Latest books preview">
            {previewBooks.map((book, index) => {
              const image = getHomepagePreviewBookImage(book, draft, index);

              return (
                <div
                  className={`home-book-mockup book-tone-${index + 1} admin-home-book-mockup`}
                  key={book.id || book.slug}
                  style={{ '--home-index': index }}
                >
                  {image ? (
                    <img className="home-book-image" src={image} alt={`${book.title} homepage mockup`} />
                  ) : (
                    <span>{book.title}</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
          <em>{text('home.viewAllBooks')}</em>

      </div>
    );
  }

  if (type === 'poetry') {
    const quoteParallaxImage = resolveAdminImagePath(draft.quoteParallaxPath);

    return (
      <div className="admin-home-section-preview is-poetry">
        <article>
          <p>{text('home.poetryEyebrow')}</p>
          <h3>{text('home.poetryTitle')}</h3>
          <span>{text('home.poetryText')}</span>
          <em>{text('home.explorePoetry')}</em>
        </article>
        <blockquote
          className="admin-home-poetry-quote-block"
          style={quoteParallaxImage ? { backgroundImage: `url(${quoteParallaxImage})` } : undefined}
        >
          {text('home.quote')}
        </blockquote>
      </div>
    );
  }

  if (type === 'news') {
    return (
      <div className="admin-home-section-preview is-card-row">
        <article>
          <p>{text('home.latestNews')}</p>
          <h3>{text('home.newsTitle')}</h3>
          <em>{text('home.viewAllNews')}</em>
        </article>
      </div>
    );
  }

  return null;
}

function HomeDraftField({ fieldKey, draft, onChange, onUpload }) {
  const type = homepageFieldTypes[fieldKey] ?? 'text';
  const label = homepageFieldLabels[fieldKey] ?? fieldKey;
  const isImageField = fieldKey.toLowerCase().includes('image') || fieldKey.toLowerCase().includes('path');

  return (
    <label className={type === 'textarea' ? 'is-wide' : ''}>
      <span>{label}</span>
      {type === 'textarea' ? (
        <textarea value={draft[fieldKey] ?? ''} onChange={(event) => onChange(fieldKey, event.target.value)} rows={5} />
      ) : (
        <input value={draft[fieldKey] ?? ''} onChange={(event) => onChange(fieldKey, event.target.value)} />
      )}
      {isImageField ? (
        <input className="admin-file-input" type="file" accept="image/*" onChange={(event) => onUpload(event, fieldKey)} />
      ) : null}
    </label>
  );
}

function HomeTranslationField({ fieldKey, value, onChange }) {
  const isLong = value.length > 80 || fieldKey.includes('Text') || fieldKey.includes('intro') || fieldKey.includes('quote');

  return (
    <label className={isLong ? 'is-wide' : ''}>
      <span>{getTranslationFieldLabel(fieldKey)}</span>
      {isLong ? (
        <textarea value={value} onChange={(event) => onChange(fieldKey, event.target.value)} rows={3} />
      ) : (
        <input value={value} onChange={(event) => onChange(fieldKey, event.target.value)} />
      )}
    </label>
  );
}

function QuickFactPreviewIcon({ index }) {
  const icons = [
    <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" />,
    <path d="m3 9 9-5 9 5-9 5-9-5ZM7 12v4c3 2 7 2 10 0v-4" />,
    <path d="M12 21s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11Z" />,
    <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  ];

  return (
    <span className="admin-bio-fact-icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        {icons[index % icons.length]}
      </svg>
    </span>
  );
}

function BiographyPreview({ draft, translationDraft, language }) {
  const text = (key) => getPreviewTranslation(translationDraft, language, key);
  const introParagraphs = textToParagraphs(draft.aboutIntroParagraphs);
  const biographyParagraphs = textToParagraphs(draft.biography);
  const facts = Array.isArray(draft.quickFacts) ? draft.quickFacts : quickFactsToRows(draft.quickFacts);
  const portraitImage = resolveAdminImagePath(draft.aboutPortraitPath) || aboutPortraitImage;

  return (
    <section className="admin-biography-preview" aria-label="Biography page preview">
      <div className="admin-bio-hero-preview">
        <img src={portraitImage} alt="" />
        <div>
          <p>{text('about.eyebrow') || 'About the Author'}</p>
          <h3>{text('about.title') || 'Biography'}</h3>
          {introParagraphs.map((paragraph) => <span key={paragraph}>{paragraph}</span>)}
        </div>
      </div>
      <div className="admin-bio-main-preview">
        <article>
          <h3>{text('about.lifeTitle') || 'Biography'}</h3>
          {biographyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
        <aside>
          <h3>{text('about.glanceTitle') || 'At a Glance'}</h3>
          <div className="admin-bio-fact-grid">
            {facts.map((fact, index) => (
              <div className="admin-bio-fact-preview" key={`${fact.label}-${index}`}>
                <QuickFactPreviewIcon index={index} />
                <div>
                  <strong>{fact.label}</strong>
                  <span>{fact.value}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

const galleryAssetModules = import.meta.glob('../assets/gallery/*', { eager: true, query: '?url', import: 'default' });
const newsAssetModules = import.meta.glob('../assets/news/*', { eager: true, query: '?url', import: 'default' });
const bookAssetModules = import.meta.glob('../assets/books/*', { eager: true, query: '?url', import: 'default' });
const mockupAssetModules = import.meta.glob('../assets/mockups/*', { eager: true, query: '?url', import: 'default' });
const backgroundAssetModules = import.meta.glob('../assets/backgrounds/*', { eager: true, query: '?url', import: 'default' });
const decorativeAssetModules = import.meta.glob('../assets/decorative/*', { eager: true, query: '?url', import: 'default' });
const poetryHouseAssetModules = import.meta.glob('../assets/poetry-house/*', { eager: true, query: '?url', import: 'default' });
const awardIconAssetModules = import.meta.glob('../assets/decorative/award-icon-*.png', { eager: true, query: '?url', import: 'default' });

const awardIconOptions = Object.entries(awardIconAssetModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([assetPath, src]) => ({
    label: assetPath.split('/').pop()?.replace('.png', '').replace('award-icon-', 'Icon ') || 'Award icon',
    value: `/assets/decorative/${assetPath.split('/').pop()}`,
    src,
  }));

const newsEditorTypes = [
  {
    key: 'article',
    label: 'Original article',
    description: 'Written here with its own photos.',
  },
  {
    key: 'article-sources',
    label: 'Article + sources',
    description: 'Written here, with outside coverage attached.',
  },
  {
    key: 'external',
    label: 'External only',
    description: 'Opens the original channel article.',
  },
  {
    key: 'video',
    label: 'Video story',
    description: 'Uses a YouTube or hosted video.',
  },
];

function normalizeItem(config, item) {
  return { ...config.empty, ...item };
}

function slugFromText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatAdminDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function getRecordTitle(item) {
  return item.title || item.key || item.authorName || item.caption || `Item ${item.id}`;
}

function getRecordMeta(item) {
  if (item.languageName || item.language?.name) {
    return `Poem / ${item.languageName || item.language.name}`;
  }

  return item.slug || item.category || item.value || `ID ${item.id}`;
}

function getNewsImage(item) {
  const directImage = item.thumbnailImagePath || item.thumbnail || item.imagePath || item.image;
  if (directImage) return directImage;

  const videoType = String(item.videoType || '').toLowerCase();
  if (videoType === 'youtube') return getYouTubeThumbnailUrl(item.videoUrl);

  return '';
}

function getNewsVideoPreview(item) {
  const videoType = String(item.videoType || '').toLowerCase();
  if (!['hosted', 'local'].includes(videoType)) return '';

  return item.videoUrl || '';
}

function getBookImage(item) {
  return item.coverImagePath || item.mockupImagePath || item.coverImage || item.mockupImage;
}

function getGalleryImage(item) {
  return item.imagePath || item.src || item.image;
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

function getHomepagePreviewBooks(items) {
  const books = Array.isArray(items) ? items : [];

  return homeFeaturedBookSlugs
    .map((slug) => books.find((book) => book.slug === slug))
    .filter(Boolean)
    .slice(0, 4);
}

function getHomepagePreviewBookImage(book, draft, index) {
  return resolveAdminImagePath(
    draft?.[`homeFeaturedBookMockupPath${index + 1}`]
    || homeBookMockups[index]
    || ''
  );
}

function getYouTubeThumbnailUrl(url = '') {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
}

function isYouTubeThumbnail(path = '') {
  return /https:\/\/i\.ytimg\.com\/vi\/[^/]+\/hqdefault\.jpg/i.test(path);
}

function getVideoImage(item) {
  const directImage = item.thumbnailImagePath || item.thumbnail;
  if (directImage) return directImage;

  const videoId = item.type === 'youtube' ? getYouTubeVideoId(item.url) : '';
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
}

function resolvePublicAssetPath(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  if (path.startsWith('/assets/')) return `${APP_BASE}${path.slice(1)}`;
  return path;
}

function getVideoUrl(item) {
  if (item.url) return resolvePublicAssetPath(item.url);
  if (item.filename) return `${APP_BASE}assets/video_poetry/${item.filename}`;
  return '';
}

function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function stringifyJsonArray(items) {
  const cleanItems = items.filter((item) => Object.values(item).some((value) => String(value ?? '').trim()));
  return JSON.stringify(cleanItems);
}

function galleryImagesToRows(value) {
  return parseJsonArray(value)
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') return String(item.path ?? item.src ?? item.image ?? item.url ?? '').trim();
      return '';
    })
    .filter(Boolean);
}

function galleryImagesToPayload(rows) {
  return JSON.stringify(
    rows
      .map((row) => String(row ?? '').trim())
      .filter(Boolean),
  );
}

function sortNewestAdminItems(configKey, list) {
  if (configKey === 'gallery') {
    const numericOrders = list
      .map((item) => Number(item?.displayOrder))
      .filter(Number.isFinite);
    const hasManualOrder = numericOrders.length === list.length && new Set(numericOrders).size > 1;

    if (!hasManualOrder) {
      return [...list]
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

    return [...list]
      .map((item, index) => ({ item, index }))
      .sort((first, second) => {
        const firstOrder = Number(first.item?.displayOrder);
        const secondOrder = Number(second.item?.displayOrder);
        const hasOrders = Number.isFinite(firstOrder) && Number.isFinite(secondOrder);

        if (hasOrders && firstOrder !== secondOrder) return firstOrder - secondOrder;
        return second.index - first.index;
      })
      .map(({ item }) => item);
  }

  if (!['poems', 'testimonials', 'video-poetry'].includes(configKey)) return list;
  return [...list]
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

function paragraphsToText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join('\n\n');
  if (!value) return '';

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean).join('\n\n');
  } catch {
    return value;
  }

  return value;
}

function buildExcerptFromBody(value, maxLength = 180) {
  const clean = String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return '';
  if (clean.length <= maxLength) return clean;

  const shortened = clean.slice(0, maxLength).trim();
  return `${shortened.replace(/[.,;:!?-]+$/g, '')}...`;
}

function textToParagraphs(value) {
  return String(value ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function quickFactsToRows(value) {
  return parseJsonArray(value).map((fact) => {
    if (Array.isArray(fact)) {
      return { label: fact[0] ?? '', value: fact[1] ?? '' };
    }

    return { label: fact.label ?? fact.name ?? '', value: fact.value ?? fact.text ?? '' };
  });
}

function quickFactsToPayload(rows) {
  return rows
    .map((row) => [String(row.label ?? '').trim(), String(row.value ?? '').trim()])
    .filter(([label, value]) => label || value);
}

function mediaLinksToRows(value) {
  return parseJsonArray(value).map((link) => ({
    name: link.name ?? link.label ?? '',
    url: link.url ?? '',
  }));
}

function mediaLinksToPayload(rows) {
  return rows
    .map((row) => ({ name: String(row.name ?? '').trim(), url: String(row.url ?? '').trim() }))
    .filter((row) => row.name || row.url);
}

function poetryHouseGalleryToRows(value) {
  return parseJsonArray(value, poetryHouseDefaults.galleryImages).map((item) => ({
    src: item.src ?? item.image ?? '',
    label: item.label ?? item.caption ?? '',
  }));
}

function poetryHouseGalleryToPayload(rows) {
  return (Array.isArray(rows) ? rows : [])
    .map((row) => ({ src: String(row.src ?? '').trim(), label: String(row.label ?? '').trim() }))
    .filter((row) => row.src || row.label);
}

function poetryHouseExternalNewsToRows(value) {
  return parseJsonArray(value, poetryHouseDefaults.externalNews).map((item, index) => ({
    id: item.id ?? `external-news-${index + 1}`,
    source: item.source ?? '',
    title: item.title ?? '',
    date: item.date ?? '',
    url: item.url ?? '',
    image: item.image ?? '',
    excerpt: item.excerpt ?? '',
  }));
}

function poetryHouseExternalNewsToPayload(rows) {
  return (Array.isArray(rows) ? rows : [])
    .map((row, index) => ({
      id: String(row.id || row.title || `external-news-${index + 1}`).trim(),
      source: String(row.source ?? '').trim(),
      title: String(row.title ?? '').trim(),
      date: String(row.date ?? '').trim(),
      url: String(row.url ?? '').trim(),
      image: String(row.image ?? '').trim(),
      excerpt: String(row.excerpt ?? '').trim(),
    }))
    .filter((row) => row.title || row.url);
}

function buildPoetryHouseDraft(sections) {
  const byKey = new Map((Array.isArray(sections) ? sections : []).map((section) => [section.sectionKey, section]));
  const getSection = (key) => {
    const section = byKey.get(key) ?? {};
    const extra = parseObject(section.extraJson);
    return { section, extra };
  };
  const hero = getSection('hero');
  const video = getSection('video');
  const gallery = getSection('gallery');
  const news = getSection('news');

  return {
    ...poetryHouseDefaults,
    heroEyebrow: hero.extra.eyebrow ?? poetryHouseDefaults.heroEyebrow,
    heroTitle: hero.section.title ?? poetryHouseDefaults.heroTitle,
    heroSubtitle: hero.section.subtitle ?? poetryHouseDefaults.heroSubtitle,
    heroContent: hero.section.content ?? poetryHouseDefaults.heroContent,
    heroCtaLabel: hero.extra.ctaLabel ?? poetryHouseDefaults.heroCtaLabel,
    videoEyebrow: video.extra.eyebrow ?? poetryHouseDefaults.videoEyebrow,
    videoTitle: video.section.title ?? poetryHouseDefaults.videoTitle,
    videoContent: video.section.content ?? poetryHouseDefaults.videoContent,
    videoUrl: video.extra.videoUrl ?? poetryHouseDefaults.videoUrl,
    galleryEyebrow: gallery.extra.eyebrow ?? poetryHouseDefaults.galleryEyebrow,
    galleryTitle: gallery.section.title ?? poetryHouseDefaults.galleryTitle,
    galleryContent: gallery.section.content ?? poetryHouseDefaults.galleryContent,
    galleryImages: poetryHouseGalleryToRows(gallery.extra.images ?? poetryHouseDefaults.galleryImages),
    newsEyebrow: news.extra.eyebrow ?? poetryHouseDefaults.newsEyebrow,
    newsTitle: news.section.title ?? poetryHouseDefaults.newsTitle,
    newsContent: news.section.content ?? poetryHouseDefaults.newsContent,
    newsEmptyText: news.extra.emptyText ?? poetryHouseDefaults.newsEmptyText,
    externalNews: poetryHouseExternalNewsToRows(news.extra.externalNews ?? poetryHouseDefaults.externalNews),
  };
}

function parseObject(value) {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function formatSiteSettingValue(key, value) {
  if (!siteSettingStructuredKeys.has(key)) return value ?? '';

  if (siteSettingParagraphKeys.has(key)) return paragraphsToText(value);
  if (key === 'quickFacts') return quickFactsToRows(value);
  if (key === 'mediaSpotlightLinks') return mediaLinksToRows(value);

  return value ?? '';
}

function serializeSiteSettingValue(key, value) {
  if (siteSettingParagraphKeys.has(key)) return JSON.stringify(textToParagraphs(value));
  if (key === 'quickFacts') return JSON.stringify(quickFactsToPayload(value));
  if (key === 'mediaSpotlightLinks') return JSON.stringify(mediaLinksToPayload(value));

  return value ?? '';
}

function getNewsEditorType(item) {
  if (item._editorType) return item._editorType;
  if (item.videoType || item.videoUrl) return 'video';
  if (item.isExternal) return 'external';
  if (parseJsonArray(item.relatedSourcesJson).length > 0) return 'article-sources';
  return 'article';
}

function resolveAdminImagePath(path) {
  if (!path || path === '/assets/news/') return '';

  const normalizedPath = path.trim();
  if (/^(https?:|data:|blob:)/i.test(normalizedPath)) return normalizedPath;
  if (normalizedPath.startsWith('/uploads/')) return `${API_BASE}${normalizedPath}`;

  const assetFilename = normalizedPath.split('/').pop();
  if (assetFilename) {
    const resolvedNewsAsset = [
      galleryAssetModules,
      newsAssetModules,
      bookAssetModules,
      mockupAssetModules,
      backgroundAssetModules,
      decorativeAssetModules,
      poetryHouseAssetModules,
      awardIconAssetModules,
    ].flatMap((modules) => Object.entries(modules))
      .find(([assetPath]) => assetPath.endsWith(`/${assetFilename}`))?.[1];

    if (resolvedNewsAsset) return resolvedNewsAsset;
  }

  if (normalizedPath.startsWith('/assets/')) return `${APP_BASE}${normalizedPath.slice(1)}`;

  return normalizedPath;
}

function AdminNewsImage({ item }) {
  const [hasError, setHasError] = useState(false);
  const image = resolveAdminImagePath(getNewsImage(item));
  const videoPreview = resolvePublicAssetPath(getNewsVideoPreview(item));

  useEffect(() => {
    setHasError(false);
  }, [image, videoPreview]);

  if (image && !hasError) {
    return <img src={image} alt="" onError={() => setHasError(true)} />;
  }

  if (videoPreview && !hasError) {
    return <video src={encodeURI(videoPreview)} muted playsInline preload="metadata" onError={() => setHasError(true)} />;
  }

  return <span>No image</span>;
}

function AdminBookImage({ item }) {
  const [hasError, setHasError] = useState(false);
  const image = resolveAdminImagePath(getBookImage(item));

  useEffect(() => {
    setHasError(false);
  }, [image]);

  if (!image || hasError) {
    return <span>No cover</span>;
  }

  return <img src={image} alt="" onError={() => setHasError(true)} />;
}

function AdminGalleryImage({ item }) {
  const [hasError, setHasError] = useState(false);
  const image = resolveAdminImagePath(getGalleryImage(item));

  useEffect(() => {
    setHasError(false);
  }, [image]);

  if (!image || hasError) {
    return <span>No image</span>;
  }

  return <img src={image} alt={item.caption || ''} loading="lazy" onError={() => setHasError(true)} />;
}

function AdminVideoPreview({ item }) {
  const [hasError, setHasError] = useState(false);
  const image = resolveAdminImagePath(getVideoImage(item));
  const video = getVideoUrl(item);
  const isLocalVideo = item.type === 'local' && video;

  useEffect(() => {
    setHasError(false);
  }, [image, video]);

  if (isLocalVideo && !hasError) {
    return (
      <video
        src={encodeURI(video)}
        muted
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
      />
    );
  }

  if (!image || hasError) {
    return <span>No thumbnail</span>;
  }

  return <img src={image} alt="" onError={() => setHasError(true)} />;
}

function AdminField({ label, children, isWide = false }) {
  return (
    <label className={isWide ? 'is-wide' : ''}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function RelatedSourceEditor({ value, onChange }) {
  const sources = parseJsonArray(value);
  const rows = sources.length > 0 ? sources : [{ label: '', title: '', url: '', date: '' }];

  function updateSource(index, key, nextValue) {
    const nextSources = rows.map((source, sourceIndex) => (
      sourceIndex === index ? { ...source, [key]: nextValue, isExternal: true } : source
    ));
    onChange(stringifyJsonArray(nextSources));
  }

  function addSource() {
    onChange(stringifyJsonArray([...rows, { label: '', title: '', url: '', date: '', isExternal: true }]));
  }

  function removeSource(index) {
    onChange(stringifyJsonArray(rows.filter((_, sourceIndex) => sourceIndex !== index)));
  }

  return (
    <div className="admin-related-sources">
      {rows.map((source, index) => (
        <div className="admin-related-source-row" key={`source-${index}`}>
          <AdminField label="Source name">
            <input value={source.label ?? ''} onChange={(event) => updateSource(index, 'label', event.target.value)} placeholder="Klan Kosova" />
          </AdminField>
          <AdminField label="Source title">
            <input value={source.title ?? ''} onChange={(event) => updateSource(index, 'title', event.target.value)} />
          </AdminField>
          <AdminField label="Source URL" isWide>
            <input value={source.url ?? ''} onChange={(event) => updateSource(index, 'url', event.target.value)} />
          </AdminField>
          <AdminField label="Date">
            <input type="date" value={source.date ?? ''} onChange={(event) => updateSource(index, 'date', event.target.value)} />
          </AdminField>
          <button type="button" onClick={() => removeSource(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addSource}>Add source</button>
    </div>
  );
}

function NewsGalleryImagesEditor({ value, onChange, onUpload }) {
  const images = galleryImagesToRows(value);
  const rows = images.length > 0 ? images : [];

  function updateImage(index, nextValue) {
    onChange(galleryImagesToPayload(rows.map((image, imageIndex) => (imageIndex === index ? nextValue : image))));
  }

  function removeImage(index) {
    onChange(galleryImagesToPayload(rows.filter((_, imageIndex) => imageIndex !== index)));
  }

  async function uploadImages(event) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    await onUpload(files, rows);
    event.target.value = '';
  }

  return (
    <div className="admin-news-gallery-editor">
      <div className="admin-news-gallery-toolbar">
        <label className="admin-gallery-upload-control">
          <span>Upload related pictures</span>
          <input type="file" accept="image/*" multiple onChange={uploadImages} />
        </label>
      </div>

      {rows.length > 0 ? (
        <div className="admin-news-gallery-grid">
          {rows.map((imagePath, index) => (
            <article className="admin-news-gallery-card" key={`${imagePath || 'news-gallery'}-${index}`}>
              <div className="admin-news-gallery-card-image">
                {resolveAdminImagePath(imagePath) ? <img src={resolveAdminImagePath(imagePath)} alt="" /> : <span>No image</span>}
              </div>
              <div className="admin-news-gallery-card-body">
                <strong>{`Picture ${index + 1}`}</strong>
                <button type="button" onClick={() => removeImage(index)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-section-note">Upload the extra pictures that should appear inside this news story.</p>
      )}
    </div>
  );
}

function TextBlockSettingEditor({ value, onChange, rows = 10 }) {
  return (
    <div className="admin-human-editor">
      <textarea
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder="Write normally. Leave one blank line between paragraphs."
      />
      <small>Blank lines become separate paragraphs on the website.</small>
    </div>
  );
}

function RepeatingRowsEditor({
  rows,
  emptyRow,
  onChange,
  children,
  addLabel,
  className = '',
}) {
  const visibleRows = rows.length > 0 ? rows : [emptyRow];

  function updateRow(index, key, value) {
    onChange(visibleRows.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [key]: value } : row
    )));
  }

  function addRow() {
    onChange([...(rows.length > 0 ? rows : []), { ...emptyRow }]);
  }

  function removeRow(index) {
    onChange((rows.length > 0 ? rows : visibleRows).filter((_, rowIndex) => rowIndex !== index));
  }

  return (
    <div className={`admin-human-editor admin-repeating-editor${className ? ` ${className}` : ''}`}>
      {visibleRows.map((row, index) => children({
        row,
        index,
        updateRow,
        removeRow,
      }))}
      <button type="button" onClick={addRow}>{addLabel}</button>
    </div>
  );
}

function QuickFactsEditor({ value, onChange }) {
  return (
    <RepeatingRowsEditor
      rows={Array.isArray(value) ? value : quickFactsToRows(value)}
      emptyRow={{ label: '', value: '' }}
      onChange={onChange}
      addLabel="Add quick fact"
      className="is-quick-facts-editor"
    >
      {({ row, index, updateRow, removeRow }) => (
        <div className="admin-repeating-row" key={`quick-fact-${index}`}>
          <AdminField label="Label">
            <input value={row.label ?? ''} onChange={(event) => updateRow(index, 'label', event.target.value)} placeholder="Born" />
          </AdminField>
          <AdminField label="Text" isWide>
            <input value={row.value ?? ''} onChange={(event) => updateRow(index, 'value', event.target.value)} placeholder="1970, Lipjan" />
          </AdminField>
          <button type="button" onClick={() => removeRow(index)}>Remove</button>
        </div>
      )}
    </RepeatingRowsEditor>
  );
}

function MediaLinksEditor({ value, onChange }) {
  return (
    <RepeatingRowsEditor
      rows={Array.isArray(value) ? value : mediaLinksToRows(value)}
      emptyRow={{ name: '', url: '' }}
      onChange={onChange}
      addLabel="Add media link"
      className="is-media-links-editor"
    >
      {({ row, index, updateRow, removeRow }) => (
        <div className="admin-repeating-row" key={`media-link-${index}`}>
          <AdminField label="Name">
            <input value={row.name ?? ''} onChange={(event) => updateRow(index, 'name', event.target.value)} placeholder="KultPlus" />
          </AdminField>
          <AdminField label="URL" isWide>
            <input value={row.url ?? ''} onChange={(event) => updateRow(index, 'url', event.target.value)} placeholder="https://..." />
          </AdminField>
          <button type="button" onClick={() => removeRow(index)}>Remove</button>
        </div>
      )}
    </RepeatingRowsEditor>
  );
}

function PoetryHouseGalleryEditor({ value, onChange, onUpload }) {
  return (
    <RepeatingRowsEditor
      rows={Array.isArray(value) ? value : poetryHouseGalleryToRows(value)}
      emptyRow={{ src: '', label: '' }}
      onChange={onChange}
      addLabel="Add gallery image"
      className="is-media-links-editor"
    >
      {({ row, index, updateRow, removeRow }) => (
        <div className="admin-repeating-row" key={`poetry-house-gallery-${index}`}>
          <AdminField label="Image path" isWide>
            <input value={row.src ?? ''} onChange={(event) => updateRow(index, 'src', event.target.value)} placeholder="/assets/poetry-house/photo.webp" />
            <input className="admin-file-input" type="file" accept="image/*" onChange={(event) => onUpload(event, index, 'galleryImages')} />
          </AdminField>
          <AdminField label="Caption" isWide>
            <input value={row.label ?? ''} onChange={(event) => updateRow(index, 'label', event.target.value)} placeholder="Poetry Theatre stage" />
          </AdminField>
          <button type="button" onClick={() => removeRow(index)}>Remove</button>
        </div>
      )}
    </RepeatingRowsEditor>
  );
}

function PoetryHouseExternalNewsEditor({ value, onChange, onUpload }) {
  return (
    <RepeatingRowsEditor
      rows={Array.isArray(value) ? value : poetryHouseExternalNewsToRows(value)}
      emptyRow={{ id: '', source: '', title: '', date: '', url: '', image: '', excerpt: '' }}
      onChange={onChange}
      addLabel="Add external report"
      className="is-media-links-editor"
    >
      {({ row, index, updateRow, removeRow }) => (
        <div className="admin-repeating-row" key={`poetry-house-news-${index}`}>
          <AdminField label="Source">
            <input value={row.source ?? ''} onChange={(event) => updateRow(index, 'source', event.target.value)} placeholder="ATV" />
          </AdminField>
          <AdminField label="Title" isWide>
            <input value={row.title ?? ''} onChange={(event) => updateRow(index, 'title', event.target.value)} placeholder="Report title" />
          </AdminField>
          <AdminField label="Date">
            <input value={row.date ?? ''} onChange={(event) => updateRow(index, 'date', event.target.value)} placeholder="2025-06-19T13:46:07+00:00" />
          </AdminField>
          <AdminField label="URL" isWide>
            <input value={row.url ?? ''} onChange={(event) => updateRow(index, 'url', event.target.value)} placeholder="https://..." />
          </AdminField>
          <AdminField label="Image path" isWide>
            <input value={row.image ?? ''} onChange={(event) => updateRow(index, 'image', event.target.value)} placeholder="/assets/poetry-house/photo.webp" />
            <input className="admin-file-input" type="file" accept="image/*" onChange={(event) => onUpload(event, index, 'externalNews')} />
          </AdminField>
          <AdminField label="Excerpt" isWide>
            <input value={row.excerpt ?? ''} onChange={(event) => updateRow(index, 'excerpt', event.target.value)} placeholder="Short card description" />
          </AdminField>
          <button type="button" onClick={() => removeRow(index)}>Remove</button>
        </div>
      )}
    </RepeatingRowsEditor>
  );
}

function PoetryHouseFieldEditor({ fieldKey, type, value, onChange, onUpload }) {
  if (type === 'poetryHouseGallery') {
    return <PoetryHouseGalleryEditor value={value} onChange={(rows) => onChange(fieldKey, rows)} onUpload={onUpload} />;
  }

  if (type === 'poetryHouseExternalNews') {
    return <PoetryHouseExternalNewsEditor value={value} onChange={(rows) => onChange(fieldKey, rows)} onUpload={onUpload} />;
  }

  if (type === 'textarea') {
    return <textarea value={value ?? ''} onChange={(event) => onChange(fieldKey, event.target.value)} rows={5} />;
  }

  return <input value={value ?? ''} onChange={(event) => onChange(fieldKey, event.target.value)} />;
}

function SiteSettingEditor({ settingKey, type, value, onChange }) {
  if (siteSettingParagraphKeys.has(settingKey)) {
    return <TextBlockSettingEditor value={value} onChange={onChange} rows={type.includes('large') ? 14 : 8} />;
  }

  if (settingKey === 'quickFacts') {
    return <QuickFactsEditor value={value} onChange={onChange} />;
  }

  if (settingKey === 'mediaSpotlightLinks') {
    return <MediaLinksEditor value={value} onChange={onChange} />;
  }

  if (type.includes('textarea')) {
    return <textarea value={value ?? ''} onChange={(event) => onChange(event.target.value)} rows={type.includes('large') ? 12 : 6} />;
  }

  return <input value={value ?? ''} onChange={(event) => onChange(event.target.value)} />;
}

function NewsVideoPreview({ draft }) {
  const [hasError, setHasError] = useState(false);
  const videoType = String(draft.videoType || 'youtube').toLowerCase();
  const youtubeThumbnail = videoType === 'youtube' ? getYouTubeThumbnailUrl(draft.videoUrl) : '';
  const image = resolveAdminImagePath(draft.thumbnailImagePath || draft.imagePath || youtubeThumbnail);
  const hostedVideo = ['hosted', 'local'].includes(videoType) ? resolvePublicAssetPath(draft.videoUrl) : '';

  useEffect(() => {
    setHasError(false);
  }, [image, hostedVideo]);

  if (image && !hasError) {
    return (
      <figure className="admin-video-preview">
        <img src={image} alt="" onError={() => setHasError(true)} />
      </figure>
    );
  }

  if (hostedVideo && !hasError) {
    return (
      <figure className="admin-video-preview">
        <video src={encodeURI(hostedVideo)} controls preload="metadata" onError={() => setHasError(true)} />
      </figure>
    );
  }

  return (
    <div className="admin-video-preview is-empty">
      <span>Video preview</span>
    </div>
  );
}

function NewsEditor({
  draft,
  updateDraft,
  uploadFile,
  uploadNewsGalleryImages,
  saveDraft,
  onDelete,
  onCancel,
}) {
  const editorType = getNewsEditorType(draft);
  const isExternalOnly = editorType === 'external';
  const isVideoStory = editorType === 'video';
  const hasRelatedSources = editorType === 'article-sources';
  const selectedVideoType = String(draft.videoType || 'youtube').toLowerCase();

  function changeType(nextType) {
    updateDraft('_editorType', nextType);
    updateDraft('isExternal', nextType === 'external');

    if (nextType === 'video') {
      updateDraft('videoType', draft.videoType || 'youtube');
    } else {
      updateDraft('videoType', '');
      updateDraft('videoUrl', '');
    }

    if (nextType !== 'article-sources') {
      updateDraft('relatedSourcesJson', '[]');
    }
  }

  return (
    <form className="admin-news-editor-page" onSubmit={saveDraft}>
      <div className="admin-editor-header admin-news-editor-title">
        <div>
          <p className="admin-kicker">News editor</p>
          <h2>{draft.id ? 'Edit news' : 'Add news'}</h2>
        </div>
        <div className="admin-action-row">
          <button className="admin-button is-cancel" type="button" onClick={onCancel}><span aria-hidden="true">↩</span>Cancel</button>
          <button className="admin-button is-danger" type="button" onClick={onDelete} disabled={!draft.id}><span aria-hidden="true">🗑</span>Delete</button>
          <button className="admin-button is-save" type="submit"><span aria-hidden="true">✓</span>Save</button>
        </div>
      </div>

      <section className="admin-editor-section">
        <h3>Story type</h3>
        <div className="admin-news-type-grid">
          {newsEditorTypes.map((type) => (
            <button
              className={type.key === editorType ? 'is-selected' : ''}
              key={type.key}
              type="button"
              onClick={() => changeType(type.key)}
            >
              <strong>{type.label}</strong>
              <span>{type.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="admin-editor-section">
        <h3>Main details</h3>
        <div className="admin-form-grid">
          <AdminField label="Title" isWide>
            <input value={draft.title ?? ''} onChange={(event) => updateDraft('title', event.target.value)} />
          </AdminField>
          <AdminField label="Slug">
            <input value={draft.slug ?? ''} onChange={(event) => updateDraft('slug', event.target.value)} />
          </AdminField>
          <AdminField label="Category">
            <select value={draft.category ?? 'News'} onChange={(event) => updateDraft('category', event.target.value)}>
              <option value="News">News</option>
              <option value="Interview">Interview</option>
            </select>
          </AdminField>
          <AdminField label="Date">
            <input type="date" value={draft.date ?? ''} onChange={(event) => updateDraft('date', event.target.value)} />
          </AdminField>
          <AdminField label="Excerpt" isWide>
            <textarea value={draft.excerpt ?? ''} onChange={(event) => updateDraft('excerpt', event.target.value)} rows={4} />
          </AdminField>
        </div>
      </section>

      {!isExternalOnly && (
        <section className="admin-editor-section">
          <h3>Photos</h3>
          <div className="admin-form-grid">
            <AdminField label="Main image">
              <input value={draft.imagePath ?? ''} onChange={(event) => updateDraft('imagePath', event.target.value)} />
              <input className="admin-file-input" type="file" accept="image/*" onChange={(event) => uploadFile(event, 'imagePath')} />
            </AdminField>
            <AdminField label="Thumbnail image">
              <input value={draft.thumbnailImagePath ?? ''} onChange={(event) => updateDraft('thumbnailImagePath', event.target.value)} />
              <input className="admin-file-input" type="file" accept="image/*" onChange={(event) => uploadFile(event, 'thumbnailImagePath')} />
            </AdminField>
          </div>
          <div className="admin-editor-section-fields">
            <h4 className="admin-subsection-title">News story gallery</h4>
            <NewsGalleryImagesEditor
              value={draft.galleryImagesJson}
              onChange={(nextValue) => updateDraft('galleryImagesJson', nextValue)}
              onUpload={uploadNewsGalleryImages}
            />
          </div>
        </section>
      )}

      {isVideoStory ? (
        <section className="admin-editor-section">
          <h3>Video</h3>
          <div className="admin-form-grid">
            <AdminField label="Video type">
              <select value={draft.videoType ?? 'youtube'} onChange={(event) => updateDraft('videoType', event.target.value)}>
                <option value="youtube">YouTube</option>
                <option value="hosted">Hosted video</option>
              </select>
            </AdminField>
            <AdminField label="Video URL" isWide>
              <input value={draft.videoUrl ?? ''} onChange={(event) => updateDraft('videoUrl', event.target.value)} />
              {selectedVideoType === 'hosted' ? (
                <input className="admin-file-input" type="file" accept="video/*" onChange={(event) => uploadFile(event, 'videoUrl')} />
              ) : null}
            </AdminField>
          </div>
          <NewsVideoPreview draft={draft} />
        </section>
      ) : null}

      {isExternalOnly ? (
        <section className="admin-editor-section">
          <h3>External article</h3>
          <div className="admin-form-grid">
            <AdminField label="Article URL" isWide>
              <input value={draft.externalUrl ?? ''} onChange={(event) => updateDraft('externalUrl', event.target.value)} />
            </AdminField>
          </div>
        </section>
      ) : (
        <section className="admin-editor-section">
          <h3>Article body</h3>
          <RichTextEditor value={draft.body ?? ''} onChange={(value) => updateDraft('body', value)} />
          <div className="admin-form-grid admin-editor-section-fields">
            <AdminField label="Original source URL" isWide>
              <input value={draft.sourceUrl ?? ''} onChange={(event) => updateDraft('sourceUrl', event.target.value)} />
            </AdminField>
          </div>
        </section>
      )}

      {hasRelatedSources && (
        <section className="admin-editor-section">
          <h3>Outside coverage</h3>
          <RelatedSourceEditor value={draft.relatedSourcesJson} onChange={(value) => updateDraft('relatedSourcesJson', value)} />
        </section>
      )}

      <section className="admin-editor-section">
        <h3>Publishing</h3>
        <div className="admin-checkbox-row">
          <label>
            <input type="checkbox" checked={Boolean(draft.hiddenFromList)} onChange={(event) => updateDraft('hiddenFromList', event.target.checked)} />
            <span>Hide from public list</span>
          </label>
        </div>
      </section>
    </form>
  );
}

function toPayload(item) {
  const payload = { ...item };

  for (const [key, value] of Object.entries(payload)) {
    if (key.startsWith('_') || /^(title|category|location|summary|description)(En|Sq)$/.test(key)) {
      delete payload[key];
      continue;
    }

    if (key === 'language' || key === 'languageName') {
      delete payload[key];
      continue;
    }

    if (value === '') payload[key] = null;
    if (key === 'date' && value) payload[key] = value;
  }

  return payload;
}

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const selectedLinkRef = useRef(null);
  const [urlPrompt, setUrlPrompt] = useState(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  function getSelectionLink() {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;

    let node = selection.anchorNode;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
        return node;
      }
      node = node.parentNode;
    }

    return null;
  }

  function applyLinkAttributes(link, url) {
    if (!link || !url) return;
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.style.textDecoration = 'underline';
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    savedSelectionRef.current = selection.getRangeAt(0);
  }

  function restoreSelection() {
    const selection = window.getSelection();
    const savedRange = savedSelectionRef.current;
    if (!selection || !savedRange) return;

    selection.removeAllRanges();
    selection.addRange(savedRange);
  }

  function run(command) {
    if (command === 'createLink' || command === 'insertImage') {
      rememberSelection();
      const selectedLink = command === 'createLink' ? getSelectionLink() : null;
      selectedLinkRef.current = selectedLink;
      setUrlPrompt({
        command,
        label: command === 'createLink' ? 'Link URL' : 'Image URL',
        title: command === 'createLink' ? 'Add link' : 'Add image',
        placeholder: command === 'createLink' ? 'https://example.com/article' : 'https://example.com/image.jpg',
        initialValue: selectedLink?.getAttribute('href') ?? '',
        submitLabel: command === 'createLink' ? 'Apply link' : 'Insert',
      });
      return;
    } else {
      document.execCommand(command, false, null);
    }

    onChange(editorRef.current.innerHTML);
  }

  function applyUrlPrompt(url) {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !urlPrompt) {
      selectedLinkRef.current = null;
      setUrlPrompt(null);
      return;
    }

    editorRef.current?.focus();
    restoreSelection();
    if (urlPrompt.command === 'createLink') {
      const existingLink = selectedLinkRef.current ?? getSelectionLink();
      if (existingLink) {
        applyLinkAttributes(existingLink, trimmedUrl);
      } else {
        document.execCommand('createLink', false, trimmedUrl);
        applyLinkAttributes(getSelectionLink(), trimmedUrl);
      }
    } else {
      document.execCommand(urlPrompt.command, false, trimmedUrl);
    }
    onChange(editorRef.current.innerHTML);
    selectedLinkRef.current = null;
    setUrlPrompt(null);
  }

  return (
    <div className="admin-richtext">
      <div className="admin-richtext-toolbar" aria-label="Rich text tools">
        <button type="button" onClick={() => run('bold')} title="Bold">B</button>
        <button type="button" onClick={() => run('italic')} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => run('underline')} title="Underline"><u>U</u></button>
        <button type="button" onClick={() => run('createLink')} title="Add link">Link</button>
        <button type="button" onClick={() => run('insertImage')} title="Add image">Image</button>
        <button type="button" onClick={() => run('removeFormat')} title="Clear formatting">Clear</button>
      </div>
      <div
        ref={editorRef}
        className="admin-richtext-editor"
        contentEditable
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onMouseUp={() => {
          selectedLinkRef.current = getSelectionLink();
        }}
        onKeyUp={() => {
          selectedLinkRef.current = getSelectionLink();
        }}
        role="textbox"
        aria-multiline="true"
        tabIndex={0}
      />
      {urlPrompt && (
        <UrlPromptModal
          prompt={urlPrompt}
          onCancel={() => setUrlPrompt(null)}
          onSubmit={applyUrlPrompt}
        />
      )}
    </div>
  );
}

function UrlPromptModal({ prompt, onCancel, onSubmit }) {
  const [url, setUrl] = useState(prompt.initialValue ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setUrl(prompt.initialValue ?? '');
  }, [prompt.initialValue]);

  function submit() {
    onSubmit(url);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="admin-modal admin-dialog-modal" role="dialog" aria-modal="true" aria-labelledby="admin-url-prompt-title">
      <button className="admin-modal-backdrop" type="button" onClick={onCancel} aria-label="Close dialog" />
      <div className="admin-dialog-panel">
        <div>
          <p className="admin-kicker">Text formatting</p>
          <h2 id="admin-url-prompt-title">{prompt.title}</h2>
        </div>
        <label>
          <span>{prompt.label}</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={prompt.placeholder}
          />
        </label>
        <div className="admin-dialog-actions">
          <button className="admin-button is-cancel" type="button" onClick={onCancel}><span aria-hidden="true">↩</span>Cancel</button>
          <button className="admin-button is-save" type="button" onClick={submit}><span aria-hidden="true">✓</span>{prompt.submitLabel || 'Insert'}</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ dialog, onCancel, onConfirm }) {
  if (!dialog) return null;

  return (
    <div className="admin-modal admin-dialog-modal" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title">
      <button className="admin-modal-backdrop" type="button" onClick={onCancel} aria-label="Close dialog" />
      <div className="admin-dialog-panel">
        <div>
          <p className="admin-kicker">{dialog.kicker || 'Please confirm'}</p>
          <h2 id="admin-confirm-title">{dialog.title}</h2>
        </div>
        {dialog.message && <p>{dialog.message}</p>}
        <div className="admin-dialog-actions">
          <button className="admin-button is-cancel" type="button" onClick={onCancel}><span aria-hidden="true">↩</span>Cancel</button>
          <button className={`admin-button ${dialog.destructive ? 'is-danger' : 'is-save'}`} type="button" onClick={onConfirm}>
            <span aria-hidden="true">{dialog.destructive ? '🗑' : '✓'}</span>
            {dialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(moduleConfigs[0].key);
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({});
  const [homeDraft, setHomeDraft] = useState(homepageDefaults);
  const [settingsDraft, setSettingsDraft] = useState(siteSettingDefaults);
  const [poetryHouseDraft, setPoetryHouseDraft] = useState(poetryHouseDefaults);
  const [translationDraft, setTranslationDraft] = useState({});
  const [homePreviewBooks, setHomePreviewBooks] = useState([]);
  const [adminLanguage, setAdminLanguage] = useState('en');
  const [homeSettingRecords, setHomeSettingRecords] = useState(new Map());
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [poemLanguageOptions, setPoemLanguageOptions] = useState([]);
  const [poemLanguageFilter, setPoemLanguageFilter] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [draggedGalleryId, setDraggedGalleryId] = useState(null);
  const [pendingGalleryOrder, setPendingGalleryOrder] = useState(null);
  const [adminUser, setAdminUser] = useState({ displayName: 'Admin', username: 'admin' });
  const [userDraft, setUserDraft] = useState({
    displayName: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [userStatus, setUserStatus] = useState('');
  const activeConfig = useMemo(() => getModuleConfig(activeKey), [activeKey]);
  const selectedId = draft?.id;
  const filteredItems = sortNewestAdminItems(activeConfig.key, items.filter((item) => {
    const matchesPoemLanguage = activeConfig.key !== 'poems'
      || poemLanguageFilter === 'all'
      || String(item.poemLanguageId) === poemLanguageFilter;
    const haystack = [
      item.title,
      item.slug,
      item.category,
      item.key,
      item.value,
      item.authorName,
      item.caption,
      item.languageName,
      item.language?.name,
    ].filter(Boolean).join(' ').toLowerCase();

    return matchesPoemLanguage && haystack.includes(searchTerm.toLowerCase());
  }));

  useEffect(() => {
    if (!status) return undefined;

    const lowered = status.toLowerCase();
    if (lowered.includes('saving') || lowered.includes('uploading') || lowered.includes('deleting')) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatus('');
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  function getStatusTone(message) {
    const lowered = String(message || '').toLowerCase();
    if (lowered.includes('failed') || lowered.includes('error') || lowered.includes('could not')) return 'error';
    if (lowered.includes('saving') || lowered.includes('uploading') || lowered.includes('deleting')) return 'info';
    if (lowered.includes('saved') || lowered.includes('uploaded') || lowered.includes('deleted')) return 'success';
    return 'info';
  }

  function updateUserDraft(key, value) {
    setUserDraft((current) => ({ ...current, [key]: value }));
  }

  function getPasswordRequirementState(password) {
    return [
      ['At least 8 characters', password.length >= 8],
      ['One uppercase letter', /[A-Z]/.test(password)],
      ['One lowercase letter', /[a-z]/.test(password)],
      ['One number', /\d/.test(password)],
      ['One symbol', /[^A-Za-z0-9]/.test(password)],
    ];
  }

  function getPasswordValidationError(password) {
    if (!password) return null;
    const missingRequirement = getPasswordRequirementState(password).find(([, isMet]) => !isMet);
    return missingRequirement ? `Password requirement missing: ${missingRequirement[0].toLowerCase()}.` : null;
  }

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      cache: 'no-store',
      credentials: 'include',
      headers: options.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
      ...options,
    });

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
      const error = new Error(message);
      error.status = response.status;
      error.path = path;
      throw error;
    }

    return responseData;
  }

  function getRequestErrorMessage(error) {
    if (error?.status === 401) {
      return 'Your admin session expired. Please log in again.';
    }

    const detail = error?.path ? `${error.path}: ` : '';
    return `${detail}${error?.message || 'Request failed.'}`;
  }

  function handleRequestError(error) {
    if (error?.status === 401) {
      window.setTimeout(() => navigate('/admin-login', { replace: true }), 900);
    }

    return getRequestErrorMessage(error);
  }

  async function loadItems(config = activeConfig, options = {}) {
    const { preserveStatus = false } = options;
    setIsLoading(true);
    if (!preserveStatus) {
      setStatus('');
    }
    try {
      if (config.key === 'edit-user') {
        const data = await request('/api/auth/me');
        const nextUser = {
          displayName: data.displayName || 'Admin',
          username: data.username || 'admin',
        };
        setAdminUser(nextUser);
        setUserDraft({
          displayName: nextUser.displayName,
          username: nextUser.username,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setUserStatus('');
        setHomePreviewBooks([]);
        setItems([]);
        return;
      }

      if (config.key === 'home') {
        const otherLanguage = adminLanguage === 'sq' ? 'en' : 'sq';
        const [data, otherSiteTranslations, siteTranslations, homeSections, books] = await Promise.all([
          request('/api/site-settings'),
          request(`/api/site-translations?lang=${otherLanguage}`),
          request(`/api/site-translations?lang=${adminLanguage}`),
          request(`/api/page-sections/home?lang=${adminLanguage}`),
          request(`/api/books?lang=${adminLanguage}`),
        ]);
        const records = new Map(data.map((setting) => [setting.key, setting]));
        addTranslationsToRecords(records, otherSiteTranslations);
        addTranslationsToRecords(records, siteTranslations, { force: true });
        const heroSection = homeSections.find((section) => section.sectionKey === 'hero');
        if (heroSection) {
          setSectionSettingRecord(records, 'heroTitle', adminLanguage, heroSection.title ?? '');
          setSectionSettingRecord(records, 'heroText', adminLanguage, heroSection.content ?? '');
        }
        setHomeSettingRecords(records);
        setHomeDraft(buildDraftFromSettings(records, homepageDefaults, homepageFields.map(([key]) => key), adminLanguage));
        setTranslationDraft(buildTranslationDraft(records, adminLanguage));
        setHomePreviewBooks(getHomepagePreviewBooks(books));
        setItems([]);
        return;
      }

      if (config.key === 'page-text') {
        const otherLanguage = adminLanguage === 'sq' ? 'en' : 'sq';
        const [data, otherSiteTranslations, siteTranslations] = await Promise.all([
          request('/api/site-settings'),
          request(`/api/site-translations?lang=${otherLanguage}`),
          request(`/api/site-translations?lang=${adminLanguage}`),
        ]);
        const records = new Map(data.map((setting) => [setting.key, setting]));
        addTranslationsToRecords(records, otherSiteTranslations);
        addTranslationsToRecords(records, siteTranslations, { force: true });
        setHomeSettingRecords(records);
        setTranslationDraft(buildTranslationDraft(records, adminLanguage));
        setHomePreviewBooks([]);
        setItems([]);
        return;
      }

      if (config.key === 'settings' || config.key === 'media-links') {
        const otherLanguage = adminLanguage === 'sq' ? 'en' : 'sq';
        const [data, otherSiteTranslations, siteTranslations, sections] = await Promise.all([
          request('/api/site-settings'),
          request(`/api/site-translations?lang=${otherLanguage}`),
          request(`/api/site-translations?lang=${adminLanguage}`),
          request(`/api/page-sections/${config.key === 'media-links' ? 'media' : 'about'}?lang=${adminLanguage}`),
        ]);
        const records = new Map(data.map((setting) => [setting.key, setting]));
        addTranslationsToRecords(records, otherSiteTranslations);
        addTranslationsToRecords(records, siteTranslations, { force: true });
        const sectionValues = {
          'aboutIntroParagraphs': sections.find((section) => section.sectionKey === 'intro')?.content,
          biography: sections.find((section) => section.sectionKey === 'biography')?.content,
          quickFacts: sections.find((section) => section.sectionKey === 'quick-facts')?.extraJson,
          mediaSpotlightLinks: sections.find((section) => section.sectionKey === 'spotlight-links')?.extraJson,
        };
        Object.entries(sectionValues).forEach(([key, value]) => {
          if (value !== undefined && value !== null) setSectionSettingRecord(records, key, adminLanguage, value);
        });
        setHomeSettingRecords(records);
        setSettingsDraft(buildDraftFromSettings(records, siteSettingDefaults, getSiteSettingKeysForConfig(config.key), adminLanguage));
        setTranslationDraft(buildTranslationDraft(records, adminLanguage));
        setHomePreviewBooks([]);
        setItems([]);
        return;
      }

      if (config.key === 'poetry-house') {
        const sections = await request(`/api/page-sections/poetry-house?lang=${adminLanguage}&fallback=false`);
        setPoetryHouseDraft(buildPoetryHouseDraft(sections));
        setHomePreviewBooks([]);
        setItems([]);
        return;
      }

      const collectionEndpoint = adminContentTranslationFields[config.key]
        ? `${config.endpoint}${config.endpoint.includes('?') ? '&' : '?'}lang=${encodeURIComponent(adminLanguage)}`
        : config.endpoint;
      const translationLanguageCodes = config.key === 'books' ? ['en', 'sq'] : [adminLanguage];
      const [data, settings] = adminContentTranslationFields[config.key]
        ? await Promise.all([
            request(collectionEndpoint),
            Promise.all(translationLanguageCodes.map((languageCode) => (
              request(`/api/content-translations?collection=${config.key}&lang=${languageCode}`)
            ))).then((groups) => groups.flat()),
          ])
        : [await request(collectionEndpoint), []];
      const records = new Map(settings.flatMap((translation) => Object.entries(translation.fields ?? {}).map(([field, value]) => [
        contentTranslationKey(config.key, translation.parentId, field, translation.languageCode ?? adminLanguage),
        { value },
      ])));
      if (adminContentTranslationFields[config.key]) {
        setHomeSettingRecords(records);
      }
      const nextItems = Array.isArray(data)
        ? data.map((item) => applyAdminContentTranslations(config.key, item, records, adminLanguage))
        : [];
      setHomePreviewBooks([]);
      setItems(nextItems);
      setDraft((current) => {
        if (!isModalOpen) return config.empty;
        if (!current?.id) return Object.keys(current ?? {}).length ? current : config.empty;

        const translatedItem = nextItems.find((item) => item.id === current.id);
        return translatedItem ? normalizeItem(config, translatedItem) : current;
      });

      if (config.key === 'poems') {
        const languages = await request('/api/poems/languages');
        setPoemLanguageOptions(Array.isArray(languages) ? languages : []);
      }
    } catch (error) {
      setStatus(`Could not load ${config.label}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadItems(activeConfig);
  }, [activeConfig, adminLanguage]);

  function updateDraft(key, value) {
    setDraft((current) => {
      const nextDraft = { ...current, [key]: value };

      if (['books', 'news'].includes(activeConfig.key) && key === 'title' && !current.id && !isSlugEdited) {
        nextDraft.slug = slugFromText(value);
      }

      if (activeConfig.key === 'poems' && key === 'title' && !current.id) {
        nextDraft.slug = slugFromText(value);
      }

      if (activeConfig.key === 'awards' && key === 'title' && !current.id) {
        nextDraft.slug = slugFromText(value);
      }

      if (activeConfig.key === 'news') {
        const nextVideoType = String(nextDraft.videoType || '').toLowerCase();
        const nextVideoUrl = nextDraft.videoUrl || '';
        const youtubeThumbnail = nextVideoType === 'youtube' ? getYouTubeThumbnailUrl(nextVideoUrl) : '';

        if (youtubeThumbnail) {
          if (!current.imagePath || isYouTubeThumbnail(current.imagePath)) {
            nextDraft.imagePath = youtubeThumbnail;
          }

          if (!current.thumbnailImagePath || isYouTubeThumbnail(current.thumbnailImagePath)) {
            nextDraft.thumbnailImagePath = youtubeThumbnail;
          }
        }
      }

      if (activeConfig.key === 'video-poetry') {
        const nextType = String(nextDraft.type || '').toLowerCase();

        if (key === 'type') {
          if (nextType === 'youtube') {
            nextDraft.filename = '';
            nextDraft.thumbnailImagePath = getYouTubeThumbnailUrl(nextDraft.url) || '';
          }

          if (nextType === 'local') {
            nextDraft.thumbnailImagePath = '';
            nextDraft.filename = '';
            nextDraft.previewTime = nextDraft.previewTime || '';
          }
        }

        if (nextType === 'youtube' && key === 'url') {
          nextDraft.thumbnailImagePath = getYouTubeThumbnailUrl(value) || '';
          nextDraft.filename = '';
        }
      }

      return nextDraft;
    });
  }

  function updateField(key, value) {
    if (['books', 'news'].includes(activeConfig.key) && key === 'slug') {
      setIsSlugEdited(Boolean(value));
    }

    updateDraft(key, value);
  }

  function switchModule(key) {
    if (modulesWithoutAdminLanguageSwitch.has(key)) {
      setAdminLanguage('en');
    }

    setActiveKey(key);
    setSearchTerm('');
    setPoemLanguageFilter('all');
    setPreviewItem(null);
    setIsModalOpen(false);
    setIsSlugEdited(false);
    setUserStatus('');
  }

  function updateHomeDraft(key, value) {
    setHomeDraft((current) => ({ ...current, [key]: value }));
  }

  function updateSettingsDraft(key, value) {
    setSettingsDraft((current) => ({ ...current, [key]: value }));
  }

  function updatePoetryHouseDraft(key, value) {
    setPoetryHouseDraft((current) => ({ ...current, [key]: value }));
  }

  function updateTranslationDraft(key, value) {
    setTranslationDraft((current) => ({ ...current, [key]: value }));
  }

  function openNewModal() {
    setDraft(activeConfig.empty);
    setIsSlugEdited(false);
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setDraft(normalizeItem(activeConfig, item));
    setIsSlugEdited(true);
    setIsModalOpen(true);
  }

  async function saveSettingRecord(key, value) {
    const existing = homeSettingRecords.get(key);

    if (existing) {
      await request(`/api/site-settings/${existing.id}`, {
        method: 'PUT',
        body: JSON.stringify({ id: existing.id, key, value: value ?? '' }),
      });
      return;
    }

    await request('/api/site-settings', {
      method: 'POST',
      body: JSON.stringify({ key, value: value ?? '' }),
    });
  }

  async function saveSiteTranslationRecord(key, language, value) {
    await request('/api/site-translations', {
      method: 'POST',
      body: JSON.stringify({
        key,
        languageCode: language,
        value: value ?? '',
      }),
    });
  }

  async function saveContentTranslationRecord(collection, parentId, language, fields) {
    await request('/api/content-translations', {
      method: 'POST',
      body: JSON.stringify({
        collection,
        parentId: String(parentId),
        languageCode: language,
        fields,
      }),
    });
  }

  async function savePageSectionTranslation(pageKey, sectionKey, language, fields) {
    await request(`/api/page-sections/${pageKey}/${sectionKey}/translations`, {
      method: 'POST',
      body: JSON.stringify({
        languageCode: language,
        title: fields.title ?? null,
        subtitle: fields.subtitle ?? null,
        content: fields.content ?? null,
        extraJson: fields.extraJson ?? null,
      }),
    });
  }

  async function refreshAfterMutation(successMessage, config = activeConfig) {
    setStatus(successMessage);
    try {
      await loadItems(config, { preserveStatus: true });
      setStatus(successMessage);
    } catch (error) {
      setStatus(`${successMessage} Refresh failed: ${error.message}`);
    }
  }

  async function saveHomepage(event) {
    event.preventDefault();
    setStatus(`Saving homepage (${adminLanguage.toUpperCase()})...`);

    try {
      const saveRequests = [];
      for (const [key, value] of Object.entries(homeDraft)) {
        if (key === 'heroTitle' || key === 'heroText') continue;
        if (localizedSiteSettingKeys.has(key)) {
          saveRequests.push(saveSiteTranslationRecord(key, adminLanguage, value));
          continue;
        }
        saveRequests.push(saveSettingRecord(languageSettingKey(key, adminLanguage), value));
      }
      saveRequests.push(savePageSectionTranslation('home', 'hero', adminLanguage, {
        title: homeDraft.heroTitle ?? '',
        content: homeDraft.heroText ?? '',
      }));
      for (const key of homepageTranslationKeys) {
        saveRequests.push(saveSiteTranslationRecord(key, adminLanguage, translationDraft[key] ?? ''));
      }
      await Promise.all(saveRequests);

      await refreshAfterMutation(`Homepage saved for ${adminLanguage.toUpperCase()}.`);
    } catch (error) {
      setStatus(`Homepage save failed: ${error.message}`);
    }
  }

  async function saveSettings(event) {
    event.preventDefault();
    setStatus(`Saving site settings (${adminLanguage.toUpperCase()})...`);

    try {
      const saveRequests = [];
      for (const key of getSiteSettingKeysForConfig(activeConfig.key)) {
        const value = settingsDraft[key];
        const serializedValue = serializeSiteSettingValue(key, value);
        if (key === 'aboutIntroParagraphs') {
          saveRequests.push(savePageSectionTranslation('about', 'intro', adminLanguage, { content: serializedValue }));
          continue;
        }
        if (key === 'biography') {
          saveRequests.push(savePageSectionTranslation('about', 'biography', adminLanguage, { content: serializedValue }));
          continue;
        }
        if (key === 'quickFacts') {
          saveRequests.push(savePageSectionTranslation('about', 'quick-facts', adminLanguage, { extraJson: serializedValue }));
          continue;
        }
        if (key === 'mediaSpotlightLinks') {
          saveRequests.push(savePageSectionTranslation('media', 'spotlight-links', adminLanguage, { extraJson: serializedValue }));
          continue;
        }
        saveRequests.push(saveSettingRecord(languageSettingKey(key, adminLanguage), serializedValue));
      }
      if (activeConfig.key === 'settings') {
        for (const key of aboutTranslationKeys) {
          saveRequests.push(saveSiteTranslationRecord(key, adminLanguage, translationDraft[key] ?? ''));
        }
      }
      await Promise.all(saveRequests);

      await refreshAfterMutation(`${activeConfig.label} saved for ${adminLanguage.toUpperCase()}.`);
    } catch (error) {
      setStatus(`Site settings save failed: ${error.message}`);
    }
  }

  async function saveTranslations(event) {
    event.preventDefault();
    setStatus(`Saving page text (${adminLanguage.toUpperCase()})...`);

    try {
      const editableTranslationKeys = new Set(editableTranslationGroups.flatMap((group) => group.keys));
      await Promise.all(Object.entries(translationDraft)
        .filter(([key]) => editableTranslationKeys.has(key))
        .map(([key, value]) => saveSiteTranslationRecord(key, adminLanguage, value)));

      await refreshAfterMutation(`Page text saved for ${adminLanguage.toUpperCase()}.`);
    } catch (error) {
      setStatus(`Page text save failed: ${error.message}`);
    }
  }

  async function saveDraft(event) {
    event.preventDefault();
    setStatus(activeConfig.key === 'news' ? 'Saving news...' : 'Saving...');
    try {
      const translatedFields = adminContentTranslationFields[activeConfig.key] ?? [];

      if (activeConfig.key !== 'books' && adminLanguage !== 'en' && draft.id && translatedFields.length > 0) {
        await saveContentTranslationRecord(activeConfig.key, draft.id, adminLanguage, Object.fromEntries(
          translatedFields.map((field) => [field, draft[field] ?? ''])
        ));

        setIsModalOpen(false);
        await refreshAfterMutation(`${activeConfig.label} translation saved for ${adminLanguage.toUpperCase()}.`);
        return;
      }

      const draftToSave = {
        ...draft,
        ...(activeConfig.key === 'books'
          ? {
              slug: draft.slug || slugFromText(draft.title || 'book'),
            }
          : {}),
        ...(activeConfig.key === 'news'
          ? {
              slug: slugFromText(draft.title || draft.slug || 'news'),
              ...(String(draft.videoType || '').toLowerCase() === 'youtube' && getYouTubeThumbnailUrl(draft.videoUrl)
                ? {
                    imagePath: draft.imagePath || getYouTubeThumbnailUrl(draft.videoUrl),
                    thumbnailImagePath: draft.thumbnailImagePath || getYouTubeThumbnailUrl(draft.videoUrl),
                  }
                : {}),
            }
          : {}),
        ...(activeConfig.key === 'poems'
          ? {
              slug: draft.slug || slugFromText(draft.title || 'poem'),
              excerpt: draft.excerpt || buildExcerptFromBody(draft.body),
              displayOrder: draft.displayOrder ?? items.length,
            }
          : {}),
        ...(activeConfig.key === 'video-poetry'
          ? {
              slug: draft.slug || slugFromText(draft.title || 'video'),
              type: String(draft.type || 'youtube').toLowerCase(),
              filename: String(draft.type || '').toLowerCase() === 'local' && !draft.url ? draft.filename : '',
              thumbnailImagePath: String(draft.type || '').toLowerCase() === 'youtube'
                ? getYouTubeThumbnailUrl(draft.url) || draft.thumbnailImagePath
                : '',
              displayOrder: draft.displayOrder ?? items.length,
            }
          : {}),
        ...(activeConfig.key === 'awards' ? { slug: draft.slug || slugFromText(draft.title || 'award') } : {}),
      };
      const payload = toPayload(draftToSave);
      let savedItem = draftToSave;
      if (draft.id) {
        await request(`${activeConfig.endpoint}/${draft.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        savedItem = { ...draftToSave, id: draft.id };
      } else {
        savedItem = await request(activeConfig.endpoint, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (translatedFields.length > 0 && savedItem?.id) {
        await saveContentTranslationRecord(activeConfig.key, savedItem.id, adminLanguage, Object.fromEntries(
          translatedFields.map((field) => [field, draftToSave[field] ?? ''])
        ));
      }

      setIsModalOpen(false);
      await refreshAfterMutation(activeConfig.key === 'news' ? 'Your news was saved successfully.' : 'Saved.');
    } catch (error) {
      setStatus(`Save failed: ${error.message}`);
    }
  }

  function closeConfirmDialog() {
    setConfirmDialog(null);
  }

  function askDeleteDraft() {
    if (!draft.id) return;
    setConfirmDialog({
      type: 'delete-draft',
      kicker: activeConfig.label,
      title: 'Delete this item?',
      message: 'This will remove the item from the database.',
      confirmLabel: 'Delete',
      destructive: true,
    });
  }

  async function deleteDraft() {
    if (!draft.id) return;
    closeConfirmDialog();
    setStatus('Deleting...');
    try {
      await request(`${activeConfig.endpoint}/${draft.id}`, { method: 'DELETE' });
      setIsModalOpen(false);
      await refreshAfterMutation('Deleted.');
    } catch (error) {
      setStatus(`Delete failed: ${error.message}`);
    }
  }

  function askDeleteItem(item) {
    if (!item.id) return;
    setConfirmDialog({
      type: 'delete-item',
      item,
      kicker: activeConfig.label,
      title: 'Delete this item?',
      message: item.title || item.caption || item.authorName || 'This will remove the item from the database.',
      confirmLabel: 'Delete',
      destructive: true,
    });
  }

  async function deleteItem(item) {
    if (!item.id) return;
    closeConfirmDialog();
    setStatus('Deleting...');
    try {
      await request(`${activeConfig.endpoint}/${item.id}`, { method: 'DELETE' });
      setPreviewItem(null);
      await refreshAfterMutation('Deleted.');
    } catch (error) {
      setStatus(`Delete failed: ${error.message}`);
    }
  }

  function updateGalleryCaption(itemId, caption) {
    setItems((currentItems) => currentItems.map((item) => (
      item.id === itemId ? { ...item, caption } : item
    )));
    setPreviewItem((currentItem) => (
      currentItem?.id === itemId ? { ...currentItem, caption } : currentItem
    ));
  }

  async function persistGalleryOrder(nextItems) {
    try {
      const galleryItems = sortNewestAdminItems('gallery', nextItems)
        .map((item, index) => ({ ...item, displayOrder: index }));

      await Promise.all(galleryItems.map((item) => request(`/api/gallery/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(toPayload(item)),
      })));
      setStatus('Gallery order saved.');
    } catch (error) {
      setStatus(`Gallery order save failed: ${error.message}`);
      await loadItems(activeConfig);
    }
  }

  function moveGalleryItem(targetId) {
    if (!draggedGalleryId || draggedGalleryId === targetId) return;

    setItems((currentItems) => {
      const orderedGallery = sortNewestAdminItems('gallery', currentItems);
      const fromIndex = orderedGallery.findIndex((item) => item.id === draggedGalleryId);
      const toIndex = orderedGallery.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return currentItems;

      const nextOrderedGallery = [...orderedGallery];
      const [movedItem] = nextOrderedGallery.splice(fromIndex, 1);
      nextOrderedGallery.splice(toIndex, 0, movedItem);

      const nextItems = nextOrderedGallery.map((item, index) => ({ ...item, displayOrder: index }));
      setPendingGalleryOrder(nextItems);
      return nextItems;
    });
  }

  function finishGalleryDrag() {
    setDraggedGalleryId(null);
    if (!pendingGalleryOrder) return;

    void persistGalleryOrder(pendingGalleryOrder);
    setPendingGalleryOrder(null);
  }

  async function saveGalleryCaption(item) {
    if (!item.id) return;

    setStatus(`Saving caption (${adminLanguage.toUpperCase()})...`);
    try {
      await saveContentTranslationRecord('gallery', item.id, adminLanguage, { caption: item.caption ?? '' });
      await refreshAfterMutation(`Caption saved for ${adminLanguage.toUpperCase()}.`);
    } catch (error) {
      setStatus(`Caption save failed: ${error.message}`);
    }
  }

  async function uploadFile(event, targetField) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setStatus('Uploading...');
    try {
      const data = await request(`/api/uploads/${activeConfig.uploadFolder}`, {
        method: 'POST',
        body: formData,
      });
      updateDraft(targetField, data.path);
      setStatus('Uploaded.');
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`);
    } finally {
      event.target.value = '';
    }
  }

  async function uploadNewsGalleryImages(files, existingImages = []) {
    setStatus(files.length > 1 ? 'Uploading gallery images...' : 'Uploading gallery image...');

    try {
      const uploadedPaths = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const data = await request(`/api/uploads/${activeConfig.uploadFolder}`, {
          method: 'POST',
          body: formData,
        });

        uploadedPaths.push(data.path);
      }

      updateDraft('galleryImagesJson', galleryImagesToPayload([...existingImages, ...uploadedPaths]));
      setStatus(files.length > 1 ? 'Gallery images uploaded.' : 'Gallery image uploaded.');
    } catch (error) {
      setStatus(`Gallery upload failed: ${error.message}`);
    }
  }

  async function uploadHomeFile(event, targetField) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setStatus('Uploading...');
    try {
      const data = await request('/api/uploads/homepage', {
        method: 'POST',
        body: formData,
      });
      updateHomeDraft(targetField, data.path);
      setStatus('Uploaded.');
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`);
    } finally {
      event.target.value = '';
    }
  }

  async function uploadSettingFile(event, targetField, folder = 'settings') {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setStatus('Uploading...');
    try {
      const data = await request(`/api/uploads/${folder}`, {
        method: 'POST',
        body: formData,
      });
      updateSettingsDraft(targetField, data.path);
      setStatus('Uploaded.');
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`);
    } finally {
      event.target.value = '';
    }
  }

  async function uploadGalleryFiles(event) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setStatus('Uploading gallery images...');
    try {
      await Promise.all(items.map((item) => request(`/api/gallery/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(toPayload({ ...item, displayOrder: Number(item.displayOrder || 0) + files.length })),
      })));

      for (const [index, file] of files.entries()) {
        const formData = new FormData();
        formData.append('file', file);
        const data = await request('/api/uploads/gallery', {
          method: 'POST',
          body: formData,
        });

        const caption = file.name.replace(/\.[^.]+$/, '');
        const image = await request('/api/gallery', {
          method: 'POST',
          body: JSON.stringify({
            imagePath: data.path,
            caption,
            displayOrder: index,
            isFeatured: false,
          }),
        });
        if (image?.id) {
          await saveContentTranslationRecord('gallery', image.id, adminLanguage, { caption });
        }
      }

      setStatus('Gallery images uploaded.');
      await loadItems(activeConfig);
    } catch (error) {
      setStatus(`Gallery upload failed: ${error.message}`);
    } finally {
      event.target.value = '';
    }
  }

  function confirmCurrentDialog() {
    if (confirmDialog?.type === 'delete-draft') {
      deleteDraft();
      return;
    }

    if (confirmDialog?.type === 'delete-item') {
      deleteItem(confirmDialog.item);
      return;
    }

  }

  async function logoutAdmin() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // The local session should still leave the admin area if logout cannot reach the server.
    }

    window.location.assign(APP_BASE);
  }

  async function saveUserProfile(event) {
    event.preventDefault();
    setUserStatus('');

    if (userDraft.displayName.trim().length < 2) {
      setUserStatus('Name must be at least 2 characters.');
      return;
    }

    if (userDraft.username.trim().length < 3) {
      setUserStatus('Username must be at least 3 characters.');
      return;
    }

    if (!userDraft.currentPassword) {
      setUserStatus('Current password is required to save changes.');
      return;
    }

    if (userDraft.newPassword || userDraft.confirmPassword) {
      if (userDraft.newPassword !== userDraft.confirmPassword) {
        setUserStatus('New passwords do not match.');
        return;
      }

      const passwordError = getPasswordValidationError(userDraft.newPassword);
      if (passwordError) {
        setUserStatus(passwordError);
        return;
      }
    }

    setUserStatus('Saving user...');

    try {
      const updatedUser = await request('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          displayName: userDraft.displayName,
          username: userDraft.username,
          currentPassword: userDraft.currentPassword,
          newPassword: userDraft.newPassword || null,
        }),
      });
      const nextUser = {
        displayName: updatedUser.displayName || userDraft.displayName,
        username: updatedUser.username || userDraft.username,
      };
      setAdminUser(nextUser);
      setUserDraft({
        displayName: nextUser.displayName,
        username: nextUser.username,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setUserStatus('User saved.');
    } catch (error) {
      setUserStatus(`User save failed: ${error.message}`);
    }
  }

  const adminInitials = adminUser.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A';

  function selectModule(key) {
    switchModule(key);
    setIsMobileNavOpen(false);
  }

  async function uploadPoetryHouseFile(event, rowIndex, collectionKey) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setStatus('Uploading...');
    try {
      const data = await request('/api/uploads/poetryhouse', {
        method: 'POST',
        body: formData,
      });
      setPoetryHouseDraft((current) => {
        const rows = [...(current[collectionKey] ?? [])];
        rows[rowIndex] = {
          ...(rows[rowIndex] ?? {}),
          [collectionKey === 'externalNews' ? 'image' : 'src']: data.path,
        };
        return { ...current, [collectionKey]: rows };
      });
      setStatus('Uploaded.');
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`);
    } finally {
      event.target.value = '';
    }
  }

  async function savePoetryHouse(event) {
    event.preventDefault();
    setStatus(`Saving Poetry House (${adminLanguage.toUpperCase()})...`);

    try {
      const sectionsToSave = [
        ['hero', {
          title: poetryHouseDraft.heroTitle,
          subtitle: poetryHouseDraft.heroSubtitle,
          content: poetryHouseDraft.heroContent,
          extraJson: JSON.stringify({
            eyebrow: poetryHouseDraft.heroEyebrow,
            ctaLabel: poetryHouseDraft.heroCtaLabel,
          }),
        }],
        ['video', {
          title: poetryHouseDraft.videoTitle,
          content: poetryHouseDraft.videoContent,
          extraJson: JSON.stringify({
            eyebrow: poetryHouseDraft.videoEyebrow,
            videoUrl: poetryHouseDraft.videoUrl,
          }),
        }],
        ['gallery', {
          title: poetryHouseDraft.galleryTitle,
          content: poetryHouseDraft.galleryContent,
          extraJson: JSON.stringify({
            eyebrow: poetryHouseDraft.galleryEyebrow,
            images: poetryHouseGalleryToPayload(poetryHouseDraft.galleryImages),
          }),
        }],
        ['news', {
          title: poetryHouseDraft.newsTitle,
          content: poetryHouseDraft.newsContent,
          extraJson: JSON.stringify({
            eyebrow: poetryHouseDraft.newsEyebrow,
            emptyText: poetryHouseDraft.newsEmptyText,
            externalNews: poetryHouseExternalNewsToPayload(poetryHouseDraft.externalNews),
          }),
        }],
      ];

      await Promise.all(sectionsToSave.map(([sectionKey, fields]) => (
        savePageSectionTranslation('poetry-house', sectionKey, adminLanguage, fields)
      )));

      setStatus(`Poetry House saved for ${adminLanguage.toUpperCase()}.`);
    } catch (error) {
      setStatus(`Poetry House save failed: ${error.message}`);
    }
  }

  return (
    <main className={`admin-shell${adminLanguage === 'sq' ? ' is-albanian-language' : ''}`}>
      <aside className={`admin-sidebar${isMobileNavOpen ? ' is-open' : ''}`} aria-label="Admin navigation">
        <div className="admin-brand">
          <span><img src={adminLogo} alt="Lulzim Tafa" /></span>
          <div>
            <strong>Lulzim Tafa</strong>
            <small>Content Studio</small>
          </div>
          <button
            className="admin-nav-toggle"
            type="button"
            aria-expanded={isMobileNavOpen}
            aria-controls="admin-mobile-navigation"
            onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
          >
            <span aria-hidden="true">{isMobileNavOpen ? '×' : '☰'}</span>
            Menu
          </button>
        </div>

        <nav className="admin-tabs" id="admin-mobile-navigation" aria-label="Admin modules">
          <p>Manage</p>
          {moduleNavGroups.map((group) => (
            <div className="admin-nav-group" key={group.title}>
              {/* <div className="admin-nav-group-heading">
                <strong>{group.title}</strong>
                <small>{group.description}</small>
              </div> */}
              {group.moduleKeys.map((key) => {
                const config = getModuleConfig(key);
                if (!config) return null;

                return (
                  <button
                    key={config.key}
                    type="button"
                    className={config.key === activeKey ? 'is-active' : ''}
                    onClick={() => selectModule(config.key)}
                  >
                    <span aria-hidden="true">{config.icon}</span>
                    {config.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span>{adminInitials}</span>
          <div>
            <strong>{adminUser.displayName}</strong>
            <small>{adminUser.username}</small>
          </div>
          <button type="button" onClick={() => selectModule('edit-user')}>Edit User</button>
          <button type="button" onClick={logoutAdmin}>Log out</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">Content / {activeConfig.label}</p>
            <h1>{activeConfig.key === 'news' && isModalOpen ? (draft.id ? 'Edit News' : 'Add News') : activeConfig.label}</h1>
            <span>{moduleDescriptions[activeConfig.key] || 'Review current records, then edit or add content.'}</span>
          </div>
          {!['home', 'settings', 'page-text', 'media-links', 'poetry-house', 'edit-user'].includes(activeConfig.key) && !(activeConfig.key === 'news' && isModalOpen) && (
            <div className="admin-topbar-actions">
            <label aria-label="Search admin records">
              <input type="search" placeholder="Search..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </label>
            </div>
          )}
          {!modulesWithoutAdminLanguageSwitch.has(activeConfig.key) && (
            <div className="admin-language-switch" aria-label="Editing language">
              {languageOptions.map((option) => (
                <button
                  className={adminLanguage === option.code ? 'is-active' : ''}
                  key={option.code}
                  type="button"
                  onClick={() => setAdminLanguage(option.code)}
                  title={`Edit ${option.label} content`}
                >
                  {option.shortLabel}
                </button>
              ))}
            </div>
          )}
        </header>

        {status ? (
          <div className={`admin-status is-${getStatusTone(status)}`} role="status" aria-live="polite">
            <p>{status}</p>
          </div>
        ) : null}

        {activeConfig.key === 'edit-user' ? (
          <form className="admin-user-editor" onSubmit={saveUserProfile}>
            <section className="admin-settings-section">
              <h2>Admin account</h2>
              <p className="admin-section-help">Changes to username or password require the current password.</p>
              <div className="admin-form-grid">
                <label>
                  <span>Name</span>
                  <input
                    autoComplete="name"
                    value={userDraft.displayName}
                    onChange={(event) => updateUserDraft('displayName', event.target.value)}
                  />
                </label>
                <label>
                  <span>Login username</span>
                  <input
                    autoComplete="username"
                    value={userDraft.username}
                    onChange={(event) => updateUserDraft('username', event.target.value)}
                  />
                </label>
                <label className="is-wide">
                  <span>Current password</span>
                  <input
                    autoComplete="current-password"
                    type="password"
                    value={userDraft.currentPassword}
                    onChange={(event) => updateUserDraft('currentPassword', event.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="admin-settings-section">
              <h2>Password</h2>
              <p className="admin-section-help">Leave the new password fields empty if you only want to update the name or username.</p>
              <div className="admin-form-grid">
                <label>
                  <span>New password</span>
                  <input
                    autoComplete="new-password"
                    type="password"
                    value={userDraft.newPassword}
                    onChange={(event) => updateUserDraft('newPassword', event.target.value)}
                  />
                </label>
                <label>
                  <span>Confirm new password</span>
                  <input
                    autoComplete="new-password"
                    type="password"
                    value={userDraft.confirmPassword}
                    onChange={(event) => updateUserDraft('confirmPassword', event.target.value)}
                  />
                </label>
                <div className="admin-password-requirements is-wide">
                  {getPasswordRequirementState(userDraft.newPassword).map(([label, isMet]) => (
                    <span className={isMet ? 'is-met' : ''} key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </section>

            {userStatus ? (
              <div className={`admin-status is-${getStatusTone(userStatus)}`} role="status" aria-live="polite">
                <p>{userStatus}</p>
              </div>
            ) : null}

            <div className="admin-settings-actions">
              <button className="admin-button is-save" type="submit">Save user</button>
            </div>
          </form>
        ) : activeConfig.key === 'home' ? (
          <form className="admin-homepage-editor" onSubmit={saveHomepage}>
            <HomepagePreview draft={homeDraft} translationDraft={translationDraft} language={adminLanguage} />

            <section className="admin-editor">
              <div className="admin-editor-header">
                <div>
                  <h2>Home Page main content</h2>
                  <p className="admin-section-help">Use the main homepage preview above, then adjust each section below.</p>
                </div>
              </div>
              {homepageContentSections.map((section) => (
                <div className="admin-home-editor-section" key={section.title}>
                  <div className="admin-home-editor-section-heading">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  {section.preview ? (
                    <HomepageSectionPreview
                      type={section.preview}
                      draft={homeDraft}
                      translationDraft={translationDraft}
                      language={adminLanguage}
                      previewBooks={homePreviewBooks}
                    />
                  ) : null}
                  <div className="admin-form-grid">
                    {(section.translationKeys ?? []).map((key) => (
                      <HomeTranslationField
                        fieldKey={key}
                        key={key}
                        onChange={updateTranslationDraft}
                        value={translationDraft[key] ?? ''}
                      />
                    ))}
                    {section.fields.map((fieldKey) => (
                      <HomeDraftField
                        draft={homeDraft}
                        fieldKey={fieldKey}
                        key={fieldKey}
                        onChange={updateHomeDraft}
                        onUpload={uploadHomeFile}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
            <section className="admin-editor admin-home-labels-editor">
              <div className="admin-editor-header">
                <div>
                  <h2>Homepage buttons and section titles</h2>
                  <p className="admin-section-help">Buttons and labels are grouped with the public section where they appear.</p>
                </div>
              </div>
              {homepageTextSections.map((section) => (
                <div className="admin-home-editor-section" key={section.title}>
                  <div className="admin-home-editor-section-heading">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  <HomepageSectionPreview
                    type={section.preview}
                    draft={homeDraft}
                    translationDraft={translationDraft}
                    language={adminLanguage}
                    previewBooks={homePreviewBooks}
                  />
                  <div className="admin-form-grid">
                    {section.keys
                      .filter((key) => homepageTranslationKeys.includes(key))
                      .map((key) => (
                        <HomeTranslationField
                          fieldKey={key}
                          key={key}
                          onChange={updateTranslationDraft}
                          value={translationDraft[key] ?? ''}
                        />
                      ))}
                    {(section.fields ?? []).map((fieldKey) => (
                      <HomeDraftField
                        draft={homeDraft}
                        fieldKey={fieldKey}
                        key={fieldKey}
                        onChange={updateHomeDraft}
                        onUpload={uploadHomeFile}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
            <div className="admin-settings-actions admin-homepage-actions">
              <button className="admin-button is-save" type="submit"><span aria-hidden="true">✓</span>Save homepage</button>
            </div>
          </form>
        ) : activeConfig.key === 'page-text' ? (
          <form className="admin-settings-editor admin-page-labels-editor" onSubmit={saveTranslations}>
            {editableTranslationGroups.map((group) => (
              <details className="admin-settings-section admin-label-section" key={group.title} open>
                <summary className="admin-label-section-header">
                  <span aria-hidden="true">{translationGroupDetails[group.title]?.badge || group.title.slice(0, 3).toUpperCase()}</span>
                  <div>
                    <h2>{group.title}</h2>
                    <p className="admin-section-help">{translationGroupDetails[group.title]?.description || 'Text shown directly on the public website.'}</p>
                  </div>
                </summary>
                <TranslationGroupPreview group={group} draft={translationDraft} language={adminLanguage} />
                <div className="admin-form-grid">
                  {group.keys.map((key) => {
                    const value = translationDraft[key] ?? '';
                    const isLong = value.length > 80 || key.includes('Text') || key.includes('description') || key.includes('credit');

                    return (
                      <label className={isLong ? 'is-wide' : ''} key={key}>
                        <span>{getTranslationFieldLabel(key)}</span>
                        {isLong ? (
                          <textarea value={value} onChange={(event) => updateTranslationDraft(key, event.target.value)} rows={3} />
                        ) : (
                          <input value={value} onChange={(event) => updateTranslationDraft(key, event.target.value)} />
                        )}
                      </label>
                    );
                  })}
                </div>
              </details>
            ))}
            <div className="admin-settings-actions">
              <button className="admin-button is-save" type="submit"><span aria-hidden="true">✓</span>Save page text</button>
            </div>
          </form>
        ) : activeConfig.key === 'poetry-house' ? (
          <form className="admin-settings-editor" onSubmit={savePoetryHouse}>
            {poetryHouseGroups.map((group) => (
              <section className="admin-settings-section" key={group.title}>
                <h2>{group.title}</h2>
                <p className="admin-section-help">{group.description}</p>
                <div className="admin-form-grid">
                  {group.fields.map(([key, label, type = 'text']) => (
                    <div key={key} className={`admin-setting-field${type.includes('textarea') || type.includes('poetryHouse') ? ' is-wide' : ''}`}>
                      <span>{label}</span>
                      <PoetryHouseFieldEditor
                        fieldKey={key}
                        type={type}
                        value={poetryHouseDraft[key]}
                        onChange={updatePoetryHouseDraft}
                        onUpload={uploadPoetryHouseFile}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <div className="admin-settings-actions">
              <button className="admin-button is-save" type="submit">Save Poetry House</button>
            </div>
          </form>
        ) : activeConfig.key === 'settings' || activeConfig.key === 'media-links' ? (
          <form className="admin-settings-editor" onSubmit={saveSettings}>
            {getSiteSettingGroupsForConfig(activeConfig.key).map((group) => {
              const SectionTag = group.isAdvanced ? 'details' : 'section';

              return (
                <SectionTag className={`admin-settings-section${group.isAdvanced ? ' is-advanced' : ''}`} key={group.title}>
                  {group.isAdvanced ? <summary>{group.title}</summary> : <h2>{group.title}</h2>}
                  {activeConfig.key === 'settings' && group.title === 'About page biography content' ? (
                    <BiographyPreview draft={settingsDraft} translationDraft={translationDraft} language={adminLanguage} />
                  ) : null}
                  <div className="admin-form-grid">
                    {group.fields.map(([key, label, type = 'text']) => (
                      <div key={key} className={`admin-setting-field${type.includes('textarea') || type.includes('json') || siteSettingStructuredKeys.has(key) ? ' is-wide' : ''}`}>
                        <span>{label}</span>
                        <SiteSettingEditor
                          settingKey={key}
                          type={type}
                          value={settingsDraft[key]}
                          onChange={(value) => updateSettingsDraft(key, value)}
                        />
                        {key === 'aboutPortraitPath' ? (
                          <input className="admin-file-input" type="file" accept="image/*" onChange={(event) => uploadSettingFile(event, key, 'biography')} />
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {activeConfig.key === 'settings' && group.title === 'About page biography content' ? (
                    <div className="admin-form-grid admin-about-labels-editor">
                      {aboutTranslationKeys.map((key) => {
                        const value = translationDraft[key] ?? '';
                        const isLong = value.length > 80 || key.includes('Text');

                        return (
                          <label className={isLong ? 'is-wide' : ''} key={key}>
                            <span>{getTranslationFieldLabel(key)}</span>
                            {isLong ? (
                              <textarea value={value} onChange={(event) => updateTranslationDraft(key, event.target.value)} rows={3} />
                            ) : (
                              <input value={value} onChange={(event) => updateTranslationDraft(key, event.target.value)} />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                </SectionTag>
              );
            })}
            <div className="admin-settings-actions">
              <button className="admin-button is-save" type="submit"><span aria-hidden="true">✓</span>Save {activeConfig.label}</button>
            </div>
          </form>
        ) : activeConfig.key === 'news' && isModalOpen ? (
            <NewsEditor
              draft={draft}
              updateDraft={updateDraft}
              uploadFile={uploadFile}
              uploadNewsGalleryImages={uploadNewsGalleryImages}
              saveDraft={saveDraft}
              onDelete={askDeleteDraft}
              onCancel={() => setIsModalOpen(false)}
            />
        ) : (
          <>
            <section className="admin-records-panel">
              <div className="admin-list-header">
                <div>
                  <h2>Current {activeConfig.label}</h2>
                  <p>{filteredItems.length} records shown</p>
                </div>
                <div className="admin-list-controls">
                  {activeConfig.key === 'poems' && (
                    <label>
                      <span>Language</span>
                      <select value={poemLanguageFilter} onChange={(event) => setPoemLanguageFilter(event.target.value)}>
                        <option value="all">All languages</option>
                        {poemLanguageOptions.map((language) => (
                          <option key={language.id} value={String(language.id)}>{language.name}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  {activeConfig.key === 'gallery' ? (
                    <label className="admin-gallery-upload-control">
                      <span>Upload images</span>
                      <input type="file" accept="image/*" multiple onChange={uploadGalleryFiles} />
                    </label>
                  ) : (
                    <button type="button" onClick={openNewModal}>Add new</button>
                  )}
                </div>
              </div>

              {isLoading ? <p className="admin-empty-state">Loading...</p> : null}
              {!isLoading && filteredItems.length === 0 ? <p className="admin-empty-state">No records found.</p> : null}

              <div className={`admin-record-list${activeConfig.key === 'news' ? ' is-card-grid' : ''}${activeConfig.key === 'books' ? ' is-card-grid is-book-grid' : ''}${activeConfig.key === 'poems' ? ' is-poem-grid' : ''}${activeConfig.key === 'video-poetry' ? ' is-card-grid is-video-grid' : ''}${activeConfig.key === 'gallery' ? ' is-gallery-grid' : ''}${activeConfig.key === 'testimonials' ? ' is-testimonial-grid' : ''}`}>
                {filteredItems.map((item) => (
                  activeConfig.key === 'news' ? (
                    <article key={item.id} className="admin-record-card admin-news-record-card">
                      <div className="admin-news-record-image">
                        <AdminNewsImage item={item} />
                      </div>
                      <div className="admin-news-record-content">
                        <div>
                          <p>{item.category || 'News'}{item.date ? ` / ${formatAdminDate(item.date)}` : ''}</p>
                          <strong>{getRecordTitle(item)}</strong>
                          <span>{item.excerpt || getRecordMeta(item)}</span>
                        </div>
                        <button type="button" onClick={() => openEditModal(item)}>Edit</button>
                      </div>
                    </article>
                  ) : activeConfig.key === 'books' ? (
                    <article key={item.id} className="admin-record-card admin-book-record-card">
                      <div className="admin-book-record-image">
                        <AdminBookImage item={item} />
                      </div>
                      <div className="admin-news-record-content">
                        <div>
                          <p>{item.category || 'Book'}{item.year ? ` / ${item.year}` : ''}</p>
                          <strong>{getRecordTitle(item)}</strong>
                          <span>{item.summary || item.location || getRecordMeta(item)}</span>
                        </div>
                        <button type="button" onClick={() => openEditModal(item)}>Edit</button>
                      </div>
                    </article>
                  ) : activeConfig.key === 'video-poetry' ? (
                    <article key={item.id} className="admin-record-card admin-video-record-card">
                      <div className="admin-video-record-image">
                        <AdminVideoPreview item={item} />
                        <span className="admin-video-record-play" aria-hidden="true" />
                      </div>
                      <div className="admin-news-record-content">
                        <div>
                          <p>{item.type || 'Video'}{item.previewTime ? ` / ${item.previewTime}s` : ''}</p>
                          <strong>{getRecordTitle(item)}</strong>
                          <span>{item.url || item.filename || getRecordMeta(item)}</span>
                        </div>
                        <button type="button" onClick={() => openEditModal(item)}>Edit</button>
                      </div>
                    </article>
                  ) : activeConfig.key === 'gallery' ? (
                    <article
                      key={item.id}
                      className={`admin-gallery-record-card${draggedGalleryId === item.id ? ' is-dragging' : ''}`}
                      draggable
                      onDragStart={(event) => {
                        setDraggedGalleryId(item.id);
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('text/plain', String(item.id));
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = 'move';
                        moveGalleryItem(item.id);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        finishGalleryDrag();
                      }}
                      onDragEnd={finishGalleryDrag}
                    >
                      <div className="admin-gallery-record-image">
                        <AdminGalleryImage item={item} />
                      </div>
                      <label className="admin-gallery-caption-field">
                        <span>Caption</span>
                        <input value={item.caption ?? ''} onChange={(event) => updateGalleryCaption(item.id, event.target.value)} />
                      </label>
                      <div className="admin-gallery-record-actions">
                        <button className="admin-gallery-action-button is-save" type="button" onClick={() => saveGalleryCaption(item)} aria-label="Save caption" title="Save caption">
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </button>
                        <button className="admin-gallery-action-button is-preview" type="button" onClick={() => setPreviewItem(item)} aria-label="Preview image" title="Preview image">
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button className="admin-gallery-action-button is-trash" type="button" onClick={() => askDeleteItem(item)} aria-label="Delete image" title="Delete image">
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M6 6l1 15h10l1-15" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </article>
                  ) : (
                    <article key={item.id} className="admin-record-card">
                      <div>
                        <strong>{getRecordTitle(item)}</strong>
                        <span>{getRecordMeta(item)}</span>
                      </div>
                      <button type="button" onClick={() => openEditModal(item)}>Edit</button>
                    </article>
                  )
                ))}
              </div>
            </section>

            {previewItem && (
              <div className="admin-gallery-preview" role="dialog" aria-modal="true" aria-label={previewItem.caption || 'Gallery preview'}>
                <button className="admin-gallery-preview-backdrop" type="button" onClick={() => setPreviewItem(null)} aria-label="Close preview" />
                <div className="admin-gallery-preview-panel">
                  <button type="button" onClick={() => setPreviewItem(null)} aria-label="Close preview">x</button>
                  <AdminGalleryImage item={previewItem} />
                  {previewItem.caption ? <p>{previewItem.caption}</p> : null}
                </div>
              </div>
            )}

            {isModalOpen && activeConfig.key !== 'news' && activeConfig.key !== 'gallery' && (
              <div className="admin-modal" role="dialog" aria-modal="true" aria-label={`${draft.id ? 'Edit' : 'Add'} ${activeConfig.label}`}>
                <button className="admin-modal-backdrop" type="button" onClick={() => setIsModalOpen(false)} aria-label="Close editor" />
                <form className="admin-modal-panel" onSubmit={saveDraft}>
                  <div className="admin-editor-header">
                    <h2>{draft.id ? `Edit ${activeConfig.label}` : `Add ${activeConfig.label}`}</h2>
                    <div className="admin-action-row">
                      <button className="admin-button is-cancel" type="button" onClick={() => setIsModalOpen(false)}><span aria-hidden="true">↩</span>Cancel</button>
                      <button className="admin-button is-danger" type="button" onClick={askDeleteDraft} disabled={!draft.id}><span aria-hidden="true">🗑</span>Delete</button>
                      <button className="admin-button is-save" type="submit"><span aria-hidden="true">✓</span>Save</button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    {activeConfig.fields.map(([key, label, type = 'text']) => {
                      const videoPoetryType = String(draft.type || 'youtube').toLowerCase();
                      if (type === 'videoPoetryUrl' && videoPoetryType !== 'youtube') return null;
                      if (type === 'videoPoetryUpload' && videoPoetryType !== 'local') return null;

                      return (
                        <label key={`${key}-${type}`} className={type === 'textarea' || type === 'richtext' || type === 'videoPoetryUpload' ? 'is-wide' : ''}>
                          <span>{label}</span>
                          {type === 'checkbox' ? (
                            <input
                              type="checkbox"
                              checked={Boolean(draft[key])}
                              onChange={(event) => updateField(key, event.target.checked)}
                            />
                          ) : type === 'textarea' ? (
                            <textarea value={draft[key] ?? ''} onChange={(event) => updateField(key, event.target.value)} rows={5} />
                          ) : type === 'richtext' ? (
                            <RichTextEditor value={draft[key] ?? ''} onChange={(value) => updateField(key, value)} />
                          ) : type === 'poemLanguage' ? (
                            <select
                              value={draft[key] ?? ''}
                              onChange={(event) => updateField(key, Number(event.target.value) || '')}
                            >
                              <option value="">Choose language</option>
                              {poemLanguageOptions.map((language) => (
                                <option key={language.id} value={language.id}>{language.name}</option>
                              ))}
                            </select>
                          ) : type === 'videoPoetryType' ? (
                            <select
                              value={draft[key] || 'youtube'}
                              onChange={(event) => updateField(key, event.target.value)}
                            >
                              <option value="youtube">YouTube</option>
                              <option value="local">Local</option>
                            </select>
                          ) : type === 'videoPoetryUrl' ? (
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={draft[key] ?? ''}
                              onChange={(event) => updateField(key, event.target.value)}
                            />
                          ) : type === 'videoPoetryUpload' ? (
                            <>
                              <input
                                value={draft[key] ?? ''}
                                onChange={(event) => updateField(key, event.target.value)}
                                placeholder="Uploaded video path"
                              />
                              <input className="admin-file-input" type="file" accept="video/*" onChange={(event) => uploadFile(event, key)} />
                            </>
                          ) : type === 'awardIcon' ? (
                            <div className="admin-award-icon-field">
                              <button
                                className={!draft[key] ? 'is-selected' : ''}
                                type="button"
                                onClick={() => updateField(key, '')}
                              >
                                <span>No icon</span>
                              </button>
                              {awardIconOptions.map((icon) => (
                                <button
                                  className={draft[key] === icon.value ? 'is-selected' : ''}
                                  key={icon.value}
                                  type="button"
                                  onClick={() => updateField(key, icon.value)}
                                >
                                  <img src={icon.src} alt="" />
                                  <span>{icon.label}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              type={type}
                              value={draft[key] ?? ''}
                              onChange={(event) => updateField(key, type === 'number' ? Number(event.target.value) || '' : event.target.value)}
                            />
                          )}
                          {type !== 'videoPoetryUpload' && (key.toLowerCase().includes('image') || key.toLowerCase().includes('path')) ? (
                            <input className="admin-file-input" type="file" accept="image/*,video/*" onChange={(event) => uploadFile(event, key)} />
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                </form>
              </div>
            )}
          </>
        )}
        <ConfirmDialog
          dialog={confirmDialog}
          onCancel={closeConfirmDialog}
          onConfirm={confirmCurrentDialog}
        />
      </section>
    </main>
  );
}

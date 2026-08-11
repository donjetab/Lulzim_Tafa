import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLanguageFromPath, localizePublicPath } from './localizedRoutes.js';

const STORAGE_KEY = 'lulzim-tafa-language';
const DEFAULT_LANGUAGE = 'en';
const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (['5173', '5174'].includes(window.location.port) ? `${window.location.protocol}//${window.location.hostname}:5000` : '');

export const languageOptions = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'sq', label: 'Albanian', shortLabel: 'ALB' },
];

export const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.biography': 'Biography',
    'nav.othersAbout': 'Others About LT',
    'nav.books': 'Books',
    'nav.poetry': 'Poetry',
    'nav.writtenPoetry': 'Written Poetry',
    'nav.videoPoetry': 'Video Poetry',
    'nav.poetryHouse': 'Poetry House',
    'nav.newsInterviews': 'News & Interviews',
    'nav.interviews': 'Interviews',
    'nav.news': 'News',
    'nav.gallery': 'Gallery',
    'nav.awards': 'Awards',
    'footer.description': 'A homepage designed to reflect books, scholarship, and an unmistakably academic public profile.',
    'footer.navigation': 'Navigation',
    'footer.work': 'Work',
    'footer.stayInTouch': 'Stay in Touch',
    'footer.credit': '© 2026 LULZIM TAFA — Administered by Ardian Sallauka',
    'language.label': 'Language',
    'language.switchTo': 'Switch language',
    'home.subtitle': 'A voice shaped by scholarship, literature, and civic reflection.',
    'home.intro': 'An authorial space dedicated to books, poetry, public thought, and the intellectual world of Lulzim Tafa',
    'home.exploreBooks': 'Explore Books',
    'home.readPoetry': 'Read Poetry',
    'home.featuredBooks': 'Featured books',
    'home.latestBooks': 'Latest Books',
    'home.booksText': 'The first reading of the site should happen visually. Covers, titles, and concise descriptions need room to breathe.',
    'home.viewAllBooks': 'View All Books',
    'home.poetryEyebrow': 'Poetry & Creative Works',
    'home.poetryTitle': 'A Poetic Voice Shaped by Memory, Silence, and Reflection',
    'home.poetryText': "Lulzim Tafa's poetry moves between personal memory, collective experience, and the quiet tension of human existence.",
    'home.explorePoetry': 'Explore Poetry',
    'home.quote': '"Literature is not merely written - it is lived, examined, and questioned."',
    'home.latestNews': 'Latest News',
    'home.newsTitle': 'News & Updates',
    'home.viewAllNews': 'View All News',
    'about.eyebrow': 'About the Author',
    'about.title': 'A life shaped by Literature, Scholarship, and Public Thought',
    'about.lifeTitle': "Lulzim Tafa's Life",
    'about.glanceTitle': 'At a Glance',
    'about.testimonialsEyebrow': 'Testimonials & Recognition',
    'about.testimonialsTitle': 'Others About Lulzim Tafa',
    'about.testimonialsText': 'Reflections from colleagues, readers, scholars, and public voices who have been inspired by his work and presence.',
    'about.readAllTestimonials': 'Read All Testimonials',
    'about.galleryEyebrow': 'Moments and Public Life',
    'about.galleryTitle': 'Gallery Preview',
    'about.seeAllGallery': 'See All Gallery',
    'books.eyebrow': 'Books',
    'books.title': 'The Bookshelf',
    'books.text': "A chronological library of Lulzim Tafa's published poetry books and translated editions.",
    'books.libraryEyebrow': 'Library',
    'books.libraryTitle': 'All Books',
    'books.libraryText': 'Ordered by publication year, with undated editions kept at the end until their years are confirmed.',
    'books.yearToConfirm': 'Year to confirm',
    'books.closeBook': 'Close book',
    'poetry.eyebrow': 'Poetry',
    'poetry.title': 'A World of Poetry, Memory and Reflection',
    'poetry.text': 'Selected poems, translations, and fragments arranged as paper notes from a literary archive.',
    'poetry.searchLabel': 'Search Poetry',
    'poetry.searchPlaceholder': 'Search by title',
    'poetry.clearSearch': 'Clear search',
    'poetry.all': 'All',
    'poetry.empty': 'No poems found by that title.',
    'poetry.seeMore': 'See more poems',
    'poetry.videoTitle': 'Poems in Video',
    'poetry.videoText': 'Selected recordings and video poems will be collected here.',
    'poetry.videoEmpty': 'Video poetry items are ready to be added.',
    'news.eyebrow': 'News & Interviews',
    'news.title': 'News, Interviews & Updates',
    'news.text': "Here you can find news, interviews, and updates regarding Lulzim Tafa's activities.",
    'news.searchNews': 'Search news',
    'news.searchMedia': 'Search media',
    'news.searchNewsPlaceholder': 'Search by title, topic, or source',
    'news.searchMediaPlaceholder': 'Search by media name or domain',
    'news.clear': 'Clear',
    'news.openMediaPage': 'Open media page for Lulzim Tafa',
    'news.empty': 'No news found for your search.',
    'news.emptyMedia': 'No media outlets found for your search.',
    'gallery.eyebrow': 'Gallery',
    'gallery.title': 'Moments from Public and Literary Life',
    'gallery.text': 'Photographs from readings, ceremonies, meetings, and cultural appearances.',
    'awards.eyebrow': 'Awards',
    'awards.title': 'Awards & Recognition',
  },
  sq: {
    'nav.home': 'Ballina',
    'nav.about': 'Rreth',
    'nav.biography': 'Biografia',
    'nav.othersAbout': 'Te tjeret per LT',
    'nav.books': 'Librat',
    'nav.poetry': 'Poezia',
    'nav.writtenPoetry': 'Poezi e shkruar',
    'nav.videoPoetry': 'Poezi video',
    'nav.poetryHouse': 'Shtepia e Poezise',
    'nav.newsInterviews': 'Lajme & Intervista',
    'nav.interviews': 'Intervista',
    'nav.news': 'Lajme',
    'nav.gallery': 'Galeria',
    'nav.awards': 'Cmimet',
    'footer.description': 'Faqe e krijuar per te pasqyruar librat, dijen dhe profilin e tij te dalluar publik e akademik.',
    'footer.navigation': 'Navigimi',
    'footer.work': 'Vepra',
    'footer.stayInTouch': 'Na ndiqni',
    'footer.credit': '© 2026 LULZIM TAFA — Administruar nga Ardian Sallauka',
    'language.label': 'Gjuha',
    'language.switchTo': 'Ndrysho gjuhen',
    'home.subtitle': 'Nje ze i formuar nga dija, letersia dhe mendimi publik.',
    'home.intro': 'Hapesire autoriale kushtuar librave, poezise, mendimit publik dhe botes intelektuale te Lulzim Tafes',
    'home.exploreBooks': 'Shfleto Librat',
    'home.readPoetry': 'Lexo Poezi',
    'home.featuredBooks': 'Libra te vecuar',
    'home.latestBooks': 'Librat e fundit',
    'home.booksText': 'Leximi i pare i faqes duhet te ndodhe vizualisht. Kopertinat, titujt dhe pershkrimet e shkurtra kane nevoje per hapesire.',
    'home.viewAllBooks': 'Shiko te gjithe librat',
    'home.poetryEyebrow': 'Poezi & Krijimtari',
    'home.poetryTitle': 'Nje ze poetik i formuar nga kujtesa, heshtja dhe reflektimi',
    'home.poetryText': 'Poezia e Lulzim Tafes leviz mes kujteses personale, pervojes kolektive dhe tensionit te qete te ekzistences njerezore.',
    'home.explorePoetry': 'Shfleto Poezine',
    'home.quote': '"Letersia nuk shkruhet vetem - ajo jetohet, shqyrtohet dhe vihet ne pyetje."',
    'home.latestNews': 'Lajmet e fundit',
    'home.newsTitle': 'Lajme & Perditesime',
    'home.viewAllNews': 'Shiko te gjitha lajmet',
    'about.eyebrow': 'Rreth autorit',
    'about.title': 'Jete e formuar nga letersia, dija dhe mendimi publik',
    'about.lifeTitle': 'Jeta e Lulzim Tafes',
    'about.glanceTitle': 'Me nje shikim',
    'about.testimonialsEyebrow': 'Vleresime & Mirenjohje',
    'about.testimonialsTitle': 'Te tjeret per Lulzim Tafen',
    'about.testimonialsText': 'Reflektime nga kolege, lexues, studiues dhe zera publik qe jane frymezuar nga puna dhe prania e tij.',
    'about.readAllTestimonials': 'Lexo te gjitha vleresimet',
    'about.galleryEyebrow': 'Momente dhe jete publike',
    'about.galleryTitle': 'Paraqitje nga galeria',
    'about.seeAllGallery': 'Shiko gjithe galerine',
    'books.eyebrow': 'Librat',
    'books.title': 'Biblioteka',
    'books.text': 'Biblioteke kronologjike e librave poetike dhe botimeve te perkthyera te Lulzim Tafes.',
    'books.libraryEyebrow': 'Biblioteka',
    'books.libraryTitle': 'Te gjithe librat',
    'books.libraryText': 'Te renditur sipas vitit te botimit, ndersa botimet pa date mbeten ne fund derisa te konfirmohen vitet.',
    'books.yearToConfirm': 'Viti per konfirmim',
    'books.closeBook': 'Mbyll librin',
    'poetry.eyebrow': 'Poezia',
    'poetry.title': 'Bote e poezise, kujteses dhe reflektimit',
    'poetry.text': 'Poezi te zgjedhura, perkthime dhe fragmente te renditura si shenime letrare.',
    'poetry.searchLabel': 'Kerko poezi',
    'poetry.searchPlaceholder': 'Kerko sipas titullit',
    'poetry.clearSearch': 'Pastro kerkimin',
    'poetry.all': 'Te gjitha',
    'poetry.empty': 'Nuk u gjet asnje poezi me ate titull.',
    'poetry.seeMore': 'Shiko me shume poezi',
    'poetry.videoTitle': 'Poezi ne video',
    'poetry.videoText': 'Incizime dhe poezi video te zgjedhura do te mblidhen ketu.',
    'poetry.videoEmpty': "Videot e poezise jane gati per t'u shtuar.",
    'news.eyebrow': 'Lajme & Intervista',
    'news.title': 'Lajme, Intervista & Perditesime',
    'news.text': 'Ketu mund te gjeni lajme, intervista dhe perditesime rreth aktiviteteve te Lulzim Tafes.',
    'news.searchNews': 'Kerko lajme',
    'news.searchMedia': 'Kerko media',
    'news.searchNewsPlaceholder': 'Kerko sipas titullit, temes ose burimit',
    'news.searchMediaPlaceholder': 'Kerko sipas emrit te medias ose domenit',
    'news.clear': 'Pastro',
    'news.openMediaPage': 'Hap faqen mediatike per Lulzim Tafen',
    'news.empty': 'Nuk u gjet asnje lajm per kerkimin tuaj.',
    'news.emptyMedia': 'Nuk u gjet asnje media per kerkimin tuaj.',
    'gallery.eyebrow': 'Galeria',
    'gallery.title': 'Momente nga jeta publike dhe letrare',
    'gallery.text': 'Fotografi nga lexime, ceremoni, takime dhe paraqitje kulturore.',
    'awards.eyebrow': 'Cmimet',
    'awards.title': 'Cmimet dhe mirenjohjet',
  },
};

export const translationGroups = [
  {
    title: 'Navigation',
    keys: [
      'nav.home',
      'nav.about',
      'nav.biography',
      'nav.othersAbout',
      'nav.books',
      'nav.poetry',
      'nav.writtenPoetry',
      'nav.videoPoetry',
      'nav.poetryHouse',
      'nav.newsInterviews',
      'nav.interviews',
      'nav.news',
      'nav.gallery',
      'nav.awards',
    ],
  },
  {
    title: 'Homepage',
    keys: [
      'home.subtitle',
      'home.intro',
      'home.exploreBooks',
      'home.readPoetry',
      'home.featuredBooks',
      'home.latestBooks',
      'home.booksText',
      'home.viewAllBooks',
      'home.poetryEyebrow',
      'home.poetryTitle',
      'home.poetryText',
      'home.explorePoetry',
      'home.quote',
      'home.latestNews',
      'home.newsTitle',
      'home.viewAllNews',
    ],
  },
  {
    title: 'About',
    keys: [
      'about.eyebrow',
      'about.title',
      'about.lifeTitle',
      'about.glanceTitle',
      'about.testimonialsEyebrow',
      'about.testimonialsTitle',
      'about.testimonialsText',
      'about.readAllTestimonials',
      'about.galleryEyebrow',
      'about.galleryTitle',
      'about.seeAllGallery',
    ],
  },
  {
    title: 'Books',
    keys: [
      'books.eyebrow',
      'books.title',
      'books.text',
      'books.libraryEyebrow',
      'books.libraryTitle',
      'books.libraryText',
      'books.yearToConfirm',
      'books.closeBook',
    ],
  },
  {
    title: 'Poetry',
    keys: [
      'poetry.eyebrow',
      'poetry.title',
      'poetry.text',
      'poetry.searchLabel',
      'poetry.searchPlaceholder',
      'poetry.clearSearch',
      'poetry.all',
      'poetry.empty',
      'poetry.seeMore',
      'poetry.videoTitle',
      'poetry.videoText',
      'poetry.videoEmpty',
    ],
  },
  {
    title: 'News',
    keys: [
      'news.eyebrow',
      'news.title',
      'news.text',
      'news.searchNews',
      'news.searchMedia',
      'news.searchNewsPlaceholder',
      'news.searchMediaPlaceholder',
      'news.clear',
      'news.openMediaPage',
      'news.empty',
      'news.emptyMedia',
    ],
  },
  {
    title: 'Gallery',
    keys: [
      'gallery.eyebrow',
      'gallery.title',
      'gallery.text',
    ],
  },
  {
    title: 'Awards',
    keys: [
      'awards.eyebrow',
      'awards.title',
    ],
  },
  {
    title: 'Footer',
    keys: [
      'footer.description',
      'footer.navigation',
      'footer.work',
      'footer.stayInTouch',
      'footer.credit',
      'language.label',
      'language.switchTo',
    ],
  },
];

function normalizeTranslationSettings(settings) {
  const nextTranslations = { en: { ...translations.en }, sq: { ...translations.sq } };

  (Array.isArray(settings) ? settings : []).forEach((setting) => {
    const language = setting.languageCode ?? setting.LanguageCode;
    const key = setting.key ?? setting.Key;
    const value = setting.value ?? setting.Value ?? '';

    if ((language === 'en' || language === 'sq') && key) nextTranslations[language][key] = value;

    const legacyMatch = String(key ?? '').match(/^translation\.(en|sq)\.(.+)$/);
    if (legacyMatch) nextTranslations[legacyMatch[1]][legacyMatch[2]] = value;
  });

  return nextTranslations;
}

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const urlLanguage = getLanguageFromPath(window.location.pathname);
  if (urlLanguage) return urlLanguage;
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return savedLanguage === 'sq' || savedLanguage === 'en' ? savedLanguage : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(getInitialLanguage);
  const [cmsTranslations, setCmsTranslations] = useState(translations);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'sq' ? 'sq' : 'en';
  }, [language]);

  useEffect(() => {
    const urlLanguage = getLanguageFromPath(location.pathname);
    if (urlLanguage && urlLanguage !== language) setLanguage(urlLanguage);
  }, [language, location.pathname]);

  useEffect(() => {
    if (!API_BASE) return undefined;

    let isMounted = true;

    fetch(`${API_BASE}/api/site-translations`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Could not load translations'))))
      .then((settings) => {
        if (isMounted) setCmsTranslations(normalizeTranslationSettings(settings));
      })
      .catch((error) => console.warn('Translation settings request failed, using defaults:', error));

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => {
      const nextLanguage = language === 'en' ? 'sq' : 'en';
      const nextPath = localizePublicPath(location.pathname, nextLanguage);
      navigate(`${nextPath}${location.search}${location.hash}`);
    },
    t: (key) => {
      const otherLanguage = language === 'en' ? 'sq' : 'en';
      const hasCmsValue = Object.prototype.hasOwnProperty.call(cmsTranslations[language] ?? {}, key)
        || Object.prototype.hasOwnProperty.call(cmsTranslations[otherLanguage] ?? {}, key);
      const localizedValue = cmsTranslations[language]?.[key];
      if (localizedValue === '') return '';
      if (localizedValue) return localizedValue;
      const fallbackValue = cmsTranslations[otherLanguage]?.[key];
      if (fallbackValue) return fallbackValue;
      if (hasCmsValue) return '';
      return translations[language]?.[key] ?? translations.en[key] ?? key;
    },
  }), [cmsTranslations, language, location.hash, location.pathname, location.search, navigate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}

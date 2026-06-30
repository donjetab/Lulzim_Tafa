import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'lulzim-tafa-language';
const DEFAULT_LANGUAGE = 'en';

const translations = {
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
  },
};

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return savedLanguage === 'sq' || savedLanguage === 'en' ? savedLanguage : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'sq' ? 'sq' : 'en';
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((currentLanguage) => (currentLanguage === 'en' ? 'sq' : 'en')),
    t: (key) => translations[language]?.[key] ?? translations.en[key] ?? key,
  }), [language]);

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

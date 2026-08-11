import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { NavLink } from './LocalizedLink.jsx';
import headerLogo from '../assets/logo/logo-landscape-white_gold.png';
import { cms, fallbackData, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { localizePublicPath, normalizePublicPath } from '../i18n/localizedRoutes.js';

const seoContent = {
  en: {
    home: ['Lulzim Tafa | Academic, Author and Poet', 'Official website of Lulzim Tafa, Kosovar Albanian academic, author and poet. Explore his biography, books, poetry, awards and latest news.'],
    about: ['About Lulzim Tafa | Biography', 'Discover the biography, academic career and literary work of Kosovar Albanian poet and author Lulzim Tafa.'],
    testimonials: ['Testimonials about Lulzim Tafa', 'Read reflections and testimonials about the work and literary influence of Lulzim Tafa.'],
    books: ['Books by Lulzim Tafa', 'Explore poetry books, publications and translated editions by Lulzim Tafa.'],
    poetry: ['Poetry by Lulzim Tafa', 'Read selected poems and translations by Kosovar Albanian poet Lulzim Tafa.'],
    poetryHouse: ['Poetry House | Lulzim Tafa', 'Discover the Poetry House and Poetry Theatre founded by Lulzim Tafa in Prishtina.'],
    news: ['News and Interviews | Lulzim Tafa', 'Latest news, interviews and public appearances by author and academic Lulzim Tafa.'],
    gallery: ['Gallery | Lulzim Tafa', 'Photos from the literary, academic and public life of Lulzim Tafa.'],
    awards: ['Awards and Recognition | Lulzim Tafa', 'Explore international awards and distinctions received by poet and academic Lulzim Tafa.'],
  },
  sq: {
    home: ['Lulzim Tafa | Akademik, autor dhe poet', 'Faqja zyrtare e Lulzim Tafës, akademik, autor dhe poet shqiptar nga Kosova. Shfletoni biografinë, librat, poezinë, çmimet dhe lajmet e tij.'],
    about: ['Rreth Lulzim Tafës | Biografia', 'Zbuloni biografinë, karrierën akademike dhe krijimtarinë letrare të poetit dhe autorit Lulzim Tafa.'],
    testimonials: ['Vlerësime për Lulzim Tafën', 'Lexoni vlerësime dhe reflektime për veprën dhe ndikimin letrar të Lulzim Tafës.'],
    books: ['Librat e Lulzim Tafës', 'Shfletoni librat me poezi, botimet dhe veprat e përkthyera të Lulzim Tafës.'],
    poetry: ['Poezi nga Lulzim Tafa', 'Lexoni poezi të zgjedhura dhe përkthime nga poeti shqiptar i Kosovës, Lulzim Tafa.'],
    poetryHouse: ['Shtëpia e Poezisë | Lulzim Tafa', 'Zbuloni Shtëpinë e Poezisë dhe Teatrin e Poezisë të themeluar nga Lulzim Tafa në Prishtinë.'],
    news: ['Lajme dhe intervista | Lulzim Tafa', 'Lajmet, intervistat dhe paraqitjet më të fundit publike të autorit dhe akademikut Lulzim Tafa.'],
    gallery: ['Galeria | Lulzim Tafa', 'Fotografi nga jeta letrare, akademike dhe publike e Lulzim Tafës.'],
    awards: ['Çmime dhe mirënjohje | Lulzim Tafa', 'Shfletoni çmimet dhe mirënjohjet ndërkombëtare të poetit dhe akademikut Lulzim Tafa.'],
  },
};

function getSeoSection(path) {
  if (path === '/') return 'home';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/testimonials')) return 'testimonials';
  if (path.startsWith('/books')) return 'books';
  if (path.startsWith('/poetry-house')) return 'poetryHouse';
  if (path.startsWith('/poetry')) return 'poetry';
  if (path.startsWith('/news')) return 'news';
  if (path.startsWith('/gallery')) return 'gallery';
  if (path.startsWith('/awards')) return 'awards';
  return 'home';
}

const navItems = [
  ['nav.home', '/'],
  ['nav.about', '/about', [
    ['nav.biography', '/about#biography'],
    ['nav.othersAbout', '/about#testimonials'],
    ['nav.gallery', '/gallery'],
  ]],
  ['nav.books', '/books'],
  ['nav.poetry', '/poetry', [
    ['nav.writtenPoetry', '/poetry'],
    ['nav.videoPoetry', '/poetry/video'],
  ]],
  ['nav.poetryHouse', '/poetry-house'],
  ['nav.newsInterviews', '/news'],
  ['nav.gallery', '/gallery'],
  ['nav.awards', '/awards'],
];

const footerNavigation = [
  ['nav.home', '/'],
  ['nav.about', '/about'],
  ['nav.interviews', '/news'],
  ['nav.news', '/news'],
  ['nav.gallery', '/gallery'],
];

const footerWork = [
  ['nav.books', '/books'],
  ['nav.poetry', '/poetry'],
  ['nav.poetryHouse', '/poetry-house'],
  ['nav.awards', '/awards'],
];

const revealSelectors = [
  '.about-life-section',
  '.about-gallery-section',
  '.testimonial-section',
  '.section-heading',
  '.books-list-section',
  '.book-card',
  '.shelf-book',
  '.poetry-view-tabs',
  '.poetry-language-filter',
  '.poetry-paper-card',
  '.poetry-paper-card-wide',
  '.poetry-house-feature',
  '.poetry-house-gallery-section',
  '.poetry-house-carousel',
  '.poetry-house-news',
  '.news-filter',
  '.news-card',
  '.news-pagination',
  '.news-sources',
  '.news-source-card',
  '.news-gallery button',
  '.gallery-masonry-card',
  '.gallery-load-more',
  '.award-card',
  '.award-detail-copy',
  '.award-detail-image',
  '.testimonial-full-card',
  '.testimonials-toolbar',
].join(',');

function SocialIcon({ type }) {
  const icons = {
    website: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17" />
        <path d="M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z" />
      </>
    ),
    facebook: <path d="M14 8h2V5h-2.5C10.9 5 10 6.6 10 8.6V11H8v3h2v5h3v-5h2.3l.7-3h-3V8.9c0-.6.3-.9 1-.9Z" />,
    instagram: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="16.5" cy="7.5" r="0.7" />
      </>
    ),
    linkedin: (
      <>
        <path d="M7 10h3v8H7z" />
        <path d="M8.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        <path d="M12 10h2.8v1.1c0.5-0.8 1.3-1.3 2.5-1.3 2 0 3.2 1.3 3.2 3.7V18h-3v-4c0-1.1-0.5-1.7-1.4-1.7s-1.5 0.6-1.5 1.7v4H12z" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      {icons[type] ?? icons.website}
    </svg>
  );
}

export default function Layout() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const publicPath = normalizePublicPath(location.pathname, language);
  const { data: siteSettings } = useCmsData(() => cms.getSiteSettings(language), fallbackData.siteSettings, [language]);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isVideoPoetry = publicPath === '/poetry/video' || (publicPath === '/poetry' && location.search === '?view=video');
  const isWrittenPoetry = publicPath === '/poetry' && !isVideoPoetry;

  useEffect(() => {
    const origin = window.location.origin;
    const localizedPath = (code) => `${localizePublicPath(publicPath, code)}${location.search}`;
    const [title, description] = seoContent[language][getSeoSection(publicPath)];
    document.title = title;
    let descriptionMeta = document.head.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = description;
    const links = [
      ['canonical', null, localizedPath(language)],
      ['alternate', 'en', localizedPath('en')],
      ['alternate', 'sq', localizedPath('sq')],
      ['alternate', 'x-default', localizedPath('en')],
    ].map(([rel, hreflang, href]) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let link = document.head.querySelector(selector);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        if (hreflang) link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = `${origin}${href}`;
      return link;
    });

    return () => links.forEach((link) => link.remove());
  }, [language, location.search, publicPath]);

  useEffect(() => {
    const main = document.querySelector('.site-shell > main');
    if (!main) return undefined;

    const elements = [...main.querySelectorAll(revealSelectors)].filter((element, index, list) => (
      !element.closest('[data-home-animate]')
      && !element.closest('.gallery-lightbox')
      && !element.closest('.news-photo-preview')
      && list.findIndex((candidate) => candidate === element) === index
    ));

    if (!elements.length) return undefined;

    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal-item');
      element.style.setProperty('--reveal-index', index % 6);
    });

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12,
    });

    const frame = window.requestAnimationFrame(() => {
      elements.forEach((element) => observer.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      elements.forEach((element) => {
        element.classList.remove('scroll-reveal-item', 'is-revealed');
        element.style.removeProperty('--reveal-index');
      });
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
  }, [location.pathname, location.search, location.hash]);

  function getSubmenuClass(itemTo) {
    if (itemTo === '/poetry') return isWrittenPoetry ? 'active' : undefined;
    if (itemTo === '/poetry/video') return isVideoPoetry ? 'active' : undefined;
    if (itemTo === '/about#biography') {
      return publicPath === '/about' && location.hash === '#biography' ? 'active' : undefined;
    }
    if (itemTo === '/about#testimonials') {
      return publicPath === '/about' && location.hash === '#testimonials' ? 'active' : undefined;
    }
    if (itemTo === '/gallery') return publicPath === '/gallery' ? 'active' : undefined;
    return undefined;
  }

  function closeSubmenu() {
    setOpenSubmenu(null);
    document.activeElement?.blur?.();
  }

  function closeNavigation() {
    setOpenSubmenu(null);
    setMobileMenuOpen(false);
    document.activeElement?.blur?.();
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="Lulzim Tafa home">
          <img src={headerLogo} alt="Lulzim Tafa" />
        </NavLink>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true" />
        </button>
        <nav id="main-navigation" className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {navItems.map(([labelKey, to, submenu]) => (
            submenu ? (
              <div
                className={openSubmenu === to ? 'nav-item-with-submenu nav-submenu-open' : 'nav-item-with-submenu'}
                key={to}
                onMouseEnter={() => setOpenSubmenu(to)}
                onMouseLeave={() => setOpenSubmenu(null)}
                onFocus={() => setOpenSubmenu(to)}
              >
                <NavLink to={to} onClick={closeNavigation}>
                  {t(labelKey)}
                </NavLink>
                <div className="nav-submenu" aria-label={`${t(labelKey)} sections`}>
                  {submenu.map(([submenuLabelKey, submenuTo]) => (
                    <NavLink className={() => getSubmenuClass(submenuTo)} to={submenuTo} end={submenuTo === '/poetry'} onClick={closeNavigation} key={submenuTo}>
                      {t(submenuLabelKey)}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink key={to} to={to} end={to === '/'} onClick={closeNavigation}>
                {t(labelKey)}
              </NavLink>
            )
          ))}
        </nav>
        <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label={t('language.switchTo')}>
          <span className={language === 'en' ? 'is-active' : undefined}>EN</span>
          <span className={language === 'sq' ? 'is-active' : undefined}>ALB</span>
        </button>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <img src={headerLogo} alt="Lulzim Tafa" />
          <small>{t('footer.description')}</small>
        </div>
        <nav aria-label="Footer navigation">
          <h3>{t('footer.navigation')}</h3>
          {footerNavigation.map(([labelKey, to]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
        <nav aria-label="Work links">
          <h3>{t('footer.work')}</h3>
          {footerWork.map(([labelKey, to]) => (
            <NavLink key={to} to={to}>
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="footer-contact">
          <h3>{t('footer.stayInTouch')}</h3>
          <div className="footer-socials">
            {siteSettings.socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">
                  <SocialIcon type={link.icon} />
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="footer-credit">{t('footer.credit')}</p>
      </footer>
      <button className="back-to-top" type="button" aria-label="Back to top" onClick={scrollToTop}>
        <span aria-hidden="true" />
      </button>
    </div>
  );
}

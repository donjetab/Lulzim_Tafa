import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { books, newsArticles, poems } from '../data/content.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const bookMockupAssets = import.meta.glob('../assets/mockups/*', { eager: true, query: '?url', import: 'default' });

const homeFeaturedBookSlugs = ['antologji-personale', 'ekspozite-me-enderra', 'rivali-i-adamit', 'flirt'];

const homeBookMockups = {
  'antologji-personale': '/assets/mockups/hp-antologji-personale.png',
  'ekspozite-me-enderra': '/assets/mockups/hp-ekspozite-me-enderra.png',
  'rivali-i-adamit': '/assets/mockups/hp-rivali-adamit.png',
  flirt: '/assets/mockups/hp-flirt.png',
};

function getBookMockup(path) {
  if (!path) return null;
  const filename = path.split('/').pop();
  return Object.entries(bookMockupAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? null;
}

function getRandomPoem() {
  const albanianPoems = poems.filter((poem) => poem.language === 'Albanian');
  const poemPool = albanianPoems.length ? albanianPoems : poems;
  if (!poemPool.length) return null;
  return poemPool[Math.floor(Math.random() * poemPool.length)];
}

export default function Home() {
  const { t } = useLanguage();
  const quoteRef = useRef(null);
  const featuredBooks = homeFeaturedBookSlugs
    .map((slug) => books.find((book) => book.slug === slug))
    .filter(Boolean);
  const featuredPoem = useMemo(() => getRandomPoem(), []);
  const featuredNews = [...newsArticles]
    .filter((item) => !item.hiddenFromList)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  useEffect(() => {
    const animatedElements = [...document.querySelectorAll('[data-home-animate]')];

    if (!animatedElements.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.14,
    });

    animatedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = quoteRef.current;
    if (!section) return undefined;

    let frame = 0;

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distanceFromCenter = sectionCenter - viewportCenter;
      const offset = Math.max(-120, Math.min(120, distanceFromCenter * -0.18));
      section.style.setProperty('--quote-bg-y', `${offset}px`);
      frame = 0;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return (
    <>
      <section className="hero home-hero">
        <div className="hero-copy" data-home-animate="hero">
          <span className="gold-rule" aria-hidden="true" />
          <h1>Lulzim Tafa</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          <span className="gold-rule short" aria-hidden="true" />
          <p>{t('home.intro')}</p>
          <div className="button-row">
            <Link className="button-primary" to="/books">{t('home.exploreBooks')}</Link>
            <Link className="button-secondary" to="/poetry">{t('home.readPoetry')}</Link>
          </div>
        </div>
      </section>

      <div className="home-page-background">
        <section className="section home-books" data-home-animate="section">
          <div data-home-animate="fade-up">
            <SectionHeading
              eyebrow={t('home.featuredBooks')}
              title={t('home.latestBooks')}
              text={t('home.booksText')}
            />
          </div>
          <div className="home-book-row">
            {featuredBooks.map((book, index) => (
              <div className={`home-book-mockup book-tone-${index + 1}`} data-home-animate="book" style={{ '--home-index': index }} key={book.id}>
                {getBookMockup(homeBookMockups[book.slug]) ? (
                  <img className="home-book-image" src={getBookMockup(homeBookMockups[book.slug])} alt={`${book.title} book mockup`} />
                ) : (
                  <span>{book.title}</span>
                )}
              </div>
            ))}
          </div>
          <Link className="button-secondary centered-button" to="/books" data-home-animate="fade-up">{t('home.viewAllBooks')}</Link>
        </section>

        <section className="home-poetry" data-home-animate="section">
          <div className="home-poetry-copy" data-home-animate="slide-right">
            <p className="eyebrow">{t('home.poetryEyebrow')}</p>
            <h2>{t('home.poetryTitle')}</h2>
            <span className="gold-rule short" aria-hidden="true" />
            <p>{t('home.poetryText')}</p>
            <Link className="button-primary" to="/poetry">{t('home.explorePoetry')}</Link>
          </div>
          {featuredPoem && (
            <Link className="home-poem-sheet" to={`/poetry/${featuredPoem.slug}`} data-home-animate="paper">
              <div className="home-poem-text">
                <h3>{featuredPoem.title}</h3>
                <p>{featuredPoem.body.split('\n').slice(0, 8).join('\n')}</p>
              </div>
            </Link>
          )}
        </section>

        <section className="quote-banner" ref={quoteRef} data-home-animate="quote">
          <p>{t('home.quote')}</p>
        </section>

        <section className="section home-news" data-home-animate="section">
          <div data-home-animate="fade-up">
            <SectionHeading
              eyebrow={t('home.latestNews')}
              title={t('home.newsTitle')}
              text={t('home.booksText')}
            />
          </div>
          <div className="news-grid">
            {featuredNews.map((item, index) => (
              <div className="home-news-reveal" data-home-animate="news-card" style={{ '--home-index': index }} key={item.id}>
                <NewsCard item={item} />
              </div>
            ))}
          </div>
          <Link className="button-secondary centered-button" to="/news" data-home-animate="fade-up">{t('home.viewAllNews')}</Link>
        </section>
      </div>
    </>
  );
}

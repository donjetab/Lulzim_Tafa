import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { books, newsArticles, poems } from '../data/content.js';

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
          <p className="hero-subtitle">A voice shaped by scholarship, literature, and civic reflection.</p>
          <span className="gold-rule short" aria-hidden="true" />
          <p>An authorial space dedicated to books, poetry, public thought, and the intellectual world of Lulzim Tafa</p>
          <div className="button-row">
            <Link className="button-primary" to="/books">Explore Books</Link>
            <Link className="button-secondary" to="/poetry">Read Poetry</Link>
          </div>
        </div>
      </section>

      <div className="home-page-background">
        <section className="section home-books" data-home-animate="section">
          <div data-home-animate="fade-up">
            <SectionHeading
              eyebrow="Featured books"
              title="Latest Books"
              text="The first reading of the site should happen visually. Covers, titles, and concise descriptions need room to breathe."
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
          <Link className="button-secondary centered-button" to="/books" data-home-animate="fade-up">View All Books</Link>
        </section>

        <section className="home-poetry" data-home-animate="section">
          <div className="home-poetry-copy" data-home-animate="slide-right">
            <p className="eyebrow">Poetry & Creative Works</p>
            <h2>A Poetic Voice Shaped by Memory, Silence, and Reflection</h2>
            <span className="gold-rule short" aria-hidden="true" />
            <p>Lulzim Tafa's poetry moves between personal memory, collective experience, and the quiet tension of human existence.</p>
            <Link className="button-primary" to="/poetry">Explore Poetry</Link>
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
          <p>"Literature is not merely written - it is lived, examined, and questioned."</p>
        </section>

        <section className="section home-news" data-home-animate="section">
          <div data-home-animate="fade-up">
            <SectionHeading
              eyebrow="Latest News"
              title="News & Updates"
              text="The first reading of the site should happen visually. Covers, titles, and concise descriptions need room to breathe."
            />
          </div>
          <div className="news-grid">
            {featuredNews.map((item, index) => (
              <div className="home-news-reveal" data-home-animate="news-card" style={{ '--home-index': index }} key={item.id}>
                <NewsCard item={item} />
              </div>
            ))}
          </div>
          <Link className="button-secondary centered-button" to="/news" data-home-animate="fade-up">View All News</Link>
        </section>
      </div>
    </>
  );
}

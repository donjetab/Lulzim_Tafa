import { Link } from 'react-router-dom';
import AwardCard from '../components/AwardCard.jsx';
import BookCard from '../components/BookCard.jsx';
import NewsCard from '../components/NewsCard.jsx';
import PoemCard from '../components/PoemCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { awards, books, newsArticles, poems, siteSettings } from '../data/content.js';

export default function Home() {
  const featuredBooks = books.filter((book) => book.featured);
  const featuredPoem = poems.find((poem) => poem.featured);
  const featuredNews = newsArticles.filter((item) => item.featured).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Official literary archive</p>
          <h1>{siteSettings.heroTitle}</h1>
          <p>{siteSettings.heroText}</p>
          <div className="button-row">
            <Link className="button-primary" to="/books">Explore Books</Link>
            <Link className="button-secondary" to="/poetry">Read Poetry</Link>
          </div>
        </div>
        <div className="hero-portrait" aria-label="Author portrait placeholder">
          <span>Lulzim Tafa</span>
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Latest books" title="Selected Works" text="Book entities are reused across home, listing, and detail pages." />
        <div className="book-grid featured-grid">
          {featuredBooks.map((book) => <BookCard key={book.id} book={book} featured />)}
        </div>
      </section>

      <section className="section split-section">
        <SectionHeading eyebrow="Poetry preview" title="A poem on parchment" text="The same poem record appears on the Poetry page and details page." />
        {featuredPoem && <PoemCard poem={featuredPoem} />}
      </section>

      <section className="quote-banner">
        <p>“Literature keeps the archive of feeling alive.”</p>
      </section>

      <section className="section">
        <SectionHeading eyebrow="News & updates" title="Recent Notes" />
        <div className="news-grid">
          {featuredNews.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Recognition" title="Featured Honors" />
        <div className="award-grid featured-grid">
          {awards.filter((award) => award.featured).slice(0, 3).map((award) => (
            <AwardCard key={award.id} award={award} featured />
          ))}
        </div>
      </section>
    </>
  );
}

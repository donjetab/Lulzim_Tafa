import NewsCard from '../components/NewsCard.jsx';
import PageHero from '../components/PageHero.jsx';
import { newsArticles } from '../data/content.js';

export default function News() {
  return (
    <>
      <PageHero eyebrow="News & Interviews" title="Public Notes and Conversations" text="Supports internal article detail pages and external interview links." />
      <section className="section">
        <div className="news-grid">
          {newsArticles.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      </section>
    </>
  );
}

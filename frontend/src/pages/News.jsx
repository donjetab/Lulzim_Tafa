import { useMemo, useState } from 'react';
import NewsCard from '../components/NewsCard.jsx';
import PageHero from '../components/PageHero.jsx';
import { newsArticles } from '../data/content.js';

const NEWS_PER_PAGE = 9;
const filters = ['All', 'News', 'Interview'];

export default function News() {
  const sortedNews = useMemo(
    () => [...newsArticles].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [],
  );
  const [activeFilter, setActiveFilter] = useState('All');
  const [page, setPage] = useState(1);
  const filteredNews = activeFilter === 'All'
    ? sortedNews
    : sortedNews.filter((item) => item.category === activeFilter);
  const pageCount = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const firstIndex = (page - 1) * NEWS_PER_PAGE;
  const visibleNews = filteredNews.slice(firstIndex, firstIndex + NEWS_PER_PAGE);

  function changeFilter(filter) {
    setActiveFilter(filter);
    setPage(1);
  }

  return (
    <>
      <PageHero
        eyebrow="News & Interviews"
        title="News, Interviews & Updates"
        text="Here you can find news, interviews, and updates regarding Lulzim Tafa's activities."
        variant="news"
      />
      <section className="section news-list-section">
        <div className="news-filter" aria-label="Filter news">
          {filters.map((filter) => (
            <button
              className={filter === activeFilter ? 'is-active' : ''}
              key={filter}
              type="button"
              onClick={() => changeFilter(filter)}
              aria-pressed={filter === activeFilter}
            >
              {filter === 'Interview' ? 'Interviews' : filter}
            </button>
          ))}
        </div>
        <div className="news-grid">
          {visibleNews.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
        {pageCount > 1 && (
          <nav className="news-pagination" aria-label="News pages">
            {Array.from({ length: pageCount }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  className={pageNumber === page ? 'is-active' : ''}
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-label={`Show news page ${pageNumber}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}
          </nav>
        )}
      </section>
    </>
  );
}

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import PageHero from '../components/PageHero.jsx';
import { newsArticles } from '../data/content.js';

const NEWS_PER_PAGE = 9;
const filters = ['All', 'News', 'Interview'];

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortedNews = useMemo(
    () => newsArticles
      .filter((item) => !item.hiddenFromList)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [],
  );
  const filterParam = searchParams.get('filter');
  const activeFilter = filters.includes(filterParam) ? filterParam : 'All';
  const filteredNews = activeFilter === 'All'
    ? sortedNews
    : sortedNews.filter((item) => item.category === activeFilter);
  const pageCount = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const requestedPage = Number(searchParams.get('page')) || 1;
  const page = Math.min(Math.max(requestedPage, 1), pageCount || 1);
  const firstIndex = (page - 1) * NEWS_PER_PAGE;
  const visibleNews = filteredNews.slice(firstIndex, firstIndex + NEWS_PER_PAGE);

  function updateListParams(nextFilter, nextPage) {
    const params = new URLSearchParams();
    if (nextFilter !== 'All') params.set('filter', nextFilter);
    if (nextPage > 1) params.set('page', String(nextPage));
    setSearchParams(params);
  }

  function changeFilter(filter) {
    updateListParams(filter, 1);
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
                  onClick={() => updateListParams(activeFilter, pageNumber)}
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

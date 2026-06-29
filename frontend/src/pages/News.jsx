import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import PageHero from '../components/PageHero.jsx';
import { newsArticles } from '../data/content.js';
import { mediaSpotlightLinks } from '../data/mediaSpotlight.js';

const NEWS_PER_PAGE = 9;
const MEDIA_SPOTLIGHT_FILTER = 'Media Spotlight';
const filters = ['All', 'News', 'Interview', MEDIA_SPOTLIGHT_FILTER];

function getSearchText(item) {
  const body = Array.isArray(item.body) ? item.body.join(' ') : item.body;

  return [
    item.title,
    item.excerpt,
    item.category,
    item.sourceLabel,
    body,
  ].filter(Boolean).join(' ').toLowerCase();
}

function getMediaSearchText(item) {
  return [
    item.name,
    item.url,
  ].join(' ').toLowerCase();
}

function getHostName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

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
  const isMediaSpotlight = activeFilter === MEDIA_SPOTLIGHT_FILTER;
  const searchQuery = searchParams.get('q')?.trim() ?? '';
  const normalizedSearchQuery = searchQuery.toLowerCase();
  const categoryNews = isMediaSpotlight
    ? []
    : activeFilter === 'All'
      ? sortedNews
      : sortedNews.filter((item) => item.category === activeFilter);
  const filteredNews = normalizedSearchQuery
    ? categoryNews.filter((item) => getSearchText(item).includes(normalizedSearchQuery))
    : categoryNews;
  const filteredMediaSpotlight = normalizedSearchQuery
    ? mediaSpotlightLinks.filter((item) => getMediaSearchText(item).includes(normalizedSearchQuery))
    : mediaSpotlightLinks;
  const pageCount = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const requestedPage = Number(searchParams.get('page')) || 1;
  const page = Math.min(Math.max(requestedPage, 1), pageCount || 1);
  const firstIndex = (page - 1) * NEWS_PER_PAGE;
  const visibleNews = filteredNews.slice(firstIndex, firstIndex + NEWS_PER_PAGE);

  function updateListParams(nextFilter, nextPage, nextSearchQuery = searchQuery) {
    const params = new URLSearchParams();
    if (nextFilter !== 'All') params.set('filter', nextFilter);
    if (nextSearchQuery.trim()) params.set('q', nextSearchQuery.trim());
    if (nextPage > 1) params.set('page', String(nextPage));
    setSearchParams(params);
  }

  function changeFilter(filter) {
    updateListParams(filter, 1);
  }

  function changeSearch(event) {
    updateListParams(activeFilter, 1, event.target.value);
  }

  function clearSearch() {
    updateListParams(activeFilter, 1, '');
  }

  const hasResults = isMediaSpotlight ? filteredMediaSpotlight.length > 0 : visibleNews.length > 0;
  const searchLabel = isMediaSpotlight ? 'Search media' : 'Search news';
  const searchPlaceholder = isMediaSpotlight ? 'Search by media name or domain' : 'Search by title, topic, or source';

  return (
    <>
      <PageHero
        eyebrow="News & Interviews"
        title="News, Interviews & Updates"
        text="Here you can find news, interviews, and updates regarding Lulzim Tafa's activities."
        variant="news"
      />
      <section className="section news-list-section">
        <div className="news-toolbar">
          <label className="news-search" htmlFor="news-search">
            <span>{searchLabel}</span>
            <input
              id="news-search"
              type="search"
              value={searchQuery}
              onChange={changeSearch}
              placeholder={searchPlaceholder}
            />
          </label>
          {searchQuery && (
            <button className="news-search-clear" type="button" onClick={clearSearch}>
              Clear
            </button>
          )}
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
        </div>
        {isMediaSpotlight && hasResults ? (
          <div className="media-spotlight-grid">
            {filteredMediaSpotlight.map((item) => (
              <a className="media-spotlight-card" href={item.url} target="_blank" rel="noreferrer" key={`${item.name}-${item.url}`}>
                <span>{getHostName(item.url)}</span>
                <strong>{item.name}</strong>
                <small>Open media page for Lulzim Tafa</small>
              </a>
            ))}
          </div>
        ) : visibleNews.length > 0 ? (
          <div className="news-grid">
            {visibleNews.map((item) => <NewsCard key={item.id} item={item} />)}
          </div>
        ) : (
          <p className="news-empty-state">No {isMediaSpotlight ? 'media outlets' : 'news'} found for your search.</p>
        )}
        {!isMediaSpotlight && pageCount > 1 && (
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

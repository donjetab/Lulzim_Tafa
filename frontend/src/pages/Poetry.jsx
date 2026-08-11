import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink.jsx';
import PoemCard from '../components/PoemCard.jsx';
import { cms, fallbackData, resolveMediaUrl, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { normalizePublicPath } from '../i18n/localizedRoutes.js';
import {
  getListMemoryKey,
  readListState,
  rememberListScroll,
  rememberListState,
  restoreListScroll,
} from '../utils/scrollMemory.js';

const POEMS_PER_BATCH = 12;

function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function Poetry() {
  const { language: siteLanguage, t } = useLanguage();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const listMemoryKey = getListMemoryKey('poetry', location);
  const rememberedState = useMemo(() => readListState(listMemoryKey), [listMemoryKey]);
  const { data: poems } = useCmsData(() => cms.getPoems(undefined, siteLanguage), fallbackData.poems, [siteLanguage]);
  const { data: poemLanguages } = useCmsData(cms.getPoemLanguages, fallbackData.poemLanguages, []);
  const { data: videoPoetryItems } = useCmsData(() => cms.getVideoPoetry(siteLanguage), fallbackData.videoPoetryItems, [siteLanguage]);
  const [language, setLanguage] = useState(() => rememberedState?.language ?? 'All');
  const [titleQuery, setTitleQuery] = useState(() => rememberedState?.titleQuery ?? '');
  const [visibleCount, setVisibleCount] = useState(() => rememberedState?.visibleCount ?? POEMS_PER_BATCH);
  const normalizedPath = normalizePublicPath(location.pathname, siteLanguage);
  const activeView = normalizedPath === '/poetry/video' || searchParams.get('view') === 'video' ? 'video' : 'written';
  const normalizedTitleQuery = normalizeSearchText(titleQuery.trim());
  const filteredPoems = useMemo(() => {
    return poems.filter((poem) => {
      const matchesLanguage = language === 'All' || poem.language === language;
      const matchesTitle = !normalizedTitleQuery || normalizeSearchText(poem.title).includes(normalizedTitleQuery);

      return matchesLanguage && matchesTitle;
    });
  }, [language, normalizedTitleQuery, poems]);
  const isAllPoems = language === 'All';
  const visiblePoems = isAllPoems ? filteredPoems.slice(0, visibleCount) : filteredPoems;
  const hasMorePoems = isAllPoems && visibleCount < filteredPoems.length;

  useEffect(() => {
    restoreListScroll(listMemoryKey);
  }, [listMemoryKey, visiblePoems.length, videoPoetryItems.length]);

  function rememberPoetryPlace() {
    rememberListScroll(listMemoryKey);
    rememberListState(listMemoryKey, { language, titleQuery, visibleCount });
  }

  function selectLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setVisibleCount(POEMS_PER_BATCH);
  }

  function updateTitleQuery(event) {
    setTitleQuery(event.target.value);
    setVisibleCount(POEMS_PER_BATCH);
  }

  function clearTitleQuery() {
    setTitleQuery('');
    setVisibleCount(POEMS_PER_BATCH);
  }

  return (
    <main className="poetry-page">
      <section className="poetry-hero">
        <div className="poetry-hero-copy">
          <p className="eyebrow">{t('poetry.eyebrow')}</p>
          <h1>{t('poetry.title')}</h1>
          <span className="gold-rule" />
          <p>{t('poetry.text')}</p>
        </div>
      </section>

      <section className="poetry-archive">
        <nav className="poetry-view-tabs" aria-label="Poetry sections">
          <Link className={activeView === 'written' ? 'active' : ''} to="/poetry">
            {t('nav.writtenPoetry')}
          </Link>
          <Link className={activeView === 'video' ? 'active' : ''} to="/poetry/video">
            {t('nav.videoPoetry')}
          </Link>
        </nav>

        {activeView === 'written' ? (
          <>
            <div className="poetry-toolbar">
              <label className="poetry-search" htmlFor="poetry-title-search">
                <span>{t('poetry.searchLabel')}</span>
                <input
                  id="poetry-title-search"
                  type="search"
                  value={titleQuery}
                  onChange={updateTitleQuery}
                  placeholder={t('poetry.searchPlaceholder')}
                />
              </label>
              {titleQuery && (
                <button className="poetry-search-clear" type="button" onClick={clearTitleQuery}>
                  {t('poetry.clearSearch')}
                </button>
              )}
            </div>

            <div className="poetry-language-filter" aria-label="Filter poems by language">
              <button className={language === 'All' ? 'active' : ''} type="button" onClick={() => selectLanguage('All')}>
                {t('poetry.all')}
              </button>
              {poemLanguages.map((item) => (
                <button key={item} className={language === item ? 'active' : ''} type="button" onClick={() => selectLanguage(item)}>
                  {item}
                </button>
              ))}
            </div>

            {visiblePoems.length > 0 ? (
              <div className="poetry-paper-grid">
                {visiblePoems.map((poem, index) => (
                  <PoemCard key={poem.id} poem={poem} index={index} onOpen={rememberPoetryPlace} />
                ))}
              </div>
            ) : (
              <p className="poetry-empty-state">{t('poetry.empty')}</p>
            )}

            {hasMorePoems && (
              <div className="poetry-load-more">
                <p>{visiblePoems.length} of {filteredPoems.length} poems shown</p>
                <button type="button" onClick={() => setVisibleCount((count) => count + POEMS_PER_BATCH)}>
                  {t('poetry.seeMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <section className="poetry-video-section" aria-labelledby="video-poetry-title">
            <div className="poetry-video-heading">
              <p className="eyebrow">{t('nav.videoPoetry')}</p>
              <h2 id="video-poetry-title">{t('poetry.videoTitle')}</h2>
              <p>{t('poetry.videoText')}</p>
            </div>

            {videoPoetryItems.length > 0 ? (
              <div className="poetry-video-grid">
                {videoPoetryItems.map((item) => {
                  const cardContent = (
                    <>
                      <div className="poetry-video-thumb">
                        {item.type === 'youtube' ? (
                          <img src={resolveMediaUrl(item.thumbnail)} alt="" />
                        ) : (
                          <video src={encodeURI(resolveMediaUrl(item.url))} muted playsInline preload="metadata" />
                        )}
                        <span className="poetry-video-play" aria-hidden="true" />
                      </div>
                      <div className="poetry-video-card-copy">
                        <h3>{item.title}</h3>
                      </div>
                    </>
                  );

                  return item.type === 'youtube' ? (
                    <a className="poetry-video-card" href={item.url} key={item.id} target="_blank" rel="noreferrer">
                      {cardContent}
                    </a>
                  ) : (
                    <Link className="poetry-video-card" key={item.id} to={`/poetry/video/${item.slug}`} onClick={rememberPoetryPlace}>
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="poetry-video-empty">
                <p>{t('poetry.videoEmpty')}</p>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

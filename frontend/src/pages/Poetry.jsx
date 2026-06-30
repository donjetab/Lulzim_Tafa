import { useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PoemCard from '../components/PoemCard.jsx';
import { poemLanguages, poems } from '../data/content.js';
import { videoPoetryItems } from '../data/videoPoetry.js';

const POEMS_PER_BATCH = 12;

export default function Poetry() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState('All');
  const [visibleCount, setVisibleCount] = useState(POEMS_PER_BATCH);
  const activeView = location.pathname === '/poetry/video' || searchParams.get('view') === 'video' ? 'video' : 'written';
  const filteredPoems = useMemo(
    () => language === 'All' ? poems : poems.filter((poem) => poem.language === language),
    [language],
  );
  const isAllPoems = language === 'All';
  const visiblePoems = isAllPoems ? filteredPoems.slice(0, visibleCount) : filteredPoems;
  const hasMorePoems = isAllPoems && visibleCount < filteredPoems.length;

  function selectLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setVisibleCount(POEMS_PER_BATCH);
  }

  return (
    <main className="poetry-page">
      <section className="poetry-hero">
        <div className="poetry-hero-copy">
          <p className="eyebrow">Poetry</p>
          <h1>A World of Poetry, Memory and Reflection</h1>
          <span className="gold-rule" />
          <p>Selected poems, translations, and fragments arranged as paper notes from a literary archive.</p>
        </div>
      </section>

      <section className="poetry-archive">
        <nav className="poetry-view-tabs" aria-label="Poetry sections">
          <Link className={activeView === 'written' ? 'active' : ''} to="/poetry">
            Written Poetry
          </Link>
          <Link className={activeView === 'video' ? 'active' : ''} to="/poetry/video">
            Video Poetry
          </Link>
        </nav>

        {activeView === 'written' ? (
          <>
            <div className="poetry-language-filter" aria-label="Filter poems by language">
              <button className={language === 'All' ? 'active' : ''} type="button" onClick={() => selectLanguage('All')}>
                All
              </button>
              {poemLanguages.map((item) => (
                <button key={item} className={language === item ? 'active' : ''} type="button" onClick={() => selectLanguage(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="poetry-paper-grid">
              {visiblePoems.map((poem, index) => <PoemCard key={poem.id} poem={poem} index={index} />)}
            </div>

            {hasMorePoems && (
              <div className="poetry-load-more">
                <p>{visiblePoems.length} of {filteredPoems.length} poems shown</p>
                <button type="button" onClick={() => setVisibleCount((count) => count + POEMS_PER_BATCH)}>
                  See more poems
                </button>
              </div>
            )}
          </>
        ) : (
          <section className="poetry-video-section" aria-labelledby="video-poetry-title">
            <div className="poetry-video-heading">
              <p className="eyebrow">Video Poetry</p>
              <h2 id="video-poetry-title">Poems in Video</h2>
              <p>Selected recordings and video poems will be collected here.</p>
            </div>

            {videoPoetryItems.length > 0 ? (
              <div className="poetry-video-grid">
                {videoPoetryItems.map((item) => {
                  const cardContent = (
                    <>
                      <div className="poetry-video-thumb">
                        {item.type === 'youtube' ? (
                          <img src={item.thumbnail} alt="" />
                        ) : (
                          <video src={encodeURI(item.url)} muted playsInline preload="metadata" />
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
                    <Link className="poetry-video-card" key={item.id} to={`/poetry/video/${item.slug}`}>
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="poetry-video-empty">
                <p>Video poetry items are ready to be added.</p>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

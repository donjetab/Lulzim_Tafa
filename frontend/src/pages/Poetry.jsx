import { useMemo, useState } from 'react';
import PoemCard from '../components/PoemCard.jsx';
import { poemLanguages, poems } from '../data/content.js';

const POEMS_PER_BATCH = 12;

export default function Poetry() {
  const [language, setLanguage] = useState('All');
  const [visibleCount, setVisibleCount] = useState(POEMS_PER_BATCH);
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
      </section>
    </main>
  );
}

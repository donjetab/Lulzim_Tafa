import { useMemo, useState } from 'react';
import PoemCard from '../components/PoemCard.jsx';
import { poemLanguages, poems } from '../data/content.js';

export default function Poetry() {
  const [language, setLanguage] = useState('All');
  const filteredPoems = useMemo(
    () => language === 'All' ? poems : poems.filter((poem) => poem.language === language),
    [language],
  );

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
          <button className={language === 'All' ? 'active' : ''} type="button" onClick={() => setLanguage('All')}>
            All
          </button>
          {poemLanguages.map((item) => (
            <button key={item} className={language === item ? 'active' : ''} type="button" onClick={() => setLanguage(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="poetry-paper-grid">
          {filteredPoems.map((poem, index) => <PoemCard key={poem.id} poem={poem} index={index} />)}
        </div>
      </section>
    </main>
  );
}

import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import PoemCard from '../components/PoemCard.jsx';
import { poemLanguages, poems } from '../data/content.js';

export default function Poetry() {
  const [language, setLanguage] = useState('All');
  const filteredPoems = useMemo(
    () => language === 'All' ? poems : poems.filter((poem) => poem.language === language),
    [language],
  );

  return (
    <>
      <PageHero eyebrow="Poetry" title="Poems in Translation" text="Language filters are powered by shared poem language records." variant="writing" />
      <section className="section">
        <div className="filter-row">
          <button className={language === 'All' ? 'active' : ''} onClick={() => setLanguage('All')}>All</button>
          {poemLanguages.map((item) => (
            <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item}</button>
          ))}
        </div>
        <div className="poem-grid">
          {filteredPoems.map((poem) => <PoemCard key={poem.id} poem={poem} />)}
        </div>
      </section>
    </>
  );
}

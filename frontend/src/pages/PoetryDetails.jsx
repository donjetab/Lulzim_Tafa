import { Link, useParams } from 'react-router-dom';
import { poems } from '../data/content.js';

function getPoemLines(poem) {
  return (poem.body || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function getStableSeed(value) {
  return [...value].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) % 9973;
  }, 7);
}

export default function PoetryDetails() {
  const { slug } = useParams();
  const index = poems.findIndex((item) => item.slug === slug);
  const poem = poems[index];
  const previous = poems[index - 1];
  const next = poems[index + 1];

  if (!poem) return <section className="section"><h1>Poem not found</h1></section>;

  const lines = getPoemLines(poem);
  const seed = getStableSeed(`${poem.slug}-${poem.language}-${poem.title}`);
  const longestLine = lines.reduce((longest, line) => Math.max(longest, line.length), 0);
  const isShortPoem = lines.length <= 14;
  const useWideShortPaper = isShortPoem && longestLine > 34;
  const shortPaperVariant = useWideShortPaper ? 5 : (seed % 4) + 1;
  const paperClassName = isShortPoem
    ? `poem-paper poem-paper-short poem-paper-short-${shortPaperVariant}`
    : 'poem-paper';

  return (
    <main className="single-poetry-page">
      <section className="single-poetry-hero">
        <p className="eyebrow">{poem.language}</p>
        <h1>{poem.title}</h1>
        <span className="gold-rule" />
      </section>

      <section className="poem-detail" aria-label={`${poem.title} poem`}>
        <article className={paperClassName}>
          <pre>{poem.body}</pre>
        </article>
        <div className="detail-nav">
          <Link className="text-link" to="/poetry">Back to poetry</Link>
          {previous && <Link className="text-link" to={`/poetry/${previous.slug}`}>Previous</Link>}
          {next && <Link className="text-link" to={`/poetry/${next.slug}`}>Next</Link>}
        </div>
      </section>
    </main>
  );
}

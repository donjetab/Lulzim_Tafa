import { Link, useParams } from 'react-router-dom';
import { poems } from '../data/content.js';

export default function PoetryDetails() {
  const { slug } = useParams();
  const index = poems.findIndex((item) => item.slug === slug);
  const poem = poems[index];
  const previous = poems[index - 1];
  const next = poems[index + 1];

  if (!poem) return <section className="section"><h1>Poem not found</h1></section>;

  return (
    <section className="section poem-detail">
      <article className="poem-paper">
        <p className="eyebrow">{poem.language}</p>
        <h1>{poem.title}</h1>
        <pre>{poem.body}</pre>
      </article>
      <div className="detail-nav">
        <Link className="text-link" to="/poetry">Back to poetry</Link>
        {previous && <Link className="text-link" to={`/poetry/${previous.slug}`}>Previous</Link>}
        {next && <Link className="text-link" to={`/poetry/${next.slug}`}>Next</Link>}
      </div>
    </section>
  );
}

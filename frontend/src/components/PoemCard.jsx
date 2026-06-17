import { Link } from 'react-router-dom';

export default function PoemCard({ poem }) {
  return (
    <article className="poem-card">
      <p className="eyebrow">{poem.language}</p>
      <h3>{poem.title}</h3>
      <p>{poem.excerpt}</p>
      <Link className="text-link" to={`/poetry/${poem.slug}`}>
        Read the poem
      </Link>
    </article>
  );
}

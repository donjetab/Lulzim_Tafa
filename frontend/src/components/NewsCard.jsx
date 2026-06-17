import { Link } from 'react-router-dom';

export default function NewsCard({ item }) {
  const content = (
    <>
      <div className="news-image" aria-hidden="true">
        <span>{item.category}</span>
      </div>
      <div className="news-content">
        <time>{new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
        <p className="eyebrow">{item.category}</p>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <span className="text-link">Read More</span>
      </div>
    </>
  );

  if (item.isExternal) {
    return (
      <a className="news-card" href={item.externalUrl} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link className="news-card" to={`/news/${item.slug}`}>
      {content}
    </Link>
  );
}

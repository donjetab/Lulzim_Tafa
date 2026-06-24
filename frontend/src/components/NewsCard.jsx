import { Link } from 'react-router-dom';

const newsImageAssets = import.meta.glob('../assets/news/*', { eager: true, query: '?url', import: 'default' });

function getNewsImage(path) {
  if (!path) return null;
  const filename = path.split('/').pop();
  return Object.entries(newsImageAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? null;
}

export default function NewsCard({ item }) {
  const image = getNewsImage(item.image);
  const date = new Date(item.date);
  const label = item.isExternal ? 'Open Link' : 'Read More';

  const content = (
    <>
      <div className="news-image">
        {image ? <img src={image} alt="" /> : <span>{item.category}</span>}
      </div>
      <div className="news-content">
        <time dateTime={item.date}>
          <strong>{date.getDate()}</strong>
          <span>{date.toLocaleDateString('en', { month: 'short' })}</span>
        </time>
        <p className="eyebrow">{item.category}</p>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <span className="text-link">{label} <span aria-hidden="true">→</span></span>
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

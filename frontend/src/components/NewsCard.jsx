import { Link, useLocation } from 'react-router-dom';
import { resolveMediaUrl } from '../data/api.js';
import { getListMemoryKey, rememberListScroll } from '../utils/scrollMemory.js';

const newsImageAssets = import.meta.glob('../assets/news/*', { eager: true, query: '?url', import: 'default' });

function getNewsImage(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/uploads/')) return resolveMediaUrl(path);
  const filename = path.split('/').pop();
  return Object.entries(newsImageAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? resolveMediaUrl(path);
}

export default function NewsCard({ item }) {
  const location = useLocation();
  const listMemoryKey = getListMemoryKey('news', location);
  const image = getNewsImage(item.thumbnail || item.image);
  const date = new Date(item.date);
  const label = item.isExternal ? 'Open Link' : 'Read More';
  const categoryLabel = item.isExternal ? `${item.category} · External` : item.category;

  const content = (
    <>
      <div className="news-image">
        {image ? (
          <img src={image} alt="" />
        ) : item.videoPreviewUrl ? (
          <video src={item.videoPreviewUrl} muted playsInline preload="metadata" aria-label={`${item.title} video preview`} />
        ) : (
          <span>{item.category}</span>
        )}
      </div>
      <div className="news-content">
        <time dateTime={item.date}>
          <strong>{date.getDate()}</strong>
          <span>{date.toLocaleDateString('en', { month: 'short' })}</span>
        </time>
        <p className="eyebrow">{categoryLabel}</p>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <span className="text-link">{label} <span aria-hidden="true">→</span></span>
      </div>
    </>
  );

  if (item.isExternal) {
    return (
      <a className="news-card" href={item.externalUrl || item.sourceUrl || item.url || '#'} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link
      className="news-card"
      to={`/news/${item.slug}`}
      state={{ from: `${location.pathname}${location.search}` }}
      onClick={() => rememberListScroll(listMemoryKey)}
    >
      {content}
    </Link>
  );
}

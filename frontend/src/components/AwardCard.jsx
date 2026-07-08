import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../data/api.js';

const awardAssets = import.meta.glob('../assets/decorative/award-*.png', { eager: true, query: '?url', import: 'default' });

function getAwardAsset(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path) || path.startsWith('/uploads/')) return resolveMediaUrl(path);
  const filename = path.split('/').pop();
  return Object.entries(awardAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? resolveMediaUrl(path);
}

export default function AwardCard({ award }) {
  const icon = getAwardAsset(award.icon);
  const isPortrait = award.layout === 'portrait';

  return (
    <Link className={`award-card award-card-${award.layout} award-card-${award.slug}`} to={`/awards/${award.slug}`}>
      <span className="award-icon" aria-hidden="true">
        {icon ? <img src={icon} alt="" /> : award.year}
      </span>
      <span className="award-card-copy">
        <h3>{award.title}</h3>
        <p>{award.description}</p>
        <small>{[award.year, award.location].filter(Boolean).join(' / ')}</small>
      </span>
      <span className="award-card-cta">{isPortrait ? 'View award' : 'Open recognition'}</span>
    </Link>
  );
}

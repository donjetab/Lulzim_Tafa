import { Link } from 'react-router-dom';

const awardAssets = import.meta.glob('../assets/decorative/award-*.png', { eager: true, query: '?url', import: 'default' });

function getAwardAsset(path) {
  if (!path) return null;
  const filename = path.split('/').pop();
  return Object.entries(awardAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? null;
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

import { Link, useParams } from 'react-router-dom';
import { awards } from '../data/content.js';

const awardImages = import.meta.glob('../assets/awards/*', { eager: true, query: '?url', import: 'default' });

function getAwardImage(path) {
  if (!path) return null;
  const filename = path.split('/').pop();
  return Object.entries(awardImages).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? null;
}

export default function AwardDetails() {
  const { slug } = useParams();
  const award = awards.find((item) => item.slug === slug);

  if (!award) return <section className="section award-detail-section"><h1>Award not found</h1></section>;

  const meta = [award.year, award.location].filter(Boolean).join(' / ');
  const awardImage = getAwardImage(award.image);

  return (
    <section className="section award-detail-section">
      <article className="award-detail-copy">
        <p className="eyebrow">{meta}</p>
        <h1>{award.title}</h1>
        <p>{award.description}</p>
        <Link className="text-link" to="/awards">Back to awards</Link>
      </article>
      <div className={awardImage ? 'award-detail-image' : 'award-detail-image-placeholder'}>
        {awardImage ? <img src={awardImage} alt={award.title} /> : <span>Award image</span>}
      </div>
    </section>
  );
}

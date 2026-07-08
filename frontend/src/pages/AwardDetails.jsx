import { Link, useParams } from 'react-router-dom';
import { cms, fallbackData, resolveMediaUrl, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const awardImages = import.meta.glob('../assets/awards/*', { eager: true, query: '?url', import: 'default' });

function getAwardImage(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path) || path.startsWith('/uploads/')) return resolveMediaUrl(path);
  const filename = path.split('/').pop();
  return Object.entries(awardImages).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? resolveMediaUrl(path);
}

export default function AwardDetails() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { data: awards } = useCmsData(() => cms.getAwards(language), fallbackData.awards, [language]);
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

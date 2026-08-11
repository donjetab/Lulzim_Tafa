import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from '../components/LocalizedLink.jsx';
import { cms, fallbackData, resolveMediaUrl, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function PoetryVideoDetails() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { data: videoPoetryItems, isLoading } = useCmsData(() => cms.getVideoPoetry(language), fallbackData.videoPoetryItems, [language]);
  const item = videoPoetryItems.find((video) => video.slug === slug && video.type === 'local');

  useEffect(() => {
    if (item?.title) document.title = `${item.title} | Lulzim Tafa`;
  }, [item?.title]);

  if (isLoading) return <section className="section"><h1>Loading video...</h1></section>;
  if (!item) return <section className="section"><h1>Video not found</h1></section>;

  return (
    <article className="section news-detail news-detail-page video-detail-page poetry-video-detail-page">
      <Link className="news-back-link" to="/poetry/video" aria-label="Back to video poetry">
        <span aria-hidden="true">&larr;</span>
        Back to video poetry
      </Link>
      <p className="eyebrow">Video Poetry</p>
      <h1>{item.title}</h1>
      <div className="video-detail-player">
        <video src={encodeURI(resolveMediaUrl(item.url))} controls preload="metadata" />
      </div>
    </article>
  );
}

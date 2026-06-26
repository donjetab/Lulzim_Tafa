import { Link, useParams } from 'react-router-dom';
import { videoPoetryItems } from '../data/videoPoetry.js';

export default function PoetryVideoDetails() {
  const { slug } = useParams();
  const item = videoPoetryItems.find((video) => video.slug === slug && video.type === 'local');

  if (!item) return <section className="section"><h1>Video not found</h1></section>;

  return (
    <article className="section news-detail news-detail-page video-detail-page poetry-video-detail-page">
      <Link className="news-back-link" to="/poetry?view=video" aria-label="Back to video poetry">
        <span aria-hidden="true">&larr;</span>
        Back to video poetry
      </Link>
      <p className="eyebrow">Video Poetry</p>
      <h1>{item.title}</h1>
      <div className="video-detail-player">
        <video src={encodeURI(item.url)} controls preload="metadata" />
      </div>
    </article>
  );
}

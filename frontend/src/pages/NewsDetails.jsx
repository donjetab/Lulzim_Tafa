import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { newsArticles } from '../data/content.js';

const newsImageAssets = import.meta.glob('../assets/news/*', { eager: true, query: '?url', import: 'default' });

function getImage(path) {
  if (!path) return null;
  const filename = path.split('/').pop();
  return Object.entries(newsImageAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? null;
}

export default function NewsDetails() {
  const { slug } = useParams();
  const [previewImage, setPreviewImage] = useState(null);
  const item = newsArticles.find((article) => article.slug === slug);

  if (!item) return <section className="section"><h1>Article not found</h1></section>;

  const image = getImage(item.image);
  const galleryImages = (item.galleryImages || []).map((path) => getImage(path)).filter(Boolean);
  const paragraphs = Array.isArray(item.body)
    ? item.body
    : item.body.split('\n').map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <article className="section news-detail news-detail-page">
      <Link className="news-back-link" to="/news" aria-label="Back to news">
        <span aria-hidden="true">←</span>
        Back to news
      </Link>
      <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
      <h1>{item.title}</h1>
      <div className="detail-image news-detail-image">
        {image ? (
          <button type="button" onClick={() => setPreviewImage(image)} aria-label="Preview main article photo">
            <img src={image} alt="" />
          </button>
        ) : (
          <span>{item.category}</span>
        )}
      </div>
      <div className="news-detail-body">
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {item.sourceUrl && (
          <a className="news-source-link" href={item.sourceUrl} target="_blank" rel="noreferrer">
            {item.sourceUrl}
          </a>
        )}
      </div>
      {galleryImages.length > 0 && (
        <div className="news-gallery" aria-label="Photo album">
          {galleryImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setPreviewImage(src)}
              aria-label={`Preview photo ${index + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      {previewImage && (
        <div className="news-photo-preview" role="dialog" aria-modal="true" aria-label="Photo preview">
          <button className="news-photo-preview-backdrop" type="button" onClick={() => setPreviewImage(null)} aria-label="Close photo preview" />
          <div className="news-photo-preview-panel">
            <img src={previewImage} alt="" />
            <button type="button" onClick={() => setPreviewImage(null)} aria-label="Close photo preview">×</button>
          </div>
        </div>
      )}
    </article>
  );
}

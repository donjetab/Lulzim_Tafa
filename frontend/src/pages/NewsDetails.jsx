import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { newsArticles } from '../data/content.js';

const newsImageAssets = import.meta.glob('../assets/news/*', { eager: true, query: '?url', import: 'default' });

function getImage(path) {
  if (!path) return null;
  const filename = path.split('/').pop();
  return Object.entries(newsImageAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? null;
}

function getYoutubeEmbedUrl(url) {
  const videoId = url.match(/[?&]v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?&]+)/)?.[1];
  if (!videoId) return url;

  const start = url.match(/[?&]t=(\d+)s?/)?.[1];
  const params = new URLSearchParams();
  if (start) params.set('start', start);

  const query = params.toString();
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`;
}

function BackToNewsLink({ to }) {
  return (
    <Link className="news-back-link" to={to} aria-label="Back to news">
      <span aria-hidden="true">&larr;</span>
      Back to news
    </Link>
  );
}

export default function NewsDetails() {
  const { slug } = useParams();
  const location = useLocation();
  const [previewImage, setPreviewImage] = useState(null);
  const item = newsArticles.find((article) => article.slug === slug);

  if (!item) return <section className="section"><h1>Article not found</h1></section>;

  const image = getImage(item.image);
  const galleryImages = (item.galleryImages || []).map((path) => getImage(path)).filter(Boolean);
  const paragraphs = Array.isArray(item.body)
    ? item.body
    : item.body.split('\n').map((paragraph) => paragraph.trim()).filter(Boolean);
  const backToNews = location.state?.from || '/news';

  if (item.videoType) {
    return (
      <article className="section news-detail news-detail-page video-detail-page">
        <BackToNewsLink to={backToNews} />
        <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
        <h1>{item.title}</h1>
        <div className="video-detail-player">
          {item.videoType === 'youtube' ? (
            <iframe
              src={getYoutubeEmbedUrl(item.videoUrl)}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video src={item.videoUrl} controls preload="metadata" />
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="section news-detail news-detail-page">
      <BackToNewsLink to={backToNews} />
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
      {item.relatedSources?.length > 0 && (
        <section className="news-sources" aria-labelledby="news-sources-title">
          <p className="eyebrow">Sources</p>
          <h2 id="news-sources-title">Read this story from other sources</h2>
          <div className="news-source-grid">
            {item.relatedSources.map((source) => {
              const sourceDate = source.date
                ? new Date(source.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
                : null;
              return (
                <a
                  className="news-source-card"
                  href={source.url}
                  key={`${source.label}-${source.url}`}
                  target={source.isExternal || source.url.startsWith('http') ? '_blank' : undefined}
                  rel={source.isExternal || source.url.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span>{source.label}</span>
                  <strong>{source.title}</strong>
                  <small>{sourceDate}{source.isExternal ? ' - External' : ''}</small>
                </a>
              );
            })}
          </div>
        </section>
      )}
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
            <button type="button" onClick={() => setPreviewImage(null)} aria-label="Close photo preview">&times;</button>
          </div>
        </div>
      )}
    </article>
  );
}

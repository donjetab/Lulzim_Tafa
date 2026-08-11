import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink.jsx';
import { cms, fallbackData, resolveMediaUrl, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { slugify } from '../utils/slugify.js';

function getImage(path) {
  if (!path) return null;
  return resolveMediaUrl(path);
}

function getYoutubeEmbedUrl(url) {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, '');
    let videoId = parsedUrl.searchParams.get('v');

    if (!videoId && host === 'youtu.be') {
      videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
    }

    if (!videoId && parsedUrl.pathname.includes('/embed/')) {
      videoId = parsedUrl.pathname.split('/embed/')[1]?.split('/')[0];
    }

    if (!videoId && parsedUrl.pathname.includes('/shorts/')) {
      videoId = parsedUrl.pathname.split('/shorts/')[1]?.split('/')[0];
    }

    if (!videoId) return url;

    const start = getYoutubeStartTime(parsedUrl.searchParams.get('start') || parsedUrl.searchParams.get('t'));
    const params = new URLSearchParams();
    params.set('feature', 'oembed');
    if (start) params.set('start', String(start));

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  } catch {
    return url;
  }
}

function getYoutubeStartTime(value) {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);
  if (!match) return 0;

  const [, hours = 0, minutes = 0, seconds = 0] = match;
  return (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
}

function isHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function normalizeArticleHtml(value) {
  if (!value || typeof window === 'undefined') return value ?? '';

  const template = window.document.createElement('template');
  template.innerHTML = value;
  template.content.querySelectorAll('a[href]').forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  return template.innerHTML;
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
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [previewImage, setPreviewImage] = useState(null);
  const { data: newsArticles, isLoading } = useCmsData(() => cms.getNews(language), fallbackData.newsArticles, [language]);
  const item = newsArticles.find((article) => article.slug === slug || article.savedSlug === slug || slugify(article.title) === slug);

  useEffect(() => {
    if (!item || language !== 'sq') return;
    const translatedSlug = slugify(item.title) || item.slug;
    if (slug !== translatedSlug) navigate(`/sq/lajme/${translatedSlug}`, { replace: true, state: location.state });
  }, [item, language, location.state, navigate, slug]);

  useEffect(() => {
    if (item?.title) document.title = `${item.title} | Lulzim Tafa`;
  }, [item?.title]);

  if (isLoading) return <section className="section"><h1>Loading article...</h1></section>;
  if (!item) return <section className="section"><h1>Article not found</h1></section>;

  const image = getImage(item.image);
  const title = item.title || 'Video news';
  const videoType = String(item.videoType || '').toLowerCase();
  const videoUrl = item.videoUrl || item.sourceUrl || '';
  const galleryImages = (item.galleryImages || []).map((path) => getImage(path)).filter(Boolean);
  const paragraphs = Array.isArray(item.body)
    ? item.body
    : String(item.body ?? '').split('\n').map((paragraph) => paragraph.trim()).filter(Boolean);
  const bodyHtml = typeof item.body === 'string' && isHtml(item.body) ? normalizeArticleHtml(item.body) : '';
  const backToNews = location.state?.from || '/news';

  if (videoType || videoUrl) {
    return (
      <article className="section news-detail news-detail-page video-detail-page">
        <BackToNewsLink to={backToNews} />
        <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
        <h1>{title}</h1>
        <div className="video-detail-player">
          {videoType === 'youtube' || /youtu\.?be|youtube/i.test(videoUrl) ? (
            <iframe
              src={getYoutubeEmbedUrl(videoUrl)}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video src={resolveMediaUrl(videoUrl)} controls preload="metadata" />
          )}
        </div>
        {(bodyHtml || paragraphs.length > 0) && (
          <div className="news-detail-body">
            {bodyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            ) : (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </div>
        )}
      </article>
    );
  }

  return (
    <>
      <article className="section news-detail news-detail-page">
        <BackToNewsLink to={backToNews} />
        <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
        <h1>{title}</h1>
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
          {bodyHtml ? (
            <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : (
            paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
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
      </article>
      {previewImage && (
        <div className="news-photo-preview" role="dialog" aria-modal="true" aria-label="Photo preview">
          <button className="news-photo-preview-backdrop" type="button" onClick={() => setPreviewImage(null)} aria-label="Close photo preview" />
          <div className="news-photo-preview-panel">
            <img src={previewImage} alt="" />
            <button type="button" onClick={() => setPreviewImage(null)} aria-label="Close photo preview">&times;</button>
          </div>
        </div>
      )}
    </>
  );
}

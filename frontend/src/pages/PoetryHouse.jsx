import { useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import { cms, fallbackData, resolveMediaUrl, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import poetryHouseStage from '../assets/poetry-house/8X4A4854-1920x1280.webp';
import poetryHouseAudience from '../assets/poetry-house/8X4A4829-1920x1280.webp';
import poetryHouseOpening from '../assets/poetry-house/5G7A4747-1-1920x1280.webp';

const poetryHouseDefaults = {
  hero: {
    eyebrow: 'Poetry House',
    title: 'The Poetry House',
    subtitle: 'Theatre & Library',
    content: 'A dedicated space for poetry performance in Prishtina, founded by Lulzim Tafa and presented through the news reports connected to its opening.',
    ctaLabel: 'Read the opening report',
  },
  video: {
    eyebrow: 'Video',
    title: 'Poetry Theatre Opening',
    content: 'The video presentation follows the public opening of the Poetry Theatre and the atmosphere around the new cultural space.',
    videoUrl: 'https://www.youtube.com/embed/SpK74zn2qkU',
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Inside the Poetry House',
    content: 'Selected moments from the theatre space, arranged as a small visual carousel.',
  },
  news: {
    eyebrow: 'Related News',
    title: 'Poetry Theatre Reports',
    content: 'Articles connected to the inauguration and public story of the Poetry House and Poetry Theatre.',
    emptyText: 'No related reports have been added yet.',
  },
};

const fallbackPoetryHouseGallery = [
  { src: poetryHouseStage, label: 'Poetry Theatre stage' },
  { src: poetryHouseAudience, label: 'Poetry House audience' },
  { src: poetryHouseOpening, label: 'Poetry Theatre opening' },
];

const fallbackExternalPoetryHouseNews = [
  {
    id: 'korrespodenti-poetry-theatre',
    source: 'Korrespodenti',
    title: 'Në Prishtinë Inaugurohet Teatri i Poezisë',
    date: '2025-06-19T16:54:46+01:00',
    url: 'https://korrespodenti.com/lajme/ne-prishtine-inaugurohet-teatri-i-poezise/',
    image: poetryHouseOpening,
  },
  {
    id: 'atv-poetry-theatre',
    source: 'ATV',
    title: 'Në Prishtinë Inaugurohet Teatri i Poezisë',
    date: '2025-06-19T13:46:07+00:00',
    url: 'https://atvlive.tv/ne-prishtine-inaugurohet-teatri-i-poezise/',
    image: poetryHouseAudience,
  },
];

const poetryHouseKeywords = [
  'teatri i poezise',
  'teatrit te poezise',
  'shtepia e poezise',
  'poetry theatre',
  'poetry theater',
  'poetry house',
];

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function articleMatchesPoetryHouse(article) {
  const searchableText = normalizeText([
    article.title,
    article.excerpt,
    Array.isArray(article.body) ? article.body.join(' ') : article.body,
  ].join(' '));

  return poetryHouseKeywords.some((keyword) => searchableText.includes(keyword));
}

function sectionByKey(sections, key) {
  return sections.find((section) => section.sectionKey === key);
}

function getSectionContent(sections, key, fallback) {
  const section = sectionByKey(sections, key);
  return {
    ...fallback,
    ...(section?.extra ?? {}),
    title: section?.title ?? fallback.title,
    subtitle: section?.subtitle ?? fallback.subtitle,
    content: section?.content ?? fallback.content,
  };
}

function normalizeGalleryItems(items) {
  return (Array.isArray(items) && items.length ? items : fallbackPoetryHouseGallery)
    .filter((item) => item?.src)
    .map((item) => ({
      ...item,
      src: resolveMediaUrl(item.src),
    }));
}

function normalizeExternalNews(items) {
  return (Array.isArray(items) ? items : fallbackExternalPoetryHouseNews)
    .filter((item) => item?.url || item?.title)
    .map((item, index) => ({
      id: item.id || `poetry-house-external-${index}`,
      source: item.source || 'External',
      title: item.title || '',
      date: item.date || new Date().toISOString(),
      url: item.url || '#',
      image: resolveMediaUrl(item.image || ''),
      excerpt: item.excerpt || 'External report about the inauguration of the Poetry Theatre in Prishtina.',
    }));
}

export default function PoetryHouse() {
  const { language } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const { data: newsArticles } = useCmsData(() => cms.getNews(language), fallbackData.newsArticles, [language]);
  const { data: pageSections } = useCmsData(() => cms.getPageSections('poetry-house', language), [], [language]);
  const heroContent = getSectionContent(pageSections, 'hero', poetryHouseDefaults.hero);
  const videoContent = getSectionContent(pageSections, 'video', poetryHouseDefaults.video);
  const galleryContent = getSectionContent(pageSections, 'gallery', poetryHouseDefaults.gallery);
  const newsContent = getSectionContent(pageSections, 'news', poetryHouseDefaults.news);
  const poetryHouseGallery = normalizeGalleryItems(galleryContent.images);
  const externalPoetryHouseNews = normalizeExternalNews(newsContent.externalNews);
  const relatedNews = newsArticles
    .filter((item) => !item.hiddenFromList)
    .filter(articleMatchesPoetryHouse)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const featuredArticle = relatedNews[0];
  const activeGalleryItem = poetryHouseGallery[activeSlide] ?? poetryHouseGallery[0];

  function moveSlide(direction) {
    if (!poetryHouseGallery.length) return;
    setActiveSlide((current) => (current + direction + poetryHouseGallery.length) % poetryHouseGallery.length);
  }

  return (
    <main className="poetry-house-page">
      <section className="poetry-house-hero">
        <div className="poetry-house-copy">
          <p className="eyebrow">{heroContent.eyebrow}</p>
          <h1>{heroContent.title}</h1>
          <span>{heroContent.subtitle}</span>
          <p>{heroContent.content}</p>
          {featuredArticle && (
            <Link className="button-primary" to={`/news/${featuredArticle.slug}`}>
              {heroContent.ctaLabel}
            </Link>
          )}
        </div>
      </section>

      <section className="section poetry-house-feature">
        <div className="poetry-house-video">
          <iframe
            src={videoContent.videoUrl}
            title="The Poetry House video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="poetry-house-feature-copy">
          <p className="eyebrow">{videoContent.eyebrow}</p>
          <h2>{videoContent.title}</h2>
          <p>{videoContent.content}</p>
        </div>
      </section>

      <section className="section poetry-house-gallery-section" aria-labelledby="poetry-house-gallery-title">
        <div className="section-heading">
          <p className="eyebrow">{galleryContent.eyebrow}</p>
          <h2 id="poetry-house-gallery-title">{galleryContent.title}</h2>
          <p>{galleryContent.content}</p>
        </div>
        <div className="poetry-house-carousel">
          <button className="poetry-house-carousel-arrow" type="button" onClick={() => moveSlide(-1)} aria-label="Previous Poetry House photo">
            <span aria-hidden="true">&larr;</span>
          </button>
          <figure>
            <img src={activeGalleryItem.src} alt="" />
            <figcaption>{activeGalleryItem.label}</figcaption>
          </figure>
          <button className="poetry-house-carousel-arrow" type="button" onClick={() => moveSlide(1)} aria-label="Next Poetry House photo">
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
        <div className="poetry-house-carousel-dots" aria-label="Choose Poetry House photo">
          {poetryHouseGallery.map((item, index) => (
            <button
              className={index === activeSlide ? 'is-active' : ''}
              key={item.src}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${item.label}`}
              aria-pressed={index === activeSlide}
            />
          ))}
        </div>
      </section>

      <section className="section poetry-house-news">
        <div className="section-heading">
          <p className="eyebrow">{newsContent.eyebrow}</p>
          <h2>{newsContent.title}</h2>
          <p>{newsContent.content}</p>
        </div>
        {relatedNews.length + externalPoetryHouseNews.length > 0 ? (
          <div className="news-grid poetry-house-news-grid">
            {relatedNews.map((item) => <NewsCard key={item.id} item={item} />)}
            {externalPoetryHouseNews.map((item) => {
              const date = new Date(item.date);
              return (
                <a className="news-card poetry-house-external-card" href={item.url} key={item.id} target="_blank" rel="noreferrer">
                  <div className="news-image">
                    <img src={item.image} alt="" />
                  </div>
                  <div className="news-content">
                    <time dateTime={item.date}>
                      <strong>{date.getDate()}</strong>
                      <span>{date.toLocaleDateString('en', { month: 'short' })}</span>
                    </time>
                    <p className="eyebrow">News · {item.source}</p>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <span className="text-link">Open Link <span aria-hidden="true">&rarr;</span></span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="poetry-house-empty">{newsContent.emptyText}</p>
        )}
      </section>
    </main>
  );
}

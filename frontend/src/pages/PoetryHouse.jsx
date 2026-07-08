import { useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import { cms, fallbackData, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import poetryHouseStage from '../assets/poetry-house/8X4A4854-1920x1280.webp';
import poetryHouseAudience from '../assets/poetry-house/8X4A4829-1920x1280.webp';
import poetryHouseOpening from '../assets/poetry-house/5G7A4747-1-1920x1280.webp';

const poetryHouseVideoUrl = 'https://www.youtube.com/embed/SpK74zn2qkU';

const poetryHouseGallery = [
  { src: poetryHouseStage, label: 'Poetry Theatre stage' },
  { src: poetryHouseAudience, label: 'Poetry House audience' },
  { src: poetryHouseOpening, label: 'Poetry Theatre opening' },
];

const externalPoetryHouseNews = [
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

export default function PoetryHouse() {
  const { language } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const { data: newsArticles } = useCmsData(() => cms.getNews(language), fallbackData.newsArticles, [language]);
  const relatedNews = newsArticles
    .filter((item) => !item.hiddenFromList)
    .filter(articleMatchesPoetryHouse)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const featuredArticle = relatedNews[0];
  const activeGalleryItem = poetryHouseGallery[activeSlide];

  function moveSlide(direction) {
    setActiveSlide((current) => (current + direction + poetryHouseGallery.length) % poetryHouseGallery.length);
  }

  return (
    <main className="poetry-house-page">
      <section className="poetry-house-hero">
        <div className="poetry-house-copy">
          <p className="eyebrow">Poetry House</p>
          <h1>The Poetry House</h1>
          <span>Theatre & Library</span>
          <p>
            A dedicated space for poetry performance in Prishtina, founded by Lulzim Tafa and presented through the news reports connected to its opening.
          </p>
          {featuredArticle && (
            <Link className="button-primary" to={`/news/${featuredArticle.slug}`}>
              Read the opening report
            </Link>
          )}
        </div>
      </section>

      <section className="section poetry-house-feature">
        <div className="poetry-house-video">
          <iframe
            src={poetryHouseVideoUrl}
            title="The Poetry House video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="poetry-house-feature-copy">
          <p className="eyebrow">Video</p>
          <h2>Poetry Theatre Opening</h2>
          <p>
            The video presentation follows the public opening of the Poetry Theatre and the atmosphere around the new cultural space.
          </p>
        </div>
      </section>

      <section className="section poetry-house-gallery-section" aria-labelledby="poetry-house-gallery-title">
        <div className="section-heading">
          <p className="eyebrow">Gallery</p>
          <h2 id="poetry-house-gallery-title">Inside the Poetry House</h2>
          <p>Selected moments from the theatre space, arranged as a small visual carousel.</p>
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
          <p className="eyebrow">Related News</p>
          <h2>Poetry Theatre Reports</h2>
          <p>Articles connected to the inauguration and public story of the Poetry House and Poetry Theatre.</p>
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
                    <p>External report about the inauguration of the Poetry Theatre in Prishtina.</p>
                    <span className="text-link">Open Link <span aria-hidden="true">&rarr;</span></span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="poetry-house-empty">No related reports have been added yet.</p>
        )}
      </section>
    </main>
  );
}

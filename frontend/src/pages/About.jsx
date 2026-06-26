import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  aboutIntroParagraphs,
  biography,
  galleryImages,
  quickFacts,
  testimonials,
} from '../data/content.js';
import decorationImage from '../assets/decorative/bio-decoration.png';
import portraitImage from '../assets/gallery/about1.jpg';
import galleryOne from '../assets/gallery/2-2.jpg';
import galleryTwo from '../assets/gallery/5G7A8472-scaled.jpg';
import galleryThree from '../assets/gallery/Lulzim-Tafa-Skender-Gjinushi-1068x638-2.webp';
import galleryFour from '../assets/gallery/LTAFA-PIC1.jpg';
import galleryFive from '../assets/gallery/IMG-fea5c2c9cdfcbed796d45fb25e628de1-V.jpg';

const galleryAssets = [galleryOne, galleryTwo, galleryThree, galleryFour, galleryFive];

const quickFactIcons = ['calendar', 'education', 'person', 'leaf', 'building', 'star', 'medal'];

function QuickFactIcon({ type }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  };

  const icons = {
    calendar: (
      <svg {...commonProps} aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    ),
    education: (
      <svg {...commonProps} aria-hidden="true">
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12v4c2.9 2 7.1 2 10 0v-4M21 9v6" />
      </svg>
    ),
    person: (
      <svg {...commonProps} aria-hidden="true">
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    ),
    leaf: (
      <svg {...commonProps} aria-hidden="true">
        <path d="M19 3C10 4 5 9 5 18c8 1 14-5 14-15Z" />
        <path d="M5 18c3-5 7-8 12-10" />
      </svg>
    ),
    building: (
      <svg {...commonProps} aria-hidden="true">
        <path d="M3 21h18M5 21V9l7-4 7 4v12" />
        <path d="M9 21v-7h6v7M8 11h.01M12 11h.01M16 11h.01" />
      </svg>
    ),
    star: (
      <svg {...commonProps} aria-hidden="true">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    ),
    medal: (
      <svg {...commonProps} aria-hidden="true">
        <path d="m8 3 4 6 4-6M9 3h6" />
        <circle cx="12" cy="15" r="5" />
        <path d="m10.5 15 1 1 2.3-2.5" />
      </svg>
    ),
  };

  return <span className="about-fact-icon">{icons[type]}</span>;
}

export default function About() {
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const testimonialPairs = [];

  for (let index = 0; index < testimonials.length; index += 2) {
    testimonialPairs.push(testimonials.slice(index, index + 2));
  }

  const activePair = testimonialPairs[testimonialPage];
  const hasManyTestimonialPages = testimonialPairs.length > 1;
  const activeGalleryImage = activeGalleryIndex === null
    ? null
    : {
      ...galleryImages[activeGalleryIndex],
      src: galleryAssets[activeGalleryIndex],
    };

  function turnPage(direction) {
    setTestimonialPage((currentPage) => {
      const nextPage = currentPage + direction;

      if (nextPage < 0) {
        return testimonialPairs.length - 1;
      }

      if (nextPage >= testimonialPairs.length) {
        return 0;
      }

      return nextPage;
    });
  }

  function moveGalleryPreview(direction) {
    setActiveGalleryIndex((currentIndex) => {
      if (currentIndex === null) {
        return 0;
      }

      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        return galleryImages.length - 1;
      }

      if (nextIndex >= galleryImages.length) {
        return 0;
      }

      return nextIndex;
    });
  }

  return (
    <main className="about-page">
      <section className="about-hero">
        <img className="about-portrait" src={portraitImage} alt="Lulzim Tafa speaking at an academic event" />
        <div className="about-hero-copy">
          <p className="eyebrow">About the Author</p>
          <h1>A life shaped by Literature, Scholarship, and Public Thought</h1>
          {aboutIntroParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="about-life-section" id="biography">
        <article className="about-life-copy">
          <h2>Lulzim Tafa's Life</h2>
          {biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>

        <aside className="about-glance" aria-label="Lulzim Tafa at a glance">
          <img className="about-glance-decoration" src={decorationImage} alt="" aria-hidden="true" />
          <div className="about-glance-content">
            <p>Lulzim Tafa's Life</p>
            <h3>At a Glance</h3>
            {quickFacts.map(([label, value], index) => (
              <div className="about-fact" key={label}>
                <QuickFactIcon type={quickFactIcons[index]} />
                <div>
                  <strong>{label}</strong>
                  <small>{value}</small>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="testimonial-section" id="testimonials">
        <div className="testimonial-heading">
          <p className="eyebrow">Testimonials & Recognition</p>
          <h2>Others About Lulzim Tafa</h2>
          <p>Reflections from colleagues, readers, scholars, and public voices who have been inspired by his work and presence.</p>
        </div>

        <div className="testimonial-reader">
          <button className="book-arrow book-arrow-left" type="button" onClick={() => turnPage(-1)} aria-label="Previous testimonials" disabled={!hasManyTestimonialPages}>
            <span aria-hidden="true" />
          </button>
          <div className="testimonial-book">
            {activePair.map((item, index) => (
              <blockquote className={index === 1 ? 'book-page book-page-right' : 'book-page'} key={`${testimonialPage}-${item.id}`}>
                <span className="quote-mark" aria-hidden="true">"</span>
                <p>{item.quote}</p>
                <Link className="testimonial-inline-read" to={`/testimonials#testimonial-${item.id}`}>Read all</Link>
                <cite>
                  <strong>{item.authorName}</strong>
                  <small>{item.authorTitle}</small>
                </cite>
              </blockquote>
            ))}
          </div>
          <button className="book-arrow book-arrow-right" type="button" onClick={() => turnPage(1)} aria-label="Next testimonials" disabled={!hasManyTestimonialPages}>
            <span aria-hidden="true" />
          </button>
        </div>

        <div className="testimonial-book-dots" aria-label="Testimonial pages">
          {testimonialPairs.map((_, index) => (
            <button
              className={index === testimonialPage ? 'testimonial-book-dot is-active' : 'testimonial-book-dot'}
              type="button"
              onClick={() => setTestimonialPage(index)}
              aria-label={`Go to testimonial page ${index + 1}`}
              aria-current={index === testimonialPage ? 'page' : undefined}
              key={`testimonial-page-${index}`}
            />
          ))}
        </div>

        <Link className="button-secondary testimonial-read-all" to="/testimonials">
          Read All Testimonials
        </Link>
      </section>

      <section className="about-gallery-section">
        <div className="about-section-title">
          <div>
            <p className="eyebrow">Moments and Public Life</p>
            <h2>Gallery Preview</h2>
          </div>
          <a className="button-secondary" href="/gallery">See All Gallery</a>
        </div>
        <div className="about-gallery-grid" id="gallery">
          {galleryImages.map((image, index) => (
            <button className="about-gallery-card" type="button" onClick={() => setActiveGalleryIndex(index)} key={image.id} aria-label={`Preview ${image.caption}`}>
              <img src={galleryAssets[index]} alt={image.caption} />
              <span>{image.caption}</span>
            </button>
          ))}
        </div>
      </section>

      {activeGalleryImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={activeGalleryImage.caption}>
          <button className="gallery-lightbox-backdrop" type="button" onClick={() => setActiveGalleryIndex(null)} aria-label="Close gallery preview" />
          <div className="gallery-lightbox-panel">
            <button className="gallery-lightbox-close" type="button" onClick={() => setActiveGalleryIndex(null)} aria-label="Close gallery preview">x</button>
            <button className="gallery-lightbox-nav gallery-lightbox-prev" type="button" onClick={() => moveGalleryPreview(-1)} aria-label="Previous image">
              <span aria-hidden="true" />
            </button>
            <img src={activeGalleryImage.src} alt={activeGalleryImage.caption} />
            <p>{activeGalleryImage.caption}</p>
            <button className="gallery-lightbox-nav gallery-lightbox-next" type="button" onClick={() => moveGalleryPreview(1)} aria-label="Next image">
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      )}


    </main>
  );
}

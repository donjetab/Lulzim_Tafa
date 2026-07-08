import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cms, fallbackData, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Testimonials() {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState('');
  const { hash } = useLocation();
  const { data: testimonials } = useCmsData(() => cms.getTestimonials(language), fallbackData.testimonials, [language]);
  const filteredTestimonials = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return testimonials;

    return testimonials.filter((testimonial) => {
      const searchableText = `${testimonial.authorName} ${testimonial.authorTitle}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [query, testimonials]);

  useEffect(() => {
    const testimonialId = hash.match(/^#testimonial-(.+)$/)?.[1];

    if (!testimonialId) {
      setHighlightedId('');
      return undefined;
    }

    const targetId = decodeURIComponent(testimonialId);
    setHighlightedId(targetId);

    const scrollTimeout = window.setTimeout(() => {
      document.getElementById(`testimonial-${targetId}`)?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }, 120);
    const clearTimeout = window.setTimeout(() => setHighlightedId(''), 5200);

    return () => {
      window.clearTimeout(scrollTimeout);
      window.clearTimeout(clearTimeout);
    };
  }, [hash, testimonials]);

  return (
    <main className="testimonials-page">
      <section className="testimonials-hero">
        <p className="eyebrow">Testimonials & Recognition</p>
        <h1>Others About Lulzim Tafa</h1>
        <p>
          Reflections from poets, critics, scholars, and cultural voices on Lulzim Tafa's poetry,
          language, and literary presence.
        </p>
        <Link className="button-secondary testimonials-back-link" to="/about#testimonials">Back to About</Link>
      </section>

      <section className="testimonials-toolbar" aria-label="Search testimonials">
        <label htmlFor="testimonial-search">Search testimonials</label>
        <input
          id="testimonial-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or country"
        />
      </section>

      <section className="testimonials-full-grid" aria-label="All testimonials">
        {filteredTestimonials.map((testimonial) => (
          <article
            className={String(testimonial.id) === highlightedId ? 'testimonial-full-card is-highlighted' : 'testimonial-full-card'}
            id={`testimonial-${testimonial.id}`}
            key={testimonial.id}
          >
            <span className="testimonial-card-mark" aria-hidden="true">"</span>
            <p>{testimonial.quote}</p>
            <footer>
              <strong>{testimonial.authorName}</strong>
              <small>{testimonial.authorTitle}</small>
            </footer>
          </article>
        ))}
      </section>

      {filteredTestimonials.length === 0 && (
        <p className="testimonials-empty">No testimonials matched that search.</p>
      )}
    </main>
  );
}

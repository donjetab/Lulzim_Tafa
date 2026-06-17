import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { biography, galleryImages, quickFacts, testimonials } from '../data/content.js';

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title="A literary and academic life" text="An editorial biography layout with gallery and testimonials ready for CMS content." />
      <section className="section about-intro">
        <div className="portrait-card" aria-hidden="true">Portrait</div>
        <div>
          <p className="eyebrow">Introduction</p>
          <h2>Lulzim Tafa</h2>
          <p>
            Poet, author, academic, and public figure. This section is ready for the final approved introduction and portrait image.
          </p>
        </div>
      </section>
      <section className="section article-layout">
        <article className="editorial-article">
          <SectionHeading eyebrow="Biography" title="Full Biography" />
          {biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
        <aside className="glance-card">
          <h3>At a Glance</h3>
          {quickFacts.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </aside>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Gallery" title="Archive Preview" />
        <div className="gallery-grid">
          {galleryImages.slice(0, 5).map((image) => (
            <figure key={image.id}>
              <div className="gallery-placeholder">{image.caption}</div>
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Others About Lulzim Tafa" title="Open Book Testimonials" />
        <div className="open-book">
          {testimonials.slice(0, 2).map((item) => (
            <blockquote key={item.id}>
              <p>{item.quote}</p>
              <cite>{item.authorName}, {item.authorTitle}</cite>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}

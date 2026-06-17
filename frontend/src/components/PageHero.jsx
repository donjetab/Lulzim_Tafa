export default function PageHero({ eyebrow, title, text, variant = 'paper' }) {
  return (
    <section className={`page-hero page-hero-${variant}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </section>
  );
}

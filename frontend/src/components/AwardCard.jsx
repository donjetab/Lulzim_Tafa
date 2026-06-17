export default function AwardCard({ award, featured = false }) {
  return (
    <article className={featured ? 'award-card award-card-featured' : 'award-card'}>
      <div className="award-icon" aria-hidden="true">
        {award.year}
      </div>
      <div>
        <h3>{award.title}</h3>
        <p>{award.description}</p>
      </div>
    </article>
  );
}

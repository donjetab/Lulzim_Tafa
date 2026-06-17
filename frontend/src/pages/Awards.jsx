import AwardCard from '../components/AwardCard.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { awards } from '../data/content.js';

export default function Awards() {
  return (
    <>
      <PageHero eyebrow="Awards" title="Awards & Recognition" text="Certificate and medal PNG/WebP assets should be applied to these data-driven cards." variant="awards" />
      <section className="section">
        <SectionHeading eyebrow="Featured honors" title="Selected Distinctions" />
        <div className="award-grid featured-grid">
          {awards.filter((award) => award.featured).map((award) => (
            <AwardCard key={award.id} award={award} featured />
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Archive" title="All Awards and Recognitions" />
        <div className="award-grid">
          {awards.map((award) => <AwardCard key={award.id} award={award} />)}
        </div>
      </section>
    </>
  );
}

import AwardCard from '../components/AwardCard.jsx';
import PageHero from '../components/PageHero.jsx';
import { cms, fallbackData, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Awards() {
  const { language } = useLanguage();
  const { data: awards } = useCmsData(() => cms.getAwards(language), fallbackData.awards, [language]);
  const portraitAwards = awards.filter((award) => award.layout === 'portrait');
  const landscapeAwards = awards.filter((award) => award.layout !== 'portrait');

  return (
    <>
      <PageHero eyebrow="Awards" title="Awards & Recognition" variant="awards" />
      <section className="section awards-section">
        <div className="award-grid award-portrait-grid">
          {portraitAwards.map((award) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
        <div className="award-grid award-landscape-grid">
          {landscapeAwards.map((award) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      </section>
    </>
  );
}

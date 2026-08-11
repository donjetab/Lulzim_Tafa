import AwardCard from '../components/AwardCard.jsx';
import PageHero from '../components/PageHero.jsx';
import { cms, fallbackData, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Awards() {
  const { language, t } = useLanguage();
  const { data: awards } = useCmsData(() => cms.getAwards(language), fallbackData.awards, [language]);
  const awardsWithLayout = awards.map((award, index) => ({
    ...award,
    layout: award.layout || (index >= 6 ? 'portrait' : 'landscape'),
  }));
  const portraitAwards = awardsWithLayout.filter((award) => award.layout === 'portrait');
  const landscapeAwards = awardsWithLayout.filter((award) => award.layout !== 'portrait');

  return (
    <>
      <PageHero eyebrow={t('awards.eyebrow')} title={t('awards.title')} variant="awards" />
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

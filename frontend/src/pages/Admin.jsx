import PageHero from '../components/PageHero.jsx';

const modules = [
  'Books',
  'Poems',
  'Poem translations/languages',
  'News',
  'Interviews',
  'Awards',
  'Gallery images',
  'Testimonials',
  'Site settings',
];

export default function Admin() {
  return (
    <>
      <PageHero eyebrow="Admin" title="Content Management Shell" text="First-version placeholder for the CRUD panel and image upload workflow." />
      <section className="section admin-grid">
        {modules.map((module) => (
          <article key={module}>
            <h3>{module}</h3>
            <p>Create, edit, delete, upload images, and choose featured content.</p>
          </article>
        ))}
      </section>
    </>
  );
}

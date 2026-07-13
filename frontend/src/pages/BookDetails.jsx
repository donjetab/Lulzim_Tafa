import { Link, useParams } from 'react-router-dom';
import { cms, fallbackData, useCmsData } from '../data/api.js';
import { getBookMockupImage } from '../data/bookImages.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function BookDetails() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { data: books } = useCmsData(() => cms.getBooks(language), fallbackData.books, [language]);
  const book = books.find((item) => item.slug === slug);

  if (!book) return <section className="section"><h1>Book not found</h1></section>;

  const cover = getBookMockupImage(book);
  const meta = [book.category, book.year].filter(Boolean).join(' · ');

  return (
    <section className="section detail-layout">
      <div className="book-cover large" aria-hidden="true">
        {cover ? <img src={cover} alt="" /> : <span>{book.title}</span>}
      </div>
      <article className="editorial-article">
        <p className="eyebrow">{meta}</p>
        <h1>{book.title}</h1>
        <p>{book.summary}</p>
        <p>{book.description}</p>
        <Link className="text-link" to="/books">Back to books</Link>
      </article>
    </section>
  );
}

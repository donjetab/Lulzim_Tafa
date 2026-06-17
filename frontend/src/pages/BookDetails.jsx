import { Link, useParams } from 'react-router-dom';
import { books } from '../data/content.js';

export default function BookDetails() {
  const { slug } = useParams();
  const book = books.find((item) => item.slug === slug);

  if (!book) return <section className="section"><h1>Book not found</h1></section>;

  return (
    <section className="section detail-layout">
      <div className="book-cover large" aria-hidden="true"><span>{book.title}</span></div>
      <article className="editorial-article">
        <p className="eyebrow">{book.category} · {book.year}</p>
        <h1>{book.title}</h1>
        <p>{book.summary}</p>
        <p>{book.description}</p>
        <Link className="text-link" to="/books">Back to books</Link>
      </article>
    </section>
  );
}

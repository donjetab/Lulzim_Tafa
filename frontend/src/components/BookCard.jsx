import { Link } from 'react-router-dom';

export default function BookCard({ book, featured = false }) {
  return (
    <Link className={featured ? 'book-card book-card-featured' : 'book-card'} to={`/books/${book.slug}`}>
      <div className="book-cover" aria-hidden="true">
        <span>{book.title}</span>
      </div>
      <div>
        <p className="eyebrow">{book.category}</p>
        <h3>{book.title}</h3>
        <p>{book.year} · {book.location}</p>
      </div>
    </Link>
  );
}

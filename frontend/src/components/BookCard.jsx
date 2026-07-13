import { getBookMockupImage } from '../data/bookImages.js';

export default function BookCard({ book, featured = false }) {
  const cover = getBookMockupImage(book);
  const meta = [book.category, book.location, book.year].filter(Boolean);

  return (
    <article className={featured ? 'book-card book-card-featured' : 'book-card'}>
      <div className="book-cover" aria-hidden="true">
        {cover ? <img src={cover} alt="" /> : <span>{book.title}</span>}
      </div>
      <div>
        <h3>{book.title}</h3>
        {meta.map((item) => <p key={item}>{item}</p>)}
      </div>
    </article>
  );
}

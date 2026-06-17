import BookCard from '../components/BookCard.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { books } from '../data/content.js';

export default function Books() {
  return (
    <>
      <PageHero eyebrow="Books" title="The Bookshelf" text="Actual cover and mockup assets should replace these placeholders." />
      <section className="bookshelf" aria-label="Interactive bookshelf">
        {books.map((book) => (
          <a key={book.id} className="shelf-book" href={`/books/${book.slug}`}>
            <span>{book.title}</span>
          </a>
        ))}
      </section>
      <section className="section">
        <SectionHeading eyebrow="Library" title="All Books" />
        <div className="book-grid">
          {books.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      </section>
    </>
  );
}

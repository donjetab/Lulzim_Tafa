import { useMemo, useRef, useState } from 'react';
import BookCard from '../components/BookCard.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { books } from '../data/content.js';

const bookMockupAssets = import.meta.glob('../assets/mockups/*', { eager: true, query: '?url', import: 'default' });

const shelfSpineColors = [
  ['#cbc5b9', '#cbc5b9'],
  ['#cacacb', '#cacacb'],
  ['#2a3133', '#2a3133'],
  ['#636363', '#636363'],
  ['#d7a054', '#d7a054'],
  ['#7e8894', '#7e8894'],
  ['#464943', '#464943'],
  ['#795f53', '#795f53'],
  ['#a4a4a4', '#a4a4a4'],
  ['#79858d', '#79858d'],
];

function getBookMockup(path) {
  if (!path) return null;
  const filename = path.split('/').pop();
  return Object.entries(bookMockupAssets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? null;
}

function sortBooksByYear(bookList) {
  return [...bookList].sort((a, b) => {
    const yearA = a.year ?? -Infinity;
    const yearB = b.year ?? -Infinity;
    return yearB - yearA || a.id - b.id;
  });
}

function getPreviewTitleStyle(title) {
  const words = title.trim().split(/\s+/);
  const longestWord = Math.max(...words.map((word) => word.length));
  const titleLength = title.length;
  const maxSize = Math.max(2.45, Math.min(3.9, 4.35 - Math.max(0, longestWord - 8) * 0.22 - Math.max(0, titleLength - 20) * 0.035));

  return {
    '--preview-title-max': `${maxSize.toFixed(2)}rem`,
  };
}

export default function Books() {
  const bookRefs = useRef({});
  const listedBooks = useMemo(() => sortBooksByYear(books), []);
  const shelfBooks = listedBooks.slice(0, 10);
  const [activeBook, setActiveBook] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function openShelfBook(book) {
    const element = bookRefs.current[book.id];
    if (!element || activeBook) return;

    const rect = element.getBoundingClientRect();
    setActiveBook({
      ...book,
      startTop: rect.top,
      startLeft: rect.left,
      startWidth: rect.width,
      startHeight: rect.height,
      cover: getBookMockup(book.mockupImage),
    });

    window.setTimeout(() => setIsOpen(true), 80);
  }

  function closeShelfBook() {
    setIsClosing(true);
    setIsOpen(false);

    window.setTimeout(() => {
      setActiveBook(null);
      setIsClosing(false);
    }, 950);
  }

  return (
    <>
      <PageHero
        eyebrow="Books"
        title="The Bookshelf"
        text="A chronological library of Lulzim Tafa's published poetry books and translated editions."
        variant="books"
      />
      <section className="bookshelf" aria-label="Latest books bookshelf">
        <div className="shelf-stage">
          <div className="shelf-spines" aria-label="Choose a book from the shelf">
            {shelfBooks.map((book, index) => {
              const [spineColor, spineDark] = shelfSpineColors[index % shelfSpineColors.length];
              return (
                <button
                  key={book.id}
                  ref={(element) => {
                    bookRefs.current[book.id] = element;
                  }}
                  className={activeBook?.id === book.id ? 'shelf-book is-active shelf-book-placeholder' : 'shelf-book'}
                  type="button"
                  style={{ '--spine-color': spineColor, '--spine-dark': spineDark, '--book-index': index }}
                  onClick={() => openShelfBook(book)}
                  disabled={!!activeBook}
                  aria-label={`Open ${book.title}`}
                >
                  <span>{book.title}</span>
                </button>
              );
            })}
          </div>
        </div>
        {activeBook && (
          <div className={`shelf-book-layer ${isOpen ? 'book-is-open' : ''} ${isClosing ? 'book-is-closing' : ''}`}>
            <button className="shelf-book-backdrop" type="button" aria-label="Close book preview" onClick={closeShelfBook} />
            <div
              className="shelf-animated-book"
              style={{
                '--start-top': `${activeBook.startTop}px`,
                '--start-left': `${activeBook.startLeft}px`,
                '--start-width': `${activeBook.startWidth}px`,
                '--start-height': `${activeBook.startHeight}px`,
              }}
            >
              <div className="shelf-spine-clone">
                <span>{activeBook.title}</span>
              </div>
              <div className="shelf-real-book">
                <div className="shelf-inside-pages">
                  <div className="shelf-inside-page shelf-inside-page-left">
                    <p className="eyebrow">{activeBook.year || 'Year to confirm'}</p>
                    <h2 style={getPreviewTitleStyle(activeBook.title)}>{activeBook.title}</h2>
                    <p>{activeBook.location || activeBook.category}</p>
                  </div>
                  <div className="shelf-inside-page shelf-inside-page-right">
                    <p>{activeBook.summary}</p>
                    <button type="button" onClick={closeShelfBook}>Close book</button>
                  </div>
                </div>
                <div
                  className="shelf-front-cover"
                  style={activeBook.cover ? { backgroundImage: `url("${activeBook.cover}")` } : undefined}
                >
                  {!activeBook.cover && <span>{activeBook.title}</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="section books-list-section">
        <SectionHeading eyebrow="Library" title="All Books" text="Ordered by publication year, with undated editions kept at the end until their years are confirmed." />
        <div className="book-grid book-list-grid">
          {listedBooks.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      </section>
    </>
  );
}

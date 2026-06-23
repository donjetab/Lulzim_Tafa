import { useRef, useState } from "react";
import "./App.css";

const initialBooks = [
  {
    id: 1,
    title: "Antologji Personale",
    subtitle: "Lulzim Tafa",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 2,
    title: "Vepra Poetike",
    subtitle: "Poezi",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 3,
    title: "Fjala",
    subtitle: "Letërsi",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 4,
    title: "Kujtesa",
    subtitle: "Ese",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 5,
    title: "Drita",
    subtitle: "Poezi",
    accent: true,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 6,
    title: "Hija",
    subtitle: "Prozë",
    accent: true,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 7,
    title: "Koha",
    subtitle: "Reflektim",
    accent: true,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 8,
    title: "Jeta",
    subtitle: "Shënime",
    accent: true,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 9,
    title: "Zëri",
    subtitle: "Antologji",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 10,
    title: "Rruga",
    subtitle: "Udhëtim",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 11,
    title: "Nata",
    subtitle: "Poezi",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 12,
    title: "Vetmia",
    subtitle: "Letërsi",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 13,
    title: "Kthimi",
    subtitle: "Prozë",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
  {
    id: 14,
    title: "Përtej",
    subtitle: "Ese",
    accent: false,
    cover: "/cover/antologji-personale.jpg",
  },
];

function App() {
  const bookRefs = useRef({});
  const [activeBook, setActiveBook] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function openBook(book) {
    const element = bookRefs.current[book.id];

    if (!element || activeBook) return;

    const rect = element.getBoundingClientRect();

    setActiveBook({
      ...book,
      startTop: rect.top,
      startLeft: rect.left,
      startWidth: rect.width,
      startHeight: rect.height,
    });

    window.setTimeout(() => {
      setIsOpen(true);
    }, 80);
  }

function closeBook() {
  setIsClosing(true);
  setIsOpen(false);

  window.setTimeout(() => {
    setActiveBook(null);
    setIsClosing(false);
  }, 950);
}

  return (
    <main className="site">
      <nav className="navbar">
        <div className="logo">
          <span>BALD</span>
          <div></div>
        </div>

        <div className="nav-links">
          <a href="#">BOOKS</a>
          <a href="#">CHARACTERS</a>
          <a href="#">BLOG</a>
          <a href="#">EXPLORE</a>
          <a href="#">REVIEWS</a>
          <a href="#">AUTHOR</a>
          <a href="#">CONTACT</a>
        </div>

        <button className="signup">SIGN UP</button>
      </nav>

      <section className="hero">
        {/* <div className="orange-ribbon ribbon-one"></div>
        <div className="orange-ribbon ribbon-two"></div> */}

        <div className="hero-heading">
          <h1>PATH SERIES™</h1>
          <h2>BALD SOLOMON</h2>
          <span className="down">⌄</span>
        </div>

        <div className="books-stage">
          <div className="books-row">
            {initialBooks.map((book, index) => (
              <button
                key={book.id}
                ref={(el) => {
                  bookRefs.current[book.id] = el;
                }}
                className={`book ${book.accent ? "accent" : ""} ${
                  activeBook?.id === book.id ? "book-placeholder" : ""
                }`}
                style={{ "--delay": `${index * 0.04}s` }}
                onClick={() => openBook(book)}
                disabled={!!activeBook}
                aria-label={`Open ${book.title}`}
              >
                <span className="book-title">{book.title}</span>
                <span className="book-subtitle">{book.subtitle}</span>
                <span className="book-footer">BALD</span>
              </button>
            ))}
          </div>

          <div className="shelf"></div>
        </div>

        <div className="hero-actions">
          <button>VIDEO TRAILER ▶</button>
          <button>BOOKS</button>
        </div>
      </section>

      {activeBook && (
        <div
          className={`book-animation-layer ${isOpen ? "book-is-open" : ""} ${
            isClosing ? "book-is-closing" : ""
          }`}
        >
          <div
            className="animated-book"
            style={{
              "--start-top": `${activeBook.startTop}px`,
              "--start-left": `${activeBook.startLeft}px`,
              "--start-width": `${activeBook.startWidth}px`,
              "--start-height": `${activeBook.startHeight}px`,
            }}
          >
            <div className="spine-clone">
              <span className="book-title">{activeBook.title}</span>
              <span className="book-subtitle">{activeBook.subtitle}</span>
              <span className="book-footer">BALD</span>
            </div>

            <div className="real-book">
              <div className="inside-pages">
                <div className="inside-page inside-page-left">
                  <p className="chapter-label">CHAPTER ONE</p>

                  <h3>{activeBook.title}</h3>

                  <p>
                    This is the inside of the book. It appears after the front
                    cover opens, so the final view stays clean and readable.
                  </p>

                  <p className="book-paragraph">
                    You can replace this with biography text, a chapter preview,
                    or real book content.
                  </p>
                </div>

                <div className="inside-page inside-page-right">
                  <div>
                    <p>
                      The animation now uses one front cover image only. The
                      cover closes again before returning to the shelf.
                    </p>

                    <p className="book-paragraph">
                      No full-spread image, no duplicated cover, no orange
                      overlay, and no yellow page.
                    </p>
                  </div>

                  <button onClick={closeBook}>CLOSE BOOK</button>
                </div>
              </div>


              <div
                className="front-cover"
                style={{ backgroundImage: `url("${activeBook.cover}")` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
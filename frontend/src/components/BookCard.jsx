import { resolveMediaUrl } from '../data/api.js';

const bookMockupAssets = import.meta.glob('../assets/mockups/*', { eager: true, query: '?url', import: 'default' });
// Keep this ready in case we decide to show the flat cover files instead of the mockups.
// const bookCoverAssets = import.meta.glob('../assets/books/*', { eager: true, query: '?url', import: 'default' });

function getBookImage(path, assets) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path) || path.startsWith('/uploads/')) return resolveMediaUrl(path);
  const filename = path.split('/').pop();
  return Object.entries(assets).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? resolveMediaUrl(path);
}

export default function BookCard({ book, featured = false }) {
  const cover = getBookImage(book.mockupImage, bookMockupAssets);
  // Cover-folder fallback, if we change direction later:
  // const cover = getBookImage(book.mockupImage, bookMockupAssets) ?? getBookImage(book.coverImage, bookCoverAssets);
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

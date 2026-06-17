import { Link, useParams } from 'react-router-dom';
import { newsArticles } from '../data/content.js';

export default function NewsDetails() {
  const { slug } = useParams();
  const item = newsArticles.find((article) => article.slug === slug);

  if (!item) return <section className="section"><h1>Article not found</h1></section>;

  return (
    <article className="section news-detail">
      <time>{new Date(item.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
      <h1>{item.title}</h1>
      <div className="detail-image" aria-hidden="true">{item.category}</div>
      <p>{item.body}</p>
      <Link className="text-link" to="/news">Back to news</Link>
    </article>
  );
}

import { Link } from 'react-router-dom';
import paperTape from '../assets/decorative/poetry_1.png';
import paperFlowers from '../assets/decorative/poetry_2.png';
import paperClip from '../assets/decorative/poetry_3.png';
import paperWide from '../assets/decorative/poetry_4.png';
import paperSeal from '../assets/decorative/poetry_5.png';

const portraitPapers = [paperTape, paperFlowers, paperClip, paperSeal];

function getPoemLines(poem) {
  return (poem.body || poem.excerpt || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function getPreviewLines(lines, maxLines) {
  if (lines.length <= maxLines) {
    return { lines, isTruncated: false };
  }

  return {
    lines: lines.slice(0, maxLines - 1),
    isTruncated: true,
  };
}

export default function PoemCard({ poem, index }) {
  const lines = getPoemLines(poem);
  const isWide = lines.length > 9 || poem.title.length > 22;
  const maxLines = isWide ? 9 : 7;
  const preview = getPreviewLines(lines, maxLines);
  const paper = isWide ? paperWide : portraitPapers[index % portraitPapers.length];

  return (
    <article className={isWide ? 'poetry-paper-card poetry-paper-card-wide' : 'poetry-paper-card'}>
      <img className="poetry-paper-image" src={paper} alt="" aria-hidden="true" />
      <div className="poetry-paper-content">
        <p className="poetry-language">{poem.language}</p>
        <h3>{poem.title}</h3>
        <div className="poetry-preview">
          {preview.lines.map((line, lineIndex) => <p key={`${poem.id}-${lineIndex}`}>{line}</p>)}
          {preview.isTruncated && <p aria-hidden="true">...</p>}
        </div>
        <Link className="poetry-read-link" to={`/poetry/${poem.slug}`}>
          Read the poem
        </Link>
      </div>
    </article>
  );
}

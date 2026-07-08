import { Link } from 'react-router-dom';
import paperTape from '../assets/decorative/poetry_1.png';
import paperFlowers from '../assets/decorative/poetry_2.png';
import paperClip from '../assets/decorative/poetry_3.png';
import paperWide from '../assets/decorative/poetry_4.png';
import paperSeal from '../assets/decorative/poetry_5.png';

const portraitPapers = [paperTape, paperFlowers, paperClip, paperSeal];

function getStableSeed(value) {
  return [...value].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) % 9973;
  }, 7);
}

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

export default function PoemCard({ poem, index, onOpen }) {
  const lines = getPoemLines(poem);
  const seed = getStableSeed(`${poem.slug}-${poem.language}-${poem.title}`);
  const longestLine = lines.reduce((longest, line) => Math.max(longest, line.length), 0);
  const hasVeryLongLine = longestLine > 42;
  const hasManyLines = lines.length > 20;
  const isWide = (hasVeryLongLine && seed % 2 === 0) || (hasManyLines && (seed + index) % 4 === 0) || (!hasManyLines && longestLine > 34 && seed % 5 === 0);
  const maxLines = isWide ? 8 : 6;
  const preview = getPreviewLines(lines, maxLines);
  const paper = isWide ? paperWide : portraitPapers[(seed + index) % portraitPapers.length];
  const tilt = ((seed % 7) - 3) * 0.16;
  const offset = isWide ? ((seed + index) % 3) * 0.35 : ((seed + index) % 5) * 0.45;

  return (
    <article
      className={isWide ? 'poetry-paper-card poetry-paper-card-wide' : 'poetry-paper-card'}
      style={{
        '--poetry-paper-offset': `${offset}rem`,
        '--poetry-paper-tilt': `${tilt}deg`,
      }}
    >
      <img className="poetry-paper-image" src={paper} alt="" aria-hidden="true" />
      <div className="poetry-paper-content">
        <p className="poetry-language">{poem.language}</p>
        <h3>{poem.title}</h3>
        <div className="poetry-preview">
          {preview.lines.map((line, lineIndex) => <p key={`${poem.id}-${lineIndex}`}>{line}</p>)}
          {preview.isTruncated && <p aria-hidden="true">...</p>}
        </div>
        <Link className="poetry-read-link" to={`/poetry/${poem.slug}`} onClick={onOpen}>
          Read the poem
        </Link>
      </div>
    </article>
  );
}

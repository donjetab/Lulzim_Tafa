import { importedVideos } from '../importedVideos.js';
import { createNewsArticle } from './schema.js';

const interviewVideoIds = new Set([
  'youtube-spUZa2WPtSw',
  'youtube-bCp0VLv34jE',
  'youtube-9SD9ZaTIJOM',
  'youtube-Hecpyaj5GSc',
  'youtube-w9ULA3ubzco',
  'youtube-1PWylKo2JfA',
  'youtube-58m5YydF4OM',
  'youtube-Vlz9ZSHmQaY',
  'youtube-Wg0_qDpDFXI',
]);

const existingVideoMatches = {
  'youtube-SowzjiRrq2I': 'atv-poeti-lulzim-tafa-nderohet-nga-lezha-me-cmimin-at-gjergj-fishta',
  'youtube-cSv8MWYRLTc': 'klan-fjala-e-poetit-lulzim-tafa-me-rastin-e-pranimit-ne-akademine-e-shkencave-te-shqiperise',
  'youtube-ll8NYWiHvN0': 'klan-mirenjohja-e-vecante-ambasada-e-shqiperise-e-nderon-lulzim-tafen-video',
  'youtube-6csqTgrHUQE': 'klan-mirenjohja-e-vecante-ambasada-e-shqiperise-e-nderon-lulzim-tafen-video',
  'youtube-I5tmO9Ar6s4': 'klan-poeti-lulzim-tafa-pranon-dekoraten-oficer-i-urdherit-kombetar-te-letrave-dhe-arteve-nga-franca',
  'youtube-qlol7njnV3M': 'klan-mira-murati-dhe-lulzim-tafa-zgjidhen-anetare-te-akademise-se-shkencave-te-shqiperise',
  'youtube-5BVNWetoojc': 'atv-poetet-e-njohur-lulzim-tafa-dhe-sali-bashota-kane-mbajtur-ore-letrare-me-lexues',
  'youtube-EsX0XzSxp3E': 'u-perurua-libri-rivali-i-adamit-i-poetit-lulzim-tafa',
};

function getDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '2024-05-28' : date.toISOString().slice(0, 10);
}

function getSlug(video) {
  return `video-${video.id.replace(/^youtube-/, '').replace(/^hosted-/, '')}`;
}

function getExcerpt(video, category) {
  if (category === 'Interview') {
    return 'Video interview and conversation with Lulzim Tafa, imported from the official video archive.';
  }

  if (video.type === 'hosted') {
    return 'Hosted video imported from the official Lulzim Tafa video archive.';
  }

  return 'Video report imported from the official Lulzim Tafa video archive.';
}

export const importedVideoNews = importedVideos.map((video, index) => {
  const category = interviewVideoIds.has(video.id) ? 'Interview' : 'News';

  return createNewsArticle({
    id: `video-${index + 1}`,
    slug: getSlug(video),
    title: video.title || 'Video with Lulzim Tafa',
    category,
    date: getDate(video.date),
    image: video.thumbnail || '',
    excerpt: getExcerpt(video, category),
    sourceUrl: video.url,
    videoId: video.id,
    videoType: video.type,
    videoUrl: video.url,
    videoPreviewUrl: video.type === 'hosted' ? video.url : '',
    existingArticleSlug: existingVideoMatches[video.id] || null,
  });
});

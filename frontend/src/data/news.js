import { importedAtvNews } from './news/atv.js';
import { importedKlanNews } from './news/klan.js';
import { importedNews } from './news/articles.js';
import { importedVideoNews } from './news/videoNews.js';
import { newsSourceGroups } from './news/sourceGroups.js';
import { getNewsSourceName } from './news/schema.js';

function withSourceGroups(articles) {
  const validArticles = articles.filter((article) => article?.slug);
  const groupsByCanonical = new Map(newsSourceGroups.map((group) => [group.canonicalSlug, group]));
  const duplicateSlugs = new Set(newsSourceGroups.flatMap((group) => [
    ...group.duplicateSlugs,
    ...(group.hiddenSlugs ?? []),
  ]));
  const articleBySlug = new Map(validArticles.map((article) => [article.slug, article]));

  return validArticles.map((article) => {
    const group = groupsByCanonical.get(article.slug);
    const relatedSources = group?.duplicateSlugs
      .map((slug) => articleBySlug.get(slug))
      .filter(Boolean)
      .map((sourceArticle) => ({
        title: sourceArticle.title,
        label: getNewsSourceName(sourceArticle),
        date: sourceArticle.date,
        isExternal: sourceArticle.isExternal,
        url: sourceArticle.externalUrl || sourceArticle.sourceUrl || `/news/${sourceArticle.slug}`,
      })) ?? [];

    return {
      ...article,
      hiddenFromList: duplicateSlugs.has(article.slug),
      relatedSources,
    };
  });
}

export const newsArticles = withSourceGroups([
  ...importedVideoNews,
  ...importedKlanNews,
  ...importedAtvNews,
  ...importedNews,
]);

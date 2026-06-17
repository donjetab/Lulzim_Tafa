import {
  awards,
  biography,
  books,
  galleryImages,
  newsArticles,
  poemLanguages,
  poems,
  quickFacts,
  siteSettings,
  testimonials,
} from './content.js';

const delay = (value) => Promise.resolve(value);

export const cms = {
  getSiteSettings: () => delay(siteSettings),
  getBooks: () => delay(books),
  getBook: (slug) => delay(books.find((book) => book.slug === slug)),
  getPoems: (language) =>
    delay(language ? poems.filter((poem) => poem.language === language) : poems),
  getPoem: (slug) => delay(poems.find((poem) => poem.slug === slug)),
  getPoemLanguages: () => delay(poemLanguages),
  getNews: () => delay(newsArticles),
  getNewsArticle: (slug) => delay(newsArticles.find((article) => article.slug === slug)),
  getAwards: () => delay(awards),
  getGallery: () => delay(galleryImages),
  getTestimonials: () => delay(testimonials),
  getBiography: () => delay(biography),
  getQuickFacts: () => delay(quickFacts),
};

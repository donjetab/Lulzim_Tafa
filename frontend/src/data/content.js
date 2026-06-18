export const siteSettings = {
  logo: 'Lulzim Tafa',
  subtitle: 'Academic & Author',
  heroTitle: 'Poetry, scholarship, and the enduring language of memory',
  heroText:
    'A warm editorial home for the literary work, public life, awards, interviews, and academic journey of Lulzim Tafa.',
  contactEmail: 'info@lulzimtafa.com',
  contactPhone: '+383 00 000 000',
  location: 'Prishtina, Kosovo',
  socialLinks: [
    { id: 1, label: 'Lulzim Tafa', icon: 'website', url: '#' },
    { id: 2, label: 'lulzim.tafa', icon: 'facebook', url: '#' },
    { id: 3, label: 'lulzimtafa.official', icon: 'instagram', url: '#' },
    { id: 4, label: 'Lulzim Tafa', icon: 'linkedin', url: '#' },
  ],
};

export const books = [
  {
    id: 1,
    slug: 'antologji-personale',
    title: 'Antologji Personale',
    category: 'Poetry',
    year: 2023,
    location: 'Prishtina',
    featured: true,
    coverImage: '/assets/books/placeholder-book-1.webp',
    mockupImage: '/assets/mockups/hp-antologji-personale.png',
    summary:
      'A selected body of poems that gathers major themes from Tafa’s literary voice: witness, exile, affection, irony, and civic memory.',
    description:
      'This sample entry is shaped like the future database record. Replace the cover, mockup, publisher metadata, and long description from the admin panel when real content is available.',
  },
  {
    id: 2,
    slug: 'ekspozite-me-enderra',
    title: 'Ekspozitë me ëndërrra',
    category: 'Poetry',
    year: 2021,
    location: 'Skopje',
    featured: true,
    coverImage: '/assets/books/placeholder-book-2.webp',
    mockupImage: '/assets/mockups/hp-ekspozite-me-enderra.png',
    summary:
      'Academic and literary reflections arranged as a quiet map of language, identity, and public responsibility.',
    description:
      'A placeholder book details page that demonstrates how all book data can be reused across home, listing, and detail views.',
  },
  {
    id: 3,
    slug: 'rivali-i-adamit',
    title: 'Rivali i Adamit',
    category: 'Poetry',
    year: 2019,
    location: 'Tirana',
    featured: false,
    coverImage: '/assets/books/placeholder-book-3.webp',
    mockupImage: '/assets/mockups/hp-rivali-adamit.png',
    summary:
      'A reflective academic volume about institutions, culture, and the responsibility of teaching.',
    description:
      'This is sample content for the first implementation and should later be managed through the admin panel.',
  },
  {
    id: 4,
    slug: 'flirt',
    title: 'Flirt',
    category: 'Poetry',
    year: 2020,
    location: 'Prishtina',
    featured: false,
    coverImage: '/assets/books/placeholder-book-4.webp',
    mockupImage: '/assets/mockups/hp-flirt.png',
    summary:
      'A collection of poems that explore the nuances of human connection and desire.',
    description:
      'This is sample content for the first implementation and should later be managed through the admin panel.',
  }
];

export const poemLanguages = [
  'Albanian',
  'English',
  'Macedonian',
  'Montenegrin',
  'Romanian',
  'Serbian',
  'Italian',
  'Swedish',
  'Greek',
  'Russian',
  'Romani',
  'French',
  'German',
  'Hungarian',
  'Bosnian',
  'Slovenian',
];

export const poems = [
  {
    id: 1,
    slug: 'the-candle',
    title: 'The Candle',
    language: 'English',
    featured: true,
    paperAsset: '/assets/papers/placeholder-poem-paper.webp',
    excerpt: 'A little light keeps its watch while the room remembers every name.',
    body:
      'A little light keeps its watch\nwhile the room remembers every name.\n\nThe window gathers winter,\nand the table holds a silence\nolder than sleep.\n\nIn that silence, a poem begins.',
  },
  {
    id: 2,
    slug: 'fjala',
    title: 'Fjala',
    language: 'Albanian',
    featured: false,
    paperAsset: '/assets/papers/placeholder-poem-paper.webp',
    excerpt: 'Fjala vjen ngadale, si hije mbi letren e vjeter.',
    body:
      'Fjala vjen ngadale,\nsi hije mbi letren e vjeter.\n\nAjo nuk kerkon zhurme,\nvetem nje dore qe e njeh\ndhe nje shpirt qe s’e harron.',
  },
  {
    id: 3,
    slug: 'la-carta',
    title: 'La Carta',
    language: 'Italian',
    featured: false,
    paperAsset: '/assets/papers/placeholder-poem-paper.webp',
    excerpt: 'Sulla carta resta una luce, fragile e testarda.',
    body:
      'Sulla carta resta una luce,\nfragile e testarda.\n\nOgni verso torna\ncome passo sulla pietra,\ncome memoria che respira.',
  },
];

export const newsArticles = [
  {
    id: 1,
    slug: 'literary-evening-in-prishtina',
    title: 'Poeti Lulzim Tafa nderohet me çmimin mbarëkombëtar për poezi “At Gjergj Fishta”',
    category: 'News',
    date: '2025-10-24',
    image: '/assets/news/Lulzim-Tafa-Lezhe.jpg',
    excerpt:
      'A gathering dedicated to poetry, public memory, and the role of literature in civic life.',
    body:
      'This article is sample content for the first version. In the final CMS-backed system, editors will manage the title, date, category, images, gallery, and full article body through the admin panel.',
    isExternal: false,
    externalUrl: '',
    galleryImages: [],
    featured: true,
  },
  {
    id: 2,
    slug: 'interview-on-literary-memory',
    title: 'U mbajt mbrëmja letrare “Shihemi te Kroni i Traboinit” në Tuz, me pjesëmarrjen e poetit Lulzim Tafa.',
    category: 'Interview',
    date: '2026-04-03',
    image: '/assets/news/komuna-tuzit.jpg',
    excerpt:
      'A conversation about translation, language, and the public life of poetry.',
    body: '',
    isExternal: true,
    externalUrl: 'https://example.com/interview',
    galleryImages: [],
    featured: true,
  },
  {
    id: 3,
    slug: 'award-recognition-announced',
    title: 'Poeti Lulzim Tafa pjesë e ekspozitës ndërkombëtare poetike “Shi Xu” në Shangai të Kinës',
    category: 'Award',
    date: '2026-02-22',
    image: '/assets/news/Lajmi_Kine_LulzimTafa.jpg',
    excerpt:
      'A new recognition celebrates a long contribution to literature and academic culture.',
    body:
      'A sample internal news item with a detail route. Gallery images can be attached by the future admin interface.',
    isExternal: false,
    externalUrl: '',
    galleryImages: [],
    featured: true,
  },
];

export const awards = [
  {
    id: 1,
    title: 'Lifetime Literary Contribution',
    description: 'Recognition for sustained contribution to contemporary poetry.',
    year: 2025,
    featured: true,
    icon: '/assets/awards/placeholder-medal.webp',
    certificateAsset: '/assets/awards/placeholder-certificate.webp',
  },
  {
    id: 2,
    title: 'Academic Leadership Honor',
    description: 'Awarded for cultural and educational leadership.',
    year: 2022,
    featured: true,
    icon: '/assets/awards/placeholder-seal.webp',
    certificateAsset: '/assets/awards/placeholder-certificate.webp',
  },
  {
    id: 3,
    title: 'International Poetry Distinction',
    description: 'An international acknowledgement of poetic work in translation.',
    year: 2020,
    featured: true,
    icon: '/assets/awards/placeholder-laurel.webp',
    certificateAsset: '/assets/awards/placeholder-certificate.webp',
  },
  {
    id: 4,
    title: 'Cultural Visit Acknowledgment',
    description: 'Recognition following a regional cultural exchange program.',
    year: 2018,
    featured: false,
    icon: '/assets/awards/placeholder-seal.webp',
    certificateAsset: '/assets/awards/placeholder-certificate.webp',
  },
];

export const galleryImages = [
  { id: 1, src: '/assets/gallery/placeholder-gallery-1.webp', caption: 'Portrait study' },
  { id: 2, src: '/assets/gallery/placeholder-gallery-2.webp', caption: 'Literary event' },
  { id: 3, src: '/assets/gallery/placeholder-gallery-3.webp', caption: 'Academic ceremony' },
  { id: 4, src: '/assets/gallery/placeholder-gallery-4.webp', caption: 'Public reading' },
  { id: 5, src: '/assets/gallery/placeholder-gallery-5.webp', caption: 'Archive moment' },
];

export const testimonials = [
  {
    id: 1,
    quote:
      'His poetry moves with the dignity of old paper and the urgency of a living voice.',
    authorName: 'Literary Critic',
    authorTitle: 'Essayist',
  },
  {
    id: 2,
    quote:
      'A scholar and writer whose public work keeps returning language to responsibility.',
    authorName: 'University Colleague',
    authorTitle: 'Professor',
  },
];

export const biography = [
  'Lulzim Tafa is presented here as an author, poet, academic, and public figure whose work crosses literature, education, and civic life. This first version uses placeholder editorial copy so the interface, spacing, and content model can be tested before final biography text is added.',
  'The biography section is intentionally continuous and article-like, matching the prompt requirement that the full biography remain readable as a complete editorial text rather than being broken into small chapter cards.',
  'When the admin panel is connected to the database, this text should be managed as site content and rendered with the same typography, paragraph rhythm, and parchment-inspired page treatment.',
];

export const quickFacts = [
  ['Born', 'Kosovo'],
  ['Education', 'Law and academic leadership'],
  ['Rector', 'University leadership profile'],
  ['Profession', 'Poet, author, academic'],
  ['Fields of Work', 'Poetry, essays, education, culture'],
  ['Known For', 'Literary voice and public engagement'],
  ['Distinctions', 'Awards and international recognitions'],
];

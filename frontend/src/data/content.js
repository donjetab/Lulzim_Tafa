import { importedPoems } from './importedPoems.js';
import { newsArticles } from './news.js';
import { testimonials as importedTestimonials } from './testimonials.js';

export { newsArticles };

export const siteSettings = {
  logo: 'Lulzim Tafa',
  subtitle: 'Academic & Author',
  heroTitle: 'Poetry, scholarship, and the enduring language of memory',
  heroText:
    'A warm editorial home for the literary work, public life, awards, interviews, and academic journey of Lulzim Tafa.',
  location: 'Prishtina, Kosovo',
  socialLinks: [
    { id: 1, label: 'Lulzim Tafa', icon: 'website', url: 'https://en.wikipedia.org/wiki/Lulzim_Tafa' },
    { id: 2, label: 'lulzim.tafa', icon: 'facebook', url: 'https://www.facebook.com/lulzim.tafa/' },
    { id: 3, label: 'lulzimtafa.official', icon: 'instagram', url: 'https://www.instagram.com/lulzimtafa.official/' },
    { id: 4, label: 'Lulzim Tafa', icon: 'linkedin', url: 'https://linkedin.com/in/lulzim-tafa-a5b4362b7' },
  ],
};

const placeholderBooks = [
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

export const books = [
  {
    id: 1,
    slug: 'antologji-personale',
    title: 'Antologji Personale',
    category: 'Poetry book',
    year: 2025,
    location: 'Prishtina',
    featured: true,
    coverImage: '/assets/books/2025-anotologji-personale.jpg',
    mockupImage: '/assets/mockups/2025-anotologji-personale.png',
    summary: 'A selected body of poems gathered in a personal anthology.',
    description: 'A poetry book by Lulzim Tafa published in Prishtina.',
  },
  {
    id: 2,
    slug: 'ekspozite-me-enderra',
    title: 'Ekspozitë me ëndrra',
    category: 'Poetry book',
    year: 2024,
    location: 'Tirana',
    featured: true,
    coverImage: '/assets/books/Ekspozitë me ëndrra.jpg',
    mockupImage: '/assets/mockups/2024-ekspozite-me-endrra.png',
    summary: 'A poetry book by Lulzim Tafa published in Tirana.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 3,
    slug: 'rivali-i-adamit',
    title: 'Rivali i Adamit',
    category: 'Poetry book',
    year: 2024,
    location: 'Prishtina, Kosovo',
    featured: false,
    coverImage: '/assets/books/2024-rivali-i-adamit.jpg',
    mockupImage: '/assets/mockups/2024-rivali-i-adamit.png',
    summary: 'A poetry book by Lulzim Tafa published in Prishtina, Kosovo.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 4,
    slug: 'rozmova-z-kaminniam',
    title: 'Розмова з камінням',
    category: 'Poetry book',
    year: 2021,
    location: 'Ukrainian language',
    coverImage: '/assets/books/2021-Розмова-з-камінням.png',
    mockupImage: '/assets/mockups/2021-Розмова-з-камінням.png',
    summary: 'A Ukrainian-language poetry book by Lulzim Tafa.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 5,
    slug: 'tolkovane-dozhdlivykh-snov',
    title: 'Толковане дождливых снов',
    category: 'Poetry book',
    year: 2020,
    location: 'Russian language',
    coverImage: '/assets/books/2020-ТОЛКОВАНЕ-ДОЖДЛИВЫХ-СНОВ.png',
    mockupImage: '/assets/mockups/2020-ТОЛКОВАНЕ-ДОЖДЛИВЫХ-СНОВ.png',
    summary: 'A Russian-language poetry book by Lulzim Tafa.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 6,
    slug: 'bersa-e-roslipeimaske',
    title: 'Bersa e Roslipeimaske',
    category: 'Poetry book',
    year: 2020,
    location: 'Belgrade',
    coverImage: '/assets/books/2020-bersa-e-Roslipeimaske.png',
    mockupImage: '/assets/mockups/2020-bersa-e-Roslipeimaske.png',
    summary: 'A poetry book by Lulzim Tafa published in Belgrade.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 7,
    slug: 'te-dielave-mos-me-thirr',
    title: 'Të dielave mos më thirr',
    category: 'Poetry book',
    year: 2019,
    location: 'Armagedoni, Pristina',
    coverImage: '/assets/books/2019-te-dielave-mos-me-thirr-me.png',
    mockupImage: '/assets/mockups/2019-te-dielave-mos-me-thirr-me.png',
    summary: 'A poetry book by Lulzim Tafa published in Pristina.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 8,
    slug: 'teuta',
    title: 'Teuta',
    category: 'Poetry book',
    year: 2018,
    location: 'Otrinta',
    coverImage: '/assets/books/2018-teuta.png',
    mockupImage: '/assets/mockups/2018-teuta.png',
    summary: 'A poetry book by Lulzim Tafa published by Otrinta.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 9,
    slug: 'ne-zovi-me-nedeljom',
    title: 'Ne zovi me Nedeljom',
    category: 'Poetry book',
    year: 2018,
    location: 'Alma, Belgrade',
    coverImage: '/assets/books/2018-ne-zovi-me-nedeljom.png',
    mockupImage: '/assets/mockups/2018-ne-zovi-me-nedeljom.png',
    summary: 'A poetry book by Lulzim Tafa published in Belgrade.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 10,
    slug: 'dali-ti-imas-bolka',
    title: 'Dali ti imas Bolka',
    category: 'Poetry book',
    year: 2018,
    location: 'Akademski Pečat',
    coverImage: '/assets/books/2018-dali-ti-imas-bolka.png',
    mockupImage: '/assets/mockups/2018-dali-ti-imas-bolka.png',
    summary: 'A poetry book by Lulzim Tafa published by Akademski Pečat.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 11,
    slug: 'expoziție-de-vise',
    title: 'Expoziție de vise',
    category: 'Poetry book',
    year: 2018,
    location: 'Amanda Edit, Romania',
    coverImage: '/assets/books/2018-expoziţie-de-vise.jpg',
    mockupImage: '/assets/mockups/2018-expoziţie-de-vise.png',
    summary: 'A poetry book by Lulzim Tafa published in Romania.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 12,
    slug: 'paketimi-i-merzise',
    title: 'Paketimi i mërzisë',
    category: 'Poetry book',
    year: 2017,
    location: 'Luma Grafik, Tetovo',
    coverImage: '/assets/books/2017-paketimi-i-merzise.png',
    mockupImage: '/assets/mockups/2017-paketimi-i-merzise.png',
    summary: 'A poetry book by Lulzim Tafa published in Tetovo.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 13,
    slug: 'zavjetne-pjesme',
    title: 'Zavjetne pjesme',
    category: 'Poetry book',
    year: 2016,
    location: 'Dignitas, Podgorica',
    coverImage: '/assets/books/2016-zavjetne-pjesme.png',
    mockupImage: '/assets/mockups/2016-zavjetne-pjesme.png',
    summary: 'A poetry book by Lulzim Tafa published in Podgorica.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 14,
    slug: 'vraziji-posao',
    title: 'Vražiji Posao',
    category: 'Poetry book',
    year: 2015,
    location: 'Alma',
    coverImage: '/assets/books/2015-vraziji-posao.png',
    mockupImage: '/assets/mockups/2015-vraziji-posao.png',
    summary: 'A poetry book by Lulzim Tafa published by Alma.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 15,
    slug: 'shtini-ndhe-keto-fjale',
    title: "Shtini n'dhe këto fjalë",
    category: 'Poetry book',
    year: 2015,
    location: 'Faik Konica, Pristina',
    coverImage: '/assets/books/2015-shtini-ndhe-keto-fjale.png',
    mockupImage: '/assets/mockups/2015-shtini-ndhe-keto-fjale.png',
    summary: 'A poetry book by Lulzim Tafa published in Pristina.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 16,
    slug: 'la-cronica-di-una-santa-guerra',
    title: 'La cronica di una santa Guerra',
    category: 'Poetry book',
    year: 2013,
    location: 'Ginta Latina',
    coverImage: '/assets/books/2013-la-cronica-di una-santa-guerra.png',
    mockupImage: '/assets/mockups/2013-la-cronica-di una-santa-guerra.png',
    summary: 'A poetry book by Lulzim Tafa published by Ginta Latina.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 17,
    slug: 'la-theorie-de-lexplication-des-reves',
    title: "La théorie de l'explication des rêves",
    category: 'Poetry book',
    year: 2013,
    location: 'Esprit Des Eagles',
    coverImage: '/assets/books/2013-la-theorie-de-lexplication-des reves.png',
    mockupImage: '/assets/mockups/2013-la-theorie-de-lexplication-des reves.png',
    summary: 'A poetry book by Lulzim Tafa published by Esprit Des Eagles.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 18,
    slug: 'traumausstellung',
    title: 'Traumausstellung',
    category: 'Poetry book',
    year: 2013,
    location: 'Amanda Verlag, Sinaia',
    coverImage: '/assets/books/2013-traumausstellung.png',
    mockupImage: '/assets/mockups/2013-traumausstellung.png',
    summary: 'A poetry book by Lulzim Tafa published by Amanda Verlag.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 19,
    slug: 'terrible-songs',
    title: 'Terrible Songs',
    category: 'Poetry book',
    year: 2013,
    location: 'Gracious Light, New York',
    coverImage: '/assets/books/2013-terrible-songs.png',
    mockupImage: '/assets/mockups/2013-terrible-songs.png',
    summary: 'A poetry book by Lulzim Tafa published in New York.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 20,
    slug: 'i-kam-edhe-dy-fjale',
    title: 'I kam edhe dy fjalë',
    category: 'Poetry book',
    year: 2012,
    location: 'Faik Konica, Pristina',
    coverImage: '/assets/books/2012-i-kam-edhe-dy-fjale.png',
    mockupImage: '/assets/mockups/2012-i-kam-edhe-dy-fjale.png',
    summary: 'A poetry book by Lulzim Tafa published in Pristina.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 21,
    slug: 'under-manen-sover-tiderna',
    title: 'Under Manen Sover Tiderna',
    category: 'Poetry book',
    year: 2012,
    location: 'Erik Hans Forlag',
    coverImage: '/assets/books/2012-under-manen-sover-tiderna.png',
    mockupImage: '/assets/mockups/2012-under-manen-sover-tiderna.png',
    summary: 'A poetry book by Lulzim Tafa published by Erik Hans Forlag.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 22,
    slug: 'vdekja-con-fjale',
    title: 'Vdekja çon fjalë',
    category: 'Poetry book',
    year: 1998,
    location: 'Prishtina',
    coverImage: '/assets/books/1998-vdekja-con-fjale.png',
    mockupImage: '/assets/mockups/1998-vdekja-con-fjale.png',
    summary: 'A poetry book by Lulzim Tafa published in Prishtina.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 23,
    slug: 'planeti-babiloni',
    title: 'Planeti Babiloni',
    category: 'Poetry book',
    year: 1997,
    location: 'Rilindja, Prishtina',
    coverImage: '/assets/books/1997-planeti-babiloni.png',
    mockupImage: '/assets/mockups/1997-planeti-babiloni.png',
    summary: 'A poetry book by Lulzim Tafa published by Rilindja.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 24,
    slug: 'metafore-e-pikelluar',
    title: 'Metaforë e pikëlluar',
    category: 'Poetry book',
    year: 1995,
    location: 'Rilindja, Prishtina',
    coverImage: '/assets/books/1995-metafore-e-pikelluar.png',
    mockupImage: '/assets/mockups/1995-metafore-e-pikelluar.png',
    summary: 'A poetry book by Lulzim Tafa published by Rilindja.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 25,
    slug: 'gjaku-nuk-behet-uje',
    title: 'Gjaku nuk bëhet ujë',
    category: 'Poetry book',
    year: 1993,
    location: 'Rilindja, Pristina',
    coverImage: '/assets/books/1993-gjaku-nuk-behet-uje.png',
    mockupImage: '/assets/mockups/1993-gjaku-nuk-behet-uje.png',
    summary: 'A poetry book by Lulzim Tafa published by Rilindja.',
    description: 'Publication details can be expanded when the final book metadata is available.',
  },
  {
    id: 26,
    slug: 'flirt',
    title: 'Flirt',
    category: 'Poetry book',
    year: null,
    location: 'Botimet AAB',
    featured: false,
    coverImage: '/assets/books/Flirt.png',
    mockupImage: '/assets/mockups/flirt.png',
    summary: 'A poetry book by Lulzim Tafa published by Botimet AAB.',
    description: 'The publication year can be added when confirmed.',
  },
  {
    id: 27,
    slug: 'on-sundays-do-not-call-me',
    title: 'On Sundays do not call me',
    category: 'Poetry book',
    year: null,
    location: 'Allahabad, India',
    coverImage: '/assets/books/on-sundays-do-not-call-me.png',
    mockupImage: '/assets/mockups/on-sundays-do-not-call-me.png',
    summary: 'A selected poems volume by Lulzim Tafa published in India.',
    description: 'The publication year can be added when confirmed.',
  },
  {
    id: 28,
    slug: 'ne-klici-me-v-nedeljo',
    title: 'Ne kliči me v nedeljo',
    category: 'Poetry book',
    year: null,
    location: '',
    coverImage: '/assets/books/ne-klici-me-v-nedeljo.png',
    mockupImage: '/assets/mockups/ne-klici-me-v-nedeljo.png',
    summary: 'A poetry book by Lulzim Tafa.',
    description: 'The publisher and publication year can be added when confirmed.',
  },
  {
    id: 29,
    slug: 'szokatlan-ima',
    title: 'Szokatlan ima',
    category: 'Poetry book',
    year: null,
    location: '',
    coverImage: '/assets/books/szokatlan-ima.png',
    mockupImage: '/assets/mockups/szokatlan-ima.png',
    summary: 'A poetry book by Lulzim Tafa.',
    description: 'The publisher and publication year can be added when confirmed.',
  },
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
  {
    id: 4,
    slug: 'te-dielave-mos-me-thirr-me',
    title: 'Të Dielave Mos Më Thirr Më',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Të dielave mos më thirr më, mund të mos zgjohem.',
    body: `Të dielave mos më thirr më
Mund të mos zgjohem
Përjetë të rri në gjumin e vdekjes
Mos i harro çastet e ngrira
Veç të dielës zgjidhe ditën tënde
Për ty kur të vdes
Pas shtatë bjeshkësh të ta gjej emrin
Ah, si nuk vjen ditëve të tjera.`,
  },
  {
    id: 5,
    slug: 'anderr',
    title: 'Andërr',
    language: 'Albanian',
    featured: true,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Mos u dëshpëro e dashur. As mos u zhgënje.',
    body: `Palimpsest kozmik

Mos u dëshpëro e dashur
As mos u zhgënje
Sapo mora vesh
Unë fare nuk ekzistoj
As ti
E tëra është një ëndërr
Askush nuk ekziston
Më e keqja
As bota
Asgjë që mendojmë se është
Nuk është
Nuk ekzistojnë malet, detet, oqeanet
As qiejt
Nuk ekzistojnë planetët
Dielli, Toka e Hana
Hana hiç se hiç
(Logjikë) diçka kaq e bukur
S’mund të ekzistojë
Ashtu siç nuk ekzistojnë
vitet e dritës
Kashta e Kumtrit
Atmosfera, hidrosfera
Biosferë nuk ka
As që ka pasur
As që do ketë
Harroje
PIKË.
Astronautët kanë gënjyer edhe pse
As ata nuk ekzistojnë
Mos beso më në galaktika
Big bangu andërr ka qenë
Si andrrat ma
Të trishta
Të bukura
Plot zjarr
Lindja e vdekja
Ferri e Parajsa
Andrra janë
Mos u dëshpëro
As rruga tjetër e Qumështit
As gjithësia
Më vjen keq e dashur
Nuk ekziston
As dashuria
Edhe pse të dua
As Prindërit tanë kurrë nuk kanë ekzistuar
(ku janë pra)?
Veç për Zotin e di
Ai është diku
Mbase është i vetmi që mohohet
Mbase është ai
“Që po na sheh në andërr”.
Se Zoti
Është një fëmijë i vogël
Që luan me yje`,
  },
  {
    id: 6,
    slug: 'akull-dhe-dashni',
    title: 'Akull Dhe Dashni',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Për Zotin, për ty, për kry t’vargut.',
    body: `Për Zotin Për ty
Për kry t‘vargut
Nuk e di
Kam rrëshqitë
N’dashni si në akull
Apo kam rrëshqitë
Në akull
Si n’dashni`,
  },
  {
    id: 7,
    slug: 'ashensori',
    title: 'Ashensori',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Sapo dyert e ashensorit u mbyllën.',
    body: `Sapo dyert e ashensorit u mbyllën
Ajo e nxori ID e vet zyrtare
Dhe buzët e trasha
Drejt meje i zgjati.
Unë jam Maria Skorelesku
Dhe kam të drejtë
Të të puth
Pa të pyetur.
U stepa nga formalizmi
I saj
I tepruar.
Më fal i thashë të lutem
Se jam një anarkist
I njohur për puthje.
Si gjuhë gjarpri
Gjuhë e saj
Çau buzët e mia
Pushtim total
oral.
Në tabelën informuese të ashensorit
Numrat e kateve ndërroheshin.
Pesë
Gjashtë
Shtatë
Në të tetin
isha zënë rob
Kjo tanimë ishte e qartë.
Me kot mundohesha
T’i liroja duart
Nga gjoksi i saj.
Në katin e katërmbëdhjetë
Ashensori ndaloi
Për të fundit herë
Për fat
Për pak
Përpara se
të pëlciste gypi
Me ujë të valë.`,
  },
  {
    id: 8,
    slug: 'vasha-e-dukagjinit',
    title: 'Vasha E Dukagjinit',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Ti nuk i përngjan mëngjesit, as jorgovanit syçelë.',
    body: `Ti nuk i përngjan mëngjesit
As jorgovanit syçelë.
E kthjellët je
Më e kthjellët se loti
Se ujë i Drinit
të bardhë
Se ujë i Drinit
të zi
Se vesa
Se pika e shiut.
E shenjtë je
Më e shenjtë
se ura e shenjtë
Se Rozafa
Se motra e Gjergj Elez Alisë
E bukur je
Më e bukur
se vasha e përrallave
Kristal je
Kristal ke syrin
Filigranët të qesin nëpër unaza
Djemtë e ri
Përpara pasqyrës
e vrasin veten
Asgjë s’të përngjan
më shumë se lulëkuqja
vashë e dukagjinit
ruaju hënës përgjysmë
dhe shamizezave
shëngjergjave kur ta lidhin
gërshetin.`,
  },
  {
    id: 9,
    slug: 'qershize',
    title: 'Qershizë',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Ti më shumë se secila pemë në kopshte.',
    body: `Ti më shumë
se secila
pemë në kopshte
ke qershi
në sy
në buzë
në gji.`,
  },
  {
    id: 10,
    slug: 'sms',
    title: 'SMS',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Tung zemër, diellin e kam afër.',
    body: `Tung zemër
Diellin e kam afër
Vetëm një metër
Ti, pika e ujit
Që ferrin e shkymë`,
  },
  {
    id: 11,
    slug: 'dehje-me-fatalitet',
    title: 'Dehje Me Fatalitet',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Ti ke dehje fatale kur dehesh.',
    body: `Ti ke dehje fatale
kur dehesh
Vret,
Unë vetëm
Kur dehem
Të dashuroj
Fatalisht dehemi
Të dy`,
  },
  {
    id: 12,
    slug: 'ke-fjetur-nen-hene',
    title: 'Ke Fjetur Nën Hënë',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'A s’të dhimbsem, dielli t’i vrau sytë athua.',
    body: `A s’të dhimbsem
Dielli t’i vrau sytë athua
Ke fjetur nën hijen e hënës
Dhe pa dashur të futa në këngë
Pse qan?
Sytë s’dhimbsen a
Do të vij në ëndrrën tënde
Dhe do ta harroj udhën e kthimit
Nga vaji i lig
Nga ëndrra e zezë
Të lutem mos qaj
A s’të dhimbsem unë vogëlushe`,
  },
  {
    id: 13,
    slug: 'ajkuna',
    title: 'Ajkuna',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Nën dritën e hënës e zë Ajkunën.',
    body: `Nën dritën e hënës e zë Ajkunën
Tu’ i nxjerr grigjës tamblin
Ajkunë
Ç’bën ti me grigjën
Do të bëj unë me ty
Uh qyqja unë për kopenë tha
Tu’ kujtu’ se i kish rënë
Ujku n’qafë.`,
  },
  {
    id: 14,
    slug: 'erotike-e-lehte',
    title: 'Erotikë E Lehtë',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Mban mend oj, kur ishim një.',
    body: `Mban mend oj
Kur ishim
Një
E të zhvishja
me sy
Ti askund
E unë
Mbi
Ty.
Dikur vonë
Na përziheshin
Gishtërinj dhe maja.`,
  },
  {
    id: 15,
    slug: 'mosmarreveshje',
    title: 'Mosmarrëveshje',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Mollën i thashë ma jep.',
    body: `Mollën i thashë
ma jep
Ajo m’i dha
mollët
Si qershi
u skuq,
E unë
u gjenda
në majë të saj
Në trung qershie.`,
  },
  {
    id: 16,
    slug: 'telefoni',
    title: 'Telefoni',
    language: 'Albanian',
    featured: false,
    sourceUrl: 'https://lulzimtafa.al/languages/albanian/',
    excerpt: 'Cingëron fort trishtueshëm në mesëndërr.',
    body: `Cingëron fort trishtueshëm
Në mesëndërr
Në mesnatë
Telefoni i kaltër
Përmes telave i mban
Lidhjet e zemrave`,
  },
  ...importedPoems,
];

const legacyNewsArticles = [
  {
    id: 1,
    slug: 'poeti-lulzim-tafa-nderohet-at-gjergj-fishta',
    title: 'Poeti Lulzim Tafa nderohet me çmimin mbarëkombëtar për poezi “At Gjergj Fishta”',
    category: 'News',
    date: '2025-10-24',
    image: '/assets/news/Lulzim-Tafa-Lezhe.jpg',
    excerpt: 'Në Lezhë, poeti Lulzim Tafa u nderua me çmimin mbarëkombëtar për poezi “At Gjergj Fishta”.',
    body: [
      'Në Pallatin e Kulturës “Ded Ndue Lazri” në Lezhë u shënua me një ceremoni të veçantë kujtimi i Gjergj Fishtës dhe kontributi i tij në letërsinë shqipe.',
      'Në mesin e poetëve të pranishëm, poeti i njohur kosovar Lulzim Tafa u nderua me çmimin mbarëkombëtar për poezi “At Gjergj Fishta”.',
      'Poeti Tafa theksoi se ky çmim ka rëndësi të veçantë dhe se do ta ruajë si një thesar të çmuar në sirtarin e tij.',
      'Ceremonia u shoqërua me pika muzikore dhe vlerësime nga personalitete të letërsisë.',
    ],
    isExternal: false,
    externalUrl: '',
    sourceUrl: 'https://atvlive.tv/poeti-lulzim-tafa-nderohet-nga-lezha-me-cmimin-at-gjergj-fishta',
    galleryImages: [
      '/assets/news/Lulzim-Tafa-Lezhe.jpg',
      '/assets/news/Lulzim-Tafa-Lezhe.jpg',
      '/assets/news/Lulzim-Tafa-Lezhe.jpg',
    ],
    featured: true,
  },
  {
    id: 2,
    slug: 'shihemi-te-kroni-i-traboinit',
    title: 'U mbajt mbrëmja letrare “Shihemi te Kroni i Traboinit” në Tuz, me pjesëmarrjen e poetit Lulzim Tafa.',
    category: 'Interview',
    date: '2026-04-03',
    image: '/assets/news/komuna-tuzit.jpg',
    excerpt: 'Një takim letrar kushtuar poezisë, përkthimit dhe jetës publike të krijimtarisë.',
    body: '',
    isExternal: true,
    externalUrl: 'https://www.epokaere.com/interviste-me-poetin-lulzim-tafa/',
    galleryImages: [],
    featured: true,
  },
  {
    id: 3,
    slug: 'poeti-lulzim-tafa-shi-xu-shangai',
    title: 'Poeti Lulzim Tafa pjesë e ekspozitës ndërkombëtare poetike “Shi Xu” në Shangai të Kinës',
    category: 'News',
    date: '2026-02-22',
    image: '/assets/news/Lajmi_Kine_LulzimTafa.jpg',
    excerpt: 'Poezia e Lulzim Tafës prezantohet në një ekspozitë ndërkombëtare poetike në Shangai.',
    body: [
      'Poezia e Lulzim Tafës u përfshi në ekspozitën ndërkombëtare poetike “Shi Xu” në Shangai të Kinës.',
      'Ngjarja bashkon autorë dhe përkthime nga vende të ndryshme, duke krijuar hapësirë për dialog kulturor mes gjuhëve.',
    ],
    isExternal: false,
    externalUrl: '',
    galleryImages: ['/assets/news/Lajmi_Kine_LulzimTafa.jpg'],
    featured: true,
  },
  {
    id: 4,
    slug: 'interviste-youtube-lulzim-tafa',
    title: 'Intervistë me poetin Lulzim Tafa',
    category: 'Interview',
    date: '2025-05-13',
    image: '/assets/news/Lulzim-Tafa-Lezhe.jpg',
    excerpt: 'Bisedë video mbi krijimtarinë, kujtesën dhe rolin e poezisë në jetën publike.',
    body: '',
    isExternal: true,
    externalUrl: 'https://youtu.be/cSv8MWYRLTc?si=V684O0nUaEXYZUX_',
    galleryImages: [],
    featured: true,
  },
];

export const awards = [
  {
    id: 1,
    slug: 'officer-french-order-arts-letters',
    title: 'Officer in the French Order of Arts & Letters',
    description: 'Officer in the French Order of Arts & Letters, awarded in Kosovo.',
    year: 2023,
    location: 'Kosovo',
    icon: '/assets/decorative/award-icon-5.png',
    image: '/assets/awards/officer-in-the-french-order-of-arts.jpg',
    layout: 'landscape',
  },
  {
    id: 2,
    slug: 'alexander-the-great-award',
    title: 'International Award "Alexander the Great"',
    description: 'International literary distinction awarded in Greece.',
    year: 2021,
    location: 'Greece',
    icon: '/assets/decorative/award-icon-6.png',
    image: '/assets/awards/alexander-the-great.jpg',
    layout: 'landscape',
  },
  {
    id: 3,
    slug: 'neruda-awards',
    title: 'International Award "Neruda Awards"',
    description: 'International poetry award presented in Italy.',
    year: 2019,
    location: 'Italy',
    icon: '/assets/decorative/award-icon-3.png',
    image: '/assets/awards/neruda-awards.jpg',
    layout: 'landscape',
  },
  {
    id: 4,
    slug: 'naji-naaman-award',
    title: 'International Award "Naji Naaman"',
    description: 'International literary award presented in Lebanon.',
    year: 2019,
    location: 'Lebanon',
    icon: '/assets/decorative/award-icon-2.png',
    image: '/assets/awards/naji-naaman.jpg',
    layout: 'landscape',
  },
  {
    id: 5,
    slug: 'kosovo-presidential-medal-merit',
    title: 'Kosovo Presidential Medal of Merit',
    description: 'Presidential Medal of Merit awarded by the Republic of Kosovo.',
    year: 2018,
    location: 'Kosovo',
    icon: '/assets/decorative/award-icon-4.png',
    image: '/assets/awards/kosovo-presidental-medal.jpg',
    layout: 'landscape',
  },
  {
    id: 6,
    slug: 'mihai-eminescu-award',
    title: 'International Award "Mihai Eminescu"',
    description: 'International literary award presented in Romania.',
    year: 2018,
    location: 'Romania',
    icon: '/assets/decorative/award-icon-1.png',
    image: '/assets/awards/mihai-eminescu.jpg',
    layout: 'landscape',
  },
  {
    id: 7,
    slug: 'radovan-zogovic-award',
    title: 'International Award "Radovan Zogovic"',
    description: 'International literary award presented in Montenegro.',
    year: 2016,
    location: 'Montenegro',
    icon: '/assets/decorative/award-icon-3.png',
    image: '/assets/awards/radovan-zogovic.jpg',
    layout: 'portrait',
  },
  {
    id: 8,
    slug: 'ramadan-sinani-award',
    title: '"Ramadan Sinani" Award',
    description: 'Literary award presented in Tetovo, North Macedonia.',
    year: 2015,
    location: 'Tetovo, North Macedonia',
    icon: '/assets/decorative/award-icon-2.png',
    image: '/assets/awards/ramadan-sinani.jpg',
    layout: 'portrait',
  },
  {
    id: 9,
    slug: 'order-saint-yuri-victorious',
    title: '"Order of Saint Yuri the Victorious"',
    description: 'Highest decoration bestowed by the Patriarch of Ukraine, Patriarch Filaret.',
    year: 2022,
    location: 'Ukraine',
    icon: '/assets/decorative/award-icon-6.png',
    image: '/assets/awards/The_Decoration_from_the_Patriarch_Filaret_of_Ukraine.webp',
    layout: 'portrait',
  },
];

export const galleryImages = [
  { id: 1, caption: 'Public address' },
  { id: 2, caption: 'Academic ceremony' },
  { id: 3, caption: 'International recognition' },
  { id: 4, caption: 'Award moment' },
  { id: 5, caption: 'Literary exchange' },
];

export const testimonials = importedTestimonials;

export const biography = [
  'He has established five international awards in various fields, including the international award for literature and arts "Ali Podrimja". He is also committed to creating facilities for students with special needs and members of minority communities. He is also the co-founder of the British School of Kosova, which is the largest non-public school in Kosova, as well as of ATV television, one of the main media houses in the country. In 2014, he was chosen manager of the year in the field of education by Euromanager Magazine and the Union of European Managers and bestowed by the French State for outstanding achievements in the fields of Art and Literature.',
  'As a POET, Lulzim Tafa belongs to the era of Poets of the nineties, the time when bloody wars broke out in the Balkans as a result of the dissolution of the former Yugoslavia, when the people of Kosovo were threatened with ethnic and cultural annihilation. He started writing poetry as a primary school student. He published his first poems in high school magazines, whereas his first book of poems was published when he was a student.',
  'The war and humanitarian disaster of 1999 found him in Kosovo and destroyed his house, library, books, photographs, and over 300 manuscript poems. After the war he continued to deal with human rights and freedoms, promoting peace. He has also lobbied for animal rights. Thanks to his commitments, Kosovo has adopted various laws related to the protection of animal rights.',
  'Although a lawyer by profession, his primary profession and passion in life is literature. He is the author of many books of poetry. His poems have been translated into several languages of the world and included in several anthologies; he has been awarded many literary prizes. His works have so far been translated into English, German, Italian, Serbian, Croatian, Bosnian, Montenegrin, Turkish, Greek, Romanian, Roma, French, Ukrainian, Azeri, Swedish, Arabic, Macedonian, Russian, Slovenian, Hungarian, etc.',
  'He is one of the most famous Kosovar poets in the world. Well-known publishing houses from all over the world have translated and published his books, while writers and literary critics from the country and the world have appreciated his artistic creativity. The most famous international magazines in the field of literature have written and published Lulzim Tafa\'s poetry. He is one of the most famous and translated poets of Albanian literature in the world.',
  'He is a member of the European Academy of Sciences and Arts, member of the Academy of Arts and Literature in Paris, member of the Academy of Sciences of Albania, member of the Bosnian Academy of Sciences and Arts with headquarters in Sarajevo, honorary member of the Council of Albanian Ambassadors, as well as a member of PEN Center Kosovo. He is the winner of many international awards and acknowledgments for literature, such as: "Mihai Eminescu" in Romania, "Naji Naaman" in Lebanon, "Radovan Zogovic" in Montenegro, "Pablo Neruda" in Italy, "Alexander the Great" in Greece, "Ramadan Sinani" in Macedonia, etc. He has also been awarded the title "Doctor Honoris Causa" by many international universities. He has also been decorated with the title of ambassador of world peace by the World Peace Committee based in Indonesia. Lulzim Tafa is also renowned for his art in the service of peace and his efforts against war through poetry. He has been honored by cultural and educational institutions in Ukraine.',
  'Additionally, in 2022, he was decorated by the Holy Patriarch of Ukraine, Patriarch Filaret, with the "Order of Saint Yuri the Victorious". In 2023, at the World Congress of Poets, Lulzim Tafa was awarded the title "Doctor of Literature" by the World Academy of Arts and Culture, based in California, United States of America. In 2024, he was decorated by the Senate of the United States of America for his literary activities in the service of peace.',
  'In 2018, the President of the Republic of Kosovo awarded him the Presidential Medal of Merit for his exceptional contributions to the field of literature and art.',
  'Most recently, the French President Emmanuel Macron honored him with the "Officer of Arts and Letters" award, which is the highest award bestowed by the French State for outstanding achievements in the fields of Art and Literature.',
];

export const quickFacts = [
  ['Born', '1970, Lipjan'],
  ['Education', 'University of Prishtina (LL.B & LL.M), State University of Sarajevo (PhD. Law)'],
  ['Rector', 'AAB College, Prishtina 2012-2020'],
  ['Profession', 'Poet, University Professor, Legal Scholar'],
  ['Fields of Work', 'Poetry, Law, Human Rights, Education, Culture & Criminology'],
  ['Known For', 'Literature in the service of peace, human rights advocacy, cultural and academic leadership'],
  ['Distinction', 'Presidential Medal of Merit, Officer of Arts and Letters, Doctor of Literature and many more'],
];

export const aboutIntroParagraphs = [
  'Lulzim Tafa is a poet, (Rector of AAB University in Pristina, from 2012 to 2020), and university professor. He was born in 1970 in Lipjan, Republic of Kosovo. He completed his bachelor\'s and master\'s studies at the Faculty of Law of the University of Pristina, while his doctoral studies in the field of law at the State University of Sarajevo.',
  'Lulzim Tafa has considerable experience as a full professor and visiting professor of criminal subjects in several universities in Kosovo and abroad. During his career, he has held important positions in the entire academic hierarchy, including managerial positions in research centers, faculties, and university services. He is a member of the editorial boards of several local and international scientific journals and a member of the leading councils of several organizations in the field of legal sciences, human rights, criminology, etc.',
  'His exceptional leadership skills have set him apart, as he has effectively positioned the AAB University as the primary educational institution for culture and art in the country. He is the founder of the Center for the Protection of Human Rights at AAB University, as well as the Cultural Center and the Professional Theater "Faruk Begolli".',
];

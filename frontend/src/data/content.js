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
  { id: 1, caption: 'Public address' },
  { id: 2, caption: 'Academic ceremony' },
  { id: 3, caption: 'International recognition' },
  { id: 4, caption: 'Award moment' },
  { id: 5, caption: 'Literary exchange' },
];

export const testimonials = [
  {
    id: 1,
    quote:
      'Lulzim Tafa is a scholar whose writings open the mind and heart. His work brings clarity to complex questions and strengthens our shared search for understanding and human dignity.',
    authorName: 'Prof. Iliriana Fiqollahu',
    authorTitle: 'University Professor of Literature',
  },
  {
    id: 2,
    quote:
      'His poetry speaks in the quiet of things we all carry. Lulzim Tafa\'s words stay with you - they open the heart and widen the mind.',
    authorName: 'Arben Dreshaj',
    authorTitle: 'Poet & Essayist',
  },
  {
    id: 3,
    quote:
      'His academic voice is measured, humane, and courageous. It carries the discipline of law together with the moral imagination of literature.',
    authorName: 'Dr. Besa Krasniqi',
    authorTitle: 'Legal Scholar',
  },
  {
    id: 4,
    quote:
      'In public life and in poetry, Tafa keeps returning to the same essential themes: freedom, dignity, memory, and the responsibility of words.',
    authorName: 'Mentor Shala',
    authorTitle: 'Cultural Critic',
  },
];

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

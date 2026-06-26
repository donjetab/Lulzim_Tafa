import { createExternalNewsCollection } from './schema.js';

const atvNewsRecords = [
  {
    id: 139581,
    slug: 'atv-poeti-lulzim-tafa-nderohet-nga-lezha-me-cmimin-at-gjergj-fishta',
    title: 'Poeti Lulzim Tafa nderohet me çmimin mbarëkombëtar për poezi “At Gjergj Fishta”',
    category: 'News',
    date: '2025-10-23',
    image: '/assets/news/atv-139581-lulzim-tafa-lezhe.webp',
    excerpt:
      'Në Pallatin e Kulturës “Ded Ndue Lazri” në Lezhë, poeti Lulzim Tafa u nderua me çmimin mbarëkombëtar për poezi “At Gjergj Fishta”.',
    body: [],
    isExternal: true,
    externalUrl: 'https://atvlive.tv/poeti-lulzim-tafa-nderohet-nga-lezha-me-cmimin-at-gjergj-fishta/',
    sourceUrl: 'https://atvlive.tv/poeti-lulzim-tafa-nderohet-nga-lezha-me-cmimin-at-gjergj-fishta/',
    galleryImages: [],
    featured: false,
  },
  {
    id: 126451,
    slug: 'atv-poeti-lulzim-tafa-pjese-e-ekspozites-nderkombetare-poetike-shi-xu-ne-shangai-te-kines',
    title: 'Poeti Lulzim Tafa pjesë e ekspozitës ndërkombëtare poetike “Shi Xu” në Shangai të Kinës',
    category: 'News',
    date: '2025-08-18',
    image: '/assets/news/atv-126451-shi-xu-shanghai.png',
    excerpt:
      'Poezitë e poetit Lulzim Tafa janë përzgjedhur krahas poezive të 100 poetëve botërorë në ekspozitën ndërkombëtare poetike “Shi Xu” në Shangai.',
    body: [],
    isExternal: true,
    externalUrl:
      'https://atvlive.tv/poeti-lulzim-tafa-pjese-e-ekspozites-nderkombetare-poetike-shi-xu-ne-shangai-te-kines/',
    sourceUrl:
      'https://atvlive.tv/poeti-lulzim-tafa-pjese-e-ekspozites-nderkombetare-poetike-shi-xu-ne-shangai-te-kines/',
    galleryImages: [],
    featured: false,
  },
  {
    id: 101146,
    slug: 'atv-poeti-lulzim-tafa-promovon-librin-ekspozite-me-endrra',
    title: 'Poeti Lulzim Tafa promovon librin ‘Ekspozitë me Ëndrra’',
    category: 'News',
    date: '2024-11-16',
    image: '/assets/news/atv-101146-ekspozite-me-endrra.jpg',
    excerpt:
      'Poeti Lulzim Tafa promovoi librin e tij më të ri “Ekspozitë me Ëndrra”, me poezi të zgjedhura nga vëllimet e mëparshme.',
    body: [],
    isExternal: true,
    externalUrl: 'https://atvlive.tv/poeti-lulzim-tafa-promovon-librin-ekspozite-me-endrra/',
    sourceUrl: 'https://atvlive.tv/poeti-lulzim-tafa-promovon-librin-ekspozite-me-endrra/',
    galleryImages: [],
    featured: false,
  },
  {
    id: 99141,
    slug: 'atv-poetet-e-njohur-lulzim-tafa-dhe-sali-bashota-kane-mbajtur-ore-letrare-me-lexues',
    title: 'Poetët e njohur, Lulzim Tafa dhe Sali Bashota, kanë mbajtur orë letrare me lexues',
    category: 'News',
    date: '2024-10-30',
    image: '/assets/news/atv-99141-lulzim-tafa-sali-bashota.jpg',
    excerpt:
      'Lindja, dashuria dhe vdekja, janë kryetemë gati në çdo vepër të poetit Lulzim Tafa. Për rëndësinë e dashurisë mes fillimit dhe fundit të jetës, Tafa foli edhe para studentëve të Kolegjit AAB.',
    body: [],
    isExternal: true,
    externalUrl: 'https://atvlive.tv/poetet-e-njohur-lulzim-tafa-dhe-sali-bashota-kane-mbajtur-ore-letrare-me-lexues/',
    sourceUrl: 'https://atvlive.tv/poetet-e-njohur-lulzim-tafa-dhe-sali-bashota-kane-mbajtur-ore-letrare-me-lexues/',
    galleryImages: [],
    featured: false,
  },
  {
    id: 101140,
    slug: 'atv-poeti-lulzim-tafa-promovon-librin-e-tij-me-te-ri-ekspozite-me-endrra-ne-panairin-e-librit-ne-tirane',
    title: 'Poeti Lulzim Tafa promovon librin e tij më të ri “Ekspozitë me Ëndrra”, në Panairin e Librit në Tiranë',
    category: 'News',
    date: '2024-11-13',
    image: '/assets/news/atv-101140-ekspozite-me-endrra-tirane.jpg',
    excerpt:
      'Në edicionin e 27-të të Panairit të Librit në Tiranë, u paralajmërua promovimi i librit “Ekspozitë me Ëndrra” të poetit Lulzim Tafa.',
    body: [],
    isExternal: true,
    externalUrl:
      'https://atvlive.tv/poeti-lulzim-tafa-promovon-librin-e-tij-me-te-ri-ekspozite-me-endrra-ne-panairin-e-librit-ne-tirane/',
    sourceUrl:
      'https://atvlive.tv/poeti-lulzim-tafa-promovon-librin-e-tij-me-te-ri-ekspozite-me-endrra-ne-panairin-e-librit-ne-tirane/',
    galleryImages: [],
    featured: false,
  },
  {
    id: 98077,
    slug: 'atv-qyteti-i-pejes-nderon-me-cmim-te-vecante-poetin-lulzim-tafa',
    title: 'Qyteti i Pejës nderon me çmim të veçantë poetin Lulzim Tafa',
    category: 'News',
    date: '2024-10-24',
    image: '/assets/news/atv-98077-qyteti-i-pejes.jpg',
    excerpt:
      'Profesori dhe poeti Lulzim Tafa është nderuar me çmimin letrar “Lirikë me shi” në qytetin poetik të Pejës.',
    body: [],
    isExternal: true,
    externalUrl: 'https://atvlive.tv/qyteti-i-pejes-nderon-me-cmim-te-vecante-poetin-lulzim-tafa/',
    sourceUrl: 'https://atvlive.tv/qyteti-i-pejes-nderon-me-cmim-te-vecante-poetin-lulzim-tafa/',
    galleryImages: [],
    featured: false,
  },
];

export const importedAtvNews = createExternalNewsCollection('atv', atvNewsRecords);

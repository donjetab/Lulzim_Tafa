function youtubeItem(id, title, url, options = {}) {
  const videoId = url.match(/[?&]v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?&]+)/)?.[1];
  return {
    id,
    slug: id,
    type: 'youtube',
    title,
    url,
    thumbnail: options.thumbnail ?? (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''),
    previewFit: options.previewFit,
  };
}

function localItem(slug, title, filename, options = {}) {
  const basePath = import.meta.env.BASE_URL || '/';

  return {
    id: slug,
    slug,
    type: 'local',
    title,
    filename,
    url: `${basePath}assets/video_poetry/${filename}`,
    previewFit: options.previewFit,
    previewTime: options.previewTime,
  };
}

export const videoPoetryItems = [
  youtubeItem('ekspozite-me-andrra-program', 'Lulzim Tafa, "Ekspozite me andrra" - Program', 'https://www.youtube.com/watch?v=kXi7V22vVWg&t=720s'),
  youtubeItem('une-e-ti', 'Lulzim Tafa - Une e ti', 'https://www.youtube.com/watch?v=usU0Yu5OYJk'),
  youtubeItem('idile', 'Lulzim Tafa - Idile', 'https://www.youtube.com/watch?v=qv7_xRjlbbE'),
  youtubeItem('ikja-youtube', 'Lulzim Tafa - Ikja', 'https://www.youtube.com/watch?v=BoBhlfIUdT0'),
  youtubeItem('mosmarreveshje', 'Lulzim Tafa - Mosmarreveshje', 'https://www.youtube.com/watch?v=f8_ooN0ijSo'),
  youtubeItem('kur-ti-me-therret', 'Lulzim Tafa - Kur ti me therret', 'https://www.youtube.com/watch?v=CTWTMKtmQiU'),
  youtubeItem('ashensori', 'Lulzim Tafa - Ashensori', 'https://www.youtube.com/watch?v=xdNGXPGYRrw'),
  youtubeItem('lufta', 'Lulzim Tafa - Lufta', 'https://www.youtube.com/watch?v=zQ6BP9oQMFU'),
  youtubeItem('te-dua-ma-shume-se-paulinen', 'Lulzim Tafa - Te dua ma shume se Paulinen', 'https://www.youtube.com/watch?v=H9HZzTqji8Q'),
  youtubeItem('ajkuna', 'Lulzim Tafa - Ajkuna', 'https://www.youtube.com/watch?v=LJd9ye1QG8A'),
  youtubeItem('piromane', 'Lulzim Tafa - Piromane', 'https://www.youtube.com/watch?v=aXV5dGx0F_g'),
  youtubeItem('konstatim', 'Lulzim Tafa - Konstatim', 'https://www.youtube.com/watch?v=5wdElF2Rqyo'),
  localItem('bisede-me-hije', '"Bisede me hije" - Lulzim Tafa', 'bisede-me-hije.mp4'),
  youtubeItem('neser-shi-do-bjere', 'Lulzim Tafa - Neser shi do bjere', 'https://www.youtube.com/watch?v=X9IJjjNdVVk'),
  youtubeItem('ata-me-thane-ik-e-une-ika-youtube', 'Lulzim Tafa - Ata me thane ik e une ika', 'https://www.youtube.com/watch?v=DvoHgcNXV4g'),
  youtubeItem('hana', 'Lulzim Tafa - Hana', 'https://www.youtube.com/watch?v=my_2wPuQ3YU'),
  youtubeItem('heronjte-dhe-kurvat', 'Lulzim Tafa - Heronjte dhe kurvat', 'https://www.youtube.com/watch?v=ZPnjSiV1l6o'),
  youtubeItem('tri-pyetjet', 'Lulzim Tafa - Tri pyetjet', 'https://www.youtube.com/watch?v=vAPZIoRCuRw'),
  youtubeItem('dije', 'Lulzim Tafa - Dije', 'https://www.youtube.com/watch?v=MreSoLAy1Fs'),
  youtubeItem('i-kam-edhe-dy-fjale', 'Lulzim Tafa - I kam edhe dy fjale', 'https://www.youtube.com/watch?v=uHyvxwt3hUc'),
  youtubeItem('definitive', 'Lulzim Tafa - Definitive', 'https://www.youtube.com/watch?v=foCwVKW93k4'),
  youtubeItem('lisat-flejne-ne-kembe', 'Lulzim Tafa - Lisat flejne ne kembe', 'https://www.youtube.com/watch?v=tybQ5YJMXdg'),
  youtubeItem('arbor-vitae', 'Lulzim Tafa - Arbor Vitae', 'https://www.youtube.com/watch?v=iQ37TTZJ2_A'),
  localItem('lulzim-tafa-dhe-luiza-tafa-2025', 'Lulzim Tafa & Luiza Tafa - Gezuar Vitin e Ri 2025', 'lulzim-tafa-dhe-luiza-tafa-2025.mp4'),
  localItem('purgator', '"Purgator" - Lulzim Tafa', 'Purgator.mp4'),
  localItem('ata-me-thane-ik-e-une-ika', '"Ata me thane ik e une ika" - Lulzim Tafa', 'Ata më thanë ik e unë ika.mp4'),
  localItem('bisede-me-gure', '"Bisede me gure" - Vedat Haxhiislami', 'Bisedë me gurë.mov'),
  localItem('bisede-me-qiellin', '"Bisede me qiellin" - Avni Dalipi', 'Bisedë me qiellin.mov'),
  localItem('bisede-me-detin', '"Bisede me detin" - Labinot Lajci', 'Bisedë me detin.mov'),
  localItem('anderr', '"Anderr" - Valmir Krasniqi', 'Andërr.mp4'),
  localItem('sa-shpejt-me-harroi-nana', '"Sa shpejt me harroi nana" - Zyhrije Vata', 'Sa shpejt më harroi nana.mp4'),
  youtubeItem('sa-shpejt-me-harroi-nana-jurgen-palnikaj', '"SA SHPEJT ME HARROI NANA" - Jurgen Palnikaj', 'https://www.youtube.com/watch?v=X3vzk8gxRSs'),
  localItem('andrra-bill-wolak', 'Bill Wolak duke e recituar poezine "Andrra"', 'Andrra - bill wolak.mp4'),
  localItem('sa-shpejt-me-harroi-nana-petrit-malaj', '"SA SHPEJT ME HARROI NANA" - Petrit Malaj', 'Sa shpejt më harroi nana - petrit malaj.mp4'),
  localItem('tu-e-kerkue-veten', '"Tu e kerkue veten" - Lulzim Tafa', 'Tu e kerkue veten.mp4'),
];

import { useEffect, useMemo, useRef, useState } from 'react';
import { cms, fallbackData, resolveMediaUrl, useCmsData } from '../data/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const galleryAssetModules = import.meta.glob('../assets/gallery/*', { eager: true, query: '?url', import: 'default' });
const GALLERY_BATCH_SIZE = 18;
const galleryCardRatios = ['1 / 1.18', '1 / 0.78', '1 / 1.42', '1 / 1', '1 / 1.28', '1 / 0.86'];

function getCaption(index) {
  return `Gallery image ${index + 1}`;
}

function resolveGalleryImage(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path) || path.startsWith('/uploads/')) return resolveMediaUrl(path);
  const filename = path.split('/').pop();
  return Object.entries(galleryAssetModules).find(([assetPath]) => assetPath.endsWith(`/${filename}`))?.[1] ?? resolveMediaUrl(path);
}

function getGalleryCardRatio(index) {
  return galleryCardRatios[index % galleryCardRatios.length];
}

export default function Gallery() {
  const { language } = useLanguage();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(GALLERY_BATCH_SIZE);
  const touchStart = useRef(null);
  const localGalleryImages = useMemo(
    () => Object.entries(galleryAssetModules)
      .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
      .map(([assetPath, src], index) => ({
        id: assetPath,
        src,
        caption: getCaption(index),
      })),
    [],
  );
  const { data: cmsGalleryImages } = useCmsData(() => cms.getGallery(language), fallbackData.galleryImages, [language]);
  const galleryImages = useMemo(
    () => (cmsGalleryImages.length ? cmsGalleryImages : localGalleryImages)
      .map((image, index) => ({
        ...image,
        src: resolveGalleryImage(image.src || image.image) || localGalleryImages[index]?.src || '',
        caption: image.caption || getCaption(index),
      })),
    [cmsGalleryImages, localGalleryImages],
  );
  const visibleGalleryImages = galleryImages.slice(0, visibleCount);
  const activeGalleryImage = activeGalleryIndex === null ? null : visibleGalleryImages[activeGalleryIndex];
  const hasMoreImages = visibleCount < galleryImages.length;

  function moveGalleryPreview(direction) {
    setActiveGalleryIndex((currentIndex) => {
      if (currentIndex === null) return 0;

      const nextIndex = currentIndex + direction;
      if (nextIndex < 0) return visibleGalleryImages.length - 1;
      if (nextIndex >= visibleGalleryImages.length) return 0;
      return nextIndex;
    });
  }

  function closeGalleryPreview() {
    setActiveGalleryIndex(null);
  }

  function handleTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    moveGalleryPreview(deltaX > 0 ? -1 : 1);
  }

  useEffect(() => {
    if (activeGalleryIndex === null) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveGalleryPreview(-1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveGalleryPreview(1);
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeGalleryPreview();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGalleryIndex, visibleGalleryImages.length]);

  return (
    <main className="gallery-page">
      <section className="gallery-page-hero">
        <p className="eyebrow">Gallery</p>
        <h1>Moments from Public and Literary Life</h1>
        <span className="gold-rule" />
        <p>Photographs from readings, ceremonies, meetings, and cultural appearances.</p>
      </section>

      <section className="gallery-page-section" aria-label="Gallery images">
        <div className="gallery-masonry">
          {visibleGalleryImages.map((image, index) => (
            <button
              className="gallery-masonry-card"
              type="button"
              onClick={() => setActiveGalleryIndex(index)}
              key={image.id}
              aria-label={`Preview ${image.caption}`}
              style={{ '--gallery-card-ratio': getGalleryCardRatio(index) }}
            >
              <img src={image.src} alt={image.caption} loading="lazy" decoding="async" fetchPriority={index < 6 ? 'auto' : 'low'} />
              {image.caption ? <span>{image.caption}</span> : null}
            </button>
          ))}
        </div>

        {hasMoreImages && (
          <div className="gallery-load-more">
            <p>{visibleGalleryImages.length} of {galleryImages.length} images shown</p>
            <button type="button" onClick={() => setVisibleCount((count) => count + GALLERY_BATCH_SIZE)}>
              Load more
            </button>
          </div>
        )}
      </section>

      {activeGalleryImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={activeGalleryImage.caption}>
          <button className="gallery-lightbox-backdrop" type="button" onClick={closeGalleryPreview} aria-label="Close gallery preview" />
          <div className="gallery-lightbox-panel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <button className="gallery-lightbox-close" type="button" onClick={closeGalleryPreview} aria-label="Close gallery preview">x</button>
            <button className="gallery-lightbox-nav gallery-lightbox-prev" type="button" onClick={() => moveGalleryPreview(-1)} aria-label="Previous image">
              <span aria-hidden="true" />
            </button>
            <img src={activeGalleryImage.src} alt={activeGalleryImage.caption} />
            {activeGalleryImage.caption ? <p className="gallery-lightbox-caption">{activeGalleryImage.caption}</p> : null}
            <button className="gallery-lightbox-nav gallery-lightbox-next" type="button" onClick={() => moveGalleryPreview(1)} aria-label="Next image">
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

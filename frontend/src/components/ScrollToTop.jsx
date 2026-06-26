import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({
          block: hash.startsWith('#testimonial-') ? 'center' : 'start',
        });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
}

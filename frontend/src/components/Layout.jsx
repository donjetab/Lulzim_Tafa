import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import headerLogo from '../assets/logo/logo-landscape-white_gold.png';
import { siteSettings } from '../data/content.js';

const navItems = [
  ['Home', '/'],
  ['About', '/about', [
    ['Biography', '/about#biography'],
    ['Others About LT', '/about#testimonials'],
    ['Gallery', '/gallery'],
  ]],
  ['Books', '/books'],
  ['Poetry', '/poetry', [
    ['Written Poetry', '/poetry'],
    ['Video Poetry', '/poetry/video'],
  ]],
  ['Poetry House', '/poetry-house'],
  ['News & Interviews', '/news'],
  ['Gallery', '/gallery'],
  ['Awards', '/awards'],
];

const footerNavigation = [
  ['Home', '/'],
  ['About', '/about'],
  ['Interviews', '/news'],
  ['News', '/news'],
  ['Gallery', '/gallery'],
];

const footerWork = [
  ['Books', '/books'],
  ['Poetry', '/poetry'],
  ['Poetry House', '/poetry-house'],
  ['Awards', '/awards'],
];

const revealSelectors = [
  '.about-life-section',
  '.about-gallery-section',
  '.testimonial-section',
  '.section-heading',
  '.books-list-section',
  '.book-card',
  '.shelf-book',
  '.poetry-view-tabs',
  '.poetry-language-filter',
  '.poetry-paper-card',
  '.poetry-paper-card-wide',
  '.poetry-house-feature',
  '.poetry-house-gallery-section',
  '.poetry-house-carousel',
  '.poetry-house-news',
  '.news-filter',
  '.news-card',
  '.news-pagination',
  '.news-detail',
  '.news-detail-image',
  '.news-detail-body',
  '.news-sources',
  '.news-source-card',
  '.news-gallery button',
  '.gallery-masonry-card',
  '.gallery-load-more',
  '.award-card',
  '.award-detail-copy',
  '.award-detail-image',
  '.testimonial-full-card',
  '.testimonials-toolbar',
  '.contact-layout',
].join(',');

function SocialIcon({ type }) {
  const icons = {
    website: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17" />
        <path d="M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z" />
      </>
    ),
    facebook: <path d="M14 8h2V5h-2.5C10.9 5 10 6.6 10 8.6V11H8v3h2v5h3v-5h2.3l.7-3h-3V8.9c0-.6.3-.9 1-.9Z" />,
    instagram: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="16.5" cy="7.5" r="0.7" />
      </>
    ),
    linkedin: (
      <>
        <path d="M7 10h3v8H7z" />
        <path d="M8.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        <path d="M12 10h2.8v1.1c0.5-0.8 1.3-1.3 2.5-1.3 2 0 3.2 1.3 3.2 3.7V18h-3v-4c0-1.1-0.5-1.7-1.4-1.7s-1.5 0.6-1.5 1.7v4H12z" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      {icons[type] ?? icons.website}
    </svg>
  );
}

export default function Layout() {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isVideoPoetry = location.pathname === '/poetry/video' || (location.pathname === '/poetry' && location.search === '?view=video');
  const isWrittenPoetry = location.pathname === '/poetry' && !isVideoPoetry;

  useEffect(() => {
    const main = document.querySelector('.site-shell > main');
    if (!main) return undefined;

    const elements = [...main.querySelectorAll(revealSelectors)].filter((element, index, list) => (
      !element.closest('[data-home-animate]')
      && !element.closest('.gallery-lightbox')
      && !element.closest('.news-photo-preview')
      && list.findIndex((candidate) => candidate === element) === index
    ));

    if (!elements.length) return undefined;

    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal-item');
      element.style.setProperty('--reveal-index', index % 6);
    });

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12,
    });

    const frame = window.requestAnimationFrame(() => {
      elements.forEach((element) => observer.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      elements.forEach((element) => {
        element.classList.remove('scroll-reveal-item', 'is-revealed');
        element.style.removeProperty('--reveal-index');
      });
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
  }, [location.pathname, location.search, location.hash]);

  function getSubmenuClass(itemTo) {
    if (itemTo === '/poetry') return isWrittenPoetry ? 'active' : undefined;
    if (itemTo === '/poetry/video') return isVideoPoetry ? 'active' : undefined;
    if (itemTo === '/about#biography') {
      return location.pathname === '/about' && location.hash === '#biography' ? 'active' : undefined;
    }
    if (itemTo === '/about#testimonials') {
      return location.pathname === '/about' && location.hash === '#testimonials' ? 'active' : undefined;
    }
    if (itemTo === '/gallery') return location.pathname === '/gallery' ? 'active' : undefined;
    return undefined;
  }

  function closeSubmenu() {
    setOpenSubmenu(null);
    document.activeElement?.blur?.();
  }

  function closeNavigation() {
    setOpenSubmenu(null);
    setMobileMenuOpen(false);
    document.activeElement?.blur?.();
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="Lulzim Tafa home">
          <img src={headerLogo} alt="Lulzim Tafa" />
        </NavLink>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true" />
        </button>
        <nav id="main-navigation" className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {navItems.map(([label, to, submenu]) => (
            submenu ? (
              <div
                className={openSubmenu === to ? 'nav-item-with-submenu nav-submenu-open' : 'nav-item-with-submenu'}
                key={to}
                onMouseEnter={() => setOpenSubmenu(to)}
                onMouseLeave={() => setOpenSubmenu(null)}
                onFocus={() => setOpenSubmenu(to)}
              >
                <NavLink to={to} onClick={closeNavigation}>
                  {label}
                </NavLink>
                <div className="nav-submenu" aria-label={`${label} sections`}>
                  {submenu.map(([submenuLabel, submenuTo]) => (
                    <NavLink className={() => getSubmenuClass(submenuTo)} to={submenuTo} end={submenuTo === '/poetry'} onClick={closeNavigation} key={submenuTo}>
                      {submenuLabel}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink key={to} to={to} end={to === '/'} onClick={closeNavigation}>
                {label}
              </NavLink>
            )
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <img src={headerLogo} alt="Lulzim Tafa" />
          <small>A homepage designed to reflect books, scholarship, and an unmistakably academic public profile.</small>
        </div>
        <nav aria-label="Footer navigation">
          <h3>Navigation</h3>
          {footerNavigation.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <nav aria-label="Work links">
          <h3>Work</h3>
          {footerWork.map(([label, to]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        {/* <div className="footer-contact">
          <h3>Contact</h3>
          <p>{siteSettings.contactEmail}</p>
        </div> */}
        <div className="footer-contact">
          <h3>Stay in Touch</h3>
          <div className="footer-socials">
            {siteSettings.socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">
                  <SocialIcon type={link.icon} />
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="footer-credit">© 2026 LULZIM TAFA — Administered by Ardian Sallauka</p>
      </footer>
      <button className="back-to-top" type="button" aria-label="Back to top" onClick={scrollToTop}>
        <span aria-hidden="true" />
      </button>
    </div>
  );
}

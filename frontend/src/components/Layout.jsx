import { NavLink, Outlet } from 'react-router-dom';
import { siteSettings } from '../data/content.js';

const navItems = [
  ['Home', '/'],
  ['About', '/about'],
  ['Books', '/books'],
  ['Poetry', '/poetry'],
  ['News & Interviews', '/news'],
  ['Awards', '/awards'],
];

const footerNavigation = [
  ['Home', '/'],
  ['About', '/about'],
  ['Interviews', '/news'],
  ['News', '/news'],
];

const footerWork = [
  ['Books', '/books'],
  ['Poetry', '/poetry'],
  ['Awards', '/awards'],
];

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
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="Lulzim Tafa home">
          
          <span>{siteSettings.logo}</span>
          <small>{siteSettings.subtitle}</small>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <h2>{siteSettings.logo}</h2>
          <p>{siteSettings.subtitle}</p>
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
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>{siteSettings.contactEmail}</p>
          <p>{siteSettings.location}</p>
          <p>Request an appearance</p>
        </div>
        <div className="footer-contact">
          <h3>Stay in Touch</h3>
          <div className="footer-socials">
            {siteSettings.socialLinks.map((link) => (
              <a key={link.id} href={link.url}>
                <span aria-hidden="true">
                  <SocialIcon type={link.icon} />
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="footer-credit">© 2026 LULZIM TAFA — Administered by Ardian Salinuka</p>
      </footer>
    </div>
  );
}

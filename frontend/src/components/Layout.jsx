import { NavLink, Outlet } from 'react-router-dom';
import { siteSettings } from '../data/content.js';

const navItems = [
  ['Home', '/'],
  ['About', '/about'],
  ['Books', '/books'],
  ['Poetry', '/poetry'],
  ['News & Interviews', '/news'],
  ['Awards', '/awards'],
  ['Contact', '/contact'],
];

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
        <div>
          <h2>{siteSettings.logo}</h2>
          <p>{siteSettings.subtitle}</p>
        </div>
        <nav aria-label="Footer navigation">
          {navItems.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="footer-contact">
          <p>{siteSettings.contactEmail}</p>
          <p>{siteSettings.location}</p>
          <div>
            {siteSettings.socialLinks.map((link) => (
              <a key={link.id} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

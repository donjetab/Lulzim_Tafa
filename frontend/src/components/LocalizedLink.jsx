import { Link as RouterLink, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { getLanguageFromPath, localizePublicPath } from '../i18n/localizedRoutes.js';

function localizeDestination(to, language) {
  if (typeof to !== 'string' || !to.startsWith('/') || to.startsWith('/admin')) return to;
  return localizePublicPath(to, language);
}

export function Link({ to, ...props }) {
  const location = useLocation();
  const language = getLanguageFromPath(location.pathname) ?? 'en';
  return <RouterLink to={localizeDestination(to, language)} {...props} />;
}

export function NavLink({ to, ...props }) {
  const location = useLocation();
  const language = getLanguageFromPath(location.pathname) ?? 'en';
  return <RouterNavLink to={localizeDestination(to, language)} {...props} />;
}

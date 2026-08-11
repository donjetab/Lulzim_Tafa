const albanianRoutes = [
  ['/poetry/video', '/poezi/video'],
  ['/poetry-house', '/shtepia-e-poezise'],
  ['/testimonials', '/vleresime'],
  ['/gallery', '/galeria'],
  ['/awards', '/cmimet'],
  ['/poetry', '/poezi'],
  ['/books', '/librat'],
  ['/about', '/rreth'],
  ['/news', '/lajme'],
];

function replaceRoutePrefix(pathname, routes, targetIndex) {
  const match = routes.find(([english, albanian]) => {
    const source = targetIndex === 1 ? english : albanian;
    return pathname === source || pathname.startsWith(`${source}/`);
  });
  if (!match) return pathname;
  const source = targetIndex === 1 ? match[0] : match[1];
  return `${match[targetIndex]}${pathname.slice(source.length)}`;
}

export function getLanguageFromPath(pathname) {
  return pathname.match(/^\/(en|sq)(?:\/|$)/)?.[1] ?? null;
}

export function stripLanguagePrefix(pathname) {
  return pathname.replace(/^\/(en|sq)(?=\/|$)/, '') || '/';
}

export function normalizePublicPath(pathname, language) {
  const unprefixed = stripLanguagePrefix(pathname);
  return language === 'sq' ? replaceRoutePrefix(unprefixed, albanianRoutes, 0) : unprefixed;
}

export function localizePublicPath(pathname, language) {
  const normalized = normalizePublicPath(pathname, getLanguageFromPath(pathname) ?? language);
  const translated = language === 'sq' ? replaceRoutePrefix(normalized, albanianRoutes, 1) : normalized;
  return `/${language}${translated === '/' ? '' : translated}`;
}

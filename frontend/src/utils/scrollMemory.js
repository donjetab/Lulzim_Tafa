const SCROLL_PREFIX = 'list-scroll:';
const STATE_PREFIX = 'list-state:';

function getStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getListMemoryKey(name, location) {
  return `${name}:${location.pathname}${location.search}`;
}

export function rememberListScroll(key) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(`${SCROLL_PREFIX}${key}`, String(window.scrollY));
}

export function restoreListScroll(key) {
  const storage = getStorage();
  if (!storage) return false;

  const value = storage.getItem(`${SCROLL_PREFIX}${key}`);
  if (value === null) return false;

  const top = Number(value);
  if (!Number.isFinite(top)) return false;

  storage.removeItem(`${SCROLL_PREFIX}${key}`);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top, left: 0, behavior: 'auto' });
    });
  });

  return true;
}

export function rememberListState(key, state) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(`${STATE_PREFIX}${key}`, JSON.stringify(state));
}

export function readListState(key) {
  const storage = getStorage();
  if (!storage) return null;

  const value = storage.getItem(`${STATE_PREFIX}${key}`);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

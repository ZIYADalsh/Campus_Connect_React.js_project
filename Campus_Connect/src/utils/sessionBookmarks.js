const KEY = "cc_session_bookmarks_v1";

export function getBookmarks() {
  try {
    const raw = sessionStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function saveBookmarks(set) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function toggleBookmark(id) {
  const set = getBookmarks();
  if (set.has(id)) set.delete(id);
  else set.add(id);
  saveBookmarks(set);
  return set;
}

export function isBookmarked(id) {
  return getBookmarks().has(id);
}

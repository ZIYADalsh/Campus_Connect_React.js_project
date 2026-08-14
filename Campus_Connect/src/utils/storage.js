const KEY = "cc_bookmarks_v1";
export function getBookmarks() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); }
  catch { return new Set(); }
}
export function toggleBookmark(id) {
  const set = getBookmarks();
  set.has(id) ? set.delete(id) : set.add(id);
  localStorage.setItem(KEY, JSON.stringify([...set]));
  return set;
}
export function isBookmarked(id) {
  return getBookmarks().has(id);
}

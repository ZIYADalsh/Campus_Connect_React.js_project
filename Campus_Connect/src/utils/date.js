export function isUpcoming(iso) {
  return new Date(iso).getTime() >= Date.now();
}
export function formatRange(startIso, endIso) {
  const s = new Date(startIso), e = new Date(endIso || startIso);
  const opts = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
  return `${s.toLocaleString(undefined, opts)} – ${e.toLocaleString(undefined, opts)}`;
}

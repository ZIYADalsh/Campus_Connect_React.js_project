export function filterEvents(list, { q = "", category = "All", department = "All", scope = "All" }) {
  const qn = q.trim().toLowerCase();
  return list.filter(ev => {
    const matchQ = !qn || ev.title.toLowerCase().includes(qn) || ev.description.toLowerCase().includes(qn);
    const matchCat = category === "All" || ev.category === category;
    const matchDept = department === "All" || ev.department === department;
    const now = Date.now();
    const start = new Date(ev.date).getTime();
    const matchScope =
      scope === "All" ? true :
      scope === "Upcoming" ? start >= now :
      scope === "Past" ? start < now : true;
    return matchQ && matchCat && matchDept && matchScope;
  });
}

export function sortEvents(list, sortBy = "DateAsc") {
  const arr = [...list];
  if (sortBy === "DateAsc") arr.sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (sortBy === "DateDesc") arr.sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (sortBy === "TitleAsc") arr.sort((a,b)=>a.title.localeCompare(b.title));
  if (sortBy === "TitleDesc") arr.sort((a,b)=>b.title.localeCompare(a.title));
  if (sortBy === "CategoryAsc") arr.sort((a,b)=>a.category.localeCompare(b.category));
  return arr;
}

export function uniqueValues(list, key) {
  return ["All", ...Array.from(new Set(list.map(x => x[key]).filter(Boolean)))];
}

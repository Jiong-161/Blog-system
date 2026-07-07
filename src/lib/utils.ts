export function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + " 年 " + month + " 月 " + day + " 日";
}

export function formatDateShort(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export function truncate(text: string, length: number = 120): string {
  if (text.length <= length) return text;
  return text.slice(0, length).replace(/\s+\S*$/, "") + "\u2026";
}

export function getCategories(
  posts: { data: { category: string } }[],
): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    const cat = post.data.category;
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function groupByYear(
  posts: { data: { pubDate: Date; title: string; category: string; tags?: string[] }; id: string }[],
): { year: number; posts: typeof posts }[] {
  const map = new Map<number, typeof posts>();
  for (const post of posts) {
    const year = new Date(post.data.pubDate).getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(post);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }));
}


export function groupByMonth(
  posts: { data: { pubDate: Date; title: string; category: string; tags?: string[] }; id: string }[],
): { month: number; monthName: string; posts: typeof posts }[] {
  const map = new Map<number, typeof posts>();
  const monthNames = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  for (const post of posts) {
    const month = new Date(post.data.pubDate).getMonth() + 1;
    if (!map.has(month)) map.set(month, []);
    map.get(month)!.push(post);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([month, posts]) => ({ month, monthName: monthNames[month], posts }));
}

export function getAllTags(
  posts: { data: { tags?: string[] } }[],
): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

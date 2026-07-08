// ===== Category System - Single Source of Truth =====
// Add new categories here; all pages and the schema derive from this list.

export interface CategoryDef {
  name: string;
  /** Tailwind classes for badges/labels (bg + text) */
  classes: string;
  /** CSS color value for bar charts (stats page) */
  barColor: string;
}
// name — 分类名称，markdown 里用这个值
// classes — Tailwind 颜色类，bg- 背景 + text- 文字颜色
// barColor — 统计页图表的颜色值（CSS color）
export const CATEGORIES: CategoryDef[] = [
  { name: "前端", classes: "bg-accent-green/15 text-accent-green", barColor: "var(--color-accent-green)" },
  { name: "java", classes: "bg-primary/15 text-primary",         barColor: "var(--color-primary)" },
  { name: "python",       classes: "bg-accent-pink/15 text-accent-pink",  barColor: "var(--color-accent-pink)" },
  { name: "随笔",         classes: "bg-amber-200/30 text-amber-700",       barColor: "#d90642" },
  { name: "开源",         classes: "bg-indigo-200/30 text-indigo-600",      barColor: "#6366f1" },
  { name: "AI", classes: "bg-sky-200/30 text-sky-700", barColor: "#0ea5e9" },
  { name: "其他", classes: "bg-sky-200/30 text-sky-700", barColor: "#1ddecad2" },
  { name: "开发工具",         classes: "bg-amber-200/30 text-amber-700",       barColor: "#d90642" },
];

export type CategoryName = (typeof CATEGORIES)[number]["name"];

/** Get combined Tailwind classes (bg + text) for a category badge */
export function getCategoryClasses(name: string): string {
  const cat = CATEGORIES.find((c) => c.name === name);
  return cat ? cat.classes : "bg-primary/10 text-primary";
}

/** Get CSS color value for bar charts */
export function getCategoryBarColor(name: string): string {
  const cat = CATEGORIES.find((c) => c.name === name);
  return cat ? cat.barColor : "var(--color-primary)";
}

/** Check if a category name is in the allowed list */
export function isValidCategory(name: string): name is CategoryName {
  return CATEGORIES.some((c) => c.name === name);
}

/** Get only the text color class for a category (used in BlogCard inline badge) */
export function getCategoryTextClass(name: string): string {
  const cat = CATEGORIES.find((c) => c.name === name);
  return cat ? cat.classes.split(' ').filter((s) => s.startsWith('text-')).join(' ') : 'text-primary';
}


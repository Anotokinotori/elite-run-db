export const LIBRARY_HERO_IMAGE_URL = "https://cdn.asoworld.com/img/865f059851cb4fb0a1584a711a8bd338.jpg";

export const LIBRARY_COLORS = {
  pageBackground: "#f2f3f5",
} as const;

export const LIBRARY_LABELS = {
  heroAriaLabel: "記録図書館のヒーロービジュアル",
  searchBadge: "SEARCH",
  searchTitle: "条件から記録を探す",
  searchSummaryFallback: "FILTER ENTRANCE",
} as const;

export const LIBRARY_FILTER_PANELS = [
  { key: "character", label: "キャラ・編成", icon: "character" },
  { key: "build", label: "凸・武器", icon: "weapon" },
  { key: "category", label: "カテゴリ・期間", icon: "calendar" },
  { key: "tag", label: "タグ", icon: "tag" },
  { key: "search", label: "検索", icon: "search" },
] as const;

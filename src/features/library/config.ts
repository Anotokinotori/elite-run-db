export const LIBRARY_HERO_IMAGE_URL = "https://cdn.asoworld.com/img/865f059851cb4fb0a1584a711a8bd338.jpg";

export const LIBRARY_COLORS = {
  pageBackground: "#EDECEC",
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

export const LIBRARY_RECORD_CARD_VISIBLE_TAG_LIMIT = 4;
export const LIBRARY_RECORD_CARD_ACTION_ICON_CLASS = "h-[11px] w-[11px]";

export const LIBRARY_RECORD_CARD_LABELS = {
  compareAdded: "追加済み",
  compareLimited: "2件まで",
  compareAvailable: "比較に追加",
  watchSaved: "保存済み",
  watchIdle: "あとで見る",
  detailAriaLabel: (title: string) => `${title} の詳細を見る`,
} as const;

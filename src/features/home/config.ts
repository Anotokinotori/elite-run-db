import { characterDb, type Bracket } from "../../data/mockRuns";
import type { ActiveFilterChipDefinition, ElementFilterOption, FilterTabOption, SelectionTargetOption, TagGroup } from "./types";

export const HERO_IMAGE_URL = "https://pbs.twimg.com/media/G6QnKhYWMAAtYMl.jpg";
export const FESTIVAL_RULESET = "祭典";
export const HOME_SEASONS = ["Luna3", "Luna2", "Luna1", "5.8", "5.7", "5.6", "5.5", "5.4", "5.3", "5.2", "5.1", "5.0"];
export const PRIMARY_RULESET_TABS = ["NPUI", "PUI", "PUA"] as const;
export const OTHER_RULESET_LABEL = "その他";
export const OTHER_RULESET_LABELS = ["Npui-Alt", "Weapon-Alt", "Multi-PUI", "Multi-UI", "Multi-UA"];

export const HOME_LABELS = {
  appTitle: "精鋭狩りDB",
  submitLabel: "記録提出",
  filterTitle: "絞り込み",
  filterResetLabel: "リセット",
  filterApplyLabel: "適用する",
  loadingLabel: "集計中...",
  viewRankingLabel: "ランキングを見る",
  engageRecordLabel: "いいね・コメントする",
  topPlayersLabel: "TOPプレイヤー",
  featuredPlayersLabel: "注目プレイヤー",
  leaderboardLabel: "リーダーボード",
  allLabel: "全て",
  firstPostLabel: "初投稿",
  offmetaPickupLabel: "開拓者",
  noResultsLabel: "記録が見つかりません",
  noResultsCopy: "条件を変更するか、新しい記録の追加をお待ちください。",
  characterSearchPlaceholder: "キャラ名で検索",
  tagSearchPlaceholder: "タグ名で検索",
  emptyCharacterResultLabel: "該当するキャラがありません",
  emptyTagResultLabel: "該当するタグがありません",
} as const;

export const HOME_FILTER_TABS: FilterTabOption[] = [
  { key: "partyCharacters", label: "編成キャラ" },
  { key: "mainAttackers", label: "メインアタッカー" },
  { key: "tags", label: "#タグ" },
];

export const HOME_FILTER_TARGET_OPTIONS: SelectionTargetOption[] = [
  { key: "include", label: "含める" },
  { key: "exclude", label: "除外する" },
];

export const HOME_ELEMENT_FILTER_OPTIONS: ElementFilterOption[] = [
  { key: "pyro", label: "炎" },
  { key: "hydro", label: "水" },
  { key: "anemo", label: "風" },
  { key: "electro", label: "雷" },
  { key: "cryo", label: "氷" },
  { key: "geo", label: "岩" },
  { key: "dendro", label: "草" },
];

export const HOME_FILTER_TAG_GROUP_DEFINITIONS: TagGroup[] = [
  { key: "device", label: "デバイス", tags: ["PC", "PS5", "Mobile", "PC+PC"] },
  {
    key: "rule",
    label: "ルール・区分",
    tags: ["高難度", "祭典", "参考用", "Natlan", "Middle", "ミドル帯", "低コスト", "Budget", "New", "OffMeta"],
  },
  { key: "playstyle", label: "編成傾向", tags: ["高速処理", "短期決戦", "安定寄り", "炎共鳴"] },
  { key: "relatedCharacters", label: "関連キャラ", tags: ["Amber", "Citlali", "Dehya", "Furina", "Keqing", "Mavuika", "Sayu", "Xilonen", "Yelan"] },
];

export const HOME_ACTIVE_FILTER_CHIP_DEFINITIONS: ActiveFilterChipDefinition[] = [
  {
    group: "partyCharacters",
    prefix: "編成",
    excludePrefix: "編成除外",
    resolveLabel: (value) => characterDb[value]?.name ?? value,
  },
  {
    group: "mainAttackers",
    prefix: "メイン",
    excludePrefix: "メイン除外",
    resolveLabel: (value) => characterDb[value]?.name ?? value,
  },
  {
    group: "tags",
    prefix: "タグ",
    excludePrefix: "タグ除外",
    resolveLabel: (value) => value,
  },
];

export const HOME_TOP_PLAYER_BRACKETS: Array<{ label: string; bracket: Bracket; theme: { gradient: string } }> = [
  { label: "Unlimited 1st", bracket: 4, theme: { gradient: "from-[#274060] to-[#1b2f45]" } },
  { label: "High 1st", bracket: 3, theme: { gradient: "from-[#2c3e3d] to-[#1e2c2b]" } },
  { label: "Middle 1st", bracket: 2, theme: { gradient: "from-[#3d2a4a] to-[#2b1f35]" } },
  { label: "Low 1st", bracket: 1, theme: { gradient: "from-[#4a3528] to-[#2f231c]" } },
];

export const HOME_LEADERBOARD_VIEW_OPTIONS = [
  { key: "rta", label: "RTAランキング", shortLabel: "RTA" },
  { key: "char", label: "キャラTOPプレイヤー", shortLabel: "キャラTOP" },
  { key: "fes", label: "祭典フェス", shortLabel: "フェス" },
] as const;

export const HOME_BRACKET_FILTER_OPTIONS: Array<{ label: string; shortLabel: string; value: Bracket | null }> = [
  { label: HOME_LABELS.allLabel, shortLabel: HOME_LABELS.allLabel, value: null },
  { label: "Unlimited", shortLabel: "Unl.", value: 4 },
  { label: "High", shortLabel: "High", value: 3 },
  { label: "Middle", shortLabel: "Mid.", value: 2 },
  { label: "Low", shortLabel: "Low", value: 1 },
];

export const HOME_PANEL_CLASSES = {
  sectionPanel: "relative overflow-hidden rounded-[20px] bg-transparent shadow-[0_24px_34px_-30px_rgba(37,44,58,0.30)]",
  sectionPanelInner: "relative z-[1] m-[2px] rounded-[18px] border border-white/80 bg-white text-[#333333] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]",
  featuredPanel: "relative overflow-hidden rounded-[20px] bg-transparent shadow-[0_24px_34px_-30px_rgba(37,44,58,0.30)]",
  featuredPanelInner: "relative z-[1] m-[2px] rounded-[18px] border border-white/80 bg-white text-[#333333] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]",
  sectionTitle: "text-[17px] md:text-[18px] font-bold tracking-[0.01em] text-[#111827]",
  reflectionTop:
    "pointer-events-none absolute inset-x-[18px] top-[1px] h-[22px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(226,235,245,0.30)_44%,rgba(255,255,255,0))] blur-[10px]",
  reflectionCorner:
    "pointer-events-none absolute -left-[10%] -top-[24%] h-44 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72),rgba(226,235,245,0.18)_48%,rgba(255,255,255,0)_72%)] blur-[60px]",
} as const;

export const HOME_BUTTON_CLASSES = {
  icon: "flex h-8 w-8 items-center justify-center rounded-full border border-[#d8dde6] bg-white text-[#333333] transition-colors hover:bg-[#f1f3f6]",
  primary:
    "inline-flex h-10 items-center justify-center rounded-full border border-[#d8dde6] bg-[#f7f8fa] px-4 text-[13px] font-semibold tracking-[0.01em] text-[#333333] transition-colors hover:border-[#c8ced8] hover:bg-[#eef1f5]",
} as const;

export const HOME_LAYOUT_CLASSES = {
  leaderboardFullBleed: "relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#EDECEC]",
  leaderboardInner: "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8",
} as const;

export const HOME_CAROUSEL_CONFIG = {
  topPanelAutoscrollMs: 20000,
  featuredPanelAutoscrollMs: 10000,
  scrollDurationMs: 900,
} as const;

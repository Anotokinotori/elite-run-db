import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { characterDb, mockRuns, type Bracket, type Character, type Element, type Platform, type RunRecord } from "../data/mockRuns";

type RankMove = "up" | "down" | "same" | "new";
type LeaderboardView = "rta" | "char" | "fes";
type DisplayBucketType = "single" | "pair";
type DisplayBucket =
  | { type: "single"; ids: [string]; key: string; label: string }
  | { type: "pair"; ids: [string, string]; key: string; label: string };

type HomeRun = RunRecord & {
  userId: string;
  supportIds: string[];
  support: string[];
  mainAttacker: string;
  isFestival: boolean;
  wepCost: number;
  categoryKey: string;
  rankMove: RankMove;
};
type HomeRunWithBucket = HomeRun & {
  displayBucket: DisplayBucket;
};

type IncludeMode = "and" | "or";
type CharacterFilterTabKey = "partyCharacters" | "mainAttackers";
type FilterTabKey = "partyCharacters" | "mainAttackers" | "tags";
type SelectionTarget = "include" | "exclude";
type SelectionGroupState = {
  includeIds: string[];
  excludeIds: string[];
  includeMode: IncludeMode;
};
type HomeFilterState = {
  partyCharacters: SelectionGroupState;
  mainAttackers: SelectionGroupState;
  tags: SelectionGroupState;
};
type ActiveFilterChip = {
  key: string;
  group: FilterTabKey;
  value: string;
  label: string;
  prefix: string;
  isExclude: boolean;
};
type TagGroup = {
  key: string;
  label: string;
  tags: string[];
};
type CharacterAssistFilters = {
  element: Element | null;
};

const HERO_IMAGE_URL = "https://pbs.twimg.com/media/G6QnKhYWMAAtYMl.jpg";
const SEASONS = ["Luna3", "Luna2", "Luna1", "5.8", "5.7", "5.6", "5.5", "5.4", "5.3", "5.2", "5.1", "5.0"];
const PRIMARY_RULESET_TABS = ["NPUI", "PUI", "PUA"] as const;
const OTHER_RULESET_LABELS = ["Npui-Alt", "Weapon-Alt", "Multi-PUI", "Multi-UI", "Multi-UA"];
const APP_TITLE = "\u7cbe\u92ed\u72e9\u308aDB";
const SUBMIT_LABEL = "\u8a18\u9332\u63d0\u51fa";
const OTHER_TAB_LABEL = "\u305d\u306e\u4ed6";
const FESTIVAL_RULESET = "\u796d\u5178";
const FILTER_TITLE = "\u7d5e\u308a\u8fbc\u307f";
const FILTER_INCLUDE_LABEL = "\u30e1\u30a4\u30f3\u30a2\u30bf\u30c3\u30ab\u30fc (\u542b\u3080)";
const FILTER_EXCLUDE_LABEL = "\u9664\u5916\u30ad\u30e3\u30e9";
const FILTER_PLATFORM_LABEL = "\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0";
const FILTER_RESET_LABEL = "\u30ea\u30bb\u30c3\u30c8";
const FILTER_CANCEL_LABEL = "\u30ad\u30e3\u30f3\u30bb\u30eb";
const FILTER_APPLY_LABEL = "\u9069\u7528\u3059\u308b";
const LOADING_LABEL = "\u96c6\u8a08\u4e2d...";
const VIEW_RANKING_LABEL = "\u30e9\u30f3\u30ad\u30f3\u30b0\u3092\u898b\u308b";
const ENGAGE_RECORD_LABEL = "\u3044\u3044\u306d\u30fb\u30b3\u30e1\u30f3\u30c8\u3059\u308b";
const TOP_PLAYERS_LABEL = "TOP\u30d7\u30ec\u30a4\u30e4\u30fc";
const FEATURED_PLAYERS_LABEL = "\u6ce8\u76ee\u30d7\u30ec\u30a4\u30e4\u30fc";
const LEADERBOARD_LABEL = "\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9";
const ALL_LABEL = "\u5168\u3066";
const FIRST_POST_LABEL = "\u521d\u6295\u7a3f";
const OFFMETA_PICKUP_LABEL = "\u958b\u62d3\u8005";
const TOP_PANEL_AUTOSCROLL_MS = 20000;
const FEATURED_PANEL_AUTOSCROLL_MS = 10000;
const TOP_PANEL_SCROLL_DURATION_MS = 900;
const NO_RESULTS_LABEL = "\u8a18\u9332\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093";
const NO_RESULTS_COPY = "\u6761\u4ef6\u3092\u5909\u66f4\u3059\u308b\u304b\u3001\u65b0\u3057\u3044\u8a18\u9332\u306e\u8ffd\u52a0\u3092\u304a\u5f85\u3061\u304f\u3060\u3055\u3044\u3002";
const OTHER_RULESET_TABS = ["Npui別", "武器別", "マルチPUI", "マルチUI", "マルチUA"];
const FILTER_TABS: Array<{ key: FilterTabKey; label: string }> = [
  { key: "partyCharacters", label: "編成キャラ" },
  { key: "mainAttackers", label: "メインアタッカー" },
  { key: "tags", label: "#タグ" },
];
const FILTER_TARGET_OPTIONS: Array<{ key: SelectionTarget; label: string }> = [
  { key: "include", label: "含める" },
  { key: "exclude", label: "除外する" },
];
const FILTER_INCLUDE_MODE_OPTIONS: Array<{ key: IncludeMode; label: string }> = [
  { key: "or", label: "OR" },
  { key: "and", label: "AND" },
];
const CHARACTER_FILTER_TAB_KEYS = ["partyCharacters", "mainAttackers"] as const;
const ELEMENT_FILTER_OPTIONS: Array<{ key: Element; label: string }> = [
  { key: "pyro", label: "炎" },
  { key: "hydro", label: "水" },
  { key: "anemo", label: "風" },
  { key: "electro", label: "雷" },
  { key: "cryo", label: "氷" },
  { key: "geo", label: "岩" },
  { key: "dendro", label: "草" },
];
const FILTER_TAG_GROUP_DEFINITIONS: TagGroup[] = [
  { key: "device", label: "デバイス", tags: ["PC", "PS5", "Mobile", "PC+PC"] },
  {
    key: "rule",
    label: "ルール・区分",
    tags: ["高難度", "祭典", "参考用", "Natlan", "Middle", "ミドル帯", "低コスト", "Budget", "New", "OffMeta"],
  },
  { key: "playstyle", label: "編成傾向", tags: ["高速処理", "短期決戦", "安定寄り", "炎共鳴"] },
  { key: "relatedCharacters", label: "関連キャラ", tags: ["Amber", "Citlali", "Dehya", "Furina", "Keqing", "Mavuika", "Sayu", "Xilonen", "Yelan"] },
];
const HOME_SECTION_PANEL_CLASS = "relative overflow-hidden rounded-[20px] bg-[#323232] drop-shadow-xl";
const HOME_SECTION_PANEL_INNER_CLASS = "relative z-[1] m-[2px] rounded-[18px] bg-[#282828] text-white/90";
const FEATURED_SECTION_PANEL_CLASS = "relative overflow-hidden rounded-[20px] bg-[#3a3a3a] drop-shadow-xl";
const FEATURED_SECTION_PANEL_INNER_CLASS = "relative z-[1] m-[2px] rounded-[18px] bg-[#2f2f2f] text-white/90";
const HOME_SECTION_TITLE_CLASS = "text-[17px] md:text-[18px] font-bold tracking-[0.01em] text-white";
const HOME_SECTION_REFLECTION_TOP_CLASS =
  "pointer-events-none absolute inset-x-[18px] top-[1px] h-[22px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.05)_42%,rgba(255,255,255,0))] blur-[10px]";
const HOME_SECTION_REFLECTION_CORNER_CLASS =
  "pointer-events-none absolute -left-[10%] -top-[24%] h-44 w-72 rounded-full bg-white/52 blur-[60px]";
const LEADERBOARD_FULL_BLEED_SECTION_CLASS = "relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#212121]";
const LEADERBOARD_FULL_BLEED_INNER_CLASS = "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8";
const HOME_ICON_BUTTON_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-white/78 transition-colors hover:bg-white/[0.14] hover:text-white";
const HOME_PRIMARY_BUTTON_CLASS =
  "inline-flex h-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] px-4 text-[13px] font-semibold tracking-[0.01em] text-white transition-colors hover:bg-white/[0.14]";

const AMBR_NAME_MAP: Record<string, string> = {
  amber: "Ambor",
  bennett: "Bennett",
  chasca: "Chasca",
  chiori: "Chiori",
  citlali: "Citlali",
  collei: "Collei",
  dehya: "Dehya",
  furina: "Furina",
  keqing: "Keqing",
  mav: "Mavuika",
  neuvillette: "Neuvillette",
  sayu: "Sayu",
  wanderer: "Wanderer",
  xianyun: "Xianyun",
  xiangling: "Xiangling",
  xilonen: "Xilonen",
  xingqiu: "Xingqiu",
  yelan: "Yelan",
  zhongli: "Zhongli",
};

const UI_MIRRORS = [
  "https://api.ambr.top/assets/UI/",
  "https://enka.network/ui/",
  "http://file.microgg.cn/ui/",
] as const;

const IMAGE_PATTERNS = {
  portrait: (name: string) => `UI_Gacha_AvatarImg_${name}.png`,
  icon: (name: string) => `UI_AvatarIcon_${name}.png`,
  circle: (name: string) => `UI_AvatarIcon_${name}_Circle.png`,
  side: (name: string) => `UI_AvatarIcon_Side_${name}.png`,
};

const VARIANT_FALLBACKS = {
  circle: ["circle", "icon"],
  side: ["side", "icon"],
  portrait: ["portrait", "icon"],
  icon: ["icon"],
} as const;

const CHAR_NAME_TO_ID = Object.values(characterDb).reduce<Record<string, string>>((accumulator, character) => {
  accumulator[character.id.toLowerCase()] = character.id;
  accumulator[character.name.toLowerCase()] = character.id;
  return accumulator;
}, {});

function createEmptySelectionGroup(): SelectionGroupState {
  return {
    includeIds: [],
    excludeIds: [],
    includeMode: "or",
  };
}

function createEmptyHomeFilterState(): HomeFilterState {
  return {
    partyCharacters: createEmptySelectionGroup(),
    mainAttackers: createEmptySelectionGroup(),
    tags: createEmptySelectionGroup(),
  };
}

function cloneSelectionGroup(group: SelectionGroupState): SelectionGroupState {
  return {
    includeIds: [...group.includeIds],
    excludeIds: [...group.excludeIds],
    includeMode: group.includeMode,
  };
}

function cloneHomeFilterState(filters: HomeFilterState): HomeFilterState {
  return {
    partyCharacters: cloneSelectionGroup(filters.partyCharacters),
    mainAttackers: cloneSelectionGroup(filters.mainAttackers),
    tags: cloneSelectionGroup(filters.tags),
  };
}

function updateSelectionGroup(group: SelectionGroupState, target: SelectionTarget, value: string): SelectionGroupState {
  const targetKey = target === "include" ? "includeIds" : "excludeIds";
  const oppositeKey = target === "include" ? "excludeIds" : "includeIds";
  const nextIds = group[targetKey].includes(value)
    ? group[targetKey].filter((currentValue) => currentValue !== value)
    : [...group[targetKey], value];

  return {
    ...group,
    [targetKey]: nextIds,
    [oppositeKey]: group[oppositeKey].filter((currentValue) => currentValue !== value),
  };
}

function removeSelectionGroupValue(group: SelectionGroupState, target: SelectionTarget, value: string): SelectionGroupState {
  const targetKey = target === "include" ? "includeIds" : "excludeIds";

  return {
    ...group,
    [targetKey]: group[targetKey].filter((currentValue) => currentValue !== value),
  };
}

function matchesSelectionGroup(values: string[], groupState: SelectionGroupState) {
  const normalizedValues = Array.from(new Set(values));
  const hasInclude =
    groupState.includeIds.length === 0 ||
    (groupState.includeMode === "and"
      ? groupState.includeIds.every((id) => normalizedValues.includes(id))
      : groupState.includeIds.some((id) => normalizedValues.includes(id)));
  const hasExclude = groupState.excludeIds.some((id) => normalizedValues.includes(id));

  return hasInclude && !hasExclude;
}

function getDeclaredMainAttackerIds(run: Pick<RunRecord, "mainAttackerId" | "declaredMainAttackerIds">) {
  if (run.declaredMainAttackerIds.length > 0) {
    return Array.from(new Set(run.declaredMainAttackerIds));
  }

  return [run.mainAttackerId];
}

function normalizePairIds(leftId: string, rightId: string): [string, string] {
  return [leftId, rightId].sort((left, right) => left.localeCompare(right)) as [string, string];
}

function buildDisplayBucketLabel(ids: string[]) {
  return ids.map((id) => characterDb[id]?.name ?? id).join(" + ");
}

function buildSingleDisplayBucket(characterId: string): DisplayBucket {
  return {
    type: "single",
    ids: [characterId],
    key: `single:${characterId}`,
    label: characterDb[characterId]?.name ?? characterId,
  };
}

function buildPairDisplayBucket(leftId: string, rightId: string): DisplayBucket {
  const [normalizedLeftId, normalizedRightId] = normalizePairIds(leftId, rightId);

  return {
    type: "pair",
    ids: [normalizedLeftId, normalizedRightId],
    key: `pair:${normalizedLeftId}+${normalizedRightId}`,
    label: buildDisplayBucketLabel([normalizedLeftId, normalizedRightId]),
  };
}

function buildDisplayBucket(record: HomeRun, scopeRecords: HomeRun[]): DisplayBucket {
  const declaredMainAttackers = getDeclaredMainAttackerIds(record);

  if (declaredMainAttackers.length >= 2) {
    return buildPairDisplayBucket(declaredMainAttackers[0], declaredMainAttackers[1]);
  }

  const primaryAttackerId = declaredMainAttackers[0] ?? record.mainAttackerId;
  const recordTime = toSeconds(record.time);
  let bestCandidateBucket: DisplayBucket | null = null;
  let bestCandidateFastestTime = Number.POSITIVE_INFINITY;

  Array.from(new Set(record.party.map((member) => member.characterId)))
    .filter((characterId) => characterId !== primaryAttackerId)
    .forEach((candidateId) => {
      const candidateBucket = buildPairDisplayBucket(primaryAttackerId, candidateId);
      const fastestFormalPairTime = scopeRecords.reduce<number | null>((bestTime, scopeRecord) => {
        const scopeDeclaredMainAttackers = getDeclaredMainAttackerIds(scopeRecord);

        if (scopeDeclaredMainAttackers.length !== 2) {
          return bestTime;
        }

        const normalizedDeclaredPair = normalizePairIds(scopeDeclaredMainAttackers[0], scopeDeclaredMainAttackers[1]);
        if (normalizedDeclaredPair[0] !== candidateBucket.ids[0] || normalizedDeclaredPair[1] !== candidateBucket.ids[1]) {
          return bestTime;
        }

        const scopeTime = toSeconds(scopeRecord.time);
        if (scopeTime >= recordTime) {
          return bestTime;
        }

        if (bestTime === null || scopeTime < bestTime) {
          return scopeTime;
        }

        return bestTime;
      }, null);

      if (fastestFormalPairTime === null) {
        return;
      }

      if (
        !bestCandidateBucket ||
        fastestFormalPairTime < bestCandidateFastestTime ||
        (fastestFormalPairTime === bestCandidateFastestTime && candidateBucket.key < bestCandidateBucket.key)
      ) {
        bestCandidateBucket = candidateBucket;
        bestCandidateFastestTime = fastestFormalPairTime;
      }
    });

  if (bestCandidateBucket) {
    return bestCandidateBucket;
  }

  return buildSingleDisplayBucket(primaryAttackerId);
}

function buildCharTopRows(runs: HomeRunWithBucket[]) {
  const bestByBucket = new Map<string, HomeRunWithBucket>();

  runs.forEach((run) => {
    const current = bestByBucket.get(run.displayBucket.key);
    if (!current || isBetterRun(run, current)) {
      bestByBucket.set(run.displayBucket.key, run);
    }
  });

  return Array.from(bestByBucket.values());
}

function normalizeRunFilterTags(run: Pick<HomeRun, "tags" | "platform">) {
  return Array.from(new Set([...run.tags, run.platform]));
}

function getTagGroups(runs: HomeRun[]): TagGroup[] {
  const presentTags = new Set(runs.flatMap((run) => normalizeRunFilterTags(run)));
  const groups = FILTER_TAG_GROUP_DEFINITIONS.map((group) => ({
    ...group,
    tags: group.tags.filter((tag) => presentTags.has(tag)),
  })).filter((group) => group.tags.length > 0);
  const knownTags = new Set(groups.flatMap((group) => group.tags));
  const otherTags = Array.from(presentTags)
    .filter((tag) => !knownTags.has(tag))
    .sort((left, right) => left.localeCompare(right));

  if (otherTags.length > 0) {
    groups.push({
      key: "other",
      label: "その他",
      tags: otherTags,
    });
  }

  return groups;
}

function buildActiveFilterChips(filters: HomeFilterState): ActiveFilterChip[] {
  const chipDefinitions: Array<{ group: FilterTabKey; prefix: string; excludePrefix: string; resolveLabel: (value: string) => string }> = [
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

  return chipDefinitions.flatMap(({ group, prefix, excludePrefix, resolveLabel }) => {
    const selectionGroup = filters[group];

    return [
      ...selectionGroup.includeIds.map((value) => ({
        key: `${group}-include-${value}`,
        group,
        value,
        label: resolveLabel(value),
        prefix,
        isExclude: false,
      })),
      ...selectionGroup.excludeIds.map((value) => ({
        key: `${group}-exclude-${value}`,
        group,
        value,
        label: resolveLabel(value),
        prefix: excludePrefix,
        isExclude: true,
      })),
    ];
  });
}

function toSeconds(timeStr: string) {
  const parts = String(timeStr)
    .trim()
    .split(":")
    .map((part) => Number(part));

  if (parts.some((part) => Number.isNaN(part))) {
    return Number.POSITIVE_INFINITY;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return Number.POSITIVE_INFINITY;
}

function getRunSupportIds(run: RunRecord) {
  const partyIds = run.party.map((member) => member.characterId);
  const supportIds = [...partyIds];
  const mainIndex = supportIds.indexOf(run.mainAttackerId);

  if (mainIndex >= 0) {
    supportIds.splice(mainIndex, 1);
  } else {
    supportIds.shift();
  }

  return supportIds;
}

function makeCategoryKey(run: { userId: string; mainAttackerId: string; bracket: Bracket; season: string; isFestival: boolean }) {
  return [run.userId, run.mainAttackerId, run.bracket, run.season, run.isFestival ? "fes" : "main"].join("|");
}

function normalizeHomeRun(run: RunRecord): HomeRun {
  const supportIds = getRunSupportIds(run);

  return {
    ...run,
    userId: run.userHandle,
    supportIds,
    support: supportIds.map((id) => characterDb[id]?.name ?? id),
    mainAttacker: characterDb[run.mainAttackerId]?.name ?? run.mainAttackerId,
    isFestival: run.ruleset === FESTIVAL_RULESET,
    wepCost: run.weaponCost,
    categoryKey: makeCategoryKey({
      userId: run.userHandle,
      mainAttackerId: run.mainAttackerId,
      bracket: run.bracket,
      season: run.season,
      isFestival: run.ruleset === FESTIVAL_RULESET,
    }),
    rankMove: "same",
  };
}

function isBetterRun(left: HomeRun, right: HomeRun) {
  const timeDiff = toSeconds(left.time) - toSeconds(right.time);

  if (timeDiff !== 0) {
    return timeDiff < 0;
  }

  return new Date(left.date).getTime() > new Date(right.date).getTime();
}

function applyWRTag(runs: HomeRun[]) {
  if (runs.length === 0) {
    return runs;
  }

  let best = runs[0];
  runs.forEach((run) => {
    if (isBetterRun(run, best)) {
      best = run;
    }
  });

  return runs.map((run) => {
    const tags = run.tags.filter((tag) => tag !== "WR");

    if (run.id === best.id) {
      tags.push("WR");
    }

    return {
      ...run,
      tags,
    };
  });
}

function matchesLeaderboardScope(
  run: Pick<HomeRun, "season" | "isFestival" | "bracket">,
  filters: {
    season: string;
    isFestival: boolean | null;
    bracket: Bracket | null;
  },
) {
  if (filters.season && !seasonGte(run.season, filters.season)) {
    return false;
  }

  if (filters.isFestival !== null && run.isFestival !== filters.isFestival) {
    return false;
  }

  if (filters.bracket && run.bracket !== filters.bracket) {
    return false;
  }

  return true;
}

function matchesHomeFilterState(
  run: Pick<HomeRun, "party" | "mainAttackerId" | "declaredMainAttackerIds" | "tags" | "platform">,
  filterState: HomeFilterState,
) {
  if (!matchesSelectionGroup(run.party.map((member) => member.characterId), filterState.partyCharacters)) {
    return false;
  }

  if (!matchesSelectionGroup(getDeclaredMainAttackerIds(run), filterState.mainAttackers)) {
    return false;
  }

  return matchesSelectionGroup(normalizeRunFilterTags(run), filterState.tags);
}

function filterRuns<TRun extends HomeRun>(
  runs: TRun[],
  filters: {
    season: string;
    isFestival: boolean | null;
    bracket: Bracket | null;
    filterState: HomeFilterState;
  },
) {
  return runs.filter((run) => matchesLeaderboardScope(run, filters) && matchesHomeFilterState(run, filters.filterState));
}

function applyRLogic(runs: HomeRun[]) {
  const bestByCategory = new Map<string, HomeRun>();

  runs.forEach((run) => {
    const current = bestByCategory.get(run.categoryKey);
    if (!current || isBetterRun(run, current)) {
      bestByCategory.set(run.categoryKey, run);
    }
  });

  return Array.from(bestByCategory.values());
}

function sortRuns<TRun extends HomeRun>(runs: TRun[], sortMode: "time" | "cost" | "date") {
  return [...runs].sort((left, right) => {
    if (sortMode === "cost") {
      const leftCost = left.charCost + left.wepCost;
      const rightCost = right.charCost + right.wepCost;

      if (leftCost !== rightCost) {
        return leftCost - rightCost;
      }

      return toSeconds(left.time) - toSeconds(right.time);
    }

    if (sortMode === "date") {
      return new Date(right.date).getTime() - new Date(left.date).getTime();
    }

    return toSeconds(left.time) - toSeconds(right.time);
  });
}

function getBestRun(runs: HomeRun[]) {
  if (runs.length === 0) {
    return null;
  }

  return runs.reduce((best, run) => (isBetterRun(run, best) ? run : best), runs[0]);
}

function seasonRank(season: string) {
  if (!season) {
    return -1;
  }

  const normalized = String(season).trim();
  const lunaMatch = normalized.match(/^Luna\s*(\d+)$/i);

  if (lunaMatch) {
    return 60 + parseInt(lunaMatch[1], 10);
  }

  if (normalized.toLowerCase() === "lunai") {
    return 60;
  }

  const numeric = parseFloat(normalized);
  if (Number.isFinite(numeric)) {
    return Math.round(numeric * 10);
  }

  return -1;
}

function seasonGte(runSeason: string, selectedSeason: string) {
  if (!selectedSeason) {
    return true;
  }

  return seasonRank(runSeason) <= seasonRank(selectedSeason);
}

function getDefaultSeason(seasons: string[]) {
  if (seasons.length === 0) {
    return "5.0";
  }

  return (
    seasons
      .map((season) => ({ season, rank: seasonRank(season) }))
      .sort((left, right) => right.rank - left.rank)[0]?.season ?? seasons[seasons.length - 1]
  );
}

function getBracketLabel(bracket: Bracket) {
  const labels: Record<Bracket, string> = {
    1: "Low",
    2: "Mid.",
    3: "High",
    4: "Unl.",
  };

  return labels[bracket];
}

function getAmbrName(characterId: string) {
  return AMBR_NAME_MAP[characterId] ?? "Traveler";
}

function getCharacterImageCandidates(characterId: string, variant: keyof typeof VARIANT_FALLBACKS) {
  const ambrName = getAmbrName(characterId);
  const chain = VARIANT_FALLBACKS[variant] ?? VARIANT_FALLBACKS.portrait;
  const urls: string[] = [];

  chain.forEach((currentVariant) => {
    const pattern = IMAGE_PATTERNS[currentVariant];
    UI_MIRRORS.forEach((base) => {
      urls.push(`${base}${pattern(ambrName)}`);
    });
  });

  return urls;
}

function SearchIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function CalendarIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function TimerIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9 2h6" />
    </svg>
  );
}

function FilterFunnelIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function PlatformPcIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function PlatformMobileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function PlatformPs5Icon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<Platform, ({ className }: { className?: string }) => ReactNode> = {
  PC: PlatformPcIcon,
  Mobile: PlatformMobileIcon,
  PS5: PlatformPs5Icon,
};

function CharacterImage({
  characterId,
  className = "",
  alt = "",
  variant = "portrait",
}: {
  characterId: string;
  className?: string;
  alt?: string;
  variant?: keyof typeof VARIANT_FALLBACKS;
}) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const urls = useMemo(() => getCharacterImageCandidates(characterId, variant), [characterId, variant]);
  const fallbackSource = characterDb[characterId]?.name ?? alt ?? characterId ?? "?";
  const fallbackText = Array.from(fallbackSource).slice(0, 2).join("");

  useEffect(() => {
    setIndex(0);
    setHidden(false);
  }, [characterId, variant]);

  if (hidden || urls.length === 0) {
    if (variant === "portrait") {
      return null;
    }

    return (
      <div className={`bg-black/10 text-[#909399] rounded-full flex items-center justify-center ${className}`} aria-hidden="true">
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={urls[index]}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        const nextIndex = index + 1;
        if (nextIndex < urls.length) {
          setIndex(nextIndex);
        } else {
          setHidden(true);
        }
      }}
    />
  );
}

function RankMoveIcon({ move = "same", className = "" }: { move?: RankMove; className?: string }) {
  if (move === "new") {
    return null;
  }

  if (move === "up") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5l-5 6" />
        <path d="M12 5l5 6" />
        <path d="M12 5v14" />
      </svg>
    );
  }

  if (move === "down") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19l-5-6" />
        <path d="M12 19l5-6" />
        <path d="M12 5v14" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 12h12" />
    </svg>
  );
}

function TopPlayerCard({
  label,
  run,
  theme,
  onView,
  onSelect,
  actionLabel = VIEW_RANKING_LABEL,
  onAction,
}: {
  label: string;
  run: HomeRun | null;
  theme: { gradient: string };
  onView: () => void;
  onSelect: (runId: string) => void;
  actionLabel?: string;
  onAction?: () => void;
}) {
  if (!run) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#4a494b] bg-[#2b2a2b] shadow-[0_12px_24px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.32)]">
        <div className={`relative h-24 w-full bg-gradient-to-r ${theme.gradient}`}>
          <div className="absolute top-4 left-4 z-10 space-y-1">
            <div className="text-[17px] font-bold leading-tight tracking-[0.01em] text-white drop-shadow-md md:text-[18px]">{label}</div>
          </div>
        </div>
        <div className="relative z-10 flex flex-1 flex-col justify-between gap-4 bg-[#323132] p-4 text-white/90">
          <div className="text-sm text-white/55">{LOADING_LABEL}</div>
          <button type="button" onClick={onAction ?? onView} className={`${HOME_PRIMARY_BUTTON_CLASS} w-full`}>
            {actionLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#4a494b] bg-[#2b2a2b] shadow-[0_12px_24px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.32)]"
      onClick={() => onSelect(run.id)}
    >
      <div className={`relative h-24 w-full bg-gradient-to-r ${theme.gradient}`}>
        <div className="absolute top-4 left-4 z-10 space-y-1">
          <div className="text-[17px] font-bold leading-tight tracking-[0.01em] text-white drop-shadow-md md:text-[18px]">{label}</div>
          <div className="text-[13px] font-medium text-white/80">{run.userName}</div>
        </div>
        <CharacterImage
          characterId={run.mainAttackerId}
          alt={run.mainAttacker}
          className="pointer-events-none absolute -right-5 -bottom-5 z-0 h-auto w-44 object-cover opacity-85 drop-shadow-lg"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col gap-4 bg-[#323132] p-4 text-white/90">
        <div className="rounded-[12px] border border-white/10 bg-white/[0.08] p-3">
          <div className="flex items-center justify-between gap-2">
            {run.party.map((member, index) => (
              <CharacterImage
                key={`${run.id}-${member.characterId}-${index}`}
                characterId={member.characterId}
                alt={characterDb[member.characterId]?.name ?? member.characterId}
                variant="circle"
                className="h-9 w-9 rounded-full object-cover"
              />
            ))}
          </div>
          <div className="mt-3 text-center text-[24px] font-semibold leading-none text-white">{run.time}</div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            (onAction ?? onView)();
          }}
          className={`${HOME_PRIMARY_BUTTON_CLASS} w-full`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function LeaderboardRow({
  run,
  index,
  onSelect,
  view,
}: {
  run: HomeRun | HomeRunWithBucket;
  index: number;
  onSelect: (runId: string) => void;
  view: LeaderboardView;
}) {
  const PlatformIcon = PLATFORM_ICONS[run.platform] ?? PLATFORM_ICONS.PC;
  const displayBucket = view === "char" && "displayBucket" in run ? run.displayBucket : null;
  const highlightedIds = new Set(displayBucket?.ids ?? []);
  const getPartyIconClass = (characterId: string, size: "mobile" | "desktop") => {
    const baseClass = size === "mobile" ? "h-8 w-8 rounded-full object-cover" : "h-9 w-9 rounded-full object-cover";
    if (!displayBucket || !highlightedIds.has(characterId)) {
      return baseClass;
    }

    return `${baseClass} ring-2 ring-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.18)]`;
  };

  return (
    <div className="cursor-pointer border-t border-white/10 py-4 text-white/90" onClick={() => onSelect(run.id)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <div className="flex w-6 items-center justify-center text-white/45">
            <RankMoveIcon move={run.rankMove} className="h-5 w-5" />
          </div>
          <div className="w-9 text-center text-[20px] font-semibold text-white md:w-10 md:text-[22px]">{index + 1}</div>
          <div className="flex shrink-0 items-center gap-1 md:hidden">
            {run.party.map((member, memberIndex) => (
              <CharacterImage
                key={`${run.id}-leaderboard-mobile-party-${member.characterId}-${memberIndex}`}
                characterId={member.characterId}
                alt={characterDb[member.characterId]?.name ?? member.characterId}
                variant="circle"
                className={getPartyIconClass(member.characterId, "mobile")}
              />
            ))}
          </div>
          <div className="hidden shrink-0 items-center gap-1.5 md:flex">
            {run.party.map((member, memberIndex) => (
              <CharacterImage
                key={`${run.id}-leaderboard-party-${member.characterId}-${memberIndex}`}
                characterId={member.characterId}
                alt={characterDb[member.characterId]?.name ?? member.characterId}
                variant="circle"
                className={getPartyIconClass(member.characterId, "desktop")}
              />
            ))}
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-[17px] font-semibold text-white md:text-[19px]">{run.userName}</div>
              {displayBucket ? (
                <div className="hidden max-w-[180px] truncate rounded-full border border-white/14 bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/82 md:inline-flex">
                  {displayBucket.label}
                </div>
              ) : null}
              <div className="hidden rounded-full border border-white/12 bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/72 md:inline-flex">
                {getBracketLabel(run.bracket)}
              </div>
            </div>
          </div>
          <div className="ml-auto text-[20px] font-semibold text-white md:hidden">{run.time}</div>
          <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] md:flex">
            <PlatformIcon className="h-[18px] w-[18px] text-white/78" />
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="w-20 text-right text-[22px] font-semibold text-white">{run.time}</div>
        </div>
      </div>
      <div className="mt-2 flex min-w-0 items-center gap-3 md:hidden">
        <div className="w-6 shrink-0" aria-hidden="true" />
        <div className="w-9 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1 truncate text-[15px] font-semibold text-white">{run.userName}</div>
        <div className="flex items-center gap-2">
          {displayBucket ? (
            <div className="max-w-[120px] truncate rounded-full border border-white/14 bg-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-white/82">
              {displayBucket.label}
            </div>
          ) : null}
          <div className="rounded-full border border-white/12 bg-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-white/72">{getBracketLabel(run.bracket)}</div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.08]">
            <PlatformIcon className="h-3.5 w-3.5 text-white/78" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegacyFilterModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialIncludeIds,
  initialExcludeIds,
  initialPlatform,
  initialIncludeMode,
  characters,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    includeIds: string[];
    excludeIds: string[];
    platform: Platform | null;
    includeMode: "and" | "or";
  }) => void;
  onReset: () => void;
  initialIncludeIds: string[];
  initialExcludeIds: string[];
  initialPlatform: Platform | null;
  initialIncludeMode: "and" | "or";
  characters: { id: string; name: string }[];
}) {
  const [includeIds, setIncludeIds] = useState<string[]>([]);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [includeMode, setIncludeMode] = useState<"and" | "or">("or");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIncludeIds(initialIncludeIds);
    setExcludeIds(initialExcludeIds);
    setPlatform(initialPlatform);
    setIncludeMode(initialIncludeMode);
  }, [initialExcludeIds, initialIncludeIds, initialIncludeMode, initialPlatform, isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggleInclude = (characterId: string) => {
    setIncludeIds((current) => (current.includes(characterId) ? current.filter((id) => id !== characterId) : [...current, characterId]));
    setExcludeIds((current) => current.filter((id) => id !== characterId));
  };

  const toggleExclude = (characterId: string) => {
    setExcludeIds((current) => (current.includes(characterId) ? current.filter((id) => id !== characterId) : [...current, characterId]));
    setIncludeIds((current) => current.filter((id) => id !== characterId));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col border-l border-white/10 bg-[#191919] text-white shadow-[-24px_0_60px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-6 shrink-0">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.26em] text-white/40">Filter Catalog</div>
            <div className="mt-1 text-[24px] font-semibold text-white">{FILTER_TITLE}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
              {[
                { key: "and", label: "かつ" },
                { key: "or", label: "または" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`px-4 py-1.5 text-[12px] font-semibold ${includeMode === item.key ? "bg-cyan-400 text-[#141414]" : "text-white/58"}`}
                  onClick={() => setIncludeMode(item.key as "and" | "or")}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/72"
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6 md:px-6">
          <section className="space-y-3">
            <div className="text-[15px] font-semibold text-white">{FILTER_INCLUDE_LABEL}</div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {characters.map((character) => {
                const active = includeIds.includes(character.id);
                return (
                  <button
                    key={`include-${character.id}`}
                    type="button"
                    className={`rounded-[16px] border p-2 text-center transition-all ${active ? "border-cyan-300 bg-cyan-400/12" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}
                    onClick={() => toggleInclude(character.id)}
                  >
                    <div className="flex flex-col items-center">
                      <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-14 w-14 rounded-full object-cover" />
                      <div className="mt-2 truncate text-[11px] font-medium text-white/76">{character.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-[15px] font-semibold text-white">{FILTER_EXCLUDE_LABEL}</div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {characters.map((character) => {
                const active = excludeIds.includes(character.id);
                return (
                  <button
                    key={`exclude-${character.id}`}
                    type="button"
                    className={`rounded-[16px] border p-2 text-center transition-all ${active ? "border-rose-300 bg-rose-400/12" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}
                    onClick={() => toggleExclude(character.id)}
                  >
                    <div className="flex flex-col items-center">
                      <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-14 w-14 rounded-full object-cover" />
                      <div className="mt-2 truncate text-[11px] font-medium text-white/76">{character.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-[15px] font-semibold text-white">{FILTER_PLATFORM_LABEL}</div>
            <div className="flex flex-wrap items-center gap-3">
              {(["PC", "PS5", "Mobile"] as Platform[]).map((item) => {
                const Icon = PLATFORM_ICONS[item];
                const active = platform === item;

                return (
                  <button
                    key={item}
                    type="button"
                    className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm ${active ? "border-cyan-300 bg-cyan-400 text-[#141414]" : "border-white/10 bg-white/[0.04] text-white/70"}`}
                    onClick={() => setPlatform(active ? null : item)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 md:px-6 shrink-0">
          <button
            type="button"
            className="text-[13px] font-medium text-white/54 underline decoration-white/20 underline-offset-4"
            onClick={() => {
              setIncludeIds([]);
              setExcludeIds([]);
              setPlatform(null);
              setIncludeMode("or");
              onReset();
            }}
          >
            {FILTER_RESET_LABEL}
          </button>
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-white/76" onClick={onClose}>
              {FILTER_CANCEL_LABEL}
            </button>
            <button
              type="button"
              className="rounded-full bg-cyan-400 px-6 py-2 text-[13px] font-semibold text-[#141414]"
              onClick={() => {
                onApply({
                  includeIds,
                  excludeIds,
                  platform,
                  includeMode,
                });
                onClose();
              }}
            >
              {FILTER_APPLY_LABEL}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  characters,
  tagGroups,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: HomeFilterState) => void;
  initialFilters: HomeFilterState;
  characters: Character[];
  tagGroups: TagGroup[];
}) {
  const [draftFilters, setDraftFilters] = useState<HomeFilterState>(() => createEmptyHomeFilterState());
  const [activeTab, setActiveTab] = useState<FilterTabKey>("partyCharacters");
  const [selectionTargets, setSelectionTargets] = useState<Record<FilterTabKey, SelectionTarget>>({
    partyCharacters: "include",
    mainAttackers: "include",
    tags: "include",
  });
  const [characterSearch, setCharacterSearch] = useState<Record<CharacterFilterTabKey, string>>({
    partyCharacters: "",
    mainAttackers: "",
  });
  const [tagSearch, setTagSearch] = useState("");
  const [characterAssistFilters, setCharacterAssistFilters] = useState<Record<CharacterFilterTabKey, CharacterAssistFilters>>({
    partyCharacters: { element: null },
    mainAttackers: { element: null },
  });
  const sortedCharacters = useMemo(() => [...characters].sort((left, right) => left.name.localeCompare(right.name)), [characters]);

  const resetLocalUi = () => {
    setActiveTab("partyCharacters");
    setSelectionTargets({
      partyCharacters: "include",
      mainAttackers: "include",
      tags: "include",
    });
    setCharacterSearch({
      partyCharacters: "",
      mainAttackers: "",
    });
    setTagSearch("");
    setCharacterAssistFilters({
      partyCharacters: { element: null },
      mainAttackers: { element: null },
    });
  };

  const resetDraft = () => {
    setDraftFilters(createEmptyHomeFilterState());
    resetLocalUi();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraftFilters(cloneHomeFilterState(initialFilters));
    resetLocalUi();
  }, [initialFilters, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const setGroupState = (groupKey: FilterTabKey, updater: (group: SelectionGroupState) => SelectionGroupState) => {
    setDraftFilters((current) => ({
      ...current,
      [groupKey]: updater(current[groupKey]),
    }));
  };

  const toggleGroupValue = (groupKey: FilterTabKey, value: string) => {
    setGroupState(groupKey, (group) => updateSelectionGroup(group, selectionTargets[groupKey], value));
  };

  const removeGroupValue = (groupKey: FilterTabKey, target: SelectionTarget, value: string) => {
    setGroupState(groupKey, (group) => removeSelectionGroupValue(group, target, value));
  };

  const getSelectionLabel = (groupKey: FilterTabKey, value: string) => {
    if (groupKey === "tags") {
      return value;
    }

    return characterDb[value]?.name ?? value;
  };

  const getVisibleCharacters = (groupKey: CharacterFilterTabKey) => {
    const query = characterSearch[groupKey].trim().toLowerCase();
    const assistFilters = characterAssistFilters[groupKey];

    return sortedCharacters.filter((character) => {
      const matchesQuery = query.length === 0 || character.name.toLowerCase().includes(query);
      const matchesElement = !assistFilters.element || character.element === assistFilters.element;

      return matchesQuery && matchesElement;
    });
  };

  const visibleTagGroups = tagGroups
    .map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => tagSearch.trim().length === 0 || tag.toLowerCase().includes(tagSearch.trim().toLowerCase())),
    }))
    .filter((group) => group.tags.length > 0);

  const filterButtonTone = (active: boolean, activeClass: string) =>
    active ? activeClass : "border-white/12 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white";
  const isAndMode = draftFilters[activeTab].includeMode === "and";
  const includeModeDecorationStyle = {
    transition: "0.35s ease-in-out",
  } as const;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col border-l border-white/10 bg-[#191919] text-white shadow-[-24px_0_60px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-white/10">
          <div className="flex items-start justify-between gap-4 px-5 py-5 md:px-6">
            <div className="text-[24px] font-semibold text-white">{FILTER_TITLE}</div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/72"
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="flex items-end justify-between overflow-x-auto px-5 pb-0 text-[13px] font-semibold md:px-6 md:text-[14px]">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`-mb-px flex-1 shrink-0 border-b-2 pb-4 text-center transition-colors ${
                  activeTab === tab.key ? "border-white text-white" : "border-transparent text-white/38 hover:text-white/72"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-6">
          <div className="space-y-6">
            {false ? (
              <p className="text-[12px] leading-5 text-white/52">
                メインアタッカーとして登録されたキャラで絞り込みます。複数選択で「すべて」を選ぶと、通常は 0 件になります。
              </p>
            ) : null}

            <section className="hidden space-y-4 [&>div:nth-child(4)]:hidden">
              <div className="text-[12px] font-medium text-white/48">追加先</div>
              <div className="space-y-2 [&>div:first-child]:hidden">
                <div className="text-[12px] font-medium text-white/48">追加先</div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_TARGET_OPTIONS.map((option) => (
                    <button
                      key={`${activeTab}-${option.key}`}
                      type="button"
                        className={`inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-semibold transition-colors ${
                          selectionTargets[activeTab] === option.key
                            ? "border-white bg-white text-[#1f1f20]"
                            : "border-white/12 bg-transparent text-white/68 hover:bg-white/8 hover:text-white"
                        }`}
                        onClick={() => setSelectionTargets((current) => ({ ...current, [activeTab]: option.key }))}
                      >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

                <div className="flex items-center justify-end">
                  <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                    {FILTER_INCLUDE_MODE_OPTIONS.map((option) => (
                      <button
                        key={`${activeTab}-${option.key}`}
                        type="button"
                        className={`w-14 px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                          draftFilters[activeTab].includeMode === option.key ? "bg-white text-[#151515]" : "text-white/58 hover:bg-white/8 hover:text-white"
                        }`}
                        onClick={() => setGroupState(activeTab, (group) => ({ ...group, includeMode: option.key }))}
                      >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[12px] font-medium text-white/48">条件</div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_INCLUDE_MODE_OPTIONS.map((option) => (
                    <button
                      key={`${activeTab}-${option.key}`}
                      type="button"
                      className={`inline-flex h-10 items-center rounded-full border px-4 text-[13px] font-semibold transition-colors ${filterButtonTone(
                        draftFilters[activeTab].includeMode === option.key,
                        "border-transparent bg-white text-[#151515]",
                      )}`}
                      onClick={() => setGroupState(activeTab, (group) => ({ ...group, includeMode: option.key }))}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-center">
                <div
                  className="flex w-full max-w-[320px] items-center overflow-hidden rounded-full border border-white/12 bg-[#262526]/70 sm:max-w-[360px]"
                  aria-label="Selection target"
                >
                  {FILTER_TARGET_OPTIONS.map((option) => (
                    <button
                      key={`${activeTab}-target-${option.key}`}
                      type="button"
                      className={`flex-1 px-5 py-2 text-[13px] font-semibold transition-colors sm:px-7 ${
                        selectionTargets[activeTab] === option.key
                          ? "bg-white text-[#1f1f20]"
                          : "bg-transparent text-white/68 hover:bg-white/8 hover:text-white"
                      }`}
                      onClick={() => setSelectionTargets((current) => ({ ...current, [activeTab]: option.key }))}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <span
                  className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                    draftFilters[activeTab].includeMode === "or" ? "text-white/82" : "text-white/40"
                  }`}
                >
                  OR
                </span>
                <button
                  type="button"
                  className="relative inline-flex shrink-0 items-center rounded-full"
                  onClick={() => setGroupState(activeTab, (group) => ({ ...group, includeMode: isAndMode ? "or" : "and" }))}
                  aria-label="Include mode"
                >
                  <span className="sr-only">Toggle include mode</span>
                  <span
                    className="relative block overflow-hidden rounded-full"
                    style={{
                      width: "61.6px",
                      height: "28px",
                      background: "linear-gradient(90deg, #f19af3, #f099b5)",
                      perspective: "400px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: isAndMode ? "transparent" : "#d7d7d7",
                        ...includeModeDecorationStyle,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute z-[2]"
                      style={{
                        left: isAndMode ? "43.4px" : "4.2px",
                        top: isAndMode ? "11.2px" : "14px",
                        height: "28px",
                        letterSpacing: "-1.12px",
                        color: "#9b9b9b",
                        fontFamily: '"Times New Roman", serif',
                        fontSize: "16.8px",
                        lineHeight: isAndMode ? "2.8px" : "normal",
                        transform: isAndMode ? "rotateY(360deg)" : "none",
                        transformOrigin: "0 0 -14px",
                        backfaceVisibility: "hidden",
                        ...includeModeDecorationStyle,
                      }}
                    >
                      · ·
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute z-[2]"
                      style={{
                        left: isAndMode ? "44.8px" : "5.6px",
                        top: isAndMode ? "15.4px" : "18.2px",
                        width: "9.8px",
                        height: isAndMode ? "4.48px" : "2.8px",
                        color: "#9b9b9b",
                        fontFamily: '"Times New Roman", serif',
                        fontSize: isAndMode ? "16.8px" : "5.6px",
                        lineHeight: 0,
                        transform: isAndMode ? "rotateY(360deg)" : "none",
                        transformOrigin: "0 0 -11.2px",
                        backfaceVisibility: "hidden",
                        ...includeModeDecorationStyle,
                      }}
                    >
                      ●
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute z-[1] rounded-full"
                      style={{
                        top: "2.8px",
                        left: isAndMode ? "36.4px" : "2.8px",
                        width: "22.4px",
                        height: "22.4px",
                        background: "linear-gradient(45deg, #dedede, #ffffff)",
                        boxShadow: "0 6px 7px rgba(0,0,0,0.3)",
                        ...includeModeDecorationStyle,
                      }}
                    />
                  </span>
                </button>
                <span
                  className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                    draftFilters[activeTab].includeMode === "and" ? "text-white/82" : "text-white/40"
                  }`}
                >
                  AND
                </span>
              </div>
            </section>

            {activeTab === "tags" ? (
              <>
                <section className="space-y-2 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">検索</div>
                  <label className="relative block">
                    <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/36" />
                    <input
                      type="text"
                      value={tagSearch}
                      onChange={(event) => setTagSearch(event.target.value)}
                      placeholder="タグ名で検索"
                      className="h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[14px] text-white placeholder:text-white/28 outline-none transition-colors focus:border-white/24"
                    />
                  </label>
                </section>

                <section className="space-y-4">
                  {visibleTagGroups.length > 0 ? (
                    visibleTagGroups.map((group) => (
                      <div key={group.key} className="space-y-2">
                        <div className="text-[12px] font-medium text-white/42">{group.label}</div>
                        <div className="flex flex-wrap gap-2">
                          {group.tags.map((tag) => {
                            const isInclude = draftFilters.tags.includeIds.includes(tag);
                            const isExclude = draftFilters.tags.excludeIds.includes(tag);

                            return (
                              <button
                                key={`${group.key}-${tag}`}
                                type="button"
                                className={`inline-flex min-h-9 items-center rounded-full border px-3 py-2 text-[12px] font-medium transition-colors ${
                                  isExclude
                                    ? "border-[#8d575d] bg-[#43292d] text-white"
                                    : isInclude
                                      ? "border-transparent bg-cyan-400 text-[#141414]"
                                      : "border-white/12 bg-white/[0.04] text-white/72 hover:bg-white/10 hover:text-white"
                                }`}
                                onClick={() => toggleGroupValue("tags", tag)}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[16px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-[13px] text-white/42">
                      該当するタグがありません
                    </div>
                  )}
                </section>
              </>
            ) : (
              <>
                <section className="space-y-2 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">検索</div>
                  <label className="relative block">
                    <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/36" />
                    <input
                      type="text"
                      value={characterSearch[activeTab]}
                      onChange={(event) => setCharacterSearch((current) => ({ ...current, [activeTab]: event.target.value }))}
                      placeholder="キャラ名で検索"
                      className="h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[14px] text-white placeholder:text-white/28 outline-none transition-colors focus:border-white/24"
                    />
                  </label>
                </section>

                <section className="space-y-3 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">絞込補助</div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {ELEMENT_FILTER_OPTIONS.map((option) => (
                        <button
                          key={`${activeTab}-element-${option.key}`}
                          type="button"
                          className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${filterButtonTone(
                            characterAssistFilters[activeTab].element === option.key,
                            "border-transparent bg-white text-[#151515]",
                          )}`}
                          onClick={() =>
                            setCharacterAssistFilters((current) => ({
                              ...current,
                              [activeTab]: {
                                ...current[activeTab],
                                element: current[activeTab].element === option.key ? null : option.key,
                              },
                            }))
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-3 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">キャラ一覧</div>
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {getVisibleCharacters(activeTab).map((character) => {
                      const isInclude = draftFilters[activeTab].includeIds.includes(character.id);
                      const isExclude = draftFilters[activeTab].excludeIds.includes(character.id);

                      return (
                        <button
                          key={`${activeTab}-${character.id}`}
                          type="button"
                          className={`relative rounded-[16px] border p-2 text-center transition-all ${
                            isExclude
                              ? "border-[#8d575d] bg-[#43292d]/70"
                              : isInclude
                                ? "border-cyan-300 bg-cyan-400/12"
                                : "border-white/10 bg-white/[0.04] hover:border-white/20"
                          }`}
                          onClick={() => toggleGroupValue(activeTab, character.id)}
                        >
                          {isInclude || isExclude ? (
                            <div
                              className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                                isExclude ? "bg-[#b96b74] text-white" : "bg-cyan-300 text-[#141414]"
                              }`}
                            >
                              {isExclude ? "-" : "+"}
                            </div>
                          ) : null}
                          <div className="flex flex-col items-center">
                            <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-14 w-14 rounded-full object-cover" />
                            <div className="mt-2 truncate text-[11px] font-medium text-white/76">{character.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {getVisibleCharacters(activeTab).length === 0 ? (
                    <div className="rounded-[16px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-[13px] text-white/42">
                      該当するキャラがありません
                    </div>
                  ) : null}
                </section>
              </>
            )}
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-[1fr_minmax(220px,360px)_1fr] items-center gap-3 border-t border-white/10 px-5 py-4 md:px-6">
          <button
            type="button"
            className="justify-self-start text-[13px] font-medium text-white/54 underline decoration-white/20 underline-offset-4"
            onClick={resetDraft}
          >
            {FILTER_RESET_LABEL}
          </button>
          <button
            type="button"
            className="w-full rounded-full border border-white bg-white px-6 py-2.5 text-[13px] font-semibold text-[#5f6373] transition-colors hover:bg-white/90 hover:text-[#4d5160]"
            onClick={() => {
              onApply(cloneHomeFilterState(draftFilters));
              onClose();
            }}
          >
            {FILTER_APPLY_LABEL}
          </button>
          <div aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function HomeShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#212121] pb-20 font-sans text-[#333333]">{children}</div>;
}

export function RunHomePage({
  onRequestSubmit,
  onSelectRun,
  embedded = false,
  selectedSeason,
  onSelectedSeasonChange,
}: {
  onRequestSubmit: () => void;
  onSelectRun: (runId: string) => void;
  embedded?: boolean;
  selectedSeason?: string;
  onSelectedSeasonChange?: (season: string) => void;
}) {
  const leaderboardRef = useRef<HTMLDivElement | null>(null);
  const topRowRef = useRef<HTMLDivElement | null>(null);
  const topCarouselMeasureFrameRef = useRef<number | null>(null);
  const topAutoScrollTimerRef = useRef<number | null>(null);
  const [runs] = useState<HomeRun[]>(() => applyWRTag(mockRuns.map(normalizeHomeRun)));
  const [activeSeasonInternal, setActiveSeasonInternal] = useState(getDefaultSeason(SEASONS));
  const [activeTab] = useState<"main" | "festival">("main");
  const [filterBracket, setFilterBracket] = useState<Bracket | null>(null);
  const [homeFilters, setHomeFilters] = useState<HomeFilterState>(() => createEmptyHomeFilterState());
  const [sortMode] = useState<"time" | "cost" | "date">("time");
  const [enableRLogic] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subHeaderTab, setSubHeaderTab] = useState<string>("NPUI");
  const [leaderboardView, setLeaderboardView] = useState<LeaderboardView>("rta");
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false);
  const [topCarouselOffsets, setTopCarouselOffsets] = useState<number[]>([]);
  const [topCarouselIndex, setTopCarouselIndex] = useState(0);
  const [topCarouselTransitionEnabled, setTopCarouselTransitionEnabled] = useState(false);
  const activeSeason = selectedSeason ?? activeSeasonInternal;
  const setActiveSeason = onSelectedSeasonChange ?? setActiveSeasonInternal;

  const characters = useMemo(() => Object.values(characterDb), []);
  const tagGroups = useMemo(() => getTagGroups(runs), [runs]);
  const activeFilterChips = useMemo(() => buildActiveFilterChips(homeFilters), [homeFilters]);
  const activeFilterCharacterChips = useMemo(
    () =>
      activeFilterChips.map((chip) => ({
        ...chip,
        characterId: chip.value,
        label: `${chip.prefix}: ${chip.label}`,
      })),
    [activeFilterChips],
  );

  const filters = useMemo(
    () => ({
      season: activeSeason,
      isFestival: activeTab === "festival",
      bracket: filterBracket,
      filterState: homeFilters,
    }),
    [activeSeason, activeTab, filterBracket, homeFilters],
  );

  const filteredBase = useMemo(() => filterRuns(runs, filters), [filters, runs]);
  const rLogicApplied = useMemo(() => (enableRLogic ? applyRLogic(filteredBase) : filteredBase), [enableRLogic, filteredBase]);
  const filteredRuns = useMemo(() => sortRuns(rLogicApplied, sortMode), [rLogicApplied, sortMode]);
  const charScopeRuns = useMemo(
    () =>
      runs.filter((run) =>
        matchesLeaderboardScope(run, {
          season: activeSeason,
          isFestival: false,
          bracket: filterBracket,
        }),
      ),
    [activeSeason, filterBracket, runs],
  );
  const charScopeRunsWithBuckets = useMemo<HomeRunWithBucket[]>(
    () =>
      charScopeRuns.map((run) => ({
        ...run,
        displayBucket: buildDisplayBucket(run, charScopeRuns),
      })),
    [charScopeRuns],
  );
  const filteredCharRuns = useMemo(
    () => charScopeRunsWithBuckets.filter((run) => matchesHomeFilterState(run, homeFilters)),
    [charScopeRunsWithBuckets, homeFilters],
  );
  const charTopRuns = useMemo(() => sortRuns(buildCharTopRows(filteredCharRuns), "time"), [filteredCharRuns]);
  const leaderboardRuns = leaderboardView === "char" ? charTopRuns : filteredRuns;
  const heroRuns = useMemo(() => runs.filter((run) => seasonGte(run.season, activeSeason) && !run.isFestival), [activeSeason, runs]);
  const featuredCards = useMemo(() => {
    const firstPostRun = getBestRun(heroRuns.filter((run) => run.tags.includes("New")));
    const seasonalOffmetaRuns = sortRuns(
      heroRuns.filter((run) => run.tags.includes("OffMeta")),
      "time",
    );
    const allOffmetaRuns = sortRuns(
      runs.filter((run) => !run.isFestival && run.tags.includes("OffMeta")),
      "time",
    );
    const offmetaRuns = [...seasonalOffmetaRuns];

    allOffmetaRuns.forEach((run) => {
      if (offmetaRuns.length >= 3 || offmetaRuns.some((entry) => entry.id === run.id)) {
        return;
      }

      offmetaRuns.push(run);
    });

    const offmetaTheme = { gradient: "from-[#314857] to-[#1f2f38]" };

    return [
      {
        key: "first-post",
        title: FIRST_POST_LABEL,
        run: firstPostRun,
        theme: { gradient: "from-[#6d3c2f] to-[#3c2520]" },
        actionLabel: ENGAGE_RECORD_LABEL,
        action: "detail" as const,
      },
      ...Array.from({ length: 3 }, (_, index) => ({
        key: `offmeta-${index}`,
        title: OFFMETA_PICKUP_LABEL,
        run: offmetaRuns[index] ?? null,
        theme: offmetaTheme,
        actionLabel: VIEW_RANKING_LABEL,
        action: "leaderboard" as const,
      })),
    ];
  }, [heroRuns]);

  const clearTopAutoScrollTimers = () => {
    if (topAutoScrollTimerRef.current !== null) {
      window.clearTimeout(topAutoScrollTimerRef.current);
      topAutoScrollTimerRef.current = null;
    }
  };

  const getTopPanels = () => {
    if (!topRowRef.current) {
      return [] as HTMLElement[];
    }

    return Array.from(topRowRef.current.querySelectorAll<HTMLElement>("[data-top-panel]"));
  };

  const updateTopCarouselOffsets = () => {
    const panels = getTopPanels();
    setTopCarouselOffsets(panels.map((panel) => panel.offsetLeft));
  };

  useEffect(() => {
    if (activeTab !== "main" || !topRowRef.current) {
      return;
    }

    clearTopAutoScrollTimers();
    setTopCarouselTransitionEnabled(false);
    setTopCarouselIndex(0);

    if (topCarouselMeasureFrameRef.current !== null) {
      window.cancelAnimationFrame(topCarouselMeasureFrameRef.current);
    }

    topCarouselMeasureFrameRef.current = window.requestAnimationFrame(() => {
      updateTopCarouselOffsets();
    });

    const observer = new ResizeObserver(() => {
      updateTopCarouselOffsets();
    });

    observer.observe(topRowRef.current);
    getTopPanels().forEach((panel) => observer.observe(panel));

    return () => {
      clearTopAutoScrollTimers();
      observer.disconnect();
      if (topCarouselMeasureFrameRef.current !== null) {
        window.cancelAnimationFrame(topCarouselMeasureFrameRef.current);
        topCarouselMeasureFrameRef.current = null;
      }
    };
  }, [activeTab, activeSeason, featuredCards.length, heroRuns.length]);

  useEffect(() => {
    if (activeTab !== "main" || topCarouselOffsets.length < 3 || topCarouselIndex === 2) {
      return;
    }

    clearTopAutoScrollTimers();

    const waitMs = topCarouselIndex === 0 ? TOP_PANEL_AUTOSCROLL_MS : FEATURED_PANEL_AUTOSCROLL_MS;
    topAutoScrollTimerRef.current = window.setTimeout(() => {
      setTopCarouselTransitionEnabled(true);
      setTopCarouselIndex(topCarouselIndex === 0 ? 1 : 2);
    }, waitMs);

    return clearTopAutoScrollTimers;
  }, [activeTab, topCarouselIndex, topCarouselOffsets]);

  const scrollToLeaderboard = () => {
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openRunDetail = (runId: string) => {
    onSelectRun(runId);
  };

  const jumpTopCarouselTo = (nextIndex: 0 | 1) => {
    clearTopAutoScrollTimers();
    setTopCarouselTransitionEnabled(true);
    setTopCarouselIndex(nextIndex);
  };

  const handleTopCarouselTransitionEnd = () => {
    if (topCarouselIndex !== 2) {
      return;
    }

    setTopCarouselTransitionEnabled(false);
    setTopCarouselIndex(0);
  };

  const renderTopPlayersPanel = (key: string) => (
    <div key={key} data-top-panel className={`${HOME_SECTION_PANEL_CLASS} min-w-[820px] flex-shrink-0`}>
      <div className={HOME_SECTION_REFLECTION_TOP_CLASS} />
      <div className={HOME_SECTION_REFLECTION_CORNER_CLASS} />
      <div className={`${HOME_SECTION_PANEL_INNER_CLASS} p-5`}>
        <div className={`${HOME_SECTION_TITLE_CLASS} mb-4`}>{TOP_PLAYERS_LABEL}</div>
        <div className="grid min-w-[860px] grid-cols-4 gap-5">
          {[
            { label: "Unlimited 1st", bracket: 4 as Bracket, theme: { gradient: "from-[#274060] to-[#1b2f45]" } },
            { label: "High 1st", bracket: 3 as Bracket, theme: { gradient: "from-[#2c3e3d] to-[#1e2c2b]" } },
            { label: "Middle 1st", bracket: 2 as Bracket, theme: { gradient: "from-[#3d2a4a] to-[#2b1f35]" } },
            { label: "Low 1st", bracket: 1 as Bracket, theme: { gradient: "from-[#4a3528] to-[#2f231c]" } },
          ].map((item) => {
            const topRun = getBestRun(heroRuns.filter((run) => run.bracket === item.bracket));

            return (
              <TopPlayerCard
                key={item.label}
                label={item.label}
                run={topRun}
                theme={item.theme}
                onView={() => {
                  setFilterBracket(item.bracket);
                  setLeaderboardView("rta");
                  scrollToLeaderboard();
                }}
                onSelect={openRunDetail}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFeaturedPlayersPanel = (key: string) => (
    <div key={key} data-top-panel className={`${FEATURED_SECTION_PANEL_CLASS} min-w-[860px] flex-shrink-0 self-stretch`}>
      <div className={HOME_SECTION_REFLECTION_TOP_CLASS} />
      <div className={HOME_SECTION_REFLECTION_CORNER_CLASS} />
      <div className={`${FEATURED_SECTION_PANEL_INNER_CLASS} flex h-full flex-col p-5`}>
        <div className={`${HOME_SECTION_TITLE_CLASS} mb-4`}>{FEATURED_PLAYERS_LABEL}</div>
        <div className="grid flex-1 min-w-[820px] grid-cols-4 gap-4">
          {featuredCards.map((item) => {
            const featuredRun = item.run;

            return (
              <TopPlayerCard
                key={item.key}
                label={item.title}
                run={featuredRun}
                theme={item.theme}
                onView={() => {
                  if (!featuredRun) {
                    return;
                  }

                  setFilterBracket(featuredRun.bracket);
                  setLeaderboardView("rta");
                  scrollToLeaderboard();
                }}
                onSelect={openRunDetail}
                actionLabel={item.actionLabel}
                onAction={
                  item.action === "detail" && featuredRun
                    ? () => {
                        openRunDetail(featuredRun.id);
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <HomeShell>
      {embedded ? null : (
        <nav className="bg-white sticky top-0 z-40 border-b border-[#ebebeb]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-2 md:py-3 flex items-center justify-between header-font">
            <div className="flex items-center gap-4 md:gap-6">
              <h1 className="text-[26px] md:text-[38px] font-semibold tracking-tight text-black">{APP_TITLE}</h1>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-black/30 rounded-full pl-3 md:pl-4 pr-12 md:pr-14 py-1.5 text-[16px] md:text-[20px] font-medium text-black"
                  value={activeSeason}
                  onChange={(event) => setActiveSeason(event.target.value)}
                >
                  {SEASONS.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-black/70">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  onRequestSubmit();
                }}
                className="bg-black text-white rounded-full text-[16px] md:text-[20px] font-medium flex items-center justify-center md:justify-start gap-0 md:gap-2 w-9 h-9 md:w-auto md:h-auto px-0 md:px-5 py-0 md:py-2.5"
              >
                <span className="md:hidden flex items-center justify-center w-full h-full text-[20px] leading-none">+</span>
                <span className="hidden md:inline text-[22px] leading-none">+</span>
                <span className="hidden md:inline">{SUBMIT_LABEL}</span>
              </button>
              <div className="w-9 h-9 rounded-full border border-black/30 bg-white" aria-label="User avatar" />
            </div>
          </div>
        </nav>
      )}

      {activeTab === "main" ? (
        <div
          className="relative w-full h-[320px] md:h-[560px] overflow-hidden mb-8 bg-center bg-cover"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
          aria-label="Hero visual"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#212121]" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/15 backdrop-blur-sm rounded-full border border-white/30 px-4 py-2">
            <div className="flex items-center justify-between text-sm font-medium text-white">
              {[...PRIMARY_RULESET_TABS, OTHER_TAB_LABEL].map((label) => (
                <div key={label} className="relative">
                  {(() => {
                    const isOther = label === OTHER_TAB_LABEL;
                    const isOtherSelected = isOther && !PRIMARY_RULESET_TABS.includes(subHeaderTab as (typeof PRIMARY_RULESET_TABS)[number]);
                    const buttonLabel = isOtherSelected ? `${OTHER_TAB_LABEL}（${subHeaderTab}）` : label;
                    const isActive = isOtherSelected || subHeaderTab === label;

                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (label === OTHER_TAB_LABEL) {
                              setIsOtherMenuOpen((current) => !current);
                            } else {
                              setSubHeaderTab(label);
                              setIsOtherMenuOpen(false);
                            }
                          }}
                          className={`py-1 px-4 md:px-5 -mx-2 transition-colors ${isActive ? "border-b-2 border-white" : "text-white/80 hover:text-white"}`}
                        >
                          {buttonLabel}
                        </button>
                        {label === OTHER_TAB_LABEL && isOtherMenuOpen ? (
                          <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-black/80 border border-[#dcdfe6] rounded-lg py-2 w-40 text-white text-xs">
                            {OTHER_RULESET_LABELS.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setSubHeaderTab(option);
                                  setIsOtherMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-1.5 hover:bg-white/10"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <main className="max-w-7xl mx-auto px-5 pt-8 sm:px-6 lg:px-8">
        {activeTab === "main" ? (
          <>
            <div className="relative left-1/2 right-1/2 z-10 -mt-40 mb-12 w-screen -translate-x-1/2 px-5 md:-mt-72 sm:px-6 lg:px-8">
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    ref={topRowRef}
                    className="flex gap-5 will-change-transform"
                    style={{
                      transform: `translateX(-${topCarouselOffsets[topCarouselIndex] ?? 0}px)`,
                      transitionProperty: "transform",
                      transitionDuration: topCarouselTransitionEnabled ? `${TOP_PANEL_SCROLL_DURATION_MS}ms` : "0ms",
                      transitionTimingFunction: "ease-in-out",
                    }}
                    onTransitionEnd={handleTopCarouselTransitionEnd}
                  >
                    {renderTopPlayersPanel("top-primary")}
                    {renderFeaturedPlayersPanel("featured-primary")}
                    {renderTopPlayersPanel("top-loop")}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border border-[#dcdfe6] rounded-full w-8 h-8 items-center justify-center z-20 shadow-sm"
                  aria-label="Scroll left"
                  onClick={() => {
                    jumpTopCarouselTo(0);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border border-[#dcdfe6] rounded-full w-8 h-8 items-center justify-center z-20 shadow-sm"
                  aria-label="Scroll right"
                  onClick={() => {
                    jumpTopCarouselTo(1);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>

            <div ref={leaderboardRef} className={LEADERBOARD_FULL_BLEED_SECTION_CLASS}>
              <div className={LEADERBOARD_FULL_BLEED_INNER_CLASS}>
                <div className="pt-12 pb-14 md:pt-14 md:pb-16">
                <div className="mb-8 flex items-center border-t border-white/10 pt-8">
                  <div className="text-[18px] font-bold tracking-[0.01em] text-white md:text-[20px]">{LEADERBOARD_LABEL}</div>
                  <button
                    type="button"
                    className="hidden h-10 items-center justify-center gap-2 rounded-full border border-white/12 px-3 text-white/78 transition-colors hover:bg-white/10 hover:text-white md:px-4"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <FilterFunnelIcon className="h-5 w-5" />
                    <span className="hidden text-[13px] font-semibold tracking-[0.01em] md:inline">絞り込み</span>
                  </button>
                  {false && activeFilterCharacterChips.length > 0 ? (
                    <>
                      <span className="ml-3 mr-2 text-[14px] font-medium text-white/42">:</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {activeFilterCharacterChips.map((chip) => (
                          <button
                            key={`${chip.isExclude ? "exclude" : "include"}-${chip.characterId}`}
                            type="button"
                            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-colors ${
                              chip.isExclude
                                ? "border border-[#6e4a4a] text-white/76 hover:bg-[#3a2626]"
                                : "border border-white/12 text-white/78 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => {
                              setHomeFilters((current) => ({
                                ...current,
                                [chip.group]: removeSelectionGroupValue(current[chip.group], chip.isExclude ? "exclude" : "include", chip.characterId),
                              }));
                            }}
                          >
                            <span>{chip.label}</span>
                            <span className="text-[12px] leading-none">×</span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="mb-8 flex items-center justify-center">
                  <div className="flex items-center overflow-hidden rounded-full border border-white/12 bg-[#262526]/70 w-full max-w-[520px] md:min-w-[520px]">
                    {[
                      { key: "rta", label: "RTAランキング", shortLabel: "RTA" },
                      { key: "char", label: "キャラTOPプレイヤー", shortLabel: "キャラTOP" },
                      { key: "fes", label: "祭典フェス", shortLabel: "フェス" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setLeaderboardView(item.key as LeaderboardView)}
                        className={`flex-1 px-4 py-2.5 text-[13px] font-semibold transition-colors md:text-[14px] ${
                          leaderboardView === item.key ? "bg-white text-[#1f1f20]" : "bg-transparent text-white/68 hover:bg-white/8 hover:text-white"
                        }`}
                        title={item.label}
                        aria-label={item.label}
                      >
                        <span className="md:hidden">{item.shortLabel}</span>
                        <span className="hidden md:inline">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-8 flex flex-wrap items-center gap-y-3">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 px-5 text-[13px] font-semibold tracking-[0.01em] text-white/78 transition-colors hover:bg-white/10 hover:text-white [&>div]:hidden [&>span:last-of-type]:hidden"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <FilterFunnelIcon className="w-5 h-5" />
                    <span className="text-[13px] font-semibold tracking-[0.01em]">
                      {activeFilterCharacterChips.length > 0 ? `${FILTER_TITLE}${activeFilterCharacterChips.length}` : FILTER_TITLE}
                    </span>
                    <div className="text-[13px] font-semibold tracking-[0.01em]">絞り込み</div>
                    <span>絞り込み</span>
                  </button>
                  {activeFilterCharacterChips.length > 0 ? (
                    <>
                      <span className="ml-3 mr-2 hidden text-[14px] font-medium text-white/42">：</span>
                      <p className="ml-3 mr-2 text-[14px] font-medium text-white/42">{"\uFF1A"}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {activeFilterCharacterChips.map((chip) => (
                          <button
                            key={`${chip.isExclude ? "exclude" : "include"}-${chip.characterId}`}
                            type="button"
                            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-colors ${
                              chip.isExclude
                                ? "border border-[#6e4a4a] text-white/76 hover:bg-[#3a2626]"
                                : "border border-white/12 text-white/78 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => {
                              setHomeFilters((current) => ({
                                ...current,
                                [chip.group]: removeSelectionGroupValue(current[chip.group], chip.isExclude ? "exclude" : "include", chip.characterId),
                              }));
                            }}
                          >
                            <span>{chip.label}</span>
                            <span className="text-[12px] leading-none">{`\u00D7`}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
                  <div className="mb-8 flex items-center justify-between text-[13px] font-semibold md:text-[14px]">
                    {[
                      { label: ALL_LABEL, shortLabel: ALL_LABEL, value: null },
                      { label: "Unlimited", shortLabel: "Unl.", value: 4 as Bracket },
                      { label: "High", shortLabel: "High", value: 3 as Bracket },
                      { label: "Middle", shortLabel: "Mid.", value: 2 as Bracket },
                      { label: "Low", shortLabel: "Low", value: 1 as Bracket },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setFilterBracket(item.value)}
                        className={`flex-1 border-b-2 pb-3 text-center ${
                          filterBracket === item.value || (item.value === null && filterBracket === null)
                            ? "border-white text-white"
                            : "border-transparent text-white/38 hover:text-white/72"
                        }`}
                      >
                        <span className="md:hidden">{item.shortLabel}</span>
                        <span className="hidden md:inline">{item.label}</span>
                      </button>
                    ))}
                  </div>
                  {leaderboardRuns.length > 0 ? (
                    <div>
                      {leaderboardRuns.map((run, index) => (
                        <LeaderboardRow key={run.id} run={run} index={index} onSelect={openRunDetail} view={leaderboardView} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#dcdfe6]">
                      <SearchIcon size={48} className="mx-auto mb-4 text-[#dcdfe6]" />
                      <h3 className="text-lg font-bold text-[#606266]">{NO_RESULTS_LABEL}</h3>
                      <p className="text-sm text-[#909399]">{NO_RESULTS_COPY}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "festival" ? (
          <div className="bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] rounded-2xl p-8 mb-8 text-center relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-white text-xs font-bold mb-3 border border-white/40 backdrop-blur-sm">
                <CalendarIcon size={12} /> SEASON EVENT
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md tracking-tight">Festival Event</h2>
              <p className="text-white/90 text-lg font-bold">ルール別のイベント記録をここに並べる構成です。</p>
            </div>
          </div>
        ) : null}

      </main>

      <footer className="border-t border-white/10 bg-[#212121] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-white/52">
          <div className="mb-4 flex items-center justify-center gap-2 text-white/74">
            <TimerIcon size={20} />
            <span className="text-lg font-bold">Teyvat EliteDB</span>
          </div>
          <p className="mb-2">Community Driven Elite Hunting RTA Database (Prototype)</p>
          <p>Created based on R&apos;s concept &amp; Community Feedback.</p>
        </div>
      </footer>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(nextFilters) => {
          setHomeFilters(cloneHomeFilterState(nextFilters));
        }}
        initialFilters={homeFilters}
        characters={characters}
        tagGroups={tagGroups}
      />
    </HomeShell>
  );
}

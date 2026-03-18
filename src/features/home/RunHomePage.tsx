import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { characterDb, mockRuns, type Bracket, type Character, type Element, type Platform, type RunRecord } from "../../data/mockRuns";
import { FilterDrawer } from "./FilterDrawer";
import { CalendarIcon, FilterFunnelIcon, SearchIcon, TimerIcon } from "./homeIcons";
import {
  applyRLogic,
  applyWRTag,
  buildCharTopRows,
  buildDisplayBucket,
  cloneHomeFilterState,
  createEmptyHomeFilterState,
  filterRuns,
  getBestRun,
  getDefaultSeason,
  matchesHomeFilterState,
  matchesLeaderboardScope,
  normalizeHomeRun,
  removeSelectionGroupValue,
  seasonGte,
  sortRuns,
} from "./homeLogic";
import { LeaderboardRow } from "./LeaderboardRow";
import { TopPlayerCard } from "./TopPlayerCard";
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
  const [runs] = useState<HomeRun[]>(() => applyWRTag(mockRuns.map((run) => normalizeHomeRun(run, FESTIVAL_RULESET))));
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
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(nextFilters) => {
          setHomeFilters(cloneHomeFilterState(nextFilters));
        }}
        initialFilters={homeFilters}
        characters={characters}
        tagGroups={tagGroups}
        title={FILTER_TITLE}
        resetLabel={FILTER_RESET_LABEL}
        applyLabel={FILTER_APPLY_LABEL}
        filterTabs={FILTER_TABS}
        filterTargetOptions={FILTER_TARGET_OPTIONS}
        elementFilterOptions={ELEMENT_FILTER_OPTIONS}
        characterSearchPlaceholder="キャラ名で検索"
        tagSearchPlaceholder="タグ名で検索"
        emptyCharacterResultLabel="該当するキャラがありません"
        emptyTagResultLabel="該当するタグがありません"
      />
    </HomeShell>
  );
}













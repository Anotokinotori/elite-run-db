import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { characterDb, mockRuns, type Bracket, type Platform, type RunRecord } from "../data/mockRuns";

type RankMove = "up" | "down" | "same" | "new";

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

const HERO_IMAGE_URL = "https://pbs.twimg.com/media/G6QnKhYWMAAtYMl.jpg";
const ATTACKER_FILTER_SCOPE: "party" | "main" = "party";
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
const FILTER_APPLY_LABEL = "\u9069\u7528";
const LOADING_LABEL = "\u96c6\u8a08\u4e2d...";
const VIEW_RANKING_LABEL = "\u30e9\u30f3\u30ad\u30f3\u30b0\u3092\u898b\u308b";
const TOP_PLAYERS_LABEL = "TOP\u30d7\u30ec\u30a4\u30e4\u30fc";
const FEATURED_PLAYERS_LABEL = "\u6ce8\u76ee\u30d7\u30ec\u30a4\u30e4\u30fc";
const LEADERBOARD_LABEL = "\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9";
const ALL_LABEL = "\u5168\u3066";
const FIRST_POST_LABEL = "\u521d\u6295\u7a3f \u65b0\u3057\u3044\u72e9\u308a\u4ef2\u9593\uff01";
const OFFMETA_PICKUP_LABEL = "\u958b\u62d3\u8005 \u4f7f\u7528\u73875%\u672a\u6e80\u7de8\u6210";
const NO_RESULTS_LABEL = "\u8a18\u9332\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093";
const NO_RESULTS_COPY = "\u6761\u4ef6\u3092\u5909\u66f4\u3059\u308b\u304b\u3001\u65b0\u3057\u3044\u8a18\u9332\u306e\u8ffd\u52a0\u3092\u304a\u5f85\u3061\u304f\u3060\u3055\u3044\u3002";
const OTHER_RULESET_TABS = ["Npui別", "武器別", "マルチPUI", "マルチUI", "マルチUA"];

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

function parseAttackerInput(input: string) {
  return input
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((token) => CHAR_NAME_TO_ID[token.toLowerCase()] ?? token);
}

function matchesAttackerFilter(run: HomeRun, includeIds: string[], excludeIds: string[], includeMode: "and" | "or" = "or") {
  const partyIds =
    ATTACKER_FILTER_SCOPE === "main" ? [run.mainAttackerId] : [run.mainAttackerId, ...run.supportIds];

  const hasInclude =
    includeIds.length === 0 ||
    (includeMode === "and"
      ? includeIds.every((id) => partyIds.includes(id))
      : includeIds.some((id) => partyIds.includes(id)));
  const hasExclude = excludeIds.some((id) => partyIds.includes(id));

  return hasInclude && !hasExclude;
}

function filterRuns(
  runs: HomeRun[],
  filters: {
    season: string;
    isFestival: boolean | null;
    bracket: Bracket | null;
    platform: Platform | null;
    includeIds: string[];
    excludeIds: string[];
    includeMode: "and" | "or";
  },
) {
  return runs.filter((run) => {
    if (filters.season && !seasonGte(run.season, filters.season)) {
      return false;
    }

    if (filters.isFestival !== null && run.isFestival !== filters.isFestival) {
      return false;
    }

    if (filters.bracket && run.bracket !== filters.bracket) {
      return false;
    }

    if (filters.platform && run.platform !== filters.platform) {
      return false;
    }

    return matchesAttackerFilter(run, filters.includeIds, filters.excludeIds, filters.includeMode);
  });
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

function sortRuns(runs: HomeRun[], sortMode: "time" | "cost" | "date") {
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

function LikeIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 11v9H4v-9h3zm3.6-6.5L7 11v9h9.1c.8 0 1.5-.5 1.7-1.2l1.7-6.1c.3-1.1-.5-2.2-1.7-2.2H13V6c0-1.1-.9-2-2-2h-.4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 18l-3 3V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
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
      <path d="M2 13c0-2 2-3 4-3h12c2 0 4 1 4 3v3c0 1.5-1.5 3-3 3-1.5 0-2.5-1-3-2l-1.5-2h-5l-1.5 2c-.5 1-1.5 2-3 2-1.5 0-3-1.5-3-3v-3z" />
      <rect x="8" y="11" width="8" height="3" rx="0.5" />
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
}: {
  label: string;
  run: HomeRun | null;
  theme: { gradient: string };
  onView: () => void;
  onSelect: (runId: string) => void;
}) {
  if (!run) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-[#ebebeb] shadow-sm overflow-hidden hover:shadow-md transition-all">
        <div className={`relative h-28 w-full bg-gradient-to-r ${theme.gradient}`}>
          <div className="absolute top-3 left-4 z-10">
            <div className="text-white font-bold text-xl drop-shadow-md">{label}</div>
          </div>
        </div>
        <div className="p-3 bg-white flex flex-col justify-between flex-1 relative z-10">
          <div className="text-sm text-[#606266]">{LOADING_LABEL}</div>
          <button type="button" onClick={onView} className="mt-4 text-sm text-black border border-[#dcdfe6] rounded-full px-3 py-1 bg-black/5">
            {VIEW_RANKING_LABEL}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-[#ebebeb] shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => onSelect(run.id)}>
      <div className={`relative h-28 w-full bg-gradient-to-r ${theme.gradient}`}>
        <div className="absolute top-3 left-4 z-10">
          <div className="text-white font-bold text-xl drop-shadow-md">{label}</div>
          <div className="text-white/85 text-sm mt-1">{run.userName}</div>
        </div>
        <CharacterImage
          characterId={run.mainAttackerId}
          alt={run.mainAttacker}
          className="absolute -bottom-6 -right-6 w-48 h-auto object-cover z-0 opacity-90 drop-shadow-lg pointer-events-none"
        />
      </div>
      <div className="p-4 bg-white flex flex-col justify-between flex-1 relative z-10">
        <div>
          <div className="flex items-center justify-end gap-2 mt-2 text-[16px] text-black">
            <button type="button" className="border border-[#dcdfe6] rounded-full px-2 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
              <LikeIcon size={14} className="text-black" />
            </button>
            <button type="button" className="border border-[#dcdfe6] rounded-full px-2 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
              <CommentIcon size={14} className="text-black" />
            </button>
          </div>
        </div>
        <div className="bg-[#f7f7f7] border border-black/10 rounded-lg p-2 mt-3">
          <div className="flex items-center justify-between">
            {run.party.map((member, index) => (
              <CharacterImage
                key={`${run.id}-${member.characterId}-${index}`}
                characterId={member.characterId}
                alt={characterDb[member.characterId]?.name ?? member.characterId}
                variant="circle"
                className="w-9 h-9 rounded-full object-cover"
              />
            ))}
          </div>
          <div className="text-[20px] font-semibold text-black text-center mt-2">{run.time}</div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onView();
          }}
          className="mt-4 text-sm text-black border border-[#dcdfe6] rounded-full px-3 py-1 bg-black/5"
        >
          {VIEW_RANKING_LABEL}
        </button>
      </div>
    </div>
  );
}

function LeaderboardRow({
  run,
  index,
  onSelect,
}: {
  run: HomeRun;
  index: number;
  onSelect: (runId: string) => void;
}) {
  const PlatformIcon = PLATFORM_ICONS[run.platform] ?? PLATFORM_ICONS.PC;

  return (
    <div className="border-t border-[#ebebeb] py-3 cursor-pointer" onClick={() => onSelect(run.id)}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="w-6 md:w-6 flex items-center justify-center text-black/80">
            <RankMoveIcon move={run.rankMove} className="w-5 h-5 md:w-5 md:h-5" />
          </div>
          <div className="text-[22px] md:text-[24px] w-9 md:w-10 text-center font-semibold">{index + 1}</div>
          <CharacterImage
            characterId={run.mainAttackerId}
            alt={characterDb[run.mainAttackerId]?.name ?? run.mainAttackerId}
            variant="circle"
            className="w-10 h-10 md:w-10 md:h-10 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="text-[19px] md:text-[22px] font-semibold truncate">{run.userName}</div>
              <div className="hidden md:inline-flex text-[12px] px-2 py-0.5 rounded bg-black/5 border border-black/10">{getBracketLabel(run.bracket)}</div>
            </div>
          </div>
          <div className="ml-auto text-[22px] font-semibold md:hidden">{run.time}</div>
          <div className="hidden md:flex w-10 h-10 rounded-full bg-black/5 border border-black/10 items-center justify-center">
            <PlatformIcon className="w-5 h-5 text-black" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button type="button" className="border border-[#dcdfe6] rounded-full px-2 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
            <LikeIcon size={14} className="text-black" />
          </button>
          <button type="button" className="border border-[#dcdfe6] rounded-full px-2 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
            <CommentIcon size={14} className="text-black" />
          </button>
          <div className="text-[24px] font-semibold w-20 text-right">{run.time}</div>
          <a
            className="border border-[#dcdfe6] rounded-full w-8 h-8 flex items-center justify-center"
            href={run.videoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5l11 7-11 7V5z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 md:hidden mt-1.5">
        <div className="flex items-center gap-2">
          <div className="text-[11px] px-1.5 py-0.5 rounded bg-black/5 border border-black/10">{getBracketLabel(run.bracket)}</div>
          <div className="w-7 h-7 rounded-full bg-black/5 border border-black/10 flex items-center justify-center">
            <PlatformIcon className="w-3.5 h-3.5 text-black" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="border border-[#dcdfe6] rounded-full px-1.5 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
            <LikeIcon size={13} className="text-black" />
          </button>
          <button type="button" className="border border-[#dcdfe6] rounded-full px-1.5 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
            <CommentIcon size={13} className="text-black" />
          </button>
          <a
            className="border border-[#dcdfe6] rounded-full w-7 h-7 flex items-center justify-center"
            href={run.videoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5l11 7-11 7V5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function FilterModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="bg-white text-[#333333] rounded-2xl max-w-5xl w-full max-h-[85vh] shadow-sm border border-[#ebebeb] flex flex-col" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ebebeb] shrink-0">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#909399]">Filter Catalog</div>
            <div className="text-2xl font-semibold">{FILTER_TITLE}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#f4f4f5] rounded-full border border-[#ebebeb] overflow-hidden">
              {[
                { key: "and", label: "かつ" },
                { key: "or", label: "または" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`px-4 py-1.5 text-xs font-semibold ${includeMode === item.key ? "bg-cyan-400 text-black" : "text-[#909399]"}`}
                  onClick={() => setIncludeMode(item.key as "and" | "or")}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rounded-full border border-[#dcdfe6] w-8 h-8 flex items-center justify-center text-[#606266]"
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#606266]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8 overflow-y-auto flex-1">
          <div>
            <div className="text-sm font-semibold text-[#606266] mb-3">{FILTER_INCLUDE_LABEL}</div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {characters.map((character) => {
                const active = includeIds.includes(character.id);
                return (
                  <button
                    key={`include-${character.id}`}
                    type="button"
                    className={`relative aspect-square rounded-md border transition-all ${active ? "bg-[#e8f4ff] border-[#6aa8ff]" : "bg-[#f4f4f5] border-[#ebebeb] hover:border-[#c0c4cc]"}`}
                    onClick={() => toggleInclude(character.id)}
                  >
                    <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="w-full h-full object-cover rounded-md" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#606266] mb-3">{FILTER_EXCLUDE_LABEL}</div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {characters.map((character) => {
                const active = excludeIds.includes(character.id);
                return (
                  <button
                    key={`exclude-${character.id}`}
                    type="button"
                    className={`relative aspect-square rounded-md border transition-all ${active ? "bg-[#ffecec] border-[#ff6b6b]" : "bg-[#f4f4f5] border-[#ebebeb] hover:border-[#c0c4cc]"}`}
                    onClick={() => toggleExclude(character.id)}
                  >
                    <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="w-full h-full object-cover rounded-md" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#606266] mb-3">{FILTER_PLATFORM_LABEL}</div>
            <div className="flex flex-wrap items-center gap-3">
              {(["PC", "PS5", "Mobile"] as Platform[]).map((item) => {
                const Icon = PLATFORM_ICONS[item];
                const active = platform === item;

                return (
                  <button
                    key={item}
                    type="button"
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border text-sm ${active ? "bg-cyan-400 text-black border-cyan-300" : "bg-white text-[#606266] border-[#dcdfe6]"}`}
                    onClick={() => setPlatform(active ? null : item)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-[#ebebeb] flex items-center justify-between shrink-0">
          <button
            type="button"
            className="text-sm text-[#909399] underline"
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
            <button type="button" className="px-4 py-2 rounded-full border border-[#dcdfe6] text-sm text-[#606266]" onClick={onClose}>
              {FILTER_CANCEL_LABEL}
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-cyan-400 text-black text-sm font-semibold"
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

function HomeShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen text-[#333333] font-sans pb-20 bg-[#f0f2f5]">{children}</div>;
}

export function RunHomePage({
  onRequestSubmit,
  onSelectRun,
}: {
  onRequestSubmit: () => void;
  onSelectRun: (runId: string) => void;
}) {
  const leaderboardRef = useRef<HTMLDivElement | null>(null);
  const topRowRef = useRef<HTMLDivElement | null>(null);
  const [runs] = useState<HomeRun[]>(() => applyWRTag(mockRuns.map(normalizeHomeRun)));
  const [activeSeason, setActiveSeason] = useState(getDefaultSeason(SEASONS));
  const [activeTab] = useState<"main" | "festival">("main");
  const [filterBracket, setFilterBracket] = useState<Bracket | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<Platform | null>(null);
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [includeMode, setIncludeMode] = useState<"and" | "or">("or");
  const [sortMode] = useState<"time" | "cost" | "date">("time");
  const [enableRLogic] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subHeaderTab, setSubHeaderTab] = useState<string>("NPUI");
  const [leaderboardView, setLeaderboardView] = useState<"rta" | "char" | "fes">("rta");
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false);
  const [showTopScrollLeft, setShowTopScrollLeft] = useState(false);
  const [showTopScrollRight, setShowTopScrollRight] = useState(false);

  const includeIds = useMemo(() => parseAttackerInput(includeInput), [includeInput]);
  const excludeIds = useMemo(() => parseAttackerInput(excludeInput), [excludeInput]);
  const characters = useMemo(() => Object.values(characterDb), []);

  const filters = useMemo(
    () => ({
      season: activeSeason,
      isFestival: activeTab === "festival",
      bracket: filterBracket,
      platform: filterPlatform,
      includeIds,
      excludeIds,
      includeMode,
    }),
    [activeSeason, activeTab, excludeIds, filterBracket, filterPlatform, includeIds, includeMode],
  );

  const filteredBase = useMemo(() => filterRuns(runs, filters), [filters, runs]);
  const rLogicApplied = useMemo(() => (enableRLogic ? applyRLogic(filteredBase) : filteredBase), [enableRLogic, filteredBase]);
  const filteredRuns = useMemo(() => sortRuns(rLogicApplied, sortMode), [rLogicApplied, sortMode]);
  const charTopRuns = useMemo(() => {
    const bestByAttacker = new Map<string, HomeRun>();

    rLogicApplied.forEach((run) => {
      const current = bestByAttacker.get(run.mainAttackerId);
      if (!current || toSeconds(run.time) < toSeconds(current.time)) {
        bestByAttacker.set(run.mainAttackerId, run);
      }
    });

    return Array.from(bestByAttacker.values()).sort((left, right) => toSeconds(left.time) - toSeconds(right.time));
  }, [rLogicApplied]);
  const leaderboardRuns = leaderboardView === "char" ? charTopRuns : filteredRuns;
  const heroRuns = useMemo(() => runs.filter((run) => seasonGte(run.season, activeSeason) && !run.isFestival), [activeSeason, runs]);

  const updateTopScrollButtons = () => {
    if (!topRowRef.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = topRowRef.current;
    setShowTopScrollLeft(scrollLeft > 10);
    setShowTopScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    updateTopScrollButtons();
    window.addEventListener("resize", updateTopScrollButtons);

    return () => window.removeEventListener("resize", updateTopScrollButtons);
  }, [activeTab, heroRuns.length]);

  const scrollToLeaderboard = () => {
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openRunDetail = (runId: string) => {
    onSelectRun(runId);
  };

  return (
    <HomeShell>
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

      {activeTab === "main" ? (
        <div
          className="relative w-full h-[320px] md:h-[560px] overflow-hidden mb-8 bg-center bg-cover"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
          aria-label="Hero visual"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f0f2f5]" />
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "main" ? (
          <>
            <div className="relative z-10 -mt-40 md:-mt-72 mb-12">
              <div className="relative">
                <div ref={topRowRef} className="flex gap-6 overflow-x-auto no-scrollbar" onScroll={updateTopScrollButtons}>
                  <div className="bg-white rounded-xl border border-black/10 p-4 md:p-6 shadow-sm min-w-[780px] flex-shrink-0">
                    <div className="text-[18px] font-semibold text-black mb-3">{TOP_PLAYERS_LABEL}</div>
                    <div className="grid grid-cols-4 gap-4 min-w-[900px]">
                      {[
                        { label: "Unlimited 1st", bracket: 4 as Bracket, theme: { gradient: "from-[#274060] to-[#1b2f45]" } },
                        { label: "High 1st", bracket: 3 as Bracket, theme: { gradient: "from-[#2c3e3d] to-[#1e2c2b]" } },
                        { label: "Middle 1st", bracket: 2 as Bracket, theme: { gradient: "from-[#3d2a4a] to-[#2b1f35]" } },
                        { label: "Low 1st", bracket: 1 as Bracket, theme: { gradient: "from-[#4a3528] to-[#2f231c]" } },
                      ].map((item) => (
                        <TopPlayerCard
                          key={item.label}
                          label={item.label}
                          run={getBestRun(heroRuns.filter((run) => run.bracket === item.bracket))}
                          theme={item.theme}
                          onView={() => {
                            setFilterBracket(item.bracket);
                            setLeaderboardView("rta");
                            scrollToLeaderboard();
                          }}
                          onSelect={openRunDetail}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-black/10 p-4 md:p-6 shadow-sm min-w-[240px] flex-shrink-0">
                    <div className="text-[18px] font-semibold text-black mb-3">{FEATURED_PLAYERS_LABEL}</div>
                    <div className="space-y-4">
                      {[
                        { title: FIRST_POST_LABEL, run: getBestRun(heroRuns.filter((run) => run.tags.includes("New"))) },
                        { title: OFFMETA_PICKUP_LABEL, run: getBestRun(heroRuns.filter((run) => run.tags.includes("OffMeta"))) },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="border border-black/10 rounded-lg p-3 relative overflow-hidden shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                          onClick={() => {
                            if (item.run) {
                              openRunDetail(item.run.id);
                            }
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
                          <div className="text-black font-medium">{item.title}</div>
                          {item.run ? (
                            <div className="mt-2">
                              <div className="text-[14px] text-black">{item.run.userName}</div>
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-end items-center gap-2 text-[16px] text-black">
                                  <button type="button" className="border border-[#dcdfe6] rounded-full px-2 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
                                    <LikeIcon size={14} className="text-black" />
                                  </button>
                                  <button type="button" className="border border-[#dcdfe6] rounded-full px-2 py-0.5 bg-white/80" onClick={(event) => event.stopPropagation()}>
                                    <CommentIcon size={14} className="text-black" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  {item.run.party.map((member, index) => (
                                    <CharacterImage
                                      key={`${item.run?.id}-${member.characterId}-${index}`}
                                      characterId={member.characterId}
                                      alt={characterDb[member.characterId]?.name ?? member.characterId}
                                      variant="circle"
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 text-sm text-[#606266]">{LOADING_LABEL}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {showTopScrollLeft ? (
                  <button
                    type="button"
                    className="flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border border-[#dcdfe6] rounded-full w-8 h-8 items-center justify-center z-20 shadow-sm"
                    aria-label="Scroll left"
                    onClick={() => {
                      topRowRef.current?.scrollBy({ left: -320, behavior: "smooth" });
                      window.setTimeout(updateTopScrollButtons, 350);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 6l-6 6 6 6" />
                    </svg>
                  </button>
                ) : null}

                {showTopScrollRight ? (
                  <button
                    type="button"
                    className="flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border border-[#dcdfe6] rounded-full w-8 h-8 items-center justify-center z-20 shadow-sm"
                    aria-label="Scroll right"
                    onClick={() => {
                      topRowRef.current?.scrollBy({ left: 320, behavior: "smooth" });
                      window.setTimeout(updateTopScrollButtons, 350);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                ) : null}
              </div>
            </div>

            <div ref={leaderboardRef} className="bg-white rounded-xl border border-black/10 p-4 md:p-6 shadow-sm mb-10">
              <div className="text-[20px] font-semibold text-black mb-4">{LEADERBOARD_LABEL}</div>
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center border border-[#dcdfe6] rounded-full overflow-hidden w-full max-w-[520px] md:min-w-[520px]">
                  {[
                    { key: "rta", label: "RTAランキング", shortLabel: "RTA" },
                    { key: "char", label: "キャラTOPプレイヤー", shortLabel: "キャラTOP" },
                    { key: "fes", label: "祭典フェス", shortLabel: "フェス" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setLeaderboardView(item.key as "rta" | "char" | "fes")}
                      className={`px-4 py-1.5 text-sm font-medium flex-1 ${leaderboardView === item.key ? "bg-black text-white" : "bg-white text-black"}`}
                      title={item.label}
                      aria-label={item.label}
                    >
                      <span className="md:hidden">{item.shortLabel}</span>
                      <span className="hidden md:inline">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center mb-3">
                <button type="button" className="border border-[#dcdfe6] rounded-full w-9 h-9 flex items-center justify-center" onClick={() => setIsFilterOpen(true)}>
                  <FilterFunnelIcon className="w-5 h-5 text-black" />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm font-medium mb-4">
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
                    className={`pb-2 border-b-2 flex-1 text-center ${
                      filterBracket === item.value || (item.value === null && filterBracket === null)
                        ? "border-black text-black"
                        : "border-transparent text-[#909399] hover:text-black"
                    }`}
                  >
                    <span className="md:hidden">{item.shortLabel}</span>
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                ))}
              </div>
              <div>
                {leaderboardRuns.map((run, index) => (
                  <LeaderboardRow key={run.id} run={run} index={index} onSelect={openRunDetail} />
                ))}
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

        {leaderboardRuns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#dcdfe6]">
            <SearchIcon size={48} className="mx-auto mb-4 text-[#dcdfe6]" />
            <h3 className="text-lg font-bold text-[#606266]">{NO_RESULTS_LABEL}</h3>
            <p className="text-sm text-[#909399]">{NO_RESULTS_COPY}</p>
          </div>
        ) : null}
      </main>

      <footer className="mt-20 border-t border-[#ebebeb] bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-[#909399] text-sm">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
            <TimerIcon size={20} />
            <span className="font-bold text-lg">Teyvat EliteDB</span>
          </div>
          <p className="mb-2">Community Driven Elite Hunting RTA Database (Prototype)</p>
          <p>Created based on R&apos;s concept &amp; Community Feedback.</p>
        </div>
      </footer>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onReset={() => {
          setIncludeInput("");
          setExcludeInput("");
          setFilterPlatform(null);
        }}
        onApply={({ includeIds: nextInclude, excludeIds: nextExclude, platform, includeMode: nextIncludeMode }) => {
          setIncludeInput(nextInclude.join(","));
          setExcludeInput(nextExclude.join(","));
          setFilterPlatform(platform ?? null);
          setIncludeMode(nextIncludeMode);
        }}
        initialIncludeIds={includeIds}
        initialExcludeIds={excludeIds}
        initialPlatform={filterPlatform}
        initialIncludeMode={includeMode}
        characters={characters}
      />
    </HomeShell>
  );
}

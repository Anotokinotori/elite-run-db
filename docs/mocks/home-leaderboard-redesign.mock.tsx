// Reference-only mock captured from the discarded leaderboard IA redesign exploration.
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { characterDb, mockRuns, type Bracket, type Platform, type RunRecord } from "../../src/data/mockRuns";

type RankMove = "up" | "down" | "same" | "new";

type HomeRun = RunRecord & {
  userId: string;
  supportIds: string[];
  mainAttacker: string;
  isFestival: boolean;
  rankMove: RankMove;
};

type LeaderboardScope = {
  season: string;
  ruleset: string | "all";
  bracket: Bracket | null;
};

type AttackerOverviewItem = {
  attackerId: string;
  attackerName: string;
  count: number;
  bestRun: HomeRun;
  bestTime: string;
};

type RecordDisplayMode = "all" | "representative";

const HERO_IMAGE_URL = "https://pbs.twimg.com/media/G6QnKhYWMAAtYMl.jpg";
const FESTIVAL_RULESET = "祭典";
const ATTACKER_FILTER_SCOPE: "party" | "main" = "party";
const SEASONS = ["Luna3", "Luna2", "Luna1", "5.8", "5.7", "5.6", "5.5", "5.4", "5.3", "5.2", "5.1", "5.0"];
const APP_TITLE = "精鋭狩りDB";
const SUBMIT_LABEL = "記録提出";
const LEADERBOARD_LABEL = "リーダーボード";
const VIEW_RANKING_LABEL = "ランキングを見る";
const FILTER_TITLE = "絞り込み";
const FILTER_MAIN_ATTACKER_LABEL = "メインアタッカー";
const FILTER_INCLUDE_LABEL = "編成に含む";
const FILTER_EXCLUDE_LABEL = "編成から除外";
const FILTER_PLATFORM_LABEL = "プラットフォーム";
const FILTER_RESET_LABEL = "リセット";
const FILTER_CANCEL_LABEL = "キャンセル";
const FILTER_APPLY_LABEL = "適用";
const FILTER_MODE_AND_LABEL = "すべて";
const FILTER_MODE_OR_LABEL = "いずれか";
const FILTER_DRAWER_DESCRIPTION = "メインアタッカーと編成条件を分けて、観たい動画を探しやすくします。";
const DISPLAY_MODE_ALL_LABEL = "全記録";
const DISPLAY_MODE_REPRESENTATIVE_LABEL = "代表記録のみ";
const RULESET_ALL_LABEL = "すべてのルール";
const ATTACKER_ALL_LABEL = "全アタッカー";
const QUICK_FILTER_LABEL = "現在の条件";
const CLEAR_FILTERS_LABEL = "条件を全解除";
const ATTACKER_OVERVIEW_LABEL = "メインアタッカー概要";
const ATTACKER_OVERVIEW_COPY = "件数と最速タイムで、今見ている範囲の編成幅を把握できます。";
const SCOPE_LABEL = "スコープ";
const BEST_TIME_LABEL = "最速";
const RECORD_COUNT_SUFFIX = "件";
const PARTY_INCLUDE_MODE_LABEL = "含む条件";
const DETAILS_BUTTON_LABEL = "詳細絞り込み";
const TOP_PLAYERS_LABEL = "TOPプレイヤー";
const FEATURED_PLAYERS_LABEL = "注目プレイヤー";
const FIRST_POST_LABEL = "初投稿 新しい狩り仲間！";
const OFFMETA_PICKUP_LABEL = "開拓者 使用率5%未満編成";
const NO_RESULTS_LABEL = "記録が見つかりません";
const NO_RESULTS_COPY = "条件を変更するか、新しい記録の追加をお待ちください。";
const RECORD_META_SEPARATOR = "·";

const TOP_BRACKET_CARDS = [
  { label: "Unlimited 1st", bracket: 4 as Bracket, theme: { gradient: "from-[#274060] to-[#1b2f45]" } },
  { label: "High 1st", bracket: 3 as Bracket, theme: { gradient: "from-[#2c3e3d] to-[#1e2c2b]" } },
  { label: "Middle 1st", bracket: 2 as Bracket, theme: { gradient: "from-[#3d2a4a] to-[#2b1f35]" } },
  { label: "Low 1st", bracket: 1 as Bracket, theme: { gradient: "from-[#4a3528] to-[#2f231c]" } },
] as const;

const HOME_SECTION_PANEL_CLASS = "relative overflow-hidden rounded-[20px] bg-[#323232] drop-shadow-xl";
const HOME_SECTION_PANEL_INNER_CLASS = "relative z-[1] m-[2px] rounded-[18px] bg-[#282828] text-white/90";
const HOME_SECTION_TITLE_CLASS = "text-[17px] font-bold tracking-[0.01em] text-white md:text-[18px]";
const HOME_SECTION_REFLECTION_TOP_CLASS =
  "pointer-events-none absolute inset-x-[18px] top-[1px] h-[22px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.05)_42%,rgba(255,255,255,0))] blur-[10px]";
const HOME_SECTION_REFLECTION_CORNER_CLASS =
  "pointer-events-none absolute -left-[10%] -top-[24%] h-44 w-72 rounded-full bg-white/52 blur-[60px]";
const HOME_ICON_BUTTON_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-white/78 transition-colors hover:bg-white/[0.14] hover:text-white";
const HOME_LIKE_ACTIVE_ICON_CLASS = "text-[#ff8ea1]";
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

const UI_MIRRORS = ["https://api.ambr.top/assets/UI/", "https://enka.network/ui/", "http://file.microgg.cn/ui/"] as const;
const IMAGE_PATTERNS = {
  portrait: (name: string) => `UI_Gacha_AvatarImg_${name}.png`,
  icon: (name: string) => `UI_AvatarIcon_${name}.png`,
  circle: (name: string) => `UI_AvatarIcon_${name}_Circle.png`,
} as const;
const VARIANT_FALLBACKS = {
  circle: ["circle", "icon"],
  portrait: ["portrait", "icon"],
  icon: ["icon"],
} as const;

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

function normalizeHomeRun(run: RunRecord): HomeRun {
  return {
    ...run,
    userId: run.userHandle,
    supportIds: getRunSupportIds(run),
    mainAttacker: characterDb[run.mainAttackerId]?.name ?? run.mainAttackerId,
    isFestival: run.ruleset === FESTIVAL_RULESET,
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

  return runs.map((run) => ({
    ...run,
    tags: run.id === best.id ? [...run.tags.filter((tag) => tag !== "WR"), "WR"] : run.tags.filter((tag) => tag !== "WR"),
  }));
}

function matchesAttackerFilter(run: HomeRun, includeIds: string[], excludeIds: string[], includeMode: "and" | "or") {
  const partyIds = ATTACKER_FILTER_SCOPE === "main" ? [run.mainAttackerId] : [run.mainAttackerId, ...run.supportIds];
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
    season?: string;
    ruleset?: string | "all";
    bracket: Bracket | null;
    platform: Platform | null;
    mainAttackerId?: string | null;
    includeIds: string[];
    excludeIds: string[];
    includeMode: "and" | "or";
  },
) {
  return runs.filter((run) => {
    if (filters.season && !seasonGte(run.season, filters.season)) {
      return false;
    }

    if (filters.ruleset && filters.ruleset !== "all" && run.ruleset !== filters.ruleset) {
      return false;
    }

    if (filters.bracket && run.bracket !== filters.bracket) {
      return false;
    }

    if (filters.platform && run.platform !== filters.platform) {
      return false;
    }

    if (filters.mainAttackerId && run.mainAttackerId !== filters.mainAttackerId) {
      return false;
    }

    return matchesAttackerFilter(run, filters.includeIds, filters.excludeIds, filters.includeMode);
  });
}

function sortRuns(runs: HomeRun[]) {
  return [...runs].sort((left, right) => toSeconds(left.time) - toSeconds(right.time));
}

function getBestRun(runs: HomeRun[]) {
  if (runs.length === 0) {
    return null;
  }

  return runs.reduce((best, run) => (isBetterRun(run, best) ? run : best), runs[0]);
}

function seasonRank(season: string) {
  const normalized = String(season).trim();
  const lunaMatch = normalized.match(/^Luna\s*(\d+)$/i);

  if (lunaMatch) {
    return 60 + parseInt(lunaMatch[1], 10);
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
  return seasons
    .map((season) => ({ season, rank: seasonRank(season) }))
    .sort((left, right) => right.rank - left.rank)[0]?.season ?? "5.0";
}

function getBracketLongLabel(bracket: Bracket) {
  const labels: Record<Bracket, string> = {
    1: "Low",
    2: "Middle",
    3: "High",
    4: "Unlimited",
  };

  return labels[bracket];
}

function getPartySignature(run: HomeRun) {
  return [...run.party]
    .map((member) => member.characterId)
    .sort()
    .join("|");
}

function getRepresentativeRuns(runs: HomeRun[]) {
  const bestBySignature = new Map<string, HomeRun>();

  runs.forEach((run) => {
    const signature = [run.userId, run.season, run.ruleset, run.platform, getPartySignature(run)].join("|");
    const current = bestBySignature.get(signature);
    if (!current || isBetterRun(run, current)) {
      bestBySignature.set(signature, run);
    }
  });

  return Array.from(bestBySignature.values());
}

function getAttackerOverview(runs: HomeRun[]): AttackerOverviewItem[] {
  const byAttacker = new Map<string, AttackerOverviewItem>();

  runs.forEach((run) => {
    const current = byAttacker.get(run.mainAttackerId);
    if (!current) {
      byAttacker.set(run.mainAttackerId, {
        attackerId: run.mainAttackerId,
        attackerName: characterDb[run.mainAttackerId]?.name ?? run.mainAttacker,
        count: 1,
        bestRun: run,
        bestTime: run.time,
      });
      return;
    }

    current.count += 1;
    if (isBetterRun(run, current.bestRun)) {
      current.bestRun = run;
      current.bestTime = run.time;
    }
  });

  return Array.from(byAttacker.values()).sort((left, right) => {
    const timeDiff = toSeconds(left.bestTime) - toSeconds(right.bestTime);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return right.count - left.count;
  });
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
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function TimerIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9 2h6" />
    </svg>
  );
}

function LikeIcon({ size = 16, className = "", filled = false }: { size?: number; className?: string; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className={`flex items-center justify-center rounded-full bg-black/10 text-[#909399] ${className}`} aria-hidden="true">
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
  liked,
  onToggleLike,
  onView,
  onSelect,
}: {
  label: string;
  run: HomeRun | null;
  theme: { gradient: string };
  liked: boolean;
  onToggleLike: () => void;
  onView: () => void;
  onSelect: (runId: string) => void;
}) {
  if (!run) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#4a494b] bg-[#2b2a2b] shadow-[0_12px_24px_rgba(0,0,0,0.28)]">
        <div className={`relative h-24 w-full bg-gradient-to-r ${theme.gradient}`} />
        <div className="flex flex-1 flex-col justify-between gap-4 bg-[#323132] p-4 text-white/90">
          <div className="text-sm text-white/55">集計中...</div>
          <button type="button" onClick={onView} className={`${HOME_PRIMARY_BUTTON_CLASS} w-full`}>
            {VIEW_RANKING_LABEL}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#4a494b] bg-[#2b2a2b] shadow-[0_12px_24px_rgba(0,0,0,0.28)]" onClick={() => onSelect(run.id)}>
      <div className={`relative h-24 w-full bg-gradient-to-r ${theme.gradient}`}>
        <div className="absolute left-4 top-4 z-10">
          <div className="text-[17px] font-bold text-white">{label}</div>
          <div className="text-[13px] font-medium text-white/80">{run.userName}</div>
        </div>
        <CharacterImage characterId={run.mainAttackerId} alt={run.mainAttacker} className="pointer-events-none absolute -bottom-5 -right-5 h-auto w-44 object-cover opacity-85" />
      </div>
      <div className="flex flex-1 flex-col gap-4 bg-[#323132] p-4 text-white/90">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className={HOME_ICON_BUTTON_CLASS}
            onClick={(event) => {
              event.stopPropagation();
              onToggleLike();
            }}
          >
            <LikeIcon size={14} filled={liked} className={liked ? HOME_LIKE_ACTIVE_ICON_CLASS : "text-current"} />
          </button>
        </div>
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
          <div className="mt-3 text-center text-[24px] font-semibold text-white">{run.time}</div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onView();
          }}
          className={`${HOME_PRIMARY_BUTTON_CLASS} w-full`}
        >
          {VIEW_RANKING_LABEL}
        </button>
      </div>
    </div>
  );
}

function AppliedFilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-white/82">
      <span>{label}</span>
      <span className="text-white/50">×</span>
    </button>
  );
}

function AttackerOverviewCard({
  item,
  active,
  onSelect,
}: {
  item: AttackerOverviewItem;
  active: boolean;
  onSelect: (attackerId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.attackerId)}
      className={`flex min-w-[220px] items-center gap-3 rounded-[18px] border px-4 py-3 text-left ${
        active ? "border-cyan-300 bg-cyan-400/12 text-white" : "border-white/10 bg-white/[0.05] text-white/84"
      }`}
    >
      <CharacterImage characterId={item.attackerId} alt={item.attackerName} variant="circle" className="h-12 w-12 rounded-full border border-white/10 object-cover" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-white">{item.attackerName}</div>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-white/58">
          <span>{`${item.count}${RECORD_COUNT_SUFFIX}`}</span>
          <span>{RECORD_META_SEPARATOR}</span>
          <span>{`${BEST_TIME_LABEL} ${item.bestTime}`}</span>
        </div>
      </div>
    </button>
  );
}

function LeaderboardRow({
  run,
  index,
  liked,
  onToggleLike,
  onSelect,
}: {
  run: HomeRun;
  index: number;
  liked: boolean;
  onToggleLike: () => void;
  onSelect: (runId: string) => void;
}) {
  const PlatformIcon = PLATFORM_ICONS[run.platform] ?? PLATFORM_ICONS.PC;

  return (
    <div className="grid cursor-pointer gap-4 border-t border-white/10 py-4 text-white/90 transition-colors hover:bg-white/[0.03] md:grid-cols-[26px_50px_96px_minmax(0,1fr)_130px_52px_118px] md:items-center" onClick={() => onSelect(run.id)}>
      <div className="hidden w-6 items-center justify-center text-white/40 md:flex">
        <RankMoveIcon move={run.rankMove} className="h-4.5 w-4.5" />
      </div>
      <div className="hidden text-center text-[20px] font-semibold text-white md:block">{index + 1}</div>
      <div className="order-1 md:order-none">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">Time</div>
        <div className="mt-1 text-[23px] font-semibold leading-none text-white md:text-[24px]">{run.time}</div>
      </div>
      <div className="order-3 min-w-0 md:order-none">
        <div className="mb-3 flex items-start gap-3">
          <CharacterImage characterId={run.mainAttackerId} alt={run.mainAttacker} variant="circle" className="h-12 w-12 rounded-full border border-white/12 object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate text-[16px] font-semibold text-white md:text-[17px]">{run.mainAttacker}</div>
              <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-100">{getBracketLongLabel(run.bracket)}</div>
            </div>
            <div className="mt-1 truncate text-[13px] font-medium text-white/78">{run.userName}</div>
            <div className="mt-1 truncate text-[12px] text-white/50">
              {run.ruleset} {RECORD_META_SEPARATOR} {run.season}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {run.party.map((member, partyIndex) => (
            <div key={`${run.id}-${member.characterId}-${partyIndex}`} className="rounded-full border border-white/10 bg-white/[0.05] p-[2px]">
              <CharacterImage characterId={member.characterId} alt={characterDb[member.characterId]?.name ?? member.characterId} variant="circle" className="h-9 w-9 rounded-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="order-2 flex items-center justify-between rounded-[16px] border border-white/10 bg-white/[0.05] px-3 py-2 md:order-none md:block md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Cost</div>
          <div className="mt-1 text-[13px] font-medium text-white/78">{getBracketLongLabel(run.bracket)}</div>
          <div className="mt-1 text-[12px] text-white/50">{`Char ${run.charCost} / Wep ${run.weaponCost}`}</div>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <div className="text-center text-[18px] font-semibold text-white">{index + 1}</div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.08]">
            <PlatformIcon className="h-4 w-4 text-white/74" />
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:items-center md:justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08]">
          <PlatformIcon className="h-4.5 w-4.5 text-white/74" />
        </div>
      </div>
      <div className="order-4 flex items-center gap-2 md:order-none md:justify-end">
        <button
          type="button"
          className={HOME_ICON_BUTTON_CLASS}
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike();
          }}
        >
          <LikeIcon size={14} filled={liked} className={liked ? HOME_LIKE_ACTIVE_ICON_CLASS : "text-current"} />
        </button>
        <button type="button" className={HOME_ICON_BUTTON_CLASS} onClick={(event) => event.stopPropagation()}>
          <CommentIcon size={14} className="text-current" />
        </button>
        <a className={HOME_ICON_BUTTON_CLASS} href={run.videoUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5l11 7-11 7V5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialMainAttackerId,
  initialIncludeIds,
  initialExcludeIds,
  initialPlatform,
  initialIncludeMode,
  characters,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    mainAttackerId: string | null;
    includeIds: string[];
    excludeIds: string[];
    platform: Platform | null;
    includeMode: "and" | "or";
  }) => void;
  onReset: () => void;
  initialMainAttackerId: string | null;
  initialIncludeIds: string[];
  initialExcludeIds: string[];
  initialPlatform: Platform | null;
  initialIncludeMode: "and" | "or";
  characters: { id: string; name: string }[];
}) {
  const [mainAttackerId, setMainAttackerId] = useState<string | null>(null);
  const [includeIds, setIncludeIds] = useState<string[]>([]);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [includeMode, setIncludeMode] = useState<"and" | "or">("or");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setMainAttackerId(initialMainAttackerId);
    setIncludeIds(initialIncludeIds);
    setExcludeIds(initialExcludeIds);
    setPlatform(initialPlatform);
    setIncludeMode(initialIncludeMode);
  }, [initialExcludeIds, initialIncludeIds, initialIncludeMode, initialMainAttackerId, initialPlatform, isOpen]);

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
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col border-l border-white/10 bg-[#191919] text-white shadow-[-24px_0_60px_rgba(0,0,0,0.35)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-6">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.26em] text-white/40">Filter Drawer</div>
            <div className="mt-1 text-[24px] font-semibold text-white">{FILTER_TITLE}</div>
            <p className="mt-2 max-w-[520px] text-[13px] leading-[1.6] text-white/56">{FILTER_DRAWER_DESCRIPTION}</p>
          </div>
          <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/72" onClick={onClose} aria-label="Close">
            <span className="text-lg">×</span>
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6 md:px-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold text-white">{FILTER_MAIN_ATTACKER_LABEL}</div>
                <div className="mt-1 text-[12px] text-white/52">自己申告されたメインアタッカーで一覧を絞り込みます。</div>
              </div>
              <button type="button" className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/60" onClick={() => setMainAttackerId(null)}>
                {ATTACKER_ALL_LABEL}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {characters.map((character) => {
                const active = mainAttackerId === character.id;
                return (
                  <button
                    key={`main-${character.id}`}
                    type="button"
                    className={`flex items-center gap-3 rounded-[16px] border px-3 py-3 text-left ${active ? "border-cyan-300 bg-cyan-400/12 text-white" : "border-white/10 bg-white/[0.04] text-white/76"}`}
                    onClick={() => setMainAttackerId((current) => (current === character.id ? null : character.id))}
                  >
                    <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-11 w-11 rounded-full object-cover" />
                    <span className="min-w-0 truncate text-[13px] font-medium">{character.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[15px] font-semibold text-white">{FILTER_INCLUDE_LABEL}</div>
                <div className="mt-1 text-[12px] text-white/52">編成に含まれるキャラを選択します。</div>
              </div>
              <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                {[
                  { key: "and", label: FILTER_MODE_AND_LABEL },
                  { key: "or", label: FILTER_MODE_OR_LABEL },
                ].map((item) => (
                  <button key={item.key} type="button" className={`px-4 py-1.5 text-[12px] font-semibold ${includeMode === item.key ? "bg-cyan-400 text-[#141414]" : "text-white/58"}`} onClick={() => setIncludeMode(item.key as "and" | "or")}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[12px] text-white/45">{PARTY_INCLUDE_MODE_LABEL}</div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {characters.map((character) => {
                const active = includeIds.includes(character.id);
                return (
                  <button key={`include-${character.id}`} type="button" className={`rounded-[16px] border p-2 ${active ? "border-cyan-300 bg-cyan-400/12" : "border-white/10 bg-white/[0.04]"}`} onClick={() => toggleInclude(character.id)}>
                    <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-14 w-14 rounded-full object-cover" />
                    <div className="mt-2 truncate text-[11px] font-medium text-white/76">{character.name}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <div className="text-[15px] font-semibold text-white">{FILTER_EXCLUDE_LABEL}</div>
              <div className="mt-1 text-[12px] text-white/52">見たくないキャラ入り編成を除外します。</div>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {characters.map((character) => {
                const active = excludeIds.includes(character.id);
                return (
                  <button key={`exclude-${character.id}`} type="button" className={`rounded-[16px] border p-2 ${active ? "border-rose-300 bg-rose-400/12" : "border-white/10 bg-white/[0.04]"}`} onClick={() => toggleExclude(character.id)}>
                    <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-14 w-14 rounded-full object-cover" />
                    <div className="mt-2 truncate text-[11px] font-medium text-white/76">{character.name}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <div className="text-[15px] font-semibold text-white">{FILTER_PLATFORM_LABEL}</div>
              <div className="mt-1 text-[12px] text-white/52">必要なときだけデバイス条件を追加します。</div>
            </div>
            <div className="flex flex-wrap gap-3">
              {(["PC", "PS5", "Mobile"] as Platform[]).map((item) => {
                const Icon = PLATFORM_ICONS[item];
                const active = platform === item;
                return (
                  <button
                    key={item}
                    type="button"
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium ${active ? "border-cyan-300 bg-cyan-400/12 text-white" : "border-white/10 bg-white/[0.04] text-white/70"}`}
                    onClick={() => setPlatform((current) => (current === item ? null : item))}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 md:px-6">
          <button type="button" className="text-[13px] font-medium text-white/54 underline decoration-white/20 underline-offset-4" onClick={onReset}>
            {FILTER_RESET_LABEL}
          </button>
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-white/76" onClick={onClose}>
              {FILTER_CANCEL_LABEL}
            </button>
            <button
              type="button"
              className="rounded-full bg-cyan-400 px-5 py-2 text-[13px] font-semibold text-[#141414]"
              onClick={() => {
                onApply({
                  mainAttackerId,
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
  return <div className="min-h-screen bg-[#212121] pb-20 font-sans text-[#333333]">{children}</div>;
}

export function HomeLeaderboardRedesignMock({
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
  const [runs] = useState<HomeRun[]>(() => applyWRTag(mockRuns.map(normalizeHomeRun)));
  const leaderboardSectionRef = useRef<HTMLElement | null>(null);
  const [activeSeasonInternal, setActiveSeasonInternal] = useState(getDefaultSeason(SEASONS));
  const [activeRuleset, setActiveRuleset] = useState<string | "all">("all");
  const [filterBracket, setFilterBracket] = useState<Bracket | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<Platform | null>(null);
  const [selectedAttackerId, setSelectedAttackerId] = useState<string | null>(null);
  const [includeIds, setIncludeIds] = useState<string[]>([]);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);
  const [includeMode, setIncludeMode] = useState<"and" | "or">("or");
  const [displayMode, setDisplayMode] = useState<RecordDisplayMode>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [likedRunState, setLikedRunState] = useState<Record<string, boolean>>({});
  const activeSeason = selectedSeason ?? activeSeasonInternal;
  const setActiveSeason = onSelectedSeasonChange ?? setActiveSeasonInternal;

  const characters = useMemo(() => Object.values(characterDb).sort((left, right) => left.name.localeCompare(right.name)), []);
  const rulesetOptions = useMemo(() => {
    const uniqueRulesets = Array.from(new Set(runs.map((run) => run.ruleset)));
    return [{ value: "all" as const, label: RULESET_ALL_LABEL }, ...uniqueRulesets.map((ruleset) => ({ value: ruleset, label: ruleset }))];
  }, [runs]);

  const leaderboardScope = useMemo<LeaderboardScope>(
    () => ({
      season: activeSeason,
      ruleset: activeRuleset,
      bracket: filterBracket,
    }),
    [activeSeason, activeRuleset, filterBracket],
  );

  const overviewCandidates = useMemo(
    () =>
      filterRuns(runs, {
        season: leaderboardScope.season,
        ruleset: leaderboardScope.ruleset,
        bracket: leaderboardScope.bracket,
        platform: filterPlatform,
        mainAttackerId: null,
        includeIds,
        excludeIds,
        includeMode,
      }),
    [excludeIds, filterPlatform, includeIds, includeMode, leaderboardScope, runs],
  );

  const filteredRuns = useMemo(
    () =>
      filterRuns(runs, {
        season: leaderboardScope.season,
        ruleset: leaderboardScope.ruleset,
        bracket: leaderboardScope.bracket,
        platform: filterPlatform,
        mainAttackerId: selectedAttackerId,
        includeIds,
        excludeIds,
        includeMode,
      }),
    [excludeIds, filterPlatform, includeIds, includeMode, leaderboardScope, runs, selectedAttackerId],
  );

  const overviewSourceRuns = useMemo(() => (displayMode === "representative" ? getRepresentativeRuns(overviewCandidates) : overviewCandidates), [displayMode, overviewCandidates]);
  const attackerOverview = useMemo(() => getAttackerOverview(overviewSourceRuns), [overviewSourceRuns]);
  const leaderboardBaseRuns = useMemo(() => (displayMode === "representative" ? getRepresentativeRuns(filteredRuns) : filteredRuns), [displayMode, filteredRuns]);
  const leaderboardRuns = useMemo(() => sortRuns(leaderboardBaseRuns), [leaderboardBaseRuns]);

  const topSectionRuns = useMemo(
    () =>
      filterRuns(runs, {
        season: activeSeason,
        ruleset: activeRuleset,
        bracket: null,
        platform: null,
        mainAttackerId: null,
        includeIds: [],
        excludeIds: [],
        includeMode: "or",
      }),
    [activeRuleset, activeSeason, runs],
  );

  const appliedChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (selectedAttackerId) {
      chips.push({
        key: `main-${selectedAttackerId}`,
        label: `メイン: ${characterDb[selectedAttackerId]?.name ?? selectedAttackerId}`,
        onRemove: () => setSelectedAttackerId(null),
      });
    }

    includeIds.forEach((characterId) => {
      chips.push({
        key: `include-${characterId}`,
        label: `含む: ${characterDb[characterId]?.name ?? characterId}`,
        onRemove: () => setIncludeIds((current) => current.filter((id) => id !== characterId)),
      });
    });

    if (includeIds.length > 0) {
      chips.push({
        key: "include-mode",
        label: `含む条件: ${includeMode === "and" ? FILTER_MODE_AND_LABEL : FILTER_MODE_OR_LABEL}`,
        onRemove: () => setIncludeMode("or"),
      });
    }

    excludeIds.forEach((characterId) => {
      chips.push({
        key: `exclude-${characterId}`,
        label: `除外: ${characterDb[characterId]?.name ?? characterId}`,
        onRemove: () => setExcludeIds((current) => current.filter((id) => id !== characterId)),
      });
    });

    if (filterPlatform) {
      chips.push({
        key: `platform-${filterPlatform}`,
        label: `Platform: ${filterPlatform}`,
        onRemove: () => setFilterPlatform(null),
      });
    }

    if (displayMode === "representative") {
      chips.push({
        key: "display-representative",
        label: DISPLAY_MODE_REPRESENTATIVE_LABEL,
        onRemove: () => setDisplayMode("all"),
      });
    }

    return chips;
  }, [displayMode, excludeIds, filterPlatform, includeIds, includeMode, selectedAttackerId]);

  const clearQuickFilters = () => {
    setSelectedAttackerId(null);
    setIncludeIds([]);
    setExcludeIds([]);
    setFilterPlatform(null);
    setIncludeMode("or");
    setDisplayMode("all");
  };

  const moveToLeaderboard = () => {
    leaderboardSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBracketCardView = (bracket: Bracket) => {
    setFilterBracket(bracket);
    moveToLeaderboard();
  };

  return (
    <HomeShell>
      {embedded ? null : (
        <nav className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-2 md:px-6 md:py-3">
            <div className="flex items-center gap-4 md:gap-6">
              <h1 className="text-[26px] font-semibold tracking-tight text-black md:text-[38px]">{APP_TITLE}</h1>
              <div className="relative">
                <select className="appearance-none rounded-full border border-black/30 bg-white py-1.5 pl-3 pr-12 text-[16px] font-medium text-black md:pl-4 md:pr-14 md:text-[20px]" value={activeSeason} onChange={(event) => setActiveSeason(event.target.value)}>
                  {SEASONS.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <button type="button" onClick={onRequestSubmit} className="flex h-9 w-9 items-center justify-center rounded-full bg-black px-0 py-0 text-[16px] font-medium text-white md:h-auto md:w-auto md:justify-start md:gap-2 md:px-5 md:py-2.5 md:text-[20px]">
                <span className="text-[20px] leading-none md:text-[22px]">+</span>
                <span className="hidden md:inline">{SUBMIT_LABEL}</span>
              </button>
              <div className="h-9 w-9 rounded-full border border-black/30 bg-white" aria-label="User avatar" />
            </div>
          </div>
        </nav>
      )}

      <div className="relative mb-8 h-[320px] w-full overflow-hidden bg-cover bg-center md:h-[560px]" style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }} aria-label="Hero visual">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#212121]" />
        <div className="absolute inset-x-0 top-0 mx-auto max-w-7xl px-4 pt-5 md:px-6 md:pt-8">
          <div className="max-w-[620px] rounded-[24px] border border-white/20 bg-black/20 p-5 text-white backdrop-blur-sm md:p-6">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Time First, Composition Aware</div>
            <h2 className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-tight md:text-[44px]">タイム順を主軸に、編成とコスト幅も同じ視線で追えるホーム。</h2>
            <p className="mt-3 max-w-[520px] text-[14px] leading-[1.8] text-white/76 md:text-[15px]">RTA の評価軸としての速さは崩さず、メインアタッカー・編成・コスト帯から観たい動画を探しやすい情報設計に寄せています。</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className={HOME_SECTION_PANEL_CLASS}>
            <div className={HOME_SECTION_REFLECTION_TOP_CLASS} />
            <div className={HOME_SECTION_REFLECTION_CORNER_CLASS} />
            <div className={`${HOME_SECTION_PANEL_INNER_CLASS} p-5`}>
              <div className={`${HOME_SECTION_TITLE_CLASS} mb-4`}>{TOP_PLAYERS_LABEL}</div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {TOP_BRACKET_CARDS.map((item) => {
                  const topRun = getBestRun(topSectionRuns.filter((run) => run.bracket === item.bracket));
                  return (
                    <TopPlayerCard
                      key={item.label}
                      label={item.label}
                      run={topRun}
                      theme={item.theme}
                      liked={Boolean(topRun && likedRunState[topRun.id])}
                      onToggleLike={() => topRun && setLikedRunState((current) => ({ ...current, [topRun.id]: !current[topRun.id] }))}
                      onView={() => handleBracketCardView(item.bracket)}
                      onSelect={onSelectRun}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className={HOME_SECTION_PANEL_CLASS}>
            <div className={HOME_SECTION_REFLECTION_TOP_CLASS} />
            <div className={HOME_SECTION_REFLECTION_CORNER_CLASS} />
            <div className={`${HOME_SECTION_PANEL_INNER_CLASS} p-5`}>
              <div className={`${HOME_SECTION_TITLE_CLASS} mb-4`}>{FEATURED_PLAYERS_LABEL}</div>
              <div className="space-y-3">
                {[
                  { title: FIRST_POST_LABEL, run: getBestRun(topSectionRuns.filter((run) => run.tags.includes("New"))) },
                  { title: OFFMETA_PICKUP_LABEL, run: getBestRun(topSectionRuns.filter((run) => run.tags.includes("OffMeta"))) },
                ].map((item) => {
                  const featuredRun = item.run;
                  return (
                    <div key={item.title} className="rounded-[16px] border border-[#4a494b] bg-[#323132] p-4">
                      <div className="text-[15px] font-semibold leading-snug text-white">{item.title}</div>
                      {featuredRun ? (
                        <div className="mt-3 space-y-3">
                          <div className="text-[14px] font-semibold text-white/88">{featuredRun.userName}</div>
                          <div className="flex items-center gap-2.5">
                            {featuredRun.party.map((member, index) => (
                              <CharacterImage key={`${featuredRun.id}-${member.characterId}-${index}`} characterId={member.characterId} alt={characterDb[member.characterId]?.name ?? member.characterId} variant="circle" className="h-9 w-9 rounded-full object-cover" />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-white/55">集計中...</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <section ref={leaderboardSectionRef} className={`${HOME_SECTION_PANEL_CLASS} mb-10`}>
          <div className={HOME_SECTION_REFLECTION_TOP_CLASS} />
          <div className={HOME_SECTION_REFLECTION_CORNER_CLASS} />
          <div className={`${HOME_SECTION_PANEL_INNER_CLASS} p-5 md:p-6`}>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[18px] font-bold tracking-[0.01em] text-white md:text-[20px]">{LEADERBOARD_LABEL}</div>
                <p className="mt-2 max-w-[620px] text-[13px] leading-[1.7] text-white/56">タイム順の評価軸を保ちながら、編成幅とコスト帯を一覧の前段と各行で読めるようにしています。</p>
              </div>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[13px] font-semibold text-white" onClick={() => setIsFilterOpen(true)}>
                <FilterFunnelIcon className="h-4 w-4" />
                <span>{DETAILS_BUTTON_LABEL}</span>
              </button>
            </div>

            <div className="mb-5 rounded-[18px] border border-white/10 bg-white/[0.04] p-4 md:p-5">
              <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-white/42">{SCOPE_LABEL}</div>
              <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div className="relative">
                  <select className="w-full appearance-none rounded-full border border-white/12 bg-[#1f1f1f] py-2.5 pl-4 pr-11 text-[14px] font-medium text-white" value={activeSeason} onChange={(event) => setActiveSeason(event.target.value)}>
                    {SEASONS.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rulesetOptions.map((item) => (
                    <button key={item.value} type="button" onClick={() => setActiveRuleset(item.value)} className={`rounded-full px-4 py-2 text-[13px] font-semibold ${activeRuleset === item.value ? "bg-white text-[#171717]" : "border border-white/10 bg-white/[0.05] text-white/70"}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "全て", value: null },
                  { label: "Low", value: 1 as Bracket },
                  { label: "Middle", value: 2 as Bracket },
                  { label: "High", value: 3 as Bracket },
                  { label: "Unlimited", value: 4 as Bracket },
                ].map((item) => (
                  <button key={item.label} type="button" onClick={() => setFilterBracket(item.value)} className={`rounded-full px-4 py-2 text-[13px] font-semibold ${filterBracket === item.value ? "bg-cyan-400 text-[#171717]" : "border border-white/10 bg-white/[0.05] text-white/70"}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-3">
                <div className="text-[16px] font-semibold text-white">{ATTACKER_OVERVIEW_LABEL}</div>
                <div className="mt-1 text-[12px] text-white/52">{ATTACKER_OVERVIEW_COPY}</div>
              </div>
              {attackerOverview.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                  {attackerOverview.map((item) => (
                    <AttackerOverviewCard key={item.attackerId} item={item} active={selectedAttackerId === item.attackerId} onSelect={(attackerId) => setSelectedAttackerId((current) => (current === attackerId ? null : attackerId))} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[18px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-[13px] text-white/50">
                  現在のスコープではメインアタッカー概要を表示できる記録がありません。
                </div>
              )}
            </div>

            <div className="mb-5 rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/42">{QUICK_FILTER_LABEL}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {appliedChips.length > 0 ? appliedChips.map((chip) => <AppliedFilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />) : <div className="rounded-full border border-dashed border-white/10 px-3 py-1.5 text-[12px] text-white/45">追加条件はありません</div>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                    {[
                      { value: "all" as const, label: DISPLAY_MODE_ALL_LABEL },
                      { value: "representative" as const, label: DISPLAY_MODE_REPRESENTATIVE_LABEL },
                    ].map((item) => (
                      <button key={item.value} type="button" onClick={() => setDisplayMode(item.value)} className={`px-4 py-2 text-[13px] font-semibold ${displayMode === item.value ? "bg-white text-[#171717]" : "text-white/62"}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-white/72" onClick={clearQuickFilters}>
                    {CLEAR_FILTERS_LABEL}
                  </button>
                </div>
              </div>
            </div>

            {leaderboardRuns.length > 0 ? (
              <div>
                {leaderboardRuns.map((run, index) => (
                  <LeaderboardRow key={run.id} run={run} index={index} liked={Boolean(likedRunState[run.id])} onToggleLike={() => setLikedRunState((current) => ({ ...current, [run.id]: !current[run.id] }))} onSelect={onSelectRun} />
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                <SearchIcon size={44} className="mx-auto mb-4 text-white/28" />
                <h3 className="text-lg font-bold text-white/86">{NO_RESULTS_LABEL}</h3>
                <p className="mt-2 text-sm text-white/56">{NO_RESULTS_COPY}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-white/10 bg-[#212121] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-white/52">
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
        onReset={() => {
          setSelectedAttackerId(null);
          setIncludeIds([]);
          setExcludeIds([]);
          setFilterPlatform(null);
          setIncludeMode("or");
        }}
        onApply={({ mainAttackerId, includeIds: nextIncludeIds, excludeIds: nextExcludeIds, platform, includeMode: nextIncludeMode }) => {
          setSelectedAttackerId(mainAttackerId);
          setIncludeIds(nextIncludeIds);
          setExcludeIds(nextExcludeIds);
          setFilterPlatform(platform);
          setIncludeMode(nextIncludeMode);
        }}
        initialMainAttackerId={selectedAttackerId}
        initialIncludeIds={includeIds}
        initialExcludeIds={excludeIds}
        initialPlatform={filterPlatform}
        initialIncludeMode={includeMode}
        characters={characters}
      />
    </HomeShell>
  );
}

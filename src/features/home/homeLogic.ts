import { characterDb, type Bracket, type RunRecord } from "../../data/mockRuns";
import type {
  ActiveFilterChip,
  DisplayBucket,
  FilterTabKey,
  HomeFilterState,
  HomeRun,
  HomeRunWithBucket,
  SelectionGroupState,
  SelectionTarget,
  TagGroup,
} from "./types";

export type ActiveFilterChipDefinition = {
  group: FilterTabKey;
  prefix: string;
  excludePrefix: string;
  resolveLabel: (value: string) => string;
};

export function createEmptySelectionGroup(): SelectionGroupState {
  return {
    includeIds: [],
    excludeIds: [],
    includeMode: "or",
  };
}

export function createEmptyHomeFilterState(): HomeFilterState {
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

export function cloneHomeFilterState(filters: HomeFilterState): HomeFilterState {
  return {
    partyCharacters: cloneSelectionGroup(filters.partyCharacters),
    mainAttackers: cloneSelectionGroup(filters.mainAttackers),
    tags: cloneSelectionGroup(filters.tags),
  };
}

export function updateSelectionGroup(group: SelectionGroupState, target: SelectionTarget, value: string): SelectionGroupState {
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

export function removeSelectionGroupValue(group: SelectionGroupState, target: SelectionTarget, value: string): SelectionGroupState {
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

export function getDeclaredMainAttackerIds(run: Pick<RunRecord, "mainAttackerId" | "declaredMainAttackerIds">) {
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

export function buildDisplayBucket(record: HomeRun, scopeRecords: HomeRun[]): DisplayBucket {
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

export function buildCharTopRows(runs: HomeRunWithBucket[]) {
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

export function getTagGroups(runs: HomeRun[], definitions: TagGroup[], otherLabel = "Other") {
  const presentTags = new Set(runs.flatMap((run) => normalizeRunFilterTags(run)));
  const groups = definitions
    .map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => presentTags.has(tag)),
    }))
    .filter((group) => group.tags.length > 0);
  const knownTags = new Set(groups.flatMap((group) => group.tags));
  const otherTags = Array.from(presentTags)
    .filter((tag) => !knownTags.has(tag))
    .sort((left, right) => left.localeCompare(right));

  if (otherTags.length > 0) {
    groups.push({
      key: "other",
      label: otherLabel,
      tags: otherTags,
    });
  }

  return groups;
}

export function buildActiveFilterChips(filters: HomeFilterState, chipDefinitions: ActiveFilterChipDefinition[]): ActiveFilterChip[] {
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

export function toSeconds(timeStr: string) {
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

export function normalizeHomeRun(run: RunRecord, festivalRuleset: string): HomeRun {
  const supportIds = getRunSupportIds(run);

  return {
    ...run,
    userId: run.userHandle,
    supportIds,
    support: supportIds.map((id) => characterDb[id]?.name ?? id),
    mainAttacker: characterDb[run.mainAttackerId]?.name ?? run.mainAttackerId,
    isFestival: run.ruleset === festivalRuleset,
    wepCost: run.weaponCost,
    categoryKey: makeCategoryKey({
      userId: run.userHandle,
      mainAttackerId: run.mainAttackerId,
      bracket: run.bracket,
      season: run.season,
      isFestival: run.ruleset === festivalRuleset,
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

export function applyWRTag(runs: HomeRun[]) {
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

export function matchesLeaderboardScope(
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

export function matchesHomeFilterState(
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

export function filterRuns<TRun extends HomeRun>(
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

export function applyRLogic(runs: HomeRun[]) {
  const bestByCategory = new Map<string, HomeRun>();

  runs.forEach((run) => {
    const current = bestByCategory.get(run.categoryKey);
    if (!current || isBetterRun(run, current)) {
      bestByCategory.set(run.categoryKey, run);
    }
  });

  return Array.from(bestByCategory.values());
}

export function sortRuns<TRun extends HomeRun>(runs: TRun[], sortMode: "time" | "cost" | "date") {
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

export function getBestRun(runs: HomeRun[]) {
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

export function seasonGte(runSeason: string, selectedSeason: string) {
  if (!selectedSeason) {
    return true;
  }

  return seasonRank(runSeason) <= seasonRank(selectedSeason);
}

export function getDefaultSeason(seasons: string[]) {
  if (seasons.length === 0) {
    return "5.0";
  }

  return (
    seasons
      .map((season) => ({ season, rank: seasonRank(season) }))
      .sort((left, right) => right.rank - left.rank)[0]?.season ?? seasons[seasons.length - 1]
  );
}

export function getBracketLabel(bracket: Bracket) {
  const labels: Record<Bracket, string> = {
    1: "Low",
    2: "Mid.",
    3: "High",
    4: "Unl.",
  };

  return labels[bracket];
}


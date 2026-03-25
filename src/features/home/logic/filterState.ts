import type { Bracket } from "../../../data/mockRuns";
import { getDeclaredMainAttackerIds } from "./displayBuckets";
import { matchesLeaderboardScope } from "./runRecords";
import type { HomeFilterState, HomeRun, SelectionGroupState, SelectionTarget } from "../types";

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

export function normalizeRunFilterTags(run: Pick<HomeRun, "tags" | "platform">) {
  return Array.from(new Set([...run.tags, run.platform]));
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
  // include は AND/OR を切り替え、exclude は常に優先して弾く。
  const hasInclude =
    groupState.includeIds.length === 0 ||
    (groupState.includeMode === "and"
      ? groupState.includeIds.every((id) => normalizedValues.includes(id))
      : groupState.includeIds.some((id) => normalizedValues.includes(id)));
  const hasExclude = groupState.excludeIds.some((id) => normalizedValues.includes(id));

  return hasInclude && !hasExclude;
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



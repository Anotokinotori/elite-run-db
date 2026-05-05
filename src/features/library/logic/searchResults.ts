import { characterDb, weaponDb, type RunRecord } from "../../../data/mockRuns";
import { formatVersionLabel } from "../../../lib/versionLabels";
import { getDeclaredMainAttackerIds } from "../../home/logic";
import type { SelectionGroupState } from "../../home/types";
import { LIBRARY_BUILD_RANGE_LIMITS, type LibraryBuildFilterState, type LibraryCategoryFilterState, type LibrarySearchFilters, type NumericRange } from "../types";

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function sortByNewest(runs: RunRecord[]) {
  return [...runs].sort((left, right) => {
    const dateDiff = new Date(right.date).getTime() - new Date(left.date).getTime();

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return left.id.localeCompare(right.id);
  });
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

function matchesRange(value: number, range: NumericRange) {
  return value >= range.min && value <= range.max;
}

function isDefaultRange(range: NumericRange, limit: NumericRange) {
  return range.min === limit.min && range.max === limit.max;
}

function getFiveStarWeaponCount(run: RunRecord) {
  return run.weapons.filter((weaponLoadout) => weaponDb[weaponLoadout.weaponId]?.tier === "five_star").length;
}

function matchesCharacterFilters(run: RunRecord, filters: LibrarySearchFilters["characterFilters"]) {
  if (!matchesSelectionGroup(run.party.map((member) => member.characterId), filters.partyCharacters)) {
    return false;
  }

  return matchesSelectionGroup(getDeclaredMainAttackerIds(run), filters.mainAttackers);
}

function matchesBuildFilters(run: RunRecord, filters: LibraryBuildFilterState) {
  if (filters.costBracket !== null && run.bracket !== filters.costBracket) {
    return false;
  }

  if (!matchesRange(run.charCost, filters.charCostRange) || !matchesRange(run.weaponCost, filters.weaponCostRange)) {
    return false;
  }

  if (!matchesRange(getFiveStarWeaponCount(run), filters.fiveStarWeaponCountRange)) {
    return false;
  }

  if (filters.maxConstellation !== null && run.party.some((member) => member.cons > filters.maxConstellation!)) {
    return false;
  }

  if (
    filters.maxFiveStarRefinement !== null &&
    run.weapons.some((weaponLoadout) => weaponDb[weaponLoadout.weaponId]?.tier === "five_star" && weaponLoadout.refine > filters.maxFiveStarRefinement!)
  ) {
    return false;
  }

  const runWeaponIds = run.weapons.map((weaponLoadout) => weaponLoadout.weaponId);
  const hasIncludedWeapon = filters.weaponIds.include.length === 0 || filters.weaponIds.include.some((weaponId) => runWeaponIds.includes(weaponId));
  const hasExcludedWeapon = filters.weaponIds.exclude.some((weaponId) => runWeaponIds.includes(weaponId));

  return hasIncludedWeapon && !hasExcludedWeapon;
}

function matchesCategoryFilters(run: RunRecord, filters: LibraryCategoryFilterState) {
  if (filters.ruleset && run.ruleset !== filters.ruleset) {
    return false;
  }

  if (filters.version) {
    const formattedVersion = formatVersionLabel(run.versionLabel || run.season);

    if (filters.version !== formattedVersion && filters.version !== run.versionLabel && filters.version !== run.season) {
      return false;
    }
  }

  if (filters.playStyle && !run.tags.includes(filters.playStyle)) {
    return false;
  }

  if (filters.food && !run.tags.includes(filters.food)) {
    return false;
  }

  if (filters.device && run.platform !== filters.device && !run.tags.includes(filters.device)) {
    return false;
  }

  return true;
}

function matchesTags(run: RunRecord, selectedTags: string[]) {
  return selectedTags.length === 0 || selectedTags.some((tag) => run.tags.includes(tag));
}

function getKeywordValues(run: RunRecord) {
  const partyNames = run.party.map((member) => characterDb[member.characterId]?.name ?? member.characterId);
  const weaponNames = run.weapons.map((weaponLoadout) => weaponDb[weaponLoadout.weaponId]?.name ?? weaponLoadout.weaponId);

  return [
    run.title,
    run.userName,
    run.userHandle,
    run.summary,
    run.platform,
    run.region,
    run.ruleset,
    run.season,
    formatVersionLabel(run.versionLabel || run.season),
    run.time,
    ...run.tags,
    ...partyNames,
    ...weaponNames,
  ];
}

function matchesKeyword(run: RunRecord, keyword: string) {
  const normalizedKeyword = normalizeSearchValue(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  return getKeywordValues(run).some((value) => normalizeSearchValue(value).includes(normalizedKeyword));
}

export function filterLibraryRuns(runs: RunRecord[], filters: LibrarySearchFilters, keyword: string) {
  return sortByNewest(
    runs.filter(
      (run) =>
        matchesKeyword(run, keyword) &&
        matchesCharacterFilters(run, filters.characterFilters) &&
        matchesBuildFilters(run, filters.buildFilters) &&
        matchesCategoryFilters(run, filters.categoryFilters) &&
        matchesTags(run, filters.selectedTags),
    ),
  );
}

export function hasActiveLibrarySearchFilters(filters: LibrarySearchFilters) {
  return (
    filters.characterFilters.partyCharacters.includeIds.length > 0 ||
    filters.characterFilters.partyCharacters.excludeIds.length > 0 ||
    filters.characterFilters.mainAttackers.includeIds.length > 0 ||
    filters.characterFilters.mainAttackers.excludeIds.length > 0 ||
    filters.buildFilters.costBracket !== null ||
    !isDefaultRange(filters.buildFilters.charCostRange, LIBRARY_BUILD_RANGE_LIMITS.charCost) ||
    !isDefaultRange(filters.buildFilters.weaponCostRange, LIBRARY_BUILD_RANGE_LIMITS.weaponCost) ||
    !isDefaultRange(filters.buildFilters.fiveStarWeaponCountRange, LIBRARY_BUILD_RANGE_LIMITS.fiveStarWeaponCount) ||
    filters.buildFilters.maxConstellation !== null ||
    filters.buildFilters.maxFiveStarRefinement !== null ||
    filters.buildFilters.weaponIds.include.length > 0 ||
    filters.buildFilters.weaponIds.exclude.length > 0 ||
    Boolean(filters.categoryFilters.ruleset) ||
    Boolean(filters.categoryFilters.version) ||
    Boolean(filters.categoryFilters.playStyle) ||
    Boolean(filters.categoryFilters.food) ||
    Boolean(filters.categoryFilters.device) ||
    filters.selectedTags.length > 0
  );
}

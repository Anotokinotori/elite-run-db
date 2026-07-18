import { characterDb, weaponDb, type Bracket } from "../../../data/mockRuns";
import { cloneHomeFilterState, createEmptyHomeFilterState } from "../../home/logic";
import {
  LIBRARY_BUILD_RANGE_LIMITS,
  type LibraryBuildFilterState,
  type LibraryCategoryFilterState,
  type LibraryFilterKey,
  type LibrarySearchFilters,
  type NumericRange,
  type SelectableFilterKey,
} from "../types";

export function createEmptyLibraryBuildFilterState(): LibraryBuildFilterState {
  return {
    costBracket: null,
    charCostRange: { ...LIBRARY_BUILD_RANGE_LIMITS.charCost },
    weaponCostRange: { ...LIBRARY_BUILD_RANGE_LIMITS.weaponCost },
    fiveStarWeaponCountRange: { ...LIBRARY_BUILD_RANGE_LIMITS.fiveStarWeaponCount },
    maxConstellation: null,
    maxFiveStarRefinement: null,
    weaponIds: { include: [], exclude: [] },
  };
}

export function createEmptyLibraryCategoryFilterState(): LibraryCategoryFilterState {
  return {
    ruleset: "",
    version: "",
    playStyle: null,
    food: null,
    device: null,
  };
}

export function createEmptyLibrarySearchFilters(): LibrarySearchFilters {
  return {
    characterFilters: createEmptyHomeFilterState(),
    buildFilters: createEmptyLibraryBuildFilterState(),
    categoryFilters: createEmptyLibraryCategoryFilterState(),
    selectedTags: [],
  };
}

export function cloneLibraryBuildFilterState(filters: LibraryBuildFilterState): LibraryBuildFilterState {
  return {
    ...filters,
    charCostRange: { ...filters.charCostRange },
    weaponCostRange: { ...filters.weaponCostRange },
    fiveStarWeaponCountRange: { ...filters.fiveStarWeaponCountRange },
    weaponIds: {
      include: [...filters.weaponIds.include],
      exclude: [...filters.weaponIds.exclude],
    },
  };
}

export function cloneLibraryCategoryFilterState(filters: LibraryCategoryFilterState): LibraryCategoryFilterState {
  return { ...filters };
}

export function cloneLibrarySearchFilters(filters: LibrarySearchFilters): LibrarySearchFilters {
  return {
    characterFilters: cloneHomeFilterState(filters.characterFilters),
    buildFilters: cloneLibraryBuildFilterState(filters.buildFilters),
    categoryFilters: cloneLibraryCategoryFilterState(filters.categoryFilters),
    selectedTags: [...filters.selectedTags],
  };
}

export function isSelectableFilterKey(key: LibraryFilterKey): key is SelectableFilterKey {
  return key !== "search";
}

export function isDefaultRange(value: NumericRange, limit: NumericRange) {
  return value.min === limit.min && value.max === limit.max;
}

export function getFirstActivePanelFromFilters(filters: LibrarySearchFilters): SelectableFilterKey | null {
  const activeCounts = countActiveLibraryFilterSelections(filters);

  if (activeCounts.character > 0) {
    return "character";
  }

  if (activeCounts.weapon > 0) {
    return "weapon";
  }

  if (activeCounts.cost > 0) {
    return "cost";
  }

  if (activeCounts.category > 0) {
    return "category";
  }

  if (activeCounts.tag > 0) {
    return "tag";
  }

  return null;
}

export function countActiveLibraryFilterSelections(filters: LibrarySearchFilters): Record<SelectableFilterKey, number> {
  return {
    character:
      filters.characterFilters.partyCharacters.includeIds.length +
      filters.characterFilters.partyCharacters.excludeIds.length +
      filters.characterFilters.mainAttackers.includeIds.length +
      filters.characterFilters.mainAttackers.excludeIds.length,
    weapon: filters.buildFilters.weaponIds.include.length + filters.buildFilters.weaponIds.exclude.length,
    cost: countActiveCostFilterFields(filters.buildFilters),
    category: countActiveCategoryFilterFields(filters.categoryFilters),
    tag: filters.selectedTags.length,
  };
}

const COST_BRACKET_SUMMARY_LABELS: Record<Bracket, string> = {
  1: "Low",
  2: "Middle",
  3: "High",
  4: "Unlimited",
};

export function buildSelectedFilterSummaryLabels(filters: LibrarySearchFilters): string[] {
  const labels: string[] = [];

  filters.characterFilters.partyCharacters.includeIds.forEach((id) => {
    labels.push(`編成キャラ: ${characterDb[id]?.name ?? id}`);
  });
  filters.characterFilters.partyCharacters.excludeIds.forEach((id) => {
    labels.push(`編成キャラ除外: ${characterDb[id]?.name ?? id}`);
  });
  filters.characterFilters.mainAttackers.includeIds.forEach((id) => {
    labels.push(`メイン: ${characterDb[id]?.name ?? id}`);
  });
  filters.characterFilters.mainAttackers.excludeIds.forEach((id) => {
    labels.push(`メイン除外: ${characterDb[id]?.name ?? id}`);
  });

  filters.buildFilters.weaponIds.include.forEach((id) => {
    labels.push(`武器: ${weaponDb[id]?.name ?? id}`);
  });
  filters.buildFilters.weaponIds.exclude.forEach((id) => {
    labels.push(`武器除外: ${weaponDb[id]?.name ?? id}`);
  });

  if (filters.buildFilters.costBracket !== null) {
    labels.push(`コスト帯: ${COST_BRACKET_SUMMARY_LABELS[filters.buildFilters.costBracket]}`);
  }
  if (!isDefaultRange(filters.buildFilters.charCostRange, LIBRARY_BUILD_RANGE_LIMITS.charCost)) {
    labels.push(`キャラCost: ${formatSummaryRange(filters.buildFilters.charCostRange)}`);
  }
  if (!isDefaultRange(filters.buildFilters.weaponCostRange, LIBRARY_BUILD_RANGE_LIMITS.weaponCost)) {
    labels.push(`武器Cost: ${formatSummaryRange(filters.buildFilters.weaponCostRange)}`);
  }
  if (!isDefaultRange(filters.buildFilters.fiveStarWeaponCountRange, LIBRARY_BUILD_RANGE_LIMITS.fiveStarWeaponCount)) {
    labels.push(`星5武器数: ${formatSummaryRange(filters.buildFilters.fiveStarWeaponCountRange)}`);
  }
  if (filters.buildFilters.maxConstellation !== null) {
    labels.push(`最大凸: C${filters.buildFilters.maxConstellation}`);
  }
  if (filters.buildFilters.maxFiveStarRefinement !== null) {
    labels.push(`最大精錬: R${filters.buildFilters.maxFiveStarRefinement}`);
  }

  if (filters.categoryFilters.ruleset) {
    labels.push(`カテゴリ: ${filters.categoryFilters.ruleset}`);
  }
  if (filters.categoryFilters.version) {
    labels.push(`期間: ${filters.categoryFilters.version}`);
  }
  if (filters.categoryFilters.playStyle) {
    labels.push(`人数: ${filters.categoryFilters.playStyle}`);
  }
  if (filters.categoryFilters.food) {
    labels.push(`飯バフ: ${filters.categoryFilters.food}`);
  }
  if (filters.categoryFilters.device) {
    labels.push(`端末: ${filters.categoryFilters.device}`);
  }

  filters.selectedTags.forEach((tag) => {
    labels.push(`タグ: ${tag}`);
  });

  return labels;
}

function formatSummaryRange(range: NumericRange) {
  return `${range.min}-${range.max}`;
}

function countActiveCostFilterFields(filters: LibraryBuildFilterState) {
  return [
    filters.costBracket !== null,
    !isDefaultRange(filters.charCostRange, LIBRARY_BUILD_RANGE_LIMITS.charCost),
    !isDefaultRange(filters.weaponCostRange, LIBRARY_BUILD_RANGE_LIMITS.weaponCost),
    !isDefaultRange(filters.fiveStarWeaponCountRange, LIBRARY_BUILD_RANGE_LIMITS.fiveStarWeaponCount),
    filters.maxConstellation !== null,
    filters.maxFiveStarRefinement !== null,
  ].filter(Boolean).length;
}

function countActiveCategoryFilterFields(filters: LibraryCategoryFilterState) {
  return [filters.ruleset, filters.version, filters.playStyle, filters.food, filters.device].filter(Boolean).length;
}

export function hasActiveWeaponFilters(filters: LibraryBuildFilterState) {
  return filters.weaponIds.include.length > 0 || filters.weaponIds.exclude.length > 0;
}

export function hasActiveCostFilters(filters: LibraryBuildFilterState) {
  return (
    filters.costBracket !== null ||
    !isDefaultRange(filters.charCostRange, LIBRARY_BUILD_RANGE_LIMITS.charCost) ||
    !isDefaultRange(filters.weaponCostRange, LIBRARY_BUILD_RANGE_LIMITS.weaponCost) ||
    !isDefaultRange(filters.fiveStarWeaponCountRange, LIBRARY_BUILD_RANGE_LIMITS.fiveStarWeaponCount) ||
    filters.maxConstellation !== null ||
    filters.maxFiveStarRefinement !== null
  );
}

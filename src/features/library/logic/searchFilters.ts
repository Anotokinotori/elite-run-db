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
  const characterCount =
    filters.characterFilters.partyCharacters.includeIds.length +
    filters.characterFilters.partyCharacters.excludeIds.length +
    filters.characterFilters.mainAttackers.includeIds.length +
    filters.characterFilters.mainAttackers.excludeIds.length;

  if (characterCount > 0) {
    return "character";
  }

  if (hasActiveWeaponFilters(filters.buildFilters)) {
    return "weapon";
  }

  if (hasActiveCostFilters(filters.buildFilters)) {
    return "cost";
  }

  if (filters.categoryFilters.ruleset || filters.categoryFilters.version || filters.categoryFilters.playStyle || filters.categoryFilters.food || filters.categoryFilters.device) {
    return "category";
  }

  if (filters.selectedTags.length > 0) {
    return "tag";
  }

  return null;
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

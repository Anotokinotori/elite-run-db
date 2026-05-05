import { cloneHomeFilterState, createEmptyHomeFilterState } from "../../home/logic";
import { LIBRARY_BUILD_RANGE_LIMITS, type LibraryBuildFilterState, type LibraryCategoryFilterState, type LibrarySearchFilters } from "../types";

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

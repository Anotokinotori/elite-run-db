import type { Bracket } from "../../data/mockRuns";
import type { HomeFilterState } from "../home/types";

export type NumericRange = { min: number; max: number };
export type LibraryFilterKey = "character" | "build" | "category" | "tag" | "search";
export type SelectableFilterKey = Exclude<LibraryFilterKey, "search">;
export type SearchFilterKey = Extract<LibraryFilterKey, "search">;
export type LibraryFilterPanel = { key: LibraryFilterKey; label: string; icon: string };
export type SelectableFilterPanel = LibraryFilterPanel & { key: SelectableFilterKey };
export type SearchFilterPanel = LibraryFilterPanel & { key: SearchFilterKey };
export type CharacterSummaryGroup = "partyCharacters" | "mainAttackers";
export type CharacterSummaryTarget = "include" | "exclude";
export type WeaponSummaryTarget = "include" | "exclude";
export type LibraryBuildFilterTab = "cost" | "weapon";

export type LibraryCategoryFilterState = {
  ruleset: string;
  version: string;
  playStyle: string | null;
  food: string | null;
  device: string | null;
};

export type LibraryBuildFilterState = {
  costBracket: Bracket | null;
  charCostRange: NumericRange;
  weaponCostRange: NumericRange;
  fiveStarWeaponCountRange: NumericRange;
  maxConstellation: number | null;
  maxFiveStarRefinement: number | null;
  weaponIds: {
    include: string[];
    exclude: string[];
  };
};

export type LibrarySearchFilters = {
  characterFilters: HomeFilterState;
  buildFilters: LibraryBuildFilterState;
  categoryFilters: LibraryCategoryFilterState;
  selectedTags: string[];
};

export const LIBRARY_BUILD_RANGE_LIMITS = {
  charCost: { min: 0, max: 28 },
  weaponCost: { min: 0, max: 20 },
  fiveStarWeaponCount: { min: 0, max: 4 },
} as const;

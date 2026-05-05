import { getAppRunById } from "../../../data/appRuns";
import type { Bracket } from "../../../data/mockRuns";
import { createEmptyHomeFilterState } from "../../home/logic";
import type { HomeFilterState, IncludeMode, SelectionGroupState } from "../../home/types";
import {
  LIBRARY_BUILD_RANGE_LIMITS,
  type LibraryBuildFilterState,
  type LibraryCategoryFilterState,
  type LibrarySearchFilters,
  type NumericRange,
} from "../types";
import {
  cloneLibrarySearchFilters,
  createEmptyLibraryBuildFilterState,
  createEmptyLibraryCategoryFilterState,
  createEmptyLibrarySearchFilters,
} from "./searchFilters";

export const LIBRARY_ACTION_STORAGE_KEY = "elite-run-db.libraryActions.v1";
export const LIBRARY_ACTION_SAVE_DELAY_MS = 500;
export const LIBRARY_COMPARE_CANDIDATE_LIMIT = 2;
export const LIBRARY_SEARCH_HISTORY_LIMIT = 10;
export const LIBRARY_VIEW_HISTORY_LIMIT = 12;
export const LIBRARY_WATCH_LATER_LIMIT = 20;

export type LibraryActionAccordionKey = "search" | "browse" | "watch";

export type LibrarySearchHistoryEntry = {
  signature: string;
  keyword: string;
  filters: LibrarySearchFilters;
  label: string;
  summary: string;
  createdAt: string;
};

export type LibraryActionState = {
  version: 1;
  compareCandidateIds: string[];
  watchLaterIds: string[];
  searchHistory: LibrarySearchHistoryEntry[];
  viewHistoryIds: string[];
  updatedAt: string;
};

export type LibraryFilterRestoreRequest = {
  nonce: number;
  filters: LibrarySearchFilters;
};

export function createEmptyLibraryActionState(): LibraryActionState {
  return {
    version: 1,
    compareCandidateIds: [],
    watchLaterIds: [],
    searchHistory: [],
    viewHistoryIds: [],
    updatedAt: new Date().toISOString(),
  };
}

export function touchLibraryActionState(state: LibraryActionState): LibraryActionState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

export function loadInitialLibraryActionState(): LibraryActionState {
  if (typeof window === "undefined") {
    return createEmptyLibraryActionState();
  }

  try {
    const raw = window.localStorage.getItem(LIBRARY_ACTION_STORAGE_KEY);

    if (!raw) {
      return createEmptyLibraryActionState();
    }

    return mergeLibraryActionState(JSON.parse(raw));
  } catch {
    return createEmptyLibraryActionState();
  }
}

export function persistLibraryActionState(state: LibraryActionState) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(LIBRARY_ACTION_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function addRecentRunId(ids: string[], runId: string, limit: number) {
  if (!getAppRunById(runId)) {
    return ids;
  }

  return [runId, ...ids.filter((id) => id !== runId)].slice(0, limit);
}

export function shouldRecordLibrarySearch(keyword: string, filters: LibrarySearchFilters) {
  return keyword.trim().length > 0 || hasActiveFilters(filters);
}

export function createLibrarySearchHistoryEntry(keyword: string, filters: LibrarySearchFilters, createdAt = new Date().toISOString()): LibrarySearchHistoryEntry {
  const normalizedKeyword = keyword.trim();
  const normalizedFilters = cloneLibrarySearchFilters(filters);
  const signature = JSON.stringify({ keyword: normalizedKeyword, filters: normalizedFilters });
  const filterParts = getFilterSummaryParts(normalizedFilters);

  return {
    signature,
    keyword: normalizedKeyword,
    filters: normalizedFilters,
    label: normalizedKeyword ? `「${normalizedKeyword}」` : "条件検索",
    summary: filterParts.length > 0 ? filterParts.join(" / ") : "キーワード検索",
    createdAt,
  };
}

export function upsertLibrarySearchHistory(history: LibrarySearchHistoryEntry[], keyword: string, filters: LibrarySearchFilters) {
  if (!shouldRecordLibrarySearch(keyword, filters)) {
    return history;
  }

  const entry = createLibrarySearchHistoryEntry(keyword, filters);
  return [entry, ...history.filter((item) => item.signature !== entry.signature)].slice(0, LIBRARY_SEARCH_HISTORY_LIMIT);
}

function mergeLibraryActionState(raw: unknown): LibraryActionState {
  const base = createEmptyLibraryActionState();

  if (!isRecord(raw)) {
    return base;
  }

  return {
    version: 1,
    compareCandidateIds: readRunIds(raw.compareCandidateIds, LIBRARY_COMPARE_CANDIDATE_LIMIT),
    watchLaterIds: readRunIds(raw.watchLaterIds, LIBRARY_WATCH_LATER_LIMIT),
    searchHistory: readSearchHistory(raw.searchHistory),
    viewHistoryIds: readRunIds(raw.viewHistoryIds, LIBRARY_VIEW_HISTORY_LIMIT),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : base.updatedAt,
  };
}

function readSearchHistory(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const keyword = typeof item.keyword === "string" ? item.keyword : "";
      const filters = mergeLibrarySearchFilters(item.filters);

      if (!shouldRecordLibrarySearch(keyword, filters)) {
        return null;
      }

      const createdAt = typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString();
      return createLibrarySearchHistoryEntry(keyword, filters, createdAt);
    })
    .filter((item): item is LibrarySearchHistoryEntry => Boolean(item))
    .slice(0, LIBRARY_SEARCH_HISTORY_LIMIT);
}

function mergeLibrarySearchFilters(raw: unknown): LibrarySearchFilters {
  const base = createEmptyLibrarySearchFilters();

  if (!isRecord(raw)) {
    return base;
  }

  return {
    characterFilters: mergeHomeFilterState(raw.characterFilters),
    buildFilters: mergeBuildFilters(raw.buildFilters),
    categoryFilters: mergeCategoryFilters(raw.categoryFilters),
    selectedTags: readStringArray(raw.selectedTags),
  };
}

function mergeHomeFilterState(raw: unknown): HomeFilterState {
  const base = createEmptyHomeFilterState();

  if (!isRecord(raw)) {
    return base;
  }

  return {
    partyCharacters: mergeSelectionGroup(raw.partyCharacters),
    mainAttackers: mergeSelectionGroup(raw.mainAttackers),
    tags: mergeSelectionGroup(raw.tags),
  };
}

function mergeSelectionGroup(raw: unknown): SelectionGroupState {
  if (!isRecord(raw)) {
    return {
      includeIds: [],
      excludeIds: [],
      includeMode: "or",
    };
  }

  return {
    includeIds: readStringArray(raw.includeIds),
    excludeIds: readStringArray(raw.excludeIds),
    includeMode: readIncludeMode(raw.includeMode),
  };
}

function mergeBuildFilters(raw: unknown): LibraryBuildFilterState {
  const base = createEmptyLibraryBuildFilterState();

  if (!isRecord(raw)) {
    return base;
  }

  const weaponIds = isRecord(raw.weaponIds) ? raw.weaponIds : {};

  return {
    costBracket: readBracket(raw.costBracket),
    charCostRange: readRange(raw.charCostRange, LIBRARY_BUILD_RANGE_LIMITS.charCost),
    weaponCostRange: readRange(raw.weaponCostRange, LIBRARY_BUILD_RANGE_LIMITS.weaponCost),
    fiveStarWeaponCountRange: readRange(raw.fiveStarWeaponCountRange, LIBRARY_BUILD_RANGE_LIMITS.fiveStarWeaponCount),
    maxConstellation: readOptionalInt(raw.maxConstellation, 0, 6),
    maxFiveStarRefinement: readOptionalInt(raw.maxFiveStarRefinement, 1, 5),
    weaponIds: {
      include: readStringArray(weaponIds.include),
      exclude: readStringArray(weaponIds.exclude),
    },
  };
}

function mergeCategoryFilters(raw: unknown): LibraryCategoryFilterState {
  const base = createEmptyLibraryCategoryFilterState();

  if (!isRecord(raw)) {
    return base;
  }

  return {
    ruleset: typeof raw.ruleset === "string" ? raw.ruleset : "",
    version: typeof raw.version === "string" ? raw.version : "",
    playStyle: typeof raw.playStyle === "string" ? raw.playStyle : null,
    food: typeof raw.food === "string" ? raw.food : null,
    device: typeof raw.device === "string" ? raw.device : null,
  };
}

function getFilterSummaryParts(filters: LibrarySearchFilters) {
  const parts: string[] = [];
  const characterCount =
    filters.characterFilters.partyCharacters.includeIds.length +
    filters.characterFilters.partyCharacters.excludeIds.length +
    filters.characterFilters.mainAttackers.includeIds.length +
    filters.characterFilters.mainAttackers.excludeIds.length;

  if (characterCount > 0) {
    parts.push(`キャラ${characterCount}`);
  }

  if (hasActiveBuildFilters(filters.buildFilters)) {
    parts.push("凸・武器");
  }

  if (hasActiveCategoryFilters(filters.categoryFilters)) {
    parts.push("カテゴリ");
  }

  if (filters.selectedTags.length > 0) {
    parts.push(`タグ${filters.selectedTags.length}`);
  }

  return parts;
}

function hasActiveFilters(filters: LibrarySearchFilters) {
  return (
    filters.characterFilters.partyCharacters.includeIds.length > 0 ||
    filters.characterFilters.partyCharacters.excludeIds.length > 0 ||
    filters.characterFilters.mainAttackers.includeIds.length > 0 ||
    filters.characterFilters.mainAttackers.excludeIds.length > 0 ||
    hasActiveBuildFilters(filters.buildFilters) ||
    hasActiveCategoryFilters(filters.categoryFilters) ||
    filters.selectedTags.length > 0
  );
}

function hasActiveBuildFilters(filters: LibraryBuildFilterState) {
  return (
    filters.costBracket !== null ||
    !isDefaultRange(filters.charCostRange, LIBRARY_BUILD_RANGE_LIMITS.charCost) ||
    !isDefaultRange(filters.weaponCostRange, LIBRARY_BUILD_RANGE_LIMITS.weaponCost) ||
    !isDefaultRange(filters.fiveStarWeaponCountRange, LIBRARY_BUILD_RANGE_LIMITS.fiveStarWeaponCount) ||
    filters.maxConstellation !== null ||
    filters.maxFiveStarRefinement !== null ||
    filters.weaponIds.include.length > 0 ||
    filters.weaponIds.exclude.length > 0
  );
}

function hasActiveCategoryFilters(filters: LibraryCategoryFilterState) {
  return Boolean(filters.ruleset || filters.version || filters.playStyle || filters.food || filters.device);
}

function readRunIds(value: unknown, limit: number) {
  return readStringArray(value)
    .filter((runId) => Boolean(getAppRunById(runId)))
    .slice(0, limit);
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)));
}

function readIncludeMode(value: unknown): IncludeMode {
  return value === "and" ? "and" : "or";
}

function readBracket(value: unknown): Bracket | null {
  return value === 1 || value === 2 || value === 3 || value === 4 ? value : null;
}

function readOptionalInt(value: unknown, min: number, max: number) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    return null;
  }

  return value;
}

function readRange(value: unknown, limit: NumericRange): NumericRange {
  if (!isRecord(value) || typeof value.min !== "number" || typeof value.max !== "number") {
    return { ...limit };
  }

  const min = clamp(Math.min(value.min, value.max), limit.min, limit.max);
  const max = clamp(Math.max(value.min, value.max), limit.min, limit.max);
  return { min, max };
}

function isDefaultRange(range: NumericRange, limit: NumericRange) {
  return range.min === limit.min && range.max === limit.max;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

import { useEffect, useState } from "react";

import {
  addRecentRunId,
  LIBRARY_ACTION_SAVE_DELAY_MS,
  LIBRARY_COMPARE_CANDIDATE_LIMIT,
  LIBRARY_VIEW_HISTORY_LIMIT,
  LIBRARY_WATCH_LATER_LIMIT,
  loadInitialLibraryActionState,
  persistLibraryActionState,
  touchLibraryActionState,
  upsertLibrarySearchHistory,
  type LibraryActionState,
  type LibraryFilterRestoreRequest,
  type LibrarySearchHistoryEntry,
} from "../logic/actionStorage";
import { cloneLibrarySearchFilters, createEmptyLibrarySearchFilters } from "../logic/searchFilters";
import type { LibrarySearchFilters } from "../types";

type UseLibraryPageStateOptions = {
  onSelectRun: (runId: string) => void;
};

export function useLibraryPageState({ onSelectRun }: UseLibraryPageStateOptions) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(() => createEmptyLibrarySearchFilters());
  const [inputKeyword, setInputKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [actions, setActions] = useState<LibraryActionState>(() => loadInitialLibraryActionState());
  const [filterRestoreRequest, setFilterRestoreRequest] = useState<LibraryFilterRestoreRequest | null>(null);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      persistLibraryActionState(actions);
    }, LIBRARY_ACTION_SAVE_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [actions]);

  const updateActions = (updater: (current: LibraryActionState) => LibraryActionState) => {
    setActions((current) => {
      const next = updater(current);
      return next === current ? current : touchLibraryActionState(next);
    });
  };

  const recordSearchHistory = (keyword: string, filters: LibrarySearchFilters) => {
    setActions((current) => {
      const searchHistory = upsertLibrarySearchHistory(current.searchHistory, keyword, filters);

      if (searchHistory === current.searchHistory) {
        return current;
      }

      return touchLibraryActionState({ ...current, searchHistory });
    });
  };

  const handleKeywordCommit = () => {
    const normalizedKeyword = inputKeyword.trim();
    setAppliedKeyword(normalizedKeyword);
    recordSearchHistory(normalizedKeyword, appliedFilters);
  };

  const handleFilterSearch = (filters: LibrarySearchFilters) => {
    const nextFilters = cloneLibrarySearchFilters(filters);
    setAppliedFilters(nextFilters);
    recordSearchHistory(appliedKeyword, nextFilters);
  };

  const handleApplySearchHistory = (entry: LibrarySearchHistoryEntry) => {
    const restoredFilters = cloneLibrarySearchFilters(entry.filters);
    setInputKeyword(entry.keyword);
    setAppliedKeyword(entry.keyword);
    setAppliedFilters(restoredFilters);
    setFilterRestoreRequest((current) => ({ nonce: (current?.nonce ?? 0) + 1, filters: restoredFilters }));
    recordSearchHistory(entry.keyword, restoredFilters);
  };

  const addCandidate = (runId: string) => {
    updateActions((current) => {
      if (current.compareCandidateIds.includes(runId) || current.compareCandidateIds.length >= LIBRARY_COMPARE_CANDIDATE_LIMIT) {
        return current;
      }

      return { ...current, compareCandidateIds: [...current.compareCandidateIds, runId] };
    });
  };

  const removeCandidate = (runId: string) => {
    updateActions((current) => ({ ...current, compareCandidateIds: current.compareCandidateIds.filter((id) => id !== runId) }));
  };

  const clearCandidates = () => {
    updateActions((current) => (current.compareCandidateIds.length === 0 ? current : { ...current, compareCandidateIds: [] }));
  };

  const toggleWatchLater = (runId: string) => {
    updateActions((current) =>
      current.watchLaterIds.includes(runId)
        ? { ...current, watchLaterIds: current.watchLaterIds.filter((id) => id !== runId) }
        : { ...current, watchLaterIds: addRecentRunId(current.watchLaterIds, runId, LIBRARY_WATCH_LATER_LIMIT) },
    );
  };

  const removeSearchHistory = (signature: string) => {
    updateActions((current) => ({ ...current, searchHistory: current.searchHistory.filter((entry) => entry.signature !== signature) }));
  };

  const removeViewHistory = (runId: string) => {
    updateActions((current) => ({ ...current, viewHistoryIds: current.viewHistoryIds.filter((id) => id !== runId) }));
  };

  const handleSelectRun = (runId: string) => {
    setActions((current) => {
      const next = touchLibraryActionState({
        ...current,
        viewHistoryIds: addRecentRunId(current.viewHistoryIds, runId, LIBRARY_VIEW_HISTORY_LIMIT),
      });
      persistLibraryActionState(next);
      return next;
    });
    onSelectRun(runId);
  };

  return {
    actions,
    appliedFilters,
    appliedKeyword,
    filterRestoreRequest,
    inputKeyword,
    isFilterModalOpen,
    addCandidate,
    clearCandidates,
    handleApplySearchHistory,
    handleFilterSearch,
    handleKeywordCommit,
    handleSelectRun,
    removeCandidate,
    removeSearchHistory,
    removeViewHistory,
    setInputKeyword,
    setIsFilterModalOpen,
    toggleWatchLater,
  };
}

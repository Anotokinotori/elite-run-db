import { ChevronRightIcon, CrownIcon } from "../../components/UiIcons";
import { useEffect, useState } from "react";
import { LIBRARY_COLORS, LIBRARY_HERO_IMAGE_URL, LIBRARY_LABELS } from "./config";
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
} from "./logic/actionStorage";
import { cloneLibrarySearchFilters, createEmptyLibrarySearchFilters } from "./logic/searchFilters";
import { FilterEntrance } from "./sections/FilterEntrance";
import { LibraryHero } from "./sections/Hero";
import { LibrarySearchResults } from "./sections/SearchResults";

type LibraryPageProps = {
  onOpenRankings: () => void;
  onSelectRun: (runId: string) => void;
};

export function LibraryPage({ onOpenRankings, onSelectRun }: LibraryPageProps) {
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

  const recordSearchHistory = (keyword: string, filters: typeof appliedFilters) => {
    setActions((current) => {
      const searchHistory = upsertLibrarySearchHistory(current.searchHistory, keyword, filters);

      if (searchHistory === current.searchHistory) {
        return current;
      }

      return touchLibraryActionState({ ...current, searchHistory });
    });
  };

  const updateActions = (updater: (current: LibraryActionState) => LibraryActionState) => {
    setActions((current) => {
      const next = updater(current);
      return next === current ? current : touchLibraryActionState(next);
    });
  };

  const handleKeywordCommit = () => {
    const normalizedKeyword = inputKeyword.trim();
    setAppliedKeyword(normalizedKeyword);
    recordSearchHistory(normalizedKeyword, appliedFilters);
  };

  const handleFilterSearch = (filters: typeof appliedFilters) => {
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
      const next = touchLibraryActionState({ ...current, viewHistoryIds: addRecentRunId(current.viewHistoryIds, runId, LIBRARY_VIEW_HISTORY_LIMIT) });
      persistLibraryActionState(next);
      return next;
    });
    onSelectRun(runId);
  };

  return (
    <div className="min-h-full bg-[#f2f3f5] text-[#111827]">
      <LibraryHero
        imageUrl={LIBRARY_HERO_IMAGE_URL}
        backgroundColor={LIBRARY_COLORS.pageBackground}
        ariaLabel={LIBRARY_LABELS.heroAriaLabel}
        keyword={inputKeyword}
        onKeywordChange={setInputKeyword}
        onKeywordCommit={handleKeywordCommit}
      />
      <FilterEntrance onModalOpenChange={setIsFilterModalOpen} onSearch={handleFilterSearch} restoreRequest={filterRestoreRequest} />
      <LibrarySearchResults
        filters={appliedFilters}
        keyword={appliedKeyword}
        compareCandidateIds={actions.compareCandidateIds}
        watchLaterIds={actions.watchLaterIds}
        searchHistory={actions.searchHistory}
        viewHistoryIds={actions.viewHistoryIds}
        onAddCandidate={addCandidate}
        onRemoveCandidate={removeCandidate}
        onClearCandidates={clearCandidates}
        onToggleWatchLater={toggleWatchLater}
        onApplySearchHistory={handleApplySearchHistory}
        onRemoveSearchHistory={removeSearchHistory}
        onRemoveViewHistory={removeViewHistory}
        onSelectRun={handleSelectRun}
      />
      {isFilterModalOpen ? null : <RankingsFloatingCta onOpen={onOpenRankings} />}
    </div>
  );
}

function RankingsFloatingCta({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="全ランキングを見る"
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 border border-white/25 bg-[#111116] px-3.5 py-3 text-left text-[#d9d9d9] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
    >
      <CrownIcon className="h-[17px] w-[17px] shrink-0 text-white/70" />
      <span className="cta-shine-text whitespace-nowrap text-[14px] font-black leading-none sm:text-[15px]">全ランキングを見る</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-white/70" />
    </button>
  );
}

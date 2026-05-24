import { useEffect, useMemo, useState } from "react";

import { appRuns, getAppRunById } from "../../../data/appRuns";
import type { RunRecord } from "../../../data/mockRuns";
import { LIBRARY_COMPARE_CANDIDATE_LIMIT, type LibrarySearchHistoryEntry } from "../logic/actionStorage";
import { filterLibraryRuns } from "../logic/searchResults";
import type { LibrarySearchFilters } from "../types";
import { CompareCandidatePanel } from "./CompareCandidatePanel";
import { LibraryCompareDrawer } from "./LibraryCompareDrawer";
import { LibrarySearchActionAccordion } from "./LibrarySearchActionAccordion";
import { LibraryRecordCard } from "../ui/LibraryRecordCard";
import { LibraryEmptyResults } from "../ui/searchResultsUi";

type LibrarySearchResultsProps = {
  filters: LibrarySearchFilters;
  keyword: string;
  compareCandidateIds: string[];
  watchLaterIds: string[];
  searchHistory: LibrarySearchHistoryEntry[];
  viewHistoryIds: string[];
  onAddCandidate: (runId: string) => void;
  onRemoveCandidate: (runId: string) => void;
  onClearCandidates: () => void;
  onToggleWatchLater: (runId: string) => void;
  onApplySearchHistory: (entry: LibrarySearchHistoryEntry) => void;
  onRemoveSearchHistory: (signature: string) => void;
  onRemoveViewHistory: (runId: string) => void;
  onSelectRun: (runId: string) => void;
};

export function LibrarySearchResults({
  filters,
  keyword,
  compareCandidateIds,
  watchLaterIds,
  searchHistory,
  viewHistoryIds,
  onAddCandidate,
  onRemoveCandidate,
  onClearCandidates,
  onToggleWatchLater,
  onApplySearchHistory,
  onRemoveSearchHistory,
  onRemoveViewHistory,
  onSelectRun,
}: LibrarySearchResultsProps) {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const visibleRuns = useMemo(() => filterLibraryRuns(appRuns, filters, keyword), [filters, keyword]);
  const compareCandidates = useMemo(() => compareCandidateIds.map((runId) => getAppRunById(runId)).filter((run): run is RunRecord => Boolean(run)), [compareCandidateIds]);
  const watchLaterRuns = useMemo(() => watchLaterIds.map((runId) => getAppRunById(runId)).filter((run): run is RunRecord => Boolean(run)), [watchLaterIds]);
  const viewHistoryRuns = useMemo(() => viewHistoryIds.map((runId) => getAppRunById(runId)).filter((run): run is RunRecord => Boolean(run)), [viewHistoryIds]);
  const canOpenCompare = compareCandidates.length === LIBRARY_COMPARE_CANDIDATE_LIMIT;

  useEffect(() => {
    if (!canOpenCompare) {
      setIsCompareOpen(false);
    }
  }, [canOpenCompare]);

  return (
    <section className="mx-auto w-full px-4 pb-16 pt-8 lg:px-8">
      <div className="border-t border-[#d4d4d4] pt-7 md:pt-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          {visibleRuns.length > 0 ? (
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
              {visibleRuns.map((run) => (
                <LibraryRecordCard
                  key={run.id}
                  run={run}
                  candidateLimitReached={compareCandidateIds.length >= LIBRARY_COMPARE_CANDIDATE_LIMIT}
                  isCandidate={compareCandidateIds.includes(run.id)}
                  isWatchLater={watchLaterIds.includes(run.id)}
                  onAddCandidate={onAddCandidate}
                  onToggleWatchLater={onToggleWatchLater}
                  onSelectRun={onSelectRun}
                />
              ))}
            </div>
          ) : (
            <LibraryEmptyResults />
          )}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <CompareCandidatePanel
              candidates={compareCandidates}
              canOpenCompare={canOpenCompare}
              onSelectRun={onSelectRun}
              onRemove={onRemoveCandidate}
              onClear={onClearCandidates}
              onOpenCompare={() => {
                if (canOpenCompare) {
                  setIsCompareOpen(true);
                }
              }}
            />
            <LibrarySearchActionAccordion
              searchHistory={searchHistory}
              viewHistoryRuns={viewHistoryRuns}
              watchLaterRuns={watchLaterRuns}
              onApplySearchHistory={onApplySearchHistory}
              onRemoveSearchHistory={onRemoveSearchHistory}
              onSelectRun={onSelectRun}
              onRemoveViewHistory={onRemoveViewHistory}
              onRemoveWatchLater={onToggleWatchLater}
            />
          </aside>
        </div>
      </div>

      <LibraryCompareDrawer
        baseRun={compareCandidates[0] ?? null}
        comparedRun={compareCandidates[1] ?? null}
        isOpen={isCompareOpen && canOpenCompare}
        onClose={() => setIsCompareOpen(false)}
      />
    </section>
  );
}

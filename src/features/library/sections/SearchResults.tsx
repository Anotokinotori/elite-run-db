import { useEffect, useMemo, useState } from "react";

import { appRuns, getAppRunById } from "../../../data/appRuns";
import type { RunRecord } from "../../../data/mockRuns";
import { LIBRARY_COMPARE_CANDIDATE_LIMIT, type LibrarySearchHistoryEntry } from "../logic/actionStorage";
import { filterLibraryRuns, hasActiveLibrarySearchFilters } from "../logic/searchResults";
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
  const hasSearchCriteria = hasActiveLibrarySearchFilters(filters) || keyword.trim().length > 0;
  const heading = hasSearchCriteria ? "検索結果" : "最近の投稿";
  const lead = hasSearchCriteria ? "指定した条件に一致する記録を新しい順に表示しています。" : "おすすめ機能が入るまでの代替として、新しい投稿から表示しています。";
  const canOpenCompare = compareCandidates.length === LIBRARY_COMPARE_CANDIDATE_LIMIT;

  useEffect(() => {
    if (!canOpenCompare) {
      setIsCompareOpen(false);
    }
  }, [canOpenCompare]);

  return (
    <section className="mx-auto max-w-[1340px] px-4 pb-16 pt-8 lg:px-8">
      <div className="border-t border-[#d4d4d4] pt-7 md:pt-8">
        <h2 className="max-w-full overflow-hidden whitespace-nowrap text-[43px] font-normal leading-[40px] text-black md:text-[50px] lg:text-[69px] lg:leading-[62px] [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]">
          RECORDS
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-[20px] font-black tracking-[-0.03em] text-[#111827] md:text-[24px]">{heading}</span>
          <span className="inline-flex h-8 items-center rounded-full border border-[#d8dde6] bg-white px-3 text-[12px] font-black text-[#5f6678]">{visibleRuns.length}件</span>
        </div>
        <p className="mt-2 max-w-[560px] text-[12px] font-bold leading-5 text-[#7b8493] md:text-[13px]">{lead}</p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        {visibleRuns.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <LibraryCompareDrawer
        baseRun={compareCandidates[0] ?? null}
        comparedRun={compareCandidates[1] ?? null}
        isOpen={isCompareOpen && canOpenCompare}
        onClose={() => setIsCompareOpen(false)}
      />
    </section>
  );
}

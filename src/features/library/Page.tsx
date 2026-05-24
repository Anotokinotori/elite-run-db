import { useRef } from "react";

import { ChevronRightIcon, CrownIcon } from "../../components/UiIcons";
import { AppFooter, AppFooterBottomSpacer } from "../../components/AppFooter";
import { FloatingCta } from "../../components/ui";
import { useLibraryPageState } from "./hooks/useLibraryPageState";
import { FilterEntrance } from "./sections/FilterEntrance";
import { LibrarySearchResults } from "./sections/SearchResults";
import type { LibrarySearchFilters } from "./types";

const FLOATING_CTA_CLASS = "w-[236px] justify-between";

type LibraryPageProps = {
  onOpenRankings: () => void;
  onSelectRun: (runId: string) => void;
};

export function LibraryPage({ onOpenRankings, onSelectRun }: LibraryPageProps) {
  const libraryState = useLibraryPageState({ onSelectRun });
  const resultsAnchorRef = useRef<HTMLDivElement | null>(null);

  const handleFilterSearch = (filters: LibrarySearchFilters) => {
    libraryState.handleFilterSearch(filters);
    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        resultsAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 0);
  };

  return (
    <div className="min-h-full bg-[#EDECEC] text-[#111827]">
      <FilterEntrance
        onModalOpenChange={libraryState.setIsFilterModalOpen}
        onSearch={handleFilterSearch}
        restoreRequest={libraryState.filterRestoreRequest}
      />
      <div ref={resultsAnchorRef} className="scroll-mt-6" aria-hidden="true" />
      <LibrarySearchResults
        filters={libraryState.appliedFilters}
        keyword={libraryState.appliedKeyword}
        compareCandidateIds={libraryState.actions.compareCandidateIds}
        watchLaterIds={libraryState.actions.watchLaterIds}
        searchHistory={libraryState.actions.searchHistory}
        viewHistoryIds={libraryState.actions.viewHistoryIds}
        onAddCandidate={libraryState.addCandidate}
        onRemoveCandidate={libraryState.removeCandidate}
        onClearCandidates={libraryState.clearCandidates}
        onToggleWatchLater={libraryState.toggleWatchLater}
        onApplySearchHistory={libraryState.handleApplySearchHistory}
        onRemoveSearchHistory={libraryState.removeSearchHistory}
        onRemoveViewHistory={libraryState.removeViewHistory}
        onSelectRun={libraryState.handleSelectRun}
      />
      <AppFooter />
      <AppFooterBottomSpacer />
      {libraryState.isFilterModalOpen ? null : <RankingsFloatingCta onOpen={onOpenRankings} />}
    </div>
  );
}

function RankingsFloatingCta({ onOpen }: { onOpen: () => void }) {
  return (
    <FloatingCta
      type="button"
      aria-label="全ランキングを見る"
      className={FLOATING_CTA_CLASS}
      onClick={onOpen}
      badge={
        <>
          <CrownIcon className="h-[11px] w-[11px] shrink-0" />
          Ranking
        </>
      }
      icon={<ChevronRightIcon className="h-4 w-4 shrink-0 text-white/70" />}
    >
      全ランキング
    </FloatingCta>
  );
}

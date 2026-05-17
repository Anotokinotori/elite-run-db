import { ChevronRightIcon, CrownIcon } from "../../components/UiIcons";
import { FloatingCta } from "../../components/ui";
import { LIBRARY_COLORS, LIBRARY_HERO_IMAGE_URL, LIBRARY_LABELS } from "./config";
import { useLibraryPageState } from "./hooks/useLibraryPageState";
import { FilterEntrance } from "./sections/FilterEntrance";
import { LibraryHero } from "./sections/Hero";
import { LibrarySearchResults } from "./sections/SearchResults";

const FLOATING_CTA_CLASS = "w-[236px] justify-between";

type LibraryPageProps = {
  onOpenRankings: () => void;
  onSelectRun: (runId: string) => void;
};

export function LibraryPage({ onOpenRankings, onSelectRun }: LibraryPageProps) {
  const libraryState = useLibraryPageState({ onSelectRun });

  return (
    <div className="min-h-full bg-[#f2f3f5] text-[#111827]">
      <LibraryHero
        imageUrl={LIBRARY_HERO_IMAGE_URL}
        backgroundColor={LIBRARY_COLORS.pageBackground}
        ariaLabel={LIBRARY_LABELS.heroAriaLabel}
        keyword={libraryState.inputKeyword}
        onKeywordChange={libraryState.setInputKeyword}
        onKeywordCommit={libraryState.handleKeywordCommit}
      />
      <FilterEntrance
        onModalOpenChange={libraryState.setIsFilterModalOpen}
        onSearch={libraryState.handleFilterSearch}
        restoreRequest={libraryState.filterRestoreRequest}
      />
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

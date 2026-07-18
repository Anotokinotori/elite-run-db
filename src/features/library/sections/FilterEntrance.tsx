
import { useLibraryFilterEntrance } from '../hooks/useLibraryFilterEntrance';
import type { LibraryFilterRestoreRequest } from '../logic/actionStorage';
import { buildSelectedFilterSummaryLabels } from '../logic/searchFilters';
import type { LibrarySearchFilters } from '../types';
import { UI } from './filterEntrance/config';
import { FilterEntranceShowcase } from './filterEntrance/FilterEntranceShowcase';
import { LibraryFilterModal } from './filterEntrance/LibraryFilterModal';

export function FilterEntrance({
  onModalOpenChange,
  onSearch,
  restoreRequest,
}: {
  onModalOpenChange?: (isOpen: boolean) => void;
  onSearch?: (filters: LibrarySearchFilters) => void;
  restoreRequest?: LibraryFilterRestoreRequest | null;
}) {
  const filterEntranceState = useLibraryFilterEntrance({ onModalOpenChange, onSearch, restoreRequest });
  const selectedFilterSummaryLabels = buildSelectedFilterSummaryLabels({
    characterFilters: filterEntranceState.characterFilters,
    buildFilters: filterEntranceState.buildFilters,
    categoryFilters: filterEntranceState.categoryFilters,
    selectedTags: filterEntranceState.selectedTags,
  });

  return (
    <section className="relative z-10 mx-auto max-w-[1340px] px-4 pt-10 md:pt-14 lg:px-8" style={{ color: UI.textMain }}>
      <ResponsiveStyle />
      <div className="mb-7 text-center md:mb-9">
        <h1 className="max-w-full overflow-hidden whitespace-nowrap pt-1 text-[46px] font-normal leading-[1.02] text-black md:text-[78px] lg:text-[96px] [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]">
          RECORDS SEARCH
        </h1>
        <div className="mx-auto mt-3 flex max-w-[320px] items-center justify-center gap-4 text-[#222222] md:mt-4">
          <span className="h-[2px] flex-1 bg-[#d7d7d7]" />
          <div className="flex items-center gap-2 whitespace-nowrap text-[16px] font-black tracking-[0.03em] md:text-[20px]">
            <FilterFunnelIcon className="h-6 w-6" />
            <span>条件を選んで絞り込む</span>
          </div>
          <span className="h-[2px] flex-1 bg-[#d7d7d7]" />
        </div>
      </div>
      <FilterEntranceShowcase
        activeKey={filterEntranceState.activeKey}
        activeSelectionCounts={filterEntranceState.activeSelectionCounts}
        hasActiveSearchFilters={filterEntranceState.hasActiveSearchFilters}
        selectedFilterSummaryLabels={selectedFilterSummaryLabels}
        onPanelClick={filterEntranceState.handleDesktopPanelClick}
      />
      <LibraryFilterModal
        activeKey={filterEntranceState.desktopModalKey}
        characterFilters={filterEntranceState.characterFilters}
        buildFilters={filterEntranceState.buildFilters}
        categoryFilters={filterEntranceState.categoryFilters}
        selectedTags={filterEntranceState.selectedTags}
        onClose={() => filterEntranceState.setDesktopModalKey(null)}
        onApplyCharacter={(filters) => {
          filterEntranceState.setCharacterFilters(filters);
          filterEntranceState.setDesktopModalKey(null);
        }}
        onApplyBuild={(filters) => {
          filterEntranceState.setBuildFilters(filters);
          filterEntranceState.setDesktopModalKey(null);
        }}
        onApplyCategory={(filters) => {
          filterEntranceState.setCategoryFilters(filters);
          filterEntranceState.setDesktopModalKey(null);
        }}
        onApplyTags={(tags) => {
          filterEntranceState.setSelectedTags(tags);
          filterEntranceState.setDesktopModalKey(null);
        }}
      />
    </section>
  );
}

function FilterFunnelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16l-6 7v5l-4 2v-7L4 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ResponsiveStyle() {
  return (
    <style>{`
      .library-range-input { pointer-events: none; }
      .library-range-input::-webkit-slider-thumb { pointer-events: auto; }
      .library-range-input::-moz-range-thumb { pointer-events: auto; }
      .library-filter-submit-label {
        display: inline-block;
        transform-origin: center;
        animation: library-filter-submit-vertical-groove 1.42s cubic-bezier(0.45, 0, 0.2, 1) infinite;
      }
      .library-filter-submit-icon {
        animation: library-filter-submit-vertical-groove 1.42s cubic-bezier(0.45, 0, 0.2, 1) infinite;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
      }
      .library-filter-submit:hover .library-filter-submit-label,
      .library-filter-submit:focus-visible .library-filter-submit-label {
        animation-duration: 1.08s;
      }
      .library-filter-submit:hover .library-filter-submit-icon,
      .library-filter-submit:focus-visible .library-filter-submit-icon {
        animation-duration: 1.08s;
      }
      .entrance-plus {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 25;
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        border: none;
        background: rgba(255, 255, 255, 0.34);
        box-shadow: none;
        color: rgba(62, 65, 68, 0.72);
        pointer-events: none;
        backdrop-filter: blur(2px);
        transition: background-color 0.2s ease, color 0.2s ease;
      }
      .group:hover .entrance-plus,
      .group:focus-visible .entrance-plus {
        background: rgba(255, 255, 255, 0.48);
        color: rgba(62, 65, 68, 0.84);
      }
      .entrance-plus-icon {
        width: 14px;
        height: 14px;
      }
      .selected-filter-summary {
        display: flex;
        width: min(760px, 100%);
        max-width: calc(100vw - 64px);
        margin: 22px auto 0;
        padding: 0 8px;
        align-items: baseline;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0 6px;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.9;
        letter-spacing: 0.02em;
        color: rgba(75, 85, 99, 0.68);
        overflow: hidden;
      }
      .selected-filter-summary-label {
        flex: 0 0 auto;
        color: rgba(55, 65, 81, 0.76);
        font-weight: 900;
      }
      .selected-filter-summary-list {
        display: flex;
        min-width: 0;
        max-width: 100%;
        align-items: baseline;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0 6px;
        color: rgba(75, 85, 99, 0.62);
      }
      .selected-filter-summary-item {
        display: inline-flex;
        min-width: 0;
        max-width: 100%;
        align-items: baseline;
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: keep-all;
      }
      .selected-filter-summary-item:not(:last-child)::after {
        content: "/";
        flex: 0 0 auto;
        margin-left: 6px;
        color: rgba(107, 114, 128, 0.42);
      }
      @keyframes library-filter-submit-vertical-groove {
        0%, 100% { transform: translateY(0); }
        18% { transform: translateY(-3px); }
        36% { transform: translateY(1px); }
        56% { transform: translateY(-2px); }
        74% { transform: translateY(1px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .library-filter-submit-label,
        .library-filter-submit-icon {
          animation: none;
        }
      }
      @media (max-width: 767px) {
        .selected-filter-summary {
          width: 100%;
          max-width: calc(100vw - 32px);
          margin-top: 18px;
          padding: 0 4px;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 10px;
          line-height: 1.8;
        }
        .selected-filter-summary-label {
          width: 100%;
          text-align: center;
        }
        .selected-filter-summary-list {
          width: 100%;
          max-width: 100%;
          justify-content: center;
          gap: 0 5px;
        }
      }
    `}</style>
  );
}

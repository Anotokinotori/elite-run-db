
import { useLibraryFilterEntrance } from '../hooks/useLibraryFilterEntrance';
import type { LibraryFilterRestoreRequest } from '../logic/actionStorage';
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

  return (
    <section className="relative z-10 mx-auto max-w-[1340px] px-4 pt-10 md:pt-14 lg:px-8" style={{ color: UI.textMain }}>
      <ResponsiveStyle />
      <div className="mb-7 text-center md:mb-9">
        <h1 className="max-w-full overflow-hidden whitespace-nowrap pt-1 text-[46px] font-normal leading-[1.02] text-black md:text-[78px] lg:text-[96px] [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]">
          RECORDS SERCH
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
    `}</style>
  );
}

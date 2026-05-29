
import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';

import { LIBRARY_LABELS } from '../../config';
import type { LibraryFilterKey, SelectableFilterKey } from '../../types';
import { FILTER_ENTRANCE_CARDS, FILTER_ENTRANCE_DESKTOP_LAYOUT, FILTER_ENTRANCE_MAX_SCALE, FILTER_ENTRANCE_MOBILE_LAYOUT } from './config';

export function FilterEntranceShowcase({
  activeKey,
  activeSelectionCounts,
  hasActiveSearchFilters,
  selectedFilterSummaryLabels,
  onPanelClick,
}: {
  activeKey: SelectableFilterKey | null;
  activeSelectionCounts: Record<SelectableFilterKey, number>;
  hasActiveSearchFilters: boolean;
  selectedFilterSummaryLabels: string[];
  onPanelClick: (key: LibraryFilterKey) => void;
}) {
  const scaleAreaRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const layout = isDesktop ? FILTER_ENTRANCE_DESKTOP_LAYOUT : FILTER_ENTRANCE_MOBILE_LAYOUT;
  const maxScale = isDesktop ? FILTER_ENTRANCE_MAX_SCALE.desktop : FILTER_ENTRANCE_MAX_SCALE.mobile;
  const scale = useFitScale(scaleAreaRef, layout.width, maxScale);
  const activeSelectionTotal = Object.values(activeSelectionCounts).reduce((sum, count) => sum + count, 0);
  const searchButtonLabel = `${activeSelectionTotal}件の条件で絞り込む`;
  const scaledStageStyle = useMemo<CSSProperties>(
    () => ({
      width: layout.width,
      height: layout.height,
      transform: `translateX(-50%) scale(${scale})`,
      transformOrigin: "top center",
      left: "50%",
      top: 0,
    }),
    [layout.height, layout.width, scale],
  );

  return (
    <div className="mx-auto w-full max-w-[960px]" role="group" aria-label={LIBRARY_LABELS.searchTitle}>
      <div ref={scaleAreaRef} className="w-full">
        <div className="relative mx-auto overflow-visible" style={{ width: layout.width * scale, height: layout.height * scale }}>
          <div className="absolute" style={scaledStageStyle}>
            <div
              className="flex"
              style={{
                width: layout.width,
                height: layout.height,
                flexDirection: isDesktop ? "row" : "column",
                gap: layout.gap,
                alignItems: isDesktop ? "flex-start" : "center",
                justifyContent: "flex-start",
              }}
            >
              {FILTER_ENTRANCE_CARDS.map((item) => (
                <FilterEntranceSummaryCard
                  key={item.key}
                  item={item}
                  selectionCount={activeSelectionCounts[item.key]}
                  isActive={activeKey === item.key}
                  isDesktop={isDesktop}
                  onClick={() => onPanelClick(item.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedFilterSummaryLabels.length > 0 ? (
        <div className="selected-filter-summary" aria-live="polite">
          <span className="selected-filter-summary-label">選択中の条件：</span>
          <span className="selected-filter-summary-list">
            {selectedFilterSummaryLabels.map((label, index) => (
              <span key={`${label}-${index}`} className="selected-filter-summary-item">
                {label}
              </span>
            ))}
          </span>
        </div>
      ) : null}
      {hasActiveSearchFilters ? (
        <div className={selectedFilterSummaryLabels.length > 0 ? "mt-[18px] flex w-full justify-center sm:mt-[22px]" : "mt-[26px] flex w-full justify-center sm:mt-[30px]"}>
          <button
            type="button"
            className="library-filter-submit group mx-auto flex w-fit items-center justify-center gap-[16px] text-[#050505] transition duration-200 hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50"
            aria-label={searchButtonLabel}
            onClick={() => onPanelClick("search")}
          >
            <span className="library-filter-submit-label font-['Inter','Noto_Sans_JP',sans-serif] text-[18px] font-black leading-none tracking-[0] sm:text-[19px]">
              {searchButtonLabel}
            </span>
            <span className="library-filter-submit-icon flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-black text-white transition duration-200 group-hover:scale-[1.04] group-hover:bg-[#1a1a1a]">
              <DownArrowIcon />
            </span>
          </button>
        </div>
      ) : (
        <div className="h-[38px] sm:h-[42px]" aria-hidden="true" />
      )}
    </div>
  );
}

function DownArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[28px] w-[28px] shrink-0"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.8 8.7v9.2" />
      <path d="M19.2 8.7v9.2" />
      <path d="M10 16.9 16 22.9l6-6" />
    </svg>
  );
}

function FilterEntranceSummaryCard({
  item,
  selectionCount,
  isActive,
  isDesktop,
  onClick,
}: {
  item: (typeof FILTER_ENTRANCE_CARDS)[number];
  selectionCount: number;
  isActive: boolean;
  isDesktop: boolean;
  onClick: () => void;
}) {
  const imageClass = isDesktop ? item.desktopImageClass : item.mobileImageClass;
  const layout = isDesktop ? FILTER_ENTRANCE_DESKTOP_LAYOUT : FILTER_ENTRANCE_MOBILE_LAYOUT;
  const statusLabel = formatSelectionStatusLabel(selectionCount);

  return (
    <button
      className="group relative shrink-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/55"
      style={{ width: layout.cardWidth }}
      aria-label={`${item.label}で記録を探す`}
      aria-pressed={isActive}
      type="button"
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden rounded-[7px] bg-[#d9d9d7] shadow-[10px_13px_20px_rgba(30,32,35,0.14)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[14px_18px_26px_rgba(30,32,35,0.2)]"
        style={{
          width: layout.cardWidth,
          height: layout.cardHeight,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_45%,rgba(0,0,0,0.08))]" />
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#d6d6d4] via-[#d6d6d4]/72 to-transparent"
          style={{ height: isDesktop ? "45%" : "60%" }}
        />
        <div className="absolute left-[-2px] top-[-5px] z-20 font-['Arial_Narrow',Arial,sans-serif] text-[64px] font-black leading-[0.78] tracking-[0] text-white/92">
          {item.no}
        </div>
        <span className="entrance-plus" aria-hidden="true">
          <PlusIcon />
        </span>

        {!isDesktop ? (
          <div className="absolute left-[86px] top-[25px] z-20 flex max-w-[150px] flex-col items-start">
            <p className="font-['Arial_Narrow',Arial,sans-serif] text-[15px] font-black uppercase leading-none tracking-[0] text-[#3e4144]">
              {item.label}
            </p>
            <p className="mt-[6px] whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black uppercase tracking-[0.13em] text-[#7d7f80]">
              {item.meta}
            </p>
            <div className="mt-[8px] flex w-[126px] items-center justify-center gap-2">
              <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
              <span className="whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[10px] font-black tracking-[0.08em] text-[#868787]">
                {statusLabel}
              </span>
              <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
            </div>
          </div>
        ) : null}

        <img
          src={item.image}
          alt=""
          className={`absolute z-10 max-w-none object-contain transition duration-300 group-hover:scale-[1.045] ${imageClass}`}
          loading="lazy"
        />
      </div>

      {isDesktop ? (
        <div className="mt-[16px] flex flex-col items-center text-center">
          <p className="font-['Arial_Narrow',Arial,sans-serif] text-[15px] font-black uppercase leading-none tracking-[0] text-[#3e4144]">
            {item.label}
          </p>
          <p className="mt-[6px] whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black uppercase tracking-[0.13em] text-[#7d7f80]">
            {item.meta}
          </p>
          <div className="mt-[9px] flex w-[124px] items-center justify-center gap-2">
            <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
            <span className="whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[10px] font-black tracking-[0.08em] text-[#868787]">
              {statusLabel}
            </span>
            <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
          </div>
        </div>
      ) : null}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg className="entrance-plus-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function formatSelectionStatusLabel(selectionCount: number) {
  return selectionCount > 0 ? `${selectionCount}件選択中` : "条件を選ぶ";
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [query]);

  return matches;
}

function useFitScale(ref: RefObject<HTMLElement | null>, baseWidth: number, maxScale = 1) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const nextScale = Math.min(maxScale, node.clientWidth / baseWidth);
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(update);
      observer.observe(node);
      window.addEventListener("resize", update);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", update);
      };
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseWidth, maxScale, ref]);

  return scale;
}

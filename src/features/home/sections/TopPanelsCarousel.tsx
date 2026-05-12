import type { RefObject } from "react";
import type { Bracket } from "../../../data/mockRuns";
import type { HomeFeaturedCard, HomeRun } from "../types";
import { FeaturedPlayersPanel } from "./FeaturedPlayersPanel";
import { TopPlayersPanel } from "./TopPlayersPanel";

type TopPanelsCarouselProps = {
  viewportRef: RefObject<HTMLDivElement | null>;
  rowRef: RefObject<HTMLDivElement | null>;
  activeIndex: number;
  heroRuns: HomeRun[];
  featuredCards: HomeFeaturedCard[];
  onScroll: () => void;
  onJumpTo: (nextIndex: 0 | 1) => void;
  onViewBracket: (bracket: Bracket) => void;
  onSelectRun: (runId: string) => void;
};

export function TopPanelsCarousel({
  viewportRef,
  rowRef,
  activeIndex,
  heroRuns,
  featuredCards,
  onScroll,
  onJumpTo,
  onViewBracket,
  onSelectRun,
}: TopPanelsCarouselProps) {
  const isLeftDisabled = activeIndex === 0;
  const isRightDisabled = activeIndex === 1;
  const arrowBaseClass =
    "absolute top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcdfe6] bg-white/90 shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="relative left-1/2 right-1/2 z-10 -mt-40 mb-8 w-screen -translate-x-1/2 overflow-x-clip px-5 md:-mt-72 sm:px-6 lg:px-8">
      <div className="relative w-full">
        <div
          ref={viewportRef}
          className="top-panels-scroll no-scrollbar overflow-x-auto overscroll-x-contain"
          style={{ scrollSnapType: "x mandatory" }}
          onScroll={onScroll}
        >
          <div ref={rowRef} className="flex gap-5">
            <TopPlayersPanel panelKey="top-primary" heroRuns={heroRuns} onViewBracket={onViewBracket} onSelectRun={onSelectRun} />
            <FeaturedPlayersPanel panelKey="featured-primary" featuredCards={featuredCards} onViewBracket={onViewBracket} onSelectRun={onSelectRun} />
            <TopPlayersPanel panelKey="top-loop" heroRuns={heroRuns} onViewBracket={onViewBracket} onSelectRun={onSelectRun} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`${arrowBaseClass} left-2`}
        aria-label="Scroll left"
        aria-disabled={isLeftDisabled}
        disabled={isLeftDisabled}
        onClick={() => onJumpTo(0)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <button
        type="button"
        className={`${arrowBaseClass} right-2 hidden sm:flex`}
        aria-label="Scroll right"
        aria-disabled={isRightDisabled}
        disabled={isRightDisabled}
        onClick={() => onJumpTo(1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <button
        type="button"
        className={`${arrowBaseClass} left-12 sm:hidden`}
        aria-label="Scroll right"
        aria-disabled={isRightDisabled}
        disabled={isRightDisabled}
        onClick={() => onJumpTo(1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

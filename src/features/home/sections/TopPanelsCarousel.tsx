import type { CSSProperties, RefObject } from "react";
import type { Bracket } from "../../../data/mockRuns";
import type { HomeFeaturedCard, HomeRun } from "../types";
import { FeaturedPlayersPanel } from "./FeaturedPlayersPanel";
import { TopPlayersPanel } from "./TopPlayersPanel";

type TopPanelsCarouselProps = {
  rowRef: RefObject<HTMLDivElement | null>;
  style: CSSProperties;
  heroRuns: HomeRun[];
  featuredCards: HomeFeaturedCard[];
  onTransitionEnd: () => void;
  onJumpTo: (nextIndex: 0 | 1) => void;
  onViewBracket: (bracket: Bracket) => void;
  onSelectRun: (runId: string) => void;
};

export function TopPanelsCarousel({
  rowRef,
  style,
  heroRuns,
  featuredCards,
  onTransitionEnd,
  onJumpTo,
  onViewBracket,
  onSelectRun,
}: TopPanelsCarouselProps) {
  return (
    <div className="relative left-1/2 right-1/2 z-10 -mt-40 mb-8 w-screen -translate-x-1/2 overflow-x-clip px-5 md:-mt-72 sm:px-6 lg:px-8">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div ref={rowRef} className="flex gap-5 will-change-transform" style={style} onTransitionEnd={onTransitionEnd}>
            <TopPlayersPanel panelKey="top-primary" heroRuns={heroRuns} onViewBracket={onViewBracket} onSelectRun={onSelectRun} />
            <FeaturedPlayersPanel panelKey="featured-primary" featuredCards={featuredCards} onViewBracket={onViewBracket} onSelectRun={onSelectRun} />
            <TopPlayersPanel panelKey="top-loop" heroRuns={heroRuns} onViewBracket={onViewBracket} onSelectRun={onSelectRun} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcdfe6] bg-white/90 shadow-sm"
        aria-label="Scroll left"
        onClick={() => onJumpTo(0)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <button
        type="button"
        className="absolute right-2 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcdfe6] bg-white/90 shadow-sm sm:flex"
        aria-label="Scroll right"
        onClick={() => onJumpTo(1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <button
        type="button"
        className="absolute left-12 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcdfe6] bg-white/90 shadow-sm sm:hidden"
        aria-label="Scroll right"
        onClick={() => onJumpTo(1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

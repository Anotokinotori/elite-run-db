import type { RefObject } from "react";

import type { Bracket } from "../../../data/mockRuns";
import { HOME_BRACKET_FILTER_OPTIONS, HOME_LABELS, HOME_LAYOUT_CLASSES, HOME_LEADERBOARD_VIEW_OPTIONS } from "../config";
import { FilterFunnelIcon, SearchIcon } from "../ui/icons";
import { LeaderboardRow } from "../ui/LeaderboardRow";
import type { ActiveFilterChipViewData, HomeRun, HomeRunWithGroup, LeaderboardView } from "../types";
import { ActiveFilterChipStrip } from "./ActiveFilterChipStrip";

type LeaderboardSectionProps = {
  leaderboardRef: RefObject<HTMLDivElement | null>;
  leaderboardView: LeaderboardView;
  filterBracket: Bracket | null;
  leaderboardRuns: Array<HomeRun | HomeRunWithGroup>;
  activeFilterChips: ActiveFilterChipViewData[];
  onOpenFilter: () => void;
  onRemoveFilterChip: (chip: ActiveFilterChipViewData) => void;
  onFilterBracketChange: (bracket: Bracket | null) => void;
  onLeaderboardViewChange: (view: LeaderboardView) => void;
  onSelectRun: (runId: string) => void;
};

export function LeaderboardSection({
  leaderboardRef,
  leaderboardView,
  filterBracket,
  leaderboardRuns,
  activeFilterChips,
  onOpenFilter,
  onRemoveFilterChip,
  onFilterBracketChange,
  onLeaderboardViewChange,
  onSelectRun,
}: LeaderboardSectionProps) {
  return (
    <div ref={leaderboardRef} className={HOME_LAYOUT_CLASSES.leaderboardFullBleed}>
      <div className={HOME_LAYOUT_CLASSES.leaderboardInner}>
        <div className="pt-12 pb-14 md:pt-14 md:pb-16">
          <div className="mb-8 flex items-center border-t border-white/10 pt-8">
            <div className="text-[18px] font-bold tracking-[0.01em] text-white md:text-[20px]">{HOME_LABELS.leaderboardLabel}</div>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center overflow-hidden rounded-full border border-white/12 bg-[#262526]/70 w-full max-w-[520px] md:min-w-[520px]">
              {HOME_LEADERBOARD_VIEW_OPTIONS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onLeaderboardViewChange(item.key)}
                  className={`flex-1 px-4 py-2.5 text-[13px] font-semibold transition-colors md:text-[14px] ${
                    leaderboardView === item.key ? "bg-white text-[#1f1f20]" : "bg-transparent text-white/68 hover:bg-white/8 hover:text-white"
                  }`}
                  title={item.label}
                  aria-label={item.label}
                >
                  <span className="md:hidden">{item.shortLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8 flex flex-wrap items-center gap-y-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 px-5 text-[13px] font-semibold tracking-[0.01em] text-white/78 transition-colors hover:bg-white/10 hover:text-white [&>div]:hidden [&>span:last-of-type]:hidden"
              onClick={onOpenFilter}
            >
              <FilterFunnelIcon className="w-5 h-5" />
              <span className="text-[13px] font-semibold tracking-[0.01em]">
                {activeFilterChips.length > 0 ? `${HOME_LABELS.filterTitle}${activeFilterChips.length}` : HOME_LABELS.filterTitle}
              </span>
              <div className="text-[13px] font-semibold tracking-[0.01em]">絞り込み</div>
              <span>絞り込み</span>
            </button>
            <ActiveFilterChipStrip chips={activeFilterChips} onRemove={onRemoveFilterChip} />
          </div>
          <div className="mb-8 flex items-center justify-between text-[13px] font-semibold md:text-[14px]">
            {HOME_BRACKET_FILTER_OPTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onFilterBracketChange(item.value)}
                className={`flex-1 border-b-2 pb-3 text-center ${
                  filterBracket === item.value || (item.value === null && filterBracket === null)
                    ? "border-white text-white"
                    : "border-transparent text-white/38 hover:text-white/72"
                }`}
              >
                <span className="md:hidden">{item.shortLabel}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
          {leaderboardRuns.length > 0 ? (
            <div>
              {leaderboardRuns.map((run, index) => (
                <LeaderboardRow key={run.id} run={run} index={index} onSelect={onSelectRun} view={leaderboardView} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#dcdfe6]">
              <SearchIcon size={48} className="mx-auto mb-4 text-[#dcdfe6]" />
              <h3 className="text-lg font-bold text-[#606266]">{HOME_LABELS.noResultsLabel}</h3>
              <p className="text-sm text-[#909399]">{HOME_LABELS.noResultsCopy}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


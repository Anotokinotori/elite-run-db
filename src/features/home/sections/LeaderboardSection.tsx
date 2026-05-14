import type { RefObject } from "react";

import { SelectControl } from "../../../components/ui";
import type { Bracket } from "../../../data/mockRuns";
import {
  HOME_BRACKET_ACCENT_COLORS,
  HOME_BRACKET_FILTER_OPTIONS,
  HOME_DEFAULT_LEADERBOARD_ACCENT_COLOR,
  HOME_LABELS,
  HOME_LAYOUT_CLASSES,
  HOME_LEADERBOARD_VIEW_OPTIONS,
} from "../config";
import { SearchIcon } from "../ui/icons";
import { LeaderboardRow } from "../ui/LeaderboardRow";
import type { HomeRun, HomeRunWithGroup, LeaderboardView } from "../types";

type LeaderboardSectionProps = {
  leaderboardRef: RefObject<HTMLDivElement | null>;
  leaderboardView: LeaderboardView;
  lastUpdatedDate: string;
  seasons: readonly string[];
  activeSeason: string;
  filterBracket: Bracket | null;
  leaderboardRuns: Array<HomeRun | HomeRunWithGroup>;
  onSeasonChange: (season: string) => void;
  onFilterBracketChange: (bracket: Bracket | null) => void;
  onLeaderboardViewChange: (view: LeaderboardView) => void;
  onSelectRun: (runId: string) => void;
};

export function LeaderboardSection({
  leaderboardRef,
  leaderboardView,
  lastUpdatedDate,
  seasons,
  activeSeason,
  filterBracket,
  leaderboardRuns,
  onSeasonChange,
  onFilterBracketChange,
  onLeaderboardViewChange,
  onSelectRun,
}: LeaderboardSectionProps) {
  const lastUpdatedLabel = formatLeaderboardUpdatedLabel(lastUpdatedDate);
  const leaderboardAccentColor = filterBracket ? HOME_BRACKET_ACCENT_COLORS[filterBracket] : HOME_DEFAULT_LEADERBOARD_ACCENT_COLOR;

  return (
    <div ref={leaderboardRef} className={HOME_LAYOUT_CLASSES.leaderboardFullBleed}>
      <div className={HOME_LAYOUT_CLASSES.leaderboardInner}>
        <div className="pt-8 pb-14 md:pt-10 md:pb-16">
          <div className="mb-8 border-t border-[#d4d4d4] pt-7 md:mb-9 md:pt-8">
            <h2 className="max-w-full overflow-hidden whitespace-nowrap text-[43px] font-normal leading-[40px] text-black md:text-[50px] lg:text-[69px] lg:leading-[62px] [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]">
              LEADERBOARD
            </h2>
            <time
              dateTime={lastUpdatedDate}
              className="mt-5 inline-flex min-h-10 items-center whitespace-nowrap border border-black bg-transparent px-5 py-2 text-[12px] font-black uppercase leading-none text-black sm:text-[13px] md:mt-6 md:min-h-11 md:px-6 md:text-[14px] [font-family:'Space_Grotesk','Noto_Sans_JP',sans-serif]"
            >
              {lastUpdatedLabel}
            </time>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center overflow-hidden rounded-full border border-[#dcdfe6] bg-white w-full max-w-[520px] md:min-w-[520px]">
              {HOME_LEADERBOARD_VIEW_OPTIONS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onLeaderboardViewChange(item.key)}
                  className={`flex-1 px-4 py-2.5 text-[13px] font-semibold transition-colors md:text-[14px] ${
                    leaderboardView === item.key ? "bg-black text-white" : "bg-white text-black hover:bg-[#f7f7f7]"
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
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8d93a3]">Version</span>
              <SelectControl value={activeSeason} onChange={(event) => onSeasonChange(event.target.value)} aria-label="Version">
                {seasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </SelectControl>
            </div>
          </div>
          <div className="mb-8 flex items-center justify-between text-[13px] font-semibold md:text-[14px]">
            {HOME_BRACKET_FILTER_OPTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onFilterBracketChange(item.value)}
                className={`flex-1 border-b-2 pb-3 text-center ${
                  filterBracket === item.value || (item.value === null && filterBracket === null)
                    ? "border-[#111827] text-[#111827]"
                    : "border-transparent text-[#8d93a3] hover:text-[#333333]"
                }`}
              >
                <span className="md:hidden">{item.shortLabel}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
          {leaderboardRuns.length > 0 ? (
            <div className="space-y-5">
              {leaderboardRuns.map((run, index) => (
                <LeaderboardRow key={run.id} run={run} index={index} onSelect={onSelectRun} view={leaderboardView} accentColor={leaderboardAccentColor} />
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

function formatLeaderboardUpdatedLabel(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "UPDATED DATE UNKNOWN";
  }

  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(date).toUpperCase();
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" }).format(date);
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: "UTC" }).format(date);

  return `UPDATED ${month} ${day}, ${year}`;
}

import { type KeyboardEvent, type MouseEvent } from "react";

import { CardShell } from "../../../components/ui";
import type { RunRecord } from "../../../data/mockRuns";
import { getBracketLabel } from "../../home/logic";
import { formatCompactBracketLabel } from "../logic/searchResultDisplay";
import {
  BookmarkIcon,
  CheckIcon,
  CostMetric,
  InfoBadge,
  LibraryCardCharacterStack,
  PlusIcon,
  Thumbnail,
} from "./searchResultsUi";

export function LibraryRecordCard({
  run,
  candidateLimitReached,
  isCandidate,
  isWatchLater,
  onAddCandidate,
  onToggleWatchLater,
  onSelectRun,
}: {
  run: RunRecord;
  candidateLimitReached: boolean;
  isCandidate: boolean;
  isWatchLater: boolean;
  onAddCandidate: (runId: string) => void;
  onToggleWatchLater: (runId: string) => void;
  onSelectRun: (runId: string) => void;
}) {
  const bracketLabel = formatCompactBracketLabel(getBracketLabel(run.bracket));
  const visibleTags = Array.from(new Set(run.tags)).slice(0, 4);
  const openDetail = () => onSelectRun(run.id);
  const compareDisabled = !isCandidate && candidateLimitReached;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openDetail();
  };

  const handleAddCandidate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (compareDisabled) {
      return;
    }

    onAddCandidate(run.id);
  };

  const handleToggleWatchLater = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleWatchLater(run.id);
  };

  return (
    <CardShell
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={handleKeyDown}
      interactive
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[8px]"
      aria-label={`${run.title} の詳細を見る`}
    >
      <Thumbnail run={run} />
      <div className="flex flex-1 flex-col gap-2.5 px-[11px] pb-[10px] pt-[11px]">
        <div className="flex min-w-0 items-center gap-2">
          <LibraryCardCharacterStack run={run} />
          <span className="h-3 w-px shrink-0 bg-[#d1d5db]" />
          <span className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-[#111827]">{run.userName}</span>
          <span className="flex shrink-0 items-center gap-1">
            <InfoBadge>{run.platform}</InfoBadge>
            <InfoBadge>{run.ruleset}</InfoBadge>
          </span>
        </div>

        <h3 className="line-clamp-2 text-[12px] font-semibold leading-[1.45] text-[#374151]">{run.title}</h3>

        <div className="grid min-w-0 grid-cols-3 gap-x-2 rounded-[10px] bg-[#f0f2f5] px-2.5 py-1.5">
          <CostMetric label="CHAR" value={run.charCost} />
          <CostMetric label="WEAPON" value={run.weaponCost} />
          <CostMetric label="BRACKET" value={bracketLabel} />
        </div>

        <div className="flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <span key={`${run.id}-${tag}`} className="max-w-full truncate rounded-full bg-[#f0f2f5] px-2 py-0.5 text-[10px] font-bold text-[#6b7280]">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#edf0f4] pt-2 text-[11px] font-extrabold text-[#5f6678]">
          <button
            type="button"
            onClick={handleAddCandidate}
            aria-disabled={compareDisabled || isCandidate}
            className={`flex items-center gap-1 transition ${compareDisabled ? "cursor-not-allowed text-[#b8bec8]" : "hover:text-[#111827]"} ${isCandidate ? "text-[#111827]" : ""}`}
          >
            {isCandidate ? <CheckIcon className="h-[11px] w-[11px]" /> : <PlusIcon className="h-[11px] w-[11px]" />}
            {isCandidate ? "追加済み" : compareDisabled ? "2件まで" : "比較に追加"}
          </button>
          <button type="button" onClick={handleToggleWatchLater} aria-pressed={isWatchLater} className={`flex items-center gap-1 transition hover:text-[#111827] ${isWatchLater ? "text-[#111827]" : ""}`}>
            <BookmarkIcon className={isWatchLater ? "h-[11px] w-[11px] fill-current" : "h-[11px] w-[11px]"} />
            {isWatchLater ? "保存済み" : "あとで見る"}
          </button>
        </div>
      </div>
    </CardShell>
  );
}

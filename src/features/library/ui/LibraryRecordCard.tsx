import { type KeyboardEvent, type MouseEvent } from "react";

import { CardShell } from "../../../components/ui";
import type { RunRecord } from "../../../data/mockRuns";
import { LIBRARY_RECORD_CARD_ACTION_ICON_CLASS } from "../config";
import { getLibraryRecordCardDisplay } from "../logic/recordCardDisplay";
import { BookmarkIcon } from "./searchResultsUi";
import {
  CheckIcon,
  LibraryRecordActionButton,
  LibraryRecordCostMetric,
  LibraryRecordInfoBadge,
  LibraryRecordTagPill,
  LibraryRecordThumbnail,
  LibraryCardCharacterStack,
  PlusIcon,
} from "./recordCardParts";

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
  const display = getLibraryRecordCardDisplay(run, {
    candidateLimitReached,
    isCandidate,
    isWatchLater,
  });
  const openDetail = () => onSelectRun(run.id);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openDetail();
  };

  const handleAddCandidate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (display.compareAction.disabled) {
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
      aria-label={display.detailAriaLabel}
    >
      <LibraryRecordThumbnail run={run} bracketLabel={display.bracketLabel} />
      <div className="flex flex-1 flex-col gap-2.5 px-[11px] pb-[10px] pt-[11px]">
        <div className="flex min-w-0 items-center gap-2">
          <LibraryCardCharacterStack run={run} />
          <span className="h-3 w-px shrink-0 bg-[#d1d5db]" />
          <span className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-[#111827]">{run.userName}</span>
          <span className="flex shrink-0 items-center gap-1">
            <LibraryRecordInfoBadge>{run.platform}</LibraryRecordInfoBadge>
            <LibraryRecordInfoBadge>{run.ruleset}</LibraryRecordInfoBadge>
          </span>
        </div>

        <h3 className="line-clamp-2 text-[12px] font-semibold leading-[1.45] text-[#374151]">{run.title}</h3>

        <div className="grid min-w-0 grid-cols-3 gap-x-2 rounded-[10px] bg-[#f0f2f5] px-2.5 py-1.5">
          <LibraryRecordCostMetric label="CHAR" value={run.charCost} />
          <LibraryRecordCostMetric label="WEAPON" value={run.weaponCost} />
          <LibraryRecordCostMetric label="BRACKET" value={display.bracketLabel} />
        </div>

        <div className="flex flex-wrap gap-1">
          {display.visibleTags.map((tag) => (
            <LibraryRecordTagPill key={`${run.id}-${tag}`} tag={tag} />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#edf0f4] pt-2 text-[11px] font-extrabold text-[#5f6678]">
          <LibraryRecordActionButton
            type="button"
            onClick={handleAddCandidate}
            aria-disabled={display.compareAction.disabled || display.compareAction.state === "added"}
            active={display.compareAction.state === "added"}
            disabledTone={display.compareAction.disabled}
          >
            {display.compareAction.state === "added" ? <CheckIcon className={LIBRARY_RECORD_CARD_ACTION_ICON_CLASS} /> : <PlusIcon className={LIBRARY_RECORD_CARD_ACTION_ICON_CLASS} />}
            {display.compareAction.label}
          </LibraryRecordActionButton>
          <LibraryRecordActionButton type="button" onClick={handleToggleWatchLater} aria-pressed={isWatchLater} active={display.watchAction.state === "saved"}>
            <BookmarkIcon className={display.watchAction.state === "saved" ? `${LIBRARY_RECORD_CARD_ACTION_ICON_CLASS} fill-current` : LIBRARY_RECORD_CARD_ACTION_ICON_CLASS} />
            {display.watchAction.label}
          </LibraryRecordActionButton>
        </div>
      </div>
    </CardShell>
  );
}

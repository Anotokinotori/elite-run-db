import type { RunRecord } from "../../../data/mockRuns";
import { getBracketLabel } from "../../home/logic";
import {
  LIBRARY_RECORD_CARD_LABELS,
  LIBRARY_RECORD_CARD_VISIBLE_TAG_LIMIT,
} from "../config";

export type LibraryRecordCardCompareState = "added" | "limited" | "available";
export type LibraryRecordCardWatchState = "saved" | "idle";

type LibraryRecordCardState = {
  candidateLimitReached: boolean;
  isCandidate: boolean;
  isWatchLater: boolean;
};

function formatCompactBracketLabel(label: string) {
  return label.length > 4 ? `${label.slice(0, 3)}.` : label;
}

export function getLibraryRecordCardCompareState({
  candidateLimitReached,
  isCandidate,
}: Pick<LibraryRecordCardState, "candidateLimitReached" | "isCandidate">): LibraryRecordCardCompareState {
  if (isCandidate) {
    return "added";
  }

  return candidateLimitReached ? "limited" : "available";
}

export function getLibraryRecordCardWatchState(isWatchLater: boolean): LibraryRecordCardWatchState {
  return isWatchLater ? "saved" : "idle";
}

export function getVisibleLibraryRecordTags(tags: string[]) {
  return Array.from(new Set(tags)).slice(0, LIBRARY_RECORD_CARD_VISIBLE_TAG_LIMIT);
}

function getCompareActionLabel(state: LibraryRecordCardCompareState) {
  switch (state) {
    case "added":
      return LIBRARY_RECORD_CARD_LABELS.compareAdded;
    case "limited":
      return LIBRARY_RECORD_CARD_LABELS.compareLimited;
    case "available":
      return LIBRARY_RECORD_CARD_LABELS.compareAvailable;
  }
}

function getWatchActionLabel(state: LibraryRecordCardWatchState) {
  return state === "saved" ? LIBRARY_RECORD_CARD_LABELS.watchSaved : LIBRARY_RECORD_CARD_LABELS.watchIdle;
}

export function getLibraryRecordCardDisplay(run: RunRecord, state: LibraryRecordCardState) {
  const compareState = getLibraryRecordCardCompareState(state);
  const watchState = getLibraryRecordCardWatchState(state.isWatchLater);

  return {
    bracketLabel: formatCompactBracketLabel(getBracketLabel(run.bracket)),
    detailAriaLabel: LIBRARY_RECORD_CARD_LABELS.detailAriaLabel(run.title),
    visibleTags: getVisibleLibraryRecordTags(run.tags),
    compareAction: {
      disabled: compareState === "limited",
      label: getCompareActionLabel(compareState),
      state: compareState,
    },
    watchAction: {
      label: getWatchActionLabel(watchState),
      state: watchState,
    },
  };
}

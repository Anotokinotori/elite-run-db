import { describe, expect, it } from "vitest";

import { mockRuns, type RunRecord } from "../../../data/mockRuns";
import { getLibraryRecordCardCompareState, getLibraryRecordCardDisplay, getLibraryRecordCardWatchState } from "./recordCardDisplay";

const baseRun: RunRecord = {
  ...mockRuns[0],
  title: "Test Run",
  tags: ["tag-a", "tag-b", "tag-a", "tag-c", "tag-d", "tag-e"],
  bracket: 2,
};

describe("library record card display logic", () => {
  it("dedupes visible tags and enforces the card tag limit", () => {
    const display = getLibraryRecordCardDisplay(baseRun, {
      candidateLimitReached: false,
      isCandidate: false,
      isWatchLater: false,
    });

    expect(display.visibleTags).toEqual(["tag-a", "tag-b", "tag-c", "tag-d"]);
  });

  it("uses the existing compact bracket label and detail aria label", () => {
    const display = getLibraryRecordCardDisplay(baseRun, {
      candidateLimitReached: false,
      isCandidate: false,
      isWatchLater: false,
    });

    expect(display.bracketLabel).toBe("Mid.");
    expect(display.detailAriaLabel).toBe("Test Run の詳細を見る");
  });

  it("selects compare action state and labels", () => {
    expect(getLibraryRecordCardCompareState({ candidateLimitReached: false, isCandidate: false })).toBe("available");
    expect(getLibraryRecordCardCompareState({ candidateLimitReached: true, isCandidate: false })).toBe("limited");
    expect(getLibraryRecordCardCompareState({ candidateLimitReached: true, isCandidate: true })).toBe("added");

    expect(
      getLibraryRecordCardDisplay(baseRun, {
        candidateLimitReached: false,
        isCandidate: false,
        isWatchLater: false,
      }).compareAction,
    ).toMatchObject({ disabled: false, label: "比較に追加", state: "available" });

    expect(
      getLibraryRecordCardDisplay(baseRun, {
        candidateLimitReached: true,
        isCandidate: false,
        isWatchLater: false,
      }).compareAction,
    ).toMatchObject({ disabled: true, label: "2件まで", state: "limited" });

    expect(
      getLibraryRecordCardDisplay(baseRun, {
        candidateLimitReached: true,
        isCandidate: true,
        isWatchLater: false,
      }).compareAction,
    ).toMatchObject({ disabled: false, label: "追加済み", state: "added" });
  });

  it("selects watch action state and labels", () => {
    expect(getLibraryRecordCardWatchState(false)).toBe("idle");
    expect(getLibraryRecordCardWatchState(true)).toBe("saved");

    expect(
      getLibraryRecordCardDisplay(baseRun, {
        candidateLimitReached: false,
        isCandidate: false,
        isWatchLater: false,
      }).watchAction,
    ).toMatchObject({ label: "あとで見る", state: "idle" });

    expect(
      getLibraryRecordCardDisplay(baseRun, {
        candidateLimitReached: false,
        isCandidate: false,
        isWatchLater: true,
      }).watchAction,
    ).toMatchObject({ label: "保存済み", state: "saved" });
  });
});

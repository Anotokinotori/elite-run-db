import { describe, expect, it } from "vitest";

import { addRecentRunId, upsertLibrarySearchHistory, type LibrarySearchHistoryEntry } from "./actionStorage";
import { cloneLibrarySearchFilters, createEmptyLibrarySearchFilters, getFirstActivePanelFromFilters } from "./searchFilters";

describe("library action storage logic", () => {
  it("records recent run ids without duplicates and ignores unknown ids", () => {
    const initial = ["run-npui-high", "run-npui-balance"];

    expect(addRecentRunId(initial, "missing-run", 3)).toBe(initial);
    expect(addRecentRunId(initial, "run-budget-bow", 2)).toEqual(["run-budget-bow", "run-npui-high"]);
    expect(addRecentRunId(initial, "run-npui-balance", 3)).toEqual(["run-npui-balance", "run-npui-high"]);
  });

  it("upserts search history by signature and enforces the history limit", () => {
    const filters = createEmptyLibrarySearchFilters();

    expect(upsertLibrarySearchHistory([], "", filters)).toEqual([]);

    const first = upsertLibrarySearchHistory([], "  Chiori  ", filters);
    expect(first).toHaveLength(1);
    expect(first[0].keyword).toBe("Chiori");

    const deduped = upsertLibrarySearchHistory(first, "Chiori", filters);
    expect(deduped).toHaveLength(1);
    expect(deduped[0].signature).toBe(first[0].signature);

    let history: LibrarySearchHistoryEntry[] = [];
    for (let index = 0; index < 11; index += 1) {
      history = upsertLibrarySearchHistory(history, `keyword-${index}`, filters);
    }

    expect(history).toHaveLength(10);
    expect(history[0].keyword).toBe("keyword-10");
    expect(history.at(-1)?.keyword).toBe("keyword-1");
  });
});

describe("library search filter logic", () => {
  it("deep-clones nested filter state", () => {
    const filters = createEmptyLibrarySearchFilters();
    filters.characterFilters.partyCharacters.includeIds.push("chasca");
    filters.buildFilters.weaponIds.include.push("favoniusWarbow");
    filters.selectedTags.push("PC");

    const cloned = cloneLibrarySearchFilters(filters);
    cloned.characterFilters.partyCharacters.includeIds.push("chiori");
    cloned.buildFilters.weaponIds.include.push("peakPatrol");
    cloned.selectedTags.push("High");

    expect(filters.characterFilters.partyCharacters.includeIds).toEqual(["chasca"]);
    expect(filters.buildFilters.weaponIds.include).toEqual(["favoniusWarbow"]);
    expect(filters.selectedTags).toEqual(["PC"]);
  });

  it("selects the first active filter panel using existing priority", () => {
    expect(getFirstActivePanelFromFilters(createEmptyLibrarySearchFilters())).toBeNull();

    const characterFilters = createEmptyLibrarySearchFilters();
    characterFilters.characterFilters.partyCharacters.includeIds.push("chasca");
    expect(getFirstActivePanelFromFilters(characterFilters)).toBe("character");

    const buildFilters = createEmptyLibrarySearchFilters();
    buildFilters.buildFilters.costBracket = 3;
    expect(getFirstActivePanelFromFilters(buildFilters)).toBe("build");

    const categoryFilters = createEmptyLibrarySearchFilters();
    categoryFilters.categoryFilters.ruleset = "高難度";
    expect(getFirstActivePanelFromFilters(categoryFilters)).toBe("category");

    const tagFilters = createEmptyLibrarySearchFilters();
    tagFilters.selectedTags.push("PC");
    expect(getFirstActivePanelFromFilters(tagFilters)).toBe("tag");
  });
});

import { describe, expect, it } from "vitest";

import { getSimilarRuns } from "./getSimilarRuns";
import type { RunRecord } from "../data/mockRuns";

function createRun(overrides: Partial<RunRecord> & Pick<RunRecord, "id">): RunRecord {
  return {
    id: overrides.id,
    title: overrides.title ?? overrides.id,
    userName: overrides.userName ?? "Tester",
    userHandle: overrides.userHandle ?? "@tester",
    postedLabel: overrides.postedLabel ?? "today",
    date: overrides.date ?? "2026-04-01",
    season: overrides.season ?? "Luna3",
    versionLabel: overrides.versionLabel ?? "Luna3",
    ruleset: overrides.ruleset ?? "NPUI",
    platform: overrides.platform ?? "PC",
    region: overrides.region ?? "Mondstadt",
    time: overrides.time ?? "01:00",
    videoUrl: overrides.videoUrl ?? "https://www.youtube.com/watch?v=test",
    summary: overrides.summary ?? "",
    tags: overrides.tags ?? [],
    likeCount: overrides.likeCount ?? 0,
    shareCount: overrides.shareCount ?? 0,
    mainAttackerId: overrides.mainAttackerId ?? "diluc",
    declaredMainAttackerIds: overrides.declaredMainAttackerIds ?? ["diluc"],
    party: overrides.party ?? [
      { characterId: "diluc", cons: 0 },
      { characterId: "xingqiu", cons: 0 },
      { characterId: "bennett", cons: 0 },
      { characterId: "sucrose", cons: 0 },
    ],
    weapons: overrides.weapons ?? [
      { weaponId: "wolfSGravestone", refine: 1 },
      { weaponId: "sacrificialSword", refine: 1 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "sacrificialFragments", refine: 1 },
    ],
    comments: overrides.comments ?? [],
    charCost: overrides.charCost ?? 4,
    weaponCost: overrides.weaponCost ?? 1,
    totalCost: overrides.totalCost ?? 5,
    bracket: overrides.bracket ?? 2,
  };
}

describe("getSimilarRuns", () => {
  it("excludes the base run itself", () => {
    const baseRun = createRun({ id: "base" });
    const results = getSimilarRuns(baseRun, [baseRun], 4);

    expect(results).toEqual([]);
  });

  it("scores same ruleset, season, main attacker, and character overlap", () => {
    const baseRun = createRun({ id: "base" });
    const similarRun = createRun({
      id: "similar",
      party: [
        { characterId: "diluc", cons: 0 },
        { characterId: "xingqiu", cons: 0 },
        { characterId: "zhongli", cons: 0 },
        { characterId: "sucrose", cons: 0 },
      ],
    });

    const [match] = getSimilarRuns(baseRun, [baseRun, similarRun], 4);

    expect(match.run.id).toBe("similar");
    expect(match.score).toBeGreaterThan(0);
    expect(match.reasons).toEqual(
      expect.arrayContaining(["同じルールセット", "同じシーズン", "同じメインアタッカー", "キャラ重複 3"]),
    );
    expect(match.sharedCharacters).toEqual(["diluc", "xingqiu", "sucrose"]);
  });

  it("weights character overlap higher than weapon overlap", () => {
    const baseRun = createRun({ id: "base" });
    const characterHeavyRun = createRun({
      id: "character-heavy",
      mainAttackerId: "keqing",
      party: [
        { characterId: "diluc", cons: 0 },
        { characterId: "xingqiu", cons: 0 },
        { characterId: "jean", cons: 0 },
        { characterId: "mona", cons: 0 },
      ],
      weapons: [
        { weaponId: "aquilaFavonia", refine: 1 },
        { weaponId: "favoniusSword", refine: 1 },
        { weaponId: "skywardBlade", refine: 1 },
        { weaponId: "theWidsith", refine: 1 },
      ],
    });
    const weaponHeavyRun = createRun({
      id: "weapon-heavy",
      mainAttackerId: "keqing",
      party: [
        { characterId: "keqing", cons: 0 },
        { characterId: "jean", cons: 0 },
        { characterId: "mona", cons: 0 },
        { characterId: "qiqi", cons: 0 },
      ],
      weapons: [
        { weaponId: "wolfSGravestone", refine: 1 },
        { weaponId: "sacrificialSword", refine: 1 },
        { weaponId: "skywardBlade", refine: 1 },
        { weaponId: "sacrificialFragments", refine: 1 },
      ],
    });

    const results = getSimilarRuns(baseRun, [baseRun, characterHeavyRun, weaponHeavyRun], 4);

    expect(results.map((result) => result.run.id)).toEqual(["character-heavy", "weapon-heavy"]);
  });

  it("uses time and then date as tie-breakers", () => {
    const baseRun = createRun({ id: "base" });
    const fasterRun = createRun({
      id: "faster",
      mainAttackerId: "keqing",
      party: [
        { characterId: "diluc", cons: 0 },
        { characterId: "jean", cons: 0 },
        { characterId: "mona", cons: 0 },
        { characterId: "qiqi", cons: 0 },
      ],
      weapons: [
        { weaponId: "aquilaFavonia", refine: 1 },
        { weaponId: "favoniusSword", refine: 1 },
        { weaponId: "skywardBlade", refine: 1 },
        { weaponId: "theWidsith", refine: 1 },
      ],
      time: "00:58",
      date: "2026-04-01",
    });
    const slowerNewerRun = createRun({
      id: "slower-newer",
      mainAttackerId: "keqing",
      party: [
        { characterId: "diluc", cons: 0 },
        { characterId: "jean", cons: 0 },
        { characterId: "mona", cons: 0 },
        { characterId: "qiqi", cons: 0 },
      ],
      weapons: [
        { weaponId: "aquilaFavonia", refine: 1 },
        { weaponId: "favoniusSword", refine: 1 },
        { weaponId: "skywardBlade", refine: 1 },
        { weaponId: "theWidsith", refine: 1 },
      ],
      time: "01:02",
      date: "2026-04-05",
    });
    const sameTimeNewerRun = createRun({
      id: "same-time-newer",
      mainAttackerId: "keqing",
      party: [
        { characterId: "diluc", cons: 0 },
        { characterId: "jean", cons: 0 },
        { characterId: "mona", cons: 0 },
        { characterId: "qiqi", cons: 0 },
      ],
      weapons: [
        { weaponId: "aquilaFavonia", refine: 1 },
        { weaponId: "favoniusSword", refine: 1 },
        { weaponId: "skywardBlade", refine: 1 },
        { weaponId: "theWidsith", refine: 1 },
      ],
      time: "00:58",
      date: "2026-04-07",
    });

    const results = getSimilarRuns(baseRun, [baseRun, slowerNewerRun, sameTimeNewerRun, fasterRun], 4);

    expect(results.map((result) => result.run.id)).toEqual(["same-time-newer", "faster", "slower-newer"]);
  });
});

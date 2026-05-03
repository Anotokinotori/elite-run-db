import { type RunRecord } from "../data/mockRuns";

import { versionRank } from "./versionLabels";

export type SimilarRunMatch = {
  run: RunRecord;
  score: number;
  reasons: string[];
  sharedCharacters: string[];
  sharedWeapons: string[];
};

function toSeconds(time: string) {
  const parts = time.split(":").map((part) => Number(part));

  if (parts.some((part) => Number.isNaN(part))) {
    return Number.POSITIVE_INFINITY;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return parts[0] ?? Number.POSITIVE_INFINITY;
}

export function getSimilarRuns(baseRun: RunRecord, allRuns: RunRecord[], limit = 4): SimilarRunMatch[] {
  return allRuns
    .filter((run) => run.id !== baseRun.id)
    .map((run) => {
      let score = 0;
      const reasons: string[] = [];
      const baseCharacters = new Set(baseRun.party.map((member) => member.characterId));
      const runCharacters = new Set(run.party.map((member) => member.characterId));
      const baseWeapons = new Set(baseRun.weapons.map((weapon) => weapon.weaponId));
      const runWeapons = new Set(run.weapons.map((weapon) => weapon.weaponId));
      const sharedCharacters = [...baseCharacters].filter((characterId) => runCharacters.has(characterId));
      const sharedWeapons = [...baseWeapons].filter((weaponId) => runWeapons.has(weaponId));

      if (run.ruleset === baseRun.ruleset) {
        score += 30;
        reasons.push("同じルールセット");
      }

      if (versionRank(run.season) === versionRank(baseRun.season)) {
        score += 18;
        reasons.push("同じシーズン");
      }

      if (run.mainAttackerId === baseRun.mainAttackerId) {
        score += 28;
        reasons.push("同じメインアタッカー");
      }

      if (sharedCharacters.length > 0) {
        score += sharedCharacters.length * 14;
        reasons.push(`キャラ重複 ${sharedCharacters.length}`);
      }

      if (sharedWeapons.length > 0) {
        score += sharedWeapons.length * 4;
        reasons.push(`武器重複 ${sharedWeapons.length}`);
      }

      if (run.platform === baseRun.platform) {
        score += 3;
      }

      return {
        run,
        score,
        reasons,
        sharedCharacters,
        sharedWeapons,
      };
    })
    .filter((match) => match.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const timeDelta = toSeconds(left.run.time) - toSeconds(right.run.time);
      if (timeDelta !== 0) {
        return timeDelta;
      }

      return new Date(right.run.date).getTime() - new Date(left.run.date).getTime();
    })
    .slice(0, limit);
}

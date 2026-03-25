import { characterDb, type RunRecord } from "../../../data/mockRuns";
import type { DisplayBucket, HomeRun, HomeRunWithBucket } from "../types";
import { toSeconds } from "./runRecords";

export function getDeclaredMainAttackerIds(run: Pick<RunRecord, "mainAttackerId" | "declaredMainAttackerIds">) {
  if (run.declaredMainAttackerIds.length > 0) {
    return Array.from(new Set(run.declaredMainAttackerIds));
  }

  return [run.mainAttackerId];
}

function normalizePairIds(leftId: string, rightId: string): [string, string] {
  return [leftId, rightId].sort((left, right) => left.localeCompare(right)) as [string, string];
}

function buildDisplayBucketLabel(ids: string[]) {
  return ids.map((id) => characterDb[id]?.name ?? id).join(" + ");
}

function buildSingleDisplayBucket(characterId: string): DisplayBucket {
  return {
    type: "single",
    ids: [characterId],
    key: `single:${characterId}`,
    label: characterDb[characterId]?.name ?? characterId,
  };
}

function buildPairDisplayBucket(leftId: string, rightId: string): DisplayBucket {
  const [normalizedLeftId, normalizedRightId] = normalizePairIds(leftId, rightId);

  return {
    type: "pair",
    ids: [normalizedLeftId, normalizedRightId],
    key: `pair:${normalizedLeftId}+${normalizedRightId}`,
    label: buildDisplayBucketLabel([normalizedLeftId, normalizedRightId]),
  };
}

export function buildDisplayBucket(record: HomeRun, scopeRecords: HomeRun[]): DisplayBucket {
  // single / pair は推測ではなく declaredMainAttackerIds を優先して決める。
  const declaredMainAttackers = getDeclaredMainAttackerIds(record);

  if (declaredMainAttackers.length >= 2) {
    return buildPairDisplayBucket(declaredMainAttackers[0], declaredMainAttackers[1]);
  }

  const primaryAttackerId = declaredMainAttackers[0] ?? record.mainAttackerId;
  const recordTime = toSeconds(record.time);
  let bestCandidateBucket: DisplayBucket | null = null;
  let bestCandidateFastestTime = Number.POSITIVE_INFINITY;

  Array.from(new Set(record.party.map((member) => member.characterId)))
    .filter((characterId) => characterId !== primaryAttackerId)
    .forEach((candidateId) => {
      const candidateBucket = buildPairDisplayBucket(primaryAttackerId, candidateId);
      const fastestFormalPairTime = scopeRecords.reduce<number | null>((bestTime, scopeRecord) => {
        const scopeDeclaredMainAttackers = getDeclaredMainAttackerIds(scopeRecord);

        if (scopeDeclaredMainAttackers.length !== 2) {
          return bestTime;
        }

        const normalizedDeclaredPair = normalizePairIds(scopeDeclaredMainAttackers[0], scopeDeclaredMainAttackers[1]);
        if (normalizedDeclaredPair[0] !== candidateBucket.ids[0] || normalizedDeclaredPair[1] !== candidateBucket.ids[1]) {
          return bestTime;
        }

        const scopeTime = toSeconds(scopeRecord.time);
        if (scopeTime >= recordTime) {
          return bestTime;
        }

        if (bestTime === null || scopeTime < bestTime) {
          return scopeTime;
        }

        return bestTime;
      }, null);

      if (fastestFormalPairTime === null) {
        return;
      }

      if (
        !bestCandidateBucket ||
        fastestFormalPairTime < bestCandidateFastestTime ||
        (fastestFormalPairTime === bestCandidateFastestTime && candidateBucket.key < bestCandidateBucket.key)
      ) {
        bestCandidateBucket = candidateBucket;
        bestCandidateFastestTime = fastestFormalPairTime;
      }
    });

  if (bestCandidateBucket) {
    return bestCandidateBucket;
  }

  return buildSingleDisplayBucket(primaryAttackerId);
}

export function buildCharTopRows(runs: HomeRunWithBucket[]) {
  const bestByBucket = new Map<string, HomeRunWithBucket>();

  runs.forEach((run) => {
    const current = bestByBucket.get(run.displayBucket.key);
    if (!current || toSeconds(run.time) < toSeconds(current.time) || (run.time === current.time && new Date(run.date).getTime() > new Date(current.date).getTime())) {
      bestByBucket.set(run.displayBucket.key, run);
    }
  });

  return Array.from(bestByBucket.values());
}


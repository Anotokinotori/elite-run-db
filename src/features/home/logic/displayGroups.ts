import { characterDb, type RunRecord } from "../../../data/mockRuns";
import type { DisplayGroup, HomeRun, HomeRunWithGroup } from "../types";
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

function buildDisplayGroupLabel(ids: string[]) {
  return ids.map((id) => characterDb[id]?.name ?? id).join(" + ");
}

function buildSingleDisplayGroup(characterId: string): DisplayGroup {
  return {
    type: "single",
    ids: [characterId],
    key: `single:${characterId}`,
    label: characterDb[characterId]?.name ?? characterId,
  };
}

function buildPairDisplayGroup(leftId: string, rightId: string): DisplayGroup {
  const [normalizedLeftId, normalizedRightId] = normalizePairIds(leftId, rightId);

  return {
    type: "pair",
    ids: [normalizedLeftId, normalizedRightId],
    key: `pair:${normalizedLeftId}+${normalizedRightId}`,
    label: buildDisplayGroupLabel([normalizedLeftId, normalizedRightId]),
  };
}

export function buildDisplayGroup(record: HomeRun, targetRuns: HomeRun[]): DisplayGroup {
  // single / pair は推測ではなく declaredMainAttackerIds を優先して決める。
  const declaredMainAttackers = getDeclaredMainAttackerIds(record);

  if (declaredMainAttackers.length >= 2) {
    return buildPairDisplayGroup(declaredMainAttackers[0], declaredMainAttackers[1]);
  }

  const primaryAttackerId = declaredMainAttackers[0] ?? record.mainAttackerId;
  const recordTime = toSeconds(record.time);
  let bestCandidateGroup: DisplayGroup | null = null;
  let bestCandidateFastestTime = Number.POSITIVE_INFINITY;

  Array.from(new Set(record.party.map((member) => member.characterId)))
    .filter((characterId) => characterId !== primaryAttackerId)
    .forEach((candidateId) => {
      const candidateGroup = buildPairDisplayGroup(primaryAttackerId, candidateId);
      const fastestFormalPairTime = targetRuns.reduce<number | null>((bestTime, targetRun) => {
        const targetDeclaredMainAttackers = getDeclaredMainAttackerIds(targetRun);

        if (targetDeclaredMainAttackers.length !== 2) {
          return bestTime;
        }

        const normalizedDeclaredPair = normalizePairIds(targetDeclaredMainAttackers[0], targetDeclaredMainAttackers[1]);
        if (normalizedDeclaredPair[0] !== candidateGroup.ids[0] || normalizedDeclaredPair[1] !== candidateGroup.ids[1]) {
          return bestTime;
        }

        const targetTime = toSeconds(targetRun.time);
        if (targetTime >= recordTime) {
          return bestTime;
        }

        if (bestTime === null || targetTime < bestTime) {
          return targetTime;
        }

        return bestTime;
      }, null);

      if (fastestFormalPairTime === null) {
        return;
      }

      if (
        !bestCandidateGroup ||
        fastestFormalPairTime < bestCandidateFastestTime ||
        (fastestFormalPairTime === bestCandidateFastestTime && candidateGroup.key < bestCandidateGroup.key)
      ) {
        bestCandidateGroup = candidateGroup;
        bestCandidateFastestTime = fastestFormalPairTime;
      }
    });

  if (bestCandidateGroup) {
    return bestCandidateGroup;
  }

  return buildSingleDisplayGroup(primaryAttackerId);
}

export function buildCharTopRows(runs: HomeRunWithGroup[]) {
  const bestByGroup = new Map<string, HomeRunWithGroup>();

  runs.forEach((run) => {
    const current = bestByGroup.get(run.displayGroup.key);
    if (!current || toSeconds(run.time) < toSeconds(current.time) || (run.time === current.time && new Date(run.date).getTime() > new Date(current.date).getTime())) {
      bestByGroup.set(run.displayGroup.key, run);
    }
  });

  return Array.from(bestByGroup.values());
}


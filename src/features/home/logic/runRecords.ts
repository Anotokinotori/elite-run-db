import { characterDb, type Bracket, type RunRecord } from "../../../data/mockRuns";
import { versionRank } from "../../../lib/versionLabels";
import type { HomeRun } from "../types";

export function toSeconds(timeStr: string) {
  const parts = String(timeStr)
    .trim()
    .split(":")
    .map((part) => Number(part));

  if (parts.some((part) => Number.isNaN(part))) {
    return Number.POSITIVE_INFINITY;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return Number.POSITIVE_INFINITY;
}

function getRunSupportIds(run: RunRecord) {
  const partyIds = run.party.map((member) => member.characterId);
  const supportIds = [...partyIds];
  const mainIndex = supportIds.indexOf(run.mainAttackerId);

  if (mainIndex >= 0) {
    supportIds.splice(mainIndex, 1);
  } else {
    supportIds.shift();
  }

  return supportIds;
}

function makeCategoryKey(run: { userId: string; mainAttackerId: string; bracket: Bracket; season: string; isFestival: boolean }) {
  return [run.userId, run.mainAttackerId, run.bracket, run.season, run.isFestival ? "fes" : "main"].join("|");
}

export function normalizeHomeRun(run: RunRecord, festivalRuleset: string): HomeRun {
  const supportIds = getRunSupportIds(run);

  return {
    ...run,
    userId: run.userHandle,
    supportIds,
    support: supportIds.map((id) => characterDb[id]?.name ?? id),
    mainAttacker: characterDb[run.mainAttackerId]?.name ?? run.mainAttackerId,
    isFestival: run.ruleset === festivalRuleset,
    wepCost: run.weaponCost,
    categoryKey: makeCategoryKey({
      userId: run.userHandle,
      mainAttackerId: run.mainAttackerId,
      bracket: run.bracket,
      season: run.season,
      isFestival: run.ruleset === festivalRuleset,
    }),
    rankMove: "same",
  };
}

function isBetterRun(left: HomeRun, right: HomeRun) {
  const timeDiff = toSeconds(left.time) - toSeconds(right.time);

  if (timeDiff !== 0) {
    return timeDiff < 0;
  }

  return new Date(left.date).getTime() > new Date(right.date).getTime();
}

export function applyWRTag(runs: HomeRun[]) {
  if (runs.length === 0) {
    return runs;
  }

  let best = runs[0];
  runs.forEach((run) => {
    if (isBetterRun(run, best)) {
      best = run;
    }
  });

  return runs.map((run) => {
    const tags = run.tags.filter((tag) => tag !== "WR");

    if (run.id === best.id) {
      tags.push("WR");
    }

    return {
      ...run,
      tags,
    };
  });
}

export function matchesLeaderboardScope(
  run: Pick<HomeRun, "season" | "isFestival" | "bracket">,
  filters: {
    season: string;
    isFestival: boolean | null;
    bracket: Bracket | null;
  },
) {
  if (filters.season && !seasonGte(run.season, filters.season)) {
    return false;
  }

  if (filters.isFestival !== null && run.isFestival !== filters.isFestival) {
    return false;
  }

  if (filters.bracket && run.bracket !== filters.bracket) {
    return false;
  }

  return true;
}

export function applyRLogic(runs: HomeRun[]) {
  const bestByCategory = new Map<string, HomeRun>();

  runs.forEach((run) => {
    const current = bestByCategory.get(run.categoryKey);
    if (!current || isBetterRun(run, current)) {
      bestByCategory.set(run.categoryKey, run);
    }
  });

  return Array.from(bestByCategory.values());
}

export function sortRuns<TRun extends HomeRun>(runs: TRun[], sortMode: "time" | "cost" | "date") {
  return [...runs].sort((left, right) => {
    if (sortMode === "cost") {
      const leftCost = left.charCost + left.wepCost;
      const rightCost = right.charCost + right.wepCost;

      if (leftCost !== rightCost) {
        return leftCost - rightCost;
      }

      return toSeconds(left.time) - toSeconds(right.time);
    }

    if (sortMode === "date") {
      return new Date(right.date).getTime() - new Date(left.date).getTime();
    }

    return toSeconds(left.time) - toSeconds(right.time);
  });
}

export function getBestRun(runs: HomeRun[]) {
  if (runs.length === 0) {
    return null;
  }

  return runs.reduce((best, run) => (isBetterRun(run, best) ? run : best), runs[0]);
}

export function seasonGte(runSeason: string, selectedSeason: string) {
  if (!selectedSeason) {
    return true;
  }

  return versionRank(runSeason) <= versionRank(selectedSeason);
}

export function getDefaultSeason(seasons: string[]) {
  if (seasons.length === 0) {
    return "5.0";
  }

  return (
    seasons
      .map((season) => ({ season, rank: versionRank(season) }))
      .sort((left, right) => right.rank - left.rank)[0]?.season ?? seasons[seasons.length - 1]
  );
}

export function getBracketLabel(bracket: Bracket) {
  const labels: Record<Bracket, string> = {
    1: "Low",
    2: "Mid.",
    3: "High",
    4: "Unl.",
  };

  return labels[bracket];
}

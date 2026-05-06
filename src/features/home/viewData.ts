import { HOME_LABELS } from "./config";
import { getBestRun, sortRuns } from "./logic";
import type { HomeFeaturedCard, HomeRun } from "./types";

export function buildFeaturedCards(heroRuns: HomeRun[], runs: HomeRun[]): HomeFeaturedCard[] {
  const firstPostRun = getBestRun(heroRuns.filter((run) => run.tags.includes("New")));
  const seasonalOffmetaRuns = sortRuns(
    heroRuns.filter((run) => run.tags.includes("OffMeta")),
    "time",
  );
  const allOffmetaRuns = sortRuns(
    runs.filter((run) => !run.isFestival && run.tags.includes("OffMeta")),
    "time",
  );
  const offmetaRuns = [...seasonalOffmetaRuns];

  allOffmetaRuns.forEach((run) => {
    if (offmetaRuns.length >= 3 || offmetaRuns.some((entry) => entry.id === run.id)) {
      return;
    }

    offmetaRuns.push(run);
  });

  return [
    {
      key: "first-post",
      title: HOME_LABELS.firstPostLabel,
      run: firstPostRun,
      actionLabel: HOME_LABELS.engageRecordLabel,
      action: "detail",
    },
    ...Array.from({ length: 3 }, (_, index) => ({
      key: `offmeta-${index}`,
      title: HOME_LABELS.offmetaPickupLabel,
      run: offmetaRuns[index] ?? null,
      actionLabel: HOME_LABELS.viewRankingLabel,
      action: "leaderboard" as const,
    })),
  ];
}

export function formatHomePanelUpdatedLabel(runs: Array<Pick<HomeRun, "date"> | null>) {
  const latestDate = runs.reduce((currentLatest, run) => {
    if (!run?.date) {
      return currentLatest;
    }

    if (!currentLatest) {
      return run.date;
    }

    return new Date(`${run.date}T00:00:00Z`).getTime() > new Date(`${currentLatest}T00:00:00Z`).getTime() ? run.date : currentLatest;
  }, "");

  if (!latestDate) {
    return undefined;
  }

  const date = new Date(`${latestDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${month}/${day} 更新`;
}

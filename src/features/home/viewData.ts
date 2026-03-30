import { HOME_ACTIVE_FILTER_CHIP_DEFINITIONS, HOME_LABELS } from "./config";
import { buildFilterChips, getBestRun, sortRuns } from "./logic";
import type { ActiveFilterChipViewData, HomeFeaturedCard, HomeFilterState, HomeRun } from "./types";

export function buildActiveFilterChipsForView(filters: HomeFilterState): ActiveFilterChipViewData[] {
  return buildFilterChips(filters, HOME_ACTIVE_FILTER_CHIP_DEFINITIONS).map((chip) => ({
    ...chip,
    displayLabel: `${chip.prefix}: ${chip.label}`,
  }));
}

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

  const offmetaTheme = { gradient: "from-[#314857] to-[#1f2f38]" };

  return [
    {
      key: "first-post",
      title: HOME_LABELS.firstPostLabel,
      run: firstPostRun,
      theme: { gradient: "from-[#6d3c2f] to-[#3c2520]" },
      actionLabel: HOME_LABELS.engageRecordLabel,
      action: "detail",
    },
    ...Array.from({ length: 3 }, (_, index) => ({
      key: `offmeta-${index}`,
      title: HOME_LABELS.offmetaPickupLabel,
      run: offmetaRuns[index] ?? null,
      theme: offmetaTheme,
      actionLabel: HOME_LABELS.viewRankingLabel,
      action: "leaderboard" as const,
    })),
  ];
}

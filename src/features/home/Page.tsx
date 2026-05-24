import { useMemo, useRef, useState } from "react";

import { AppFooter } from "../../components/AppFooter";
import { ChevronRightIcon } from "../../components/UiIcons";
import { FloatingCta } from "../../components/ui";
import { appRuns } from "../../data/appRuns";
import { type Bracket } from "../../data/mockRuns";
import { SearchIcon } from "./ui/icons";
import {
  FESTIVAL_RULESET,
  HERO_IMAGE_URL,
  HOME_CAROUSEL_CONFIG,
  HOME_LABELS,
  HOME_SEASONS,
  OTHER_RULESET_LABEL,
  OTHER_RULESET_LABELS,
  PRIMARY_RULESET_TABS,
} from "./config";
import { useTopCarousel } from "./hooks/useTopCarousel";
import {
  applyRLogic,
  applyWRTag,
  buildCharTopRows,
  buildDisplayGroup,
  createEmptyHomeFilterState,
  filterRuns,
  getDefaultSeason,
  matchesLeaderboardScope,
  normalizeHomeRun,
  seasonGte,
  sortRuns,
} from "./logic";
import { buildFeaturedCards } from "./viewData";
import { FestivalBanner } from "./sections/FestivalBanner";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { LeaderboardSection } from "./sections/LeaderboardSection";
import { Shell } from "./sections/Shell";
import { TopPanelsCarousel } from "./sections/TopPanelsCarousel";
import type { HomeRun, HomeRunWithGroup, LeaderboardView } from "./types";

const FLOATING_CTA_CLASS = "w-[236px] justify-between";

type HomePageProps = {
  onRequestSubmit: () => void;
  onSelectRun: (runId: string) => void;
  embedded?: boolean;
  selectedSeason?: string;
  onSelectedSeasonChange?: (season: string) => void;
};

export function HomePage({
  onRequestSubmit,
  onSelectRun,
  embedded = false,
  selectedSeason,
  onSelectedSeasonChange,
}: HomePageProps) {
  const leaderboardRef = useRef<HTMLDivElement | null>(null);
  const [runs] = useState<HomeRun[]>(() => applyWRTag(appRuns.map((run) => normalizeHomeRun(run, FESTIVAL_RULESET))));
  const [activeSeasonInternal, setActiveSeasonInternal] = useState(getDefaultSeason(HOME_SEASONS));
  const [activeTab] = useState<"main" | "festival">("main");
  const [filterBracket, setFilterBracket] = useState<Bracket | null>(null);
  const [sortMode] = useState<"time" | "cost" | "date">("time");
  const [enableRLogic] = useState(false);
  const [subHeaderTab, setSubHeaderTab] = useState<string>(PRIMARY_RULESET_TABS[0]);
  const [leaderboardView, setLeaderboardView] = useState<LeaderboardView>("rta");
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false);
  const activeSeason = selectedSeason ?? activeSeasonInternal;
  const setActiveSeason = onSelectedSeasonChange ?? setActiveSeasonInternal;
  const emptyHomeFilters = useMemo(() => createEmptyHomeFilterState(), []);

  const filters = useMemo(
    () => ({
      season: activeSeason,
      isFestival: activeTab === "festival",
      bracket: filterBracket,
      filterState: emptyHomeFilters,
    }),
    [activeSeason, activeTab, emptyHomeFilters, filterBracket],
  );

  const filteredBase = useMemo(() => filterRuns(runs, filters), [filters, runs]);
  const rLogicApplied = useMemo(() => (enableRLogic ? applyRLogic(filteredBase) : filteredBase), [enableRLogic, filteredBase]);
  const filteredRuns = useMemo(() => sortRuns(rLogicApplied, sortMode), [rLogicApplied, sortMode]);
  const leaderboardLastUpdatedDate = useMemo(() => getLatestRunDate(runs), [runs]);
  const charTargetRuns = useMemo(
    () =>
      runs.filter((run) =>
        matchesLeaderboardScope(run, {
          season: activeSeason,
          isFestival: false,
          bracket: filterBracket,
        }),
      ),
    [activeSeason, filterBracket, runs],
  );
  const charTargetRunsWithGroups = useMemo<HomeRunWithGroup[]>(
    () =>
      charTargetRuns.map((run) => ({
        ...run,
        displayGroup: buildDisplayGroup(run, charTargetRuns),
      })),
    [charTargetRuns],
  );
  const charTopRuns = useMemo(() => sortRuns(buildCharTopRows(charTargetRunsWithGroups), "time"), [charTargetRunsWithGroups]);
  const leaderboardRuns = leaderboardView === "char" ? charTopRuns : filteredRuns;
  const heroRuns = useMemo(() => runs.filter((run) => seasonGte(run.season, activeSeason) && !run.isFestival), [activeSeason, runs]);
  const featuredCards = useMemo(() => buildFeaturedCards(heroRuns, runs), [heroRuns, runs]);

  const topCarousel = useTopCarousel({
    enabled: activeTab === "main",
    contentKey: `${activeSeason}:${heroRuns.length}:${featuredCards.length}`,
    ...HOME_CAROUSEL_CONFIG,
  });

  const scrollToLeaderboard = () => {
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewBracket = (bracket: Bracket) => {
    setFilterBracket(bracket);
    setLeaderboardView("rta");
    scrollToLeaderboard();
  };

  return (
    <Shell>
      <Header
        embedded={embedded}
        appTitle={HOME_LABELS.appTitle}
        submitLabel={HOME_LABELS.submitLabel}
        seasons={HOME_SEASONS}
        activeSeason={activeSeason}
        onSeasonChange={setActiveSeason}
        onRequestSubmit={onRequestSubmit}
      />

      {activeTab === "main" ? (
        <Hero
          heroImageUrl={HERO_IMAGE_URL}
          subHeaderTab={subHeaderTab}
          isOtherMenuOpen={isOtherMenuOpen}
          primaryRulesetTabs={PRIMARY_RULESET_TABS}
          otherTabLabel={OTHER_RULESET_LABEL}
          otherRulesetLabels={OTHER_RULESET_LABELS}
          onSelectTab={setSubHeaderTab}
          onToggleOtherMenu={() => setIsOtherMenuOpen((current) => !current)}
          onCloseOtherMenu={() => setIsOtherMenuOpen(false)}
        />
      ) : null}

      <main className="max-w-7xl mx-auto px-5 pt-8 sm:px-6 lg:px-8">
        {activeTab === "main" ? (
          <>
            <TopPanelsCarousel
              viewportRef={topCarousel.viewportRef}
              rowRef={topCarousel.rowRef}
              activeIndex={topCarousel.index}
              heroRuns={heroRuns}
              featuredCards={featuredCards}
              onScroll={topCarousel.handleScroll}
              onJumpTo={topCarousel.jumpTo}
              onViewBracket={handleViewBracket}
              onSelectRun={onSelectRun}
            />
            <LeaderboardSection
              leaderboardRef={leaderboardRef}
              leaderboardView={leaderboardView}
              lastUpdatedDate={leaderboardLastUpdatedDate}
              seasons={HOME_SEASONS}
              activeSeason={activeSeason}
              filterBracket={filterBracket}
              leaderboardRuns={leaderboardRuns}
              onSeasonChange={setActiveSeason}
              onFilterBracketChange={setFilterBracket}
              onLeaderboardViewChange={setLeaderboardView}
              onSelectRun={onSelectRun}
            />
          </>
        ) : null}

        {activeTab === "festival" ? <FestivalBanner /> : null}
      </main>

      <AppFooter />
      <RecordLibraryFloatingCta />
    </Shell>
  );
}

function RecordLibraryFloatingCta() {
  return (
    <FloatingCta
      href="#library"
      aria-label="記録図書館で記録を探す"
      className={FLOATING_CTA_CLASS}
      badge={
        <>
          <SearchIcon size={11} className="shrink-0" />
          Search
        </>
      }
      icon={<ChevronRightIcon className="h-4 w-4 shrink-0 text-white/70" />}
    >
      記録を探す
    </FloatingCta>
  );
}

function getLatestRunDate(runs: HomeRun[]) {
  return runs.reduce((latestDate, run) => {
    if (!latestDate) {
      return run.date;
    }

    return new Date(run.date).getTime() > new Date(latestDate).getTime() ? run.date : latestDate;
  }, "");
}

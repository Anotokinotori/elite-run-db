import { useMemo, useRef, useState } from "react";

import { ChevronRightIcon } from "../../components/UiIcons";
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
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { LeaderboardSection } from "./sections/LeaderboardSection";
import { Shell } from "./sections/Shell";
import { TopPanelsCarousel } from "./sections/TopPanelsCarousel";
import type { HomeRun, HomeRunWithGroup, LeaderboardView } from "./types";

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
              rowRef={topCarousel.rowRef}
              style={topCarousel.style}
              activeIndex={topCarousel.index}
              heroRuns={heroRuns}
              featuredCards={featuredCards}
              onTransitionEnd={topCarousel.handleTransitionEnd}
              onJumpTo={topCarousel.jumpTo}
              onViewBracket={handleViewBracket}
              onSelectRun={onSelectRun}
            />
            <LeaderboardSection
              leaderboardRef={leaderboardRef}
              leaderboardView={leaderboardView}
              lastUpdatedDate={leaderboardLastUpdatedDate}
              filterBracket={filterBracket}
              leaderboardRuns={leaderboardRuns}
              onFilterBracketChange={setFilterBracket}
              onLeaderboardViewChange={setLeaderboardView}
              onSelectRun={onSelectRun}
            />
          </>
        ) : null}

        {activeTab === "festival" ? <FestivalBanner /> : null}
      </main>

      <Footer />
      <RecordLibraryFloatingCta />
    </Shell>
  );
}

function RecordLibraryFloatingCta() {
  return (
    <a
      href="#library"
      aria-label="記録図書館で記録を探す"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 border border-white/25 bg-[#111116] px-3.5 py-3 text-left text-[#d9d9d9] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
    >
      <span className="flex items-center gap-1.5 border border-white/35 px-2 py-1 text-[9px] font-bold uppercase leading-none text-white/60">
        <SearchIcon size={11} className="shrink-0" />
        Library
      </span>
      <span className="cta-shine-text whitespace-nowrap text-[14px] font-black leading-none sm:text-[15px]">記録を探す</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-white/70" />
    </a>
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

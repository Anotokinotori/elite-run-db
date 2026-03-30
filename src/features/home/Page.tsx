import { useMemo, useRef, useState } from "react";

import { mockRuns, selectableCharacters, type Bracket } from "../../data/mockRuns";
import { FilterDrawer } from "./ui/FilterDrawer";
import {
  FESTIVAL_RULESET,
  HERO_IMAGE_URL,
  HOME_CAROUSEL_CONFIG,
  HOME_ELEMENT_FILTER_OPTIONS,
  HOME_FILTER_TAG_GROUP_DEFINITIONS,
  HOME_FILTER_TABS,
  HOME_FILTER_TARGET_OPTIONS,
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
  cloneHomeFilterState,
  createEmptyHomeFilterState,
  filterRuns,
  getDefaultSeason,
  getTagGroups,
  matchesHomeFilterState,
  matchesLeaderboardScope,
  normalizeHomeRun,
  removeSelectionGroupValue,
  seasonGte,
  sortRuns,
} from "./logic";
import { buildActiveFilterChipsForView, buildFeaturedCards } from "./viewData";
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
  const [runs] = useState<HomeRun[]>(() => applyWRTag(mockRuns.map((run) => normalizeHomeRun(run, FESTIVAL_RULESET))));
  const [activeSeasonInternal, setActiveSeasonInternal] = useState(getDefaultSeason(HOME_SEASONS));
  const [activeTab] = useState<"main" | "festival">("main");
  const [filterBracket, setFilterBracket] = useState<Bracket | null>(null);
  const [homeFilters, setHomeFilters] = useState(() => createEmptyHomeFilterState());
  const [sortMode] = useState<"time" | "cost" | "date">("time");
  const [enableRLogic] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subHeaderTab, setSubHeaderTab] = useState<string>(PRIMARY_RULESET_TABS[0]);
  const [leaderboardView, setLeaderboardView] = useState<LeaderboardView>("rta");
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false);
  const activeSeason = selectedSeason ?? activeSeasonInternal;
  const setActiveSeason = onSelectedSeasonChange ?? setActiveSeasonInternal;

  const characters = useMemo(() => selectableCharacters, []);
  const tagGroups = useMemo(() => getTagGroups(runs, HOME_FILTER_TAG_GROUP_DEFINITIONS, "その他"), [runs]);
  const activeFilterChips = useMemo(() => buildActiveFilterChipsForView(homeFilters), [homeFilters]);

  const filters = useMemo(
    () => ({
      season: activeSeason,
      isFestival: activeTab === "festival",
      bracket: filterBracket,
      filterState: homeFilters,
    }),
    [activeSeason, activeTab, filterBracket, homeFilters],
  );

  const filteredBase = useMemo(() => filterRuns(runs, filters), [filters, runs]);
  const rLogicApplied = useMemo(() => (enableRLogic ? applyRLogic(filteredBase) : filteredBase), [enableRLogic, filteredBase]);
  const filteredRuns = useMemo(() => sortRuns(rLogicApplied, sortMode), [rLogicApplied, sortMode]);
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
  const filteredCharRuns = useMemo(
    () => charTargetRunsWithGroups.filter((run) => matchesHomeFilterState(run, homeFilters)),
    [charTargetRunsWithGroups, homeFilters],
  );
  const charTopRuns = useMemo(() => sortRuns(buildCharTopRows(filteredCharRuns), "time"), [filteredCharRuns]);
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

  const handleRemoveFilterChip = (chip: (typeof activeFilterChips)[number]) => {
    setHomeFilters((current) => ({
      ...current,
      [chip.group]: removeSelectionGroupValue(current[chip.group], chip.isExclude ? "exclude" : "include", chip.value),
    }));
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
              filterBracket={filterBracket}
              leaderboardRuns={leaderboardRuns}
              activeFilterChips={activeFilterChips}
              onOpenFilter={() => setIsFilterOpen(true)}
              onRemoveFilterChip={handleRemoveFilterChip}
              onFilterBracketChange={setFilterBracket}
              onLeaderboardViewChange={setLeaderboardView}
              onSelectRun={onSelectRun}
            />
          </>
        ) : null}

        {activeTab === "festival" ? <FestivalBanner /> : null}
      </main>

      <Footer />
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(nextFilters) => {
          setHomeFilters(cloneHomeFilterState(nextFilters));
        }}
        initialFilters={homeFilters}
        characters={characters}
        tagGroups={tagGroups}
        title={HOME_LABELS.filterTitle}
        resetLabel={HOME_LABELS.filterResetLabel}
        applyLabel={HOME_LABELS.filterApplyLabel}
        filterTabs={HOME_FILTER_TABS}
        filterTargetOptions={HOME_FILTER_TARGET_OPTIONS}
        elementFilterOptions={HOME_ELEMENT_FILTER_OPTIONS}
        characterSearchPlaceholder={HOME_LABELS.characterSearchPlaceholder}
        tagSearchPlaceholder={HOME_LABELS.tagSearchPlaceholder}
        emptyCharacterResultLabel={HOME_LABELS.emptyCharacterResultLabel}
        emptyTagResultLabel={HOME_LABELS.emptyTagResultLabel}
      />
    </Shell>
  );
}

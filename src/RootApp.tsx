import { useState } from "react";

import { RoutePlaceholder } from "./app/RoutePlaceholder";
import { isPlaceholderRouteName } from "./app/routes";
import { useAppNavigation } from "./app/useAppNavigation";
import { AppShell } from "./components/AppShell";
import { RecordDetailPage } from "./components/RecordDetailPage";
import { HomePage } from "./components/HomePage";
import { SubmitPage } from "./components/SubmitPage";
import { LibraryPage } from "./features/library/Page";
import { LpPage } from "./features/lp/Page";
import { HOME_SEASONS } from "./features/home/config";

export default function RootApp() {
  const { route, navigate, navigateBackFromSubmit, navigateFromShell, navigateHomeFromTitle } = useAppNavigation();
  const [selectedVersion, setSelectedVersion] = useState(() => HOME_SEASONS[0] ?? "Luna3");

  if (route.name === "lp") {
    return <LpPage />;
  }

  return (
    <AppShell
      routeName={route.name}
      hasUnreadNotifications={route.name !== "notifications"}
      onNavigate={navigateFromShell}
      onTitleClick={navigateHomeFromTitle}
      onRequestSubmit={() => navigate({ name: "submit" })}
    >
      <div style={{ display: route.name === "home" ? "block" : "none" }} aria-hidden={route.name !== "home"}>
        <HomePage
          embedded
          selectedSeason={selectedVersion}
          onSelectedSeasonChange={setSelectedVersion}
          onRequestSubmit={() => navigate({ name: "submit" })}
          onSelectRun={(runId) => navigate({ name: "detail", runId })}
        />
      </div>

      {route.name === "submit" ? <SubmitPage embedded onBack={navigateBackFromSubmit} /> : null}

      {route.name === "detail" ? (
        <RecordDetailPage
          embedded
          key={route.runId}
          runId={route.runId}
          onBack={() => navigate({ name: "home" })}
          onRequestSubmit={() => navigate({ name: "submit" })}
          onSelectRun={(runId) => navigate({ name: "detail", runId })}
        />
      ) : null}

      {route.name === "library" ? <LibraryPage onOpenRankings={navigateHomeFromTitle} onSelectRun={(runId) => navigate({ name: "detail", runId })} /> : null}

      {isPlaceholderRouteName(route.name) ? <RoutePlaceholder routeName={route.name} /> : null}
    </AppShell>
  );
}

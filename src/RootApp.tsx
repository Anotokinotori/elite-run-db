import { useEffect, useState } from "react";

import { RecordDetailPage } from "./components/RecordDetailPage";
import { RunHomePage } from "./components/RunHomePage";
import { RunSubmitPage } from "./components/RunSubmitPage";
import { defaultRunId, getRunById } from "./data/mockRuns";

type AppRoute = { name: "home" } | { name: "detail"; runId: string } | { name: "submit" };

function getRouteFromHash(): AppRoute {
  if (typeof window === "undefined") {
    return { name: "home" };
  }

  const normalizedHash = window.location.hash.replace(/^#/, "");

  if (normalizedHash === "submit") {
    return { name: "submit" };
  }

  if (normalizedHash === "detail") {
    return { name: "detail", runId: defaultRunId };
  }

  if (normalizedHash.startsWith("detail/")) {
    const runId = decodeURIComponent(normalizedHash.slice("detail/".length));
    return { name: "detail", runId: getRunById(runId) ? runId : defaultRunId };
  }

  return { name: "home" };
}

function getHashFromRoute(route: AppRoute) {
  if (route.name === "submit") {
    return "#submit";
  }

  if (route.name === "detail") {
    return `#detail/${encodeURIComponent(route.runId)}`;
  }

  return "#home";
}

export default function RootApp() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash());
  const [lastBrowseRoute, setLastBrowseRoute] = useState<AppRoute>(() => (route.name === "submit" ? { name: "home" } : route));

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (route.name !== "submit") {
      setLastBrowseRoute(route);
    }
  }, [route]);

  useEffect(() => {
    const nextHash = getHashFromRoute(route);

    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  const navigate = (nextRoute: AppRoute) => {
    setRoute(nextRoute);

    const nextHash = getHashFromRoute(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  };

  if (route.name === "submit") {
    return (
      <RunSubmitPage
        onBack={() => {
          navigate(lastBrowseRoute.name === "submit" ? { name: "home" } : lastBrowseRoute);
        }}
      />
    );
  }

  if (route.name === "detail") {
    return (
      <RecordDetailPage
        key={route.runId}
        runId={route.runId}
        onBack={() => navigate({ name: "home" })}
        onRequestSubmit={() => navigate({ name: "submit" })}
      />
    );
  }

  return <RunHomePage onRequestSubmit={() => navigate({ name: "submit" })} onSelectRun={(runId) => navigate({ name: "detail", runId })} />;
}

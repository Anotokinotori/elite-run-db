import { useEffect, useRef, useState } from "react";

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
  const routeRef = useRef(route);
  const previousRouteRef = useRef<AppRoute | null>(null);
  const homeScrollRef = useRef(0);

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getRouteFromHash();

      if (routeRef.current.name === "home" && nextRoute.name !== "home") {
        homeScrollRef.current = window.scrollY;
      }

      setRoute(nextRoute);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    if (route.name !== "submit") {
      setLastBrowseRoute(route);
    }
  }, [route]);

  useEffect(() => {
    const previousRoute = previousRouteRef.current;
    previousRouteRef.current = route;

    const nextHash = getHashFromRoute(route);

    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }

    if (route.name === "home") {
      if (previousRoute && previousRoute.name !== "home") {
        const frameId = window.requestAnimationFrame(() => {
          window.scrollTo({ top: homeScrollRef.current, behavior: "auto" });
        });

        return () => window.cancelAnimationFrame(frameId);
      }

      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  const navigate = (nextRoute: AppRoute) => {
    if (routeRef.current.name === "home" && nextRoute.name !== "home") {
      homeScrollRef.current = window.scrollY;
    }

    setRoute(nextRoute);

    const nextHash = getHashFromRoute(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  };

  return (
    <>
      <div style={{ display: route.name === "home" ? "block" : "none" }} aria-hidden={route.name !== "home"}>
        <RunHomePage onRequestSubmit={() => navigate({ name: "submit" })} onSelectRun={(runId) => navigate({ name: "detail", runId })} />
      </div>

      {route.name === "submit" ? (
        <RunSubmitPage
          onBack={() => {
            navigate(lastBrowseRoute.name === "submit" ? { name: "home" } : lastBrowseRoute);
          }}
        />
      ) : null}

      {route.name === "detail" ? (
        <RecordDetailPage
          key={route.runId}
          runId={route.runId}
          onBack={() => navigate({ name: "home" })}
          onRequestSubmit={() => navigate({ name: "submit" })}
        />
      ) : null}
    </>
  );
}
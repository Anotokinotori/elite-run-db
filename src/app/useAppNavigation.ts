import { useEffect, useRef, useState } from "react";

import {
  type AppRoute,
  type ShellDestination,
  getHashFromRoute,
  getRouteFromLocationParts,
  getRouteFromShellDestination,
  getUrlFromRoute,
  routesEqual,
} from "./routes";

function getRouteFromLocation(): AppRoute {
  if (typeof window === "undefined") {
    return { name: "home" };
  }

  return getRouteFromLocationParts({
    hash: window.location.hash,
    pathname: window.location.pathname,
  });
}

export function useAppNavigation() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromLocation());
  const [lastBrowseRoute, setLastBrowseRoute] = useState<AppRoute>(() => (route.name === "submit" ? { name: "home" } : route));
  const routeRef = useRef(route);
  const previousRouteRef = useRef<AppRoute | null>(null);
  const homeScrollRef = useRef(0);

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getRouteFromLocation();

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

    const currentLocationRoute = getRouteFromLocation();
    if (!routesEqual(currentLocationRoute, route)) {
      setRoute(currentLocationRoute);
      return;
    }

    const nextHash = getHashFromRoute(route);

    if (window.location.pathname !== "/" || window.location.hash !== nextHash) {
      window.history.replaceState(null, "", getUrlFromRoute(route));
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

  const navigateFromShell = (target: ShellDestination) => {
    navigate(getRouteFromShellDestination(target));
  };

  const navigateHomeFromTitle = () => {
    homeScrollRef.current = 0;

    if (routeRef.current.name === "home") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    navigate({ name: "home" });
  };

  const navigateBackFromSubmit = () => {
    navigate(lastBrowseRoute.name === "submit" ? { name: "home" } : lastBrowseRoute);
  };

  return {
    route,
    navigate,
    navigateBackFromSubmit,
    navigateFromShell,
    navigateHomeFromTitle,
  };
}

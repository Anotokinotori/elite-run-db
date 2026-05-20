import { defaultAppRunId, getAppRunById } from "../data/appRuns";

export type AppRoute =
  | { name: "lp" }
  | { name: "home" }
  | { name: "detail"; runId: string }
  | { name: "submit" }
  | { name: "chat" }
  | { name: "library" }
  | { name: "exchange" }
  | { name: "event" }
  | { name: "notifications" }
  | { name: "account" };

export type ShellRouteName = Exclude<AppRoute["name"], "lp">;
export type ShellDestination = Exclude<ShellRouteName, "detail">;
export type PlaceholderRouteName = Extract<AppRoute["name"], "chat" | "exchange" | "event" | "notifications" | "account">;

export type RouteLocationParts = {
  hash?: string;
  pathname?: string;
};

function safeDecodeRouteValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getRouteFromRouteValue(rawValue: string): AppRoute | null {
  const routeValue = rawValue.replace(/^#/, "").replace(/^\/+/, "").replace(/\/+$/, "");
  const normalizedRouteValue = routeValue.toLowerCase();

  if (!normalizedRouteValue || normalizedRouteValue === "home" || normalizedRouteValue === "index.html") {
    return { name: "home" };
  }

  if (normalizedRouteValue === "lp") {
    return { name: "lp" };
  }

  if (normalizedRouteValue === "submit") {
    return { name: "submit" };
  }

  if (normalizedRouteValue === "detail") {
    return { name: "detail", runId: defaultAppRunId };
  }

  if (normalizedRouteValue.startsWith("detail/")) {
    const runId = safeDecodeRouteValue(routeValue.slice("detail/".length));
    return { name: "detail", runId: getAppRunById(runId) ? runId : defaultAppRunId };
  }

  if (normalizedRouteValue === "chat") {
    return { name: "chat" };
  }

  if (normalizedRouteValue === "question") {
    return { name: "chat" };
  }

  if (normalizedRouteValue === "library") {
    return { name: "library" };
  }

  if (normalizedRouteValue === "exchange") {
    return { name: "exchange" };
  }

  if (normalizedRouteValue === "event") {
    return { name: "event" };
  }

  if (normalizedRouteValue === "notifications") {
    return { name: "notifications" };
  }

  if (normalizedRouteValue === "account") {
    return { name: "account" };
  }

  return null;
}

export function getRouteFromLocationParts({ hash = "", pathname = "" }: RouteLocationParts): AppRoute {
  if (hash) {
    const hashRoute = getRouteFromRouteValue(hash);

    if (hashRoute) {
      return hashRoute;
    }
  }

  const pathRoute = getRouteFromRouteValue(pathname);

  if (pathRoute) {
    return pathRoute;
  }

  return { name: "home" };
}

export function getHashFromRoute(route: AppRoute) {
  if (route.name === "lp") {
    return "#lp";
  }

  if (route.name === "submit") {
    return "#submit";
  }

  if (route.name === "detail") {
    return `#detail/${encodeURIComponent(route.runId)}`;
  }

  if (route.name === "chat") {
    return "#chat";
  }

  if (route.name === "library") {
    return "#library";
  }

  if (route.name === "exchange") {
    return "#exchange";
  }

  if (route.name === "event") {
    return "#event";
  }

  if (route.name === "notifications") {
    return "#notifications";
  }

  if (route.name === "account") {
    return "#account";
  }

  return "#home";
}

export function getUrlFromRoute(route: AppRoute) {
  return `/${getHashFromRoute(route)}`;
}

export function routesEqual(a: AppRoute, b: AppRoute) {
  if (a.name !== b.name) {
    return false;
  }

  if (a.name === "detail" && b.name === "detail") {
    return a.runId === b.runId;
  }

  return true;
}

export function getRouteFromShellDestination(target: ShellDestination): AppRoute {
  if (target === "home") {
    return { name: "home" };
  }

  if (target === "submit") {
    return { name: "submit" };
  }

  if (target === "chat") {
    return { name: "chat" };
  }

  if (target === "library") {
    return { name: "library" };
  }

  if (target === "exchange") {
    return { name: "exchange" };
  }

  if (target === "event") {
    return { name: "event" };
  }

  if (target === "notifications") {
    return { name: "notifications" };
  }

  return { name: "account" };
}

export function isPlaceholderRouteName(routeName: AppRoute["name"]): routeName is PlaceholderRouteName {
  return routeName === "chat" || routeName === "exchange" || routeName === "event" || routeName === "notifications" || routeName === "account";
}

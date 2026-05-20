import { describe, expect, it } from "vitest";

import { defaultAppRunId } from "../data/appRuns";

import {
  getHashFromRoute,
  getRouteFromLocationParts,
  getRouteFromRouteValue,
  getRouteFromShellDestination,
  getUrlFromRoute,
  isPlaceholderRouteName,
  routesEqual,
} from "./routes";

describe("app routes", () => {
  it("parses home-like route values", () => {
    expect(getRouteFromRouteValue("")).toEqual({ name: "home" });
    expect(getRouteFromRouteValue("#")).toEqual({ name: "home" });
    expect(getRouteFromRouteValue("/home/")).toEqual({ name: "home" });
    expect(getRouteFromRouteValue("/index.html")).toEqual({ name: "home" });
  });

  it("parses top-level route values", () => {
    expect(getRouteFromRouteValue("#lp")).toEqual({ name: "lp" });
    expect(getRouteFromRouteValue("#submit")).toEqual({ name: "submit" });
    expect(getRouteFromRouteValue("#library")).toEqual({ name: "library" });
    expect(getRouteFromRouteValue("#chat")).toEqual({ name: "chat" });
    expect(getRouteFromRouteValue("#exchange")).toEqual({ name: "exchange" });
    expect(getRouteFromRouteValue("#event")).toEqual({ name: "event" });
    expect(getRouteFromRouteValue("#notifications")).toEqual({ name: "notifications" });
    expect(getRouteFromRouteValue("#account")).toEqual({ name: "account" });
  });

  it("keeps the question alias mapped to chat", () => {
    expect(getRouteFromRouteValue("#question")).toEqual({ name: "chat" });
  });

  it("parses detail routes and falls back to the default run when needed", () => {
    expect(getRouteFromRouteValue("#detail")).toEqual({ name: "detail", runId: defaultAppRunId });
    expect(getRouteFromRouteValue(`#detail/${encodeURIComponent(defaultAppRunId)}`)).toEqual({ name: "detail", runId: defaultAppRunId });
    expect(getRouteFromRouteValue("#detail/missing-run")).toEqual({ name: "detail", runId: defaultAppRunId });
  });

  it("prefers valid hash routes before pathname routes", () => {
    expect(getRouteFromLocationParts({ hash: "#submit", pathname: "/library" })).toEqual({ name: "submit" });
    expect(getRouteFromLocationParts({ hash: "#missing", pathname: "/library" })).toEqual({ name: "library" });
    expect(getRouteFromLocationParts({ hash: "", pathname: "/missing" })).toEqual({ name: "home" });
  });

  it("builds hash and URL values from routes", () => {
    expect(getHashFromRoute({ name: "home" })).toBe("#home");
    expect(getHashFromRoute({ name: "lp" })).toBe("#lp");
    expect(getHashFromRoute({ name: "submit" })).toBe("#submit");
    expect(getHashFromRoute({ name: "detail", runId: "run id/with space" })).toBe("#detail/run%20id%2Fwith%20space");
    expect(getUrlFromRoute({ name: "library" })).toBe("/#library");
  });

  it("compares detail routes by run id and other routes by name", () => {
    expect(routesEqual({ name: "home" }, { name: "home" })).toBe(true);
    expect(routesEqual({ name: "home" }, { name: "library" })).toBe(false);
    expect(routesEqual({ name: "detail", runId: "a" }, { name: "detail", runId: "a" })).toBe(true);
    expect(routesEqual({ name: "detail", runId: "a" }, { name: "detail", runId: "b" })).toBe(false);
  });

  it("maps shell destinations to routes", () => {
    expect(getRouteFromShellDestination("home")).toEqual({ name: "home" });
    expect(getRouteFromShellDestination("notifications")).toEqual({ name: "notifications" });
    expect(getRouteFromShellDestination("account")).toEqual({ name: "account" });
  });

  it("identifies placeholder route names", () => {
    expect(isPlaceholderRouteName("chat")).toBe(true);
    expect(isPlaceholderRouteName("exchange")).toBe(true);
    expect(isPlaceholderRouteName("event")).toBe(true);
    expect(isPlaceholderRouteName("notifications")).toBe(true);
    expect(isPlaceholderRouteName("account")).toBe(true);
    expect(isPlaceholderRouteName("library")).toBe(false);
  });
});

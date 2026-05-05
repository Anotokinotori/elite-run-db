import type { Element, RunRecord } from "../../data/mockRuns";

export type RankMove = "up" | "down" | "same" | "new";
export type LeaderboardView = "rta" | "char" | "fes";
export type DisplayGroup =
  | { type: "single"; ids: [string]; key: string; label: string }
  | { type: "pair"; ids: [string, string]; key: string; label: string };

export type HomeRun = RunRecord & {
  userId: string;
  supportIds: string[];
  support: string[];
  mainAttacker: string;
  isFestival: boolean;
  wepCost: number;
  categoryKey: string;
  rankMove: RankMove;
};

export type HomeRunWithGroup = HomeRun & {
  displayGroup: DisplayGroup;
};

export type IncludeMode = "and" | "or";
export type CharacterFilterTabKey = "partyCharacters" | "mainAttackers";
export type FilterTabKey = "partyCharacters" | "mainAttackers" | "tags";
export type SelectionTarget = "include" | "exclude";

export type SelectionGroupState = {
  includeIds: string[];
  excludeIds: string[];
  includeMode: IncludeMode;
};

export type HomeFilterState = {
  partyCharacters: SelectionGroupState;
  mainAttackers: SelectionGroupState;
  tags: SelectionGroupState;
};

export type TagGroup = {
  key: string;
  label: string;
  tags: string[];
};

export type CharacterAssistFilters = {
  element: Element | null;
};

export type FilterTabOption = {
  key: FilterTabKey;
  label: string;
};

export type SelectionTargetOption = {
  key: SelectionTarget;
  label: string;
};

export type ElementFilterOption = {
  key: Element;
  label: string;
};

export type HomeFeaturedCardAction = "detail" | "leaderboard";

export type HomeFeaturedCard = {
  key: string;
  title: string;
  run: HomeRun | null;
  actionLabel: string;
  action: HomeFeaturedCardAction;
};

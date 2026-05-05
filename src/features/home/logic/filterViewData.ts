import type { HomeRun, TagGroup } from "../types";
import { normalizeRunFilterTags } from "./filterState";

export function getTagGroups(runs: HomeRun[], definitions: TagGroup[], otherLabel = "Other") {
  const presentTags = new Set(runs.flatMap((run) => normalizeRunFilterTags(run)));
  const groups = definitions
    .map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => presentTags.has(tag)),
    }))
    .filter((group) => group.tags.length > 0);
  const knownTags = new Set(groups.flatMap((group) => group.tags));
  const otherTags = Array.from(presentTags)
    .filter((tag) => !knownTags.has(tag))
    .sort((left, right) => left.localeCompare(right));

  if (otherTags.length > 0) {
    groups.push({
      key: "other",
      label: otherLabel,
      tags: otherTags,
    });
  }

  return groups;
}

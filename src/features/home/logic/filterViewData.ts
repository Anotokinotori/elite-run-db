import type { ActiveFilterChip, ActiveFilterChipDefinition, HomeFilterState, HomeRun, TagGroup } from "../types";
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

export function buildFilterChips(filters: HomeFilterState, chipDefinitions: ActiveFilterChipDefinition[]): ActiveFilterChip[] {
  return chipDefinitions.flatMap(({ group, prefix, excludePrefix, resolveLabel }) => {
    const selectionGroup = filters[group];

    return [
      ...selectionGroup.includeIds.map((value) => ({
        key: `${group}-include-${value}`,
        group,
        value,
        label: resolveLabel(value),
        prefix,
        isExclude: false,
      })),
      ...selectionGroup.excludeIds.map((value) => ({
        key: `${group}-exclude-${value}`,
        group,
        value,
        label: resolveLabel(value),
        prefix: excludePrefix,
        isExclude: true,
      })),
    ];
  });
}

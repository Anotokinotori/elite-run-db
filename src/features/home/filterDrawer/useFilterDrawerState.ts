import { useEffect, useMemo, useState } from "react";

import type { Character } from "../../../data/mockRuns";
import { cloneHomeFilterState, createEmptyHomeFilterState, updateSelectionGroup } from "../homeLogic";
import type {
  CharacterAssistFilters,
  CharacterFilterTabKey,
  FilterTabKey,
  HomeFilterState,
  SelectionGroupState,
  SelectionTarget,
  TagGroup,
} from "../types";

function createSelectionTargets(): Record<FilterTabKey, SelectionTarget> {
  return {
    partyCharacters: "include",
    mainAttackers: "include",
    tags: "include",
  };
}

function createCharacterSearchState(): Record<CharacterFilterTabKey, string> {
  return {
    partyCharacters: "",
    mainAttackers: "",
  };
}

function createCharacterAssistFilters(): Record<CharacterFilterTabKey, CharacterAssistFilters> {
  return {
    partyCharacters: { element: null },
    mainAttackers: { element: null },
  };
}

type UseFilterDrawerStateOptions = {
  isOpen: boolean;
  initialFilters: HomeFilterState;
  characters: Character[];
  tagGroups: TagGroup[];
};

export function useFilterDrawerState({ isOpen, initialFilters, characters, tagGroups }: UseFilterDrawerStateOptions) {
  const [draftFilters, setDraftFilters] = useState<HomeFilterState>(() => createEmptyHomeFilterState());
  const [activeTab, setActiveTab] = useState<FilterTabKey>("partyCharacters");
  const [selectionTargets, setSelectionTargets] = useState<Record<FilterTabKey, SelectionTarget>>(() => createSelectionTargets());
  const [characterSearch, setCharacterSearch] = useState<Record<CharacterFilterTabKey, string>>(() => createCharacterSearchState());
  const [tagSearch, setTagSearch] = useState("");
  const [characterAssistFilters, setCharacterAssistFilters] = useState<Record<CharacterFilterTabKey, CharacterAssistFilters>>(() => createCharacterAssistFilters());
  const sortedCharacters = useMemo(() => [...characters].sort((left, right) => left.name.localeCompare(right.name)), [characters]);

  const resetLocalUi = () => {
    setActiveTab("partyCharacters");
    setSelectionTargets(createSelectionTargets());
    setCharacterSearch(createCharacterSearchState());
    setTagSearch("");
    setCharacterAssistFilters(createCharacterAssistFilters());
  };

  const resetDraft = () => {
    setDraftFilters(createEmptyHomeFilterState());
    resetLocalUi();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraftFilters(cloneHomeFilterState(initialFilters));
    resetLocalUi();
  }, [initialFilters, isOpen]);

  const setGroupState = (groupKey: FilterTabKey, updater: (group: SelectionGroupState) => SelectionGroupState) => {
    setDraftFilters((current) => ({
      ...current,
      [groupKey]: updater(current[groupKey]),
    }));
  };

  const toggleGroupValue = (groupKey: FilterTabKey, value: string) => {
    setGroupState(groupKey, (group) => updateSelectionGroup(group, selectionTargets[groupKey], value));
  };

  const getVisibleCharacters = (groupKey: CharacterFilterTabKey) => {
    const query = characterSearch[groupKey].trim().toLowerCase();
    const assistFilters = characterAssistFilters[groupKey];

    return sortedCharacters.filter((character) => {
      const matchesQuery = query.length === 0 || character.name.toLowerCase().includes(query) || character.id.toLowerCase().includes(query);
      const matchesElement = !assistFilters.element || character.element === assistFilters.element;

      return matchesQuery && matchesElement;
    });
  };

  const visibleTagGroups = useMemo(
    () =>
      tagGroups
        .map((group) => ({
          ...group,
          tags: group.tags.filter((tag) => tagSearch.trim().length === 0 || tag.toLowerCase().includes(tagSearch.trim().toLowerCase())),
        }))
        .filter((group) => group.tags.length > 0),
    [tagGroups, tagSearch],
  );

  const isAndMode = draftFilters[activeTab].includeMode === "and";

  return {
    activeTab,
    characterAssistFilters,
    characterSearch,
    draftFilters,
    isAndMode,
    selectionTargets,
    tagSearch,
    visibleTagGroups,
    getVisibleCharacters,
    resetDraft,
    setActiveTab,
    setCharacterAssistFilters,
    setCharacterSearch,
    setGroupState,
    setSelectionTargets,
    setTagSearch,
    toggleGroupValue,
  };
}

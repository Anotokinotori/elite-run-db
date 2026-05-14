import { useEffect, useMemo, useState } from "react";

import { LIBRARY_FILTER_PANELS } from "../config";
import type { LibraryFilterRestoreRequest } from "../logic/actionStorage";
import {
  cloneLibraryBuildFilterState,
  cloneLibraryCategoryFilterState,
  cloneLibrarySearchFilters,
  createEmptyLibraryBuildFilterState,
  createEmptyLibraryCategoryFilterState,
  getFirstActivePanelFromFilters,
  isSelectableFilterKey,
} from "../logic/searchFilters";
import type {
  CharacterSummaryGroup,
  CharacterSummaryTarget,
  LibraryBuildFilterState,
  LibraryCategoryFilterState,
  LibraryFilterKey,
  LibrarySearchFilters,
  SelectableFilterKey,
} from "../types";
import { cloneHomeFilterState, createEmptyHomeFilterState } from "../../home/logic";
import type { HomeFilterState } from "../../home/types";

type UseLibraryFilterEntranceOptions = {
  onModalOpenChange?: (isOpen: boolean) => void;
  onSearch?: (filters: LibrarySearchFilters) => void;
  restoreRequest?: LibraryFilterRestoreRequest | null;
};

export function useLibraryFilterEntrance({
  onModalOpenChange,
  onSearch,
  restoreRequest,
}: UseLibraryFilterEntranceOptions) {
  const [activeKey, setActiveKey] = useState<SelectableFilterKey | null>(null);
  const [desktopModalKey, setDesktopModalKey] = useState<SelectableFilterKey | null>(null);
  const [characterFilters, setCharacterFilters] = useState<HomeFilterState>(() => createEmptyHomeFilterState());
  const [buildFilters, setBuildFilters] = useState<LibraryBuildFilterState>(() => createEmptyLibraryBuildFilterState());
  const [categoryFilters, setCategoryFilters] = useState<LibraryCategoryFilterState>(() => createEmptyLibraryCategoryFilterState());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
  const activeLabel = useMemo(() => LIBRARY_FILTER_PANELS.find((panel) => panel.key === activeKey)?.label ?? "", [activeKey]);

  const createCurrentSearchFilters = (): LibrarySearchFilters => ({
    characterFilters: cloneHomeFilterState(characterFilters),
    buildFilters: cloneLibraryBuildFilterState(buildFilters),
    categoryFilters: cloneLibraryCategoryFilterState(categoryFilters),
    selectedTags: [...selectedTags],
  });

  const handleSearch = () => {
    onSearch?.(createCurrentSearchFilters());
  };

  const handleDesktopPanelClick = (key: LibraryFilterKey) => {
    if (key === "search") {
      handleSearch();
      return;
    }

    if (isSelectableFilterKey(key)) {
      setActiveKey(key);
      setDesktopModalKey(key);
    }
  };

  const handleMobilePanelClick = (key: LibraryFilterKey) => {
    if (key === "search") {
      handleSearch();
      return;
    }

    if (isSelectableFilterKey(key)) {
      setActiveKey(key);
    }
  };

  const handleRemoveCharacterFilter = (group: CharacterSummaryGroup, target: CharacterSummaryTarget, characterId: string) => {
    const key = target === "include" ? "includeIds" : "excludeIds";
    setCharacterFilters((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: current[group][key].filter((id) => id !== characterId),
      },
    }));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  useEffect(() => {
    onModalOpenChange?.(desktopModalKey !== null || isCharacterModalOpen || isWeaponModalOpen);
  }, [desktopModalKey, isCharacterModalOpen, isWeaponModalOpen, onModalOpenChange]);

  useEffect(() => {
    if (!restoreRequest) {
      return;
    }

    const restoredFilters = cloneLibrarySearchFilters(restoreRequest.filters);
    setCharacterFilters(restoredFilters.characterFilters);
    setBuildFilters(restoredFilters.buildFilters);
    setCategoryFilters(restoredFilters.categoryFilters);
    setSelectedTags(restoredFilters.selectedTags);
    setActiveKey(getFirstActivePanelFromFilters(restoredFilters));
  }, [restoreRequest]);

  return {
    activeKey,
    activeLabel,
    buildFilters,
    categoryFilters,
    characterFilters,
    desktopModalKey,
    isCharacterModalOpen,
    isWeaponModalOpen,
    selectedTags,
    handleDesktopPanelClick,
    handleMobilePanelClick,
    handleRemoveCharacterFilter,
    handleToggleTag,
    setBuildFilters,
    setCategoryFilters,
    setCharacterFilters,
    setDesktopModalKey,
    setIsCharacterModalOpen,
    setIsWeaponModalOpen,
    setSelectedTags,
  };
}

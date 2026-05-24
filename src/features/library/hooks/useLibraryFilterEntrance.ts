import { useEffect, useMemo, useState } from "react";

import { LIBRARY_FILTER_PANELS } from "../config";
import type { LibraryFilterRestoreRequest } from "../logic/actionStorage";
import {
  cloneLibraryBuildFilterState,
  cloneLibraryCategoryFilterState,
  cloneLibrarySearchFilters,
  countActiveLibraryFilterSelections,
  createEmptyLibraryBuildFilterState,
  createEmptyLibraryCategoryFilterState,
  getFirstActivePanelFromFilters,
  isSelectableFilterKey,
} from "../logic/searchFilters";
import { hasActiveLibrarySearchFilters } from "../logic/searchResults";
import type {
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

  const hasActiveSearchFilters = useMemo(
    () =>
      hasActiveLibrarySearchFilters({
        characterFilters,
        buildFilters,
        categoryFilters,
        selectedTags,
      }),
    [buildFilters, categoryFilters, characterFilters, selectedTags],
  );
  const activeSelectionCounts = useMemo(
    () =>
      countActiveLibraryFilterSelections({
        characterFilters,
        buildFilters,
        categoryFilters,
        selectedTags,
      }),
    [buildFilters, categoryFilters, characterFilters, selectedTags],
  );

  const handlePanelClick = (key: LibraryFilterKey) => {
    if (key === "search") {
      handleSearch();
      return;
    }

    if (isSelectableFilterKey(key)) {
      setActiveKey(key);
      setDesktopModalKey(key);
    }
  };

  useEffect(() => {
    onModalOpenChange?.(desktopModalKey !== null);
  }, [desktopModalKey, onModalOpenChange]);

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
    activeSelectionCounts,
    hasActiveSearchFilters,
    selectedTags,
    handleDesktopPanelClick: handlePanelClick,
    handleMobilePanelClick: handlePanelClick,
    setBuildFilters,
    setCategoryFilters,
    setCharacterFilters,
    setDesktopModalKey,
    setSelectedTags,
  };
}

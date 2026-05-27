
import { useEffect } from 'react';

import { LIBRARY_FILTER_PANELS } from '../../config';
import type { HomeFilterState } from '../../../home/types';
import type { LibraryBuildFilterState, LibraryCategoryFilterState, SelectableFilterKey } from '../../types';
import { LibraryCharacterFilterModal } from './modals/CharacterFilterModal';
import { LibraryWeaponFilterModal } from './modals/WeaponFilterModal';
import { LibraryCostFilterModal } from './modals/CostFilterModal';
import { LibraryCategoryFilterModal } from './modals/CategoryFilterModal';
import { LibraryTagFilterModal } from './modals/TagFilterModal';

export function LibraryFilterModal({
  activeKey,
  characterFilters,
  buildFilters,
  categoryFilters,
  selectedTags,
  onClose,
  onApplyCharacter,
  onApplyBuild,
  onApplyCategory,
  onApplyTags,
}: {
  activeKey: SelectableFilterKey | null;
  characterFilters: HomeFilterState;
  buildFilters: LibraryBuildFilterState;
  categoryFilters: LibraryCategoryFilterState;
  selectedTags: string[];
  onClose: () => void;
  onApplyCharacter: (filters: HomeFilterState) => void;
  onApplyBuild: (filters: LibraryBuildFilterState) => void;
  onApplyCategory: (filters: LibraryCategoryFilterState) => void;
  onApplyTags: (tags: string[]) => void;
}) {
  const panel = activeKey ? LIBRARY_FILTER_PANELS.find((item) => item.key === activeKey) : null;

  useEffect(() => {
    if (!activeKey) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [activeKey]);

  if (!activeKey || !panel) {
    return null;
  }

  if (activeKey === "character") {
    return <LibraryCharacterFilterModal title={panel.label} initialFilters={characterFilters} onClose={onClose} onApply={onApplyCharacter} />;
  }

  if (activeKey === "weapon") {
    return <LibraryWeaponFilterModal title={panel.label} initialFilters={buildFilters} onClose={onClose} onApply={onApplyBuild} />;
  }

  if (activeKey === "cost") {
    return <LibraryCostFilterModal title={panel.label} initialFilters={buildFilters} onClose={onClose} onApply={onApplyBuild} />;
  }

  if (activeKey === "category") {
    return <LibraryCategoryFilterModal title={panel.label} initialFilters={categoryFilters} onClose={onClose} onApply={onApplyCategory} />;
  }

  return <LibraryTagFilterModal title={panel.label} initialTags={selectedTags} onClose={onClose} onApply={onApplyTags} />;
}

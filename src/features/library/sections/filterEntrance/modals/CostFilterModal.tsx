
import { useEffect, useState } from 'react';

import { cloneLibraryBuildFilterState, createEmptyLibraryBuildFilterState } from '../../../logic/searchFilters';
import { LIBRARY_BUILD_RANGE_LIMITS as BUILD_RANGE_LIMITS, type LibraryBuildFilterState, type NumericRange } from '../../../types';
import { CostBracketSelector, MaxValueSelector, RangeFilterControl } from './FilterControls';
import { LibraryModalFrame } from './LibraryModalFrame';

export function LibraryCostFilterModal({
  title,
  initialFilters,
  onClose,
  onApply,
}: {
  title: string;
  initialFilters: LibraryBuildFilterState;
  onClose: () => void;
  onApply: (filters: LibraryBuildFilterState) => void;
}) {
  const [draft, setDraft] = useState<LibraryBuildFilterState>(() => cloneLibraryBuildFilterState(initialFilters));

  useEffect(() => {
    setDraft(cloneLibraryBuildFilterState(initialFilters));
  }, [initialFilters]);

  const updateRange = (key: "charCostRange" | "weaponCostRange" | "fiveStarWeaponCountRange", range: NumericRange) => {
    setDraft((current) => ({ ...current, [key]: range }));
  };

  const reset = () => {
    const emptyFilters = createEmptyLibraryBuildFilterState();
    setDraft((current) => ({
      ...current,
      costBracket: emptyFilters.costBracket,
      charCostRange: emptyFilters.charCostRange,
      weaponCostRange: emptyFilters.weaponCostRange,
      fiveStarWeaponCountRange: emptyFilters.fiveStarWeaponCountRange,
      maxConstellation: emptyFilters.maxConstellation,
      maxFiveStarRefinement: emptyFilters.maxFiveStarRefinement,
    }));
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={reset} onApply={() => onApply(cloneLibraryBuildFilterState(draft))}>
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <MaxValueSelector title="最大凸数" prefix="C" max={6} value={draft.maxConstellation} onChange={(value) => setDraft((current) => ({ ...current, maxConstellation: value }))} />
          <MaxValueSelector title="最大精錬" prefix="R" min={1} max={5} value={draft.maxFiveStarRefinement} onChange={(value) => setDraft((current) => ({ ...current, maxFiveStarRefinement: value }))} />
          <CostBracketSelector value={draft.costBracket} onChange={(value) => setDraft((current) => ({ ...current, costBracket: value }))} />
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          <RangeFilterControl title="キャラCost" value={draft.charCostRange} limit={BUILD_RANGE_LIMITS.charCost} onChange={(range) => updateRange("charCostRange", range)} />
          <RangeFilterControl title="武器Cost" value={draft.weaponCostRange} limit={BUILD_RANGE_LIMITS.weaponCost} onChange={(range) => updateRange("weaponCostRange", range)} />
          <RangeFilterControl title="星5武器装備数" value={draft.fiveStarWeaponCountRange} limit={BUILD_RANGE_LIMITS.fiveStarWeaponCount} onChange={(range) => updateRange("fiveStarWeaponCountRange", range)} />
        </div>
      </div>
    </LibraryModalFrame>
  );
}

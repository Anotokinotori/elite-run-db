
import { useEffect, useState } from 'react';

import { cloneLibraryCategoryFilterState, createEmptyLibraryCategoryFilterState } from '../../../logic/searchFilters';
import type { LibraryCategoryFilterState } from '../../../types';
import { DEVICE_OPTIONS, FOOD_OPTIONS, PLAY_STYLE_OPTIONS, RULESET_OPTIONS, VERSION_OPTIONS } from '../config';
import { ChoiceFilterGroup, LibrarySelectControl } from './FilterControls';
import { LibraryModalFrame } from './LibraryModalFrame';

export function LibraryCategoryFilterModal({
  title,
  initialFilters,
  onClose,
  onApply,
}: {
  title: string;
  initialFilters: LibraryCategoryFilterState;
  onClose: () => void;
  onApply: (filters: LibraryCategoryFilterState) => void;
}) {
  const [draft, setDraft] = useState<LibraryCategoryFilterState>(() => cloneLibraryCategoryFilterState(initialFilters));

  useEffect(() => {
    setDraft(cloneLibraryCategoryFilterState(initialFilters));
  }, [initialFilters]);

  const update = <Key extends keyof LibraryCategoryFilterState>(key: Key, value: LibraryCategoryFilterState[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={() => setDraft(createEmptyLibraryCategoryFilterState())} onApply={() => onApply(cloneLibraryCategoryFilterState(draft))}>
      <div className="grid gap-3 lg:grid-cols-2">
        <LibrarySelectControl title="カテゴリ" value={draft.ruleset} options={RULESET_OPTIONS} placeholder="カテゴリを選択" onChange={(value) => update("ruleset", value)} />
        <LibrarySelectControl title="期間・バージョン" value={draft.version} options={VERSION_OPTIONS} placeholder="期間を選択" onChange={(value) => update("version", value)} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <ChoiceFilterGroup title="人数" options={PLAY_STYLE_OPTIONS} value={draft.playStyle} onChange={(value) => update("playStyle", value)} />
        <ChoiceFilterGroup title="飯バフ" options={FOOD_OPTIONS} value={draft.food} onChange={(value) => update("food", value)} />
        <ChoiceFilterGroup title="端末" options={DEVICE_OPTIONS} value={draft.device} onChange={(value) => update("device", value)} />
      </div>
    </LibraryModalFrame>
  );
}

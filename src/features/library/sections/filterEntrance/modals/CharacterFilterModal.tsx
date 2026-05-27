
import { useEffect, useId, useMemo, useState } from 'react';

import { CharacterIcon } from '../../../../../components/CharacterIcon';
import { type Element, selectableCharacters } from '../../../../../data/mockRuns';
import { HOME_ELEMENT_FILTER_OPTIONS, HOME_FILTER_TARGET_OPTIONS } from '../../../../home/config';
import { cloneHomeFilterState, createEmptyHomeFilterState, updateSelectionGroup } from '../../../../home/logic';
import type { CharacterFilterTabKey, HomeFilterState, SelectionTarget } from '../../../../home/types';
import { SearchIcon } from '../../../../home/ui/icons';
import type { CharacterSummaryGroup, CharacterSummaryTarget } from '../../../types';
import { CHARACTER_FILTER_MODAL_TABS } from '../config';
import { CombinedCharacterSummaryBox } from './ModalShared';
import { LibraryModalFrame } from './LibraryModalFrame';

export function LibraryCharacterFilterModal({
  title,
  initialFilters,
  onClose,
  onApply,
}: {
  title: string;
  initialFilters: HomeFilterState;
  onClose: () => void;
  onApply: (filters: HomeFilterState) => void;
}) {
  const includeModeSwitchId = useId();
  const [draft, setDraft] = useState<HomeFilterState>(() => cloneHomeFilterState(initialFilters));
  const [activeTab, setActiveTab] = useState<CharacterFilterTabKey>("partyCharacters");
  const [selectionTarget, setSelectionTarget] = useState<SelectionTarget>("include");
  const [query, setQuery] = useState("");
  const [elementFilter, setElementFilter] = useState<Element | null>(null);

  useEffect(() => {
    setDraft(cloneHomeFilterState(initialFilters));
    setActiveTab("partyCharacters");
    setSelectionTarget("include");
    setQuery("");
    setElementFilter(null);
  }, [initialFilters]);

  const visibleCharacters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...selectableCharacters]
      .sort((left, right) => left.name.localeCompare(right.name))
      .filter((character) => {
        const matchesQuery = normalizedQuery.length === 0 || character.name.toLowerCase().includes(normalizedQuery) || character.id.toLowerCase().includes(normalizedQuery);
        const matchesElement = !elementFilter || character.element === elementFilter;
        return matchesQuery && matchesElement;
      });
  }, [elementFilter, query]);

  const toggleCharacter = (characterId: string) => {
    setDraft((current) => ({
      ...current,
      [activeTab]: updateSelectionGroup(current[activeTab], selectionTarget, characterId),
    }));
  };

  const removeCharacterFilter = (group: CharacterSummaryGroup, target: CharacterSummaryTarget, characterId: string) => {
    const key = target === "include" ? "includeIds" : "excludeIds";
    setDraft((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: current[group][key].filter((id) => id !== characterId),
      },
    }));
  };

  const reset = () => {
    setDraft(createEmptyHomeFilterState());
    setActiveTab("partyCharacters");
    setSelectionTarget("include");
    setQuery("");
    setElementFilter(null);
  };

  const activeGroup = draft[activeTab];
  const isAndMode = activeGroup.includeMode === "and";

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={reset} onApply={() => onApply(cloneHomeFilterState(draft))}>
      <div className="space-y-5">
        <div className="border-b border-[#e5e7eb]">
          <div className="flex items-end justify-between overflow-x-auto px-1 pb-0 text-[13px] font-semibold md:text-[14px]">
            {CHARACTER_FILTER_MODAL_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`-mb-px flex-1 shrink-0 border-b-2 pb-4 text-center transition-colors ${
                  activeTab === tab.key ? "border-[#111827] text-[#111827]" : "border-transparent text-[#8d93a3] hover:text-[#333333]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex justify-center md:flex-1">
              <div className="flex w-full max-w-[320px] items-center overflow-hidden rounded-full border border-[#d8dde6] bg-[#edf1f5] sm:max-w-[360px]" aria-label="Selection target">
                {HOME_FILTER_TARGET_OPTIONS.map((option) => (
                  <button
                    key={`${activeTab}-target-${option.key}`}
                    type="button"
                    className={`flex-1 px-5 py-2 text-[13px] font-semibold transition-colors sm:px-7 ${
                      selectionTarget === option.key ? "bg-[#111827] text-white" : "bg-transparent text-[#5f6678] hover:bg-white hover:text-[#111827]"
                    }`}
                    onClick={() => setSelectionTarget(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:justify-end">
              <span className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${activeGroup.includeMode === "or" ? "text-[#333333]" : "text-[#8d93a3]"}`}>OR</span>
              <div className="checkbox-wrapper-5 shrink-0">
                <div className="check">
                  <input
                    id={includeModeSwitchId}
                    type="checkbox"
                    checked={isAndMode}
                    onChange={() => setDraft((current) => ({ ...current, [activeTab]: { ...current[activeTab], includeMode: isAndMode ? "or" : "and" } }))}
                    aria-label="Include mode"
                  />
                  <label htmlFor={includeModeSwitchId}>
                    <span className="sr-only">Toggle include mode</span>
                  </label>
                </div>
              </div>
              <span className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${activeGroup.includeMode === "and" ? "text-[#333333]" : "text-[#8d93a3]"}`}>AND</span>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-[18px] border border-[#e5e7eb] bg-[#f7f8fa] p-4">
            <CombinedCharacterSummaryBox title="編成キャラ" includeIds={draft.partyCharacters.includeIds} excludeIds={draft.partyCharacters.excludeIds} group="partyCharacters" onRemove={removeCharacterFilter} />
            <CombinedCharacterSummaryBox title="メインアタッカー" includeIds={draft.mainAttackers.includeIds} excludeIds={draft.mainAttackers.excludeIds} group="mainAttackers" onRemove={removeCharacterFilter} />
          </aside>
          <div className="min-w-0 space-y-4">
            <label className="relative block">
              <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d93a3]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="キャラ名で検索"
                className="h-11 w-full rounded-[14px] border border-[#d8dde6] bg-[#f7f8fa] pl-11 pr-4 text-[14px] text-[#333333] placeholder:text-[#8d93a3] outline-none transition-colors focus:border-[#9aa7ba] focus:bg-white"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {HOME_ELEMENT_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setElementFilter((current) => (current === option.key ? null : option.key))}
                  className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${elementFilter === option.key ? "border-transparent bg-[#111827] text-white" : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="rounded-[16px] bg-[#f6f7f9] p-3">
            {visibleCharacters.length === 0 ? (
              <div className="grid min-h-[240px] place-items-center text-center text-[14px] text-[#7b7b8d]">条件に一致するキャラクターがありません。</div>
            ) : (
              <div className="grid grid-cols-4 gap-3 md:grid-cols-5 lg:grid-cols-6">
                {visibleCharacters.map((character) => {
                  const isInclude = activeGroup.includeIds.includes(character.id);
                  const isExclude = activeGroup.excludeIds.includes(character.id);
                  return (
                    <button
                      key={`${activeTab}-${character.id}`}
                      type="button"
                      onClick={() => toggleCharacter(character.id)}
                      className={`relative rounded-[16px] border bg-white p-2 text-center transition hover:-translate-y-[1px] ${isExclude ? "border-[#efc9b0] bg-[#fff7f2]" : isInclude ? "border-[#8fc7d8] bg-[#eef9fc]" : "border-transparent"}`}
                    >
                      {isInclude || isExclude ? (
                        <span className={`absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold text-white ${isExclude ? "bg-[#c27642]" : "bg-[#6bbbd0]"}`}>
                          {isExclude ? "-" : "+"}
                        </span>
                      ) : null}
                      <div className="flex justify-center">
                        <CharacterIcon characterId={character.id} alt={character.name} fallbackLabel={character.name} size={58} />
                      </div>
                      <div className="mt-2 truncate text-[11px] font-medium text-[#5f6678]">{character.name}</div>
                    </button>
                  );
                })}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </LibraryModalFrame>
  );
}

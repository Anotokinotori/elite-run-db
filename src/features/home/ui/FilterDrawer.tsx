import { useEffect, useId } from "react";

import type { Character } from "../../../data/mockRuns";
import { cloneHomeFilterState } from "../homeLogic";
import { FilterDrawerCharacterTab } from "../filterDrawer/FilterDrawerCharacterTab";
import { FilterDrawerTagTab } from "../filterDrawer/FilterDrawerTagTab";
import { useFilterDrawerState } from "../filterDrawer/useFilterDrawerState";
import type {
  CharacterFilterTabKey,
  ElementFilterOption,
  FilterTabOption,
  HomeFilterState,
  SelectionTargetOption,
  SelectionTarget,
  TagGroup,
} from "../types";

type FilterDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: HomeFilterState) => void;
  initialFilters: HomeFilterState;
  characters: Character[];
  tagGroups: TagGroup[];
  title: string;
  resetLabel: string;
  applyLabel: string;
  filterTabs: FilterTabOption[];
  filterTargetOptions: SelectionTargetOption[];
  elementFilterOptions: ElementFilterOption[];
  characterSearchPlaceholder: string;
  tagSearchPlaceholder: string;
  emptyCharacterResultLabel: string;
  emptyTagResultLabel: string;
};

export function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  characters,
  tagGroups,
  title,
  resetLabel,
  applyLabel,
  filterTabs,
  filterTargetOptions,
  elementFilterOptions,
  characterSearchPlaceholder,
  tagSearchPlaceholder,
  emptyCharacterResultLabel,
  emptyTagResultLabel,
}: FilterDrawerProps) {
  const includeModeSwitchId = useId();
  const {
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
  } = useFilterDrawerState({
    isOpen,
    initialFilters,
    characters,
    tagGroups,
  });

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const selectionTarget = selectionTargets[activeTab];
  const visibleCharacters = activeTab === "tags" ? [] : getVisibleCharacters(activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col border-l border-white/10 bg-[#191919] text-white shadow-[-24px_0_60px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-white/10">
          <div className="flex items-start justify-between gap-4 px-5 py-5 md:px-6">
            <div className="text-[24px] font-semibold text-white">{title}</div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/72"
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="flex items-end justify-between overflow-x-auto px-5 pb-0 text-[13px] font-semibold md:px-6 md:text-[14px]">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`-mb-px flex-1 shrink-0 border-b-2 pb-4 text-center transition-colors ${
                  activeTab === tab.key ? "border-white text-white" : "border-transparent text-white/38 hover:text-white/72"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-6">
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex justify-center">
                <div
                  className="flex w-full max-w-[320px] items-center overflow-hidden rounded-full border border-white/12 bg-[#262526]/70 sm:max-w-[360px]"
                  aria-label="Selection target"
                >
                  {filterTargetOptions.map((option) => (
                    <button
                      key={`${activeTab}-target-${option.key}`}
                      type="button"
                      className={`flex-1 px-5 py-2 text-[13px] font-semibold transition-colors sm:px-7 ${
                        selectionTarget === option.key ? "bg-white text-[#1f1f20]" : "bg-transparent text-white/68 hover:bg-white/8 hover:text-white"
                      }`}
                      onClick={() =>
                        setSelectionTargets((current) => ({
                          ...current,
                          [activeTab]: option.key as SelectionTarget,
                        }))
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <span
                  className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                    draftFilters[activeTab].includeMode === "or" ? "text-white/82" : "text-white/40"
                  }`}
                >
                  OR
                </span>
                <div className="checkbox-wrapper-5 shrink-0">
                  <div className="check">
                    <input
                      id={includeModeSwitchId}
                      type="checkbox"
                      checked={isAndMode}
                      onChange={() => setGroupState(activeTab, (group) => ({ ...group, includeMode: isAndMode ? "or" : "and" }))}
                      aria-label="Include mode"
                    />
                    <label htmlFor={includeModeSwitchId}>
                      <span className="sr-only">Toggle include mode</span>
                    </label>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                    draftFilters[activeTab].includeMode === "and" ? "text-white/82" : "text-white/40"
                  }`}
                >
                  AND
                </span>
              </div>
            </section>

            {activeTab === "tags" ? (
              <FilterDrawerTagTab
                draftFilters={draftFilters}
                tagSearch={tagSearch}
                visibleTagGroups={visibleTagGroups}
                tagSearchPlaceholder={tagSearchPlaceholder}
                emptyTagResultLabel={emptyTagResultLabel}
                onTagSearchChange={setTagSearch}
                onToggleTag={(tag) => toggleGroupValue("tags", tag)}
              />
            ) : (
              <FilterDrawerCharacterTab
                activeTab={activeTab as CharacterFilterTabKey}
                draftFilters={draftFilters}
                visibleCharacters={visibleCharacters}
                elementFilterOptions={elementFilterOptions}
                characterSearchValue={characterSearch[activeTab as CharacterFilterTabKey]}
                selectedElement={characterAssistFilters[activeTab as CharacterFilterTabKey].element}
                characterSearchPlaceholder={characterSearchPlaceholder}
                emptyCharacterResultLabel={emptyCharacterResultLabel}
                onCharacterSearchChange={(value) =>
                  setCharacterSearch((current) => ({
                    ...current,
                    [activeTab]: value,
                  }))
                }
                onToggleElementFilter={(element) =>
                  setCharacterAssistFilters((current) => ({
                    ...current,
                    [activeTab]: {
                      ...current[activeTab as CharacterFilterTabKey],
                      element: current[activeTab as CharacterFilterTabKey].element === element ? null : element,
                    },
                  }))
                }
                onToggleCharacter={(characterId) => toggleGroupValue(activeTab, characterId)}
              />
            )}
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-[1fr_minmax(220px,360px)_1fr] items-center gap-3 border-t border-white/10 px-5 py-4 md:px-6">
          <button
            type="button"
            className="justify-self-start text-[13px] font-medium text-white/54 underline decoration-white/20 underline-offset-4"
            onClick={resetDraft}
          >
            {resetLabel}
          </button>
          <button
            type="button"
            className="w-full rounded-full border border-white bg-white px-6 py-2.5 text-[13px] font-semibold text-[#5f6373] transition-colors hover:bg-white/90 hover:text-[#4d5160]"
            onClick={() => {
              onApply(cloneHomeFilterState(draftFilters));
              onClose();
            }}
          >
            {applyLabel}
          </button>
          <div aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

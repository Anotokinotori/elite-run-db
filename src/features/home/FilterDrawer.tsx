import { useEffect, useId, useMemo, useState } from "react";

import { characterDb, type Character, type Element } from "../../data/mockRuns";
import { CharacterImage } from "./CharacterImage";
import { SearchIcon } from "./homeIcons";
import { cloneHomeFilterState, createEmptyHomeFilterState, updateSelectionGroup } from "./homeLogic";
import type { CharacterAssistFilters, CharacterFilterTabKey, FilterTabKey, HomeFilterState, SelectionGroupState, SelectionTarget, TagGroup } from "./types";

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
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: HomeFilterState) => void;
  initialFilters: HomeFilterState;
  characters: Character[];
  tagGroups: TagGroup[];
  title: string;
  resetLabel: string;
  applyLabel: string;
  filterTabs: Array<{ key: FilterTabKey; label: string }>;
  filterTargetOptions: Array<{ key: SelectionTarget; label: string }>;
  elementFilterOptions: Array<{ key: Element; label: string }>;
  characterSearchPlaceholder: string;
  tagSearchPlaceholder: string;
  emptyCharacterResultLabel: string;
  emptyTagResultLabel: string;
}) {
  const [draftFilters, setDraftFilters] = useState<HomeFilterState>(() => createEmptyHomeFilterState());
  const [activeTab, setActiveTab] = useState<FilterTabKey>("partyCharacters");
  const [selectionTargets, setSelectionTargets] = useState<Record<FilterTabKey, SelectionTarget>>({
    partyCharacters: "include",
    mainAttackers: "include",
    tags: "include",
  });
  const [characterSearch, setCharacterSearch] = useState<Record<CharacterFilterTabKey, string>>({
    partyCharacters: "",
    mainAttackers: "",
  });
  const [tagSearch, setTagSearch] = useState("");
  const [characterAssistFilters, setCharacterAssistFilters] = useState<Record<CharacterFilterTabKey, CharacterAssistFilters>>({
    partyCharacters: { element: null },
    mainAttackers: { element: null },
  });
  const sortedCharacters = useMemo(() => [...characters].sort((left, right) => left.name.localeCompare(right.name)), [characters]);
  const includeModeSwitchId = useId();

  const resetLocalUi = () => {
    setActiveTab("partyCharacters");
    setSelectionTargets({
      partyCharacters: "include",
      mainAttackers: "include",
      tags: "include",
    });
    setCharacterSearch({
      partyCharacters: "",
      mainAttackers: "",
    });
    setTagSearch("");
    setCharacterAssistFilters({
      partyCharacters: { element: null },
      mainAttackers: { element: null },
    });
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
      const matchesQuery = query.length === 0 || character.name.toLowerCase().includes(query);
      const matchesElement = !assistFilters.element || character.element === assistFilters.element;

      return matchesQuery && matchesElement;
    });
  };

  const visibleTagGroups = tagGroups
    .map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => tagSearch.trim().length === 0 || tag.toLowerCase().includes(tagSearch.trim().toLowerCase())),
    }))
    .filter((group) => group.tags.length > 0);

  const filterButtonTone = (active: boolean, activeClass: string) =>
    active ? activeClass : "border-white/12 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white";
  const isAndMode = draftFilters[activeTab].includeMode === "and";

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
                        selectionTargets[activeTab] === option.key
                          ? "bg-white text-[#1f1f20]"
                          : "bg-transparent text-white/68 hover:bg-white/8 hover:text-white"
                      }`}
                      onClick={() => setSelectionTargets((current) => ({ ...current, [activeTab]: option.key }))}
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
              <>
                <section className="space-y-2 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">讀懃ｴ｢</div>
                  <label className="relative block">
                    <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/36" />
                    <input
                      type="text"
                      value={tagSearch}
                      onChange={(event) => setTagSearch(event.target.value)}
                      placeholder={tagSearchPlaceholder}
                      className="h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[14px] text-white placeholder:text-white/28 outline-none transition-colors focus:border-white/24"
                    />
                  </label>
                </section>

                <section className="space-y-4">
                  {visibleTagGroups.length > 0 ? (
                    visibleTagGroups.map((group) => (
                      <div key={group.key} className="space-y-2">
                        <div className="text-[12px] font-medium text-white/42">{group.label}</div>
                        <div className="flex flex-wrap gap-2">
                          {group.tags.map((tag) => {
                            const isInclude = draftFilters.tags.includeIds.includes(tag);
                            const isExclude = draftFilters.tags.excludeIds.includes(tag);

                            return (
                              <button
                                key={`${group.key}-${tag}`}
                                type="button"
                                className={`inline-flex min-h-9 items-center rounded-full border px-3 py-2 text-[12px] font-medium transition-colors ${
                                  isExclude
                                    ? "border-[#8d575d] bg-[#43292d] text-white"
                                    : isInclude
                                      ? "border-transparent bg-white text-[#151515]"
                                      : "border-white/12 bg-white/[0.04] text-white/72 hover:bg-white/10 hover:text-white"
                                }`}
                                onClick={() => toggleGroupValue("tags", tag)}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[16px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-[13px] text-white/42">
                      {emptyTagResultLabel}
                    </div>
                  )}
                </section>
              </>
            ) : (
              <>
                <section className="space-y-2 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">讀懃ｴ｢</div>
                  <label className="relative block">
                    <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/36" />
                    <input
                      type="text"
                      value={characterSearch[activeTab]}
                      onChange={(event) => setCharacterSearch((current) => ({ ...current, [activeTab]: event.target.value }))}
                      placeholder={characterSearchPlaceholder}
                      className="h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[14px] text-white placeholder:text-white/28 outline-none transition-colors focus:border-white/24"
                    />
                  </label>
                </section>

                <section className="space-y-3 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">邨櫁ｾｼ陬懷勧</div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {elementFilterOptions.map((option) => (
                        <button
                          key={`${activeTab}-element-${option.key}`}
                          type="button"
                          className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${filterButtonTone(
                            characterAssistFilters[activeTab].element === option.key,
                            "border-transparent bg-white text-[#151515]",
                          )}`}
                          onClick={() =>
                            setCharacterAssistFilters((current) => ({
                              ...current,
                              [activeTab]: {
                                ...current[activeTab],
                                element: current[activeTab].element === option.key ? null : option.key,
                              },
                            }))
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-3 [&>div:first-child]:hidden">
                  <div className="text-[12px] font-medium text-white/48">繧ｭ繝｣繝ｩ荳隕ｧ</div>
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {getVisibleCharacters(activeTab).map((character) => {
                      const isInclude = draftFilters[activeTab].includeIds.includes(character.id);
                      const isExclude = draftFilters[activeTab].excludeIds.includes(character.id);

                      return (
                        <button
                          key={`${activeTab}-${character.id}`}
                          type="button"
                          className={`relative rounded-[16px] border p-2 text-center transition-all ${
                            isExclude
                              ? "border-[#8d575d] bg-[#43292d]/70"
                              : isInclude
                                ? "border-cyan-300 bg-cyan-400/12"
                                : "border-white/10 bg-white/[0.04] hover:border-white/20"
                          }`}
                          onClick={() => toggleGroupValue(activeTab, character.id)}
                        >
                          {isInclude || isExclude ? (
                            <div
                              className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                                isExclude ? "bg-[#b96b74] text-white" : "bg-cyan-300 text-[#141414]"
                              }`}
                            >
                              {isExclude ? "-" : "+"}
                            </div>
                          ) : null}
                          <div className="flex flex-col items-center">
                            <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-14 w-14 rounded-full object-cover" />
                            <div className="mt-2 truncate text-[11px] font-medium text-white/76">{character.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {getVisibleCharacters(activeTab).length === 0 ? (
                    <div className="rounded-[16px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-[13px] text-white/42">
                      {emptyCharacterResultLabel}
                    </div>
                  ) : null}
                </section>
              </>
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




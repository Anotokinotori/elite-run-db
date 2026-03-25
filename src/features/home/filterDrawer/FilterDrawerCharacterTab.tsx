import type { Element } from "../../../data/mockRuns";
import { CharacterImage } from "../CharacterImage";
import { SearchIcon } from "../homeIcons";
import type { CharacterFilterTabKey, ElementFilterOption, HomeFilterState } from "../types";

const SEARCH_LABEL = "検索";
const ELEMENT_FILTER_LABEL = "元素絞り込み";
const CHARACTER_LIST_LABEL = "キャラクター一覧";

function filterButtonTone(active: boolean, activeClass: string) {
  return active ? activeClass : "border-white/12 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white";
}

type FilterDrawerCharacterTabProps = {
  activeTab: CharacterFilterTabKey;
  draftFilters: HomeFilterState;
  visibleCharacters: Array<{ id: string; name: string }>;
  elementFilterOptions: ElementFilterOption[];
  characterSearchValue: string;
  selectedElement: Element | null;
  characterSearchPlaceholder: string;
  emptyCharacterResultLabel: string;
  onCharacterSearchChange: (value: string) => void;
  onToggleElementFilter: (element: Element) => void;
  onToggleCharacter: (characterId: string) => void;
};

export function FilterDrawerCharacterTab({
  activeTab,
  draftFilters,
  visibleCharacters,
  elementFilterOptions,
  characterSearchValue,
  selectedElement,
  characterSearchPlaceholder,
  emptyCharacterResultLabel,
  onCharacterSearchChange,
  onToggleElementFilter,
  onToggleCharacter,
}: FilterDrawerCharacterTabProps) {
  return (
    <>
      <section className="space-y-2 [&>div:first-child]:hidden">
        <div className="text-[12px] font-medium text-white/48">{SEARCH_LABEL}</div>
        <label className="relative block">
          <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/36" />
          <input
            type="text"
            value={characterSearchValue}
            onChange={(event) => onCharacterSearchChange(event.target.value)}
            placeholder={characterSearchPlaceholder}
            className="h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[14px] text-white placeholder:text-white/28 outline-none transition-colors focus:border-white/24"
          />
        </label>
      </section>

      <section className="space-y-3 [&>div:first-child]:hidden">
        <div className="text-[12px] font-medium text-white/48">{ELEMENT_FILTER_LABEL}</div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {elementFilterOptions.map((option) => (
              <button
                key={`${activeTab}-element-${option.key}`}
                type="button"
                className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${filterButtonTone(
                  selectedElement === option.key,
                  "border-transparent bg-white text-[#151515]",
                )}`}
                onClick={() => onToggleElementFilter(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3 [&>div:first-child]:hidden">
        <div className="text-[12px] font-medium text-white/48">{CHARACTER_LIST_LABEL}</div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {visibleCharacters.map((character) => {
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
                onClick={() => onToggleCharacter(character.id)}
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
        {visibleCharacters.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-[13px] text-white/42">
            {emptyCharacterResultLabel}
          </div>
        ) : null}
      </section>
    </>
  );
}

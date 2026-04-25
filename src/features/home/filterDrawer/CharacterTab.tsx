import type { Element } from "../../../data/mockRuns";
import { CharacterImage } from "../ui/CharacterImage";
import { SearchIcon } from "../ui/icons";
import type { CharacterFilterTabKey, ElementFilterOption, HomeFilterState } from "../types";

const SEARCH_LABEL = "検索";
const ELEMENT_FILTER_LABEL = "元素絞り込み";
const CHARACTER_LIST_LABEL = "キャラクター一覧";

function filterButtonTone(active: boolean, activeClass: string) {
  return active ? activeClass : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]";
}

type CharacterTabProps = {
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

export function CharacterTab({
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
}: CharacterTabProps) {
  return (
    <>
      <section className="space-y-2 [&>div:first-child]:hidden">
        <div className="text-[12px] font-medium text-[#8d93a3]">{SEARCH_LABEL}</div>
        <label className="relative block">
          <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d93a3]" />
          <input
            type="text"
            value={characterSearchValue}
            onChange={(event) => onCharacterSearchChange(event.target.value)}
            placeholder={characterSearchPlaceholder}
            className="h-11 w-full rounded-[14px] border border-[#d8dde6] bg-[#f7f8fa] pl-11 pr-4 text-[14px] text-[#333333] placeholder:text-[#8d93a3] outline-none transition-colors focus:border-[#9aa7ba] focus:bg-white"
          />
        </label>
      </section>

      <section className="space-y-3 [&>div:first-child]:hidden">
        <div className="text-[12px] font-medium text-[#8d93a3]">{ELEMENT_FILTER_LABEL}</div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {elementFilterOptions.map((option) => (
              <button
                key={`${activeTab}-element-${option.key}`}
                type="button"
                className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${filterButtonTone(
                  selectedElement === option.key,
                  "border-transparent bg-[#111827] text-white",
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
        <div className="text-[12px] font-medium text-[#8d93a3]">{CHARACTER_LIST_LABEL}</div>
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
                    ? "border-[#efc9b0] bg-[#fff7f2]"
                    : isInclude
                      ? "border-[#8fc7d8] bg-[#eef9fc]"
                      : "border-[#e5e7eb] bg-[#f7f8fa] hover:border-[#c8ced8] hover:bg-white"
                }`}
                onClick={() => onToggleCharacter(character.id)}
              >
                {isInclude || isExclude ? (
                  <div
                    className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                      isExclude ? "bg-[#c27642] text-white" : "bg-[#6bbbd0] text-white"
                    }`}
                  >
                    {isExclude ? "-" : "+"}
                  </div>
                ) : null}
                <div className="flex flex-col items-center">
                  <CharacterImage characterId={character.id} variant="circle" alt={character.name} className="h-14 w-14 rounded-full object-cover" />
                  <div className="mt-2 truncate text-[11px] font-medium text-[#5f6678]">{character.name}</div>
                </div>
              </button>
            );
          })}
        </div>
        {visibleCharacters.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#d8dde6] bg-[#f7f8fa] px-4 py-8 text-center text-[13px] text-[#8d93a3]">
            {emptyCharacterResultLabel}
          </div>
        ) : null}
      </section>
    </>
  );
}

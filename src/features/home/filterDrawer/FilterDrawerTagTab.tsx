import { SearchIcon } from "../homeIcons";
import type { HomeFilterState, TagGroup } from "../types";

const SEARCH_LABEL = "検索";

type FilterDrawerTagTabProps = {
  draftFilters: HomeFilterState;
  tagSearch: string;
  visibleTagGroups: TagGroup[];
  tagSearchPlaceholder: string;
  emptyTagResultLabel: string;
  onTagSearchChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
};

export function FilterDrawerTagTab({
  draftFilters,
  tagSearch,
  visibleTagGroups,
  tagSearchPlaceholder,
  emptyTagResultLabel,
  onTagSearchChange,
  onToggleTag,
}: FilterDrawerTagTabProps) {
  return (
    <>
      <section className="space-y-2 [&>div:first-child]:hidden">
        <div className="text-[12px] font-medium text-white/48">{SEARCH_LABEL}</div>
        <label className="relative block">
          <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/36" />
          <input
            type="text"
            value={tagSearch}
            onChange={(event) => onTagSearchChange(event.target.value)}
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
                      onClick={() => onToggleTag(tag)}
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
  );
}

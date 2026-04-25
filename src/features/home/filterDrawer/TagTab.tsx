import { SearchIcon } from "../ui/icons";
import type { HomeFilterState, TagGroup } from "../types";

const SEARCH_LABEL = "検索";

type TagTabProps = {
  draftFilters: HomeFilterState;
  tagSearch: string;
  visibleTagGroups: TagGroup[];
  tagSearchPlaceholder: string;
  emptyTagResultLabel: string;
  onTagSearchChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
};

export function TagTab({
  draftFilters,
  tagSearch,
  visibleTagGroups,
  tagSearchPlaceholder,
  emptyTagResultLabel,
  onTagSearchChange,
  onToggleTag,
}: TagTabProps) {
  return (
    <>
      <section className="space-y-2 [&>div:first-child]:hidden">
        <div className="text-[12px] font-medium text-[#8d93a3]">{SEARCH_LABEL}</div>
        <label className="relative block">
          <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d93a3]" />
          <input
            type="text"
            value={tagSearch}
            onChange={(event) => onTagSearchChange(event.target.value)}
            placeholder={tagSearchPlaceholder}
            className="h-11 w-full rounded-[14px] border border-[#d8dde6] bg-[#f7f8fa] pl-11 pr-4 text-[14px] text-[#333333] placeholder:text-[#8d93a3] outline-none transition-colors focus:border-[#9aa7ba] focus:bg-white"
          />
        </label>
      </section>

      <section className="space-y-4">
        {visibleTagGroups.length > 0 ? (
          visibleTagGroups.map((group) => (
            <div key={group.key} className="space-y-2">
              <div className="text-[12px] font-medium text-[#8d93a3]">{group.label}</div>
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
                          ? "border-[#efc9b0] bg-[#fff7f2] text-[#b6611e]"
                          : isInclude
                            ? "border-transparent bg-[#111827] text-white"
                            : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]"
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
          <div className="rounded-[16px] border border-dashed border-[#d8dde6] bg-[#f7f8fa] px-4 py-8 text-center text-[13px] text-[#8d93a3]">
            {emptyTagResultLabel}
          </div>
        )}
      </section>
    </>
  );
}

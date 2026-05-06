import { SearchIcon } from "../../home/ui/icons";

type LibraryHeroProps = {
  imageUrl: string;
  backgroundColor: string;
  ariaLabel: string;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onKeywordCommit: () => void;
};

export function LibraryHero({ imageUrl, backgroundColor, ariaLabel, keyword, onKeywordChange, onKeywordCommit }: LibraryHeroProps) {
  return (
    <section
      className="relative h-[320px] w-full overflow-hidden bg-cover bg-center md:h-[560px]"
      style={{ backgroundColor, backgroundImage: `url(${imageUrl})` }}
      aria-label={ariaLabel}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_52%,rgba(242,243,245,0.46)_78%,#f2f3f5_100%)]" />
      <div className="absolute left-1/2 top-4 w-[90%] max-w-4xl -translate-x-1/2 rounded-full border border-white/30 bg-black/15 px-4 py-2 backdrop-blur-sm">
        <label className="flex h-9 items-center gap-3 text-white md:h-10">
          <SearchIcon size={18} className="shrink-0 text-white/80" />
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                onKeywordCommit();
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-white outline-none placeholder:text-white/65 md:text-[14px]"
            placeholder="記録名・投稿者・タグ・キャラ名で検索"
          />
        </label>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#f2f3f5]" />
    </section>
  );
}

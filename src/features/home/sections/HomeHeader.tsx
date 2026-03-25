type HomeHeaderProps = {
  embedded: boolean;
  appTitle: string;
  submitLabel: string;
  seasons: readonly string[];
  activeSeason: string;
  onSeasonChange: (season: string) => void;
  onRequestSubmit: () => void;
};

export function HomeHeader({
  embedded,
  appTitle,
  submitLabel,
  seasons,
  activeSeason,
  onSeasonChange,
  onRequestSubmit,
}: HomeHeaderProps) {
  if (embedded) {
    return null;
  }

  return (
    <nav className="bg-white sticky top-0 z-40 border-b border-[#ebebeb]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-2 md:py-3 flex items-center justify-between header-font">
        <div className="flex items-center gap-4 md:gap-6">
          <h1 className="text-[26px] md:text-[38px] font-semibold tracking-tight text-black">{appTitle}</h1>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-black/30 rounded-full pl-3 md:pl-4 pr-12 md:pr-14 py-1.5 text-[16px] md:text-[20px] font-medium text-black"
              value={activeSeason}
              onChange={(event) => onSeasonChange(event.target.value)}
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-black/70">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              onRequestSubmit();
            }}
            className="bg-black text-white rounded-full text-[16px] md:text-[20px] font-medium flex items-center justify-center md:justify-start gap-0 md:gap-2 w-9 h-9 md:w-auto md:h-auto px-0 md:px-5 py-0 md:py-2.5"
          >
            <span className="md:hidden flex items-center justify-center w-full h-full text-[20px] leading-none">+</span>
            <span className="hidden md:inline text-[22px] leading-none">+</span>
            <span className="hidden md:inline">{submitLabel}</span>
          </button>
          <div className="w-9 h-9 rounded-full border border-black/30 bg-white" aria-label="User avatar" />
        </div>
      </div>
    </nav>
  );
}

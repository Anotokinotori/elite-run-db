import { Button, SelectControl } from "../../../components/ui";

type HeaderProps = {
  embedded: boolean;
  appTitle: string;
  submitLabel: string;
  seasons: readonly string[];
  activeSeason: string;
  onSeasonChange: (season: string) => void;
  onRequestSubmit: () => void;
};

export function Header({
  embedded,
  appTitle,
  submitLabel,
  seasons,
  activeSeason,
  onSeasonChange,
  onRequestSubmit,
}: HeaderProps) {
  if (embedded) {
    return null;
  }

  return (
    <nav className="bg-white sticky top-0 z-40 border-b border-[#ebebeb]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-2 md:py-3 flex items-center justify-between header-font">
        <div className="flex items-center gap-4 md:gap-6">
          <h1 className="text-[26px] md:text-[38px] font-semibold tracking-tight text-black">{appTitle}</h1>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Version</span>
            <SelectControl
              className="border-black/30 text-black md:text-[20px]"
              value={activeSeason}
              onChange={(event) => onSeasonChange(event.target.value)}
              aria-label="Version"
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </SelectControl>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              onRequestSubmit();
            }}
            size="lg"
            className="h-9 w-9 gap-0 px-0 py-0 md:h-auto md:w-auto md:gap-2 md:px-5 md:py-2.5 md:text-[20px]"
          >
            <span className="md:hidden flex items-center justify-center w-full h-full text-[20px] leading-none">+</span>
            <span className="hidden md:inline text-[22px] leading-none">+</span>
            <span className="hidden md:inline">{submitLabel}</span>
          </Button>
          <div className="w-9 h-9 rounded-full border border-black/30 bg-white" aria-label="User avatar" />
        </div>
      </div>
    </nav>
  );
}

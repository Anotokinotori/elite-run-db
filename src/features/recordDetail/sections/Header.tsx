import { BackButton, Button, SelectControl } from "../../../components/ui";
import { CircleAvatar } from "../ui";

export function Header({
  embedded,
  forceMobileLayout,
  onBack,
  onRequestSubmit,
  headerVersion,
  versionOptions,
  onHeaderVersionChange,
}: {
  embedded: boolean;
  forceMobileLayout: boolean;
  onBack?: () => void;
  onRequestSubmit?: () => void;
  headerVersion: string;
  versionOptions: string[];
  onHeaderVersionChange: (value: string) => void;
}) {
  return (
    <>
      {embedded ? (
        <div className="border-b border-[#e5e7eb] bg-white">
          <div className={`header-font mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 py-2 ${forceMobileLayout ? "" : "md:px-6"}`}>
            {onBack ? <BackButton label="一覧へ戻る" onClick={onBack} className="shrink-0" /> : null}
            <div className="min-w-0 text-[16px] font-semibold tracking-tight text-[#111827] md:text-[18px]">記録詳細</div>
          </div>
        </div>
      ) : null}
      <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-[#e5e7eb] bg-white shadow-[0_1px_0_rgba(17,24,39,0.03)]"}>
        <div className={`header-font mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2 ${forceMobileLayout ? "min-h-[52px]" : "md:px-6 md:py-3"}`}>
          <div className={`flex items-center ${forceMobileLayout ? "gap-3" : "gap-4 md:gap-6"}`}>
            {onBack ? <BackButton label="一覧へ戻る" onClick={onBack} className="shrink-0" /> : null}
            <h1 className={`font-semibold tracking-tight text-[#111827] ${forceMobileLayout ? "text-[24px]" : "text-[26px] md:text-[38px]"}`}>精鋭狩りDB</h1>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#7b8493]">
              <span className={forceMobileLayout ? "sr-only" : "hidden md:inline"}>Version</span>
              <SelectControl
                className={forceMobileLayout ? "h-9 min-w-[96px] py-1.5 pl-3 pr-9 text-[15px]" : "h-10 min-w-[112px] bg-[#f7f8fa] py-1.5 pl-4 pr-10 text-[16px] md:h-11 md:min-w-[128px] md:text-[20px]"}
                value={headerVersion}
                onChange={(event) => onHeaderVersionChange(event.target.value)}
                aria-label="Version"
              >
                {versionOptions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </SelectControl>
            </label>
          </div>

          <div className={`flex items-center ${forceMobileLayout ? "gap-2" : "gap-3 md:gap-4"}`}>
            <Button
              onClick={onRequestSubmit}
              size={forceMobileLayout ? "sm" : "lg"}
              className={forceMobileLayout ? "h-9 w-9 px-0" : "md:text-[20px]"}
            >
              <span className="text-[20px] leading-none md:text-[22px]">＋</span>
              <span className={forceMobileLayout ? "hidden" : "hidden md:inline"}>記録申請</span>
            </Button>
            <CircleAvatar label="luna3" size={36} bordered />
          </div>
        </div>
      </nav>
    </>
  );
}

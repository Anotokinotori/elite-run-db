import { DETAIL_ICON_BUTTON_CLASS } from "../config";
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
        <div className="border-b border-white/10 bg-[#212121]">
          <div className={`header-font mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 py-2 ${forceMobileLayout ? "" : "md:px-6"}`}>
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="一覧へ戻る"
                className={`${DETAIL_ICON_BUTTON_CLASS} shrink-0`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5L8 12L15 19" />
                </svg>
              </button>
            ) : null}
            <div className="min-w-0 text-[16px] font-semibold tracking-tight text-white/92 md:text-[18px]">記録詳細</div>
          </div>
        </div>
      ) : null}
      <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-white/10 bg-[#212121] shadow-[0_1px_0_rgba(255,255,255,0.04)]"}>
        <div className={`header-font mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2 ${forceMobileLayout ? "min-h-[52px]" : "md:px-6 md:py-3"}`}>
          <div className={`flex items-center ${forceMobileLayout ? "gap-3" : "gap-4 md:gap-6"}`}>
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="一覧へ戻る"
                className={`${DETAIL_ICON_BUTTON_CLASS} shrink-0`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5L8 12L15 19" />
                </svg>
              </button>
            ) : null}
            <h1 className={`font-semibold tracking-tight text-white ${forceMobileLayout ? "text-[24px]" : "text-[26px] md:text-[38px]"}`}>精鋭狩りDB</h1>
            <div className="relative">
              <select
                className={`appearance-none rounded-full border border-white/10 bg-[#272727] py-1.5 pl-3 pr-10 font-medium text-[#d9d9d9] ${forceMobileLayout ? "text-[15px]" : "text-[16px] md:pl-4 md:pr-12 md:text-[20px]"}`}
                value={headerVersion}
                onChange={(event) => onHeaderVersionChange(event.target.value)}
              >
                {versionOptions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className={`flex items-center ${forceMobileLayout ? "gap-2" : "gap-3 md:gap-4"}`}>
            <button
              type="button"
              onClick={onRequestSubmit}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#272727] text-white ${forceMobileLayout ? "" : "md:h-auto md:w-auto md:gap-2 md:px-5 md:py-2.5 md:text-[20px]"}`}
            >
              <span className="text-[20px] leading-none md:text-[22px]">＋</span>
              <span className={forceMobileLayout ? "hidden" : "hidden md:inline"}>記録提出</span>
            </button>
            <CircleAvatar label="luna3" size={36} bordered />
          </div>
        </div>
      </nav>
    </>
  );
}

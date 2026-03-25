export function SubmitHeader({ embedded, onBack }: { embedded: boolean; onBack: () => void }) {
  return (
    <>
        {embedded ? (
          <div className="border-b border-[#ebebeb] bg-white">
            <div className="header-font mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 py-2 md:px-6">
              <button
                type="button"
                onClick={onBack}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f2f2f2] text-black"
                aria-label="記録一覧へ戻る"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5" />
                  <path d="M11 6L5 12L11 18" />
                </svg>
              </button>
              <div className="text-[16px] font-semibold tracking-tight text-black md:text-[18px]">記録申請</div>
            </div>
          </div>
        ) : null}
        <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-[#ebebeb] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"}>
          <div className="header-font mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f2f2] text-black"
                aria-label="記録詳細へ戻る"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5" />
                  <path d="M11 6L5 12L11 18" />
                </svg>
              </button>
              <div>
                <div className="text-[24px] font-semibold tracking-tight text-black md:text-[34px]">記録提出</div>
              </div>
            </div>
          </div>
        </nav>
    </>
  );
}

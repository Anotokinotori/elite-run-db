import { BackButton } from "../../../components/ui";

export function Header({ embedded, onBack }: { embedded: boolean; onBack: () => void }) {
  return (
    <>
        {embedded ? (
          <div className="border-b border-[#ebebeb] bg-white">
            <div className="header-font mx-auto flex min-h-[42px] max-w-[1280px] items-center gap-2.5 px-3 py-1.5 md:px-5">
              <BackButton label="記録一覧へ戻る" onClick={onBack} icon="arrow" />
              <div className="text-[13px] font-semibold tracking-tight text-black md:text-[14px]">記録申請</div>
            </div>
          </div>
        ) : null}
        <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-[#ebebeb] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"}>
          <div className="header-font mx-auto flex max-w-[1280px] items-center justify-between gap-2.5 px-3 py-2 md:px-5">
            <div className="flex items-center gap-2.5">
              <BackButton label="記録詳細へ戻る" onClick={onBack} icon="arrow" className="h-8 w-8" />
              <div>
                <div className="text-[19px] font-semibold tracking-tight text-black md:text-[27px]">記録申請</div>
              </div>
            </div>
          </div>
        </nav>
    </>
  );
}

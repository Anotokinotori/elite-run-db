import { BackButton } from "../../../components/ui";

export function Header({ embedded, onBack }: { embedded: boolean; onBack: () => void }) {
  return (
    <>
        {embedded ? (
          <div className="border-b border-[#ebebeb] bg-white">
            <div className="header-font mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 py-2 md:px-6">
              <BackButton label="記録一覧へ戻る" onClick={onBack} icon="arrow" />
              <div className="text-[16px] font-semibold tracking-tight text-black md:text-[18px]">記録申請</div>
            </div>
          </div>
        ) : null}
        <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-[#ebebeb] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"}>
          <div className="header-font mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <BackButton label="記録詳細へ戻る" onClick={onBack} icon="arrow" className="h-10 w-10" />
              <div>
                <div className="text-[24px] font-semibold tracking-tight text-black md:text-[34px]">記録申請</div>
              </div>
            </div>
          </div>
        </nav>
    </>
  );
}

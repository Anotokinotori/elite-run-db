
import type { ReactNode } from 'react';

export function LibraryModalFrame({
  title,
  children,
  onClose,
  onReset,
  onApply,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-[80px] z-[73] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-128px)] w-full max-w-[1040px] flex-col overflow-hidden rounded-[24px] border border-[#ebebeb] bg-white text-[#333333] shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#ebebeb] px-5 pb-5 pt-6 md:px-6">
          <div className="min-w-0">
            <div className="inline-flex h-[22px] items-center border border-[#d8dde6] px-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#8d93a3]">FILTER</div>
            <h3 className="mt-3 text-[24px] font-bold leading-tight text-[#111827] md:text-[30px]">{title}</h3>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2f2f2] text-black transition hover:bg-[#e6e8ec]"
            onClick={onClose}
            aria-label="閉じる"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">{children}</div>
        <footer className="grid shrink-0 grid-cols-[1fr_minmax(190px,340px)_1fr] items-center gap-3 border-t border-[#e5e7eb] px-5 py-4 md:px-6">
          <button type="button" className="justify-self-start text-[13px] font-medium text-[#5f6678] underline decoration-[#c8ced8] underline-offset-4 hover:text-[#333333]" onClick={onReset}>
            リセット
          </button>
          <button type="button" className="w-full rounded-full border border-[#111827] bg-[#111827] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#263142]" onClick={onApply}>
            適用する
          </button>
          <div aria-hidden="true" />
        </footer>
      </div>
    </div>
  );
}

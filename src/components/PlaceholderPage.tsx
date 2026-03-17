import { type ReactNode } from "react";

export function PlaceholderPage({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description: string;
  eyebrow: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-full bg-[#f0f2f5] text-[#333333]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <section className="rounded-[20px] border border-black/8 bg-white px-6 py-7 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
          <div className="text-[12px] font-bold tracking-[0.18em] text-[#9999b1] uppercase">{eyebrow}</div>
          <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-black md:text-[40px]">{title}</h2>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.8] text-[#5e6173] md:text-[16px]">{description}</p>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <section className="rounded-[20px] border border-black/8 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <div className="text-[18px] font-semibold text-black">準備中のUI</div>
            <div className="mt-3 text-[14px] leading-[1.9] text-[#666a7c]">
              このページは共通ナビ導線の接続を優先して先に配置しています。実データ接続や投稿永続化は後続 issue で差し替えやすい形に留めています。
            </div>
            {children ? <div className="mt-6">{children}</div> : null}
          </section>

          <aside className="rounded-[20px] border border-black/8 bg-[#fbfbfc] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] font-semibold text-black">この段階で置くもの</div>
            <div className="mt-4 space-y-3 text-[14px] leading-[1.8] text-[#666a7c]">
              <div className="rounded-[14px] border border-[#ececf4] bg-white px-4 py-3">共通導線から到達できること</div>
              <div className="rounded-[14px] border border-[#ececf4] bg-white px-4 py-3">ページの役割が見えること</div>
              <div className="rounded-[14px] border border-[#ececf4] bg-white px-4 py-3">将来の静的データ差し替えに耐えること</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

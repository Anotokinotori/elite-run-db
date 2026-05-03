import { ChevronRightIcon, CrownIcon } from "./UiIcons";
import { PlaceholderPage } from "./PlaceholderPage";

type RecordLibraryPageProps = {
  onOpenRankings: () => void;
};

export function RecordLibraryPage({ onOpenRankings }: RecordLibraryPageProps) {
  return (
    <div className="min-h-full">
      <PlaceholderPage
        label="Record Library"
        title="記録図書館"
        description="詳細な絞り込み機能や検索アルゴリズムで、自分の環境に近かったり参考になる記録を探すためのページです。記録を探すことに特化した入口として、後続で検索体験を作り込んでいきます。"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">環境に近い記録の探索</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">詳細条件での絞り込み</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">参考記録の発見アルゴリズム</div>
        </div>
      </PlaceholderPage>
      <RankingsFloatingCta onOpen={onOpenRankings} />
    </div>
  );
}

function RankingsFloatingCta({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="全ランキングを見る"
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 border border-white/25 bg-[#111116] px-3.5 py-3 text-left text-[#d9d9d9] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
    >
      <CrownIcon className="h-[17px] w-[17px] shrink-0 text-white/70" />
      <span className="cta-shine-text whitespace-nowrap text-[14px] font-black leading-none sm:text-[15px]">全ランキングを見る</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-white/70" />
    </button>
  );
}

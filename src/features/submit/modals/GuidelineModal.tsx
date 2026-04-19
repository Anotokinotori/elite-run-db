import { SectionTitle } from "../ui";

export function GuidelineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className="w-full max-w-[720px] rounded-[24px] border border-[#ebebeb] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.16)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionTitle
          title="ガイドライン"
          description="内容は仮置きですが、導線と同意チェックの位置はこのまま実装しています。"
          action={
            <button type="button" onClick={onClose} className="rounded-full bg-[#f2f2f2] px-4 py-2 text-[13px] font-medium text-black">
              閉じる
            </button>
          }
        />

        <div className="mt-6 space-y-4 text-[14px] leading-[1.8] text-[#49495b]">
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            1. 動画 URL は公開 YouTube リンクを想定しています。限定公開や削除済みリンクは比較ビュー・詳細画面で再生できません。
          </div>
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            2. 編成・凸・武器・精錬は自己申告ベースです。UID からの取得は best effort なので、最終確認は提出者自身で行ってください。
          </div>
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            3. コメント、いいね、共有、実 submit 永続化はまだ仮実装です。提出後も下書きはブラウザに残ります。
          </div>
        </div>
      </div>
    </div>
  );
}

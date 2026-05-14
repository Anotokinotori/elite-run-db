import { ModalFrame } from "../../../components/ui";

export function GuidelineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalFrame
      onClose={onClose}
      title="ガイドライン"
      description="内容は仮置きですが、導線と同意チェックの位置はこのまま実装しています。"
      className="max-w-[720px]"
    >
        <div className="mt-6 space-y-4 overflow-y-auto text-[14px] leading-[1.8] text-[#49495b]">
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
    </ModalFrame>
  );
}

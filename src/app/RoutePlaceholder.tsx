import { PlaceholderPage } from "../components/PlaceholderPage";

import type { PlaceholderRouteName } from "./routes";

export function RoutePlaceholder({ routeName }: { routeName: PlaceholderRouteName }) {
  if (routeName === "chat") {
    return (
      <PlaceholderPage
        label="Hunting Chat"
        title="狩りチャット"
        description="精鋭狩りの軽い相談、質問、日々の試走メモをまとめて扱う入口です。雑談と質問を分けず、狩りに関する会話をひとつの場所へ集約します。"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">最近の会話、質問、募集を見つけやすい一覧領域</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">簡易投稿ボックスや pinned thread の置き場</div>
        </div>
      </PlaceholderPage>
    );
  }

  if (routeName === "exchange") {
    return (
      <PlaceholderPage
        label="Exchange"
        title="情報交換"
        description="ルート知見、キャラ運用、季節更新の差分などを静的でも蓄積できるハブです。コミュニティの付加価値を無理なくサイト内に残すための土台にします。"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">ルート共有</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">編成メモ</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">バージョン差分</div>
        </div>
      </PlaceholderPage>
    );
  }

  if (routeName === "event") {
    return (
      <PlaceholderPage
        label="Events"
        title="イベント情報"
        description="大会告知やシーズン切替、提出締切などの告知をまとめるページです。公開導線のひとつとして global nav から常に辿れる状態を先に作ります。"
      >
        <div className="space-y-3 text-[14px] leading-[1.8] text-[#5e6173]">
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">近日開催のイベントカード</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">提出ルールや更新履歴の告知枠</div>
        </div>
      </PlaceholderPage>
    );
  }

  if (routeName === "notifications") {
    return (
      <PlaceholderPage
        label="Notifications"
        title="通知"
        description="通知は header からアクセスする補助導線として置きます。閲覧系 route と混ぜず、今は unread 表現と受け皿だけを持たせます。"
      >
        <div className="space-y-3 text-[14px] leading-[1.8] text-[#5e6173]">
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">コメントや申請更新の通知一覧が入る領域</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">通知設定や既読処理は後続で追加予定</div>
        </div>
      </PlaceholderPage>
    );
  }

  return (
    <PlaceholderPage
      label="Account"
      title="アカウント"
      description="Google account first の設定導線を置くための placeholder です。ログイン、プロフィール、今後の通知設定などをここに集約します。"
    >
      <div className="space-y-3 text-[14px] leading-[1.8] text-[#5e6173]">
        <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">プロフィール表示と接続中アカウントの確認</div>
        <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">将来の設定メニューを追加しやすい構造</div>
      </div>
    </PlaceholderPage>
  );
}

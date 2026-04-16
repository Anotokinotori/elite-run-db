import { useEffect, useRef, useState } from "react";

import { AppShell } from "./components/AppShell";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { RecordDetailPage } from "./components/RecordDetailPage";
import { HomePage } from "./components/HomePage";
import { SubmitPage } from "./components/SubmitPage";
import { defaultRunId, getRunById, mockRuns } from "./data/mockRuns";

type AppRoute =
  | { name: "home" }
  | { name: "detail"; runId: string }
  | { name: "submit" }
  | { name: "chat" }
  | { name: "question" }
  | { name: "exchange" }
  | { name: "event" }
  | { name: "notifications" }
  | { name: "account" };

type ShellDestination = Exclude<AppRoute["name"], "detail">;

const DEFAULT_VERSION_OPTIONS = ["Luna3", "Luna2", "Luna1", "5.8", "5.7", "5.6", "5.5", "5.4", "5.3", "5.2", "5.1", "5.0"];
const APP_VERSION_OPTIONS = Array.from(new Set([...DEFAULT_VERSION_OPTIONS, ...mockRuns.map((run) => run.versionLabel)]));

function getRouteFromHash(): AppRoute {
  if (typeof window === "undefined") {
    return { name: "home" };
  }

  const normalizedHash = window.location.hash.replace(/^#/, "");

  if (normalizedHash === "submit") {
    return { name: "submit" };
  }

  if (normalizedHash === "detail") {
    return { name: "detail", runId: defaultRunId };
  }

  if (normalizedHash.startsWith("detail/")) {
    const runId = decodeURIComponent(normalizedHash.slice("detail/".length));
    return { name: "detail", runId: getRunById(runId) ? runId : defaultRunId };
  }

  if (normalizedHash === "chat") {
    return { name: "chat" };
  }

  if (normalizedHash === "question") {
    return { name: "question" };
  }

  if (normalizedHash === "exchange") {
    return { name: "exchange" };
  }

  if (normalizedHash === "event") {
    return { name: "event" };
  }

  if (normalizedHash === "notifications") {
    return { name: "notifications" };
  }

  if (normalizedHash === "account") {
    return { name: "account" };
  }

  return { name: "home" };
}

function getHashFromRoute(route: AppRoute) {
  if (route.name === "submit") {
    return "#submit";
  }

  if (route.name === "detail") {
    return `#detail/${encodeURIComponent(route.runId)}`;
  }

  if (route.name === "chat") {
    return "#chat";
  }

  if (route.name === "question") {
    return "#question";
  }

  if (route.name === "exchange") {
    return "#exchange";
  }

  if (route.name === "event") {
    return "#event";
  }

  if (route.name === "notifications") {
    return "#notifications";
  }

  if (route.name === "account") {
    return "#account";
  }

  return "#home";
}

function RoutePlaceholder({ routeName }: { routeName: Exclude<AppRoute["name"], "home" | "detail" | "submit"> }) {
  if (routeName === "chat") {
    return (
      <PlaceholderPage
        label="Chat"
        title="雑談"
        description="精鋭狩りの軽い相談、雑談、日々の試走メモを溜めるための入口です。後続 issue でスレッド一覧や投稿 UI を差し替えやすいよう、まずは route と受け皿だけを繋いでいます。"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">最近の話題や募集を見つけやすい一覧領域</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4 text-[14px] text-[#5e6173]">簡易投稿ボックスや pinned thread の置き場</div>
        </div>
      </PlaceholderPage>
    );
  }

  if (routeName === "question") {
    return (
      <PlaceholderPage
        label="Questions"
        title="質問"
        description="編成、ルート、装備、申請方法など、記録閲覧と地続きの質問を独立ページとして置きます。情報交換に埋もれないよう専用 route で扱います。"
      >
        <div className="space-y-3 text-[14px] leading-[1.8] text-[#5e6173]">
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">「この編成でどこを短縮できるか」などの Q&A 一覧</div>
          <div className="rounded-[16px] border border-[#ececf4] bg-[#f8f8fb] px-4 py-4">初心者向け導線と、答えが見つかりやすい固定カテゴリ</div>
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

export default function RootApp() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash());
  const [selectedVersion, setSelectedVersion] = useState(() => APP_VERSION_OPTIONS[0] ?? "Luna3");
  const [lastBrowseRoute, setLastBrowseRoute] = useState<AppRoute>(() => (route.name === "submit" ? { name: "home" } : route));
  const routeRef = useRef(route);
  const previousRouteRef = useRef<AppRoute | null>(null);
  const homeScrollRef = useRef(0);

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getRouteFromHash();

      if (routeRef.current.name === "home" && nextRoute.name !== "home") {
        homeScrollRef.current = window.scrollY;
      }

      setRoute(nextRoute);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    if (route.name !== "submit") {
      setLastBrowseRoute(route);
    }
  }, [route]);

  useEffect(() => {
    if (route.name === "detail") {
      const currentRun = getRunById(route.runId);
      if (currentRun?.versionLabel) {
        setSelectedVersion(currentRun.versionLabel);
      }
    }
  }, [route]);

  useEffect(() => {
    const previousRoute = previousRouteRef.current;
    previousRouteRef.current = route;

    const nextHash = getHashFromRoute(route);

    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }

    if (route.name === "home") {
      if (previousRoute && previousRoute.name !== "home") {
        const frameId = window.requestAnimationFrame(() => {
          window.scrollTo({ top: homeScrollRef.current, behavior: "auto" });
        });

        return () => window.cancelAnimationFrame(frameId);
      }

      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  const navigate = (nextRoute: AppRoute) => {
    if (routeRef.current.name === "home" && nextRoute.name !== "home") {
      homeScrollRef.current = window.scrollY;
    }

    setRoute(nextRoute);

    const nextHash = getHashFromRoute(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  };

  const navigateFromShell = (target: ShellDestination) => {
    if (target === "home") {
      navigate({ name: "home" });
      return;
    }

    if (target === "submit") {
      navigate({ name: "submit" });
      return;
    }

    if (target === "chat") {
      navigate({ name: "chat" });
      return;
    }

    if (target === "question") {
      navigate({ name: "question" });
      return;
    }

    if (target === "exchange") {
      navigate({ name: "exchange" });
      return;
    }

    if (target === "event") {
      navigate({ name: "event" });
      return;
    }

    if (target === "notifications") {
      navigate({ name: "notifications" });
      return;
    }

    navigate({ name: "account" });
  };

  const navigateHomeFromTitle = () => {
    homeScrollRef.current = 0;

    if (routeRef.current.name === "home") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    navigate({ name: "home" });
  };

  return (
    <AppShell
      routeName={route.name}
      version={selectedVersion}
      versionOptions={APP_VERSION_OPTIONS}
      hasUnreadNotifications={route.name !== "notifications"}
      onNavigate={navigateFromShell}
      onTitleClick={navigateHomeFromTitle}
      onRequestSubmit={() => navigate({ name: "submit" })}
      onVersionChange={setSelectedVersion}
    >
      <div style={{ display: route.name === "home" ? "block" : "none" }} aria-hidden={route.name !== "home"}>
        <HomePage
          embedded
          selectedSeason={selectedVersion}
          onSelectedSeasonChange={setSelectedVersion}
          onRequestSubmit={() => navigate({ name: "submit" })}
          onSelectRun={(runId) => navigate({ name: "detail", runId })}
        />
      </div>

      {route.name === "submit" ? (
        <SubmitPage
          embedded
          onBack={() => {
            navigate(lastBrowseRoute.name === "submit" ? { name: "home" } : lastBrowseRoute);
          }}
        />
      ) : null}

      {route.name === "detail" ? (

<RecordDetailPage
          embedded
          key={route.runId}
          runId={route.runId}
          onBack={() => navigate({ name: "home" })}
          onRequestSubmit={() => navigate({ name: "submit" })}
        />
      ) : null}

      {route.name !== "home" && route.name !== "submit" && route.name !== "detail" ? <RoutePlaceholder routeName={route.name} /> : null}
    </AppShell>
  );
}





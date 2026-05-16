import { useEffect, useRef, useState } from "react";

import { AppShell } from "./components/AppShell";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { RecordDetailPage } from "./components/RecordDetailPage";
import { HomePage } from "./components/HomePage";
import { SubmitPage } from "./components/SubmitPage";
import { defaultAppRunId, getAppRunById } from "./data/appRuns";
import { LibraryPage } from "./features/library/Page";
import { LpPage } from "./features/lp/Page";
import { HOME_SEASONS } from "./features/home/config";

type AppRoute =
  | { name: "lp" }
  | { name: "home" }
  | { name: "detail"; runId: string }
  | { name: "submit" }
  | { name: "chat" }
  | { name: "library" }
  | { name: "exchange" }
  | { name: "event" }
  | { name: "notifications" }
  | { name: "account" };

type ShellDestination = Exclude<AppRoute["name"], "detail" | "lp">;

function safeDecodeRouteValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getRouteFromRouteValue(rawValue: string): AppRoute | null {
  const routeValue = rawValue.replace(/^#/, "").replace(/^\/+/, "").replace(/\/+$/, "");
  const normalizedRouteValue = routeValue.toLowerCase();

  if (!normalizedRouteValue || normalizedRouteValue === "home" || normalizedRouteValue === "index.html") {
    return { name: "home" };
  }

  if (normalizedRouteValue === "lp") {
    return { name: "lp" };
  }

  if (normalizedRouteValue === "submit") {
    return { name: "submit" };
  }

  if (normalizedRouteValue === "detail") {
    return { name: "detail", runId: defaultAppRunId };
  }

  if (normalizedRouteValue.startsWith("detail/")) {
    const runId = safeDecodeRouteValue(routeValue.slice("detail/".length));
    return { name: "detail", runId: getAppRunById(runId) ? runId : defaultAppRunId };
  }

  if (normalizedRouteValue === "chat") {
    return { name: "chat" };
  }

  if (normalizedRouteValue === "question") {
    return { name: "chat" };
  }

  if (normalizedRouteValue === "library") {
    return { name: "library" };
  }

  if (normalizedRouteValue === "exchange") {
    return { name: "exchange" };
  }

  if (normalizedRouteValue === "event") {
    return { name: "event" };
  }

  if (normalizedRouteValue === "notifications") {
    return { name: "notifications" };
  }

  if (normalizedRouteValue === "account") {
    return { name: "account" };
  }

  return null;
}

function getRouteFromLocation(): AppRoute {
  if (typeof window === "undefined") {
    return { name: "home" };
  }

  if (window.location.hash) {
    const hashRoute = getRouteFromRouteValue(window.location.hash);

    if (hashRoute) {
      return hashRoute;
    }
  }

  const pathRoute = getRouteFromRouteValue(window.location.pathname);

  if (pathRoute) {
    return pathRoute;
  }

  return { name: "home" };
}

function getHashFromRoute(route: AppRoute) {
  if (route.name === "lp") {
    return "#lp";
  }

  if (route.name === "submit") {
    return "#submit";
  }

  if (route.name === "detail") {
    return `#detail/${encodeURIComponent(route.runId)}`;
  }

  if (route.name === "chat") {
    return "#chat";
  }

  if (route.name === "library") {
    return "#library";
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

function getUrlFromRoute(route: AppRoute) {
  return `/${getHashFromRoute(route)}`;
}

function routesEqual(a: AppRoute, b: AppRoute) {
  if (a.name !== b.name) {
    return false;
  }

  if (a.name === "detail" && b.name === "detail") {
    return a.runId === b.runId;
  }

  return true;
}

function RoutePlaceholder({ routeName }: { routeName: Exclude<AppRoute["name"], "lp" | "home" | "detail" | "submit"> }) {
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

export default function RootApp() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromLocation());
  const [selectedVersion, setSelectedVersion] = useState(() => HOME_SEASONS[0] ?? "Luna3");
  const [lastBrowseRoute, setLastBrowseRoute] = useState<AppRoute>(() => (route.name === "submit" ? { name: "home" } : route));
  const routeRef = useRef(route);
  const previousRouteRef = useRef<AppRoute | null>(null);
  const homeScrollRef = useRef(0);

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getRouteFromLocation();

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
    const previousRoute = previousRouteRef.current;
    previousRouteRef.current = route;

    const currentLocationRoute = getRouteFromLocation();
    if (!routesEqual(currentLocationRoute, route)) {
      setRoute(currentLocationRoute);
      return;
    }

    const nextHash = getHashFromRoute(route);

    if (window.location.pathname !== "/" || window.location.hash !== nextHash) {
      window.history.replaceState(null, "", getUrlFromRoute(route));
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

    if (target === "library") {
      navigate({ name: "library" });
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

  if (route.name === "lp") {
    return <LpPage />;
  }

  return (
    <AppShell
      routeName={route.name}
      hasUnreadNotifications={route.name !== "notifications"}
      onNavigate={navigateFromShell}
      onTitleClick={navigateHomeFromTitle}
      onRequestSubmit={() => navigate({ name: "submit" })}
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
          onSelectRun={(runId) => navigate({ name: "detail", runId })}
        />
      ) : null}

      {route.name === "library" ? <LibraryPage onOpenRankings={navigateHomeFromTitle} onSelectRun={(runId) => navigate({ name: "detail", runId })} /> : null}

      {route.name !== "home" && route.name !== "submit" && route.name !== "detail" && route.name !== "library" ? <RoutePlaceholder routeName={route.name} /> : null}
    </AppShell>
  );
}

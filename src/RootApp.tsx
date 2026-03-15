import { useEffect, useState } from "react";

import { RecordDetailPage } from "./components/RecordDetailPage";
import { RunSubmitPage } from "./components/RunSubmitPage";

type AppView = "detail" | "submit";

function getViewFromHash(): AppView {
  if (typeof window === "undefined") {
    return "detail";
  }

  return window.location.hash === "#submit" ? "submit" : "detail";
}

export default function RootApp() {
  const [view, setView] = useState<AppView>(() => getViewFromHash());

  useEffect(() => {
    const handleHashChange = () => setView(getViewFromHash());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const nextHash = view === "submit" ? "#submit" : "#detail";

    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [view]);

  return view === "submit" ? (
    <RunSubmitPage onBack={() => setView("detail")} />
  ) : (
    <RecordDetailPage onRequestSubmit={() => setView("submit")} />
  );
}

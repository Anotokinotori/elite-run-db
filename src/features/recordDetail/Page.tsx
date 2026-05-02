import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { appRuns, defaultAppRunId, getAppRunById } from "../../data/appRuns";
import { getSimilarRuns } from "../../lib/getSimilarRuns";

import { CompareDrawer } from "./sections/CompareDrawer";
import { Header } from "./sections/Header";
import { MainColumn } from "./sections/MainColumn";
import { Sidebar } from "./sections/Sidebar";
import { getPartyBuildItems } from "./logic";
import type { SimilarActionState } from "./types";

export function RecordDetailPage({
  runId,
  onBack,
  onRequestSubmit,
  embedded = false,
}: {
  runId?: string;
  onBack?: () => void;
  onRequestSubmit?: () => void;
  embedded?: boolean;
}) {
  const currentRun = getAppRunById(runId ?? defaultAppRunId) ?? getAppRunById(defaultAppRunId) ?? null;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState(currentRun?.comments ?? []);
  const [commentLikeState, setCommentLikeState] = useState<Record<string, boolean>>({});
  const [openMenuRunId, setOpenMenuRunId] = useState<string | null>(null);
  const [selectedCompareRunId, setSelectedCompareRunId] = useState<string | null>(null);
  const [syncPlaying, setSyncPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false,
  );
  const [similarActionState, setSimilarActionState] = useState<SimilarActionState>({});
  const [headerVersion, setHeaderVersion] = useState(currentRun?.versionLabel ?? "Luna3");
  const mainVideoIframeRef = useRef<HTMLIFrameElement | null>(null);

  const versionOptions = useMemo(() => Array.from(new Set(appRuns.map((run) => run.versionLabel))), []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches);

    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);
    return () => mediaQuery.removeEventListener("change", updateDesktopState);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      return;
    }

    setOpenMenuRunId(null);
    setSelectedCompareRunId(null);
    setSyncPlaying(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!currentRun) {
      return;
    }

    setDescriptionExpanded(false);
    setLiked(false);
    setShared(false);
    setCommentDraft("");
    setComments(currentRun.comments);
    setCommentLikeState({});
    setOpenMenuRunId(null);
    setSelectedCompareRunId(null);
    setSyncPlaying(false);
    setSimilarActionState({});
    setHeaderVersion(currentRun.versionLabel);
  }, [currentRun]);

  const compareRun = selectedCompareRunId ? getAppRunById(selectedCompareRunId) ?? null : null;
  const compareOpen = isDesktop && compareRun !== null;

  useEffect(() => {
    if (!compareOpen || embedded) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [compareOpen, embedded]);

  if (!currentRun) {
    return null;
  }

  const similarRuns = getSimilarRuns(currentRun, appRuns, 4);
  const forceMobileLayout = compareOpen;
  const visibleTags = descriptionExpanded ? currentRun.tags : [];
  const shouldShowExpandedArea = descriptionExpanded && (currentRun.summary.length > 0 || currentRun.tags.length > 0);
  const canExpandDescription = currentRun.tags.length > 0 || currentRun.summary.length > 0;
  const partyBuildItems = getPartyBuildItems(currentRun);
  const mainSurfaceClass = embedded
    ? compareOpen
      ? "min-h-full lg:mr-[50vw]"
      : "min-h-full"
    : compareOpen
      ? "fixed inset-y-0 left-0 z-40 overflow-y-auto lg:w-[50vw]"
      : "min-h-screen lg:w-full";

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = commentDraft.trim();

    if (!body) {
      return;
    }

    setComments((previousComments) => [
      {
        id: `local-${Date.now()}`,
        userName: "You",
        userHandle: "@local-runner",
        postedLabel: "たった今",
        body,
      },
      ...previousComments,
    ]);
    setCommentDraft("");
  };

  const handleSimilarAction = (runId: string, action: "like" | "share" | "compare") => {
    setOpenMenuRunId(null);

    if (action === "compare") {
      if (!isDesktop) {
        return;
      }

      setSelectedCompareRunId(runId);
      setSyncPlaying(false);
      return;
    }

    setSimilarActionState((previousState) => {
      const currentState = previousState[runId] ?? { liked: false, shared: false };
      const nextState = {
        liked: action === "like" ? !currentState.liked : currentState.liked,
        shared: action === "share" ? !currentState.shared : currentState.shared,
      };

      return {
        ...previousState,
        [runId]: nextState,
      };
    });
  };

  const toggleCommentLike = (commentId: string) => {
    setCommentLikeState((previousState) => ({
      ...previousState,
      [commentId]: !previousState[commentId],
    }));
  };

  return (
    <>
      <main className={`bg-[#f5f6f8] text-[#333333] transition-[width] duration-300 ${mainSurfaceClass}`}>
        <Header
          embedded={embedded}
          forceMobileLayout={forceMobileLayout}
          onBack={onBack}
          onRequestSubmit={onRequestSubmit}
          headerVersion={headerVersion}
          versionOptions={versionOptions}
          onHeaderVersionChange={setHeaderVersion}
        />

        <div className={`mx-auto flex w-full max-w-[1600px] flex-col gap-[12px] px-3 py-3 ${forceMobileLayout ? "" : "md:px-4 md:py-4 lg:px-5 lg:py-5"} ${compareOpen ? "lg:items-stretch" : "lg:flex-row lg:items-start lg:gap-[14px]"}`}>
          <MainColumn
            currentRun={currentRun}
            comments={comments}
            commentDraft={commentDraft}
            commentLikeState={commentLikeState}
            compareOpen={compareOpen}
            forceMobileLayout={forceMobileLayout}
            descriptionExpanded={descriptionExpanded}
            liked={liked}
            shared={shared}
            canExpandDescription={canExpandDescription}
            shouldShowExpandedArea={shouldShowExpandedArea}
            visibleTags={visibleTags}
            mainVideoIframeRef={mainVideoIframeRef}
            onToggleLike={() => setLiked((previous) => !previous)}
            onToggleShare={() => setShared((previous) => !previous)}
            onToggleDescription={() => setDescriptionExpanded((previous) => !previous)}
            onCommentDraftChange={setCommentDraft}
            onCommentSubmit={handleCommentSubmit}
            onCommentLike={toggleCommentLike}
          />

          <Sidebar
            compareOpen={compareOpen}
            partyBuildItems={partyBuildItems}
            similarRuns={similarRuns}
            similarActionState={similarActionState}
            openMenuRunId={openMenuRunId}
            selectedCompareRunId={selectedCompareRunId}
            onToggleMenu={(runKey) => setOpenMenuRunId((previous) => (previous === runKey ? null : runKey))}
            onAction={handleSimilarAction}
          />
        </div>
      </main>

      <CompareDrawer
        baseIframeRef={mainVideoIframeRef}
        comparedRun={compareRun}
        isOpen={compareOpen}
        syncPlaying={syncPlaying}
        embedded={embedded}
        onClose={() => {
          setSelectedCompareRunId(null);
          setSyncPlaying(false);
        }}
        onToggleSync={() => setSyncPlaying((previous) => !previous)}
      />
    </>
  );
}

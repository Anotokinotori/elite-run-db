import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type RunRecord,
  characterDb,
  defaultRunId,
  getRunById,
  mockRuns,
  weaponDb,
} from "../data/mockRuns";
import { getSimilarRuns } from "../lib/getSimilarRuns";
import { getYouTubeEmbedUrl } from "../lib/youtube";
import { CharacterIcon } from "./CharacterIcon";
import { LikeIcon, PauseIcon, PlayIcon, PlatformIcon, ShareIcon } from "./UiIcons";

const collapsedCopyStyle: CSSProperties = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
};

function postYouTubeCommand(iframe: HTMLIFrameElement | null, command: "playVideo" | "pauseVideo") {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({
      event: "command",
      func: command,
      args: [],
    }),
    "https://www.youtube.com",
  );
}

function getInitials(label: string) {
  return label.slice(0, 2).toUpperCase();
}

function getPartyLoadout(run: RunRecord) {
  return run.party.map((member, index) => {
    const character = characterDb[member.characterId];
    const weaponLoadout = run.weapons[index];
    const weapon = weaponDb[weaponLoadout.weaponId];

    return {
      slot: index + 1,
      characterId: member.characterId,
      characterName: character?.name ?? member.characterId,
      cons: member.cons,
      weaponName: weapon?.name ?? weaponLoadout.weaponId,
      refine: weaponLoadout.refine,
    };
  });
}

function CircleAvatar({
  label,
  size,
  dark = false,
  bordered = false,
}: {
  label: string;
  size: number;
  dark?: boolean;
  bordered?: boolean;
}) {
  const fontSize = Math.max(9, Math.round(size * 0.2));

  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full ${
        dark ? "bg-[#333333] text-white" : "bg-[#d9d9d9] text-[#666666]"
      } ${bordered ? "border border-black/30 bg-white text-black" : ""}`}
      style={{ width: size, height: size, fontSize }}
    >
      <span className="font-medium tracking-[0.04em]">{bordered ? "" : getInitials(label)}</span>
    </div>
  );
}

function PillButton({
  children,
  dark = false,
  active = false,
  onClick,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[42px] px-[14px] py-[7px] text-[14px] font-medium leading-none transition duration-150 hover:-translate-y-[1px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:text-[15px] ${
        dark || active ? "bg-[#333333] text-white" : "bg-[#f2f2f2] text-black"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function TinyBadge({ label }: { label: string }) {
  return (
    <div className="w-full rounded-[4px] bg-[rgba(248,196,163,0.25)] px-[4px] py-[3px] text-center text-[11px] leading-none text-[#f09e78] md:text-[12px]">
      {label}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="text-[16px] font-bold leading-none text-black md:text-[18px]">{children}</div>;
}

function parsePlatformTag(tag: string): RunRecord["platform"][] | null {
  const parts = tag.replace(/\s/g, "").split("+");

  if (parts.length === 0) {
    return null;
  }

  if (parts.every((part) => part === "PC" || part === "PS5" || part === "Mobile")) {
    return parts as RunRecord["platform"][];
  }

  return null;
}

function PlatformLabel({
  platform,
  iconClassName = "h-4 w-4",
}: {
  platform: RunRecord["platform"];
  iconClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-[6px]">
      <PlatformIcon platform={platform} className={iconClassName} />
      <span>{platform}</span>
    </span>
  );
}

function TagChip({ tag }: { tag: string }) {
  const platformParts = parsePlatformTag(tag);

  return (
    <span className="inline-flex items-center gap-[6px] rounded-[42px] bg-white px-[10px] py-[5px] text-[12px] text-black md:px-[12px] md:py-[6px] md:text-[13px]">
      {platformParts ? (
        <span className="inline-flex items-center gap-[4px]">
          {platformParts.map((platform, index) => (
            <PlatformIcon key={`${tag}-${platform}-${index}`} platform={platform} className="h-[13px] w-[13px] md:h-[14px] md:w-[14px]" />
          ))}
        </span>
      ) : null}
      <span>{tag}</span>
    </span>
  );
}

function VideoFrame({
  title,
  videoUrl,
  iframeRef,
  autoplay = false,
  mute = false,
}: {
  title: string;
  videoUrl: string;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  autoplay?: boolean;
  mute?: boolean;
}) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl, { autoplay, mute, enableJsApi: true });

  return (
    <div className="aspect-[669/380] w-full overflow-hidden rounded-[12px] border border-[#ebebeb] bg-[#d9d9d9] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      {embedUrl ? (
        <iframe
          ref={iframeRef}
          title={title}
          src={embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : null}
    </div>
  );
}

function CompareRunPane({ run, iframeRef }: { run: RunRecord; iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  const partyLoadout = getPartyLoadout(run);

  return (
    <div className="flex min-h-full flex-col gap-[16px] bg-white px-3 py-3">
      <VideoFrame title={run.title} videoUrl={run.videoUrl} iframeRef={iframeRef} mute />

      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[12px]">
          <div className="text-[16px] font-bold leading-none text-black md:text-[18px]">{run.title}</div>
          <div className="flex items-center justify-between gap-[12px]">
            <div className="flex min-w-0 items-center gap-[12px]">
              <CircleAvatar label={run.userName} size={40} />
              <div className="truncate text-[16px] font-bold leading-none text-black md:text-[18px]">{run.userName}</div>
            </div>
            <div className="inline-flex shrink-0 items-center gap-[6px] rounded-[42px] bg-[#f2f2f2] px-[10px] py-[5px] text-[12px] text-black md:text-[13px]">
              <PlatformIcon platform={run.platform} className="h-[13px] w-[13px]" />
              <span>{run.platform}</span>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[12px] border border-[#ebebeb] bg-[#f5f6f8] p-[12px]">
          <div className="flex items-center gap-x-[16px] overflow-x-auto whitespace-nowrap text-[13px] text-black md:gap-x-[18px] md:text-[14px]">
            <span>ver : {run.versionLabel}</span>
            <span>{run.postedLabel}</span>
            <PlatformLabel platform={run.platform} />
          </div>
          <div className="mt-[12px] space-y-[12px]">
            <p className="whitespace-pre-line text-[14px] leading-[1.75] text-black md:text-[15px]">{run.summary}</p>
            <div className="flex flex-wrap gap-[10px] md:gap-[12px]">
              {run.tags.map((tag) => (
                <TagChip key={`${run.id}-${tag}`} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="w-full rounded-[12px] border border-[#ebebeb] bg-white p-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-[20px]">
          <SectionTitle>使用編成</SectionTitle>
          <div className="flex flex-col gap-[18px] md:gap-[20px]">
            {partyLoadout.map((entry) => (
              <div key={`${run.id}-${entry.characterName}-${entry.slot}`} className="flex items-center gap-[12px]">
                <CharacterIcon characterId={entry.characterId} alt={entry.characterName} fallbackLabel={entry.characterName} size={60} />
                <div className="flex min-w-0 flex-1 items-center justify-between gap-[12px]">
                  <div className="min-w-0">
                    <div className="truncate text-[17px] font-medium leading-none text-black md:text-[18px]">{entry.characterName}</div>
                    <div className="mt-[4px] truncate text-[12px] text-[#9999b1] md:text-[13px]">{entry.weaponName}</div>
                  </div>
                  <div className="flex w-[30px] shrink-0 flex-col gap-[6px] pb-[2px] pt-[4px]">
                    <TinyBadge label={`C${entry.cons}`} />
                    <TinyBadge label={`R${entry.refine}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CompareDrawer({
  baseIframeRef,
  comparedRun,
  isOpen,
  syncPlaying,
  onClose,
  onToggleSync,
}: {
  baseIframeRef: React.RefObject<HTMLIFrameElement | null>;
  comparedRun: RunRecord | null;
  isOpen: boolean;
  syncPlaying: boolean;
  onClose: () => void;
  onToggleSync: () => void;
}) {
  const comparedIframeRef = useRef<HTMLIFrameElement | null>(null);


  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !comparedRun) {
      return;
    }

    const command = syncPlaying ? "playVideo" : "pauseVideo";
    const timerId = window.setTimeout(() => {
      postYouTubeCommand(baseIframeRef.current, command);
      postYouTubeCommand(comparedIframeRef.current, command);
    }, 800);

    return () => window.clearTimeout(timerId);
  }, [baseIframeRef, comparedRun, isOpen, syncPlaying]);

  if (!isOpen || !comparedRun) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 hidden lg:block" aria-modal="false" role="complementary">
      <div className="flex h-full w-[50vw] flex-col border-l border-[#ebebeb] bg-white shadow-[-12px_0_24px_rgba(0,0,0,0.08)]">
        <div className="flex min-h-[52px] items-center justify-between border-b border-[#ebebeb] px-4 py-2">
          <div className="min-w-0">
            <div className="text-[16px] font-semibold text-black md:text-[18px]">比較ビュー</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSync}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-[42px] bg-[#f2f2f2] px-4 text-[13px] font-medium text-black transition hover:bg-[#e8e8e8]"
            >
              {syncPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              <span>{syncPlaying ? "同期停止" : "同時再生"}</span>
            </button>
            <button
              type="button"
              aria-label="比較ビューを閉じる"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#f2f2f2] text-black transition hover:bg-[#e8e8e8]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#fbfbfb]">
          <CompareRunPane run={comparedRun} iframeRef={comparedIframeRef} />
        </div>
      </div>
    </div>
  );
}

function SimilarActionMenu({
  isOpen,
  liked,
  shared,
  onToggle,
  onAction,
}: {
  isOpen: boolean;
  liked: boolean;
  shared: boolean;
  onToggle: () => void;
  onAction: (action: "like" | "share" | "compare") => void;
}) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onToggle}
        aria-label="類似記録の操作"
        className="grid h-8 w-8 place-items-center rounded-full bg-[#f2f2f2] text-black transition hover:bg-[#e7e7e7]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-[168px] rounded-[12px] border border-[#ebebeb] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[13px] text-black hover:bg-[#f2f2f2]"
            onClick={() => onAction("like")}
          >
            <LikeIcon className="h-4 w-4" />
            <span>{liked ? "いいね解除" : "いいね"}</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[13px] text-black hover:bg-[#f2f2f2]"
            onClick={() => onAction("share")}
          >
            <ShareIcon className="h-4 w-4" />
            <span>{shared ? "共有解除" : "共有"}</span>
          </button>
          <button
            type="button"
            className="hidden w-full rounded-[8px] px-3 py-2 text-left text-[13px] text-black hover:bg-[#f2f2f2] lg:block"
            onClick={() => onAction("compare")}
          >
            比較ビュー
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function RecordDetailPage({
  runId,
  onBack,
  onRequestSubmit,
}: {
  runId?: string;
  onBack?: () => void;
  onRequestSubmit?: () => void;
}) {
  const currentRun = getRunById(runId ?? defaultRunId) ?? getRunById(defaultRunId) ?? null;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState(currentRun?.comments ?? []);
  const [openMenuRunId, setOpenMenuRunId] = useState<string | null>(null);
  const [compareQueuedRunId, setCompareQueuedRunId] = useState<string | null>(null);
  const [syncPlaying, setSyncPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false,
  );
  const [similarActionState, setSimilarActionState] = useState<Record<string, { liked: boolean; shared: boolean }>>({});
  const [headerVersion, setHeaderVersion] = useState(currentRun?.versionLabel ?? "Luna3");
  const mainVideoIframeRef = useRef<HTMLIFrameElement | null>(null);

  const versionOptions = useMemo(() => Array.from(new Set(mockRuns.map((run) => run.versionLabel))), []);

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
    setCompareQueuedRunId(null);
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
    setOpenMenuRunId(null);
    setCompareQueuedRunId(null);
    setSyncPlaying(false);
    setSimilarActionState({});
    setHeaderVersion(currentRun.versionLabel);
  }, [currentRun]);

  if (!currentRun) {
    return null;
  }

  const similarRuns = getSimilarRuns(currentRun, mockRuns, 4);
  const compareRun = compareQueuedRunId ? getRunById(compareQueuedRunId) ?? null : null;
  const compareOpen = isDesktop && compareRun !== null;
  const forceMobileLayout = compareOpen;
  const visibleTags = descriptionExpanded ? currentRun.tags : [];
  const shouldShowExpandedArea = descriptionExpanded && (currentRun.summary.length > 0 || currentRun.tags.length > 0);
  const canExpandDescription = currentRun.tags.length > 0 || currentRun.summary.length > 0;
  const partyLoadout = getPartyLoadout(currentRun);

  useEffect(() => {
    if (!compareOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [compareOpen]);

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

      setCompareQueuedRunId(runId);
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

  return (
    <>
      <main className={`bg-white text-[#333333] transition-[width] duration-300 ${compareOpen ? "fixed inset-y-0 left-0 z-40 overflow-y-auto lg:w-[50vw]" : "min-h-screen lg:w-full"}`}>
        <nav className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <div className={`header-font mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2 ${forceMobileLayout ? "min-h-[52px]" : "md:px-6 md:py-3"}`}>
            <div className={`flex items-center ${forceMobileLayout ? "gap-3" : "gap-4 md:gap-6"}`}>
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="一覧へ戻る"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f2f2f2] text-black transition hover:bg-[#e8e8e8]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 5L8 12L15 19" />
                  </svg>
                </button>
              ) : null}
              <h1 className={`font-semibold tracking-tight text-black ${forceMobileLayout ? "text-[24px]" : "text-[26px] md:text-[38px]"}`}>精鋭狩りDB</h1>
              <div className="relative">
                <select
                  className={`appearance-none rounded-full border border-black/30 bg-white py-1.5 pl-3 pr-10 font-medium text-black ${forceMobileLayout ? "text-[15px]" : "text-[16px] md:pl-4 md:pr-12 md:text-[20px]"}`}
                  value={headerVersion}
                  onChange={(event) => setHeaderVersion(event.target.value)}
                >
                  {versionOptions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/70">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            <div className={`flex items-center ${forceMobileLayout ? "gap-2" : "gap-3 md:gap-4"}`}>
              <button
                type="button"
                onClick={onRequestSubmit}
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-black text-white ${forceMobileLayout ? "" : "md:h-auto md:w-auto md:gap-2 md:px-5 md:py-2.5 md:text-[20px]"}`}
              >
                <span className="text-[20px] leading-none md:text-[22px]">＋</span>
                <span className={forceMobileLayout ? "hidden" : "hidden md:inline"}>記録提出</span>
              </button>
              <CircleAvatar label="luna3" size={36} bordered />
            </div>
          </div>
        </nav>

        <div className={`mx-auto flex w-full max-w-[1600px] flex-col gap-[12px] px-3 py-3 ${forceMobileLayout ? "" : "md:px-4 md:py-4 lg:px-5 lg:py-5"} ${compareOpen ? "lg:items-stretch" : "lg:flex-row lg:items-start lg:gap-[14px]"}`}>
          <section className={`flex min-w-0 flex-1 flex-col gap-[18px] ${compareOpen ? "lg:flex-none" : "lg:flex-[1_1_auto]"}`}>
            <VideoFrame title={currentRun.title} videoUrl={currentRun.videoUrl} iframeRef={mainVideoIframeRef} autoplay mute />

            <div className="flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[12px]">
                <div className="text-[16px] font-bold leading-none text-black md:text-[18px]">{currentRun.title}</div>
                <div className={`flex gap-[12px] ${compareOpen ? "flex-col items-start" : "items-center justify-between"}`}>
                  <div className="flex min-w-0 items-center gap-[12px]">
                    <CircleAvatar label={currentRun.userName} size={40} />
                    <div className="truncate text-[16px] font-bold leading-none text-black md:text-[18px]">{currentRun.userName}</div>
                  </div>
                  <div className={`flex gap-[12px] md:gap-[12px] ${compareOpen ? "w-full shrink min-w-0 flex-wrap" : "shrink-0 flex-nowrap"}`}>
                    <PillButton active={liked} onClick={() => setLiked((previous) => !previous)} className="min-h-[36px] min-w-[92px]">
                      <LikeIcon className="h-4 w-4" />
                      <span>いいね</span>
                    </PillButton>
                    <PillButton active={shared} onClick={() => setShared((previous) => !previous)} className="min-h-[36px] min-w-[92px]">
                      <ShareIcon className="h-4 w-4" />
                      <span>共有</span>
                    </PillButton>
                  </div>
                </div>
              </div>

              <div className="w-full rounded-[12px] border border-[#ebebeb] bg-[#f5f6f8] p-[12px]">
                <div className={`flex gap-[16px] ${compareOpen ? "flex-col items-start whitespace-normal" : "items-center justify-between whitespace-nowrap"}`}>
                  <div className={`flex min-w-0 gap-x-[16px] text-[13px] text-black md:gap-x-[18px] md:text-[14px] ${compareOpen ? "flex-wrap items-center gap-y-[6px]" : "items-center"}`}>
                    <span>ver : {currentRun.versionLabel}</span>
                    <span>{currentRun.postedLabel}</span>
                    <PlatformLabel platform={currentRun.platform} />
                  </div>
                  {canExpandDescription && !descriptionExpanded ? (
                    <button
                      type="button"
                      onClick={() => setDescriptionExpanded((previous) => !previous)}
                      className={`shrink-0 text-right text-black ${forceMobileLayout ? "text-[13px]" : "text-[13px] md:text-[14px]"}`}
                    >
                      ...もっと見る
                    </button>
                  ) : null}
                </div>

                {shouldShowExpandedArea ? (
                  <div className="mt-[12px] space-y-[12px]">
                    <p className={`whitespace-pre-line leading-[1.75] text-black ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`} style={descriptionExpanded ? undefined : collapsedCopyStyle}>
                      {currentRun.summary}
                    </p>
                    <div className="flex flex-wrap gap-[10px] md:gap-[12px]">
                      {visibleTags.map((tag) => (
                        <TagChip key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[12px]">
                <SectionTitle>{comments.length}件のコメント</SectionTitle>
                <form onSubmit={handleCommentSubmit} className="flex w-full items-center gap-[8px]">
                  <CircleAvatar label="You" size={36} />
                  <div className="flex flex-1 items-center justify-between border-b border-[#d9d9d9] p-[8px] transition focus-within:border-[#b9b9cc]">
                    <input
                      value={commentDraft}
                      onChange={(event) => setCommentDraft(event.target.value)}
                      placeholder="コメントする..."
                      className={`min-w-0 flex-1 border-none bg-transparent text-black outline-none ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}
                    />
                    <PillButton className="ml-[8px] min-h-[30px] shrink-0 whitespace-nowrap px-[12px] py-[5px] text-[12px] md:text-[13px]">送信</PillButton>
                  </div>
                </form>
              </div>

              <div className="flex flex-col gap-[20px] md:gap-[24px]">
                {comments.map((comment) => (
                  <article key={comment.id} className="flex items-start gap-[12px]">
                    <CircleAvatar label={comment.userName} size={40} />
                    <div className="flex min-w-0 flex-1 flex-col gap-[8px] justify-center">
                      <div className={`flex flex-wrap items-center gap-[8px] text-black ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}>
                        <span>{comment.userName}</span>
                        <span className="text-[#9999b1]">{comment.postedLabel}</span>
                      </div>
                      <div className={`leading-[1.75] text-[#3d3d3d] ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}>{comment.body}</div>
                      <div className={`flex gap-[12px] md:gap-[12px] ${compareOpen ? "w-full shrink min-w-0 flex-wrap" : "shrink-0 flex-nowrap"}`}>
                        <PillButton className="px-[8px] py-[4px] text-[11px] md:text-[12px]">
                          <LikeIcon className="h-3 w-3" />
                          <span>いいね</span>
                        </PillButton>
                        <PillButton className="px-[8px] py-[4px] text-[11px] md:text-[12px]">返信</PillButton>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className={`flex w-full shrink-0 flex-col gap-[18px] ${compareOpen ? "lg:w-full xl:w-full" : "lg:w-[360px] xl:w-[372px]"}`}>
            <section className="w-full rounded-[12px] border border-[#ebebeb] bg-white p-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-[20px]">
                <SectionTitle>使用編成</SectionTitle>
                <div className="flex flex-col gap-[18px] md:gap-[20px]">
                  {partyLoadout.map((entry) => (
                    <div key={`${entry.characterName}-${entry.slot}`} className="flex items-center gap-[12px]">
                      <CharacterIcon characterId={entry.characterId} alt={entry.characterName} fallbackLabel={entry.characterName} size={60} />
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-[12px]">
                        <div className="min-w-0">
                          <div className="truncate text-[17px] font-medium leading-none text-black md:text-[18px]">{entry.characterName}</div>
                          <div className="mt-[4px] truncate text-[12px] text-[#9999b1] md:text-[13px]">{entry.weaponName}</div>
                        </div>
                        <div className="flex w-[30px] shrink-0 flex-col gap-[6px] pb-[2px] pt-[4px]">
                          <TinyBadge label={`C${entry.cons}`} />
                          <TinyBadge label={`R${entry.refine}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="w-full rounded-[12px] border border-[#ebebeb] bg-white p-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-[20px]">
                <SectionTitle>類似編成の記録</SectionTitle>
                <div className="flex flex-col gap-[18px] md:gap-[20px]">
                  {similarRuns.map((match) => {
                    const runState = similarActionState[match.run.id] ?? { liked: false, shared: false };
                    const isOpen = openMenuRunId === match.run.id;
                    const isCompareQueued = compareQueuedRunId === match.run.id;

                    return (
                      <div key={match.run.id} className={isCompareQueued ? "rounded-[12px] bg-[#f7f7f7] px-[8px] py-[8px]" : "rounded-[12px] px-[4px] py-[4px] transition-colors hover:bg-[#fafafa]"}>
                        <div className="flex flex-col items-end gap-[10px]">
                          <div className="h-[40px] w-full px-[8px]">
                            <div className="flex h-[40px] items-center justify-between gap-[4px]">
                              {match.run.party.map((member) => {
                                const characterName = characterDb[member.characterId]?.name ?? member.characterId;
                                return <CharacterIcon key={`${match.run.id}-${member.characterId}`} characterId={member.characterId} alt={characterName} fallbackLabel={characterName} size={32} />;
                              })}
                            </div>
                          </div>
                          <div className="flex w-full items-end gap-[4px]">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-[8px]">
                                <div className="truncate text-[14px] font-medium leading-[1.35] text-black md:text-[15px]">{match.run.title}</div>
                                <div className="flex flex-wrap items-center gap-[4px] text-[12px] text-[#9999b1] md:text-[13px]">
                                  <span>{match.run.userName}</span>
                                  <span>・</span>
                                  <span>{match.run.postedLabel}</span>
                                  <span>・</span>
                                  <span>{match.run.platform}</span>
                                </div>
                              </div>
                            </div>
                            <SimilarActionMenu
                              isOpen={isOpen}
                              liked={runState.liked}
                              shared={runState.shared}
                              onToggle={() => setOpenMenuRunId((previous) => (previous === match.run.id ? null : match.run.id))}
                              onAction={(action) => handleSimilarAction(match.run.id, action)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <CompareDrawer
        baseIframeRef={mainVideoIframeRef}
        comparedRun={compareRun}
        isOpen={compareOpen}
        syncPlaying={syncPlaying}
        onClose={() => {
          setCompareQueuedRunId(null);
          setSyncPlaying(false);
        }}
        onToggleSync={() => setSyncPlaying((previous) => !previous)}
      />
    </>
  );
}











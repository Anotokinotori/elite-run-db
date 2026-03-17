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
import { getSimilarRuns, type SimilarRunMatch } from "../lib/getSimilarRuns";
import { getYouTubeEmbedUrl } from "../lib/youtube";
import { CharacterIcon } from "./CharacterIcon";
import { CompareViewIcon, LikeIcon, PauseIcon, PlayIcon, PlatformIcon, ShareIcon } from "./UiIcons";

const collapsedCopyStyle: CSSProperties = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
};

const DETAIL_PANEL_SHELL_CLASS = "relative overflow-hidden rounded-[20px] bg-[#3d3c3d] drop-shadow-xl";
const DETAIL_PANEL_INNER_CLASS = "relative z-[1] m-[2px] rounded-[18px] bg-[#323132] text-white/90";
const DETAIL_MUTED_SURFACE_CLASS = "rounded-[16px] border border-white/10 bg-[#272727]";
const DETAIL_ICON_BUTTON_CLASS =
  "grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#272727] text-white/82 transition hover:bg-white/[0.12] hover:text-white";
const DETAIL_LIKE_ACTIVE_ICON_CLASS = "text-[#ff8ea1]";

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

type PartyLoadoutEntry = {
  slot: number;
  characterId: string;
  characterName: string;
  cons: number;
  weaponName: string;
  refine: number;
  isMainAttacker: boolean;
};

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
      isMainAttacker: member.characterId === run.mainAttackerId,
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
        dark || active
          ? "border border-black/50 bg-black text-white"
          : "border border-white/10 bg-[#272727] text-white/90 hover:bg-[#303030]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function TinyBadge({ label, highlighted = false }: { label: string; highlighted?: boolean }) {
  return (
    <span
      className={`inline-flex min-w-[38px] items-center justify-center rounded-full px-[9px] py-[5px] text-[11px] font-semibold leading-none md:text-[12px] ${
        highlighted
          ? "border border-[#efc9b0] bg-[#fbf1ea] text-[#c27642]"
          : "border border-[#dde2ea] bg-[#f2f4f7] text-[#5f6678]"
      }`}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="text-[16px] font-bold leading-none text-white/90 md:text-[18px]">{children}</div>;
}

function SidebarPanel({ children }: { children: ReactNode }) {
  return (
    <section className={`w-full ${DETAIL_PANEL_SHELL_CLASS}`}>
      <div className={`${DETAIL_PANEL_INNER_CLASS} p-[16px]`}>
        <div className="pointer-events-none absolute -left-[30%] -top-[44%] h-[220px] w-[220px] rounded-full bg-white/18 blur-[72px]" />
        <div className="relative z-[1]">{children}</div>
      </div>
    </section>
  );
}

function SidebarSectionHeader({ title, meta }: { title: ReactNode; meta?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-[12px]">
      <SectionTitle>{title}</SectionTitle>
      {meta ? <div className="shrink-0 text-[12px] font-medium text-white/52 md:text-[13px]">{meta}</div> : null}
    </div>
  );
}

function LoadoutEntryCard({ entry }: { entry: PartyLoadoutEntry }) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-[#272727] p-[12px] md:p-[14px]">
      <div className="flex items-start gap-[12px] md:gap-[14px]">
        <CharacterIcon characterId={entry.characterId} alt={entry.characterName} fallbackLabel={entry.characterName} size={56} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[16px] font-semibold leading-[1.2] text-white/92 md:text-[17px]">{entry.characterName}</div>
          <div className="mt-[5px] truncate text-[13px] leading-[1.45] text-white/56 md:text-[14px]">{entry.weaponName}</div>
          <div className="mt-[10px] flex flex-wrap gap-[8px]">
            <TinyBadge label={`C${entry.cons}`} highlighted={entry.cons === 6} />
            <TinyBadge label={`R${entry.refine}`} highlighted={entry.refine === 5} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SimilarityReasonChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-[#272727] px-[10px] py-[5px] text-[11px] font-medium leading-none text-white/68 md:text-[12px]">
      {label}
    </span>
  );
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
    <span className="inline-flex items-center gap-[6px] rounded-[42px] border border-white/10 bg-[#272727] px-[10px] py-[5px] text-[12px] text-white/85 md:px-[12px] md:py-[6px] md:text-[13px]">
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
    <div className="aspect-[669/380] w-full overflow-hidden rounded-[16px] border border-white/10 bg-[#272727] shadow-[0_20px_40px_rgba(0,0,0,0.28)]">
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
    <div className="flex min-h-full flex-col gap-[16px] bg-[#212121] px-3 py-3 text-white/90">
      <VideoFrame title={run.title} videoUrl={run.videoUrl} iframeRef={iframeRef} mute />

      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[12px]">
          <div className="text-[16px] font-bold leading-none text-white md:text-[18px]">{run.title}</div>
          <div className="flex items-center justify-between gap-[12px]">
            <div className="flex min-w-0 items-center gap-[12px]">
              <CircleAvatar label={run.userName} size={40} />
              <div className="truncate text-[16px] font-bold leading-none text-white md:text-[18px]">{run.userName}</div>
            </div>
            <div className="inline-flex shrink-0 items-center gap-[6px] rounded-[42px] border border-white/10 bg-[#272727] px-[10px] py-[5px] text-[12px] text-white/82 md:text-[13px]">
              <PlatformIcon platform={run.platform} className="h-[13px] w-[13px]" />
              <span>{run.platform}</span>
            </div>
          </div>
        </div>

        <div className={`w-full ${DETAIL_MUTED_SURFACE_CLASS} p-[12px]`}>
          <div className="flex items-center gap-x-[16px] overflow-x-auto whitespace-nowrap text-[13px] text-white/74 md:gap-x-[18px] md:text-[14px]">
            <span>ver : {run.versionLabel}</span>
            <span>{run.postedLabel}</span>
            <PlatformLabel platform={run.platform} />
          </div>
          <div className="mt-[12px] space-y-[12px]">
            <p className="whitespace-pre-line text-[14px] leading-[1.75] text-white/88 md:text-[15px]">{run.summary}</p>
            <div className="flex flex-wrap gap-[10px] md:gap-[12px]">
              {run.tags.map((tag) => (
                <TagChip key={`${run.id}-${tag}`} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <SidebarPanel>
        <div className="flex flex-col gap-[16px]">
          <SidebarSectionHeader title="使用編成" meta={`${partyLoadout.length}メンバー`} />
          <div className="flex flex-col gap-[12px]">
            {partyLoadout.map((entry) => (
              <LoadoutEntryCard key={`${run.id}-${entry.characterName}-${entry.slot}`} entry={entry} />
            ))}
          </div>
        </div>
      </SidebarPanel>
    </div>
  );
}

function CompareDrawer({
  baseIframeRef,
  comparedRun,
  isOpen,
  syncPlaying,
  embedded = false,
  onClose,
  onToggleSync,
}: {
  baseIframeRef: React.RefObject<HTMLIFrameElement | null>;
  comparedRun: RunRecord | null;
  isOpen: boolean;
  syncPlaying: boolean;
  embedded?: boolean;
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
    <div className={embedded ? "fixed top-[80px] right-0 bottom-0 z-20 hidden lg:block" : "fixed inset-y-0 right-0 z-50 hidden lg:block"} aria-modal="false" role="complementary">
      <div className="flex h-full w-[50vw] flex-col border-l border-white/10 bg-[#212121] shadow-[-20px_0_40px_rgba(0,0,0,0.35)]">
        <div className="flex min-h-[52px] items-center justify-between border-b border-white/10 bg-[#212121] px-4 py-2">
          <div className="min-w-0">
            <div className="text-[16px] font-semibold text-white/92 md:text-[18px]">比較ビュー</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSync}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-[42px] border border-white/10 bg-[#272727] px-4 text-[13px] font-medium text-white transition hover:bg-[#303030]"
            >
              {syncPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              <span>{syncPlaying ? "同期停止" : "同時再生"}</span>
            </button>
            <button
              type="button"
              aria-label="比較ビューを閉じる"
              onClick={onClose}
              className={DETAIL_ICON_BUTTON_CLASS}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#212121]">
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
        className={DETAIL_ICON_BUTTON_CLASS}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-[180px] rounded-[16px] border border-white/10 bg-[#323132] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.28)]">
          <button
            type="button"
            className="flex h-10 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[13px] font-medium text-white/90 hover:bg-white/[0.08]"
            onClick={() => onAction("like")}
          >
            <LikeIcon filled={liked} className={`h-4 w-4 ${liked ? DETAIL_LIKE_ACTIVE_ICON_CLASS : ""}`} />
            <span>{liked ? "いいね解除" : "いいね"}</span>
          </button>
          <button
            type="button"
            className="flex h-10 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[13px] font-medium text-white/90 hover:bg-white/[0.08]"
            onClick={() => onAction("share")}
          >
            <ShareIcon className="h-4 w-4" />
            <span>{shared ? "共有解除" : "共有"}</span>
          </button>
          <button
            type="button"
            className="hidden h-10 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[13px] font-medium text-white/90 hover:bg-white/[0.08] lg:flex"
            onClick={() => onAction("compare")}
          >
            <CompareViewIcon className="h-4 w-4" />
            比較ビュー
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SimilarRunCard({
  match,
  liked,
  shared,
  isMenuOpen,
  isCompareQueued,
  onToggleMenu,
  onAction,
}: {
  match: SimilarRunMatch;
  liked: boolean;
  shared: boolean;
  isMenuOpen: boolean;
  isCompareQueued: boolean;
  onToggleMenu: () => void;
  onAction: (action: "like" | "share" | "compare") => void;
}) {
  const visibleReasons = match.reasons.slice(0, 2);

  return (
    <article
      className={`rounded-[16px] border p-[14px] transition-colors ${
        isCompareQueued ? "border-white/20 bg-[#3b3a3b]" : "border-white/10 bg-[#323132] hover:bg-[#353435]"
      }`}
    >
      <div className="flex items-start gap-[10px]">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-[12px]">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold leading-[1.4] text-white/92 md:text-[16px]">{match.run.title}</div>
              <div className="mt-[6px] flex flex-wrap items-center gap-x-[8px] gap-y-[4px] text-[12px] text-white/52 md:text-[13px]">
                <span className="font-medium text-white/78">{match.run.userName}</span>
                <span>{match.run.postedLabel}</span>
                <PlatformLabel platform={match.run.platform} iconClassName="h-[13px] w-[13px]" />
              </div>
            </div>
            <div className="flex shrink-0 items-start">
              <SimilarActionMenu isOpen={isMenuOpen} liked={liked} shared={shared} onToggle={onToggleMenu} onAction={onAction} />
            </div>
          </div>

          <div className="mt-[12px] rounded-[16px] border border-white/10 bg-[#272727] px-[10px] py-[9px]">
            <div className="flex items-center justify-between gap-[8px]">
              {match.run.party.map((member) => {
                const characterName = characterDb[member.characterId]?.name ?? member.characterId;
                return <CharacterIcon key={`${match.run.id}-${member.characterId}`} characterId={member.characterId} alt={characterName} fallbackLabel={characterName} size={36} />;
              })}
            </div>
          </div>

          <div className="mt-[12px] flex flex-wrap gap-[8px]">
            {(visibleReasons.length > 0 ? visibleReasons : ["近い条件"]).map((reason) => (
              <SimilarityReasonChip key={`${match.run.id}-${reason}`} label={reason} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

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
  const currentRun = getRunById(runId ?? defaultRunId) ?? getRunById(defaultRunId) ?? null;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState(currentRun?.comments ?? []);
  const [commentLikeState, setCommentLikeState] = useState<Record<string, boolean>>({});
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
    setCommentLikeState({});
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
  const mainSurfaceClass = embedded
    ? compareOpen
      ? "min-h-full lg:mr-[50vw]"
      : "min-h-full"
    : compareOpen
      ? "fixed inset-y-0 left-0 z-40 overflow-y-auto lg:w-[50vw]"
      : "min-h-screen lg:w-full";

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

  const toggleCommentLike = (commentId: string) => {
    setCommentLikeState((previousState) => ({
      ...previousState,
      [commentId]: !previousState[commentId],
    }));
  };

  return (
    <>
      <main className={`bg-[#212121] text-white/90 transition-[width] duration-300 ${mainSurfaceClass}`}>
        {embedded ? (
          <div className="border-b border-white/10 bg-[#212121]">
            <div className={`header-font mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 py-2 ${forceMobileLayout ? "" : "md:px-6"}`}>
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="一覧へ戻る"
                  className={`${DETAIL_ICON_BUTTON_CLASS} shrink-0`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 5L8 12L15 19" />
                  </svg>
                </button>
              ) : null}
              <div className="min-w-0 text-[16px] font-semibold tracking-tight text-white/92 md:text-[18px]">記録詳細</div>
            </div>
          </div>
        ) : null}
        <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-white/10 bg-[#212121] shadow-[0_1px_0_rgba(255,255,255,0.04)]"}>
          <div className={`header-font mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2 ${forceMobileLayout ? "min-h-[52px]" : "md:px-6 md:py-3"}`}>
            <div className={`flex items-center ${forceMobileLayout ? "gap-3" : "gap-4 md:gap-6"}`}>
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="一覧へ戻る"
                  className={`${DETAIL_ICON_BUTTON_CLASS} shrink-0`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 5L8 12L15 19" />
                  </svg>
                </button>
              ) : null}
              <h1 className={`font-semibold tracking-tight text-white ${forceMobileLayout ? "text-[24px]" : "text-[26px] md:text-[38px]"}`}>精鋭狩りDB</h1>
              <div className="relative">
                <select
                  className={`appearance-none rounded-full border border-white/10 bg-[#272727] py-1.5 pl-3 pr-10 font-medium text-[#d9d9d9] ${forceMobileLayout ? "text-[15px]" : "text-[16px] md:pl-4 md:pr-12 md:text-[20px]"}`}
                  value={headerVersion}
                  onChange={(event) => setHeaderVersion(event.target.value)}
                >
                  {versionOptions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
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
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#272727] text-white ${forceMobileLayout ? "" : "md:h-auto md:w-auto md:gap-2 md:px-5 md:py-2.5 md:text-[20px]"}`}
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
                <div className="text-[16px] font-bold leading-none text-white md:text-[18px]">{currentRun.title}</div>
                <div className={`flex gap-[12px] ${compareOpen ? "flex-col items-start" : "items-center justify-between"}`}>
                  <div className="flex min-w-0 items-center gap-[12px]">
                    <CircleAvatar label={currentRun.userName} size={40} />
                    <div className="truncate text-[16px] font-bold leading-none text-white md:text-[18px]">{currentRun.userName}</div>
                  </div>
                  <div className={`flex gap-[12px] md:gap-[12px] ${compareOpen ? "w-full shrink min-w-0 flex-wrap" : "shrink-0 flex-nowrap"}`}>
                    <PillButton
                      active={liked}
                      onClick={() => setLiked((previous) => !previous)}
                      className={`min-h-[36px] min-w-[92px] ${liked ? "border border-white/10 bg-[#272727] text-white/90 hover:bg-[#303030]" : ""}`}
                    >
                      <LikeIcon filled={liked} className={`h-4 w-4 ${liked ? DETAIL_LIKE_ACTIVE_ICON_CLASS : ""}`} />
                      <span>いいね</span>
                    </PillButton>
                    <PillButton active={shared} onClick={() => setShared((previous) => !previous)} className="min-h-[36px] min-w-[92px]">
                      <ShareIcon className="h-4 w-4" />
                      <span>共有</span>
                    </PillButton>
                  </div>
                </div>
              </div>

              <div className={`w-full ${DETAIL_MUTED_SURFACE_CLASS} p-[12px]`}>
                <div className={`flex gap-[16px] ${compareOpen ? "flex-col items-start whitespace-normal" : "items-center justify-between whitespace-nowrap"}`}>
                  <div className={`flex min-w-0 gap-x-[16px] text-[13px] text-white/74 md:gap-x-[18px] md:text-[14px] ${compareOpen ? "flex-wrap items-center gap-y-[6px]" : "items-center"}`}>
                    <span>ver : {currentRun.versionLabel}</span>
                    <span>{currentRun.postedLabel}</span>
                    <PlatformLabel platform={currentRun.platform} />
                  </div>
                  {canExpandDescription && !descriptionExpanded ? (
                    <button
                      type="button"
                      onClick={() => setDescriptionExpanded((previous) => !previous)}
                      className={`shrink-0 text-right text-white/78 ${forceMobileLayout ? "text-[13px]" : "text-[13px] md:text-[14px]"}`}
                    >
                      ...もっと見る
                    </button>
                  ) : null}
                </div>

                {shouldShowExpandedArea ? (
                  <div className="mt-[12px] space-y-[12px]">
                    <p className={`whitespace-pre-line leading-[1.75] text-white/88 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`} style={descriptionExpanded ? undefined : collapsedCopyStyle}>
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
                  <div className="flex flex-1 items-center justify-between border-b border-white/12 p-[8px] transition focus-within:border-white/30">
                    <input
                      value={commentDraft}
                      onChange={(event) => setCommentDraft(event.target.value)}
                      placeholder="コメントする..."
                      className={`min-w-0 flex-1 border-none bg-transparent text-white outline-none placeholder:text-white/36 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}
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
                      <div className={`flex flex-wrap items-center gap-[8px] text-white/88 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}>
                        <span>{comment.userName}</span>
                        <span className="text-white/42">{comment.postedLabel}</span>
                      </div>
                      <div className={`leading-[1.75] text-white/74 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}>{comment.body}</div>
                      <div className={`flex gap-[12px] md:gap-[12px] ${compareOpen ? "w-full shrink min-w-0 flex-wrap" : "shrink-0 flex-nowrap"}`}>
                        <PillButton className="px-[8px] py-[4px] text-[11px] md:text-[12px]" onClick={() => toggleCommentLike(comment.id)}>
                          <LikeIcon filled={Boolean(commentLikeState[comment.id])} className={`h-3 w-3 ${commentLikeState[comment.id] ? DETAIL_LIKE_ACTIVE_ICON_CLASS : ""}`} />
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
            <SidebarPanel>
              <div className="flex flex-col gap-[16px]">
                <SidebarSectionHeader title="使用編成" meta={`${partyLoadout.length}メンバー`} />
                <div className="flex flex-col gap-[12px]">
                  {partyLoadout.map((entry) => (
                    <LoadoutEntryCard key={`${entry.characterName}-${entry.slot}`} entry={entry} />
                  ))}
                </div>
              </div>
            </SidebarPanel>

            <SidebarPanel>
              <div className="flex flex-col gap-[16px]">
                <SidebarSectionHeader title="類似編成の記録" meta={`${similarRuns.length}件`} />
                {similarRuns.length > 0 ? (
                  <div className="flex flex-col gap-[12px]">
                    {similarRuns.map((match) => {
                      const runState = similarActionState[match.run.id] ?? { liked: false, shared: false };
                      const isOpen = openMenuRunId === match.run.id;
                      const isCompareQueued = compareQueuedRunId === match.run.id;

                      return (
                        <SimilarRunCard
                          key={match.run.id}
                          match={match}
                          liked={runState.liked}
                          shared={runState.shared}
                          isMenuOpen={isOpen}
                          isCompareQueued={isCompareQueued}
                          onToggleMenu={() => setOpenMenuRunId((previous) => (previous === match.run.id ? null : match.run.id))}
                          onAction={(action) => handleSimilarAction(match.run.id, action)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[16px] border border-dashed border-white/14 bg-[#272727] px-[14px] py-[16px] text-[13px] leading-[1.7] text-white/52">
                    近い条件の記録はまだありません。
                  </div>
                )}
              </div>
            </SidebarPanel>
          </aside>
        </div>
      </main>

      <CompareDrawer
        baseIframeRef={mainVideoIframeRef}
        comparedRun={compareRun}
        isOpen={compareOpen}
        syncPlaying={syncPlaying}
        embedded={embedded}
        onClose={() => {
          setCompareQueuedRunId(null);
          setSyncPlaying(false);
        }}
        onToggleSync={() => setSyncPlaying((previous) => !previous)}
      />
    </>
  );
}

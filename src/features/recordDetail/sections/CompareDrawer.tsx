import { useEffect, useRef } from "react";

import type { RunRecord } from "../../../data/mockRuns";
import { PlatformIcon, PauseIcon, PlayIcon } from "../../../components/UiIcons";

import { DETAIL_ICON_BUTTON_CLASS, DETAIL_MUTED_SURFACE_CLASS } from "../recordDetailConfig";
import { getPartyLoadout, postYouTubeCommand } from "../recordDetailLogic";
import {
  CircleAvatar,
  LoadoutEntryCard,
  PlatformLabel,
  SidebarPanel,
  SidebarSectionHeader,
  TagChip,
  VideoFrame,
} from "../ui/recordDetailUi";

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

export function CompareDrawer({
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

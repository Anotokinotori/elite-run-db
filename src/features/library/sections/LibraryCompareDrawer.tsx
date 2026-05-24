import { useEffect, useRef, useState } from "react";

import { PauseIcon, PlayIcon } from "../../../components/UiIcons";
import { Button, IconButton } from "../../../components/ui";
import type { RunRecord } from "../../../data/mockRuns";
import { formatVersionLabel } from "../../../lib/versionLabels";
import { getPartyBuildItems, postYouTubeCommand } from "../../recordDetail/logic";
import {
  CircleAvatar,
  DETAIL_MUTED_SURFACE_CLASS,
  PartyBuildItemCard,
  PlatformLabel,
  SidebarPanel,
  SidebarSectionHeader,
  TagChip,
  VideoFrame,
} from "../../recordDetail/ui";
import { XIcon } from "../ui/searchResultsUi";

export function LibraryCompareDrawer({
  baseRun,
  comparedRun,
  isOpen,
  onClose,
}: {
  baseRun: RunRecord | null;
  comparedRun: RunRecord | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [syncPlaying, setSyncPlaying] = useState(false);
  const baseIframeRef = useRef<HTMLIFrameElement | null>(null);
  const comparedIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSyncPlaying(false);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !baseRun || !comparedRun) {
    return null;
  }

  const toggleSync = () => {
    const nextPlaying = !syncPlaying;
    const command = nextPlaying ? "playVideo" : "pauseVideo";
    setSyncPlaying(nextPlaying);

    window.setTimeout(() => {
      postYouTubeCommand(baseIframeRef.current, command);
      postYouTubeCommand(comparedIframeRef.current, command);
    }, 300);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-[80px] z-40 hidden bg-[#EDECEC] text-[#333333] shadow-[0_-20px_40px_rgba(31,41,55,0.18)] lg:block" aria-modal="false" role="complementary">
      <div className="flex h-full flex-col border-t border-[#e5e7eb]">
        <div className="flex min-h-[52px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4 py-2">
          <div className="min-w-0">
            <div className="text-[18px] font-semibold text-[#111827]">比較ビュー</div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={toggleSync} variant="tonal" size="md" className="h-9 rounded-[42px] px-4 text-[13px]">
              {syncPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              <span>{syncPlaying ? "同期停止" : "同時再生"}</span>
            </Button>
            <IconButton type="button" aria-label="比較ビューを閉じる" onClick={onClose} variant="surface">
              <XIcon className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-[#e5e7eb]">
          <LibraryCompareRunPane run={baseRun} iframeRef={baseIframeRef} label="基準記録" />
          <LibraryCompareRunPane run={comparedRun} iframeRef={comparedIframeRef} label="比較記録" muted />
        </div>
      </div>
    </div>
  );
}

function LibraryCompareRunPane({
  run,
  iframeRef,
  label,
  muted = false,
}: {
  run: RunRecord;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  label: string;
  muted?: boolean;
}) {
  const partyBuildItems = getPartyBuildItems(run);

  return (
    <div className="min-h-0 overflow-y-auto bg-[#EDECEC] px-3 py-3">
      <div className="mb-3 inline-flex rounded-full border border-[#d8dde6] bg-white px-3 py-1 text-[12px] font-black text-[#5f6678]">{label}</div>
      <VideoFrame title={run.title} videoUrl={run.videoUrl} iframeRef={iframeRef} mute={muted} />
      <div className="mt-4 flex flex-col gap-[12px]">
        <div className="text-[18px] font-bold leading-tight text-[#111827]">{run.title}</div>
        <div className="flex items-center justify-between gap-[12px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <CircleAvatar label={run.userName} size={40} />
            <div className="truncate text-[18px] font-bold leading-none text-[#111827]">{run.userName}</div>
          </div>
          <div className="inline-flex shrink-0 items-center gap-[6px] rounded-[42px] border border-[#d8dde6] bg-white px-[10px] py-[5px] text-[13px] text-[#333333]">
            <PlatformLabel platform={run.platform} iconClassName="h-[13px] w-[13px]" />
          </div>
        </div>
        <div className={`w-full ${DETAIL_MUTED_SURFACE_CLASS} p-[12px]`}>
          <div className="flex items-center gap-x-[18px] overflow-x-auto whitespace-nowrap text-[14px] text-[#5f6678]">
            <span>ver : {formatVersionLabel(run.versionLabel)}</span>
            <span>{run.postedLabel}</span>
            <PlatformLabel platform={run.platform} />
          </div>
          <p className="mt-[12px] whitespace-pre-line text-[15px] leading-[1.75] text-[#333333]">{run.summary}</p>
          <div className="mt-[12px] flex flex-wrap gap-[12px]">
            {run.tags.map((tag) => (
              <TagChip key={`${run.id}-${tag}`} tag={tag} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <SidebarPanel>
          <div className="flex flex-col gap-[16px]">
            <SidebarSectionHeader title="使用編成" meta={`${partyBuildItems.length}メンバー`} />
            <div className="flex flex-col gap-[12px]">
              {partyBuildItems.map((entry) => (
                <PartyBuildItemCard key={`${run.id}-${entry.characterName}-${entry.slot}`} entry={entry} />
              ))}
            </div>
          </div>
        </SidebarPanel>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

import type { RunRecord } from "../../../data/mockRuns";
import { CharacterIcon } from "../../../components/CharacterIcon";
import { PlatformIcon } from "../../../components/UiIcons";
import { getYouTubeEmbedUrl } from "../../../lib/youtube";

import { DETAIL_MUTED_SURFACE_CLASS, DETAIL_PANEL_INNER_CLASS, DETAIL_PANEL_SHELL_CLASS } from "../recordDetailConfig";
import { getInitials, parsePlatformTag } from "../recordDetailLogic";
import type { PartyLoadoutEntry } from "../types";

export function CircleAvatar({
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

export function PillButton({
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

export function TinyBadge({ label, highlighted = false }: { label: string; highlighted?: boolean }) {
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

export function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="text-[16px] font-bold leading-none text-white/90 md:text-[18px]">{children}</div>;
}

export function SidebarPanel({ children }: { children: ReactNode }) {
  return (
    <section className={`w-full ${DETAIL_PANEL_SHELL_CLASS}`}>
      <div className={`${DETAIL_PANEL_INNER_CLASS} p-[16px]`}>
        <div className="pointer-events-none absolute -left-[30%] -top-[44%] h-[220px] w-[220px] rounded-full bg-white/18 blur-[72px]" />
        <div className="relative z-[1]">{children}</div>
      </div>
    </section>
  );
}

export function SidebarSectionHeader({ title, meta }: { title: ReactNode; meta?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-[12px]">
      <SectionTitle>{title}</SectionTitle>
      {meta ? <div className="shrink-0 text-[12px] font-medium text-white/52 md:text-[13px]">{meta}</div> : null}
    </div>
  );
}

export function LoadoutEntryCard({ entry }: { entry: PartyLoadoutEntry }) {
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

export function SimilarityReasonChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-[#272727] px-[10px] py-[5px] text-[11px] font-medium leading-none text-white/68 md:text-[12px]">
      {label}
    </span>
  );
}

export function PlatformLabel({
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

export function TagChip({ tag }: { tag: string }) {
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

export function VideoFrame({
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

export { DETAIL_MUTED_SURFACE_CLASS };

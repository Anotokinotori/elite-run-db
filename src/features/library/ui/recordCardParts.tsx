import type { ButtonHTMLAttributes, ReactNode } from "react";

import { CharacterIcon } from "../../../components/CharacterIcon";
import { characterDb, type RunRecord } from "../../../data/mockRuns";
import { getYouTubeThumbnailUrl } from "../../../lib/youtube";
import { formatVersionLabel } from "../../../lib/versionLabels";
import { HOME_BRACKET_ACCENT_COLORS } from "../../home/config";

export function LibraryRecordThumbnail({ run, bracketLabel }: { run: RunRecord; bracketLabel: string }) {
  const thumbnailUrl = getYouTubeThumbnailUrl(run.videoUrl);
  const versionLabel = formatVersionLabel(run.versionLabel || run.season);
  const bracketAccentColor = HOME_BRACKET_ACCENT_COLORS[run.bracket];

  return (
    <div className="relative aspect-video overflow-hidden bg-[#111827]">
      {thumbnailUrl ? <img src={thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" referrerPolicy="no-referrer" /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute left-2.5 top-2.5">
        <BracketBadge color={bracketAccentColor}>{bracketLabel}</BracketBadge>
      </div>
      <div className="absolute bottom-2.5 right-2.5 border border-white/15 bg-black/60 px-2 py-1 text-[9px] font-black uppercase leading-none tracking-[0.08em] text-white/72">
        {run.time}
      </div>
      <div className="absolute bottom-2.5 left-2.5 right-16 min-w-0">
        <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-white/62">
          {versionLabel}
        </p>
      </div>
    </div>
  );
}

export function LibraryCardCharacterStack({ run }: { run: RunRecord }) {
  return (
    <div className="flex shrink-0">
      {run.party.map((member, index) => {
        const characterName = characterDb[member.characterId]?.name ?? member.characterId;
        return (
          <div key={`${run.id}-${member.characterId}`} className={index === 0 ? "relative" : "relative -ml-2"} style={{ zIndex: run.party.length - index }}>
            <CharacterIcon
              characterId={member.characterId}
              alt={characterName}
              fallbackLabel={characterName}
              size={30}
              className="border border-white bg-[#eef1f5] shadow-[0_0_0_1px_rgba(17,24,39,0.08)]"
            />
          </div>
        );
      })}
    </div>
  );
}

export function LibraryRecordInfoBadge({ children }: { children: string }) {
  return (
    <span className="max-w-[76px] truncate border border-[#d8dde6] px-1.5 py-0.5 text-[9px] font-black uppercase leading-none tracking-[0.1em] text-[#7b8493]">
      {children}
    </span>
  );
}

function BracketBadge({ children, color }: { children: string; color: string }) {
  return (
    <span className="max-w-[68px] truncate px-1.5 py-0.5 text-[9px] font-black uppercase leading-none tracking-[0.1em] text-white" style={{ backgroundColor: color }}>
      {children}
    </span>
  );
}

export function LibraryRecordCostMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
      <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">{label}</span>
      <span className="truncate text-[12px] font-black text-[#6b7280]">{value}</span>
    </span>
  );
}

export function LibraryRecordTagPill({ tag }: { tag: string }) {
  return <span className="max-w-full truncate rounded-full bg-[#f0f2f5] px-2 py-0.5 text-[10px] font-bold text-[#6b7280]">#{tag}</span>;
}

export function LibraryRecordActionButton({
  active = false,
  children,
  className,
  disabledTone = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
  disabledTone?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "flex items-center gap-1 transition",
        disabledTone ? "cursor-not-allowed text-[#b8bec8]" : "hover:text-[#111827]",
        active ? "text-[#111827]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

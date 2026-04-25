import { characterDb } from "../../../data/mockRuns";
import { CharacterImage } from "./CharacterImage";
import type { HomeRun } from "../types";

export function TopPlayerCard({
  label,
  run,
  theme,
  onView,
  onSelect,
  actionLabel = "ランキングを見る",
  onAction,
  loadingLabel = "集計中...",
  primaryButtonClass = "inline-flex h-10 items-center justify-center rounded-full border border-[#d8dde6] bg-[#f7f8fa] px-4 text-[13px] font-semibold tracking-[0.01em] text-[#333333] transition-colors hover:border-[#c8ced8] hover:bg-[#eef1f5]",
}: {
  label: string;
  run: HomeRun | null;
  theme: { gradient: string };
  onView: () => void;
  onSelect: (runId: string) => void;
  actionLabel?: string;
  onAction?: () => void;
  loadingLabel?: string;
  primaryButtonClass?: string;
}) {
  if (!run) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white shadow-[0_12px_24px_rgba(31,41,55,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,41,55,0.12)]">
        <div className={`relative h-24 w-full bg-gradient-to-r ${theme.gradient}`}>
          <div className="absolute top-4 left-4 z-10 space-y-1">
            <div className="text-[17px] font-bold leading-tight tracking-[0.01em] text-white drop-shadow-md md:text-[18px]">{label}</div>
          </div>
        </div>
        <div className="relative z-10 flex flex-1 flex-col justify-between gap-4 bg-white p-4 text-[#333333]">
          <div className="text-sm text-[#5f6678]">{loadingLabel}</div>
          <button type="button" onClick={onAction ?? onView} className={`${primaryButtonClass} w-full`}>
            {actionLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white shadow-[0_12px_24px_rgba(31,41,55,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,41,55,0.12)]"
      onClick={() => onSelect(run.id)}
    >
      <div className={`relative h-24 w-full bg-gradient-to-r ${theme.gradient}`}>
        <div className="absolute top-4 left-4 z-10 space-y-1">
          <div className="text-[17px] font-bold leading-tight tracking-[0.01em] text-white drop-shadow-md md:text-[18px]">{label}</div>
          <div className="text-[13px] font-medium text-white/80">{run.userName}</div>
        </div>
        <CharacterImage
          characterId={run.mainAttackerId}
          alt={run.mainAttacker}
          className="pointer-events-none absolute -right-5 -bottom-5 z-0 h-auto w-44 object-cover opacity-85 drop-shadow-lg"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col gap-4 bg-white p-4 text-[#333333]">
        <div className="rounded-[12px] border border-[#eceff3] bg-[#f7f8fa] p-3">
          <div className="flex items-center justify-between gap-2">
            {run.party.map((member, index) => (
              <CharacterImage
                key={`${run.id}-${member.characterId}-${index}`}
                characterId={member.characterId}
                alt={characterDb[member.characterId]?.name ?? member.characterId}
                variant="circle"
                className="h-9 w-9 rounded-full object-cover"
              />
            ))}
          </div>
          <div className="mt-3 text-center text-[24px] font-semibold leading-none text-[#111827]">{run.time}</div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            (onAction ?? onView)();
          }}
          className={`${primaryButtonClass} w-full`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}


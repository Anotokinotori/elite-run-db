import { characterDb, type Bracket } from "../../../data/mockRuns";
import { CharacterImage } from "./CharacterImage";
import { PLATFORM_ICONS, RankMoveIcon } from "./icons";
import { getBracketLabel } from "../logic";
import type { HomeRun, HomeRunWithGroup, LeaderboardView } from "../types";

export function LeaderboardRow({
  run,
  index,
  onSelect,
  view,
}: {
  run: HomeRun | HomeRunWithGroup;
  index: number;
  onSelect: (runId: string) => void;
  view: LeaderboardView;
}) {
  const PlatformIcon = PLATFORM_ICONS[run.platform] ?? PLATFORM_ICONS.PC;
  const displayGroup = view === "char" && "displayGroup" in run ? run.displayGroup : null;
  const highlightedIds = new Set(displayGroup?.ids ?? []);
  const getPartyIconClass = (characterId: string, size: "mobile" | "desktop") => {
    const baseClass = size === "mobile" ? "h-8 w-8 rounded-full object-cover" : "h-9 w-9 rounded-full object-cover";
    if (!displayGroup || !highlightedIds.has(characterId)) {
      return baseClass;
    }

    return `${baseClass} ring-2 ring-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.18)]`;
  };

  return (
    <div className="cursor-pointer border-t border-white/10 py-4 text-white/90" onClick={() => onSelect(run.id)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <div className="flex w-6 items-center justify-center text-white/45">
            <RankMoveIcon move={run.rankMove} className="h-5 w-5" />
          </div>
          <div className="w-9 text-center text-[20px] font-semibold text-white md:w-10 md:text-[22px]">{index + 1}</div>
          <div className="flex shrink-0 items-center gap-1 md:hidden">
            {run.party.map((member, memberIndex) => (
              <CharacterImage
                key={`${run.id}-leaderboard-mobile-party-${member.characterId}-${memberIndex}`}
                characterId={member.characterId}
                alt={characterDb[member.characterId]?.name ?? member.characterId}
                variant="circle"
                className={getPartyIconClass(member.characterId, "mobile")}
              />
            ))}
          </div>
          <div className="hidden shrink-0 items-center gap-1.5 md:flex">
            {run.party.map((member, memberIndex) => (
              <CharacterImage
                key={`${run.id}-leaderboard-party-${member.characterId}-${memberIndex}`}
                characterId={member.characterId}
                alt={characterDb[member.characterId]?.name ?? member.characterId}
                variant="circle"
                className={getPartyIconClass(member.characterId, "desktop")}
              />
            ))}
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-[17px] font-semibold text-white md:text-[19px]">{run.userName}</div>
              {displayGroup ? (
                <div className="hidden max-w-[180px] truncate rounded-full border border-white/14 bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/82 md:inline-flex">
                  {displayGroup.label}
                </div>
              ) : null}
              <div className="hidden rounded-full border border-white/12 bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/72 md:inline-flex">
                {getBracketLabel(run.bracket as Bracket)}
              </div>
            </div>
          </div>
          <div className="ml-auto text-[20px] font-semibold text-white md:hidden">{run.time}</div>
          <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] md:flex">
            <PlatformIcon className="h-[18px] w-[18px] text-white/78" />
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="w-20 text-right text-[22px] font-semibold text-white">{run.time}</div>
        </div>
      </div>
      <div className="mt-2 flex min-w-0 items-center gap-3 md:hidden">
        <div className="w-6 shrink-0" aria-hidden="true" />
        <div className="w-9 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1 truncate text-[15px] font-semibold text-white">{run.userName}</div>
        <div className="flex items-center gap-2">
          {displayGroup ? (
            <div className="max-w-[120px] truncate rounded-full border border-white/14 bg-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-white/82">
              {displayGroup.label}
            </div>
          ) : null}
          <div className="rounded-full border border-white/12 bg-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-white/72">{getBracketLabel(run.bracket as Bracket)}</div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.08]">
            <PlatformIcon className="h-3.5 w-3.5 text-white/78" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { characterDb, type Bracket } from "../../../data/mockRuns";
import { CharacterImage } from "./CharacterImage";
import { RankMoveIcon } from "./icons";
import { getBracketLabel } from "../logic";
import type { HomeRun, HomeRunWithGroup, LeaderboardView } from "../types";

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getLeaderboardStats(run: HomeRun | HomeRunWithGroup) {
  return [
    { label: "DEVICE", value: run.platform },
    { label: "SEASON", value: run.versionLabel || run.season },
    { label: "BRACKET", value: getBracketLabel(run.bracket as Bracket) },
  ];
}

function LeaderboardStatList({ run }: { run: HomeRun | HomeRunWithGroup }) {
  const stats = getLeaderboardStats(run);

  return (
    <div className="grid grid-cols-3 gap-3 text-[11px] leading-tight md:w-max md:grid-cols-[max-content_max-content] md:items-baseline md:justify-self-end md:gap-x-5 md:gap-y-2">
      {stats.map((stat) => (
        <div key={stat.label} className="grid grid-cols-1 gap-1 md:contents">
          <div className="font-medium text-[#848484]">{stat.label}</div>
          <div className="min-w-0 truncate text-[13px] font-bold text-black md:text-[14px]">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

function MobileStatChipList({ run }: { run: HomeRun | HomeRunWithGroup }) {
  return (
    <div className="mt-2 flex min-w-0 flex-wrap gap-1.5">
      {getLeaderboardStats(run).map((stat) => (
        <span key={stat.label} className="max-w-full truncate rounded-full border border-black/10 bg-[#f7f8fa] px-2 py-0.5 text-[10px] font-semibold leading-tight text-[#333333]">
          {stat.value}
        </span>
      ))}
    </div>
  );
}

export function LeaderboardRow({
  run,
  index,
  onSelect,
  view,
  accentColor,
}: {
  run: HomeRun | HomeRunWithGroup;
  index: number;
  onSelect: (runId: string) => void;
  view: LeaderboardView;
  accentColor: string;
}) {
  const isFirst = index === 0;
  const displayGroup = view === "char" && "displayGroup" in run ? run.displayGroup : null;
  const highlightedIds = new Set(displayGroup?.ids ?? []);
  const rank = index + 1;

  const getPartyIconClass = (characterId: string, size: "mobile" | "desktop") => {
    const baseSize =
      size === "mobile"
        ? isFirst
          ? "h-12 w-12 sm:h-[72px] sm:w-[72px]"
          : "h-9 w-9 sm:h-12 sm:w-12"
        : isFirst
          ? "h-20 w-20 lg:h-24 lg:w-24"
          : "h-14 w-14 lg:h-16 lg:w-16";
    const baseClass = isFirst ? `${baseSize} shrink-0 bg-[#f4f4f4] object-cover` : `${baseSize} shrink-0 border border-black/10 bg-[#f4f4f4] object-cover`;

    if (!displayGroup || !highlightedIds.has(characterId)) {
      return baseClass;
    }

    return `${baseClass} ring-2 ring-inset ring-[#111827]`;
  };

  const renderPartyStrip = (size: "mobile" | "desktop") => (
    <div className={classNames("flex min-w-0 items-stretch overflow-hidden", isFirst && "-ml-1")}>
      {isFirst ? <div className="w-1 shrink-0" style={{ backgroundColor: accentColor }} aria-hidden="true" /> : null}
      <div className={classNames("flex min-w-0 items-center", isFirst ? "gap-0 border-y border-r border-black/10 bg-[#f4f4f4]" : "gap-2")}>
        {run.party.map((member, memberIndex) => (
          <CharacterImage
            key={`${run.id}-leaderboard-${size}-party-${member.characterId}-${memberIndex}`}
            characterId={member.characterId}
            alt={characterDb[member.characterId]?.name ?? member.characterId}
            variant="icon"
            className={getPartyIconClass(member.characterId, size)}
          />
        ))}
      </div>
    </div>
  );

  const rankClass = isFirst
    ? "flex h-8 w-14 shrink-0 items-center justify-center text-[24px] font-black leading-none text-black sm:h-10 md:h-12 md:w-16 md:text-[34px]"
    : "flex h-14 w-14 shrink-0 items-center justify-center text-[28px] font-black leading-none text-black md:h-16 md:w-16 md:text-[32px]";

  const mobileRankClass = isFirst
    ? "flex h-9 w-11 shrink-0 items-center justify-center text-[24px] font-black leading-none text-black sm:h-10 sm:w-14"
    : "flex h-10 w-11 shrink-0 items-center justify-center text-[26px] font-black leading-none text-black sm:h-12 sm:w-12 sm:text-[28px]";

  const infoBlock = (
    <div className="min-w-0">
      <div className={classNames("truncate font-black leading-tight text-black", isFirst ? "text-[24px] md:text-[25px]" : "text-[21px]")}>{run.time}</div>
      <div className={classNames("mt-1 truncate font-normal text-black", isFirst ? "text-[15px] md:text-[17px]" : "text-[15px] md:text-[16px]")}>{run.userName}</div>
      {displayGroup ? <div className="mt-3 hidden max-w-full truncate rounded-full border border-black/10 px-2.5 py-1 text-[11px] font-medium text-[#5f6678] md:inline-flex">{displayGroup.label}</div> : null}
    </div>
  );

  return (
    <div
      className={classNames(
        "group cursor-pointer rounded-[8px] bg-white text-black shadow-[0_1px_0_rgba(17,24,39,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(17,24,39,0.10)]",
        isFirst ? "overflow-hidden py-4 pr-4 pl-0 md:py-6 md:pr-6 md:pl-0" : "p-4 md:px-6 md:py-4",
      )}
      onClick={() => onSelect(run.id)}
    >
      <div className="grid min-w-0 grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3 md:hidden">
        <div className="flex shrink-0 flex-col items-center justify-center gap-1">
          <div className={mobileRankClass} style={isFirst ? { backgroundColor: accentColor } : undefined}>
            {rank}
          </div>
          <RankMoveIcon move={run.rankMove} className="h-5 w-5 shrink-0 text-[#8a8a8a]" />
        </div>
        <div className="min-w-0 overflow-hidden">{renderPartyStrip("mobile")}</div>
        <div className="min-w-0">
          <div className={classNames("truncate font-black leading-tight text-black", isFirst ? "text-[22px] sm:text-[24px]" : "text-[20px] sm:text-[21px]")}>{run.time}</div>
          <div className={classNames("mt-0.5 truncate font-normal text-black", isFirst ? "text-[14px] sm:text-[15px]" : "text-[13px] sm:text-[15px]")}>{run.userName}</div>
          <MobileStatChipList run={run} />
        </div>
      </div>

      {isFirst ? (
        <div className="hidden items-center gap-5 md:grid md:grid-cols-[minmax(388px,470px)_24px_minmax(112px,1fr)_max-content] xl:grid-cols-[470px_24px_minmax(190px,1fr)_max-content]">
          <div className="flex min-w-0 items-center">
            <div className={rankClass} style={{ backgroundColor: accentColor }}>
              {rank}
            </div>
            {renderPartyStrip("desktop")}
          </div>
          <div className="flex items-center justify-center text-[#8a8a8a]">
            <RankMoveIcon move={run.rankMove} className="h-5 w-5" />
          </div>
          {infoBlock}
          <LeaderboardStatList run={run} />
        </div>
      ) : (
        <div className="hidden items-center gap-5 md:grid md:grid-cols-[64px_minmax(220px,300px)_24px_minmax(112px,1fr)_max-content] xl:grid-cols-[64px_minmax(260px,300px)_24px_minmax(180px,1fr)_max-content]">
          <div className={rankClass}>{rank}</div>
          {renderPartyStrip("desktop")}
          <div className="flex items-center justify-center text-[#8a8a8a]">
            <RankMoveIcon move={run.rankMove} className="h-5 w-5" />
          </div>
          {infoBlock}
          <LeaderboardStatList run={run} />
        </div>
      )}
    </div>
  );
}

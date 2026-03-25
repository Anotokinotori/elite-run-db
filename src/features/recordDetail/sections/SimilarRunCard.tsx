import type { SimilarRunMatch } from "../../../lib/getSimilarRuns";
import { characterDb } from "../../../data/mockRuns";
import { CharacterIcon } from "../../../components/CharacterIcon";
import { CompareViewIcon, LikeIcon, ShareIcon } from "../../../components/UiIcons";

import { DETAIL_ICON_BUTTON_CLASS, DETAIL_LIKE_ACTIVE_ICON_CLASS } from "../recordDetailConfig";
import { PlatformLabel, SimilarityReasonChip } from "../ui/recordDetailUi";

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

export function SimilarRunCard({
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
                <span className="max-w-full truncate font-medium text-white/78">{match.run.userName}</span>
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
              <div key={`${match.run.id}-${reason}`} className="max-w-full truncate">
                <SimilarityReasonChip label={reason} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

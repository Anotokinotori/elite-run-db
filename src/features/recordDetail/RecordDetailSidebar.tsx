import type { SimilarRunMatch } from "../../lib/getSimilarRuns";

import { LoadoutEntryCard, SidebarPanel, SidebarSectionHeader } from "./recordDetailUi";
import { SimilarRunCard } from "./SimilarRunCard";
import type { PartyLoadoutEntry, SimilarActionState } from "./types";

export function RecordDetailSidebar({
  compareOpen,
  partyLoadout,
  similarRuns,
  similarActionState,
  openMenuRunId,
  compareQueuedRunId,
  onToggleMenu,
  onAction,
}: {
  compareOpen: boolean;
  partyLoadout: PartyLoadoutEntry[];
  similarRuns: SimilarRunMatch[];
  similarActionState: SimilarActionState;
  openMenuRunId: string | null;
  compareQueuedRunId: string | null;
  onToggleMenu: (runId: string) => void;
  onAction: (runId: string, action: "like" | "share" | "compare") => void;
}) {
  return (
    <aside className={`flex w-full shrink-0 flex-col gap-[18px] ${compareOpen ? "lg:w-full xl:w-full" : "lg:w-[304px] xl:w-[316px]"}`}>
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
                    onToggleMenu={() => onToggleMenu(match.run.id)}
                    onAction={(action) => onAction(match.run.id, action)}
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
  );
}

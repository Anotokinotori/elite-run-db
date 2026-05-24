import type { SimilarRunMatch } from "../../../lib/getSimilarRuns";

import { PartyBuildItemCard, SidebarPanel, SidebarSectionHeader } from "../ui";
import { SimilarRunCard } from "./SimilarRunCard";
import type { PartyBuildItem, SimilarActionState } from "../types";

export function Sidebar({
  compareOpen,
  partyBuildItems,
  similarRuns,
  similarActionState,
  openMenuRunId,
  selectedCompareRunId,
  onToggleMenu,
  onAction,
  onSelectRun,
}: {
  compareOpen: boolean;
  partyBuildItems: PartyBuildItem[];
  similarRuns: SimilarRunMatch[];
  similarActionState: SimilarActionState;
  openMenuRunId: string | null;
  selectedCompareRunId: string | null;
  onToggleMenu: (runId: string) => void;
  onAction: (runId: string, action: "like" | "share" | "compare") => void;
  onSelectRun?: (runId: string) => void;
}) {
  return (
    <aside className={`flex w-full shrink-0 flex-col gap-[18px] ${compareOpen ? "lg:w-full xl:w-full" : "lg:w-[304px] xl:w-[316px]"}`}>
      <SidebarPanel>
        <div className="flex flex-col gap-[16px]">
          <SidebarSectionHeader title="使用編成" meta={`${partyBuildItems.length}メンバー`} />
          <div className="flex flex-col gap-[12px]">
            {partyBuildItems.map((entry) => (
              <PartyBuildItemCard key={`${entry.characterName}-${entry.slot}`} entry={entry} />
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
                const isCompareSelected = selectedCompareRunId === match.run.id;

                return (
                  <SimilarRunCard
                    key={match.run.id}
                    match={match}
                    liked={runState.liked}
                    shared={runState.shared}
                    isMenuOpen={isOpen}
                    isCompareSelected={isCompareSelected}
                    onToggleMenu={() => onToggleMenu(match.run.id)}
                    onAction={(action) => onAction(match.run.id, action)}
                    onOpenDetail={onSelectRun ? () => onSelectRun(match.run.id) : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-[16px] border border-dashed border-[#d8dde6] bg-[#FFFCF9] px-[14px] py-[16px] text-[13px] leading-[1.7] text-[#8d93a3]">
              近い条件の記録はまだありません。
            </div>
          )}
        </div>
      </SidebarPanel>
    </aside>
  );
}

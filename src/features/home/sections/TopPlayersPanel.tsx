import type { Bracket } from "../../../data/mockRuns";
import { HOME_BUTTON_CLASSES, HOME_LABELS, HOME_PANEL_CLASSES, HOME_TOP_PLAYER_BRACKETS } from "../homeConfig";
import { getBestRun } from "../homeLogic";
import { TopPlayerCard } from "../ui/TopPlayerCard";
import type { HomeRun } from "../types";

type TopPlayersPanelProps = {
  panelKey: string;
  heroRuns: HomeRun[];
  onViewBracket: (bracket: Bracket) => void;
  onSelectRun: (runId: string) => void;
};

export function TopPlayersPanel({ panelKey, heroRuns, onViewBracket, onSelectRun }: TopPlayersPanelProps) {
  return (
    <div key={panelKey} data-top-panel className={`${HOME_PANEL_CLASSES.sectionPanel} min-w-[820px] flex-shrink-0`}>
      <div className={HOME_PANEL_CLASSES.reflectionTop} />
      <div className={HOME_PANEL_CLASSES.reflectionCorner} />
      <div className={`${HOME_PANEL_CLASSES.sectionPanelInner} p-5`}>
        <div className={`${HOME_PANEL_CLASSES.sectionTitle} mb-4`}>{HOME_LABELS.topPlayersLabel}</div>
        <div className="grid min-w-[860px] grid-cols-4 gap-5">
          {HOME_TOP_PLAYER_BRACKETS.map((item) => {
            const topRun = getBestRun(heroRuns.filter((run) => run.bracket === item.bracket));

            return (
              <TopPlayerCard
                key={item.label}
                label={item.label}
                run={topRun}
                theme={item.theme}
                onView={() => onViewBracket(item.bracket)}
                onSelect={onSelectRun}
                primaryButtonClass={HOME_BUTTON_CLASSES.primary}
                loadingLabel={HOME_LABELS.loadingLabel}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}


import type { Bracket } from "../../../data/mockRuns";
import { HOME_BUTTON_CLASSES, HOME_LABELS, HOME_PANEL_CLASSES } from "../config";
import { TopPlayerCard } from "../ui/TopPlayerCard";
import type { HomeFeaturedCard } from "../types";

type FeaturedPlayersPanelProps = {
  panelKey: string;
  featuredCards: HomeFeaturedCard[];
  onViewBracket: (bracket: Bracket) => void;
  onSelectRun: (runId: string) => void;
};

export function FeaturedPlayersPanel({ panelKey, featuredCards, onViewBracket, onSelectRun }: FeaturedPlayersPanelProps) {
  return (
    <div key={panelKey} data-top-panel className={`${HOME_PANEL_CLASSES.featuredPanel} min-w-[860px] flex-shrink-0 self-stretch`}>
      <div className={HOME_PANEL_CLASSES.reflectionTop} />
      <div className={HOME_PANEL_CLASSES.reflectionCorner} />
      <div className={`${HOME_PANEL_CLASSES.featuredPanelInner} flex h-full flex-col p-5`}>
        <div className={`${HOME_PANEL_CLASSES.sectionTitle} mb-4`}>{HOME_LABELS.featuredPlayersLabel}</div>
        <div className="grid flex-1 min-w-[820px] grid-cols-4 gap-4">
          {featuredCards.map((item) => {
            const featuredRun = item.run;

            return (
              <TopPlayerCard
                key={item.key}
                label={item.title}
                run={featuredRun}
                theme={item.theme}
                onView={() => {
                  if (!featuredRun) {
                    return;
                  }

                  onViewBracket(featuredRun.bracket);
                }}
                onSelect={onSelectRun}
                actionLabel={item.actionLabel}
                onAction={
                  item.action === "detail" && featuredRun
                    ? () => {
                        onSelectRun(featuredRun.id);
                      }
                    : undefined
                }
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


import type { Bracket } from "../../../data/mockRuns";
import { HOME_FEATURED_ACCENT_COLOR, HOME_LABELS } from "../config";
import { PlayerBlockPanel, type PlayerBlockItem } from "../ui/PlayerBlockPanel";
import type { HomeFeaturedCard } from "../types";
import { formatHomePanelUpdatedLabel } from "../viewData";

type FeaturedPlayersPanelProps = {
  panelKey: string;
  featuredCards: HomeFeaturedCard[];
  onViewBracket: (bracket: Bracket) => void;
  onSelectRun: (runId: string) => void;
};

export function FeaturedPlayersPanel({ panelKey, featuredCards, onViewBracket, onSelectRun }: FeaturedPlayersPanelProps) {
  const items: PlayerBlockItem[] = featuredCards.map((item) => {
    const featuredRun = item.run;

    return {
      key: item.key,
      label: item.title,
      run: featuredRun,
      accentColor: HOME_FEATURED_ACCENT_COLOR,
      actionLabel: item.actionLabel,
      actionDisabled: !featuredRun,
      onAction: () => {
        if (!featuredRun) {
          return;
        }

        if (item.action === "detail") {
          onSelectRun(featuredRun.id);
          return;
        }

        onViewBracket(featuredRun.bracket);
      },
    };
  });

  return (
    <PlayerBlockPanel
      panelKey={panelKey}
      heading={HOME_LABELS.featuredPlayersLabel}
      badge="PICK UP"
      updatedLabel={formatHomePanelUpdatedLabel(items.map((item) => item.run))}
      items={items}
      loadingLabel={HOME_LABELS.loadingLabel}
      onSelectRun={onSelectRun}
    />
  );
}

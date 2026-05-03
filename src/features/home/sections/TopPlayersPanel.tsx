import type { Bracket } from "../../../data/mockRuns";
import { HOME_BRACKET_ACCENT_COLORS, HOME_LABELS, HOME_TOP_PLAYER_BRACKETS } from "../config";
import { getBestRun } from "../logic";
import { PlayerBlockPanel, type PlayerBlockItem } from "../ui/PlayerBlockPanel";
import type { HomeRun } from "../types";
import { formatHomePanelUpdatedLabel } from "../viewData";

type TopPlayersPanelProps = {
  panelKey: string;
  heroRuns: HomeRun[];
  onViewBracket: (bracket: Bracket) => void;
  onSelectRun: (runId: string) => void;
};

const TOP_PLAYER_LABELS: Record<Bracket, string> = {
  4: "Unlimited",
  3: "High",
  2: "Middle",
  1: "Low",
};

export function TopPlayersPanel({ panelKey, heroRuns, onViewBracket, onSelectRun }: TopPlayersPanelProps) {
  const items: PlayerBlockItem[] = HOME_TOP_PLAYER_BRACKETS.map((item) => {
    const topRun = getBestRun(heroRuns.filter((run) => run.bracket === item.bracket));

    return {
      key: item.label,
      label: TOP_PLAYER_LABELS[item.bracket],
      run: topRun,
      accentColor: HOME_BRACKET_ACCENT_COLORS[item.bracket],
      actionLabel: HOME_LABELS.viewRankingLabel,
      onAction: () => onViewBracket(item.bracket),
    };
  });

  return (
    <PlayerBlockPanel
      panelKey={panelKey}
      heading={HOME_LABELS.topPlayersLabel}
      badge="RANKING"
      updatedLabel={formatHomePanelUpdatedLabel(items.map((item) => item.run))}
      items={items}
      loadingLabel={HOME_LABELS.loadingLabel}
      onSelectRun={onSelectRun}
    />
  );
}

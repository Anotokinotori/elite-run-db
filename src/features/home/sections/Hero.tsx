type HeroProps = {
  heroImageUrl: string;
  subHeaderTab: string;
  isOtherMenuOpen: boolean;
  primaryRulesetTabs: readonly string[];
  otherTabLabel: string;
  otherRulesetLabels: readonly string[];
  onSelectTab: (tab: string) => void;
  onToggleOtherMenu: () => void;
  onCloseOtherMenu: () => void;
};

export function Hero({
  heroImageUrl,
  subHeaderTab,
  isOtherMenuOpen,
  primaryRulesetTabs,
  otherTabLabel,
  otherRulesetLabels,
  onSelectTab,
  onToggleOtherMenu,
  onCloseOtherMenu,
}: HeroProps) {
  return (
    <div
      className="relative w-full h-[320px] md:h-[560px] overflow-hidden mb-8 bg-center bg-cover"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
      aria-label="Hero visual"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#212121]" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/15 backdrop-blur-sm rounded-full border border-white/30 px-4 py-2">
        <div className="flex items-center justify-between text-sm font-medium text-white">
          {[...primaryRulesetTabs, otherTabLabel].map((label) => {
            const isOther = label === otherTabLabel;
            const isOtherSelected = isOther && !primaryRulesetTabs.includes(subHeaderTab);
            const buttonLabel = isOtherSelected ? `${otherTabLabel}（${subHeaderTab}）` : label;
            const isActive = isOtherSelected || subHeaderTab === label;

            return (
              <div key={label} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (isOther) {
                      onToggleOtherMenu();
                    } else {
                      onSelectTab(label);
                      onCloseOtherMenu();
                    }
                  }}
                  className={`py-1 px-4 md:px-5 -mx-2 transition-colors ${isActive ? "border-b-2 border-white" : "text-white/80 hover:text-white"}`}
                >
                  {buttonLabel}
                </button>
                {isOther && isOtherMenuOpen ? (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-black/80 border border-[#dcdfe6] rounded-lg py-2 w-40 text-white text-xs">
                    {otherRulesetLabels.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          onSelectTab(option);
                          onCloseOtherMenu();
                        }}
                        className="block w-full text-left px-3 py-1.5 hover:bg-white/10"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

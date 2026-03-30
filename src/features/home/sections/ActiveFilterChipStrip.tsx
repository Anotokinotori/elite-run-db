import type { ActiveFilterChipViewData } from "../types";

type ActiveFilterChipStripProps = {
  chips: ActiveFilterChipViewData[];
  onRemove: (chip: ActiveFilterChipViewData) => void;
};

export function ActiveFilterChipStrip({ chips, onRemove }: ActiveFilterChipStripProps) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <>
      <p className="ml-3 mr-2 text-[14px] font-medium text-white/42">{"\uFF1A"}</p>
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-colors ${
              chip.isExclude
                ? "border border-[#6e4a4a] text-white/76 hover:bg-[#3a2626]"
                : "border border-white/12 text-white/78 hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => onRemove(chip)}
          >
            <span>{chip.displayLabel}</span>
            <span className="text-[12px] leading-none">{`\u00D7`}</span>
          </button>
        ))}
      </div>
    </>
  );
}

import { characterDb, weaponDb } from '../../../../../data/mockRuns';
import type { CharacterSummaryGroup, CharacterSummaryTarget, WeaponSummaryTarget } from '../../../types';
import { UI } from '../config';

function filterChipClass(isExclude: boolean) {
  return [
    "inline-flex h-8 max-w-full items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-colors",
    isExclude
      ? "border border-[#efc9b0] bg-[#fff7f2] text-[#b6611e] hover:bg-[#fbf1ea]"
      : "border border-[#8fc7d8] bg-[#eef9fc] text-[#357f91] hover:bg-[#e4f5fa]",
  ].join(" ");
}

export function CombinedCharacterSummaryBox({
  title,
  includeIds,
  excludeIds,
  group,
  onRemove,
}: {
  title: string;
  includeIds: string[];
  excludeIds: string[];
  group: CharacterSummaryGroup;
  onRemove: (group: CharacterSummaryGroup, target: CharacterSummaryTarget, characterId: string) => void;
}) {
  const entries = [...includeIds.map((id) => ({ id, target: "include" as const })), ...excludeIds.map((id) => ({ id, target: "exclude" as const }))];

  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {entries.length > 0 ? (
          entries.map(({ id, target }) => {
            const isExclude = target === "exclude";
            return (
              <button key={`${target}-${id}`} type="button" onClick={() => onRemove(group, target, id)} className={filterChipClass(isExclude)}>
                <span className="shrink-0 text-[10px] font-black">{isExclude ? "除外" : "含む"}</span>
                <span className="truncate">{characterDb[id]?.name ?? id}</span>
                <span className="text-[12px] leading-none">×</span>
              </button>
            );
          })
        ) : (
          <span className="text-[12px] font-bold text-[#999999]">未指定</span>
        )}
      </div>
    </section>
  );
}

export function CombinedWeaponSummaryBox({ includeIds, excludeIds, onRemove }: { includeIds: string[]; excludeIds: string[]; onRemove: (target: WeaponSummaryTarget, weaponId: string) => void }) {
  const entries = [...includeIds.map((id) => ({ id, target: "include" as const })), ...excludeIds.map((id) => ({ id, target: "exclude" as const }))];

  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">武器条件</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {entries.length > 0 ? (
          entries.map(({ id, target }) => {
            const isExclude = target === "exclude";
            const weapon = weaponDb[id];
            return (
              <button key={`${target}-${id}`} type="button" onClick={() => onRemove(target, id)} className={filterChipClass(isExclude)}>
                <span className="shrink-0 text-[10px] font-black">{isExclude ? "除外" : "含む"}</span>
                <span className="truncate">{weapon?.name ?? id}</span>
                <span className="text-[12px] leading-none">×</span>
              </button>
            );
          })
        ) : (
          <span className="text-[12px] font-bold text-[#999999]">未指定</span>
        )}
      </div>
    </section>
  );
}


import { useEffect, useMemo, useState } from 'react';

import { WeaponIcon } from '../../../../../components/WeaponIcon';
import { selectableWeapons, type WeaponClass, type WeaponTier } from '../../../../../data/mockRuns';
import { SearchIcon } from '../../../../home/ui/icons';
import { cloneLibraryBuildFilterState } from '../../../logic/searchFilters';
import type { LibraryBuildFilterState, WeaponSummaryTarget } from '../../../types';
import { WEAPON_CLASS_FILTER_OPTIONS, WEAPON_TIER_FILTER_OPTIONS } from '../config';
import { LibraryModalFrame } from './LibraryModalFrame';
import { CombinedWeaponSummaryBox } from './ModalShared';

export function LibraryWeaponFilterModal({
  title,
  initialFilters,
  onClose,
  onApply,
}: {
  title: string;
  initialFilters: LibraryBuildFilterState;
  onClose: () => void;
  onApply: (filters: LibraryBuildFilterState) => void;
}) {
  const [draft, setDraft] = useState<LibraryBuildFilterState>(() => cloneLibraryBuildFilterState(initialFilters));
  const [activeTarget, setActiveTarget] = useState<WeaponSummaryTarget>("include");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<(typeof WEAPON_CLASS_FILTER_OPTIONS)[number]["key"]>("all");
  const [tierFilter, setTierFilter] = useState<(typeof WEAPON_TIER_FILTER_OPTIONS)[number]["key"]>("all");

  useEffect(() => {
    setDraft(cloneLibraryBuildFilterState(initialFilters));
    setActiveTarget("include");
    setQuery("");
    setClassFilter("all");
    setTierFilter("all");
  }, [initialFilters]);

  const filteredWeapons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return selectableWeapons.filter((weapon) => {
      const matchesClass = classFilter === "all" || weapon.weaponClass === classFilter;
      const matchesTier = tierFilter === "all" || weapon.tier === tierFilter;
      const matchesQuery = normalizedQuery.length === 0 || weapon.name.toLowerCase().includes(normalizedQuery) || weapon.id.toLowerCase().includes(normalizedQuery) || weapon.shortLabel.toLowerCase().includes(normalizedQuery);
      return matchesClass && matchesTier && matchesQuery;
    });
  }, [classFilter, query, tierFilter]);

  const toggleWeapon = (weaponId: string) => {
    const oppositeTarget = activeTarget === "include" ? "exclude" : "include";
    setDraft((current) => {
      const exists = current.weaponIds[activeTarget].includes(weaponId);
      return {
        ...current,
        weaponIds: {
          ...current.weaponIds,
          [activeTarget]: exists ? current.weaponIds[activeTarget].filter((id) => id !== weaponId) : [...current.weaponIds[activeTarget], weaponId],
          [oppositeTarget]: current.weaponIds[oppositeTarget].filter((id) => id !== weaponId),
        },
      };
    });
  };

  const removeWeapon = (target: WeaponSummaryTarget, weaponId: string) => {
    setDraft((current) => ({
      ...current,
      weaponIds: {
        ...current.weaponIds,
        [target]: current.weaponIds[target].filter((id) => id !== weaponId),
      },
    }));
  };

  const reset = () => {
    setDraft((current) => ({ ...current, weaponIds: { include: [], exclude: [] } }));
    setActiveTarget("include");
    setQuery("");
    setClassFilter("all");
    setTierFilter("all");
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={reset} onApply={() => onApply(cloneLibraryBuildFilterState(draft))}>
      <section className="rounded-[18px] border border-[#e5e7eb] bg-[#f7f8fa] p-4">
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="flex items-center overflow-hidden rounded-full border border-[#d8dde6] bg-[#edf1f5]">
              {(["include", "exclude"] as const).map((target) => (
                <button key={target} type="button" className={`flex-1 px-5 py-2 text-[13px] font-semibold transition-colors ${activeTarget === target ? "bg-[#111827] text-white" : "bg-transparent text-[#5f6678] hover:bg-white hover:text-[#111827]"}`} onClick={() => setActiveTarget(target)}>
                  {target === "include" ? "含める" : "除外する"} {draft.weaponIds[target].length}
                </button>
              ))}
            </div>
            <CombinedWeaponSummaryBox includeIds={draft.weaponIds.include} excludeIds={draft.weaponIds.exclude} onRemove={removeWeapon} />
          </div>
          <div className="min-w-0 space-y-3">
            <label className="relative block">
              <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d93a3]" />
              <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="武器名 / ID / 略称で検索" className="h-11 w-full rounded-[14px] border border-[#d8dde6] bg-white pl-11 pr-4 text-[14px] text-[#333333] placeholder:text-[#8d93a3] outline-none transition-colors focus:border-[#9aa7ba]" />
            </label>
            <div className="flex flex-wrap gap-2">
              {WEAPON_CLASS_FILTER_OPTIONS.map((option) => (
                <button key={option.key} type="button" onClick={() => setClassFilter(option.key)} className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${classFilter === option.key ? "border-transparent bg-[#111827] text-white" : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]"}`}>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {WEAPON_TIER_FILTER_OPTIONS.map((option) => (
                <button key={option.key} type="button" onClick={() => setTierFilter(option.key)} className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${tierFilter === option.key ? "border-transparent bg-[#111827] text-white" : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]"}`}>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="max-h-[430px] overflow-y-auto rounded-[16px] bg-white p-3">
              {filteredWeapons.length === 0 ? (
                <div className="grid min-h-[220px] place-items-center text-center text-[14px] text-[#7b7b8d]">条件に一致する武器がありません。</div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {filteredWeapons.map((weapon) => {
                    const isInclude = draft.weaponIds.include.includes(weapon.id);
                    const isExclude = draft.weaponIds.exclude.includes(weapon.id);
                    const isActive = activeTarget === "include" ? isInclude : isExclude;
                    return (
                      <button key={weapon.id} type="button" onClick={() => toggleWeapon(weapon.id)} className={`relative rounded-[16px] border bg-white p-4 text-left transition hover:-translate-y-[1px] ${isActive ? "border-[#0f1419] shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : "border-[#edf0f4]"}`}>
                        <div className="flex items-start gap-3">
                          <WeaponIcon imageUrl={weapon.imageUrl} alt={weapon.name} fallbackLabel={weapon.shortLabel} size={58} className="rounded-[14px] p-1.5" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getWeaponTierBadgeClass(weapon.tier)}`}>{formatWeaponTierLabel(weapon.tier)}</div>
                              <div className="text-[12px] text-[#7b7b8d]">{formatWeaponClassLabel(weapon.weaponClass)}</div>
                            </div>
                            <div className="mt-2 text-[14px] font-semibold text-black">{weapon.name}</div>
                            <div className="mt-1 text-[12px] text-[#7b7b8d]">{weapon.id}</div>
                          </div>
                        </div>
                        {isInclude || isExclude ? (
                          <span className={["absolute right-2 top-2 flex h-6 items-center rounded-full px-2 text-[11px] font-bold text-white", isExclude ? "bg-[#c27642]" : "bg-[#6bbbd0]"].join(" ")}>
                            {isExclude ? "除外" : "含む"}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </LibraryModalFrame>
  );
}

function formatWeaponClassLabel(weaponClass: WeaponClass) {
  return WEAPON_CLASS_FILTER_OPTIONS.find((option) => option.key === weaponClass)?.label ?? weaponClass;
}

function formatWeaponTierLabel(tier: WeaponTier) {
  return WEAPON_TIER_FILTER_OPTIONS.find((option) => option.key === tier)?.label ?? tier;
}

function getWeaponTierBadgeClass(tier: WeaponTier) {
  switch (tier) {
    case "five_star":
      return "bg-[#fff1d8] text-[#9a5a00]";
    case "four_star":
      return "bg-[#f0e8ff] text-[#6b3faf]";
    case "three_star":
      return "bg-[#edf1ff] text-[#335da6]";
    case "two_star":
      return "bg-[#eef3f6] text-[#546270]";
    case "one_star":
      return "bg-[#f2f2f2] text-[#6d6d7d]";
  }
}

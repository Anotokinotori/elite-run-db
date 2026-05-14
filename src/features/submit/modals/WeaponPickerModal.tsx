import { useEffect, useMemo, useState } from "react";

import { WeaponIcon } from "../../../components/WeaponIcon";
import { ModalFrame } from "../../../components/ui";
import type { WeaponClass, WeaponTier } from "../../../data/mockRuns";

import { WEAPON_OPTIONS } from "../config";

const WEAPON_CLASS_FILTER_OPTIONS = [
  { key: "all", label: "すべて" },
  { key: "sword", label: "片手剣" },
  { key: "claymore", label: "両手剣" },
  { key: "polearm", label: "長柄武器" },
  { key: "bow", label: "弓" },
  { key: "catalyst", label: "法器" },
] as const;

const WEAPON_TIER_FILTER_OPTIONS = [
  { key: "all", label: "すべて" },
  { key: "five_star", label: "★5" },
  { key: "four_star", label: "★4" },
  { key: "three_star", label: "★3" },
  { key: "two_star", label: "★2" },
  { key: "one_star", label: "★1" },
] as const;

function formatWeaponClassLabel(weaponClass: WeaponClass) {
  switch (weaponClass) {
    case "sword":
      return "片手剣";
    case "claymore":
      return "両手剣";
    case "polearm":
      return "長柄武器";
    case "bow":
      return "弓";
    case "catalyst":
      return "法器";
  }
}

function formatWeaponTierLabel(tier: WeaponTier) {
  switch (tier) {
    case "five_star":
      return "★5";
    case "four_star":
      return "★4";
    case "three_star":
      return "★3";
    case "two_star":
      return "★2";
    case "one_star":
      return "★1";
  }
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

export function WeaponPickerModal({
  isOpen,
  activeWeaponId,
  options,
  compatibleWeaponClass,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  activeWeaponId: string;
  options: typeof WEAPON_OPTIONS;
  compatibleWeaponClass: WeaponClass | null;
  onClose: () => void;
  onSelect: (weaponId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<(typeof WEAPON_CLASS_FILTER_OPTIONS)[number]["key"]>("all");
  const [tierFilter, setTierFilter] = useState<(typeof WEAPON_TIER_FILTER_OPTIONS)[number]["key"]>("all");
  const effectiveClassFilter = compatibleWeaponClass ?? classFilter;

  const filteredWeapons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return options.filter((weapon) => {
      const matchesClass = effectiveClassFilter === "all" || weapon.weaponClass === effectiveClassFilter;
      const matchesTier = tierFilter === "all" || weapon.tier === tierFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        weapon.name.toLowerCase().includes(normalizedQuery) ||
        weapon.id.toLowerCase().includes(normalizedQuery) ||
        weapon.shortLabel.toLowerCase().includes(normalizedQuery);

      return matchesClass && matchesTier && matchesQuery;
    });
  }, [effectiveClassFilter, options, query, tierFilter]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery("");
    setClassFilter(compatibleWeaponClass ?? "all");
    setTierFilter("all");
  }, [compatibleWeaponClass, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalFrame
      onClose={onClose}
      title="武器選択"
      description="Step 2 の現在スロットに設定する武器を選択します。現在のキャラに合う武器種から優先表示します。"
      className="h-[720px] max-w-[760px]"
    >

        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4">
          {compatibleWeaponClass ? (
            <div className="rounded-[14px] bg-[#f6f7f9] px-4 py-3 text-[13px] leading-[1.6] text-[#545468]">
              {`現在のキャラに合わせて「${formatWeaponClassLabel(compatibleWeaponClass)}」のみ表示しています。`}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="武器名 / ID / 略称で検索"
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#0f1419]"
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] font-medium text-black"
            >
              クリア
            </button>
          </div>

          {compatibleWeaponClass ? null : (
            <div className="flex flex-wrap gap-2">
              {WEAPON_CLASS_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setClassFilter(option.key)}
                  className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                    classFilter === option.key ? "bg-[#0f1419] text-white" : "bg-[#f2f2f2] text-[#545468]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {WEAPON_TIER_FILTER_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setTierFilter(option.key)}
                className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                  tierFilter === option.key ? "bg-[#0f1419] text-white" : "bg-[#f2f2f2] text-[#545468]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-[16px] bg-[#f6f7f9] p-3">
            {filteredWeapons.length === 0 ? (
              <div className="grid h-full min-h-[240px] place-items-center text-center text-[14px] text-[#7b7b8d]">
                条件に一致する武器がありません。
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredWeapons.map((weapon) => {
                  const isActive = weapon.id === activeWeaponId;

                  return (
                    <button
                      key={weapon.id}
                      type="button"
                      onClick={() => onSelect(weapon.id)}
                      className={`rounded-[16px] border bg-white p-4 text-left transition hover:-translate-y-[1px] ${
                        isActive ? "border-[#0f1419] shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : "border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <WeaponIcon
                          imageUrl={weapon.imageUrl}
                          alt={weapon.name}
                          fallbackLabel={weapon.shortLabel}
                          size={64}
                          className="rounded-[14px] p-1.5"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getWeaponTierBadgeClass(weapon.tier)}`}>
                              {formatWeaponTierLabel(weapon.tier)}
                            </div>
                            <div className="text-[12px] text-[#7b7b8d]">{formatWeaponClassLabel(weapon.weaponClass)}</div>
                          </div>

                          <div className="mt-2 text-[15px] font-semibold text-black">{weapon.name}</div>
                          <div className="mt-1 text-[12px] text-[#7b7b8d]">{weapon.id}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
    </ModalFrame>
  );
}

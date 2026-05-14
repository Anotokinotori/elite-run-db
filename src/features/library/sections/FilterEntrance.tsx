import { useEffect, useId, useMemo, useState, type CSSProperties, type Dispatch, type ReactNode, type SetStateAction } from "react";

import { CharacterIcon } from "../../../components/CharacterIcon";
import { WeaponIcon } from "../../../components/WeaponIcon";
import { appRuns } from "../../../data/appRuns";
import {
  type Element,
  characterDb,
  selectableCharacters,
  selectableWeapons,
  weaponDb,
  type WeaponClass,
  type WeaponTier,
} from "../../../data/mockRuns";
import { formatVersionLabel, versionRank } from "../../../lib/versionLabels";
import { HOME_ELEMENT_FILTER_OPTIONS, HOME_FILTER_TAG_GROUP_DEFINITIONS, HOME_FILTER_TARGET_OPTIONS } from "../../home/config";
import { cloneHomeFilterState, createEmptyHomeFilterState, updateSelectionGroup } from "../../home/logic";
import type { CharacterFilterTabKey, HomeFilterState, SelectionTarget } from "../../home/types";
import { FilterDrawer } from "../../home/ui/FilterDrawer";
import { SearchIcon } from "../../home/ui/icons";
import categoryPeriodImageUrl from "../assets/library-category-period.png";
import { LIBRARY_FILTER_PANELS, LIBRARY_LABELS } from "../config";
import { useLibraryFilterEntrance } from "../hooks/useLibraryFilterEntrance";
import type { LibraryFilterRestoreRequest } from "../logic/actionStorage";
import {
  cloneLibraryBuildFilterState,
  cloneLibraryCategoryFilterState,
  createEmptyLibraryBuildFilterState,
  createEmptyLibraryCategoryFilterState,
  isSearchFilterPanel,
  isSelectableFilterPanel,
} from "../logic/searchFilters";
import {
  LIBRARY_BUILD_RANGE_LIMITS as BUILD_RANGE_LIMITS,
  type CharacterSummaryGroup,
  type CharacterSummaryTarget,
  type LibraryBuildFilterState,
  type LibraryBuildFilterTab,
  type LibraryCategoryFilterState,
  type LibraryFilterKey,
  type LibraryFilterPanel,
  type LibrarySearchFilters,
  type NumericRange,
  type SearchFilterPanel,
  type SelectableFilterKey,
  type SelectableFilterPanel,
  type WeaponSummaryTarget,
} from "../types";

const CHARACTER_FILTER_MODAL_TABS: { key: CharacterFilterTabKey; label: string }[] = [
  { key: "partyCharacters", label: "編成キャラ" },
  { key: "mainAttackers", label: "メイン" },
];

const LIBRARY_BUILD_FILTER_TABS: { key: LibraryBuildFilterTab; label: string }[] = [
  { key: "cost", label: "コスト指定" },
  { key: "weapon", label: "武器指定" },
];

const COST_BRACKET_OPTIONS = [
  { key: 1, label: "Low" },
  { key: 2, label: "Middle" },
  { key: 3, label: "High" },
  { key: 4, label: "Unlimited" },
] as const;

const RULESET_OPTIONS = Array.from(new Set(appRuns.map((run) => run.ruleset))).sort((left, right) => left.localeCompare(right));
const VERSION_OPTIONS = Array.from(new Set(appRuns.map((run) => formatVersionLabel(run.versionLabel || run.season)))).sort((left, right) => versionRank(right) - versionRank(left));
const PLAY_STYLE_OPTIONS = ["ソロ", "2人マルチ", "3人マルチ", "4人マルチ"] as const;
const FOOD_OPTIONS = ["飯バフなし", "飯バフあり"] as const;
const DEVICE_OPTIONS = ["PC", "PS5", "Mobile", "PC+PC"] as const;

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
  { key: "five_star", label: "星5" },
  { key: "four_star", label: "星4" },
  { key: "three_star", label: "星3" },
  { key: "two_star", label: "星2" },
  { key: "one_star", label: "星1" },
] as const;

const UI = {
  textMain: "#333333",
  textSub: "#6F6F6F",
  panel: "#FFFFFF",
  panelHover: "#F3F3F3",
  panelActive: "#ECECEC",
  panelBorder: "#DCDCDC",
  sectionBody: "#F4F3F1",
  submitTop: "#1A1A1A",
  submitBottom: "#000000",
  submitHoverTop: "#3A3A3A",
  submitHoverBottom: "#151515",
  cardBorder: "#CFCFCF",
} as const;

const FILTER_CARD_DIM_CLASS = "bg-black/[0.58] group-hover:bg-black/[0.36] group-focus-visible:bg-black/[0.36]";
const FILTER_CARD_DETAILS: Record<SelectableFilterKey, { number: string; subLabel: string }> = {
  character: { number: "01", subLabel: "PARTY / MAIN" },
  build: { number: "02", subLabel: "CONST / WEAPON" },
  category: { number: "03", subLabel: "RULE / VERSION" },
  tag: { number: "04", subLabel: "TAG CLUSTER" },
};

const DESKTOP_FILTER_CARD_META: Record<SelectableFilterKey, { imageUrl: string; backgroundColor: string; objectPosition: string }> = {
  character: {
    imageUrl: "https://enka.network/ui/UI_Gacha_AvatarImg_Chasca.png",
    backgroundColor: "#274060",
    objectPosition: "50% 18%",
  },
  build: {
    imageUrl: "https://enka.network/ui/UI_EquipIcon_Claymore_Wolfmound.png",
    backgroundColor: "#2c3e3d",
    objectPosition: "50% 44%",
  },
  category: {
    imageUrl: categoryPeriodImageUrl,
    backgroundColor: "#4a3528",
    objectPosition: "50% 34%",
  },
  tag: {
    imageUrl: "https://static.wikia.nocookie.net/gensin-impact/images/6/65/Item_An_Appellative_Stroke.png/revision/latest?cb=20221207135611",
    backgroundColor: "#3d2a4a",
    objectPosition: "50% 42%",
  },
};

export function FilterEntrance({
  onModalOpenChange,
  onSearch,
  restoreRequest,
}: {
  onModalOpenChange?: (isOpen: boolean) => void;
  onSearch?: (filters: LibrarySearchFilters) => void;
  restoreRequest?: LibraryFilterRestoreRequest | null;
}) {
  const filterEntranceState = useLibraryFilterEntrance({ onModalOpenChange, onSearch, restoreRequest });

  return (
    <section className="relative z-10 mx-auto -mt-24 max-w-[1340px] px-4 md:-mt-56 lg:px-8" style={{ color: UI.textMain }}>
      <ResponsiveStyle />
      <div className="overflow-hidden border shadow-[0_18px_45px_rgba(21,27,38,0.14)]" style={{ borderColor: UI.cardBorder }}>
        <header className="relative flex min-h-[55px] items-stretch bg-[#111116]">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-4 sm:gap-4 sm:px-5">
            <span className="inline-flex h-[22px] shrink-0 items-center border border-white/40 px-3 text-[12px] font-bold uppercase leading-none tracking-[0.14em] text-[#d9d9d9]">
              {LIBRARY_LABELS.searchBadge}
            </span>
            <h2 className="shrink-0 text-[15px] font-black leading-none tracking-[0.04em] text-[#d9d9d9] sm:text-[19px]">{LIBRARY_LABELS.searchTitle}</h2>
            <span className="hidden h-[3px] w-[3px] shrink-0 rounded-full bg-white/25 sm:block" />
            <span className="truncate text-[11px] font-normal uppercase leading-none tracking-[0.08em] text-[#d9d9d9] sm:text-[12px]">
              {filterEntranceState.activeLabel || LIBRARY_LABELS.searchSummaryFallback}
            </span>
          </div>
        </header>
        <div className="h-px bg-white/10" />
        <div className="p-3 sm:p-4" style={{ background: UI.sectionBody }}>
          <FilterCardBar activeKey={filterEntranceState.activeKey} onPanelClick={filterEntranceState.handleDesktopPanelClick} variant="desktop" className="hidden sm:block" />
          <FilterCardBar activeKey={filterEntranceState.activeKey} onPanelClick={filterEntranceState.handleMobilePanelClick} variant="mobile" className="sm:hidden" />
          <div className="mt-3 sm:hidden">
            {filterEntranceState.activeKey === "character" ? (
              <CharacterFilterSummaryPanel filters={filterEntranceState.characterFilters} onOpenPicker={() => filterEntranceState.setIsCharacterModalOpen(true)} onRemoveFilter={filterEntranceState.handleRemoveCharacterFilter} />
            ) : null}
            {filterEntranceState.activeKey === "build" ? (
              <BuildFilterControlsPanel filters={filterEntranceState.buildFilters} onChange={filterEntranceState.setBuildFilters} onOpenWeaponPicker={() => filterEntranceState.setIsWeaponModalOpen(true)} />
            ) : null}
            {filterEntranceState.activeKey === "category" ? <CategoryFilterPanel filters={filterEntranceState.categoryFilters} onChange={filterEntranceState.setCategoryFilters} /> : null}
            {filterEntranceState.activeKey === "tag" ? <TagFilterPanel selectedTags={filterEntranceState.selectedTags} onToggleTag={filterEntranceState.handleToggleTag} /> : null}
          </div>
        </div>
      </div>
      <LibraryFilterModal
        activeKey={filterEntranceState.desktopModalKey}
        characterFilters={filterEntranceState.characterFilters}
        buildFilters={filterEntranceState.buildFilters}
        categoryFilters={filterEntranceState.categoryFilters}
        selectedTags={filterEntranceState.selectedTags}
        onClose={() => filterEntranceState.setDesktopModalKey(null)}
        onApplyCharacter={(filters) => {
          filterEntranceState.setCharacterFilters(filters);
          filterEntranceState.setDesktopModalKey(null);
        }}
        onApplyBuild={(filters) => {
          filterEntranceState.setBuildFilters(filters);
          filterEntranceState.setDesktopModalKey(null);
        }}
        onApplyCategory={(filters) => {
          filterEntranceState.setCategoryFilters(filters);
          filterEntranceState.setDesktopModalKey(null);
        }}
        onApplyTags={(tags) => {
          filterEntranceState.setSelectedTags(tags);
          filterEntranceState.setDesktopModalKey(null);
        }}
      />
      <FilterDrawer
        isOpen={filterEntranceState.isCharacterModalOpen}
        onClose={() => filterEntranceState.setIsCharacterModalOpen(false)}
        onApply={filterEntranceState.setCharacterFilters}
        initialFilters={filterEntranceState.characterFilters}
        characters={selectableCharacters}
        tagGroups={[]}
        title="キャラ・編成を絞り込む"
        resetLabel="リセット"
        applyLabel="適用する"
        filterTabs={[
          { key: "partyCharacters", label: "編成キャラ" },
          { key: "mainAttackers", label: "メインアタッカー" },
        ]}
        filterTargetOptions={HOME_FILTER_TARGET_OPTIONS}
        elementFilterOptions={HOME_ELEMENT_FILTER_OPTIONS}
        characterSearchPlaceholder="キャラ名で検索"
        tagSearchPlaceholder=""
        emptyCharacterResultLabel="該当するキャラがありません"
        emptyTagResultLabel=""
      />
      <LibraryWeaponFilterDrawer
        isOpen={filterEntranceState.isWeaponModalOpen}
        initialWeaponIds={filterEntranceState.buildFilters.weaponIds}
        onClose={() => filterEntranceState.setIsWeaponModalOpen(false)}
        onApply={(weaponIds) => {
          filterEntranceState.setBuildFilters((current) => ({ ...current, weaponIds }));
          filterEntranceState.setIsWeaponModalOpen(false);
        }}
      />
    </section>
  );
}

function CharacterFilterSummaryPanel({
  filters,
  onOpenPicker,
  onRemoveFilter,
}: {
  filters: HomeFilterState;
  onOpenPicker: () => void;
  onRemoveFilter: (group: CharacterSummaryGroup, target: CharacterSummaryTarget, characterId: string) => void;
}) {
  const selectedIds = getUniqueSelectedCharacterIds(filters).slice(0, 4);
  const selectedCount = getSelectedCharacterCount(filters);

  return (
    <div className="rounded-b-[8px] border-x border-b bg-white px-4 py-4 shadow-[0_10px_16px_rgba(0,0,0,0.05)]" style={{ borderColor: UI.panelBorder }}>
      <div className="grid gap-4 lg:grid-cols-[310px_1fr]">
        <LibraryCharacterPickerTile selectedIds={selectedIds} selectedCount={selectedCount} onOpenPicker={onOpenPicker} />
        <div className="grid gap-3 md:grid-cols-2">
          <CombinedCharacterSummaryBox title="編成キャラ" includeIds={filters.partyCharacters.includeIds} excludeIds={filters.partyCharacters.excludeIds} group="partyCharacters" onRemove={onRemoveFilter} />
          <CombinedCharacterSummaryBox title="メインアタッカー" includeIds={filters.mainAttackers.includeIds} excludeIds={filters.mainAttackers.excludeIds} group="mainAttackers" onRemove={onRemoveFilter} />
        </div>
      </div>
    </div>
  );
}

function LibraryCharacterPickerTile({ selectedIds, selectedCount, onOpenPicker }: { selectedIds: string[]; selectedCount: number; onOpenPicker: () => void }) {
  const hasSelection = selectedCount > 0;

  return (
    <button type="button" onClick={onOpenPicker} className="group flex min-h-[128px] items-center gap-4 rounded-[8px] border bg-[#f6f6f6] p-4 text-left transition hover:bg-[#f1f1f1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50" style={{ borderColor: UI.panelBorder }}>
      <span className="grid h-[96px] w-[96px] shrink-0 place-items-center overflow-hidden rounded-[8px] bg-white">
        {hasSelection ? (
          <span className="grid w-full grid-cols-2 gap-1 p-2">
            {selectedIds.map((characterId) => {
              const character = characterDb[characterId];
              return (
                <span key={characterId} className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-[#f2f2f2]">
                  <CharacterIcon characterId={characterId} alt={character?.name ?? characterId} fallbackLabel={character?.name ?? characterId} size={36} />
                </span>
              );
            })}
          </span>
        ) : (
          <span className="text-[76px] font-normal leading-none text-[#c2c2c2] transition group-hover:text-[#a9a9b5]">+</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[18px] font-black tracking-[0.02em] text-[#333333]">{hasSelection ? "キャラ条件を編集" : "キャラ条件を選択"}</span>
        <span className="mt-2 block text-[12px] font-bold leading-5 text-[#777777]">{hasSelection ? `${selectedCount}件の条件を選択中` : "編成キャラとメインアタッカーをまとめて指定できます。"}</span>
      </span>
    </button>
  );
}

function CombinedCharacterSummaryBox({
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

function getUniqueSelectedCharacterIds(filters: HomeFilterState) {
  return Array.from(new Set([...filters.partyCharacters.includeIds, ...filters.partyCharacters.excludeIds, ...filters.mainAttackers.includeIds, ...filters.mainAttackers.excludeIds]));
}

function getSelectedCharacterCount(filters: HomeFilterState) {
  return filters.partyCharacters.includeIds.length + filters.partyCharacters.excludeIds.length + filters.mainAttackers.includeIds.length + filters.mainAttackers.excludeIds.length;
}

function CategoryFilterPanel({
  filters,
  onChange,
}: {
  filters: LibraryCategoryFilterState;
  onChange: Dispatch<SetStateAction<LibraryCategoryFilterState>>;
}) {
  const update = <Key extends keyof LibraryCategoryFilterState>(key: Key, value: LibraryCategoryFilterState[Key]) => {
    onChange((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="rounded-b-[8px] border-x border-b bg-white px-4 py-4 shadow-[0_10px_16px_rgba(0,0,0,0.05)]" style={{ borderColor: UI.panelBorder }}>
      <div className="grid gap-3 lg:grid-cols-2">
        <LibrarySelectControl title="カテゴリ" value={filters.ruleset} options={RULESET_OPTIONS} placeholder="カテゴリを選択" onChange={(value) => update("ruleset", value)} />
        <LibrarySelectControl title="期間・バージョン" value={filters.version} options={VERSION_OPTIONS} placeholder="期間を選択" onChange={(value) => update("version", value)} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <ChoiceFilterGroup title="人数" options={PLAY_STYLE_OPTIONS} value={filters.playStyle} onChange={(value) => update("playStyle", value)} />
        <ChoiceFilterGroup title="飯バフ" options={FOOD_OPTIONS} value={filters.food} onChange={(value) => update("food", value)} />
        <ChoiceFilterGroup title="端末" options={DEVICE_OPTIONS} value={filters.device} onChange={(value) => update("device", value)} />
      </div>
    </div>
  );
}

function LibrarySelectControl({
  title,
  value,
  options,
  placeholder,
  onChange,
}: {
  title: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <span className="mb-2 block text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-[8px] border border-[#d8dde6] bg-white px-3 pr-10 text-[14px] font-bold text-[#333333] outline-none transition-colors focus:border-[#9aa7ba] focus:bg-white"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] leading-none text-[#999999]">⌄</span>
      </span>
    </label>
  );
}

function ChoiceFilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <p className="mb-2 text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(active ? null : option)}
              className={[
                "min-h-9 rounded-full border px-3 py-1.5 text-[12px] font-black transition-colors",
                active ? "border-[#111116] bg-[#111116] text-white" : "border-[#dcdcdc] bg-white text-[#333333] hover:bg-[#eeeeee]",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TagFilterPanel({ selectedTags, onToggleTag }: { selectedTags: string[]; onToggleTag: (tag: string) => void }) {
  return (
    <div className="rounded-b-[8px] border-x border-b bg-white px-4 py-4 shadow-[0_10px_16px_rgba(0,0,0,0.05)]" style={{ borderColor: UI.panelBorder }}>
      <div className="grid gap-3 lg:grid-cols-2">
        {HOME_FILTER_TAG_GROUP_DEFINITIONS.map((group) => (
          <section key={group.key} className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
            <p className="mb-2 text-[12px] font-black tracking-[0.08em] text-[#777777]">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={`${group.key}-${tag}`}
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className={[
                      "inline-flex min-h-9 items-center rounded-full border px-3 py-2 text-[12px] font-medium transition-colors",
                      active ? "border-transparent bg-[#111827] text-white" : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]",
                    ].join(" ")}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function BuildFilterControlsPanel({
  filters,
  onChange,
  onOpenWeaponPicker,
}: {
  filters: LibraryBuildFilterState;
  onChange: Dispatch<SetStateAction<LibraryBuildFilterState>>;
  onOpenWeaponPicker: () => void;
}) {
  const selectedWeaponIds = getUniqueSelectedWeaponIds(filters).slice(0, 4);
  const selectedWeaponCount = filters.weaponIds.include.length + filters.weaponIds.exclude.length;

  const updateRange = (key: "charCostRange" | "weaponCostRange" | "fiveStarWeaponCountRange", range: NumericRange) => {
    onChange((current) => ({ ...current, [key]: range }));
  };

  return (
    <div className="rounded-b-[8px] border-x border-b bg-white px-4 py-4 shadow-[0_10px_16px_rgba(0,0,0,0.05)]" style={{ borderColor: UI.panelBorder }}>
      <div className="grid gap-4 lg:grid-cols-[310px_1fr]">
        <LibraryWeaponPickerTile selectedIds={selectedWeaponIds} selectedCount={selectedWeaponCount} onOpenPicker={onOpenWeaponPicker} />
        <div className="grid gap-3">
          <div className="grid gap-3 lg:grid-cols-3">
            <CostBracketSelector value={filters.costBracket} onChange={(value) => onChange((current) => ({ ...current, costBracket: value }))} />
            <MaxValueSelector title="最大凸数" prefix="C" max={6} value={filters.maxConstellation} onChange={(value) => onChange((current) => ({ ...current, maxConstellation: value }))} />
            <MaxValueSelector title="最大精錬" prefix="R" min={1} max={5} value={filters.maxFiveStarRefinement} onChange={(value) => onChange((current) => ({ ...current, maxFiveStarRefinement: value }))} />
          </div>
          <div className="grid gap-3 xl:grid-cols-3">
            <RangeFilterControl title="キャラCost" value={filters.charCostRange} limit={BUILD_RANGE_LIMITS.charCost} onChange={(range) => updateRange("charCostRange", range)} />
            <RangeFilterControl title="武器Cost" value={filters.weaponCostRange} limit={BUILD_RANGE_LIMITS.weaponCost} onChange={(range) => updateRange("weaponCostRange", range)} />
            <RangeFilterControl title="星5武器装備数" value={filters.fiveStarWeaponCountRange} limit={BUILD_RANGE_LIMITS.fiveStarWeaponCount} onChange={(range) => updateRange("fiveStarWeaponCountRange", range)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryWeaponPickerTile({ selectedIds, selectedCount, onOpenPicker }: { selectedIds: string[]; selectedCount: number; onOpenPicker: () => void }) {
  const hasSelection = selectedCount > 0;

  return (
    <button type="button" onClick={onOpenPicker} className="group flex min-h-[128px] items-center gap-4 rounded-[8px] border bg-[#f6f6f6] p-4 text-left transition hover:bg-[#f1f1f1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50" style={{ borderColor: UI.panelBorder }}>
      <span className="grid h-[96px] w-[96px] shrink-0 place-items-center overflow-hidden rounded-[8px] bg-white">
        {hasSelection ? (
          <span className="grid w-full grid-cols-2 gap-1 p-2">
            {selectedIds.map((weaponId) => {
              const weapon = weaponDb[weaponId];
              return weapon ? (
                <span key={weaponId} className="grid h-9 w-9 place-items-center overflow-hidden rounded-[8px] bg-[#eef0f4]">
                  <WeaponIcon imageUrl={weapon.imageUrl} alt={weapon.name} fallbackLabel={weapon.shortLabel} size={34} className="p-1" />
                </span>
              ) : null;
            })}
          </span>
        ) : (
          <span className="text-[76px] font-normal leading-none text-[#c2c2c2] transition group-hover:text-[#a9a9b5]">+</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[18px] font-black tracking-[0.02em] text-[#333333]">{hasSelection ? "武器条件を編集" : "武器条件を選択"}</span>
        <span className="mt-2 block text-[12px] font-bold leading-5 text-[#777777]">{hasSelection ? `${selectedCount}件の武器条件を選択中` : "具体的な武器を含める/除外する条件として指定できます。"}</span>
      </span>
    </button>
  );
}

function RangeFilterControl({ title, value, limit, onChange }: { title: string; value: NumericRange; limit: NumericRange; onChange: (range: NumericRange) => void }) {
  const span = limit.max - limit.min;
  const leftPercent = ((value.min - limit.min) / span) * 100;
  const rightPercent = ((value.max - limit.min) / span) * 100;

  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</p>
        <p className="text-[12px] font-black text-[#333333]">{value.min}〜{value.max}</p>
      </div>
      <div className="relative mt-5 h-8">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#d9dde5]" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#111116]" style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }} />
        <input type="range" min={limit.min} max={limit.max} value={value.min} onChange={(event) => onChange({ min: Math.min(Number(event.target.value), value.max), max: value.max })} className="library-range-input absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 appearance-none bg-transparent accent-[#111116]" aria-label={`${title} 最小値`} />
        <input type="range" min={limit.min} max={limit.max} value={value.max} onChange={(event) => onChange({ min: value.min, max: Math.max(Number(event.target.value), value.min) })} className="library-range-input absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 appearance-none bg-transparent accent-[#111116]" aria-label={`${title} 最大値`} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-bold text-[#9a9a9a]">
        <span>{limit.min}</span>
        <span>{limit.max}</span>
      </div>
    </section>
  );
}

function MaxValueSelector({ title, prefix, value, min = 0, max, onChange }: { title: string; prefix: "C" | "R"; value: number | null; min?: number; max: number; onChange: (value: number | null) => void }) {
  const options = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</p>
        <button type="button" onClick={() => onChange(null)} className="text-[11px] font-black text-[#999999] hover:text-[#333333]">解除</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button key={option} type="button" onClick={() => onChange(active ? null : option)} className={["h-9 min-w-11 rounded-full border px-3 text-[12px] font-black transition-colors", active ? "border-[#111116] bg-[#111116] text-white" : "border-[#dcdcdc] bg-white text-[#333333] hover:bg-[#eeeeee]"].join(" ")}>
              {prefix}{option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CostBracketSelector({ value, onChange }: { value: 1 | 2 | 3 | 4 | null; onChange: (value: 1 | 2 | 3 | 4 | null) => void }) {
  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">コスト階級</p>
        <button type="button" onClick={() => onChange(null)} className="text-[11px] font-black text-[#999999] hover:text-[#333333]">
          解除
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {COST_BRACKET_OPTIONS.map((option) => {
          const active = value === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(active ? null : option.key)}
              className={[
                "h-9 min-w-11 rounded-full border px-3 text-[12px] font-black transition-colors",
                active ? "border-[#111116] bg-[#111116] text-white" : "border-[#dcdcdc] bg-white text-[#333333] hover:bg-[#eeeeee]",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CombinedWeaponSummaryBox({ includeIds, excludeIds, onRemove }: { includeIds: string[]; excludeIds: string[]; onRemove: (target: WeaponSummaryTarget, weaponId: string) => void }) {
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

function LibraryWeaponFilterDrawer({
  isOpen,
  initialWeaponIds,
  onClose,
  onApply,
}: {
  isOpen: boolean;
  initialWeaponIds: LibraryBuildFilterState["weaponIds"];
  onClose: () => void;
  onApply: (weaponIds: LibraryBuildFilterState["weaponIds"]) => void;
}) {
  const [draft, setDraft] = useState<LibraryBuildFilterState["weaponIds"]>(initialWeaponIds);
  const [activeTarget, setActiveTarget] = useState<WeaponSummaryTarget>("include");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<(typeof WEAPON_CLASS_FILTER_OPTIONS)[number]["key"]>("all");
  const [tierFilter, setTierFilter] = useState<(typeof WEAPON_TIER_FILTER_OPTIONS)[number]["key"]>("all");

  const filteredWeapons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return selectableWeapons.filter((weapon) => {
      const matchesClass = classFilter === "all" || weapon.weaponClass === classFilter;
      const matchesTier = tierFilter === "all" || weapon.tier === tierFilter;
      const matchesQuery = normalizedQuery.length === 0 || weapon.name.toLowerCase().includes(normalizedQuery) || weapon.id.toLowerCase().includes(normalizedQuery) || weapon.shortLabel.toLowerCase().includes(normalizedQuery);
      return matchesClass && matchesTier && matchesQuery;
    });
  }, [classFilter, query, tierFilter]);

  useEffect(() => {
    if (!isOpen) return;
    setDraft({ include: [...initialWeaponIds.include], exclude: [...initialWeaponIds.exclude] });
    setActiveTarget("include");
    setQuery("");
    setClassFilter("all");
    setTierFilter("all");
  }, [initialWeaponIds, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleWeapon = (weaponId: string) => {
    const oppositeTarget = activeTarget === "include" ? "exclude" : "include";
    setDraft((current) => {
      const exists = current[activeTarget].includes(weaponId);
      return {
        ...current,
        [activeTarget]: exists ? current[activeTarget].filter((id) => id !== weaponId) : [...current[activeTarget], weaponId],
        [oppositeTarget]: current[oppositeTarget].filter((id) => id !== weaponId),
      };
    });
  };

  return (
    <div className="fixed inset-0 z-[72] bg-black/35 backdrop-blur-[2px]" onClick={onClose}>
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col border-l border-[#e5e7eb] bg-white text-[#333333] shadow-[-24px_0_60px_rgba(31,41,55,0.16)]" onClick={(event) => event.stopPropagation()}>
        <div className="shrink-0 border-b border-[#e5e7eb]">
          <div className="flex items-start justify-between gap-4 px-5 pb-5 pt-8 md:px-6">
            <div className="text-[24px] font-semibold text-[#111827]">武器条件を選択</div>
            <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8dde6] bg-[#f7f8fa] text-[#5f6678] transition-colors hover:bg-[#eef1f5] hover:text-[#111827]" onClick={onClose} aria-label="閉じる">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-6">
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex justify-center">
                <div className="flex w-full max-w-[320px] items-center overflow-hidden rounded-full border border-[#d8dde6] bg-[#edf1f5] sm:max-w-[360px]" aria-label="Selection target">
                  {(["include", "exclude"] as const).map((target) => (
                    <button key={target} type="button" className={`flex-1 px-5 py-2 text-[13px] font-semibold transition-colors sm:px-7 ${activeTarget === target ? "bg-[#111827] text-white" : "bg-transparent text-[#5f6678] hover:bg-white hover:text-[#111827]"}`} onClick={() => setActiveTarget(target)}>
                      {target === "include" ? "含める" : "除外する"} {draft[target].length}
                    </button>
                  ))}
                </div>
              </div>
            </section>
            <section className="space-y-2">
              <label className="relative block">
                <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d93a3]" />
                <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="武器名 / ID / 略称で検索" className="h-11 w-full rounded-[14px] border border-[#d8dde6] bg-[#f7f8fa] pl-11 pr-4 text-[14px] text-[#333333] placeholder:text-[#8d93a3] outline-none transition-colors focus:border-[#9aa7ba] focus:bg-white" />
              </label>
            </section>
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
            <div className="rounded-[16px] bg-[#f6f7f9] p-3">
              {filteredWeapons.length === 0 ? (
                <div className="grid min-h-[240px] place-items-center text-center text-[14px] text-[#7b7b8d]">条件に一致する武器がありません。</div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {filteredWeapons.map((weapon) => {
                    const isInclude = draft.include.includes(weapon.id);
                    const isExclude = draft.exclude.includes(weapon.id);
                    const isActive = activeTarget === "include" ? isInclude : isExclude;
                    return (
                      <button key={weapon.id} type="button" onClick={() => toggleWeapon(weapon.id)} className={`relative rounded-[16px] border bg-white p-4 text-left transition hover:-translate-y-[1px] ${isActive ? "border-[#0f1419] shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : "border-transparent"}`}>
                        <div className="flex items-start gap-3">
                          <WeaponIcon imageUrl={weapon.imageUrl} alt={weapon.name} fallbackLabel={weapon.shortLabel} size={64} className="rounded-[14px] p-1.5" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getWeaponTierBadgeClass(weapon.tier)}`}>{formatWeaponTierLabel(weapon.tier)}</div>
                              <div className="text-[12px] text-[#7b7b8d]">{formatWeaponClassLabel(weapon.weaponClass)}</div>
                            </div>
                            <div className="mt-2 text-[15px] font-semibold text-black">{weapon.name}</div>
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
        <div className="grid shrink-0 grid-cols-[1fr_minmax(220px,360px)_1fr] items-center gap-3 border-t border-[#e5e7eb] px-5 py-4 md:px-6">
          <button type="button" className="justify-self-start text-[13px] font-medium text-[#5f6678] underline decoration-[#c8ced8] underline-offset-4 hover:text-[#333333]" onClick={() => setDraft({ include: [], exclude: [] })}>
            リセット
          </button>
          <button type="button" className="w-full rounded-full border border-[#111827] bg-[#111827] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#263142]" onClick={() => onApply(draft)}>
            適用する
          </button>
          <div aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function LibraryFilterModal({
  activeKey,
  characterFilters,
  buildFilters,
  categoryFilters,
  selectedTags,
  onClose,
  onApplyCharacter,
  onApplyBuild,
  onApplyCategory,
  onApplyTags,
}: {
  activeKey: SelectableFilterKey | null;
  characterFilters: HomeFilterState;
  buildFilters: LibraryBuildFilterState;
  categoryFilters: LibraryCategoryFilterState;
  selectedTags: string[];
  onClose: () => void;
  onApplyCharacter: (filters: HomeFilterState) => void;
  onApplyBuild: (filters: LibraryBuildFilterState) => void;
  onApplyCategory: (filters: LibraryCategoryFilterState) => void;
  onApplyTags: (tags: string[]) => void;
}) {
  const panel = activeKey ? LIBRARY_FILTER_PANELS.find((item) => item.key === activeKey) : null;

  useEffect(() => {
    if (!activeKey) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [activeKey]);

  if (!activeKey || !panel) {
    return null;
  }

  if (activeKey === "character") {
    return <LibraryCharacterFilterModal title={panel.label} initialFilters={characterFilters} onClose={onClose} onApply={onApplyCharacter} />;
  }

  if (activeKey === "build") {
    return <LibraryBuildFilterModal title={panel.label} initialFilters={buildFilters} onClose={onClose} onApply={onApplyBuild} />;
  }

  if (activeKey === "category") {
    return <LibraryCategoryFilterModal title={panel.label} initialFilters={categoryFilters} onClose={onClose} onApply={onApplyCategory} />;
  }

  return <LibraryTagFilterModal title={panel.label} initialTags={selectedTags} onClose={onClose} onApply={onApplyTags} />;
}

function LibraryModalFrame({
  title,
  children,
  onClose,
  onReset,
  onApply,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-[80px] z-[73] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-128px)] w-full max-w-[1040px] flex-col overflow-hidden rounded-[24px] border border-[#ebebeb] bg-white text-[#333333] shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#ebebeb] px-5 pb-5 pt-6 md:px-6">
          <div className="min-w-0">
            <div className="inline-flex h-[22px] items-center border border-[#d8dde6] px-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#8d93a3]">FILTER</div>
            <h3 className="mt-3 text-[24px] font-bold leading-tight text-[#111827] md:text-[30px]">{title}</h3>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2f2f2] text-black transition hover:bg-[#e6e8ec]"
            onClick={onClose}
            aria-label="閉じる"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">{children}</div>
        <footer className="grid shrink-0 grid-cols-[1fr_minmax(190px,340px)_1fr] items-center gap-3 border-t border-[#e5e7eb] px-5 py-4 md:px-6">
          <button type="button" className="justify-self-start text-[13px] font-medium text-[#5f6678] underline decoration-[#c8ced8] underline-offset-4 hover:text-[#333333]" onClick={onReset}>
            リセット
          </button>
          <button type="button" className="w-full rounded-full border border-[#111827] bg-[#111827] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#263142]" onClick={onApply}>
            適用する
          </button>
          <div aria-hidden="true" />
        </footer>
      </div>
    </div>
  );
}

function LibraryCharacterFilterModal({
  title,
  initialFilters,
  onClose,
  onApply,
}: {
  title: string;
  initialFilters: HomeFilterState;
  onClose: () => void;
  onApply: (filters: HomeFilterState) => void;
}) {
  const includeModeSwitchId = useId();
  const [draft, setDraft] = useState<HomeFilterState>(() => cloneHomeFilterState(initialFilters));
  const [activeTab, setActiveTab] = useState<CharacterFilterTabKey>("partyCharacters");
  const [selectionTarget, setSelectionTarget] = useState<SelectionTarget>("include");
  const [query, setQuery] = useState("");
  const [elementFilter, setElementFilter] = useState<Element | null>(null);

  useEffect(() => {
    setDraft(cloneHomeFilterState(initialFilters));
    setActiveTab("partyCharacters");
    setSelectionTarget("include");
    setQuery("");
    setElementFilter(null);
  }, [initialFilters]);

  const visibleCharacters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...selectableCharacters]
      .sort((left, right) => left.name.localeCompare(right.name))
      .filter((character) => {
        const matchesQuery = normalizedQuery.length === 0 || character.name.toLowerCase().includes(normalizedQuery) || character.id.toLowerCase().includes(normalizedQuery);
        const matchesElement = !elementFilter || character.element === elementFilter;
        return matchesQuery && matchesElement;
      });
  }, [elementFilter, query]);

  const toggleCharacter = (characterId: string) => {
    setDraft((current) => ({
      ...current,
      [activeTab]: updateSelectionGroup(current[activeTab], selectionTarget, characterId),
    }));
  };

  const removeCharacterFilter = (group: CharacterSummaryGroup, target: CharacterSummaryTarget, characterId: string) => {
    const key = target === "include" ? "includeIds" : "excludeIds";
    setDraft((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: current[group][key].filter((id) => id !== characterId),
      },
    }));
  };

  const reset = () => {
    setDraft(createEmptyHomeFilterState());
    setActiveTab("partyCharacters");
    setSelectionTarget("include");
    setQuery("");
    setElementFilter(null);
  };

  const activeGroup = draft[activeTab];
  const isAndMode = activeGroup.includeMode === "and";

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={reset} onApply={() => onApply(cloneHomeFilterState(draft))}>
      <div className="space-y-5">
        <div className="border-b border-[#e5e7eb]">
          <div className="flex items-end justify-between overflow-x-auto px-1 pb-0 text-[13px] font-semibold md:text-[14px]">
            {CHARACTER_FILTER_MODAL_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`-mb-px flex-1 shrink-0 border-b-2 pb-4 text-center transition-colors ${
                  activeTab === tab.key ? "border-[#111827] text-[#111827]" : "border-transparent text-[#8d93a3] hover:text-[#333333]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex justify-center md:flex-1">
              <div className="flex w-full max-w-[320px] items-center overflow-hidden rounded-full border border-[#d8dde6] bg-[#edf1f5] sm:max-w-[360px]" aria-label="Selection target">
                {HOME_FILTER_TARGET_OPTIONS.map((option) => (
                  <button
                    key={`${activeTab}-target-${option.key}`}
                    type="button"
                    className={`flex-1 px-5 py-2 text-[13px] font-semibold transition-colors sm:px-7 ${
                      selectionTarget === option.key ? "bg-[#111827] text-white" : "bg-transparent text-[#5f6678] hover:bg-white hover:text-[#111827]"
                    }`}
                    onClick={() => setSelectionTarget(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:justify-end">
              <span className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${activeGroup.includeMode === "or" ? "text-[#333333]" : "text-[#8d93a3]"}`}>OR</span>
              <div className="checkbox-wrapper-5 shrink-0">
                <div className="check">
                  <input
                    id={includeModeSwitchId}
                    type="checkbox"
                    checked={isAndMode}
                    onChange={() => setDraft((current) => ({ ...current, [activeTab]: { ...current[activeTab], includeMode: isAndMode ? "or" : "and" } }))}
                    aria-label="Include mode"
                  />
                  <label htmlFor={includeModeSwitchId}>
                    <span className="sr-only">Toggle include mode</span>
                  </label>
                </div>
              </div>
              <span className={`text-[11px] font-semibold tracking-[0.08em] transition-colors ${activeGroup.includeMode === "and" ? "text-[#333333]" : "text-[#8d93a3]"}`}>AND</span>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-[18px] border border-[#e5e7eb] bg-[#f7f8fa] p-4">
            <CombinedCharacterSummaryBox title="編成キャラ" includeIds={draft.partyCharacters.includeIds} excludeIds={draft.partyCharacters.excludeIds} group="partyCharacters" onRemove={removeCharacterFilter} />
            <CombinedCharacterSummaryBox title="メインアタッカー" includeIds={draft.mainAttackers.includeIds} excludeIds={draft.mainAttackers.excludeIds} group="mainAttackers" onRemove={removeCharacterFilter} />
          </aside>
          <div className="min-w-0 space-y-4">
            <label className="relative block">
              <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d93a3]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="キャラ名で検索"
                className="h-11 w-full rounded-[14px] border border-[#d8dde6] bg-[#f7f8fa] pl-11 pr-4 text-[14px] text-[#333333] placeholder:text-[#8d93a3] outline-none transition-colors focus:border-[#9aa7ba] focus:bg-white"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {HOME_ELEMENT_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setElementFilter((current) => (current === option.key ? null : option.key))}
                  className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${elementFilter === option.key ? "border-transparent bg-[#111827] text-white" : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="rounded-[16px] bg-[#f6f7f9] p-3">
            {visibleCharacters.length === 0 ? (
              <div className="grid min-h-[240px] place-items-center text-center text-[14px] text-[#7b7b8d]">条件に一致するキャラクターがありません。</div>
            ) : (
              <div className="grid grid-cols-4 gap-3 md:grid-cols-5 lg:grid-cols-6">
                {visibleCharacters.map((character) => {
                  const isInclude = activeGroup.includeIds.includes(character.id);
                  const isExclude = activeGroup.excludeIds.includes(character.id);
                  return (
                    <button
                      key={`${activeTab}-${character.id}`}
                      type="button"
                      onClick={() => toggleCharacter(character.id)}
                      className={`relative rounded-[16px] border bg-white p-2 text-center transition hover:-translate-y-[1px] ${isExclude ? "border-[#efc9b0] bg-[#fff7f2]" : isInclude ? "border-[#8fc7d8] bg-[#eef9fc]" : "border-transparent"}`}
                    >
                      {isInclude || isExclude ? (
                        <span className={`absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold text-white ${isExclude ? "bg-[#c27642]" : "bg-[#6bbbd0]"}`}>
                          {isExclude ? "-" : "+"}
                        </span>
                      ) : null}
                      <div className="flex justify-center">
                        <CharacterIcon characterId={character.id} alt={character.name} fallbackLabel={character.name} size={58} />
                      </div>
                      <div className="mt-2 truncate text-[11px] font-medium text-[#5f6678]">{character.name}</div>
                    </button>
                  );
                })}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </LibraryModalFrame>
  );
}

function LibraryBuildFilterModal({
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
  const [activeBuildTab, setActiveBuildTab] = useState<LibraryBuildFilterTab>("cost");
  const [activeTarget, setActiveTarget] = useState<WeaponSummaryTarget>("include");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<(typeof WEAPON_CLASS_FILTER_OPTIONS)[number]["key"]>("all");
  const [tierFilter, setTierFilter] = useState<(typeof WEAPON_TIER_FILTER_OPTIONS)[number]["key"]>("all");

  useEffect(() => {
    setDraft(cloneLibraryBuildFilterState(initialFilters));
    setActiveBuildTab("cost");
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

  const updateRange = (key: "charCostRange" | "weaponCostRange" | "fiveStarWeaponCountRange", range: NumericRange) => {
    setDraft((current) => ({ ...current, [key]: range }));
  };

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
    setDraft(createEmptyLibraryBuildFilterState());
    setActiveBuildTab("cost");
    setActiveTarget("include");
    setQuery("");
    setClassFilter("all");
    setTierFilter("all");
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={reset} onApply={() => onApply(cloneLibraryBuildFilterState(draft))}>
      <div className="space-y-5">
        <div className="border-b border-[#e5e7eb]">
          <div className="flex items-end justify-between overflow-x-auto px-1 pb-0 text-[13px] font-semibold md:text-[14px]">
            {LIBRARY_BUILD_FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveBuildTab(tab.key)}
                className={`-mb-px flex-1 shrink-0 border-b-2 pb-4 text-center transition-colors ${
                  activeBuildTab === tab.key ? "border-[#111827] text-[#111827]" : "border-transparent text-[#8d93a3] hover:text-[#333333]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeBuildTab === "cost" ? (
          <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-3">
              <CostBracketSelector value={draft.costBracket} onChange={(value) => setDraft((current) => ({ ...current, costBracket: value }))} />
              <MaxValueSelector title="最大凸数" prefix="C" max={6} value={draft.maxConstellation} onChange={(value) => setDraft((current) => ({ ...current, maxConstellation: value }))} />
              <MaxValueSelector title="最大精錬" prefix="R" min={1} max={5} value={draft.maxFiveStarRefinement} onChange={(value) => setDraft((current) => ({ ...current, maxFiveStarRefinement: value }))} />
            </div>
            <div className="grid gap-3 xl:grid-cols-3">
              <RangeFilterControl title="キャラCost" value={draft.charCostRange} limit={BUILD_RANGE_LIMITS.charCost} onChange={(range) => updateRange("charCostRange", range)} />
              <RangeFilterControl title="武器Cost" value={draft.weaponCostRange} limit={BUILD_RANGE_LIMITS.weaponCost} onChange={(range) => updateRange("weaponCostRange", range)} />
              <RangeFilterControl title="星5武器装備数" value={draft.fiveStarWeaponCountRange} limit={BUILD_RANGE_LIMITS.fiveStarWeaponCount} onChange={(range) => updateRange("fiveStarWeaponCountRange", range)} />
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </LibraryModalFrame>
  );
}

function LibraryCategoryFilterModal({
  title,
  initialFilters,
  onClose,
  onApply,
}: {
  title: string;
  initialFilters: LibraryCategoryFilterState;
  onClose: () => void;
  onApply: (filters: LibraryCategoryFilterState) => void;
}) {
  const [draft, setDraft] = useState<LibraryCategoryFilterState>(() => cloneLibraryCategoryFilterState(initialFilters));

  useEffect(() => {
    setDraft(cloneLibraryCategoryFilterState(initialFilters));
  }, [initialFilters]);

  const update = <Key extends keyof LibraryCategoryFilterState>(key: Key, value: LibraryCategoryFilterState[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={() => setDraft(createEmptyLibraryCategoryFilterState())} onApply={() => onApply(cloneLibraryCategoryFilterState(draft))}>
      <div className="grid gap-3 lg:grid-cols-2">
        <LibrarySelectControl title="カテゴリ" value={draft.ruleset} options={RULESET_OPTIONS} placeholder="カテゴリを選択" onChange={(value) => update("ruleset", value)} />
        <LibrarySelectControl title="期間・バージョン" value={draft.version} options={VERSION_OPTIONS} placeholder="期間を選択" onChange={(value) => update("version", value)} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <ChoiceFilterGroup title="人数" options={PLAY_STYLE_OPTIONS} value={draft.playStyle} onChange={(value) => update("playStyle", value)} />
        <ChoiceFilterGroup title="飯バフ" options={FOOD_OPTIONS} value={draft.food} onChange={(value) => update("food", value)} />
        <ChoiceFilterGroup title="端末" options={DEVICE_OPTIONS} value={draft.device} onChange={(value) => update("device", value)} />
      </div>
    </LibraryModalFrame>
  );
}

function LibraryTagFilterModal({
  title,
  initialTags,
  onClose,
  onApply,
}: {
  title: string;
  initialTags: string[];
  onClose: () => void;
  onApply: (tags: string[]) => void;
}) {
  const [draftTags, setDraftTags] = useState<string[]>(initialTags);

  useEffect(() => {
    setDraftTags([...initialTags]);
  }, [initialTags]);

  const toggleTag = (tag: string) => {
    setDraftTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={() => setDraftTags([])} onApply={() => onApply([...draftTags])}>
      <div className="mb-4 flex items-center justify-end text-[12px] font-black text-[#777777]">{draftTags.length}件選択中</div>
      <div className="grid gap-3 lg:grid-cols-2">
        {HOME_FILTER_TAG_GROUP_DEFINITIONS.map((group) => (
          <section key={group.key} className="rounded-[12px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
            <p className="mb-2 text-[12px] font-black tracking-[0.08em] text-[#777777]">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => {
                const active = draftTags.includes(tag);
                return (
                  <button
                    key={`${group.key}-${tag}`}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={[
                      "inline-flex min-h-9 items-center rounded-full border px-3 py-2 text-[12px] font-medium transition-colors",
                      active ? "border-transparent bg-[#111827] text-white" : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]",
                    ].join(" ")}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </LibraryModalFrame>
  );
}

function getUniqueSelectedWeaponIds(filters: LibraryBuildFilterState) {
  return Array.from(new Set([...filters.weaponIds.include, ...filters.weaponIds.exclude]));
}

function filterChipClass(isExclude: boolean) {
  return [
    "inline-flex h-8 max-w-full items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-colors",
    isExclude
      ? "border border-[#efc9b0] bg-[#fff7f2] text-[#b6611e] hover:bg-[#fbf1ea]"
      : "border border-[#8fc7d8] bg-[#eef9fc] text-[#357f91] hover:bg-[#e4f5fa]",
  ].join(" ");
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

function FilterCardBar({
  activeKey,
  onPanelClick,
  variant,
  className,
}: {
  activeKey: SelectableFilterKey | null;
  onPanelClick: (key: LibraryFilterKey) => void;
  variant: "desktop" | "mobile";
  className?: string;
}) {
  const isMobile = variant === "mobile";

  return (
    <div className={[isMobile ? "" : "no-scrollbar overflow-x-auto", className].filter(Boolean).join(" ")} role="group" aria-label={LIBRARY_LABELS.searchTitle}>
      <div
        className={
          isMobile
            ? "grid grid-cols-1 gap-px overflow-hidden border border-black/25 bg-[#08080c] shadow-[0_14px_30px_rgba(15,23,42,0.18)]"
            : "grid min-w-[932px] grid-cols-[repeat(4,210px)_92px] gap-px overflow-hidden border border-black/25 bg-[#08080c] shadow-[0_14px_30px_rgba(15,23,42,0.18)] sm:min-w-0 sm:grid-cols-[repeat(4,minmax(0,1fr))_minmax(92px,0.42fr)]"
        }
      >
        {LIBRARY_FILTER_PANELS.map((panel) => {
          const isSearch = panel.key === "search";
          const isActive = !isSearch && panel.key === activeKey;
          const backgroundColor = getFilterCardBackgroundColor(panel);

          return (
            <button
              key={panel.key}
              type="button"
              aria-pressed={isSearch ? undefined : isActive}
              onClick={() => onPanelClick(panel.key)}
              className={[
                isMobile
                  ? "group relative h-[58px] overflow-hidden text-[#d9d9d9] outline-none transition focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/75"
                  : "group relative h-[138px] overflow-hidden text-[#d9d9d9] outline-none transition focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/75 sm:h-[168px] md:h-[190px]",
                isActive ? "ring-2 ring-inset ring-white/70" : "",
              ].join(" ")}
              style={
                {
                  backgroundColor,
                } as CSSProperties
              }
            >
              {renderFilterCardContent(panel, variant)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getFilterCardBackgroundColor(panel: LibraryFilterPanel) {
  return isSelectableFilterPanel(panel) ? DESKTOP_FILTER_CARD_META[panel.key].backgroundColor : "#111116";
}

function renderFilterCardContent(panel: LibraryFilterPanel, variant: "desktop" | "mobile") {
  if (isSearchFilterPanel(panel)) {
    return <SearchFilterCardContent panel={panel} variant={variant} />;
  }

  if (isSelectableFilterPanel(panel)) {
    return <SelectableFilterCardContent panel={panel} variant={variant} />;
  }

  return null;
}

function SelectableFilterCardContent({ panel, variant }: { panel: SelectableFilterPanel; variant: "desktop" | "mobile" }) {
  const meta = DESKTOP_FILTER_CARD_META[panel.key];
  const details = FILTER_CARD_DETAILS[panel.key];

  if (variant === "mobile") {
    return (
      <>
        <img
          src={meta.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.05] object-cover opacity-[0.62] transition duration-300 group-hover:scale-[1.09] group-hover:opacity-80 group-focus-visible:scale-[1.09] group-focus-visible:opacity-80"
          style={{ objectPosition: meta.objectPosition }}
          loading="lazy"
        />
        <span className={`absolute inset-0 transition-colors duration-200 ${FILTER_CARD_DIM_CLASS}`} />
        <span className="relative z-10 flex h-full min-w-0 items-center gap-2.5 px-4 text-left">
          <span className="shrink-0 text-[18px] font-black leading-none text-[#d9d9d9]/[0.9] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">{details.number}</span>
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="shrink-0 whitespace-nowrap text-[16px] font-black leading-none tracking-[0.02em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">{panel.label}</span>
            <span className="min-w-0 truncate text-[10px] font-black uppercase leading-none tracking-[0.08em] text-[#d9d9d9]/75">{details.subLabel}</span>
          </span>
        </span>
      </>
    );
  }

  return (
    <>
      <img
        src={meta.imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-[0.72] transition duration-300 group-hover:scale-[1.13] group-hover:opacity-90 group-focus-visible:scale-[1.13] group-focus-visible:opacity-90"
        style={{ objectPosition: meta.objectPosition }}
        loading="lazy"
      />
      <span className={`absolute inset-0 transition-colors duration-200 ${FILTER_CARD_DIM_CLASS}`} />
      <span className="absolute left-4 top-4 z-10 text-[22px] font-black leading-none text-[#d9d9d9]/[0.88] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:left-5 sm:top-5 sm:text-[24px]">
        {details.number}
      </span>
      <span className="relative z-10 flex h-full translate-y-0.5 items-end px-4 pb-5 pt-16 text-left sm:px-5 sm:pb-6">
        <span className="min-w-0">
          <span className="block whitespace-nowrap text-[19px] font-black leading-tight tracking-[0.02em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">{panel.label}</span>
          <span className="mt-1 block text-[11px] font-black uppercase leading-none tracking-[0.08em] text-[#d9d9d9]/75">{details.subLabel}</span>
        </span>
      </span>
    </>
  );
}

function SearchFilterCardContent({ panel, variant }: { panel: SearchFilterPanel; variant: "desktop" | "mobile" }) {
  if (variant === "mobile") {
    return (
      <>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_48%)] opacity-75 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="relative z-10 flex h-full items-center justify-center gap-2.5 px-4 text-center">
          <SearchIcon size={22} className="text-[#d9d9d9] drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition duration-300 group-hover:text-white group-focus-visible:text-white" />
          <span className="text-[16px] font-black leading-none tracking-[0.02em] text-white">{panel.label}</span>
        </span>
      </>
    );
  }

  return (
    <>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0)_48%)] opacity-75 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
        <SearchIcon size={38} className="text-[#d9d9d9] drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition duration-300 group-hover:text-white group-focus-visible:text-white" />
        <span className="text-[22px] font-black leading-none tracking-[0.02em] text-white sm:text-[23px]">{panel.label}</span>
      </span>
    </>
  );
}

function ResponsiveStyle() {
  return (
    <style>{`
      .library-range-input { pointer-events: none; }
      .library-range-input::-webkit-slider-thumb { pointer-events: auto; }
      .library-range-input::-moz-range-thumb { pointer-events: auto; }
    `}</style>
  );
}

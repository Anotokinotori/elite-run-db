import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";

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
import { SearchIcon } from "../../home/ui/icons";
import { LIBRARY_FILTER_PANELS, LIBRARY_LABELS } from "../config";
import { useLibraryFilterEntrance } from "../hooks/useLibraryFilterEntrance";
import type { LibraryFilterRestoreRequest } from "../logic/actionStorage";
import {
  cloneLibraryBuildFilterState,
  cloneLibraryCategoryFilterState,
  createEmptyLibraryBuildFilterState,
  createEmptyLibraryCategoryFilterState,
} from "../logic/searchFilters";
import {
  LIBRARY_BUILD_RANGE_LIMITS as BUILD_RANGE_LIMITS,
  type CharacterSummaryGroup,
  type CharacterSummaryTarget,
  type LibraryBuildFilterState,
  type LibraryCategoryFilterState,
  type LibraryFilterKey,
  type LibrarySearchFilters,
  type NumericRange,
  type SelectableFilterKey,
  type WeaponSummaryTarget,
} from "../types";

const CHARACTER_FILTER_MODAL_TABS: { key: CharacterFilterTabKey; label: string }[] = [
  { key: "partyCharacters", label: "編成キャラ" },
  { key: "mainAttackers", label: "メイン" },
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

const FILTER_ENTRANCE_IMAGES = [
  "https://upload-os-bbs.hoyolab.com/upload/2025/01/26/fdd32de994246663d3329df80945351a_9019649747265555038.png?x-oss-process=image/auto-orient,0/interlace,1/format,webp/quality,q_70",
  "https://upload-os-bbs.hoyolab.com/upload/2024/04/12/91148e90e86c89e4d565c4d46c092352_7325119691657342334.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2022/09/18/98252c0073c87263e6fbb51447cb6d2e_7381897631492436601.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2022/06/22/20d03d5c03560a68a9b5ca1c5ddf2293_5646653669169504614.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2026/04/30/25cc0894bf35a35b322dafbc722cf0b8_3127599890961230812.png?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
] as const;

const FILTER_ENTRANCE_CARDS: Array<{
  key: SelectableFilterKey;
  no: string;
  label: string;
  meta: string;
  lead: string;
  image: string;
  desktopImageClass: string;
  mobileImageClass: string;
}> = [
  {
    key: "character",
    no: "01",
    label: "キャラ・編成",
    meta: "CHARACTER / TEAM",
    lead: "キャラ・編成から探す",
    image: FILTER_ENTRANCE_IMAGES[0],
    desktopImageClass: "left-1/2 bottom-[-7px] h-[272px] w-[214px] -translate-x-1/2 object-[50%_100%]",
    mobileImageClass: "right-[-20px] bottom-[-30px] h-[154px] w-[184px] object-[50%_100%]",
  },
  {
    key: "weapon",
    no: "02",
    label: "武器",
    meta: "WEAPON",
    lead: "武器から探す",
    image: FILTER_ENTRANCE_IMAGES[1],
    desktopImageClass: "left-1/2 bottom-[-5px] h-[272px] w-[222px] -translate-x-1/2 object-[48%_100%]",
    mobileImageClass: "right-[-24px] bottom-[-28px] h-[154px] w-[190px] object-[48%_100%]",
  },
  {
    key: "cost",
    no: "03",
    label: "凸・精錬",
    meta: "C / R",
    lead: "凸・精錬で絞る",
    image: FILTER_ENTRANCE_IMAGES[2],
    desktopImageClass: "left-1/2 bottom-[-22px] h-[304px] w-[248px] -translate-x-1/2 object-[54%_100%]",
    mobileImageClass: "right-[-36px] bottom-[-44px] h-[178px] w-[218px] object-[54%_100%]",
  },
  {
    key: "category",
    no: "04",
    label: "カテゴリ・期間",
    meta: "CATEGORY / SEASON",
    lead: "カテゴリ・期間で探す",
    image: FILTER_ENTRANCE_IMAGES[3],
    desktopImageClass: "left-1/2 bottom-[-11px] h-[282px] w-[230px] -translate-x-1/2 object-[48%_100%]",
    mobileImageClass: "right-[-28px] bottom-[-36px] h-[164px] w-[198px] object-[48%_100%]",
  },
  {
    key: "tag",
    no: "05",
    label: "タグ",
    meta: "TAGS",
    lead: "タグから探す",
    image: FILTER_ENTRANCE_IMAGES[4],
    desktopImageClass: "left-1/2 bottom-[-12px] h-[280px] w-[226px] -translate-x-1/2 object-[50%_100%]",
    mobileImageClass: "right-[-30px] bottom-[-36px] h-[166px] w-[202px] object-[50%_100%]",
  },
];

const FILTER_ENTRANCE_MOBILE_LAYOUT = {
  width: 360,
  height: 640,
  cardWidth: 360,
  cardHeight: 120,
  gap: 10,
} as const;

const FILTER_ENTRANCE_DESKTOP_LAYOUT = {
  width: 828,
  height: 390,
  cardWidth: 156,
  cardHeight: 312,
  gap: 12,
} as const;

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
      <FilterEntranceShowcase activeKey={filterEntranceState.activeKey} onPanelClick={filterEntranceState.handleDesktopPanelClick} />
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
    </section>
  );
}

function FilterEntranceShowcase({ activeKey, onPanelClick }: { activeKey: SelectableFilterKey | null; onPanelClick: (key: LibraryFilterKey) => void }) {
  const scaleAreaRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const layout = isDesktop ? FILTER_ENTRANCE_DESKTOP_LAYOUT : FILTER_ENTRANCE_MOBILE_LAYOUT;
  const scale = useFitScale(scaleAreaRef, layout.width, 1);
  const scaledStageStyle = useMemo<CSSProperties>(
    () => ({
      width: layout.width,
      height: layout.height,
      transform: `translateX(-50%) scale(${scale})`,
      transformOrigin: "top center",
      left: "50%",
      top: 0,
    }),
    [layout.height, layout.width, scale],
  );

  return (
    <div className="mx-auto w-full max-w-[828px]" role="group" aria-label={LIBRARY_LABELS.searchTitle}>
      <div ref={scaleAreaRef} className="w-full">
        <div className="relative mx-auto overflow-visible" style={{ width: layout.width * scale, height: layout.height * scale }}>
          <div className="absolute" style={scaledStageStyle}>
            <div
              className="flex"
              style={{
                width: layout.width,
                height: layout.height,
                flexDirection: isDesktop ? "row" : "column",
                gap: layout.gap,
                alignItems: isDesktop ? "flex-start" : "center",
                justifyContent: "flex-start",
              }}
            >
              {FILTER_ENTRANCE_CARDS.map((item) => (
                <FilterEntranceSummaryCard
                  key={item.key}
                  item={item}
                  isActive={activeKey === item.key}
                  isDesktop={isDesktop}
                  onClick={() => onPanelClick(item.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[26px] flex w-full justify-center sm:mt-[30px]">
        <button
          type="button"
          className="group mx-auto flex w-fit items-center justify-center gap-[16px] text-[#050505] transition duration-200 hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50"
          aria-label="この条件で絞り込む"
          onClick={() => onPanelClick("search")}
        >
          <span className="font-['Inter','Noto_Sans_JP',sans-serif] text-[18px] font-black leading-none tracking-[0] sm:text-[19px]">
            この条件で絞り込む
          </span>
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-black text-white transition duration-200 group-hover:scale-[1.04] group-hover:bg-[#1a1a1a]">
            <DownArrowIcon />
          </span>
        </button>
      </div>
    </div>
  );
}

function FilterEntranceSummaryCard({
  item,
  isActive,
  isDesktop,
  onClick,
}: {
  item: (typeof FILTER_ENTRANCE_CARDS)[number];
  isActive: boolean;
  isDesktop: boolean;
  onClick: () => void;
}) {
  const imageClass = isDesktop ? item.desktopImageClass : item.mobileImageClass;
  const layout = isDesktop ? FILTER_ENTRANCE_DESKTOP_LAYOUT : FILTER_ENTRANCE_MOBILE_LAYOUT;

  return (
    <button
      className="group relative shrink-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/55"
      style={{ width: layout.cardWidth }}
      aria-label={`${item.label}で記録を探す`}
      aria-pressed={isActive}
      type="button"
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden rounded-[7px] bg-[#d9d9d7] shadow-[10px_13px_20px_rgba(30,32,35,0.14)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[14px_18px_26px_rgba(30,32,35,0.2)]"
        style={{
          width: layout.cardWidth,
          height: layout.cardHeight,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_45%,rgba(0,0,0,0.08))]" />
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#d6d6d4] via-[#d6d6d4]/72 to-transparent"
          style={{ height: isDesktop ? "45%" : "60%" }}
        />
        <div className="absolute left-[-2px] top-[-5px] z-20 font-['Arial_Narrow',Arial,sans-serif] text-[64px] font-black leading-[0.78] tracking-[0] text-white/92">
          {item.no}
        </div>

        {!isDesktop ? (
          <div className="absolute left-[86px] top-[25px] z-20 flex max-w-[150px] flex-col items-start">
            <p className="font-['Arial_Narrow',Arial,sans-serif] text-[15px] font-black uppercase leading-none tracking-[0] text-[#3e4144]">
              {item.label}
            </p>
            <p className="mt-[6px] whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black uppercase tracking-[0.13em] text-[#7d7f80]">
              {item.meta}
            </p>
            <div className="mt-[8px] flex w-[126px] items-center justify-center gap-2">
              <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
              <span className="whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black tracking-[0.08em] text-[#868787]">
                {item.lead}
              </span>
              <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
            </div>
          </div>
        ) : null}

        <img
          src={item.image}
          alt=""
          className={`absolute z-10 max-w-none object-contain transition duration-300 group-hover:scale-[1.045] ${imageClass}`}
          loading="lazy"
        />
      </div>

      {isDesktop ? (
        <div className="mt-[16px] flex flex-col items-center text-center">
          <p className="font-['Arial_Narrow',Arial,sans-serif] text-[15px] font-black uppercase leading-none tracking-[0] text-[#3e4144]">
            {item.label}
          </p>
          <p className="mt-[6px] whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black uppercase tracking-[0.13em] text-[#7d7f80]">
            {item.meta}
          </p>
          <div className="mt-[9px] flex w-[124px] items-center justify-center gap-2">
            <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
            <span className="whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black tracking-[0.08em] text-[#868787]">
              {item.lead}
            </span>
            <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
          </div>
        </div>
      ) : null}
    </button>
  );
}

function DownArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[28px] w-[28px] shrink-0"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.8 8.7v9.2" />
      <path d="M19.2 8.7v9.2" />
      <path d="M10 16.9 16 22.9l6-6" />
    </svg>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [query]);

  return matches;
}

function useFitScale(ref: RefObject<HTMLElement | null>, baseWidth: number, maxScale = 1) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const nextScale = Math.min(maxScale, node.clientWidth / baseWidth);
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(update);
      observer.observe(node);
      window.addEventListener("resize", update);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", update);
      };
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseWidth, maxScale, ref]);

  return scale;
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

  if (activeKey === "weapon") {
    return <LibraryWeaponFilterModal title={panel.label} initialFilters={buildFilters} onClose={onClose} onApply={onApplyBuild} />;
  }

  if (activeKey === "cost") {
    return <LibraryCostFilterModal title={panel.label} initialFilters={buildFilters} onClose={onClose} onApply={onApplyBuild} />;
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

function LibraryWeaponFilterModal({
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

function LibraryCostFilterModal({
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

  useEffect(() => {
    setDraft(cloneLibraryBuildFilterState(initialFilters));
  }, [initialFilters]);

  const updateRange = (key: "charCostRange" | "weaponCostRange" | "fiveStarWeaponCountRange", range: NumericRange) => {
    setDraft((current) => ({ ...current, [key]: range }));
  };

  const reset = () => {
    const emptyFilters = createEmptyLibraryBuildFilterState();
    setDraft((current) => ({
      ...current,
      costBracket: emptyFilters.costBracket,
      charCostRange: emptyFilters.charCostRange,
      weaponCostRange: emptyFilters.weaponCostRange,
      fiveStarWeaponCountRange: emptyFilters.fiveStarWeaponCountRange,
      maxConstellation: emptyFilters.maxConstellation,
      maxFiveStarRefinement: emptyFilters.maxFiveStarRefinement,
    }));
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={reset} onApply={() => onApply(cloneLibraryBuildFilterState(draft))}>
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <MaxValueSelector title="最大凸数" prefix="C" max={6} value={draft.maxConstellation} onChange={(value) => setDraft((current) => ({ ...current, maxConstellation: value }))} />
          <MaxValueSelector title="最大精錬" prefix="R" min={1} max={5} value={draft.maxFiveStarRefinement} onChange={(value) => setDraft((current) => ({ ...current, maxFiveStarRefinement: value }))} />
          <CostBracketSelector value={draft.costBracket} onChange={(value) => setDraft((current) => ({ ...current, costBracket: value }))} />
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          <RangeFilterControl title="キャラCost" value={draft.charCostRange} limit={BUILD_RANGE_LIMITS.charCost} onChange={(range) => updateRange("charCostRange", range)} />
          <RangeFilterControl title="武器Cost" value={draft.weaponCostRange} limit={BUILD_RANGE_LIMITS.weaponCost} onChange={(range) => updateRange("weaponCostRange", range)} />
          <RangeFilterControl title="星5武器装備数" value={draft.fiveStarWeaponCountRange} limit={BUILD_RANGE_LIMITS.fiveStarWeaponCount} onChange={(range) => updateRange("fiveStarWeaponCountRange", range)} />
        </div>
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

function ResponsiveStyle() {
  return (
    <style>{`
      .library-range-input { pointer-events: none; }
      .library-range-input::-webkit-slider-thumb { pointer-events: auto; }
      .library-range-input::-moz-range-thumb { pointer-events: auto; }
    `}</style>
  );
}

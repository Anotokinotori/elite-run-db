
import { appRuns } from '../../../../data/appRuns';
import { formatVersionLabel, versionRank } from '../../../../lib/versionLabels';
import type { CharacterFilterTabKey } from '../../../home/types';
import type { SelectableFilterKey } from '../../types';

export const CHARACTER_FILTER_MODAL_TABS: { key: CharacterFilterTabKey; label: string }[] = [
  { key: "partyCharacters", label: "編成キャラ" },
  { key: "mainAttackers", label: "メイン" },
];

export const COST_BRACKET_OPTIONS = [
  { key: 1, label: "Low" },
  { key: 2, label: "Middle" },
  { key: 3, label: "High" },
  { key: 4, label: "Unlimited" },
] as const;

export const RULESET_OPTIONS = Array.from(new Set(appRuns.map((run) => run.ruleset))).sort((left, right) => left.localeCompare(right));
export const VERSION_OPTIONS = Array.from(new Set(appRuns.map((run) => formatVersionLabel(run.versionLabel || run.season)))).sort((left, right) => versionRank(right) - versionRank(left));
export const PLAY_STYLE_OPTIONS = ["ソロ", "2人マルチ", "3人マルチ", "4人マルチ"] as const;
export const FOOD_OPTIONS = ["飯バフなし", "飯バフあり"] as const;
export const DEVICE_OPTIONS = ["PC", "PS5", "Mobile", "PC+PC"] as const;

export const WEAPON_CLASS_FILTER_OPTIONS = [
  { key: "all", label: "すべて" },
  { key: "sword", label: "片手剣" },
  { key: "claymore", label: "両手剣" },
  { key: "polearm", label: "長柄武器" },
  { key: "bow", label: "弓" },
  { key: "catalyst", label: "法器" },
] as const;

export const WEAPON_TIER_FILTER_OPTIONS = [
  { key: "all", label: "すべて" },
  { key: "five_star", label: "星5" },
  { key: "four_star", label: "星4" },
  { key: "three_star", label: "星3" },
  { key: "two_star", label: "星2" },
  { key: "one_star", label: "星1" },
] as const;

export const UI = {
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

export const FILTER_ENTRANCE_IMAGES = [
  "https://upload-os-bbs.hoyolab.com/upload/2025/01/26/fdd32de994246663d3329df80945351a_9019649747265555038.png?x-oss-process=image/auto-orient,0/interlace,1/format,webp/quality,q_70",
  "https://upload-os-bbs.hoyolab.com/upload/2024/04/12/91148e90e86c89e4d565c4d46c092352_7325119691657342334.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2022/09/18/98252c0073c87263e6fbb51447cb6d2e_7381897631492436601.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2022/06/22/20d03d5c03560a68a9b5ca1c5ddf2293_5646653669169504614.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2026/04/30/25cc0894bf35a35b322dafbc722cf0b8_3127599890961230812.png?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
] as const;

export const FILTER_ENTRANCE_CARDS: Array<{
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

export const FILTER_ENTRANCE_MOBILE_LAYOUT = {
  width: 360,
  height: 640,
  cardWidth: 360,
  cardHeight: 120,
  gap: 10,
} as const;

export const FILTER_ENTRANCE_DESKTOP_LAYOUT = {
  width: 828,
  height: 390,
  cardWidth: 156,
  cardHeight: 312,
  gap: 12,
} as const;

export const FILTER_ENTRANCE_MAX_SCALE = {
  mobile: 1,
  desktop: 1.16,
} as const;

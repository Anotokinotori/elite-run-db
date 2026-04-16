import {
  type Bracket,
  type Platform,
  type WeaponClass,
  selectableCharacters,
  selectableWeapons,
} from "../../data/mockRuns";
import type { SubmitDraft, SubmitPartySlot } from "./types";

export const SUBMIT_DRAFT_KEY = "elite-run-db.submitDraft.v1";
export const AUTO_SAVE_DELAY_MS = 500;
export const SUBMIT_SURFACE_SCALE = 0.6;
export const CHARACTER_OPTIONS = selectableCharacters;
export const WEAPON_OPTIONS = selectableWeapons;
export const RULESET_OPTIONS = ["NPUI", "PUI", "PUA", "Npui飯", "淵下宮", "マルチNpui", "マルチPui", "マルチPUA"];
export const PLATFORM_OPTIONS: Platform[] = ["PC", "PS5", "Mobile"];
export const SEARCH_TAG_OPTIONS = [
  "高難度",
  "祭典",
  "安定寄り",
  "高速処理",
  "短期決戦",
  "炎共鳴",
  "Natlan",
  "Budget",
  "OffMeta",
];
export const ELEMENT_FILTER_OPTIONS = [
  { key: "all", label: "全て" },
  { key: "pyro", label: "炎" },
  { key: "hydro", label: "水" },
  { key: "electro", label: "雷" },
  { key: "cryo", label: "氷" },
  { key: "anemo", label: "風" },
  { key: "geo", label: "岩" },
  { key: "dendro", label: "草" },
] as const;
export const DEFAULT_WEAPON_BY_CLASS: Record<WeaponClass, string> = {
  sword: "sacrificialSword",
  claymore: "serpentSpine",
  polearm: "theCatch",
  bow: "stringless",
  catalyst: "sacrificialFragments",
};
export const BRACKET_META: Record<Bracket, { label: string; accent: string; text: string }> = {
  1: { label: "Low", accent: "bg-[#daf2dd]", text: "text-[#2c7b42]" },
  2: { label: "Middle", accent: "bg-[#e4edff]", text: "text-[#335da6]" },
  3: { label: "High", accent: "bg-[#efe6ff]", text: "text-[#6b3faf]" },
  4: { label: "Unlimited", accent: "bg-[#ffe9db]", text: "text-[#b6611e]" },
};

export function createEmptyPartySlot(): SubmitPartySlot {
  return {
    characterId: "",
    cons: 0,
    weaponId: "",
    refine: 1,
  };
}

export const DEFAULT_DRAFT: SubmitDraft = {
  version: 1,
  currentStep: 1,
  basicInfo: {
    ruleset: RULESET_OPTIONS[0] ?? "NPUI",
    playMode: "solo",
    primaryPlatform: "PC",
    secondaryPlatform: "PC",
    time: "",
    videoUrl: "",
    uid: "",
  },
  party: Array.from({ length: 4 }, () => createEmptyPartySlot()),
  details: {
    mainAttackerIds: [],
    tagIds: [],
    notes: "",
    guidelineAccepted: false,
  },
};

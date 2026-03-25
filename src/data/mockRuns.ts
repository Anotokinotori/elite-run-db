export type Element = "pyro" | "hydro" | "cryo" | "electro" | "anemo" | "geo" | "dendro";
export type CharacterType = "limited" | "standard" | "four_star";
export type WeaponTier = WeaponCatalogTier;
export type WeaponClass = WeaponCatalogClass;
export type Platform = "PC" | "Mobile" | "PS5";

import { CHARACTER_ASSET_PRESETS, PRESET_ORDER, toEnkaUiUrl, type CharacterPresetKey } from "../lib/characterAssets";
import { WEAPON_CATALOG, type WeaponCatalogClass, type WeaponCatalogTier } from "../lib/weaponCatalog";

export type Character = {
  id: string;
  name: string;
  shortLabel: string;
  element: Element;
  weaponClass: WeaponClass;
  type: CharacterType;
};

export type Weapon = {
  id: string;
  name: string;
  shortLabel: string;
  tier: WeaponTier;
  weaponClass: WeaponClass;
  imageUrl: string;
};

export type PartyMember = {
  characterId: string;
  cons: number;
};

export type WeaponLoadout = {
  weaponId: string;
  refine: number;
};

export type RunComment = {
  id: string;
  userName: string;
  userHandle: string;
  postedLabel: string;
  body: string;
};

export type RunRecordRaw = {
  id: string;
  title: string;
  userName: string;
  userHandle: string;
  postedLabel: string;
  date: string;
  season: string;
  versionLabel: string;
  ruleset: string;
  platform: Platform;
  region: string;
  time: string;
  videoUrl: string;
  summary: string;
  tags: string[];
  likeCount: number;
  shareCount: number;
  mainAttackerId: string;
  declaredMainAttackerIds: string[];
  party: PartyMember[];
  weapons: WeaponLoadout[];
  comments: RunComment[];
};

export type Bracket = 1 | 2 | 3 | 4;

export type RunRecord = RunRecordRaw & {
  charCost: number;
  weaponCost: number;
  totalCost: number;
  bracket: Bracket;
};

export const bracketLabels: Record<Bracket, string> = {
  1: "Bracket 1",
  2: "Bracket 2",
  3: "Bracket 3",
  4: "Bracket 4",
};

const ELEMENT_BY_TAG = {
  Fire: "pyro",
  Water: "hydro",
  Ice: "cryo",
  Electric: "electro",
  Wind: "anemo",
  Rock: "geo",
  Grass: "dendro",
} as const satisfies Record<(typeof CHARACTER_ASSET_PRESETS)[CharacterPresetKey]["elementTag"], Element>;

const WEAPON_CLASS_BY_TAG = {
  Sword: "sword",
  Claymore: "claymore",
  Pole: "polearm",
  Bow: "bow",
  Catalyst: "catalyst",
} as const satisfies Record<(typeof CHARACTER_ASSET_PRESETS)[CharacterPresetKey]["weaponTag"], WeaponClass>;

const STANDARD_CHARACTER_IDS = new Set<CharacterPresetKey>(["diluc", "jean", "keqing", "mona", "qiqi", "tighnari", "dehya"]);

const FOUR_STAR_CHARACTER_IDS = new Set<CharacterPresetKey>([
  "amber",
  "kaeya",
  "lisa",
  "barbara",
  "beidou",
  "bennett",
  "chongyun",
  "fischl",
  "ningguang",
  "noelle",
  "razor",
  "sucrose",
  "xiangling",
  "xingqiu",
  "diona",
  "xinyan",
  "rosaria",
  "yanfei",
  "sayu",
  "kujousara",
  "thoma",
  "gorou",
  "yunjin",
  "kukishinobu",
  "shikanoinheizou",
  "collei",
  "dori",
  "candace",
  "layla",
  "faruzan",
  "yaoyao",
  "mika",
  "kaveh",
  "kirara",
  "lynette",
  "freminet",
  "charlotte",
  "chevreuse",
  "gaming",
  "sethos",
  "kachina",
  "ororon",
  "lanyan",
  "iansan",
  "ifa",
  "dahlia",
]);

function getCharacterType(characterId: CharacterPresetKey): CharacterType {
  if (STANDARD_CHARACTER_IDS.has(characterId)) {
    return "standard";
  }

  if (FOUR_STAR_CHARACTER_IDS.has(characterId)) {
    return "four_star";
  }

  return "limited";
}

function getCharacterShortLabel(displayName: string) {
  const words = displayName
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  const compactName = (words[0] ?? displayName.replace(/\s+/g, "")).slice(0, 2);
  return compactName.toUpperCase();
}

function getWeaponShortLabel(name: string) {
  const words = name
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  const compactName = (words[0] ?? name.replace(/\s+/g, "")).slice(0, 3);
  return compactName.toUpperCase();
}

const baseCharacterDb = Object.fromEntries(
  PRESET_ORDER.map((characterId) => {
    const preset = CHARACTER_ASSET_PRESETS[characterId];

    return [
      characterId,
      {
        id: characterId,
        name: preset.displayName,
        shortLabel: getCharacterShortLabel(preset.displayName),
        element: ELEMENT_BY_TAG[preset.elementTag],
        weaponClass: WEAPON_CLASS_BY_TAG[preset.weaponTag],
        type: getCharacterType(characterId),
      } satisfies Character,
    ];
  }),
) as Record<CharacterPresetKey, Character>;

export const characterDb: Record<string, Character> = {
  ...baseCharacterDb,
  mav: {
    ...baseCharacterDb.mavuika,
    id: "mav",
  },
};

export const selectableCharacters: Character[] = PRESET_ORDER.map((characterId) => characterDb[characterId]);

export const selectableWeapons: Weapon[] = WEAPON_CATALOG.map((weapon) => ({
  id: weapon.id,
  name: weapon.name,
  shortLabel: getWeaponShortLabel(weapon.name),
  tier: weapon.tier,
  weaponClass: weapon.weaponClass,
  imageUrl: toEnkaUiUrl(weapon.iconAssetName),
}));

export const weaponDb: Record<string, Weapon> = Object.fromEntries(
  selectableWeapons.map((weapon) => [weapon.id, weapon]),
);

export const elementStyles: Record<Element, { ring: string; bg: string; text: string }> = {
  pyro: { ring: "ring-[#f97352]", bg: "bg-[#fff1eb]", text: "text-[#8f2d14]" },
  hydro: { ring: "ring-[#4ea1ff]", bg: "bg-[#eef7ff]", text: "text-[#0d4678]" },
  cryo: { ring: "ring-[#7bd6ff]", bg: "bg-[#edfaff]", text: "text-[#0f5675]" },
  electro: { ring: "ring-[#b877ff]", bg: "bg-[#f5efff]", text: "text-[#5a2b8f]" },
  anemo: { ring: "ring-[#58d3ab]", bg: "bg-[#ecfbf5]", text: "text-[#145642]" },
  geo: { ring: "ring-[#d7a74b]", bg: "bg-[#fff6e9]", text: "text-[#7b5411]" },
  dendro: { ring: "ring-[#82c25c]", bg: "bg-[#f1faea]", text: "text-[#345b1e]" },
};

export function calcCharCost(party: PartyMember[]) {
  return party.reduce((sum, member) => {
    const character = characterDb[member.characterId];
    if (!character) {
      return sum;
    }

    if (character.type === "limited") {
      return sum + member.cons + 1;
    }

    if (character.type === "standard") {
      return sum + 1;
    }

    return sum;
  }, 0);
}

export function calcWeaponCost(weapons: WeaponLoadout[]) {
  return weapons.reduce((sum, weaponLoadout) => {
    const weapon = weaponDb[weaponLoadout.weaponId];
    if (!weapon || weapon.tier !== "five_star") {
      return sum;
    }

    return sum + weaponLoadout.refine;
  }, 0);
}

export function calcBracket(charCost: number, weaponCost: number): Bracket {
  if (charCost <= 3 && weaponCost <= 1) {
    return 1;
  }

  if (charCost <= 6 && weaponCost <= 2) {
    return 2;
  }

  if (charCost <= 12 && weaponCost <= 3) {
    return 3;
  }

  return 4;
}

const rawRuns: RunRecordRaw[] = [
  {
    id: "run-npui-high",
    title: "No Mavuika 27:49",
    userName: "R",
    userHandle: "@radicial",
    postedLabel: "3日前",
    date: "2026-03-11",
    season: "6.1",
    versionLabel: "6.1",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "27:49",
    videoUrl: "https://www.youtube.com/watch?v=cUkSP9YgeRA",
    summary:
      "動画概要欄のキャラ情報に合わせた No Mavuika / ver 6.1 のオフメタ編成です。煙緋・ディシア・ヴァレサ・チャスカで 27:49 を出している動画に寄せています。",
    tags: ["高難度", "OffMeta", "No Mavuika", "Varesa", "Chasca", "Yanfei", "Dehya", "PC"],
    likeCount: 68,
    shareCount: 9,
    mainAttackerId: "varesa",
    declaredMainAttackerIds: ["varesa", "chasca"],
    party: [
      { characterId: "yanfei", cons: 0 },
      { characterId: "dehya", cons: 0 },
      { characterId: "varesa", cons: 6 },
      { characterId: "chasca", cons: 6 },
    ],
    weapons: [
      { weaponId: "wanderingEvenstar", refine: 5 },
      { weaponId: "makhairaAquamarine", refine: 5 },
      { weaponId: "vividNotions", refine: 5 },
      { weaponId: "astralVulture", refine: 5 },
    ],
    comments: [],
  },
  {
    id: "run-npui-balance",
    title: "Chasca/Mavuika 28:52",
    userName: "ねこした",
    userHandle: "@nekoshita_g",
    postedLabel: "5日前",
    date: "2026-03-09",
    season: "5.6",
    versionLabel: "5.6",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "28:52",
    videoUrl: "https://www.youtube.com/watch?v=8yGn2O9yVi4",
    summary:
      "動画説明欄の編成情報に合わせて、チャスカ / マーヴィカ / シトラリ / 早柚 の 28:52 記録へ更新したデモデータです。",
    tags: ["高難度", "NPuI", "Chasca", "Mavuika", "Citlali", "Sayu", "PC"],
    likeCount: 41,
    shareCount: 5,
    mainAttackerId: "chasca",
    declaredMainAttackerIds: ["chasca", "mav"],
    party: [
      { characterId: "chasca", cons: 6 },
      { characterId: "mav", cons: 6 },
      { characterId: "citlali", cons: 6 },
      { characterId: "sayu", cons: 6 },
    ],
    weapons: [
      { weaponId: "astralVulture", refine: 5 },
      { weaponId: "blazingSun", refine: 5 },
      { weaponId: "starcaller", refine: 5 },
      { weaponId: "makhairaAquamarine", refine: 3 },
    ],
    comments: [],
  },
  {
    id: "run-budget-bow",
    title: "Chasca/Mavuika 29:45",
    userName: "ねこした",
    userHandle: "@nekoshita_g",
    postedLabel: "4日前",
    date: "2026-03-10",
    season: "5.6",
    versionLabel: "5.6",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "29:45",
    videoUrl: "https://www.youtube.com/watch?v=4ZguwblpL6Q",
    summary:
      "動画説明欄の編成情報に合わせて、チャスカ / マーヴィカ / シトラリ / 早柚 の 29:45 記録へ更新したデモデータです。",
    tags: ["高難度", "NPuI", "Chasca", "Mavuika", "Citlali", "Sayu", "PC"],
    likeCount: 24,
    shareCount: 3,
    mainAttackerId: "chasca",
    declaredMainAttackerIds: ["chasca", "mav"],
    party: [
      { characterId: "chasca", cons: 6 },
      { characterId: "mav", cons: 6 },
      { characterId: "citlali", cons: 6 },
      { characterId: "sayu", cons: 6 },
    ],
    weapons: [
      { weaponId: "astralVulture", refine: 5 },
      { weaponId: "blazingSun", refine: 5 },
      { weaponId: "starcaller", refine: 5 },
      { weaponId: "makhairaAquamarine", refine: 3 },
    ],
    comments: [],
  },
  {
    id: "run-npui-burst",
    title: "Chasca/Mavuika 29:11",
    userName: "ねこした",
    userHandle: "@nekoshita_g",
    postedLabel: "6日前",
    date: "2026-03-08",
    season: "5.6",
    versionLabel: "5.6",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "29:11",
    videoUrl: "https://www.youtube.com/watch?v=UDh_JVpcvns",
    summary:
      "動画説明欄の編成情報に合わせて、チャスカ / マーヴィカ / シトラリ / 早柚 の 29:11 記録へ更新したデモデータです。",
    tags: ["高難度", "NPuI", "Chasca", "Mavuika", "Citlali", "Sayu", "PC"],
    likeCount: 36,
    shareCount: 4,
    mainAttackerId: "chasca",
    declaredMainAttackerIds: ["chasca", "mav"],
    party: [
      { characterId: "chasca", cons: 6 },
      { characterId: "mav", cons: 6 },
      { characterId: "citlali", cons: 6 },
      { characterId: "sayu", cons: 6 },
    ],
    weapons: [
      { weaponId: "astralVulture", refine: 5 },
      { weaponId: "blazingSun", refine: 5 },
      { weaponId: "starcaller", refine: 5 },
      { weaponId: "makhairaAquamarine", refine: 3 },
    ],
    comments: [],
  },
  {
    id: "run-keqing-tech",
    title: "Chasca/Wanderer 35:04",
    userName: "ねこした",
    userHandle: "@nekoshita_g",
    postedLabel: "1週間前",
    date: "2026-03-05",
    season: "5.3",
    versionLabel: "5.3",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "35:04",
    videoUrl: "https://www.youtube.com/watch?v=2pMYLhjdMVw",
    summary:
      "動画説明欄の編成情報に合わせて、チャスカ / マーヴィカ / シトラリ / 放浪者 の ver 5.3 35:04 記録へ更新したデモデータです。",
    tags: ["高難度", "NPuI", "Chasca", "Mavuika", "Citlali", "Wanderer", "PC"],
    likeCount: 19,
    shareCount: 2,
    mainAttackerId: "chasca",
    declaredMainAttackerIds: ["chasca", "wanderer"],
    party: [
      { characterId: "chasca", cons: 6 },
      { characterId: "mav", cons: 6 },
      { characterId: "citlali", cons: 6 },
      { characterId: "wanderer", cons: 0 },
    ],
    weapons: [
      { weaponId: "astralVulture", refine: 5 },
      { weaponId: "blazingSun", refine: 5 },
      { weaponId: "starcaller", refine: 5 },
      { weaponId: "lostPrayer", refine: 2 },
    ],
    comments: [],
  },
  {
    id: "run-amber-offmeta",
    title: "Amber relay 32:18",
    userName: "Mina",
    userHandle: "@mina_route",
    postedLabel: "3日前",
    date: "2026-03-09",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "32:18",
    videoUrl: "https://www.youtube.com/watch?v=J2kzB5xN4fA",
    summary:
      "Amber を軸に移動速度と炎付着を両立させたオフメタ案。Collei と Xingqiu を絡めた処理で低コスト帯の伸びしろを確認するためのデモ記録です。",
    tags: ["高難度", "OffMeta", "Amber", "低コスト", "PC"],
    likeCount: 14,
    shareCount: 2,
    mainAttackerId: "amber",
    declaredMainAttackerIds: ["amber"],
    party: [
      { characterId: "amber", cons: 0 },
      { characterId: "collei", cons: 6 },
      { characterId: "bennett", cons: 6 },
      { characterId: "xingqiu", cons: 6 },
    ],
    weapons: [
      { weaponId: "stringless", refine: 5 },
      { weaponId: "stringless", refine: 5 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "sacrificialSword", refine: 5 },
    ],
    comments: [],
  },
  {
    id: "run-dehya-offmeta",
    title: "Dehya field test 33:18",
    userName: "Kaito",
    userHandle: "@kaito_lab",
    postedLabel: "4日前",
    date: "2026-03-08",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PS5",
    region: "Asia",
    time: "33:18",
    videoUrl: "https://www.youtube.com/watch?v=R6w8mN1pQ2Y",
    summary:
      "Dehya メインのオフメタ検証ルート。Xianyun の移動補助と Furina の火力補助で、通常メタとは違うテンポ感を比較しやすい形にしています。",
    tags: ["高難度", "OffMeta", "Dehya", "PS5"],
    likeCount: 11,
    shareCount: 1,
    mainAttackerId: "dehya",
    declaredMainAttackerIds: ["dehya"],
    party: [
      { characterId: "dehya", cons: 0 },
      { characterId: "xianyun", cons: 0 },
      { characterId: "bennett", cons: 6 },
      { characterId: "furina", cons: 0 },
    ],
    weapons: [
      { weaponId: "serpentSpine", refine: 5 },
      { weaponId: "sacrificialFragments", refine: 5 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "splendor", refine: 1 },
    ],
    comments: [],
  },
  {
    id: "run-new-sayu",
    title: "Sayu start 34:56",
    userName: "Haru",
    userHandle: "@haru_new",
    postedLabel: "1日前",
    date: "2026-03-12",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "34:56",
    videoUrl: "https://www.youtube.com/watch?v=Q1e7L3Kf8nY",
    summary:
      "初投稿の低コスト寄りルート。Sayu で移動を安定させつつ、炎付着の取り回しを優先した構成です。\n\nまだ詰め始めた段階ですが、立ち回りが見やすい形にまとめています。",
    tags: ["高難度", "New", "Sayu", "低コスト", "PC"],
    likeCount: 8,
    shareCount: 1,
    mainAttackerId: "sayu",
    declaredMainAttackerIds: ["sayu"],
    party: [
      { characterId: "sayu", cons: 6 },
      { characterId: "amber", cons: 0 },
      { characterId: "bennett", cons: 6 },
      { characterId: "xingqiu", cons: 6 },
    ],
    weapons: [
      { weaponId: "serpentSpine", refine: 5 },
      { weaponId: "favoniusWarbow", refine: 5 },
      { weaponId: "sacrificialSword", refine: 5 },
      { weaponId: "sacrificialSword", refine: 5 },
    ],
    comments: [],
  },
  {
    id: "run-mid-yelan",
    title: "Yelan mid-cost 31:24",
    userName: "Jun",
    userHandle: "@jun_route",
    postedLabel: "2日前",
    date: "2026-03-10",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "31:24",
    videoUrl: "https://www.youtube.com/watch?v=6sD9vW2mPjE",
    summary:
      "Yelan を主軸にしたミドル帯想定のルート。限定キャラ数と武器コストを抑えつつ、後半の処理速度を大きく落とさないことを狙っています。",
    tags: ["高難度", "Middle", "Yelan", "ミドル帯", "PC"],
    likeCount: 17,
    shareCount: 2,
    mainAttackerId: "yelan",
    declaredMainAttackerIds: ["yelan", "furina"],
    party: [
      { characterId: "yelan", cons: 0 },
      { characterId: "furina", cons: 0 },
      { characterId: "bennett", cons: 6 },
      { characterId: "xingqiu", cons: 6 },
    ],
    weapons: [
      { weaponId: "aquaSimulacra", refine: 1 },
      { weaponId: "splendor", refine: 1 },
      { weaponId: "sacrificialSword", refine: 5 },
      { weaponId: "sacrificialSword", refine: 5 },
    ],
    comments: [],
  },
  {
    id: "run-festival-swap",
    title: "Festival rules 42:00",
    userName: "R",
    userHandle: "@festival_only",
    postedLabel: "8日前",
    date: "2026-03-03",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "祭典",
    platform: "PC",
    region: "Asia",
    time: "42:00",
    videoUrl: "https://www.youtube.com/watch?v=kWRNqHLLlq0",
    summary:
      "祭典ルール側の参考記録。ルールセットは違いますが、炎コアの使い方だけは近いです。",
    tags: ["祭典", "参考用", "Mavuika"],
    likeCount: 12,
    shareCount: 1,
    mainAttackerId: "mav",
    declaredMainAttackerIds: ["mav"],
    party: [
      { characterId: "mav", cons: 0 },
      { characterId: "bennett", cons: 6 },
      { characterId: "xiangling", cons: 6 },
      { characterId: "xingqiu", cons: 6 },
    ],
    weapons: [
      { weaponId: "blazingSun", refine: 1 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "theCatch", refine: 5 },
      { weaponId: "sacrificialSword", refine: 5 },
    ],
    comments: [],
  },
];

function normalizeRun(run: RunRecordRaw): RunRecord {
  const charCost = calcCharCost(run.party);
  const weaponCost = calcWeaponCost(run.weapons);
  const bracket = calcBracket(charCost, weaponCost);

  return {
    ...run,
    charCost,
    weaponCost,
    totalCost: charCost + weaponCost,
    bracket,
  };
}

export const mockRuns = rawRuns.map(normalizeRun);
export const defaultRunId = "run-npui-high";

export function getRunById(runId: string) {
  return mockRuns.find((run) => run.id === runId);
}

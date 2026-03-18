export type Element = "pyro" | "hydro" | "cryo" | "electro" | "anemo" | "geo" | "dendro";
export type CharacterType = "limited" | "standard" | "four_star";
export type WeaponTier = "five_star" | "four_star";
export type WeaponClass = "sword" | "claymore" | "polearm" | "bow" | "catalyst";
export type Platform = "PC" | "Mobile" | "PS5";

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

export const characterDb: Record<string, Character> = {
  mav: {
    id: "mav",
    name: "Mavuika",
    shortLabel: "Mv",
    element: "pyro",
    weaponClass: "claymore",
    type: "limited",
  },
  furina: {
    id: "furina",
    name: "Furina",
    shortLabel: "Fu",
    element: "hydro",
    weaponClass: "sword",
    type: "limited",
  },
  bennett: {
    id: "bennett",
    name: "Bennett",
    shortLabel: "Bn",
    element: "pyro",
    weaponClass: "sword",
    type: "four_star",
  },
  xiangling: {
    id: "xiangling",
    name: "Xiangling",
    shortLabel: "Xl",
    element: "pyro",
    weaponClass: "polearm",
    type: "four_star",
  },
  citlali: {
    id: "citlali",
    name: "Citlali",
    shortLabel: "Ct",
    element: "cryo",
    weaponClass: "catalyst",
    type: "limited",
  },
  xilonen: {
    id: "xilonen",
    name: "Xilonen",
    shortLabel: "Xi",
    element: "geo",
    weaponClass: "sword",
    type: "limited",
  },
  amber: {
    id: "amber",
    name: "Amber",
    shortLabel: "Am",
    element: "pyro",
    weaponClass: "bow",
    type: "four_star",
  },
  xingqiu: {
    id: "xingqiu",
    name: "Xingqiu",
    shortLabel: "Xq",
    element: "hydro",
    weaponClass: "sword",
    type: "four_star",
  },
  collei: {
    id: "collei",
    name: "Collei",
    shortLabel: "Co",
    element: "dendro",
    weaponClass: "bow",
    type: "four_star",
  },
  keqing: {
    id: "keqing",
    name: "Keqing",
    shortLabel: "Kq",
    element: "electro",
    weaponClass: "sword",
    type: "standard",
  },
  zhongli: {
    id: "zhongli",
    name: "Zhongli",
    shortLabel: "Zl",
    element: "geo",
    weaponClass: "polearm",
    type: "limited",
  },
  yelan: {
    id: "yelan",
    name: "Yelan",
    shortLabel: "Ye",
    element: "hydro",
    weaponClass: "bow",
    type: "limited",
  },
  dehya: {
    id: "dehya",
    name: "Dehya",
    shortLabel: "Dh",
    element: "pyro",
    weaponClass: "claymore",
    type: "standard",
  },
  chiori: {
    id: "chiori",
    name: "Chiori",
    shortLabel: "Ch",
    element: "geo",
    weaponClass: "sword",
    type: "limited",
  },
  xianyun: {
    id: "xianyun",
    name: "Xianyun",
    shortLabel: "Xy",
    element: "anemo",
    weaponClass: "catalyst",
    type: "limited",
  },
  wanderer: {
    id: "wanderer",
    name: "Wanderer",
    shortLabel: "Wa",
    element: "anemo",
    weaponClass: "catalyst",
    type: "limited",
  },
  sayu: {
    id: "sayu",
    name: "Sayu",
    shortLabel: "Sa",
    element: "anemo",
    weaponClass: "claymore",
    type: "four_star",
  },
  neuvillette: {
    id: "neuvillette",
    name: "Neuvillette",
    shortLabel: "Ne",
    element: "hydro",
    weaponClass: "catalyst",
    type: "limited",
  },
  chasca: {
    id: "chasca",
    name: "Chasca",
    shortLabel: "Cs",
    element: "anemo",
    weaponClass: "bow",
    type: "limited",
  },
};

export const weaponDb: Record<string, Weapon> = {
  blazingSun: {
    id: "blazingSun",
    name: "A Thousand Blazing Suns",
    shortLabel: "ABS",
    tier: "five_star",
    weaponClass: "claymore",
  },
  splendor: {
    id: "splendor",
    name: "Splendor of Tranquil Waters",
    shortLabel: "SoT",
    tier: "five_star",
    weaponClass: "sword",
  },
  skywardBlade: {
    id: "skywardBlade",
    name: "Skyward Blade",
    shortLabel: "SB",
    tier: "five_star",
    weaponClass: "sword",
  },
  theCatch: {
    id: "theCatch",
    name: "The Catch",
    shortLabel: "TC",
    tier: "four_star",
    weaponClass: "polearm",
  },
  starcaller: {
    id: "starcaller",
    name: "Starcaller Watch",
    shortLabel: "SW",
    tier: "five_star",
    weaponClass: "catalyst",
  },
  peakPatrol: {
    id: "peakPatrol",
    name: "Peak Patrol Song",
    shortLabel: "PP",
    tier: "five_star",
    weaponClass: "sword",
  },
  stringless: {
    id: "stringless",
    name: "The Stringless",
    shortLabel: "TS",
    tier: "four_star",
    weaponClass: "bow",
  },
  sacrificialSword: {
    id: "sacrificialSword",
    name: "Sacrificial Sword",
    shortLabel: "SS",
    tier: "four_star",
    weaponClass: "sword",
  },
  haran: {
    id: "haran",
    name: "Haran Geppaku Futsu",
    shortLabel: "HG",
    tier: "five_star",
    weaponClass: "sword",
  },
  homa: {
    id: "homa",
    name: "Staff of Homa",
    shortLabel: "Ho",
    tier: "five_star",
    weaponClass: "polearm",
  },
  serpentSpine: {
    id: "serpentSpine",
    name: "Serpent Spine",
    shortLabel: "SS",
    tier: "four_star",
    weaponClass: "claymore",
  },
  sacrificialFragments: {
    id: "sacrificialFragments",
    name: "Sacrificial Fragments",
    shortLabel: "SF",
    tier: "four_star",
    weaponClass: "catalyst",
  },
  favoniusWarbow: {
    id: "favoniusWarbow",
    name: "Favonius Warbow",
    shortLabel: "FW",
    tier: "four_star",
    weaponClass: "bow",
  },
  aquaSimulacra: {
    id: "aquaSimulacra",
    name: "Aqua Simulacra",
    shortLabel: "AQ",
    tier: "five_star",
    weaponClass: "bow",
  },
};

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
    title: "【Npui】27:49 (high)",
    userName: "らんだむ",
    userHandle: "@luna3",
    postedLabel: "3日前",
    date: "2026-03-11",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "27:49",
    videoUrl: "https://www.youtube.com/watch?v=cUkSP9YgeRA",
    summary:
      "Natlan 側の密集を先に崩してから Npui 側へ戻る、短期決戦寄りの高難度ルートです。\n\n炎付着を切らさないことと、Furina の burst を最後まで温存しすぎないことが今回の安定ポイントでした。細かいルート取りはまだ詰め切れていないので、更新余地はあります。",
    tags: ["高難度", "Natlan", "Mavuika", "Furina", "高速処理", "炎共鳴", "短期決戦", "PC"],
    likeCount: 68,
    shareCount: 9,
    mainAttackerId: "mav",
    declaredMainAttackerIds: ["mav", "furina"],
    party: [
      { characterId: "mav", cons: 2 },
      { characterId: "bennett", cons: 6 },
      { characterId: "furina", cons: 1 },
      { characterId: "xiangling", cons: 6 },
    ],
    weapons: [
      { weaponId: "blazingSun", refine: 2 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "splendor", refine: 1 },
      { weaponId: "theCatch", refine: 5 },
    ],
    comments: [
      {
        id: "c1",
        userName: "R",
        userHandle: "@route_lab",
        postedLabel: "2日前",
        body: "炎主人公入りよりも、この並びの方が雑魚処理のばらつきが少なく見えました。",
      },
      {
        id: "c2",
        userName: "Bird",
        userHandle: "@amber_main",
        postedLabel: "2日前",
        body: "後半の Furina burst タイミングがかなり参考になります。ルート更新あればまた見たいです。",
      },
    ],
  },
  {
    id: "run-npui-balance",
    title: "【Npui】28:14 (stable)",
    userName: "Luna",
    userHandle: "@luna_route",
    postedLabel: "5日前",
    date: "2026-03-09",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "28:14",
    videoUrl: "https://www.youtube.com/watch?v=8yGn2O9yVi4",
    summary:
      "Citlali を入れて事故率を下げた安定寄りの編成。終盤の移動を少し長めに取っている代わりに、被弾リカバリーがしやすいです。",
    tags: ["高難度", "安定寄り", "Mavuika", "Citlali", "PC+PC"],
    likeCount: 41,
    shareCount: 5,
    mainAttackerId: "mav",
    declaredMainAttackerIds: ["mav"],
    party: [
      { characterId: "mav", cons: 2 },
      { characterId: "bennett", cons: 6 },
      { characterId: "citlali", cons: 0 },
      { characterId: "furina", cons: 1 },
    ],
    weapons: [
      { weaponId: "blazingSun", refine: 2 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "starcaller", refine: 1 },
      { weaponId: "splendor", refine: 1 },
    ],
    comments: [],
  },
  {
    id: "run-budget-bow",
    title: "Amber route 32:10",
    userName: "Bird",
    userHandle: "@amber_main",
    postedLabel: "4日前",
    date: "2026-03-10",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "Mobile",
    region: "Asia",
    time: "32:10",
    videoUrl: "https://www.youtube.com/watch?v=4ZguwblpL6Q",
    summary:
      "Amber 主軸の低コスト寄りルート。ベースは違いますが、炎キャラ軸での雑魚散らし方が近いです。",
    tags: ["高難度", "Budget", "Amber", "Mobile"],
    likeCount: 24,
    shareCount: 3,
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
    id: "run-npui-burst",
    title: "Mavuika burst 27:58",
    userName: "RouteLab",
    userHandle: "@route_lab",
    postedLabel: "6日前",
    date: "2026-03-08",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PS5",
    region: "Asia",
    time: "27:58",
    videoUrl: "https://www.youtube.com/watch?v=UDh_JVpcvns",
    summary:
      "Xilonen 採用で前半の burst 密度を上げた編成。操作難度は上がりますが、Mavuika の回転はかなり近いです。",
    tags: ["高難度", "Mavuika", "Xilonen", "PS5"],
    likeCount: 36,
    shareCount: 4,
    mainAttackerId: "mav",
    declaredMainAttackerIds: ["mav"],
    party: [
      { characterId: "mav", cons: 2 },
      { characterId: "xilonen", cons: 0 },
      { characterId: "bennett", cons: 6 },
      { characterId: "furina", cons: 1 },
    ],
    weapons: [
      { weaponId: "blazingSun", refine: 2 },
      { weaponId: "peakPatrol", refine: 1 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "splendor", refine: 1 },
    ],
    comments: [],
  },
  {
    id: "run-keqing-tech",
    title: "Keqing tech 30:42",
    userName: "Random",
    userHandle: "@random_tech",
    postedLabel: "1週間前",
    date: "2026-03-05",
    season: "5.3",
    versionLabel: "Luna3",
    ruleset: "高難度",
    platform: "PC",
    region: "Asia",
    time: "30:42",
    videoUrl: "https://www.youtube.com/watch?v=2pMYLhjdMVw",
    summary:
      "メインアタッカーは違いますが、Bennett と Xiangling を中心にした湧き処理の組み立てが近いオフメタ案です。",
    tags: ["高難度", "OffMeta", "Keqing", "PC"],
    likeCount: 19,
    shareCount: 2,
    mainAttackerId: "keqing",
    declaredMainAttackerIds: ["keqing"],
    party: [
      { characterId: "keqing", cons: 0 },
      { characterId: "zhongli", cons: 0 },
      { characterId: "bennett", cons: 6 },
      { characterId: "xiangling", cons: 6 },
    ],
    weapons: [
      { weaponId: "haran", refine: 1 },
      { weaponId: "homa", refine: 1 },
      { weaponId: "skywardBlade", refine: 1 },
      { weaponId: "theCatch", refine: 5 },
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

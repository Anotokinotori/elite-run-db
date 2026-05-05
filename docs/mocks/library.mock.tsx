import React, { useMemo, useState } from "react";

const HERO_IMAGE_URL = "https://cdn.asoworld.com/img/865f059851cb4fb0a1584a711a8bd338.jpg";
const ENKA_UI_BASE = "https://enka.network/ui";
const AMBR_UI_BASE = "https://api.ambr.top/assets/UI";

const BAR_W = 1200;
const BAR_H = 98;
const SLANT = 26;
const B1_TOP = 285;
const B2_TOP = 505;
const B3_TOP = 845;
const B4_TOP = 1030;
const B1_BOTTOM = B1_TOP + SLANT;
const B2_BOTTOM = B2_TOP + SLANT;
const B3_BOTTOM = B3_TOP + SLANT;
const B4_BOTTOM = B4_TOP + SLANT;

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
};

const PANELS = {
  character: {
    label: "キャラ・編成",
    hitLeft: 0,
    hitRight: B1_TOP + SLANT / 2,
    path: `M0 0 H${B1_TOP} L${B1_BOTTOM} ${BAR_H} H0 Z`,
    fill: UI.panel,
    hover: UI.panelHover,
  },
  build: {
    label: "凸・武器",
    hitLeft: B1_TOP + SLANT / 2,
    hitRight: B2_TOP + SLANT / 2,
    path: `M${B1_TOP} 0 H${B2_TOP} L${B2_BOTTOM} ${BAR_H} H${B1_BOTTOM} Z`,
    fill: UI.panel,
    hover: UI.panelHover,
  },
  category: {
    label: "カテゴリ・期間",
    hitLeft: B2_TOP + SLANT / 2,
    hitRight: B3_TOP + SLANT / 2,
    path: `M${B2_TOP} 0 H${B3_TOP} L${B3_BOTTOM} ${BAR_H} H${B2_BOTTOM} Z`,
    fill: UI.panel,
    hover: UI.panelHover,
  },
  tag: {
    label: "タグ",
    hitLeft: B3_TOP + SLANT / 2,
    hitRight: B4_TOP + SLANT / 2,
    path: `M${B3_TOP} 0 H${B4_TOP} L${B4_BOTTOM} ${BAR_H} H${B3_BOTTOM} Z`,
    fill: UI.panel,
    hover: UI.panelHover,
  },
  submit: {
    label: "検索",
    hitLeft: B4_TOP + SLANT / 2,
    hitRight: BAR_W,
    path: `M${B4_TOP} 0 H${BAR_W} V${BAR_H} H${B4_BOTTOM} Z`,
    fill: "url(#submitBase)",
    hover: "url(#submitHover)",
  },
};

const CHARACTER_PRESETS = {
  yanfei: { displayName: "Yanfei", internalName: "Feiyan", element: "pyro" },
  dehya: { displayName: "Dehya", internalName: "Dehya", element: "pyro" },
  varesa: { displayName: "Varesa", internalName: "Varesa", element: "electro" },
  chasca: { displayName: "Chasca", internalName: "Chasca", element: "anemo" },
  mav: { displayName: "Mavuika", internalName: "Mavuika", element: "pyro" },
  mavuika: { displayName: "Mavuika", internalName: "Mavuika", element: "pyro" },
  xilonen: { displayName: "Xilonen", internalName: "Xilonen", element: "geo" },
  citlali: { displayName: "Citlali", internalName: "Citlali", element: "cryo" },
  sayu: { displayName: "Sayu", internalName: "Sayu", element: "anemo" },
  wanderer: { displayName: "Wanderer", internalName: "Wanderer", element: "anemo" },
  amber: { displayName: "Amber", internalName: "Ambor", element: "pyro" },
  collei: { displayName: "Collei", internalName: "Collei", element: "dendro" },
  bennett: { displayName: "Bennett", internalName: "Bennett", element: "pyro" },
  xingqiu: { displayName: "Xingqiu", internalName: "Xingqiu", element: "hydro" },
  xianyun: { displayName: "Xianyun", internalName: "Liuyun", element: "anemo" },
  furina: { displayName: "Furina", internalName: "Furina", element: "hydro" },
  yelan: { displayName: "Yelan", internalName: "Yelan", element: "hydro" },
  xiangling: { displayName: "Xiangling", internalName: "Xiangling", element: "pyro" },
  keqing: { displayName: "Keqing", internalName: "Keqing", element: "electro" },
  nahida: { displayName: "Nahida", internalName: "Nahida", element: "dendro" },
};

const ELEMENT_STYLE = {
  pyro: { ring: "ring-[#f97352]", text: "text-[#8f2d14]", glow: "shadow-[0_0_18px_rgba(249,115,82,0.34)]" },
  hydro: { ring: "ring-[#4ea1ff]", text: "text-[#0d4678]", glow: "shadow-[0_0_18px_rgba(78,161,255,0.34)]" },
  cryo: { ring: "ring-[#7bd6ff]", text: "text-[#0f5675]", glow: "shadow-[0_0_18px_rgba(123,214,255,0.32)]" },
  electro: { ring: "ring-[#b877ff]", text: "text-[#5a2b8f]", glow: "shadow-[0_0_18px_rgba(184,119,255,0.34)]" },
  anemo: { ring: "ring-[#58d3ab]", text: "text-[#145642]", glow: "shadow-[0_0_18px_rgba(88,211,171,0.32)]" },
  geo: { ring: "ring-[#d7a74b]", text: "text-[#7b5411]", glow: "shadow-[0_0_18px_rgba(215,167,75,0.32)]" },
  dendro: { ring: "ring-[#82c25c]", text: "text-[#345b1e]", glow: "shadow-[0_0_18px_rgba(130,194,92,0.32)]" },
};

const CHARACTER_OPTIONS = [
  { id: "mavuika", name: "マーヴィカ", element: "炎", type: "limited" },
  { id: "chasca", name: "チャスカ", element: "風", type: "limited" },
  { id: "xilonen", name: "シロネン", element: "岩", type: "limited" },
  { id: "furina", name: "フリーナ", element: "水", type: "limited" },
  { id: "yelan", name: "夜蘭", element: "水", type: "limited" },
  { id: "xianyun", name: "閑雲", element: "風", type: "limited" },
  { id: "wanderer", name: "放浪者", element: "風", type: "limited" },
  { id: "sayu", name: "早柚", element: "風", type: "four_star" },
  { id: "keqing", name: "刻晴", element: "雷", type: "standard" },
  { id: "dehya", name: "ディシア", element: "炎", type: "standard" },
  { id: "bennett", name: "ベネット", element: "炎", type: "four_star" },
  { id: "xiangling", name: "香菱", element: "炎", type: "four_star" },
  { id: "nahida", name: "ナヒーダ", element: "草", type: "limited" },
  { id: "xingqiu", name: "行秋", element: "水", type: "four_star" },
  { id: "amber", name: "Amber", element: "炎", type: "four_star" },
];

const ELEMENT_OPTIONS = ["全て", "炎", "水", "風", "雷", "氷", "岩", "草"];
const MODAL_FILTER_TABS = [
  { key: "party", label: "編成キャラ" },
  { key: "main", label: "メインアタッカー" },
];
const TARGET_OPTIONS = ["含める", "除外する"];
const RULE_OPTIONS = ["NPUI", "PUI", "PUA", "Npui-Alt", "Weapon-Alt", "Multi-PUI", "Multi-UI", "Multi-UA"];
const PLAY_STYLE_OPTIONS = ["ソロ", "2人マルチ", "3人マルチ", "4人マルチ"];
const FOOD_OPTIONS = ["飯バフなし", "飯バフあり"];
const DEVICE_OPTIONS = ["PC", "PS5", "Mobile", "PC+PC"];
const VERSION_OPTIONS = ["Luna3", "Luna2", "Luna1", "5.8", "5.7", "5.6", "5.5", "5.4", "5.3", "5.2", "5.1", "5.0"];
const COST_OPTIONS = ["Low", "Middle", "High", "Unlimited"];
const CONSTELLATION_OPTIONS = ["無凸", "1凸", "2凸", "3凸", "4凸", "5凸", "完凸"];
const WEAPON_OPTIONS = ["モチーフ武器", "星5武器", "星4武器", "星3武器", "鍛造武器", "配布武器", "武器自由"];
const REFINE_OPTIONS = ["R1", "R2", "R3", "R4", "R5", "精錬指定なし"];

const TAG_GROUPS = [
  { label: "デバイス", tags: ["PC", "PS5", "Mobile", "PC+PC"] },
  { label: "ルール・区分", tags: ["高難度", "祭典", "参考用", "Natlan", "Middle", "ミドル帯", "低コスト", "Budget", "New", "OffMeta"] },
  { label: "編成傾向", tags: ["高速処理", "短期決戦", "安定寄り", "炎共鳴"] },
  { label: "関連キャラ", tags: ["Amber", "Citlali", "Dehya", "Furina", "Keqing", "Mavuika", "Sayu", "Xilonen", "Yelan"] },
];

const records = [
  {
    id: "run-npui-high",
    title: "No Mavuika 27:49",
    player: "R",
    handle: "@radicial",
    time: "27:49",
    season: "6.1",
    versionLabel: "6.1",
    platform: "PC",
    ruleset: "高難度",
    videoUrl: "https://www.youtube.com/watch?v=cUkSP9YgeRA",
    summary: "No Mavuika / ver 6.1 のオフメタ編成。煙緋・ディシア・ヴァレサ・チャスカで 27:49 を出している動画に寄せたデータです。",
    tags: ["高難度", "OffMeta", "No Mavuika", "Varesa", "Chasca", "Yanfei", "Dehya", "PC"],
    party: [
      { id: "yanfei", cons: 0 },
      { id: "dehya", cons: 0 },
      { id: "varesa", cons: 6 },
      { id: "chasca", cons: 6 },
    ],
    gradient: "from-[#1c102f] via-[#6f2cc7] to-[#f17bff]",
  },
  {
    id: "run-npui-balance",
    title: "Chasca/Mavuika 28:52",
    player: "ねこした",
    handle: "@nekoshita_g",
    time: "28:52",
    season: "5.6",
    versionLabel: "5.6",
    platform: "PC",
    ruleset: "高難度",
    videoUrl: "https://www.youtube.com/watch?v=8yGn2O9yVi4",
    summary: "チャスカ / マーヴィカ / シトラリ / 早柚 の 28:52 記録。現行メタ寄りの速度感を確認しやすいサンプルです。",
    tags: ["高難度", "NPuI", "Chasca", "Mavuika", "Citlali", "Sayu", "PC"],
    party: [
      { id: "chasca", cons: 6 },
      { id: "mav", cons: 6 },
      { id: "citlali", cons: 6 },
      { id: "sayu", cons: 6 },
    ],
    gradient: "from-[#220b07] via-[#8f3d14] to-[#f07b27]",
  },
  {
    id: "run-budget-bow",
    title: "Chasca/Mavuika 29:45",
    player: "ねこした",
    handle: "@nekoshita_g",
    time: "29:45",
    season: "5.6",
    versionLabel: "5.6",
    platform: "PC",
    ruleset: "高難度",
    videoUrl: "https://www.youtube.com/watch?v=4ZguwblpL6Q",
    summary: "同系統のチャスカ編成で 29分台中盤。28秒台との差分確認に向いた比較用記録です。",
    tags: ["高難度", "NPuI", "Chasca", "Mavuika", "Citlali", "Sayu", "PC"],
    party: [
      { id: "chasca", cons: 6 },
      { id: "mav", cons: 6 },
      { id: "citlali", cons: 6 },
      { id: "sayu", cons: 6 },
    ],
    gradient: "from-[#07152b] via-[#1f65a6] to-[#a3d7ff]",
  },
  {
    id: "run-keqing-tech",
    title: "Chasca/Wanderer 35:04",
    player: "ねこした",
    handle: "@nekoshita_g",
    time: "35:04",
    season: "5.3",
    versionLabel: "5.3",
    platform: "PC",
    ruleset: "高難度",
    videoUrl: "https://www.youtube.com/watch?v=2pMYLhjdMVw",
    summary: "チャスカ / マーヴィカ / シトラリ / 放浪者の ver 5.3 記録。旧環境比較として残しておきたいサンプル。",
    tags: ["高難度", "NPuI", "Chasca", "Mavuika", "Citlali", "Wanderer", "PC"],
    party: [
      { id: "chasca", cons: 6 },
      { id: "mav", cons: 6 },
      { id: "citlali", cons: 6 },
      { id: "wanderer", cons: 0 },
    ],
    gradient: "from-[#102425] via-[#198e7d] to-[#82f1cf]",
  },
  {
    id: "run-amber-offmeta",
    title: "Amber relay 32:18",
    player: "Mina",
    handle: "@mina_route",
    time: "32:18",
    season: "5.3",
    versionLabel: "Luna3",
    platform: "PC",
    ruleset: "高難度",
    videoUrl: "https://www.youtube.com/watch?v=J2kzB5xN4fA",
    summary: "Amber を軸に移動速度と炎付着を両立させたオフメタ案。低コスト帯の伸びしろ確認用。",
    tags: ["高難度", "OffMeta", "Amber", "低コスト", "PC"],
    party: [
      { id: "amber", cons: 0 },
      { id: "collei", cons: 6 },
      { id: "bennett", cons: 6 },
      { id: "xingqiu", cons: 6 },
    ],
    gradient: "from-[#1b1307] via-[#7b5215] to-[#d6a03b]",
  },
  {
    id: "run-dehya-offmeta",
    title: "Dehya field test 33:18",
    player: "Kaito",
    handle: "@kaito_lab",
    time: "33:18",
    season: "5.3",
    versionLabel: "Luna3",
    platform: "PS5",
    ruleset: "高難度",
    videoUrl: "https://www.youtube.com/watch?v=R6w8mN1pQ2Y",
    summary: "Dehya メインのオフメタ検証ルート。Xianyun の移動補助と Furina の火力補助で比較しやすい形。",
    tags: ["高難度", "OffMeta", "Dehya", "PS5"],
    party: [
      { id: "dehya", cons: 0 },
      { id: "xianyun", cons: 0 },
      { id: "bennett", cons: 6 },
      { id: "furina", cons: 0 },
    ],
    gradient: "from-[#220b07] via-[#9e3917] to-[#ff7442]",
  },
];

const sidebarActions = [
  { icon: "clock", label: "検索履歴", count: "8" },
  { icon: "eye", label: "閲覧履歴", count: "12" },
  { icon: "star", label: "お気に入りの記録", count: "5" },
];

const compareRecords = records.slice(0, 2);

function pct(value) {
  return `${(value / BAR_W) * 100}%`;
}

function getYouTubeId(url) {
  const match = url.match(/[?&]v=([^&]+)/) ?? url.match(/youtu\.be\/([^?&]+)/);
  return match?.[1] ?? "";
}

function youtubeThumbnailUrl(url, quality = "maxresdefault") {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : "";
}

function characterIconUrl(characterId, mirrorBase = ENKA_UI_BASE) {
  const preset = CHARACTER_PRESETS[characterId] ?? CHARACTER_PRESETS[characterId?.toLowerCase?.()];
  if (!preset) return "";
  return `${mirrorBase}/UI_AvatarIcon_${preset.internalName}.png`;
}

function getCharacterName(characterId) {
  return CHARACTER_PRESETS[characterId]?.displayName ?? characterId;
}

function getCharacterElement(characterId) {
  return CHARACTER_PRESETS[characterId]?.element ?? "anemo";
}

function Icon({ name, className = "" }) {
  const paths = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    down: <path d="m6 9 6 6 6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
    user: <path d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
    clock: <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    eye: <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z" />,
    bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    target: <path d="M12 2v4M12 18v4M22 12h-4M6 12H2M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    play: <path d="M8 5v14l11-7-11-7Z" />,
    external: <path d="M14 3h7v7M10 14 21 3M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-white/10 bg-black/95 text-white backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <button className="grid size-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white">
            <Icon name="menu" className="size-5" />
          </button>
          <button className="text-[22px] font-black tracking-[-0.04em]">精鋭狩りDB</button>
          <button className="flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-[13px] font-bold text-white/85">
            Luna3
            <Icon name="down" className="size-3" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden h-9 items-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-bold text-white/90 transition hover:bg-white/15 sm:flex">
            <Icon name="plus" className="size-4" />
            記録申請
          </button>
          <button className="relative grid size-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10">
            <span className="absolute right-2 top-1.5 size-1.5 rounded-full bg-[#ff2f23]" />
            <Icon name="bell" className="size-5" />
          </button>
          <button className="grid size-9 place-items-center rounded-full bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.24)]">
            <Icon name="user" className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="relative h-[320px] w-full overflow-hidden bg-cover bg-center pt-14 md:h-[560px]"
      style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
      aria-label="Hero visual"
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#f2f3f5]/40 to-[#f2f3f5]" />
    </section>
  );
}

function ResponsiveStyle() {
  return (
    <style>{`
      .filter-search-bar { container-type: inline-size; }
      .filter-panel-content {
        --icon-size: clamp(24px, 3.2cqw, 36px);
        --arrow-size: clamp(24px, 3.8cqw, 46px);
        --title-size: clamp(15px, 2.05cqw, 24px);
        display: grid;
        grid-template-columns: var(--icon-size) minmax(0, 1fr) var(--arrow-size);
        align-items: center;
        gap: clamp(6px, 1.1cqw, 14px);
        height: 100%;
        padding-inline: clamp(10px, 1.8cqw, 22px) clamp(14px, 2.4cqw, 30px);
      }
      .filter-panel-icon { width: var(--icon-size); height: var(--icon-size); display: grid; place-items: center; }
      .filter-panel-title {
        min-width: 0;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        color: #333333;
        font-size: var(--title-size);
        line-height: 1.05;
        font-weight: 900;
        letter-spacing: -0.055em;
        white-space: nowrap;
        word-break: keep-all;
        overflow-wrap: normal;
      }
      .filter-panel-title-part { display: inline-block; flex: 0 0 auto; }
      .filter-panel-arrow { color: #6f6f6f; font-size: var(--arrow-size); line-height: 1; font-weight: 300; justify-self: end; }
      .filter-submit-label { font-size: clamp(16px, 2.2cqw, 26px); }
      @container (max-width: 820px) {
        .filter-panel-content { --icon-size: clamp(20px, 2.8cqw, 28px); --arrow-size: clamp(18px, 2.4cqw, 28px); --title-size: clamp(13px, 1.9cqw, 18px); gap: 5px; padding-inline: 10px 16px; }
      }
      @container (max-width: 700px) { .filter-panel-title { flex-wrap: wrap; white-space: normal; } }
      @container (max-width: 640px) {
        .filter-panel-content { grid-template-columns: minmax(0, 1fr) 16px; --title-size: clamp(11px, 2.55cqw, 15px); padding-inline: 8px 10px; }
        .filter-panel-icon { display: none; }
        .filter-panel-arrow { font-size: 20px; }
      }
      @container (max-width: 500px) {
        .filter-panel-content { grid-template-columns: minmax(0, 1fr); padding-inline: 6px; }
        .filter-panel-arrow { display: none; }
        .filter-panel-title { justify-content: center; text-align: center; font-size: clamp(10px, 2.8cqw, 13px); letter-spacing: -0.08em; }
        .filter-submit-label { font-size: clamp(13px, 3cqw, 18px); }
      }
    `}</style>
  );
}

function FilterTabs() {
  const [openKey, setOpenKey] = useState("character");
  const [hoverKey, setHoverKey] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState({
    party: { include: ["mavuika", "xilonen"], exclude: [] },
    main: { include: [], exclude: [] },
  });
  const [filters, setFilters] = useState({
    constellation: "完凸",
    weapon: "モチーフ武器",
    refine: "R5",
    cost: "Unlimited",
    rule: "NPUI",
    playStyle: "ソロ",
    food: "飯バフなし",
    device: "PC",
    version: "Luna3",
  });
  const [selectedTags, setSelectedTags] = useState(["参考用", "高速処理", "PC"]);
  const visualKey = hoverKey ?? openKey;

  const summary = useMemo(() => {
    const partyCount = selectedCharacters.party.include.length + selectedCharacters.party.exclude.length;
    const mainCount = selectedCharacters.main.include.length + selectedCharacters.main.exclude.length;
    return [
      partyCount ? `編成:${partyCount}` : null,
      mainCount ? `メイン:${mainCount}` : null,
      filters.rule,
      filters.playStyle,
      filters.version,
      selectedTags.length ? `タグ:${selectedTags.length}` : null,
    ].filter(Boolean).join(" / ");
  }, [filters, selectedCharacters, selectedTags]);

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleCharacter(tabKey, targetKey, id) {
    setSelectedCharacters((current) => {
      const oppositeKey = targetKey === "include" ? "exclude" : "include";
      return {
        ...current,
        [tabKey]: {
          ...current[tabKey],
          [targetKey]: current[tabKey][targetKey].includes(id)
            ? current[tabKey][targetKey].filter((item) => item !== id)
            : [...current[tabKey][targetKey], id],
          [oppositeKey]: current[tabKey][oppositeKey].filter((item) => item !== id),
        },
      };
    });
  }

  function toggleTag(tag) {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  function clearAll() {
    setSelectedCharacters({ party: { include: [], exclude: [] }, main: { include: [], exclude: [] } });
    setSelectedTags([]);
    setFilters({ constellation: "完凸", weapon: "モチーフ武器", refine: "R5", cost: "Unlimited", rule: "NPUI", playStyle: "ソロ", food: "飯バフなし", device: "PC", version: "Luna3" });
  }

  return (
    <div className="relative z-10 mx-auto -mt-12 max-w-[1340px] px-4 lg:px-8" style={{ color: UI.textMain }}>
      <ResponsiveStyle />
      <section className="shrink-0 overflow-hidden border shadow-[0_18px_45px_rgba(21,27,38,0.14)]" style={{ borderColor: UI.cardBorder }}>
        <SectionHeader summary={summary} />
        <div className="h-px bg-white/10" />
        <div className="p-4" style={{ background: UI.sectionBody }}>
          <SearchBar openKey={openKey} visualKey={visualKey} setOpenKey={setOpenKey} setHoverKey={setHoverKey} />
          <FullAccordion
            openKey={openKey}
            filters={filters}
            setFilter={setFilter}
            selectedCharacters={selectedCharacters}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            clearAll={clearAll}
            openModal={setModal}
          />
        </div>
      </section>

      {modal?.type === "characters" ? (
        <HomeLikeCharacterModal selectedCharacters={selectedCharacters} onToggleCharacter={toggleCharacter} onClose={() => setModal(null)} />
      ) : null}
    </div>
  );
}

function SectionHeader({ summary }) {
  return (
    <header className="relative flex min-h-[55px] items-stretch bg-[#111116]">
      <div className="flex min-w-0 flex-1 items-center gap-4 px-5">
        <span className="inline-flex h-[22px] shrink-0 items-center border border-white/40 px-3 text-[12px] font-bold uppercase leading-none tracking-[0.14em] text-white/65">SEARCH</span>
        <span className="shrink-0 text-[19px] font-black leading-none tracking-[0.06em] text-[#d9d9d9]">条件から記録を探す</span>
        <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-white/25" />
        <span className="truncate text-[12px] font-normal uppercase leading-none tracking-[0.08em] text-white/40">{summary || "FILTER ENTRANCE"}</span>
      </div>
      <time className="hidden shrink-0 items-center border-l border-white/10 px-5 text-[12px] font-normal leading-none tracking-[0.04em] text-white/35 sm:flex">最終更新 : 5/04</time>
    </header>
  );
}

function SearchBar({ openKey, visualKey, setOpenKey, setHoverKey }) {
  const visualPanel = visualKey ? PANELS[visualKey] : null;
  function handleButtonClick(id) {
    if (id === "submit") return;
    setOpenKey(id);
  }

  return (
    <div className="filter-search-bar relative h-[98px] overflow-hidden bg-white shadow-[0_8px_18px_rgba(0,0,0,0.1)]" onMouseLeave={() => setHoverKey(null)} style={{ isolation: "isolate" }}>
      <svg className="absolute inset-0 z-0 h-full w-full" viewBox={`0 0 ${BAR_W} ${BAR_H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="submitBase" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={UI.submitTop} />
            <stop offset="100%" stopColor={UI.submitBottom} />
          </linearGradient>
          <linearGradient id="submitHover" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={UI.submitHoverTop} />
            <stop offset="100%" stopColor={UI.submitHoverBottom} />
          </linearGradient>
        </defs>
        {Object.entries(PANELS).map(([key, panel]) => <path key={`base-${key}`} d={panel.path} fill={panel.fill} />)}
        {openKey && PANELS[openKey] ? <path d={PANELS[openKey].path} fill={UI.panelActive} /> : null}
        {visualPanel ? <path d={visualPanel.path} fill={visualPanel.hover} /> : null}
        <path d={`M${B1_TOP} 0 L${B1_BOTTOM} ${BAR_H}`} stroke={UI.panelBorder} strokeWidth="1.2" />
        <path d={`M${B2_TOP} 0 L${B2_BOTTOM} ${BAR_H}`} stroke={UI.panelBorder} strokeWidth="1.2" />
        <path d={`M${B3_TOP} 0 L${B3_BOTTOM} ${BAR_H}`} stroke={UI.panelBorder} strokeWidth="1.2" />
        <path d={`M${B4_TOP} 0 L${B4_BOTTOM} ${BAR_H}`} stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
      </svg>
      <HitButton id="character" panel={PANELS.character} setHoverKey={setHoverKey} onClick={handleButtonClick}><PanelContent icon="character" title="キャラ・編成" active={openKey === "character"} /></HitButton>
      <HitButton id="build" panel={PANELS.build} setHoverKey={setHoverKey} onClick={handleButtonClick}><PanelContent icon="weapon" title="凸・武器" active={openKey === "build"} /></HitButton>
      <HitButton id="category" panel={PANELS.category} setHoverKey={setHoverKey} onClick={handleButtonClick}><PanelContent icon="calendar" title="カテゴリ・期間" active={openKey === "category"} /></HitButton>
      <HitButton id="tag" panel={PANELS.tag} setHoverKey={setHoverKey} onClick={handleButtonClick}><PanelContent icon="tag" title="タグ" active={openKey === "tag"} /></HitButton>
      <HitButton id="submit" panel={PANELS.submit} setHoverKey={setHoverKey} onClick={handleButtonClick}><span className="filter-submit-label relative z-10 flex h-full w-full items-center justify-center pl-3 font-black tracking-wide text-white">検索</span></HitButton>
    </div>
  );
}

function FullAccordion({ openKey, filters, setFilter, selectedCharacters, selectedTags, toggleTag, clearAll, openModal }) {
  return (
    <div className="border-x border-b bg-white px-4 py-4 shadow-[0_10px_16px_rgba(0,0,0,0.05)]" style={{ borderColor: UI.panelBorder }}>
      {openKey === "character" ? <CharacterFullPanel selectedCharacters={selectedCharacters} openModal={openModal} /> : null}
      {openKey === "build" ? <BuildFullPanel filters={filters} setFilter={setFilter} /> : null}
      {openKey === "category" ? <CategoryFullPanel filters={filters} setFilter={setFilter} /> : null}
      {openKey === "tag" ? <TagFullPanel selectedTags={selectedTags} toggleTag={toggleTag} /> : null}
      <div className="mt-4 flex justify-end border-t pt-3" style={{ borderColor: UI.panelBorder }}>
        <button onClick={clearAll} className="h-9 shrink-0 border bg-white px-4 text-[12px] font-black text-[#666] transition hover:bg-[#f1f1f1]" style={{ borderColor: UI.panelBorder }}>条件をクリア</button>
      </div>
    </div>
  );
}

function CharacterFullPanel({ selectedCharacters, openModal }) {
  const partyIncludeNames = selectedCharacters.party.include.map(resolveCharacterName);
  const partyExcludeNames = selectedCharacters.party.exclude.map(resolveCharacterName);
  const mainIncludeNames = selectedCharacters.main.include.map(resolveCharacterName);
  const mainExcludeNames = selectedCharacters.main.exclude.map(resolveCharacterName);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <button onClick={() => openModal({ type: "characters" })} className="group flex min-h-[96px] items-center justify-center border bg-[#111116] p-4 text-left text-white transition hover:bg-[#24242a]">
        <span className="text-[18px] font-black tracking-[0.04em]">キャラ選択を開く</span>
      </button>
      <div className="grid gap-3 md:grid-cols-2">
        <SummaryBox title="編成キャラに含める" items={partyIncludeNames} empty="未指定" />
        <SummaryBox title="編成キャラから除外" items={partyExcludeNames} empty="未指定" />
        <SummaryBox title="メインアタッカーに含める" items={mainIncludeNames} empty="未指定" />
        <SummaryBox title="メインアタッカーから除外" items={mainExcludeNames} empty="未指定" />
      </div>
    </div>
  );
}

function BuildFullPanel({ filters, setFilter }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <SelectBlock title="凸数" value={filters.constellation} options={CONSTELLATION_OPTIONS} onChange={(value) => setFilter("constellation", value)} />
      <SelectBlock title="武器条件" value={filters.weapon} options={WEAPON_OPTIONS} onChange={(value) => setFilter("weapon", value)} />
      <SelectBlock title="精錬" value={filters.refine} options={REFINE_OPTIONS} onChange={(value) => setFilter("refine", value)} />
      <ChoiceGroup title="コスト階級" options={COST_OPTIONS} active={filters.cost} onChange={(value) => setFilter("cost", value)} />
    </div>
  );
}

function CategoryFullPanel({ filters, setFilter }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr_1fr]">
      <ChoiceGroup title="カテゴリ" options={RULE_OPTIONS} active={filters.rule} onChange={(value) => setFilter("rule", value)} />
      <ChoiceGroup title="人数" options={PLAY_STYLE_OPTIONS} active={filters.playStyle} onChange={(value) => setFilter("playStyle", value)} />
      <ChoiceGroup title="飯バフ" options={FOOD_OPTIONS} active={filters.food} onChange={(value) => setFilter("food", value)} />
      <ChoiceGroup title="端末" options={DEVICE_OPTIONS} active={filters.device} onChange={(value) => setFilter("device", value)} />
      <ChoiceGroup title="期間・バージョン" options={VERSION_OPTIONS} active={filters.version} onChange={(value) => setFilter("version", value)} wide />
    </div>
  );
}

function TagFullPanel({ selectedTags, toggleTag }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input readOnly value="" placeholder="タグ名で検索" className="h-10 min-w-0 flex-1 border bg-[#f7f7f7] px-3 text-[13px] outline-none placeholder:text-[#999]" style={{ borderColor: UI.panelBorder }} />
        <span className="shrink-0 text-[12px] font-black text-[#777]">{selectedTags.length}件選択中</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {TAG_GROUPS.map((group) => <ChoiceGroup key={group.label} title={group.label} options={group.tags} activeSet={selectedTags} onChange={toggleTag} multi />)}
      </div>
    </div>
  );
}

function HomeLikeCharacterModal({ selectedCharacters, onToggleCharacter, onClose }) {
  const [activeTab, setActiveTab] = useState("party");
  const [target, setTarget] = useState("include");
  const [element, setElement] = useState("全て");
  const [search, setSearch] = useState("");

  const visibleCharacters = CHARACTER_OPTIONS.filter((character) => {
    const matchesElement = element === "全て" || character.element === element;
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch = normalizedSearch.length === 0 || character.name.toLowerCase().includes(normalizedSearch) || character.id.includes(normalizedSearch);
    return matchesElement && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-6">
      <div className="w-full max-w-5xl overflow-hidden border bg-[#f7f8fa] shadow-[0_24px_80px_rgba(0,0,0,0.35)]" style={{ borderColor: UI.cardBorder }}>
        <header className="flex h-[58px] items-center justify-between bg-[#111116] px-5 text-white">
          <div className="flex items-center gap-3">
            <span className="border border-white/35 px-2.5 py-1 text-[11px] font-black tracking-[0.14em] text-white/60">FILTER</span>
            <h2 className="text-[18px] font-black tracking-[0.06em]">キャラ・編成を絞り込む</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 border border-white/20 text-[18px] leading-none text-white/60 transition hover:bg-white/10 hover:text-white">×</button>
        </header>
        <div className="border-b bg-white px-5 py-4" style={{ borderColor: UI.panelBorder }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {MODAL_FILTER_TABS.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={["h-9 border px-4 text-[13px] font-black transition", activeTab === tab.key ? "border-[#111116] bg-[#111116] text-white" : "bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]"].join(" ")} style={{ borderColor: activeTab === tab.key ? "#111116" : UI.panelBorder }}>{tab.label}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {TARGET_OPTIONS.map((option) => {
                const key = option === "含める" ? "include" : "exclude";
                return <button key={option} onClick={() => setTarget(key)} className={["h-8 border px-3 text-[12px] font-black transition", target === key ? "border-[#111116] bg-[#111116] text-white" : "bg-[#f7f8fa] text-[#5f6678] hover:bg-[#eef1f5]"].join(" ")} style={{ borderColor: target === key ? "#111116" : UI.panelBorder }}>{option}</button>;
              })}
            </div>
          </div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
          <aside className="border-b bg-white p-5 lg:border-b-0 lg:border-r" style={{ borderColor: UI.panelBorder }}>
            <p className="text-[12px] font-black tracking-[0.12em] text-[#777]">選択状態</p>
            <div className="mt-4 space-y-3">
              <ModalSummary label="編成に含める" ids={selectedCharacters.party.include} />
              <ModalSummary label="編成から除外" ids={selectedCharacters.party.exclude} />
              <ModalSummary label="メインに含める" ids={selectedCharacters.main.include} />
              <ModalSummary label="メインから除外" ids={selectedCharacters.main.exclude} />
            </div>
          </aside>
          <main className="p-5">
            <div className="relative mb-4">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-black tracking-[0.12em] text-[#777]">検索</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="キャラ名で検索" className="h-11 w-full border bg-white pl-14 pr-4 text-[14px] text-[#333333] placeholder:text-[#8d93a3] outline-none transition focus:border-[#9aa7ba]" style={{ borderColor: UI.panelBorder }} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-[12px] font-black tracking-[0.12em] text-[#777]">元素絞り込み</p>
              <div className="flex flex-wrap gap-2">
                {ELEMENT_OPTIONS.map((option) => <button key={option} onClick={() => setElement(option)} className={["h-8 border px-3 text-[12px] font-black transition", element === option ? "border-[#111116] bg-[#111116] text-white" : "bg-white text-[#5f6678] hover:bg-[#eef1f5]"].join(" ")} style={{ borderColor: element === option ? "#111116" : UI.panelBorder }}>{option}</button>)}
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[12px] font-black tracking-[0.12em] text-[#777]">キャラクター一覧</p>
                <p className="text-[12px] font-bold text-[#999]">{visibleCharacters.length}件</p>
              </div>
              <div className="grid max-h-[390px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {visibleCharacters.map((character) => {
                  const tabState = selectedCharacters[activeTab];
                  const isInclude = tabState.include.includes(character.id);
                  const isExclude = tabState.exclude.includes(character.id);
                  const active = target === "include" ? isInclude : isExclude;
                  return (
                    <button key={character.id} onClick={() => onToggleCharacter(activeTab, target, character.id)} className={["relative h-[58px] overflow-hidden border bg-white p-2 text-left transition hover:bg-[#eef1f5]", active ? "border-[#111116] ring-1 ring-[#111116]" : "border-[#d8dde6]"].join(" ")}>
                      <span className="flex h-full items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center border bg-[#f1f1f1] text-[11px] font-black text-[#333]" style={{ borderColor: UI.panelBorder }}>{character.element}</span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-black text-[#333]">{character.name}</span>
                          <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#999]">{character.type}</span>
                        </span>
                      </span>
                      {isInclude || isExclude ? <span className={["absolute right-0 top-0 grid h-6 w-6 place-items-center text-[13px] font-black text-white", isExclude ? "bg-[#777]" : "bg-[#111116]"].join(" ")}>{isExclude ? "−" : "+"}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
        <footer className="flex justify-end gap-2 border-t bg-white px-5 py-4" style={{ borderColor: UI.panelBorder }}>
          <button onClick={onClose} className="h-10 border bg-white px-4 text-[13px] font-black text-[#333] hover:bg-[#f1f1f1]" style={{ borderColor: UI.panelBorder }}>閉じる</button>
          <button onClick={onClose} className="h-10 bg-[#111116] px-5 text-[13px] font-black text-white hover:bg-[#333]">適用する</button>
        </footer>
      </div>
    </div>
  );
}

function ModalSummary({ label, ids }) {
  return (
    <div>
      <p className="text-[11px] font-black text-[#777]">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {ids.length > 0 ? ids.map((id) => <span key={id} className="border bg-[#f7f8fa] px-2 py-1 text-[11px] font-bold text-[#444]" style={{ borderColor: UI.panelBorder }}>{resolveCharacterName(id)}</span>) : <span className="text-[12px] text-[#aaa]">未指定</span>}
      </div>
    </div>
  );
}

function SummaryBox({ title, items, empty }) {
  return (
    <div className="border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <p className="text-[12px] font-black tracking-[0.08em] text-[#777]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length > 0 ? items.map((item) => <span key={item} className="border bg-white px-2.5 py-1 text-[12px] font-black text-[#333]" style={{ borderColor: UI.panelBorder }}>{item}</span>) : <span className="text-[12px] font-bold text-[#999]">{empty}</span>}
      </div>
    </div>
  );
}

function SelectBlock({ title, value, options, onChange }) {
  return (
    <label className="block border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <span className="mb-2 block text-[12px] font-black tracking-[0.08em] text-[#777]">{title}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full border bg-white px-3 text-[13px] font-black text-[#222] outline-none" style={{ borderColor: UI.panelBorder }}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ChoiceGroup({ title, options, active, activeSet, onChange, multi = false, wide = false }) {
  return (
    <section className={["border bg-[#f7f7f7] p-3", wide ? "xl:col-span-2" : ""].join(" ")} style={{ borderColor: UI.panelBorder }}>
      <p className="mb-2 text-[12px] font-black tracking-[0.08em] text-[#777]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = multi ? activeSet.includes(option) : option === active;
          return <button key={option} onClick={() => onChange(option)} className={["h-9 border px-3 text-[12px] font-black transition", isActive ? "border-[#111116] bg-[#111116] text-white" : "bg-white text-[#333] hover:bg-[#eeeeee]"].join(" ")} style={{ borderColor: isActive ? "#111116" : UI.panelBorder }}>{multi ? "#" : ""}{option}</button>;
        })}
      </div>
    </section>
  );
}

function resolveCharacterName(id) {
  return CHARACTER_OPTIONS.find((character) => character.id === id)?.name ?? id;
}

function HitButton({ id, panel, setHoverKey, onClick, children }) {
  return (
    <button className="absolute top-0 z-10 h-full border-0 bg-transparent p-0 text-left" style={{ left: pct(panel.hitLeft), width: pct(panel.hitRight - panel.hitLeft) }} onMouseEnter={() => setHoverKey(id)} onFocus={() => setHoverKey(id)} onClick={() => onClick(id)}>
      {children}
    </button>
  );
}

function PanelContent({ icon, title, active }) {
  return (
    <span className="filter-panel-content relative z-10" data-active={active ? "true" : "false"}>
      <span className="filter-panel-icon"><FilterIcon type={icon} /></span>
      <span className="filter-panel-title" style={{ color: active ? "#111111" : UI.textMain }}><BreakableTitle title={title} /></span>
      <span className="filter-panel-arrow" style={{ color: active ? "#333333" : UI.textSub }}>›</span>
    </span>
  );
}

function BreakableTitle({ title }) {
  const parts = title.split("・");
  if (parts.length === 1) return <span className="filter-panel-title-part">{title}</span>;
  return parts.map((part, index) => <span key={`${title}-${index}`} className="filter-panel-title-part">{index === 0 ? part : `・${part}`}</span>);
}

function FilterIcon({ type }) {
  const iconClass = "h-full w-full shrink-0 text-[#333333]";
  if (type === "character") return <svg viewBox="0 0 48 48" className={iconClass} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="17" r="7" /><path d="M11 39c2.5-8 7.1-12 13-12s10.5 4 13 12" /><circle cx="24" cy="24" r="21" /></svg>;
  if (type === "weapon") return <svg viewBox="0 0 48 48" className={iconClass} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="21" /><path d="M14 34l20-20" /><path d="M30 10l8 8" /><path d="M12 36l-2 2" /><path d="M18 30l-4-4" /></svg>;
  if (type === "calendar") return <svg viewBox="0 0 48 48" className={iconClass} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="21" /><path d="M15 15h18v19H15z" /><path d="M19 12v6" /><path d="M29 12v6" /><path d="M15 22h18" /></svg>;
  return <svg viewBox="0 0 48 48" className={iconClass} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="21" /><path d="M14 18v-4h4l16 16-4 4L14 18z" /><circle cx="18" cy="18" r="1.5" fill="currentColor" stroke="none" /></svg>;
}

function Thumbnail({ record }) {
  const [quality, setQuality] = useState("maxresdefault");
  const [failed, setFailed] = useState(false);
  const thumbnailUrl = youtubeThumbnailUrl(record.videoUrl, quality);
  return (
    <div className={`relative h-[148px] overflow-hidden bg-gradient-to-br ${record.gradient}`}>
      {!failed && thumbnailUrl ? <img src={thumbnailUrl} alt="" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" onError={() => { if (quality === "maxresdefault") setQuality("hqdefault"); else setFailed(true); }} /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.08)_46%,rgba(0,0,0,0.66)_100%)]" />
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/72 px-2.5 py-1 text-[11px] font-black text-white shadow"><Icon name="play" className="size-3 fill-current" />YouTube</div>
      <span className="absolute right-3 top-3 rounded-full bg-black/72 px-2.5 py-1 text-[11px] font-black text-white shadow">{record.time}</span>
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
        <div className="min-w-0"><p className="truncate text-[12px] font-black text-white/72">{record.ruleset} / {record.versionLabel}</p><p className="truncate text-[16px] font-black tracking-[-0.03em]">{record.title}</p></div>
        <Icon name="external" className="size-4 shrink-0 text-white/80" />
      </div>
    </div>
  );
}

function CharacterAvatar({ member }) {
  const characterName = getCharacterName(member.id);
  const element = getCharacterElement(member.id);
  const style = ELEMENT_STYLE[element];
  const [mirrorBase, setMirrorBase] = useState(ENKA_UI_BASE);
  const [failed, setFailed] = useState(false);
  const iconUrl = characterIconUrl(member.id, mirrorBase);
  return (
    <div className="group/avatar relative">
      <div className={`grid size-10 place-items-center overflow-hidden rounded-[10px] border border-white bg-white ring-2 ${style.ring} ${style.glow}`}>
        {!failed && iconUrl ? <img src={iconUrl} alt={characterName} className="size-full object-cover" onError={() => { if (mirrorBase === ENKA_UI_BASE) setMirrorBase(AMBR_UI_BASE); else setFailed(true); }} /> : <span className={`text-[11px] font-black ${style.text}`}>{characterName.slice(0, 2).toUpperCase()}</span>}
      </div>
      <span className="absolute -bottom-1 -right-1 rounded bg-black px-1 py-0.5 text-[9px] font-black leading-none text-white">C{member.cons}</span>
    </div>
  );
}

function RecordCardView({ record }) {
  return (
    <article className="group overflow-hidden border border-[#dfe3ea] bg-white shadow-[0_14px_28px_rgba(21,27,38,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(21,27,38,0.12)]">
      <Thumbnail record={record} />
      <div className="p-4">
        <h3 className="line-clamp-1 text-[15px] font-black tracking-[-0.03em] text-[#141414]">{record.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] font-bold text-[#4b5563]"><span className="flex items-center gap-1.5"><span className="grid size-5 place-items-center rounded-full bg-[#111827] text-[10px] text-white">{record.player[0]}</span>{record.player}</span><span className="h-3 w-px bg-[#d1d5db]" /><span>{record.platform}</span><span className="h-3 w-px bg-[#d1d5db]" /><span>{record.season}</span></div>
        <div className="mt-3 flex gap-2">{record.party.map((member) => <CharacterAvatar key={`${record.id}-${member.id}`} member={member} />)}</div>
        <p className="mt-3 line-clamp-2 min-h-[40px] text-[12px] font-bold leading-5 text-[#5b6472]">{record.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{record.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-[#f0f2f5] px-2.5 py-1 text-[11px] font-black text-[#5b6472]">{tag}</span>)}</div>
        <div className="mt-4 flex items-center justify-end gap-4 border-t border-[#edf0f4] pt-3 text-[12px] font-black text-[#374151]"><button className="flex items-center gap-1.5 hover:text-[#ff3b1f]"><Icon name="plus" className="size-4" /> 比較に追加</button><button className="flex items-center gap-1.5 hover:text-[#ff3b1f]"><Icon name="bookmark" className="size-4" /> あとで見る</button></div>
      </div>
    </article>
  );
}

function CompareCandidateCard({ record, index }) {
  return (
    <article className="overflow-hidden border border-[#e2e6ee] bg-[#fbfcfd]">
      <div className="relative h-[88px] bg-[#111827]"><img src={youtubeThumbnailUrl(record.videoUrl, "hqdefault")} alt="" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.68))]" /><span className="absolute left-2 top-2 bg-black/75 px-2 py-1 text-[10px] font-black text-white">候補 {index + 1}</span><span className="absolute bottom-2 right-2 bg-white px-2 py-1 text-[11px] font-black text-black shadow">{record.time}</span></div>
      <div className="p-3"><p className="line-clamp-1 text-[12px] font-black text-[#111827]">{record.title}</p><div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-[#7b8493]"><span>{record.player}</span><span className="h-2.5 w-px bg-[#d1d5db]" /><span>{record.platform}</span><span className="h-2.5 w-px bg-[#d1d5db]" /><span>{record.versionLabel}</span></div><div className="mt-3 flex items-center justify-between gap-2"><div className="flex -space-x-1">{record.party.map((member) => <img key={`${record.id}-compare-${member.id}`} src={characterIconUrl(member.id)} alt="" className="size-6 rounded-full border border-white bg-white object-cover" />)}</div><button className="text-[10px] font-black text-[#7b8493] hover:text-[#ff3b1f]">候補から外す</button></div></div>
    </article>
  );
}

function Sidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      <section className="border border-[#dfe3ea] bg-white shadow-[0_12px_26px_rgba(21,27,38,0.06)]">
        <div className="border-b border-[#eef1f5] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ff3b1f]">Compare</p><h2 className="mt-1 text-[15px] font-black text-[#111827]">比較候補の記録</h2></div><span className="border border-[#dfe3ea] bg-[#f7f8fa] px-2.5 py-1 text-[11px] font-black text-[#5b6472]">{compareRecords.length}件</span></div><p className="mt-2 text-[11px] font-bold leading-5 text-[#7b8493]">比較したい記録だけをここに一時保存します。検索アクションとは分離して、候補の状態を見失わない構成にしています。</p></div>
        <div className="space-y-3 p-3">{compareRecords.map((record, index) => <CompareCandidateCard key={record.id} record={record} index={index} />)}</div>
        <div className="grid grid-cols-2 border-t border-[#eef1f5]"><button className="h-11 border-r border-[#eef1f5] text-[12px] font-black text-[#7b8493] hover:bg-[#fafbfc] hover:text-[#ff3b1f]">候補をクリア</button><button className="flex h-11 items-center justify-center gap-1.5 text-[12px] font-black text-[#111827] hover:bg-[#fafbfc] hover:text-[#ff3b1f]">比較画面を開く<Icon name="chevron" className="size-4" /></button></div>
      </section>
      <section className="border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_26px_rgba(21,27,38,0.06)]">
        <h2 className="mb-3 text-[15px] font-black text-[#111827]">検索アクション</h2>
        <div className="divide-y divide-[#eef1f5]">{sidebarActions.map((item) => <button key={item.label} className="flex w-full items-center justify-between py-3 text-left text-[13px] font-bold text-[#374151] transition hover:text-[#ff3b1f]"><span className="flex min-w-0 items-center gap-2"><Icon name={item.icon} className="size-4 shrink-0 text-[#8b95a7]" /><span className="truncate">{item.label}</span></span><span className="flex shrink-0 items-center gap-2 text-[12px] text-[#8b95a7]">{item.count}<Icon name="chevron" className="size-4" /></span></button>)}</div>
      </section>
    </aside>
  );
}

function RecommendationRail() {
  const picks = records.slice(2, 6);
  return (
    <section className="mx-auto mt-3 max-w-[1340px] px-4 pb-8 lg:px-8">
      <div className="border border-[#dfe3ea] bg-white p-4 shadow-[0_14px_34px_rgba(21,27,38,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full border border-[#dfe3ea] bg-[#f7f8fa]"><Icon name="target" className="size-5 text-[#111827]" /></div><div><h2 className="text-[17px] font-black tracking-[-0.03em] text-[#111827]">少し先の目標におすすめの記録</h2><p className="mt-1 text-[12px] font-bold text-[#7b8493]">サムネイルと編成を小さく並べ、次に見たい記録を選びやすくしています。</p></div></div><button className="hidden text-[12px] font-black text-[#374151] hover:text-[#ff3b1f] sm:block">すべて見る</button></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{picks.map((record) => <button key={record.id} className="flex items-center gap-3 border border-[#edf0f4] bg-white p-2 text-left transition hover:border-[#cfd6e2] hover:bg-[#fafbfc]"><div className="relative h-14 w-24 shrink-0 overflow-hidden bg-[#111827]"><img src={youtubeThumbnailUrl(record.videoUrl, "hqdefault")} alt="" className="size-full object-cover" /><span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[10px] font-black text-white">{record.time}</span></div><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-black text-[#111827]">{record.title}</p><div className="mt-1 flex -space-x-1">{record.party.slice(0, 4).map((member) => <img key={`${record.id}-mini-${member.id}`} src={characterIconUrl(member.id)} alt="" className="size-5 rounded-full border border-white bg-white object-cover" />)}</div></div></button>)}</div>
      </div>
    </section>
  );
}

export default function SearchRecordsMockFilterBandAssetsMerged() {
  const [query, setQuery] = useState("");
  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) => {
      const partyNames = record.party.map((member) => getCharacterName(member.id));
      return [record.title, record.player, record.handle, record.summary, record.platform, record.ruleset, ...record.tags, ...partyNames].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [query]);

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-[#111827]">
      <Header />
      <Hero />
      <FilterTabs />
      <section className="mx-auto grid max-w-[1340px] gap-7 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_246px] lg:px-8">
        <div>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[21px] font-black tracking-[-0.04em] text-[#111827]">検索結果 <span className="ml-2 text-[13px] font-black text-[#7b8493]">{visibleRecords.length}件</span></h2>
              <p className="mt-1 text-[12px] font-bold text-[#7b8493]">右側は比較候補の記録を先に置き、検索アクションは履歴・閲覧・お気に入りに絞っています。</p>
            </div>
            <label className="flex h-10 w-full items-center gap-2 border border-[#dfe3ea] bg-white px-3 sm:w-[280px]"><Icon name="search" className="size-4 text-[#7b8493]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-bold outline-none placeholder:text-[#a0a8b5]" placeholder="このモック内を検索" /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleRecords.map((record) => <RecordCardView key={record.id} record={record} />)}</div>
        </div>
        <Sidebar />
      </section>
      <RecommendationRail />
    </main>
  );
}

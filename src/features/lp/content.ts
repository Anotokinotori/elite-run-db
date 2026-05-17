import type { CharacterPresetKey } from "../../lib/characterAssets";

import section2CardBackgroundImage from "./assets/section2-card-bg.jpg";
import section2Card01CharacterImage from "./assets/section2-card-01-character.png";
import section2Card02CharacterImage from "./assets/section2-card-02-character.png";
import section2Card03CharacterImage from "./assets/section2-card-03-character.png";
import section2BackgroundImage from "./assets/section2-sky-bg.png";

export const LP_HERO_COLORS = ["#0A64C2", "#D09A02", "#AF52DE", "#FB6454", "#4BA85E"] as const;

export const LP_HERO_COLOR_ORDER_TOP = [2, 3, 4, 1, 0, 3, 4, 2, 1, 0, 4, 3, 2, 1, 0, 4] as const;
export const LP_HERO_COLOR_ORDER_BOTTOM = [0, 1, 2, 4, 3, 0, 1, 4, 2, 3, 1, 0, 4, 2, 3, 1] as const;

export const LP_HERO_CHARACTERS: Array<{ key: CharacterPresetKey; name: string }> = [
  { key: "lauma", name: "Lauma" },
  { key: "ifa", name: "Ifa" },
  { key: "chasca", name: "Chasca" },
  { key: "xilonen", name: "Xilonen" },
  { key: "chiori", name: "Chiori" },
  { key: "yelan", name: "Yelan" },
  { key: "faruzan", name: "Faruzan" },
  { key: "dehya", name: "Dehya" },
  { key: "varesa", name: "Varesa" },
  { key: "mualani", name: "Mualani" },
];

export const LP_SECTION2_ASSETS = {
  backgroundImage: section2BackgroundImage,
  cardBackgroundImage: section2CardBackgroundImage,
} as const;

export type LpFeatureCard = {
  number: "01" | "02" | "03";
  pointLabel: string;
  title: {
    before?: string;
    accent: string;
    after?: string;
  };
  body: string[];
  href: string;
  accentColor: string;
  characterImage: string;
  characterAlt: string;
  characterSide: "left" | "right";
  characterClassName: string;
};

export const LP_FEATURE_CARDS: LpFeatureCard[] = [
  {
    number: "01",
    pointLabel: "Point1",
    title: {
      before: "条件から",
      accent: "記録を探す",
    },
    body: ["凸数、編成、タイム、端末から", "自分の環境に近い記録を探せます。", "記録を探すことに特化したページです。"],
    href: "#library",
    accentColor: "#fb6454",
    characterImage: section2Card01CharacterImage,
    characterAlt: "記録検索を表すキャラクター",
    characterSide: "right",
    characterClassName: "h-[520px] w-[404px] object-contain object-bottom md:h-[530px]",
  },
  {
    number: "02",
    pointLabel: "Point2",
    title: {
      accent: "全ランキング",
      after: "を見る",
    },
    body: ["全てのコスト階級や、ルールを一覧でランキングを見る順に表示することができます。", "ランキングで表示することに特化しています。"],
    href: "#home",
    accentColor: "#d09a02",
    characterImage: section2Card02CharacterImage,
    characterAlt: "ランキング閲覧を表すキャラクター",
    characterSide: "left",
    characterClassName: "h-[540px] w-[574px] object-cover object-[50%_18%] md:h-[528px]",
  },
  {
    number: "03",
    pointLabel: "Point3",
    title: {
      accent: "狩りチャット",
      after: "で話す",
    },
    body: ["狩りに関する、質問・雑談・情報共有を", "行うことができます。匿名でも会話することが", "できるため、初心者にもおすすめです。"],
    href: "#chat",
    accentColor: "#0a64c2",
    characterImage: section2Card03CharacterImage,
    characterAlt: "狩りチャットを表すキャラクター",
    characterSide: "right",
    characterClassName: "h-[490px] w-[433px] object-cover object-left-top md:h-[490px]",
  },
];

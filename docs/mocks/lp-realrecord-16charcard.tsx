import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

/**
 * このコンポーネントは、元画像の見た目をできるだけ崩さず再現するための実装です。
 *
 * 方針:
 * - まず「原寸の完成レイアウト」を 1368x514 で定義する
 * - 狭い画面では、要素を組み替えるのではなく UI 全体を等比縮小する
 * - 斜め帯・台形・文字傾き・画像クロップは、見た目維持のため固定値で管理する
 *
 * この書き方にしている理由:
 * - 一般的なレスポンシブ再構成をすると、斜め形状や文字位置が崩れやすい
 * - 今回の要件では「再現度維持」が「汎用化」より優先度が高い
 * - ただし、既存サイトへ合体しやすいように、責務ごとに小さく分割して可読性を上げている
 *
 * 追記:
 * - 以前の版では figma:asset の import を使っていたが、この実行環境では解決できずビルドエラーになった
 * - そのため、現在は通常の URL のみを使う構成に変更している
 */

/* ========================================================================== */
/* Base layout                                                                 */
/* ========================================================================== */

const BASE_LAYOUT = {
  width: 1368,
  height: 514,
  maxWidthClassName: "max-w-[1368px]",
} as const;

/* ========================================================================== */
/* Card geometry                                                               */
/* ========================================================================== */

const CARD_SIZE = {
  outerWidth: 158,
  innerWidth: 154,
} as const;

const CARD_LAYER_ORDER = {
  costBand: 10,
  nameBand: 20,
} as const;

/**
 * 斜め帯と台形帯で傾きがズレないように、同じ slant 値を共有する。
 * 角度ではなく「左端と右端の高低差(px)」で統一しているため、
 * 高さが異なる図形同士でも傾きを揃えやすい。
 */
const SHARED_SLANT_PX = 34;

const NAME_BAND = {
  height: 98,
  bottom: 96,
  background: "rgba(0,0,0,0.5)",
  textTranslateY: -1,
} as const;

const COST_BAND = {
  height: 112,
  background: "rgba(0,0,0,1)",
  textTranslateY: 8,
} as const;

const LABEL_TEXT_ROTATION_DEG = -15;

/* ========================================================================== */
/* Typography                                                                  */
/* ========================================================================== */

const FONT_FAMILY = {
  headingDisplay: '"Rakkas", Georgia, "Times New Roman", serif',
  displaySerif: 'Georgia, "Times New Roman", serif',
  japaneseUi: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", sans-serif',
} as const;

/* ========================================================================== */
/* Data types                                                                  */
/* ========================================================================== */

type CharacterCardData = {
  name: string;
  cost: string;
  src: string;
  imageScale: number;
  imagePosition: string;
  nameFontSize: number;
  nameOffsetX: number;
  costFontSize: number;
  fallbackHue: number;
  cardBackgroundColor: string;
};

type RankSectionData = {
  label: string;
  title: string;
  time: string;
  linkLabel: string;
  accentColor: string;
  panelBackground: string;
  cardsRailBackground: string;
  cards: CharacterCardData[];
};

type CharacterPreset = {
  displayName: string;
  internalName: string;
  imageScale: number;
  imagePosition: string;
  nameFontSize: number;
  nameOffsetX?: number;
  fallbackHue: number;
};

type CharacterCardOverrides = Partial<
  Pick<
    CharacterCardData,
    | "imageScale"
    | "imagePosition"
    | "nameFontSize"
    | "nameOffsetX"
    | "costFontSize"
    | "cardBackgroundColor"
  >
>;

type RankCardSpec = {
  presetKey: CharacterPresetKey;
  cost: string;
  overrides?: CharacterCardOverrides;
};

type RankSectionSpec = Omit<RankSectionData, "cards"> & {
  cards: RankCardSpec[];
};

/* ========================================================================== */
/* Asset sources                                                               */
/* ========================================================================== */

/**
 * 画像供給の方針:
 * - 実行環境で失敗する figma:asset import は使わない
 * - 添付テキストにあった internalName を使って enka.network/ui の実画像 URL を組み立てる
 * - 画像ロード失敗時はカード内でフォールバック背景を表示する
 *
 * これにより、少なくとも「ビルドは必ず通る」状態を優先しつつ、
 * 実画像が分かるキャラはそのまま表示できる。
 */
const ENKA_BASE = "https://enka.network/ui";

function toEnkaGachaIconUrl(internalName: string): string {
  return `${ENKA_BASE}/UI_Gacha_AvatarIcon_${internalName}.png`;
}

/* ========================================================================== */
/* Character visual presets                                                    */
/* ========================================================================== */

/**
 * 添付テキストを元に、今回必要なキャラだけ最小構成で持っている。
 * internalName は ENKA の UI アセット名に合わせる。
 *
 * ここは「キャラごとの見た目調整値」を置く場所。
 * どの階級で使うか、どの凸数で使うかは下の編成定義に分離している。
 */
const CHARACTER_PRESETS = {
  mavuika: {
    displayName: "Mavuika",
    internalName: "Mavuika",
    imageScale: 1.26,
    imagePosition: "43% 40%",
    nameFontSize: 34,
    nameOffsetX: -2,
    fallbackHue: 10,
  },
  citlali: {
    displayName: "Citlali",
    internalName: "Citlali",
    imageScale: 1.24,
    imagePosition: "48% 34%",
    nameFontSize: 34,
    nameOffsetX: -1,
    fallbackHue: 290,
  },
  mizuki: {
    displayName: "Mizuki",
    internalName: "Mizuki",
    imageScale: 1.23,
    imagePosition: "50% 31%",
    nameFontSize: 32,
    nameOffsetX: 1,
    fallbackHue: 240,
  },
  chasca: {
    displayName: "Chasca",
    internalName: "Chasca",
    imageScale: 1.29,
    imagePosition: "55% 37%",
    nameFontSize: 28,
    nameOffsetX: 1,
    fallbackHue: 180,
  },
  chiori: {
    displayName: "Chiori",
    internalName: "Chiori",
    imageScale: 1.21,
    imagePosition: "52% 34%",
    nameFontSize: 31,
    nameOffsetX: 0,
    fallbackHue: 22,
  },
  xilonen: {
    displayName: "Xilonen",
    internalName: "Xilonen",
    imageScale: 1.22,
    imagePosition: "50% 34%",
    nameFontSize: 24,
    nameOffsetX: 0,
    fallbackHue: 38,
  },
  xianyun: {
    displayName: "Xianyun",
    internalName: "Liuyun",
    imageScale: 1.2,
    imagePosition: "50% 31%",
    nameFontSize: 31,
    nameOffsetX: 0,
    fallbackHue: 202,
  },
  varesa: {
    displayName: "Varesa",
    internalName: "Varesa",
    imageScale: 1.22,
    imagePosition: "50% 35%",
    nameFontSize: 27,
    nameOffsetX: 0,
    fallbackHue: 325,
  },
  yanfei: {
    displayName: "Yanfei",
    internalName: "Feiyan",
    imageScale: 1.21,
    imagePosition: "50% 34%",
    nameFontSize: 31,
    nameOffsetX: 0,
    fallbackHue: 12,
  },
  dehya: {
    displayName: "Dehya",
    internalName: "Dehya",
    imageScale: 1.22,
    imagePosition: "50% 36%",
    nameFontSize: 27,
    nameOffsetX: 0,
    fallbackHue: 16,
  },
  skirk: {
    displayName: "Skirk",
    internalName: "SkirkNew",
    imageScale: 1.21,
    imagePosition: "50% 34%",
    nameFontSize: 27,
    nameOffsetX: 0,
    fallbackHue: 224,
  },
  escoffier: {
    displayName: "Escoffier",
    internalName: "Escoffier",
    imageScale: 1.21,
    imagePosition: "50% 33%",
    nameFontSize: 24,
    nameOffsetX: 0,
    fallbackHue: 198,
  },
  yelan: {
    displayName: "Yelan",
    internalName: "Yelan",
    imageScale: 1.23,
    imagePosition: "49% 34%",
    nameFontSize: 31,
    nameOffsetX: 0,
    fallbackHue: 206,
  },
  barbara: {
    displayName: "Barbara",
    internalName: "Barbara",
    imageScale: 1.18,
    imagePosition: "50% 30%",
    nameFontSize: 26,
    nameOffsetX: 0,
    fallbackHue: 196,
  },
} as const satisfies Record<string, CharacterPreset>;

type CharacterPresetKey = keyof typeof CHARACTER_PRESETS;

/* ========================================================================== */
/* Rank composition specs                                                      */
/* ========================================================================== */

/**
 * 画像クロップはキャラごとの見た目調整値。
 * ここは汎用化しすぎると再現度が下がるため、あえて個別データとして持つ。
 *
 * 注意:
 * - 1段目の4キャラは sample コードに含まれていた並びをベースに維持
 * - High / Middle / Low はユーザー指定の編成に差し替え
 * - 凸数は今回「適当でよい」との指定のため、視認性優先で仮の数値を入れている
 * - 夜蘭は追加指示に合わせて C0R1 に変更済み
 *
 * ここは「どの階級に、どのキャラを、どの凸数で置くか」を読む場所。
 * 見た目調整そのものは CHARACTER_PRESETS 側を見ると追いやすい。
 */
const RANK_SECTION_SPECS: RankSectionSpec[] = [
  {
    label: "Unlimited",
    title: "Nekoshita",
    time: "28:52",
    linkLabel: "全ランキングを見る→",
    accentColor: "#f32c16",
    panelBackground: "#fffcf9",
    cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "mavuika", cost: "C6R1", overrides: { costFontSize: 62 } },
      { presetKey: "citlali", cost: "C6R1", overrides: { costFontSize: 62 } },
      { presetKey: "mizuki", cost: "C0R1", overrides: { costFontSize: 60 } },
      { presetKey: "chasca", cost: "C6R1", overrides: { costFontSize: 62 } },
    ],
  },
  {
    label: "High",
    title: "Rundum",
    time: "28:52",
    linkLabel: "全ランキングを見る→",
    accentColor: "#0866c0",
    panelBackground: "#fffcf9",
    cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "chiori", cost: "C6R1" },
      { presetKey: "xilonen", cost: "C2R1" },
      { presetKey: "xianyun", cost: "C0R1" },
      { presetKey: "chasca", cost: "C6R1" },
    ],
  },
  {
    label: "Middle",
    title: "R",
    time: "28:52",
    linkLabel: "全ランキングを見る→",
    accentColor: "#d09a02",
    panelBackground: "#fffcf9",
    cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "varesa", cost: "C2R1" },
      { presetKey: "yanfei", cost: "C6R5" },
      { presetKey: "dehya", cost: "C1R1" },
      { presetKey: "chasca", cost: "C0R1" },
    ],
  },
  {
    label: "Low",
    title: "Anotokinotori",
    time: "28:52",
    linkLabel: "全ランキングを見る→",
    accentColor: "#af52de",
    panelBackground: "#fffcf9",
    cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "skirk", cost: "C0R1" },
      { presetKey: "escoffier", cost: "C0R1", overrides: { nameFontSize: 22 } },
      { presetKey: "yelan", cost: "C0R1" },
      { presetKey: "barbara", cost: "C6R5" },
    ],
  },
];

function buildCharacterCard(
  presetKey: CharacterPresetKey,
  cost: string,
  sectionAccentColor: string,
  overrides?: CharacterCardOverrides,
): CharacterCardData {
  const preset = CHARACTER_PRESETS[presetKey];

  return {
    name: preset.displayName,
    cost,
    src: toEnkaGachaIconUrl(preset.internalName),
    imageScale: overrides?.imageScale ?? preset.imageScale,
    imagePosition: overrides?.imagePosition ?? preset.imagePosition,
    nameFontSize: overrides?.nameFontSize ?? preset.nameFontSize,
    nameOffsetX: overrides?.nameOffsetX ?? preset.nameOffsetX ?? 0,
    costFontSize: overrides?.costFontSize ?? 60,
    fallbackHue: preset.fallbackHue,
    cardBackgroundColor: overrides?.cardBackgroundColor ?? sectionAccentColor,
  };
}

function buildRankSection(sectionSpec: RankSectionSpec): RankSectionData {
  return {
    ...sectionSpec,
    cards: sectionSpec.cards.map((cardSpec) =>
      buildCharacterCard(
        cardSpec.presetKey,
        cardSpec.cost,
        sectionSpec.accentColor,
        cardSpec.overrides,
      ),
    ),
  };
}

const RANK_SECTIONS: RankSectionData[] = RANK_SECTION_SPECS.map(buildRankSection);

/* ========================================================================== */
/* Runtime checks                                                              */
/* ========================================================================== */

/**
 * 簡易テスト:
 * - この canvas 環境には通常のテストランナーが無いので、
 *   少なくとも壊れやすいデータ整合性だけは実行時に検査する
 * - 例外が出た場合は、描画前に不正データへ気付ける
 */
function runDataShapeChecks() {
  assert(RANK_SECTIONS.length === 4, "RANK_SECTIONS must contain exactly 4 rank rows.");

  RANK_SECTIONS.forEach((section, sectionIndex) => {
    assert(section.cards.length === 4, `Section ${sectionIndex + 1} must contain exactly 4 cards.`);
    assert(section.label.trim().length > 0, `Section ${sectionIndex + 1} label is required.`);
    assert(section.title.trim().length > 0, `Section ${sectionIndex + 1} title is required.`);

    section.cards.forEach((card, cardIndex) => {
      assert(card.name.trim().length > 0, `Card name is required at ${sectionIndex + 1}-${cardIndex + 1}.`);
      assert(card.cost.trim().length > 0, `Card cost is required at ${sectionIndex + 1}-${cardIndex + 1}.`);
      assert(card.src.trim().length > 0, `Card image src is required at ${sectionIndex + 1}-${cardIndex + 1}.`);
      assert(card.nameFontSize > 0, `nameFontSize must be positive at ${sectionIndex + 1}-${cardIndex + 1}.`);
      assert(card.costFontSize > 0, `costFontSize must be positive at ${sectionIndex + 1}-${cardIndex + 1}.`);
      assert(card.fallbackHue >= 0, `fallbackHue must be set at ${sectionIndex + 1}-${cardIndex + 1}.`);
      assert(card.cardBackgroundColor.trim().length > 0, `cardBackgroundColor must be set at ${sectionIndex + 1}-${cardIndex + 1}.`);
      assert(/^C\d+R\d+$/.test(card.cost), `Card cost must match CnRn format at ${sectionIndex + 1}-${cardIndex + 1}.`);
    });
  });

  assert(
    toEnkaGachaIconUrl("Barbara") === "https://enka.network/ui/UI_Gacha_AvatarIcon_Barbara.png",
    "toEnkaGachaIconUrl must build a correct ENKA asset URL.",
  );

  assert(
    containsJapaneseCharacter("バーバラ") === true && containsJapaneseCharacter("Mavuika") === false,
    "containsJapaneseCharacter must distinguish Japanese and non-Japanese labels.",
  );

  assert(
    RANK_SECTIONS[3].cards[2].cost === "C0R1",
    "Yelan cost must remain C0R1.",
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

runDataShapeChecks();

/* ========================================================================== */
/* Shape helpers                                                               */
/* ========================================================================== */

function createNameBandClipPath(): string {
  return `polygon(
    0px ${SHARED_SLANT_PX}px,
    ${CARD_SIZE.innerWidth}px 0px,
    ${CARD_SIZE.innerWidth}px ${NAME_BAND.height - SHARED_SLANT_PX}px,
    0px ${NAME_BAND.height}px
  )`;
}

function createCostBandClipPath(): string {
  return `polygon(
    0px ${SHARED_SLANT_PX}px,
    ${CARD_SIZE.innerWidth}px 0px,
    ${CARD_SIZE.innerWidth}px ${COST_BAND.height}px,
    0px ${COST_BAND.height}px
  )`;
}

/* ========================================================================== */
/* Style helpers                                                               */
/* ========================================================================== */

function createScaledFrameStyle(scale: number): CSSProperties {
  return {
    width: BASE_LAYOUT.width * scale,
    height: BASE_LAYOUT.height * scale,
  };
}

function createScaleTransformStyle(scale: number): CSSProperties {
  return {
    width: BASE_LAYOUT.width,
    height: BASE_LAYOUT.height,
    transform: `scale(${scale})`,
  };
}

function createCardOuterStyle(): CSSProperties {
  return {
    width: CARD_SIZE.outerWidth,
  };
}

function createCardInnerStyle(cardBackgroundColor: string): CSSProperties {
  return {
    background: cardBackgroundColor,
  };
}

function createCharacterImageStyle(
  imageScale: number,
  imagePosition: string,
): CSSProperties {
  return {
    objectPosition: imagePosition,
    transform: `scale(${imageScale})`,
    transformOrigin: "center center",
  };
}

function createNameBandStyle(): CSSProperties {
  return {
    zIndex: CARD_LAYER_ORDER.nameBand,
    bottom: NAME_BAND.bottom,
    height: NAME_BAND.height,
    clipPath: createNameBandClipPath(),
    background: NAME_BAND.background,
    boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset",
  };
}

function containsJapaneseCharacter(value: string): boolean {
  return /[ぁ-んァ-ヶ一-龠々ー]/.test(value);
}

function createNameTextStyle(
  label: string,
  fontSize: number,
  offsetX: number,
): CSSProperties {
  const isJapanese = containsJapaneseCharacter(label);

  return {
    opacity: 1,
    fontSize,
    lineHeight: isJapanese ? 1.02 : 0.92,
    letterSpacing: isJapanese ? "-0.08em" : "-0.04em",
    fontWeight: 700,
    fontFamily: isJapanese ? FONT_FAMILY.japaneseUi : FONT_FAMILY.displaySerif,
    textShadow: "0 1px 0 rgba(0,0,0,0.18)",
    transform: `translateX(${offsetX}px) translateY(${NAME_BAND.textTranslateY}px) rotate(${LABEL_TEXT_ROTATION_DEG}deg)`,
    transformOrigin: "center center",
    whiteSpace: "nowrap",
  };
}

function createCostBandStyle(): CSSProperties {
  return {
    zIndex: CARD_LAYER_ORDER.costBand,
    height: COST_BAND.height,
    clipPath: createCostBandClipPath(),
    background: COST_BAND.background,
  };
}

function createCostTextStyle(fontSize: number): CSSProperties {
  return {
    fontSize,
    lineHeight: 1,
    letterSpacing: "-0.07em",
    fontWeight: 700,
    fontFamily: FONT_FAMILY.displaySerif,
    textShadow: "0 2px 6px rgba(0,0,0,0.22)",
    transform: `translateY(${COST_BAND.textTranslateY}px) rotate(${LABEL_TEXT_ROTATION_DEG}deg)`,
    transformOrigin: "center center",
  };
}

function createSummarySectionStyle(background: string): CSSProperties {
  return {
    background,
  };
}

function createCardsRailStyle(background: string): CSSProperties {
  return {
    background,
  };
}

function createHeroLabelStyle(accentColor: string): CSSProperties {
  return {
    color: accentColor,
    fontFamily: FONT_FAMILY.headingDisplay,
  };
}

function createHeroTitleStyle(): CSSProperties {
  return {
    fontFamily: FONT_FAMILY.headingDisplay,
  };
}

function createStackStyle(scale: number): CSSProperties {
  return {
    gap: 12 * scale,
  };
}

function createImageFallbackStyle(cardBackgroundColor: string, hue: number): CSSProperties {
  return {
    backgroundColor: cardBackgroundColor,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 42%, rgba(0,0,0,0.18) 100%)",
    filter: `saturate(${1 + ((hue % 24) / 240)})`,
  };
}

/* ========================================================================== */
/* Responsive scaling                                                          */
/* ========================================================================== */

/**
 * この UI は要素単位のレスポンシブではなく、全体縮小方式を採用する。
 *
 * 理由:
 * - 斜め帯や文字回転が固定値ベースで揃っている
 * - 個別レスポンシブにすると、見た目再現が壊れやすい
 * - 実際の導入時にも「まず原寸デザインを保つ」方が安全
 */
function useUniformScale(baseWidth: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const updateScale = () => {
      const availableWidth = containerElement.clientWidth;
      const nextScale = Math.min(1, availableWidth / baseWidth);
      setScale(nextScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(containerElement);
    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [baseWidth]);

  return { containerRef, scale };
}

/* ========================================================================== */
/* Main component                                                              */
/* ========================================================================== */

function FontLoader() {
  return (
    <style>{`@import url("https://fonts.googleapis.com/css2?family=Rakkas&display=swap");`}</style>
  );
}

export default function GenshinHeroRecreationAllRanks() {
  const { containerRef, scale } = useUniformScale(BASE_LAYOUT.width);

  return (
    <>
      <FontLoader />
      <div className="min-h-screen w-full bg-[#efefef] p-3">
        {/*
          このラッパーは「何倍に縮小するか」を測るための基準。
          実際の描画本体は、この中で absolute + scale() している。
        */}
        <div ref={containerRef} className={`mx-auto w-full ${BASE_LAYOUT.maxWidthClassName}`}>
          <div className="flex flex-col items-start" style={createStackStyle(scale)}>
            {RANK_SECTIONS.map((section) => (
              <RankRow key={`${section.label}-${section.title}`} section={section} scale={scale} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ========================================================================== */
/* Rank row                                                                    */
/* ========================================================================== */

function RankRow({ section, scale }: { section: RankSectionData; scale: number }) {
  return (
    <div className="relative mx-auto" style={createScaledFrameStyle(scale)}>
      {/*
        scale() だけだと見た目は縮んでもレイアウト上の高さは縮まらない。
        そのため、wrapper 側にも縮小後サイズを明示して重なりを防ぐ。
      */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={createScaleTransformStyle(scale)}
      >
        <div className="flex h-full w-full overflow-hidden border border-[#cfcfcf] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02)]">
          <HeroSummaryPanel section={section} />
          <CharacterCardsRail
            cards={section.cards}
            cardsRailBackground={section.cardsRailBackground}
          />
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Left summary panel                                                          */
/* ========================================================================== */

function HeroSummaryPanel({ section }: { section: RankSectionData }) {
  return (
    <section
      className="flex min-w-0 flex-1 items-start px-12 pb-8 pt-20"
      style={createSummarySectionStyle(section.panelBackground)}
    >
      <div className="flex flex-col">
        <div
          className="text-[72px] font-black leading-none"
          style={createHeroLabelStyle(section.accentColor)}
        >
          {section.label}
        </div>

        <div
          className="mt-8 text-[110px] font-black leading-[0.92] tracking-[-0.05em] text-black"
          style={createHeroTitleStyle()}
        >
          {section.title}
        </div>

        <div className="mt-12 text-[56px] font-extrabold leading-none text-black">
          {section.time}
        </div>

        <div className="mt-2 text-[24px] font-extrabold leading-none text-[#c8c8c8]">
          {section.linkLabel}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* Right cards rail                                                            */
/* ========================================================================== */

function CharacterCardsRail({
  cards,
  cardsRailBackground,
}: {
  cards: CharacterCardData[];
  cardsRailBackground: string;
}) {
  return (
    <section
      className="flex shrink-0 gap-1 p-[3px]"
      style={createCardsRailStyle(cardsRailBackground)}
    >
      {cards.map((card, index) => (
        <CharacterCard key={`${card.name}-${card.cost}-${index}`} card={card} />
      ))}
    </section>
  );
}

/* ========================================================================== */
/* Character card                                                              */
/* ========================================================================== */

function CharacterCard({ card }: { card: CharacterCardData }) {
  return (
    <div
      className="relative h-full overflow-hidden bg-[#8f8f91] px-[2px]"
      style={createCardOuterStyle()}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={createCardInnerStyle(card.cardBackgroundColor)}
      >
        <CharacterImageLayer card={card} />

        {/*
          名前帯と凸数帯は z-index を分けている。
          これを同列にすると、名前帯が台形に埋もれて見える場合がある。
        */}
        <NameBand
          label={card.name}
          fontSize={card.nameFontSize}
          offsetX={card.nameOffsetX}
        />
        <CostBand label={card.cost} fontSize={card.costFontSize} />
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Character image layer                                                       */
/* ========================================================================== */

function CharacterImageLayer({ card }: { card: CharacterCardData }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!isImageLoaded && (
        <div
          className="absolute inset-0"
          style={createImageFallbackStyle(card.cardBackgroundColor, card.fallbackHue)}
        />
      )}

      <img
        src={card.src}
        alt={card.name}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        style={{
          ...createCharacterImageStyle(card.imageScale, card.imagePosition),
          opacity: hasImageError ? 0 : 1,
        }}
        onLoad={() => {
          setIsImageLoaded(true);
          setHasImageError(false);
        }}
        onError={() => {
          setIsImageLoaded(false);
          setHasImageError(true);
        }}
      />

      {hasImageError && (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-[18px] font-bold text-white/85">
          image unavailable
        </div>
      )}

      {/*
        下側だけ少し暗くして、帯と画像のなじみを良くする。
        ここは強くしすぎると元画像の鮮やかさが死ぬため、かなり弱い値に留めている。
      */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_60%,rgba(0,0,0,0.05)_73%,rgba(0,0,0,0.14)_100%)]" />
    </div>
  );
}

/* ========================================================================== */
/* Name band                                                                   */
/* ========================================================================== */

type NameBandProps = {
  label: string;
  fontSize: number;
  offsetX: number;
};

function NameBand({ label, fontSize, offsetX }: NameBandProps) {
  const bandStyle = useMemo(() => createNameBandStyle(), []);
  const textStyle = useMemo(
    () => createNameTextStyle(label, fontSize, offsetX),
    [label, fontSize, offsetX],
  );

  return (
    <div className="absolute inset-x-0" style={bandStyle}>
      <div className="flex h-full items-center justify-center text-white" style={textStyle}>
        {label}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Cost band                                                                   */
/* ========================================================================== */

type CostBandProps = {
  label: string;
  fontSize: number;
};

function CostBand({ label, fontSize }: CostBandProps) {
  const bandStyle = useMemo(() => createCostBandStyle(), []);
  const textStyle = useMemo(() => createCostTextStyle(fontSize), [fontSize]);

  return (
    <div className="absolute bottom-0 inset-x-0" style={bandStyle}>
      <div className="flex h-full items-center justify-center text-white" style={textStyle}>
        {label}
      </div>
    </div>
  );
}

import { CSSProperties, useMemo, useState } from "react";

/* ========================================================================== */
/* Base layout                                                                */
/* ========================================================================== */

const CARD_SIZE = {
  outerWidth: 47.4,
  innerWidth: 46.2,
  height: 154.2,
} as const;

const RAIL_GAP = 1.2;
const RAIL_PADDING = 0.9;
const BLOCK_GAP = 7.2;

const RANK_BLOCK_SIZE = {
  width: CARD_SIZE.outerWidth * 4 + RAIL_GAP * 3 + RAIL_PADDING * 2,
  summaryMinHeight: 99,
} as const;

const SECTION_CARD_AREA_PADDING = {
  top: 10,
  right: 10,
  bottom: 12,
  left: 10,
} as const;

// TOPプレイヤー（4つのブロック）がピッタリ収まる固定幅を計算
const SECTION_BLOCK_WIDTH =
  RANK_BLOCK_SIZE.width * 4 + 
  BLOCK_GAP * 3 + 
  SECTION_CARD_AREA_PADDING.left + 
  SECTION_CARD_AREA_PADDING.right;

/* ========================================================================== */
/* Card geometry                                                              */
/* ========================================================================== */

const CARD_LAYER_ORDER = { costBand: 10, nameBand: 20 } as const;
const SHARED_SLANT_PX = 10.2;

const NAME_BAND = {
  height: 29.4,
  bottom: 28.8,
  background: "rgba(0,0,0,0.5)",
  textTranslateY: -0.3,
} as const;

const COST_BAND = {
  height: 33.6,
  background: "rgba(0,0,0,1)",
  textTranslateY: 2.4,
} as const;

const LABEL_TEXT_ROTATION_DEG = -15;

/* ========================================================================== */
/* Character crop settings                                                    */
/* ========================================================================== */

const MAGAZINE_FACE_CROP = {
  trimLeftPercent: 5,
  cutRightPercent: 55,
  scale: 1.08,
  objectPositionY: "50%",
} as const;

/* ========================================================================== */
/* Typography                                                                 */
/* ========================================================================== */

const FONT_FAMILY = {
  headingDisplay: '"Rakkas", Georgia, "Times New Roman", serif',
  displaySerif: 'Georgia, "Times New Roman", serif',
  japaneseUi: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", sans-serif',
  monoData: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
} as const;

/* ========================================================================== */
/* Data types                                                                 */
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
/* Asset sources                                                              */
/* ========================================================================== */

const ENKA_BASE = "https://enka.network/ui";
function toEnkaCharacterIconUrl(internalName: string): string {
  return `${ENKA_BASE}/UI_AvatarIcon_${internalName}.png`;
}

/* ========================================================================== */
/* Character visual presets                                                   */
/* ========================================================================== */

const CHARACTER_PRESETS = {
  mavuika: {
    displayName: "Mavuika", internalName: "Mavuika",
    imageScale: 1.26, imagePosition: "43% 40%",
    nameFontSize: 10.2, nameOffsetX: -0.6, fallbackHue: 10,
  },
  citlali: {
    displayName: "Citlali", internalName: "Citlali",
    imageScale: 1.24, imagePosition: "48% 34%",
    nameFontSize: 10.2, nameOffsetX: -0.3, fallbackHue: 290,
  },
  mizuki: {
    displayName: "Mizuki", internalName: "Mizuki",
    imageScale: 1.23, imagePosition: "50% 31%",
    nameFontSize: 9.6, nameOffsetX: 0.3, fallbackHue: 240,
  },
  chasca: {
    displayName: "Chasca", internalName: "Chasca",
    imageScale: 1.29, imagePosition: "55% 37%",
    nameFontSize: 8.4, nameOffsetX: 0.3, fallbackHue: 180,
  },
  chiori: {
    displayName: "Chiori", internalName: "Chiori",
    imageScale: 1.21, imagePosition: "52% 34%",
    nameFontSize: 9.3, nameOffsetX: 0, fallbackHue: 22,
  },
  xilonen: {
    displayName: "Xilonen", internalName: "Xilonen",
    imageScale: 1.22, imagePosition: "50% 34%",
    nameFontSize: 7.2, nameOffsetX: 0, fallbackHue: 38,
  },
  xianyun: {
    displayName: "Xianyun", internalName: "Liuyun",
    imageScale: 1.2, imagePosition: "50% 31%",
    nameFontSize: 9.3, nameOffsetX: 0, fallbackHue: 202,
  },
  varesa: {
    displayName: "Varesa", internalName: "Varesa",
    imageScale: 1.22, imagePosition: "50% 35%",
    nameFontSize: 8.1, nameOffsetX: 0, fallbackHue: 325,
  },
  yanfei: {
    displayName: "Yanfei", internalName: "Feiyan",
    imageScale: 1.21, imagePosition: "50% 34%",
    nameFontSize: 9.3, nameOffsetX: 0, fallbackHue: 12,
  },
  dehya: {
    displayName: "Dehya", internalName: "Dehya",
    imageScale: 1.22, imagePosition: "50% 36%",
    nameFontSize: 8.1, nameOffsetX: 0, fallbackHue: 16,
  },
  skirk: {
    displayName: "Skirk", internalName: "SkirkNew",
    imageScale: 1.21, imagePosition: "50% 34%",
    nameFontSize: 8.1, nameOffsetX: 0, fallbackHue: 224,
  },
  escoffier: {
    displayName: "Escoffier", internalName: "Escoffier",
    imageScale: 1.21, imagePosition: "50% 33%",
    nameFontSize: 7.2, nameOffsetX: 0, fallbackHue: 198,
  },
  yelan: {
    displayName: "Yelan", internalName: "Yelan",
    imageScale: 1.23, imagePosition: "49% 34%",
    nameFontSize: 9.3, nameOffsetX: 0, fallbackHue: 206,
  },
  barbara: {
    displayName: "Barbara", internalName: "Barbara",
    imageScale: 1.18, imagePosition: "50% 30%",
    nameFontSize: 7.8, nameOffsetX: 0, fallbackHue: 196,
  },
} as const satisfies Record<string, CharacterPreset>;

type CharacterPresetKey = keyof typeof CHARACTER_PRESETS;

/* ========================================================================== */
/* Rank composition specs                                                     */
/* ========================================================================== */

const RANK_SECTION_SPECS: RankSectionSpec[] = [
  {
    label: "Unlimited", title: "Nekoshita", time: "28:52",
    linkLabel: "全ランキングを見る→", accentColor: "#f32c16",
    panelBackground: "#fffcf9", cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "mavuika", cost: "C6R1", overrides: { costFontSize: 18.6 } },
      { presetKey: "citlali", cost: "C6R1", overrides: { costFontSize: 18.6 } },
      { presetKey: "mizuki",  cost: "C0R1", overrides: { costFontSize: 18 } },
      { presetKey: "chasca",  cost: "C6R1", overrides: { costFontSize: 18.6 } },
    ],
  },
  {
    label: "High", title: "Rundum", time: "28:52",
    linkLabel: "全ランキングを見る→", accentColor: "#0866c0",
    panelBackground: "#fffcf9", cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "chiori",   cost: "C6R1" },
      { presetKey: "xilonen",  cost: "C2R1" },
      { presetKey: "xianyun",  cost: "C0R1" },
      { presetKey: "chasca",   cost: "C6R1" },
    ],
  },
  {
    label: "Middle", title: "R", time: "28:52",
    linkLabel: "全ランキングを見る→", accentColor: "#d09a02",
    panelBackground: "#fffcf9", cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "varesa", cost: "C2R1" },
      { presetKey: "yanfei", cost: "C6R5" },
      { presetKey: "dehya",  cost: "C1R1" },
      { presetKey: "chasca", cost: "C0R1" },
    ],
  },
  {
    label: "Low", title: "Anotokinotori", time: "28:52",
    linkLabel: "全ランキングを見る→", accentColor: "#af52de",
    panelBackground: "#fffcf9", cardsRailBackground: "#cccccc",
    cards: [
      { presetKey: "skirk",     cost: "C0R1" },
      { presetKey: "escoffier", cost: "C0R1", overrides: { nameFontSize: 6.6 } },
      { presetKey: "yelan",     cost: "C0R1" },
      { presetKey: "barbara",   cost: "C6R5" },
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
    src: toEnkaCharacterIconUrl(preset.internalName),
    imageScale: overrides?.imageScale ?? MAGAZINE_FACE_CROP.scale,
    imagePosition: overrides?.imagePosition ?? `50% ${MAGAZINE_FACE_CROP.objectPositionY}`,
    nameFontSize: overrides?.nameFontSize ?? preset.nameFontSize,
    nameOffsetX: overrides?.nameOffsetX ?? preset.nameOffsetX ?? 0,
    costFontSize: overrides?.costFontSize ?? 18,
    fallbackHue: preset.fallbackHue,
    cardBackgroundColor: overrides?.cardBackgroundColor ?? sectionAccentColor,
  };
}

function buildRankSection(spec: RankSectionSpec): RankSectionData {
  return {
    ...spec,
    cards: spec.cards.map((c) =>
      buildCharacterCard(c.presetKey, c.cost, spec.accentColor, c.overrides),
    ),
  };
}

const RANK_SECTIONS: RankSectionData[] = RANK_SECTION_SPECS.map(buildRankSection);

/* ========================================================================== */
/* Shape helpers                                                              */
/* ========================================================================== */

function createNameBandClipPath(): string {
  return `polygon(0px ${SHARED_SLANT_PX}px, ${CARD_SIZE.innerWidth}px 0px, ${CARD_SIZE.innerWidth}px ${NAME_BAND.height - SHARED_SLANT_PX}px, 0px ${NAME_BAND.height}px)`;
}
function createCostBandClipPath(): string {
  return `polygon(0px ${SHARED_SLANT_PX}px, ${CARD_SIZE.innerWidth}px 0px, ${CARD_SIZE.innerWidth}px ${COST_BAND.height}px, 0px ${COST_BAND.height}px)`;
}

/* ========================================================================== */
/* Card style helpers                                                         */
/* ========================================================================== */

function createCardOuterStyle(): CSSProperties {
  return { width: CARD_SIZE.outerWidth, height: CARD_SIZE.height, paddingLeft: 0.6, paddingRight: 0.6 };
}
function createCardInnerStyle(bg: string): CSSProperties {
  return { background: bg };
}
function createCharacterImageStyle(imageScale: number, imagePosition: string): CSSProperties {
  const vis = MAGAZINE_FACE_CROP.cutRightPercent - MAGAZINE_FACE_CROP.trimLeftPercent;
  return {
    width: `${100 / (vis / 100)}%`, height: "100%",
    left: `${-MAGAZINE_FACE_CROP.trimLeftPercent / (vis / 100)}%`, top: 0,
    objectFit: "cover", objectPosition: imagePosition,
    transform: `scale(${imageScale})`, transformOrigin: "left center",
  };
}
function createNameBandStyle(): CSSProperties {
  return {
    zIndex: CARD_LAYER_ORDER.nameBand, bottom: NAME_BAND.bottom, height: NAME_BAND.height,
    clipPath: createNameBandClipPath(), background: NAME_BAND.background,
    boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset",
  };
}
function containsJapaneseCharacter(v: string): boolean {
  return /[ぁ-んァ-ヶ一-龠々ー]/.test(v);
}
function createNameTextStyle(label: string, fontSize: number, offsetX: number): CSSProperties {
  const isJP = containsJapaneseCharacter(label);
  return {
    fontSize, lineHeight: isJP ? 1.02 : 0.92,
    letterSpacing: isJP ? "-0.08em" : "-0.04em",
    fontWeight: 700,
    fontFamily: isJP ? FONT_FAMILY.japaneseUi : FONT_FAMILY.displaySerif,
    textShadow: "0 1px 0 rgba(0,0,0,0.18)",
    transform: `translateX(${offsetX}px) translateY(${NAME_BAND.textTranslateY}px) rotate(${LABEL_TEXT_ROTATION_DEG}deg)`,
    transformOrigin: "center center", whiteSpace: "nowrap",
  };
}
function createCostBandStyle(): CSSProperties {
  return {
    zIndex: CARD_LAYER_ORDER.costBand, height: COST_BAND.height,
    clipPath: createCostBandClipPath(), background: COST_BAND.background,
  };
}
function createCostTextStyle(fontSize: number): CSSProperties {
  return {
    fontSize, lineHeight: 1, letterSpacing: "-0.07em", fontWeight: 700,
    fontFamily: FONT_FAMILY.displaySerif,
    textShadow: "0 1px 2px rgba(0,0,0,0.22)",
    transform: `translateY(${COST_BAND.textTranslateY}px) rotate(${LABEL_TEXT_ROTATION_DEG}deg)`,
    transformOrigin: "center center",
  };
}
function createHeroLabelStyle(accentColor: string): CSSProperties {
  return { color: accentColor, fontFamily: FONT_FAMILY.headingDisplay };
}
function createHeroTitleStyle(): CSSProperties {
  return { fontFamily: FONT_FAMILY.headingDisplay };
}
function createImageFallbackStyle(bg: string, hue: number): CSSProperties {
  return {
    backgroundColor: bg,
    backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 42%, rgba(0,0,0,0.18) 100%)",
    filter: `saturate(${1 + ((hue % 24) / 240)})`,
  };
}
function createFaceCropOverlayStyle(): CSSProperties {
  return {
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.00) 52%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.34) 100%), linear-gradient(180deg, rgba(255,255,255,0)_58%, rgba(0,0,0,0.10)_78%, rgba(0,0,0,0.20)_100%)",
  };
}

/* ========================================================================== */
/* */
/* SectionBlock — ホームページのランキングセクションを囲むラッパー             */
/* */
/* ========================================================================== */

type SectionBlockProps = {
  /** セクション見出し（日本語対応） */
  heading: string;
  /** 英語サブタイトル */
  subheading?: string;
  /**
   * ヘッダー左のバッジラベル。
   * "PICK UP" / "RANKING" など短い英語キャップスが想定。
   */
  badge?: string;
  /** ヘッダー右端の更新日時ラベル ("05/01 更新" など) */
  updatedLabel?: string;
  /** "すべて見る" ボタンのラベル */
  viewAllLabel?: string;
  onViewAll?: () => void;
  children: React.ReactNode;
};

function SectionBlock({
  heading,
  subheading,
  badge,
  updatedLabel,
  viewAllLabel,
  onViewAll,
  children,
}: SectionBlockProps) {
  const isJpHeading = containsJapaneseCharacter(heading);

  return (
    <section
      style={{
        width: SECTION_BLOCK_WIDTH, // ここで計算した固定幅を適用
        borderRadius: 0,
        overflow: "hidden",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(0,0,0,0.09)",
      }}
    >
      {/* ──────────────────── ヘッダーバー ──────────────────── */}
      <header
        style={{
          background: "#111116",
          display: "flex",
          alignItems: "stretch",
          position: "relative",
          minHeight: 44,
        }}
      >
        {/* バッジ + 見出し + サブ見出し */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingLeft: 14,
            paddingRight: 14,
          }}
        >
          {badge && (
            /* 透明背景＋ボーダーのシャープなスタイル */
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 17,
                paddingLeft: 7,
                paddingRight: 7,
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.38)",
                fontFamily: FONT_FAMILY.headingDisplay,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.62)",
                textTransform: "uppercase",
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              {badge}
            </span>
          )}

          {/* 見出し本体 */}
          <span
            style={{
              fontFamily: isJpHeading ? FONT_FAMILY.japaneseUi : FONT_FAMILY.headingDisplay,
              fontSize: isJpHeading ? 13.5 : 15,
              fontWeight: 900,
              letterSpacing: isJpHeading ? "0.06em" : "-0.01em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            {heading}
          </span>

          {/* 区切り + サブ見出し */}
          {subheading && (
            <>
              <span
                style={{
                  width: 3, height: 3, borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)", flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_FAMILY.headingDisplay,
                  fontSize: 10, fontWeight: 400,
                  letterSpacing: "0.10em",
                  color: "rgba(255,255,255,0.34)",
                  textTransform: "uppercase", lineHeight: 1,
                }}
              >
                {subheading}
              </span>
            </>
          )}
        </div>

        {/* 右ゾーン: 更新日時 + 「すべて見る」 */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {updatedLabel && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: FONT_FAMILY.monoData,
                fontSize: 9,
                fontWeight: 400,
                color: "rgba(255,255,255,0.26)",
                letterSpacing: "0.04em",
                paddingLeft: 14,
                paddingRight: 14,
                /* 右側の "すべて見る" ボタンとの区切り線 */
                borderRight: "1px solid rgba(255,255,255,0.09)",
                whiteSpace: "nowrap",
              }}
            >
              {updatedLabel}
            </span>
          )}

          {viewAllLabel && (
            <ViewAllButton label={viewAllLabel} onClick={onViewAll} />
          )}
        </div>
      </header>

      {/* ──────────── アクセントライン (ヘッダー直下・全幅) ──────────── */}
      {/* 薄い白のボーダーラインで、区切りを表現 */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.10)" }} />

      {/* ──────────────────── カードエリア ──────────────────── */}
      {/*
       * #f4f3f1 の微暖色オフホワイト。
       * pure white より若干落ち着いた背景にすることで
       * 個々のカード (white #fffcf9) が自然に浮き上がる。
       */}
      <div 
        className="overflow-x-auto elite-scrollbar" 
        style={{ 
          background: "#f4f3f1", 
          padding: `${SECTION_CARD_AREA_PADDING.top}px ${SECTION_CARD_AREA_PADDING.right}px ${SECTION_CARD_AREA_PADDING.bottom}px ${SECTION_CARD_AREA_PADDING.left}px` 
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* ────────────────── "すべて見る" ボタン ────────────────── */

function ViewAllButton({ label, onClick }: { label: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 5,
        paddingLeft: 16,
        paddingRight: 16,
        fontFamily: FONT_FAMILY.japaneseUi,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.03em",
        color: hovered ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.44)",
        textDecoration: hovered ? "underline" : "none",
        textUnderlineOffset: 3,
        whiteSpace: "nowrap",
        transition: "color 0.12s",
      }}
    >
      {label}
      <svg
        width="9" height="9" viewBox="0 0 9 9" fill="none"
        style={{ opacity: hovered ? 0.88 : 0.44, transition: "opacity 0.12s" }}
      >
        <path
          d="M1.5 4.5H7.5M7.5 4.5L5 2M7.5 4.5L5 7"
          stroke="currentColor" strokeWidth="1.3"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ========================================================================== */
/* Font loader & Custom Scrollbar                                             */
/* ========================================================================== */

function FontLoader() {
  return (
    <style>{`
      @import url("https://fonts.googleapis.com/css2?family=Rakkas&display=swap");

      /* スタイリッシュな薄型スクロールバー */
      .elite-scrollbar::-webkit-scrollbar {
        height: 6px;
      }
      .elite-scrollbar::-webkit-scrollbar-track {
        background: #f4f3f1;
        border-radius: 4px;
      }
      .elite-scrollbar::-webkit-scrollbar-thumb {
        background: #cccccc;
        border-radius: 4px;
      }
      .elite-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #999999;
      }
    `}</style>
  );
}

/* ========================================================================== */
/* Main export — ホームページ上での配置サンプル                                   */
/* ========================================================================== */

export default function App() {
  return (
    <>
      <FontLoader />
      {/*
        ページ背景は elite-run-db の実際の値に合わせてください。
        既存の bg-[#efefef] を踏襲しています。
      */}
      <div className="min-h-screen w-full bg-[#ebebeb] p-6">
        <div className="mx-auto flex w-max flex-col gap-7">

          {/* 注目プレイヤー */}
          <SectionBlock
            heading="注目プレイヤー"
            subheading="Featured Runs"
            badge="PICK UP"
            updatedLabel="05/01 更新"
            viewAllLabel="すべて見る"
            onViewAll={() => {}}
          >
            <div className="flex items-start" style={{ gap: BLOCK_GAP }}>
              {RANK_SECTIONS.slice(0, 2).map((s) => (
                <RankBlock key={`${s.label}-${s.title}`} section={s} />
              ))}
            </div>
          </SectionBlock>

          {/* TOPプレイヤー */}
          <SectionBlock
            heading="TOPプレイヤー"
            subheading="All Tier Rankings"
            badge="RANKING"
            updatedLabel="05/01 更新"
            viewAllLabel="すべて見る"
            onViewAll={() => {}}
          >
            <div className="flex items-start" style={{ gap: BLOCK_GAP }}>
              {RANK_SECTIONS.map((s) => (
                <RankBlock key={`${s.label}-${s.title}`} section={s} />
              ))}
            </div>
          </SectionBlock>

        </div>
      </div>
    </>
  );
}

/* ========================================================================== */
/* Rank block                                                                 */
/* ========================================================================== */

function RankBlock({ section }: { section: RankSectionData }) {
  return (
    <article
      className="flex shrink-0 flex-col overflow-hidden border border-[#cfcfcf] bg-white shadow-[0_3px_9px_rgba(0,0,0,0.08)]"
      style={{ width: RANK_BLOCK_SIZE.width, minWidth: RANK_BLOCK_SIZE.width }}
    >
      <CharacterCardsRail cards={section.cards} cardsRailBackground={section.cardsRailBackground} />
      <HeroSummaryPanel section={section} />
    </article>
  );
}

/* ========================================================================== */
/* Cards rail                                                                 */
/* ========================================================================== */

function CharacterCardsRail({
  cards, cardsRailBackground,
}: { cards: CharacterCardData[]; cardsRailBackground: string }) {
  return (
    <section
      className="flex shrink-0"
      style={{ gap: RAIL_GAP, padding: RAIL_PADDING, background: cardsRailBackground }}
    >
      {cards.map((card, i) => (
        <CharacterCard key={`${card.name}-${card.cost}-${i}`} card={card} />
      ))}
    </section>
  );
}

/* ========================================================================== */
/* Summary panel                                                              */
/* ========================================================================== */

function HeroSummaryPanel({ section }: { section: RankSectionData }) {
  return (
    <section
      className="flex flex-1 items-start"
      style={{
        minHeight: RANK_BLOCK_SIZE.summaryMinHeight,
        paddingLeft: 9.6, paddingRight: 9.6,
        paddingTop: 16.8, paddingBottom: 19.2,
        background: section.panelBackground,
      }}
    >
      <div className="flex w-full flex-col items-start">
        <div style={{ ...createHeroLabelStyle(section.accentColor), fontSize: 18, fontWeight: 900, lineHeight: 1 }}>
          {section.label}
        </div>
        <div
          style={{
            ...createHeroTitleStyle(),
            marginTop: 8.4, fontSize: 25.2, fontWeight: 900,
            lineHeight: 0.92, letterSpacing: "-0.05em",
            color: "#000", wordBreak: "break-word",
          }}
        >
          {section.title}
        </div>
        <div style={{ marginTop: 9.6, fontSize: 16.2, fontWeight: 800, lineHeight: 1, color: "#000" }}>
          {section.time}
        </div>
        <div style={{ marginTop: 4.8, fontSize: 7.2, fontWeight: 800, lineHeight: 1, color: "#c8c8c8" }}>
          {section.linkLabel}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* Character card                                                             */
/* ========================================================================== */

function CharacterCard({ card }: { card: CharacterCardData }) {
  return (
    <div className="relative overflow-hidden bg-[#8f8f91]" style={createCardOuterStyle()}>
      <div className="relative h-full w-full overflow-hidden" style={createCardInnerStyle(card.cardBackgroundColor)}>
        <CharacterImageLayer card={card} />
        <NameBand label={card.name} fontSize={card.nameFontSize} offsetX={card.nameOffsetX} />
        <CostBand label={card.cost} fontSize={card.costFontSize} />
      </div>
    </div>
  );
}

function CharacterImageLayer({ card }: { card: CharacterCardData }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {!isImageLoaded && (
        <div className="absolute inset-0" style={createImageFallbackStyle(card.cardBackgroundColor, card.fallbackHue)} />
      )}
      <img
        src={card.src} alt={card.name}
        className="pointer-events-none absolute max-w-none select-none"
        style={{ ...createCharacterImageStyle(card.imageScale, card.imagePosition), opacity: hasImageError ? 0 : 1 }}
        onLoad={() => { setIsImageLoaded(true); setHasImageError(false); }}
        onError={() => { setIsImageLoaded(false); setHasImageError(true); }}
      />
      {hasImageError && (
        <div
          className="absolute inset-0 flex items-center justify-center text-center font-bold text-white/85"
          style={{ paddingLeft: 4.8, paddingRight: 4.8, fontSize: 5.4 }}
        >
          image unavailable
        </div>
      )}
      <div className="absolute inset-0" style={createFaceCropOverlayStyle()} />
    </div>
  );
}

function NameBand({ label, fontSize, offsetX }: { label: string; fontSize: number; offsetX: number }) {
  const bandStyle = useMemo(() => createNameBandStyle(), []);
  const textStyle = useMemo(() => createNameTextStyle(label, fontSize, offsetX), [label, fontSize, offsetX]);
  return (
    <div className="absolute left-0 flex w-full items-center justify-center overflow-hidden text-white" style={bandStyle}>
      <span style={textStyle}>{label}</span>
    </div>
  );
}

function CostBand({ label, fontSize }: { label: string; fontSize: number }) {
  const bandStyle = useMemo(() => createCostBandStyle(), []);
  const textStyle = useMemo(() => createCostTextStyle(fontSize), [fontSize]);
  return (
    <div className="absolute bottom-0 left-0 flex w-full items-center justify-center overflow-hidden text-white" style={bandStyle}>
      <span style={textStyle}>{label}</span>
    </div>
  );
}
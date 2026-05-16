import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ========================================================================== */
/* Jagged concave divider                                                      */
/* ========================================================================== */

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function createJaggedConcavePath({
  width = 1440,
  height = 140,
  points = 30,
  seed = 14,
  edgeY = 18,
  sag = 48,
  jagged = 15,
}) {
  const rand = seededRandom(seed);
  const coords: [number, number][] = [];

  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const x = t * width;
    const concave = Math.sin(Math.PI * t) * sag;
    const noise = (rand() - 0.5) * jagged;
    const y = edgeY + concave + noise;

    coords.push([x, y]);
  }

  const topEdge = coords
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  return `${topEdge} L ${width} ${height} L 0 ${height} Z`;
}

function JaggedConcaveDivider({
  fill = "#e9e9e9",
  height = 140,
  seed = 14,
}: {
  fill?: string;
  height?: number;
  seed?: number;
}) {
  const path = useMemo(
    () =>
      createJaggedConcavePath({
        width: 1440,
        height,
        points: 30,
        seed,
        edgeY: 18,
        sag: 48,
        jagged: 15,
      }),
    [height, seed],
  );

  return (
    <div className="bg-white leading-none">
      <svg
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        className="block h-[140px] w-full"
        aria-hidden="true"
      >
        <path d={path} fill={fill} />
      </svg>
    </div>
  );
}

/* ========================================================================== */
/* Ranking component from attached code                                        */
/* ========================================================================== */

const BASE_LAYOUT = {
  width: 1368,
  height: 514,
  maxWidthClassName: "max-w-[1368px]",
} as const;

const CARD_SIZE = {
  outerWidth: 158,
  innerWidth: 154,
} as const;

const CARD_LAYER_ORDER = {
  costBand: 10,
  nameBand: 20,
} as const;

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

const FONT_FAMILY = {
  headingDisplay: '"Rakkas", Georgia, "Times New Roman", serif',
  displaySerif: 'Georgia, "Times New Roman", serif',
  japaneseUi: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", sans-serif',
} as const;

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

const ENKA_BASE = "https://enka.network/ui";

function toEnkaGachaIconUrl(internalName: string): string {
  return `${ENKA_BASE}/UI_Gacha_AvatarIcon_${internalName}.png`;
}

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

function FontLoader() {
  return (
    <style>{`@import url("https://fonts.googleapis.com/css2?family=Rakkas&display=swap");`}</style>
  );
}

function RankingsBlock() {
  const { containerRef, scale } = useUniformScale(BASE_LAYOUT.width);

  return (
    <div className="w-full">
      <div ref={containerRef} className={`mx-auto w-full ${BASE_LAYOUT.maxWidthClassName}`}>
        <div className="flex flex-col items-start" style={createStackStyle(scale)}>
          {RANK_SECTIONS.map((section) => (
            <RankRow key={`${section.label}-${section.title}`} section={section} scale={scale} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RankRow({ section, scale }: { section: RankSectionData; scale: number }) {
  return (
    <div className="relative mx-auto" style={createScaledFrameStyle(scale)}>
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

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_60%,rgba(0,0,0,0.05)_73%,rgba(0,0,0,0.14)_100%)]" />
    </div>
  );
}

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

/* ========================================================================== */
/* Page                                                                        */
/* ========================================================================== */

export default function App() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <FontLoader />

      <section className="flex min-h-[46vh] items-end justify-center px-6 pb-20">
        <div className="max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-neutral-400">
            sumple
          </p>
          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            仮置きのテキスト
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-500">
            セクションの切り替わりを、直線ではなく“紙を破ったような揺らぎ”と“中央へ向かう浅いへこみ”でつなぐサンプルです。
          </p>
        </div>
      </section>

      <JaggedConcaveDivider fill="#e9e9e9" seed={14} />

      <section className="bg-[#e9e9e9] p-8">
        <div className="mx-auto max-w-[1368px]">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black tracking-tight text-neutral-800 md:text-5xl"> //ここは、#homeのリーダーボードと同じフォントスタイルにしてください。
              Records Sneak Peek
            </h2>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              実際の記録をチラ見せ
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-black tracking-tight text-black"> //個々の部分はテキストではなく、#homeのリーダーボードセクションのバージョン選択のセレクトボックスのようなUIに変更してください。
              Rankings-Npui 
            </h3>
            <p className="mt-1 text-xs font-bold text-neutral-500">
              コスト別ランキング
            </p>
          </div>
        </div>

        <RankingsBlock />
      </section>
    </main>
  );
}

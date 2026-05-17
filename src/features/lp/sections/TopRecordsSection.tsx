import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { SelectControl } from "../../../components/ui";
import { appRuns } from "../../../data/appRuns";
import { characterDb, type Bracket } from "../../../data/mockRuns";
import { getCharacterImageCandidates } from "../../../lib/characterAssets";
import { FESTIVAL_RULESET, HOME_BRACKET_ACCENT_COLORS, HOME_SEASONS, HOME_TOP_PLAYER_BRACKETS } from "../../home/config";
import { applyWRTag, getBestRun, normalizeHomeRun, seasonGte } from "../../home/logic";
import type { HomeRun } from "../../home/types";

const SECTION_BACKGROUND = "#e9e9e9";
const DIVIDER_HEIGHT = 140;

const BASE_LAYOUT = {
  width: 1368,
  height: 514,
  maxWidthClassName: "max-w-[1368px]",
} as const;

const CARD_SIZE = {
  outerWidth: 158,
  innerWidth: 154,
} as const;

const CARD_RAIL_WIDTH = CARD_SIZE.outerWidth * 4 + 4 * 3 + 3 * 2;
const SUMMARY_PANEL_WIDTH = BASE_LAYOUT.width - CARD_RAIL_WIDTH;

const SHARED_SLANT_PX = 34;
const LABEL_TEXT_ROTATION_DEG = -15;

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

const FONT_FAMILY = {
  headingDisplay: '"Rakkas", Georgia, "Times New Roman", serif',
  displaySerif: 'Georgia, "Times New Roman", serif',
  japaneseUi: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", sans-serif',
} as const;

const TOP_PLAYER_LABELS: Record<Bracket, string> = {
  4: "Unlimited",
  3: "High",
  2: "Middle",
  1: "Low",
};

const LP_RANKING_CATEGORIES = ["NPUI", "PUI", "PUA"] as const;

type LpRankingCategory = (typeof LP_RANKING_CATEGORIES)[number];

type RankSectionData = {
  key: string;
  label: string;
  title: string;
  time: string;
  actionLabel: string;
  accentColor: string;
  run: HomeRun;
  cards: CharacterCardData[];
};

type CharacterCardData = {
  key: string;
  characterId: string;
  name: string;
  cost: string;
  cardBackgroundColor: string;
};

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function createJaggedConcavePath({
  width = 1440,
  height = DIVIDER_HEIGHT,
  points = 30,
  seed = 14,
  edgeY = 18,
  sag = 48,
  jagged = 15,
}: {
  width?: number;
  height?: number;
  points?: number;
  seed?: number;
  edgeY?: number;
  sag?: number;
  jagged?: number;
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

  const topEdge = coords.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return `${topEdge} L ${width} ${height} L 0 ${height} Z`;
}

function JaggedConcaveDivider({ fill = SECTION_BACKGROUND, height = DIVIDER_HEIGHT, seed = 14 }: { fill?: string; height?: number; seed?: number }) {
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
    <div className="leading-none">
      <svg viewBox={`0 0 1440 ${height}`} preserveAspectRatio="none" className="block h-[140px] w-full" aria-hidden="true">
        <path d={path} fill={fill} />
      </svg>
    </div>
  );
}

function navigateToHash(hash: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.hash = hash;
}

function hasCategoryTag(run: HomeRun, category: LpRankingCategory) {
  return run.tags.some((tag) => tag.trim().toUpperCase() === category);
}

function formatEnglishPlayerName(run: HomeRun) {
  const name = run.userName.trim();
  if (/^[\x20-\x7e]+$/.test(name) && /[A-Za-z]/.test(name)) {
    return name;
  }

  const handle = run.userHandle.replace(/^@/, "").trim();
  const readableHandle = handle.split(/[_\-.]+/).filter(Boolean)[0];
  return readableHandle || handle || run.id;
}

function buildCharacterCards(run: HomeRun, accentColor: string): CharacterCardData[] {
  return Array.from({ length: 4 }, (_, index) => {
    const partyMember = run.party[index];
    const weapon = run.weapons[index];
    const characterId = partyMember.characterId;
    const name = characterDb[characterId]?.name ?? characterId;
    const cons = partyMember.cons;
    const refine = weapon?.refine ?? 0;

    return {
      key: `${characterId}-${index}`,
      characterId,
      name,
      cost: `C${cons}R${refine}`,
      cardBackgroundColor: accentColor,
    };
  });
}

function buildRankSections(categoryRuns: HomeRun[], fallbackRuns: HomeRun[]): RankSectionData[] {
  return HOME_TOP_PLAYER_BRACKETS.flatMap((item) => {
    const run =
      getBestRun(categoryRuns.filter((candidate) => candidate.bracket === item.bracket)) ??
      getBestRun(fallbackRuns.filter((candidate) => candidate.bracket === item.bracket));
    if (!run) {
      return [];
    }

    const label = TOP_PLAYER_LABELS[item.bracket];
    const accentColor = HOME_BRACKET_ACCENT_COLORS[item.bracket];

    return [
      {
        key: `${item.label}-${run.id}`,
        label,
        title: formatEnglishPlayerName(run),
        time: run.time,
        actionLabel: "全ランキングを見る→",
        accentColor,
        run,
        cards: buildCharacterCards(run, accentColor),
      },
    ];
  });
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

function createStackStyle(scale: number): CSSProperties {
  return {
    gap: 12 * scale,
  };
}

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

function containsJapaneseCharacter(value: string): boolean {
  return /[ぁ-んァ-ヶ一-龠々〆〤]/.test(value);
}

function createNameTextStyle(label: string): CSSProperties {
  const isJapanese = containsJapaneseCharacter(label);
  const fontSize = label.length >= 9 ? 22 : label.length >= 7 ? 25 : 31;

  return {
    opacity: 1,
    fontSize,
    lineHeight: isJapanese ? 1.02 : 0.92,
    letterSpacing: isJapanese ? "-0.08em" : "-0.04em",
    fontWeight: 700,
    fontFamily: isJapanese ? FONT_FAMILY.japaneseUi : FONT_FAMILY.displaySerif,
    transform: `translateY(${NAME_BAND.textTranslateY}px) rotate(${LABEL_TEXT_ROTATION_DEG}deg)`,
    transformOrigin: "center center",
    whiteSpace: "nowrap",
  };
}

function createImageFallbackStyle(cardBackgroundColor: string, characterId: string): CSSProperties {
  const hue = Array.from(characterId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;

  return {
    backgroundColor: cardBackgroundColor,
    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 42%, rgba(0,0,0,0.18) 100%), radial-gradient(circle at 42% 28%, hsla(${hue}, 74%, 76%, 0.32), rgba(255,255,255,0) 58%)`,
  };
}

function useUniformScale(baseWidth: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportSafeWidth = Math.max(0, viewportWidth - 32);
    return Math.min(1, viewportSafeWidth / baseWidth);
  });

  useLayoutEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    const updateScale = () => {
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportSafeWidth = Math.max(0, viewportWidth - 32);
      const availableWidth = Math.min(containerElement.clientWidth, viewportSafeWidth);
      setScale(Math.min(1, availableWidth / baseWidth));
    };

    updateScale();
    const animationFrame = window.requestAnimationFrame(updateScale);

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(containerElement);
    window.addEventListener("resize", updateScale);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [baseWidth]);

  return { containerRef, scale };
}

function CharacterImageLayer({ card }: { card: CharacterCardData }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const urls = useMemo(() => getCharacterImageCandidates(card.characterId, "gachaIcon"), [card.characterId]);

  useEffect(() => {
    setImageIndex(0);
    setIsHidden(false);
  }, [card.characterId]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={createImageFallbackStyle(card.cardBackgroundColor, card.characterId)} />

      {!isHidden && urls.length > 0 ? (
        <img
          src={urls[imageIndex]}
          alt={card.name}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
          referrerPolicy="no-referrer"
          style={{
            objectPosition: "50% 34%",
            transform: "scale(1.22)",
            transformOrigin: "center center",
          }}
          onError={() => {
            const nextIndex = imageIndex + 1;
            if (nextIndex < urls.length) {
              setImageIndex(nextIndex);
            } else {
              setIsHidden(true);
            }
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-[18px] font-bold text-white/85">
          {card.name}
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_60%,rgba(0,0,0,0.05)_73%,rgba(0,0,0,0.14)_100%)]" />
    </div>
  );
}

function NameBand({ label }: { label: string }) {
  const bandStyle = useMemo<CSSProperties>(
    () => ({
      zIndex: 20,
      bottom: NAME_BAND.bottom,
      height: NAME_BAND.height,
      clipPath: createNameBandClipPath(),
      background: NAME_BAND.background,
      boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset",
    }),
    [],
  );
  const textStyle = useMemo(() => createNameTextStyle(label), [label]);

  return (
    <div className="absolute inset-x-0" style={bandStyle}>
      <div className="flex h-full items-center justify-center text-white" style={textStyle}>
        {label}
      </div>
    </div>
  );
}

function CostBand({ label }: { label: string }) {
  const bandStyle = useMemo<CSSProperties>(
    () => ({
      zIndex: 10,
      height: COST_BAND.height,
      clipPath: createCostBandClipPath(),
      background: COST_BAND.background,
    }),
    [],
  );

  return (
    <div className="absolute inset-x-0 bottom-0" style={bandStyle}>
      <div
        className="flex h-full items-center justify-center text-white"
        style={{
          fontSize: 58,
          lineHeight: 1,
          letterSpacing: "-0.07em",
          fontWeight: 700,
          fontFamily: FONT_FAMILY.displaySerif,
          transform: `translateY(${COST_BAND.textTranslateY}px) rotate(${LABEL_TEXT_ROTATION_DEG}deg)`,
          transformOrigin: "center center",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CharacterCard({ card }: { card: CharacterCardData }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#8f8f91] px-[2px]" style={{ width: CARD_SIZE.outerWidth }}>
      <div className="relative h-full w-full overflow-hidden" style={{ background: card.cardBackgroundColor }}>
        <CharacterImageLayer card={card} />
        <NameBand label={card.name} />
        <CostBand label={card.cost} />
      </div>
    </div>
  );
}

function CharacterCardsRail({ cards }: { cards: CharacterCardData[] }) {
  return (
    <section className="flex shrink-0 gap-1 bg-[#cccccc] p-[3px]">
      {cards.map((card) => (
        <CharacterCard key={card.key} card={card} />
      ))}
    </section>
  );
}

function HeroSummaryPanel({ section }: { section: RankSectionData }) {
  return (
    <section className="flex shrink-0 items-start bg-[#fffcf9] px-12 pb-8 pt-20" style={{ width: SUMMARY_PANEL_WIDTH }}>
      <div className="flex max-w-full flex-col items-start text-left">
        <button type="button" className="flex max-w-full flex-col items-start text-left" onClick={() => navigateToHash(`#detail/${encodeURIComponent(section.run.id)}`)}>
          <span className="text-[72px] font-black leading-none" style={{ color: section.accentColor, fontFamily: FONT_FAMILY.headingDisplay }}>
            {section.label}
          </span>

          <span className="mt-8 max-w-full break-words text-[110px] font-black leading-[0.92] tracking-[-0.05em] text-black" style={{ fontFamily: FONT_FAMILY.headingDisplay }}>
            {section.title}
          </span>

          <span className="mt-12 text-[56px] font-extrabold leading-none text-black">{section.time}</span>
        </button>

        <button type="button" className="mt-2 text-[24px] font-extrabold leading-none text-[#c8c8c8] transition-colors hover:text-[#666666]" onClick={() => navigateToHash("#home")}>
          {section.actionLabel}
        </button>
      </div>
    </section>
  );
}

function RankRow({ section, scale }: { section: RankSectionData; scale: number }) {
  return (
    <div className="relative mx-auto" style={createScaledFrameStyle(scale)}>
      <div className="absolute left-0 top-0 origin-top-left" style={createScaleTransformStyle(scale)}>
        <div className="flex h-full w-full overflow-hidden border border-[#cfcfcf] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02)]">
          <HeroSummaryPanel section={section} />
          <CharacterCardsRail cards={section.cards} />
        </div>
      </div>
    </div>
  );
}

function RankingsBlock({ sections }: { sections: RankSectionData[] }) {
  const { containerRef, scale } = useUniformScale(BASE_LAYOUT.width);

  return (
    <div className="w-full overflow-hidden">
      <div ref={containerRef} className={`mx-auto w-full ${BASE_LAYOUT.maxWidthClassName}`}>
        <div className="flex flex-col items-start" style={createStackStyle(scale)}>
          {sections.map((section) => (
            <RankRow key={section.key} section={section} scale={scale} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyRecordsState({ category }: { category: LpRankingCategory }) {
  return (
    <div className="mx-auto flex min-h-[260px] max-w-[1368px] items-center justify-center border border-dashed border-[#c7c7c7] bg-[#f7f7f7] px-6 text-center">
      <div>
        <p className="font-['Montserrat',sans-serif] text-xs font-black uppercase tracking-[0.28em] text-[#8b8b8b]">Rankings-{category}</p>
        <p className="mt-4 text-2xl font-black text-[#303030]">このカテゴリの記録はまだありません。</p>
        <p className="mt-2 text-sm font-bold text-[#777777]">カテゴリを切り替えると該当するランキングを確認できます。</p>
      </div>
    </div>
  );
}

function RecordsHeader({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: LpRankingCategory;
  onCategoryChange: (category: LpRankingCategory) => void;
}) {
  return (
    <div className="mx-auto mb-8 max-w-[1368px] md:mb-10">
      <div className="mb-8 text-center">
        <h2
          id="lp-records-title"
          className="max-w-full overflow-hidden whitespace-nowrap text-[43px] font-normal leading-[40px] text-black md:text-[50px] lg:text-[69px] lg:leading-[62px] [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]"
        >
          Records Sneak Peek
        </h2>
        <p className="mt-2 text-sm font-medium text-neutral-500">実際の記録をカテゴリ別にプレビュー</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-['Montserrat',sans-serif] text-2xl font-black tracking-tight text-black md:text-3xl">Rankings-{selectedCategory}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Category Ranking</p>
        </div>

        <label className="flex w-full flex-col gap-2 md:w-auto md:min-w-[176px]">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7d7d7d]">Category</span>
          <SelectControl
            className="min-w-[144px] border-black/25 text-black"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value as LpRankingCategory)}
            aria-label="Ranking category"
          >
            {LP_RANKING_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </SelectControl>
        </label>
      </div>
    </div>
  );
}

export function TopRecordsSection() {
  const [selectedCategory, setSelectedCategory] = useState<LpRankingCategory>("NPUI");
  const activeSeason = HOME_SEASONS[0] ?? "Luna3";
  const heroRuns = useMemo<HomeRun[]>(
    () =>
      applyWRTag(appRuns.map((run) => normalizeHomeRun(run, FESTIVAL_RULESET))).filter(
        (run) => seasonGte(run.season, activeSeason) && !run.isFestival,
      ),
    [activeSeason],
  );
  const categoryRuns = useMemo(() => heroRuns.filter((run) => hasCategoryTag(run, selectedCategory)), [heroRuns, selectedCategory]);
  const sections = useMemo(() => buildRankSections(categoryRuns, heroRuns), [categoryRuns, heroRuns]);

  return (
    <section className="relative z-20 -mt-[140px]" aria-labelledby="lp-records-title">
      <JaggedConcaveDivider fill={SECTION_BACKGROUND} seed={14} />
      <div className="bg-[#e9e9e9] px-4 pb-16 pt-8 text-neutral-950 md:px-8 md:pb-20">
        <RecordsHeader selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        {sections.length > 0 ? <RankingsBlock sections={sections} /> : <EmptyRecordsState category={selectedCategory} />}
      </div>
    </section>
  );
}

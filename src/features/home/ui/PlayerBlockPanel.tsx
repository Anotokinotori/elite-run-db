import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { characterDb } from "../../../data/mockRuns";
import { getCharacterImageCandidates } from "../../../lib/characterAssets";
import type { HomeRun } from "../types";

const PLAYER_BLOCK_SCALE = 1.25;
const scale = (value: number) => value * PLAYER_BLOCK_SCALE;

const CARD_SIZE = {
  outerWidth: scale(47.4),
  height: scale(154.2),
} as const;

const RAIL_GAP = scale(1.2);
const RAIL_PADDING = scale(0.9);
const BLOCK_GAP = scale(12);
const SECTION_CARD_AREA_PADDING = { top: scale(10), right: scale(10), bottom: scale(12), left: scale(10) } as const;
const RANK_BLOCK_WIDTH = CARD_SIZE.outerWidth * 4 + RAIL_GAP * 3 + RAIL_PADDING * 2;
const SECTION_BLOCK_WIDTH = RANK_BLOCK_WIDTH * 4 + BLOCK_GAP * 3 + SECTION_CARD_AREA_PADDING.left + SECTION_CARD_AREA_PADDING.right;

const MAGAZINE_FACE_CROP = {
  trimLeftPercent: 10,
  cutRightPercent: 60,
  scale: 1.1,
  objectPosition: "50% 50%",
} as const;

const FONT_FAMILY = {
  headingDisplay: '"Bebas Neue", "Space Grotesk", "Segoe UI", sans-serif',
  japaneseUi: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", sans-serif',
  monoData: '"Consolas", "SFMono-Regular", monospace',
} as const;

export type PlayerBlockItem = {
  key: string;
  label: string;
  run: HomeRun | null;
  accentColor: string;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
};

type PlayerBlockPanelProps = {
  panelKey: string;
  heading: string;
  subheading?: string;
  badge: string;
  updatedLabel?: string;
  items: PlayerBlockItem[];
  loadingLabel: string;
  onSelectRun: (runId: string) => void;
};

type CharacterCardData = {
  characterId: string;
  name: string;
  cardBackgroundColor: string;
  isPlaceholder?: boolean;
};

export function PlayerBlockPanel({
  panelKey,
  heading,
  subheading,
  badge,
  updatedLabel,
  items,
  loadingLabel,
  onSelectRun,
}: PlayerBlockPanelProps) {
  return (
    <section
      data-panel-key={panelKey}
      data-top-panel
      className="shrink-0 overflow-hidden"
      style={{ width: SECTION_BLOCK_WIDTH, minWidth: SECTION_BLOCK_WIDTH }}
    >
      <header className="relative flex items-stretch bg-[#111116]" style={{ minHeight: scale(44) }}>
        <div className="flex flex-1 items-center" style={{ gap: scale(10), paddingLeft: scale(14), paddingRight: scale(14) }}>
          <span
            className="inline-flex shrink-0 items-center border border-white/40 font-bold uppercase leading-none tracking-[0.14em] text-white/65"
            style={{
              height: scale(17),
              paddingLeft: scale(8),
              paddingRight: scale(8),
              fontSize: scale(9),
              fontFamily: FONT_FAMILY.headingDisplay,
            }}
          >
            {badge}
          </span>
          <span className="font-black leading-none tracking-[0.06em] text-[#d9d9d9]" style={{ fontSize: scale(13.5), fontFamily: FONT_FAMILY.japaneseUi }}>
            {heading}
          </span>
          {subheading ? (
            <>
              <span className="shrink-0 rounded-full bg-white/25" style={{ width: scale(3), height: scale(3) }} />
              <span className="font-normal uppercase leading-none tracking-[0.1em] text-white/40" style={{ fontSize: scale(10), fontFamily: FONT_FAMILY.headingDisplay }}>
                {subheading}
              </span>
            </>
          ) : null}
        </div>

        {updatedLabel ? (
          <time
            className="flex items-center border-l border-white/10 font-normal leading-none tracking-[0.04em] text-white/35"
            style={{ paddingLeft: scale(14), paddingRight: scale(14), fontSize: scale(9), fontFamily: FONT_FAMILY.monoData }}
          >
            {updatedLabel}
          </time>
        ) : null}
      </header>

      <div className="h-px bg-white/10" />

      <div
        className="overflow-x-auto"
        style={{
          background: "#f4f3f1",
          padding: `${SECTION_CARD_AREA_PADDING.top}px ${SECTION_CARD_AREA_PADDING.right}px ${SECTION_CARD_AREA_PADDING.bottom}px ${SECTION_CARD_AREA_PADDING.left}px`,
        }}
      >
        <div className="flex items-start" style={{ gap: BLOCK_GAP }}>
          {items.map((item) => (
            <PlayerRunBlock key={item.key} item={item} loadingLabel={loadingLabel} onSelectRun={onSelectRun} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlayerRunBlock({
  item,
  loadingLabel,
  onSelectRun,
}: {
  item: PlayerBlockItem;
  loadingLabel: string;
  onSelectRun: (runId: string) => void;
}) {
  const cards = buildCharacterCards(item.run, item.accentColor);
  const canOpenDetail = Boolean(item.run);

  const openDetail = () => {
    if (item.run) {
      onSelectRun(item.run.id);
    }
  };

  return (
    <article
      className={`flex shrink-0 flex-col overflow-hidden border border-[#cfcfcf] bg-white ${canOpenDetail ? "cursor-pointer transition-transform hover:-translate-y-0.5" : ""}`}
      style={{ width: RANK_BLOCK_WIDTH, minWidth: RANK_BLOCK_WIDTH }}
      role={canOpenDetail ? "button" : undefined}
      tabIndex={canOpenDetail ? 0 : undefined}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (!canOpenDetail || (event.key !== "Enter" && event.key !== " ")) {
          return;
        }

        event.preventDefault();
        openDetail();
      }}
    >
      <section className="flex shrink-0" style={{ gap: RAIL_GAP, padding: RAIL_PADDING, background: "#cccccc" }}>
        {cards.map((card, index) => (
          <PlayerCharacterCard key={`${item.key}-${card.characterId}-${index}`} card={card} />
        ))}
      </section>
      <section
        className="flex flex-1 items-start"
        style={{
          minHeight: scale(99),
          paddingLeft: scale(9.6),
          paddingRight: scale(9.6),
          paddingTop: scale(16.8),
          paddingBottom: scale(14),
          background: "#fffcf9",
        }}
      >
        <div className="flex w-full flex-col items-start">
          <div className="font-black leading-none" style={{ color: item.accentColor, fontSize: scale(18), fontFamily: FONT_FAMILY.headingDisplay }}>
            {item.label}
          </div>
          <div
            className="max-w-full break-words font-black leading-[0.92] text-black"
            style={{ marginTop: scale(8.4), fontSize: scale(25.2), fontFamily: FONT_FAMILY.headingDisplay }}
          >
            {item.run?.userName ?? loadingLabel}
          </div>
          <div className="font-extrabold leading-none text-black" style={{ marginTop: scale(9.6), fontSize: scale(16.2) }}>
            {item.run?.time ?? "--:--"}
          </div>
          <button
            type="button"
            className="text-left font-extrabold leading-none text-[#b8b8b8] transition-colors hover:text-[#666666] disabled:cursor-default disabled:text-[#d0d0d0]"
            style={{ marginTop: scale(4.8), fontSize: scale(7.2) }}
            disabled={item.actionDisabled}
            onClick={(event) => {
              event.stopPropagation();
              if (!item.actionDisabled) {
                item.onAction();
              }
            }}
          >
            {item.actionLabel} →
          </button>
        </div>
      </section>
    </article>
  );
}

function buildCharacterCards(run: HomeRun | null, accentColor: string): CharacterCardData[] {
  if (!run) {
    return Array.from({ length: 4 }, (_, index) => ({
      characterId: `empty-${index}`,
      name: "",
      cardBackgroundColor: accentColor,
      isPlaceholder: true,
    }));
  }

  return Array.from({ length: 4 }, (_, index) => {
    const partyMember = run.party[index];
    const characterId = partyMember?.characterId ?? `empty-${index}`;
    const characterName = characterDb[characterId]?.name ?? characterId;

    return {
      characterId,
      name: characterName,
      cardBackgroundColor: accentColor,
    };
  });
}

function PlayerCharacterCard({ card }: { card: CharacterCardData }) {
  return (
    <div className="relative overflow-hidden bg-[#8f8f91]" style={{ width: CARD_SIZE.outerWidth, height: CARD_SIZE.height, paddingLeft: scale(0.6), paddingRight: scale(0.6) }}>
      <div className="relative h-full w-full overflow-hidden" style={{ background: card.cardBackgroundColor }}>
        <CharacterImageLayer card={card} />
      </div>
    </div>
  );
}

function CharacterImageLayer({ card }: { card: CharacterCardData }) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const urls = useMemo(() => getCharacterImageCandidates(card.characterId, "icon"), [card.characterId]);

  useEffect(() => {
    setIndex(0);
    setHidden(false);
  }, [card.characterId]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={createImageFallbackStyle(card.cardBackgroundColor, card.characterId)} />
      {!card.isPlaceholder && !hidden && urls.length > 0 ? (
        <img
          src={urls[index]}
          alt={card.name}
          className="pointer-events-none absolute max-w-none select-none"
          referrerPolicy="no-referrer"
          style={createCharacterImageStyle()}
          onError={() => {
            const nextIndex = index + 1;
            if (nextIndex < urls.length) {
              setIndex(nextIndex);
            } else {
              setHidden(true);
            }
          }}
        />
      ) : !card.isPlaceholder ? (
        <div
          className="absolute inset-0 flex items-center justify-center text-center font-bold leading-tight text-white/85"
          style={{ paddingLeft: scale(4), paddingRight: scale(4), fontSize: scale(8) }}
        >
          {getFallbackText(card.name)}
        </div>
      ) : null}
      <div className="absolute inset-0" style={createFaceCropOverlayStyle()} />
    </div>
  );
}

function createCharacterImageStyle(): CSSProperties {
  const visiblePercent = MAGAZINE_FACE_CROP.cutRightPercent - MAGAZINE_FACE_CROP.trimLeftPercent;

  return {
    width: `${100 / (visiblePercent / 100)}%`,
    height: "100%",
    left: `${-MAGAZINE_FACE_CROP.trimLeftPercent / (visiblePercent / 100)}%`,
    top: 0,
    objectFit: "cover",
    objectPosition: MAGAZINE_FACE_CROP.objectPosition,
    transform: `scale(${MAGAZINE_FACE_CROP.scale})`,
    transformOrigin: "left center",
  };
}

function createImageFallbackStyle(backgroundColor: string, characterId: string): CSSProperties {
  return {
    backgroundColor,
    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 42%, rgba(0,0,0,0.2) 100%), radial-gradient(circle at 42% 28%, ${getFallbackGlow(characterId)}, rgba(255,255,255,0) 58%)`,
  };
}

function createFaceCropOverlayStyle(): CSSProperties {
  return {
    background: "linear-gradient(180deg, rgba(255,255,255,0) 58%, rgba(0,0,0,0.1) 78%, rgba(0,0,0,0.2) 100%)",
  };
}

function getFallbackText(label: string) {
  return Array.from(label).slice(0, 2).join("");
}

function getFallbackGlow(seed: string) {
  const hue = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
  return `hsla(${hue}, 74%, 76%, 0.38)`;
}

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { getCharacterImageCandidates } from "../../../lib/characterAssets";
import {
  LP_HERO_CHARACTERS,
  LP_HERO_COLORS,
  LP_HERO_COLOR_ORDER_BOTTOM,
  LP_HERO_COLOR_ORDER_TOP,
} from "../content";

type HeroSize = {
  width: number;
  height: number;
};

type HeroCharacter = (typeof LP_HERO_CHARACTERS)[number];

function useElementSize() {
  const ref = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState<HeroSize>({ width: 1440, height: 760 });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return [ref, size] as const;
}

function CharacterPanel({ character, color, index }: { character: HeroCharacter; color: string; index: number }) {
  const urls = useMemo(() => getCharacterImageCandidates(character.key, "gachaIcon"), [character.key]);
  const [imageIndex, setImageIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setImageIndex(0);
    setIsHidden(false);
  }, [character.key]);

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: "var(--lp-panel-width)",
        height: "var(--lp-panel-height)",
        backgroundColor: color,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,.22), rgba(0,0,0,.10)), radial-gradient(circle at 50% 18%, rgba(255,255,255,.28), transparent 36%)",
        }}
      />

      {!isHidden && urls.length > 0 ? (
        <img
          src={urls[imageIndex]}
          alt={character.name}
          className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 select-none object-contain object-bottom"
          draggable="false"
          referrerPolicy="no-referrer"
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
        <div className="absolute inset-0 flex items-center justify-center text-center text-xs font-black text-white/80">
          {character.name}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />
      <div className="absolute inset-y-0 right-0 w-px bg-white/40" />
      {index === 0 ? <div className="absolute inset-y-0 left-0 w-px bg-white/20" /> : null}
    </div>
  );
}

function PanelRow({ row, columns }: { row: 0 | 1; columns: number }) {
  const colorOrder = row === 0 ? LP_HERO_COLOR_ORDER_TOP : LP_HERO_COLOR_ORDER_BOTTOM;
  const characterOffset = row === 0 ? 0 : 5;

  const panels = useMemo(
    () =>
      Array.from({ length: columns }, (_, column) => ({
        id: `${row}-${column}`,
        color: LP_HERO_COLORS[colorOrder[column % colorOrder.length]],
        character: LP_HERO_CHARACTERS[(column + characterOffset) % LP_HERO_CHARACTERS.length],
      })),
    [characterOffset, colorOrder, columns, row],
  );

  return (
    <div className="flex h-[var(--lp-panel-height)] w-max">
      {panels.map((panel, index) => (
        <CharacterPanel key={panel.id} character={panel.character} color={panel.color} index={index} />
      ))}
    </div>
  );
}

export function HeroHeader() {
  const [heroRef, heroSize] = useElementSize();
  const rowHeight = heroSize.height / 2;
  const panelWidth = rowHeight * 0.28;
  const columns = Math.max(16, Math.ceil(heroSize.width / panelWidth) + 8);
  const heroStyle = {
    "--lp-panel-height": `${rowHeight}px`,
    "--lp-panel-width": `${panelWidth}px`,
  } as CSSProperties;

  return (
    <section
      ref={heroRef}
      className="relative h-[860px] min-h-[620px] w-screen max-w-full overflow-hidden bg-neutral-900 text-white shadow-2xl max-md:h-[720px] max-md:min-h-[620px]"
      style={heroStyle}
      aria-label="Elite Run DB landing hero"
    >
      <div className="absolute left-1/2 top-0 flex h-full w-max -translate-x-1/2 flex-col">
        <PanelRow row={0} columns={columns} />
        <PanelRow row={1} columns={columns} />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0),rgba(0,0,0,.10))]" />

      <div
        className="pointer-events-none absolute left-1/2 top-[46%] h-[30rem] w-[min(94vw,76rem)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(7, 24, 46, 0.30) 0%, rgba(7, 24, 46, 0.18) 35%, rgba(7, 24, 46, 0.00) 72%)",
        }}
      />

      <div className="absolute left-1/2 top-[46%] flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4 text-center">
        <p className="mb-2 text-[clamp(1.15rem,3.4vw,1.65rem)] font-black tracking-[0.05em] text-white md:text-[1.65rem]">
          ランキングも、参考探しも、
        </p>

        <h1 className="select-none whitespace-nowrap text-[clamp(2.6rem,10.8vw,3.8rem)] font-black uppercase leading-[0.82] tracking-[-0.09em] text-white sm:text-[clamp(3.8rem,12vw,6.4rem)] md:text-[6.4rem]">
          Elite Run DB
        </h1>

        <p className="mt-3 text-[clamp(1.45rem,4.8vw,2.35rem)] font-black tracking-[0.08em] text-white md:text-[2.35rem]">
          記録をもっと探しやすく
        </p>
      </div>

      <div className="absolute left-5 top-5 rounded-full border border-white/65 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase text-white/95 backdrop-blur-sm md:left-8 md:top-8 md:text-sm">
        ELITE RUN ARCHIVE
      </div>
    </section>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";

const COLORS = ["#0A64C2", "#D09A02", "#AF52DE", "#FB6454", "#4BA85E"];

const COLOR_ORDER_TOP = [2, 3, 4, 1, 0, 3, 4, 2, 1, 0, 4, 3, 2, 1, 0, 4];
const COLOR_ORDER_BOTTOM = [0, 1, 2, 4, 3, 0, 1, 4, 2, 3, 1, 0, 4, 2, 3, 1];

const CHARACTERS = [
  { name: "Lauma", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Lauma.png" },
  { name: "Ifa", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Ifa.png" },
  { name: "Chasca", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Chasca.png" },
  { name: "Xilonen", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Xilonen.png" },
  { name: "Chiori", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Chiori.png" },
  { name: "Yelan", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Yelan.png" },
  { name: "Faruzan", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Faruzan.png" },
  { name: "Dehya", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Dehya.png" },
  { name: "Varesa", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Varesa.png" },
  { name: "Mualani", src: "https://enka.network/ui/UI_Gacha_AvatarIcon_Mualani.png" },
];

const titleShadow = {
  textShadow: "0 3px 14px rgba(7, 24, 46, 0.42)",
};

const subTitleShadow = {
  textShadow: "0 2px 10px rgba(7, 24, 46, 0.36)",
};

function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 1440, height: 760 });

  useEffect(() => {
    if (!ref.current) return;

    const update = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      setSize({ width: rect.width, height: rect.height });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return [ref, size];
}

function CharacterPanel({ character, color, index }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: "var(--panel-width)",
        height: "var(--panel-height)",
        backgroundColor: color,
      }}
    >
      <div
        className="absolute inset-0 opacity-38"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,.22), rgba(0,0,0,.10)), radial-gradient(circle at 50% 18%, rgba(255,255,255,.28), transparent 36%)",
        }}
      />

      <img
        src={character.src}
        alt={character.name}
        className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 object-contain object-bottom"
        draggable="false"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/8" />
      <div className="absolute inset-y-0 right-0 w-px bg-white/38" />
      {index === 0 && <div className="absolute inset-y-0 left-0 w-px bg-white/20" />}
    </div>
  );
}

function PanelRow({ row, columns }) {
  const colorOrder = row === 0 ? COLOR_ORDER_TOP : COLOR_ORDER_BOTTOM;
  const characterOffset = row === 0 ? 0 : 5;

  const panels = useMemo(() => {
    return Array.from({ length: columns }, (_, column) => ({
      id: `${row}-${column}`,
      color: COLORS[colorOrder[column % colorOrder.length]],
      character: CHARACTERS[(column + characterOffset) % CHARACTERS.length],
    }));
  }, [columns, row, colorOrder, characterOffset]);

  return (
    <div className="flex h-[var(--panel-height)] w-max">
      {panels.map((panel, index) => (
        <CharacterPanel
          key={panel.id}
          character={panel.character}
          color={panel.color}
          index={index}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [heroRef, heroSize] = useElementSize();

  const rowHeight = heroSize.height / 2;
  const panelAspect = 0.28;
  const panelHeight = rowHeight;
  const panelWidth = panelHeight * panelAspect;
  const columns = Math.max(16, Math.ceil(heroSize.width / panelWidth) + 8);

  return (
    <main className="min-h-screen bg-[#f3eee4] font-sans text-white">
      <section
        ref={heroRef}
        className="relative h-[min(100vh,860px)] min-h-[680px] w-screen overflow-hidden bg-neutral-900 shadow-2xl"
        style={{
          "--panel-height": `${panelHeight}px`,
          "--panel-width": `${panelWidth}px`,
        }}
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
          <p
            className="mb-2 text-[clamp(1.15rem,3.4vw,1.65rem)] font-black tracking-[0.05em] text-white md:text-[1.65rem]"
            style={subTitleShadow}
          >
            ランキングも、参考探しも、
          </p>

          <h1
            className="select-none whitespace-nowrap text-[clamp(3.8rem,12vw,6.4rem)] font-black uppercase leading-[0.82] tracking-[-0.09em] text-white md:text-[6.4rem]"
            style={titleShadow}
          >
            Elite Run DB
          </h1>

          <p
            className="mt-3 text-[clamp(1.45rem,4.8vw,2.35rem)] font-black tracking-[0.08em] text-white md:text-[2.35rem]"
            style={subTitleShadow}
          >
            記録をもっと探しやすく
          </p>
        </div>

        <div className="absolute left-5 top-5 rounded-full border border-white/65 bg-white/15 px-4 py-1.5 text-xs font-bold tracking-[0.24em] text-white/95 backdrop-blur-sm md:left-8 md:top-8 md:text-sm">
          ELITE RUN ARCHIVE
        </div>
      </section>
    </main>
  );
}

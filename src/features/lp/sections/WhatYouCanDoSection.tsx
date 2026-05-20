import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import { LP_FEATURE_CARDS, LP_SECTION2_ASSETS, type LpFeatureCard } from "../content";

const SECTION_BASE_WIDTH = 1254;
const SECTION_TOP_PADDING = 54;
const HEADER_HEIGHT = 190;
const HEADER_TO_CARDS_GAP = 39;
const CARD_BODY_HEIGHT = 304;
const CTA_HEIGHT = 48;
const CARD_HEIGHT = CARD_BODY_HEIGHT + CTA_HEIGHT;
const CARD_GAP = 180;
const CTA_BAND_BACKGROUND = "#333333";
const SECTION3_OVERLAP_HEIGHT = 104;
const LAST_CHARACTER_EXTENSION = 180;
const CARD_STACK_TOP = SECTION_TOP_PADDING + HEADER_HEIGHT + HEADER_TO_CARDS_GAP;
const CARD_STACK_VISUAL_HEIGHT = CARD_STACK_TOP + CARD_HEIGHT * 3 + CARD_GAP * 2;
const SECTION_BASE_HEIGHT = CARD_STACK_VISUAL_HEIGHT + LAST_CHARACTER_EXTENSION;
const REVEAL_TRIGGER_STAGES = ["title", "card01"] as const;

type RevealStage = "title" | "card01" | "card02AndCharacter01" | "card03AndCharacters";
type RevealTriggerStage = (typeof REVEAL_TRIGGER_STAGES)[number];
type VisibleStages = Record<RevealStage, boolean>;

type FeatureLayout = {
  rowTop: number;
  rowHeight: number;
  cardLeft: number;
  cardWidth: number;
  characterLeft: number;
  characterTop: number;
  characterWidth: number;
  characterHeight: number;
  contentAlign: "left" | "right";
  objectPosition: string;
  zIndex: number;
};

const FEATURE_LAYOUTS: Record<LpFeatureCard["number"], FeatureLayout> = {
  "01": {
    rowTop: CARD_STACK_TOP,
    rowHeight: CARD_HEIGHT,
    cardLeft: 0,
    cardWidth: 1058,
    characterLeft: 842,
    characterTop: -40,
    characterWidth: 404,
    characterHeight: CARD_HEIGHT + CARD_GAP + 40,
    contentAlign: "left",
    objectPosition: "center bottom",
    zIndex: 10,
  },
  "02": {
    rowTop: CARD_STACK_TOP + CARD_HEIGHT + CARD_GAP,
    rowHeight: CARD_HEIGHT + CARD_GAP,
    cardLeft: 194,
    cardWidth: 1060,
    characterLeft: -52,
    characterTop: -CARD_GAP,
    characterWidth: 700,
    characterHeight: CARD_HEIGHT + CARD_GAP * 2,
    contentAlign: "right",
    objectPosition: "center bottom",
    zIndex: 20,
  },
  "03": {
    rowTop: CARD_STACK_TOP + CARD_HEIGHT * 2 + CARD_GAP * 2,
    rowHeight: CARD_HEIGHT + LAST_CHARACTER_EXTENSION,
    cardLeft: 0,
    cardWidth: 1059,
    characterLeft: 650,
    characterTop: 0,
    characterWidth: 600,
    characterHeight: 660,
    contentAlign: "left",
    objectPosition: "center bottom",
    zIndex: 30,
  },
};

const FEATURE_BY_NUMBER = Object.fromEntries(LP_FEATURE_CARDS.map((feature) => [feature.number, feature])) as Record<LpFeatureCard["number"], LpFeatureCard>;

const INITIAL_VISIBLE_STAGES: VisibleStages = {
  title: false,
  card01: false,
  card02AndCharacter01: false,
  card03AndCharacters: false,
};

const STAGE_TRIGGER_TOPS: Record<RevealTriggerStage, number> = {
  title: SECTION_TOP_PADDING,
  card01: CARD_STACK_TOP - 90,
};

function getInitialScale() {
  if (typeof window === "undefined") {
    return 1;
  }

  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  return Math.min(1, viewportWidth / SECTION_BASE_WIDTH);
}

function useUniformSectionScale() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(getInitialScale);

  useLayoutEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    const updateScale = () => {
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const availableWidth = Math.min(containerElement.clientWidth || viewportWidth, viewportWidth);
      setScale(Math.min(1, availableWidth / SECTION_BASE_WIDTH));
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
  }, []);

  return { containerRef, scale };
}

function revealAllStages(): VisibleStages {
  return {
    title: true,
    card01: true,
    card02AndCharacter01: true,
    card03AndCharacters: true,
  };
}

function useRevealStages() {
  const triggerRefs = useRef<Record<RevealTriggerStage, HTMLDivElement | null>>({
    title: null,
    card01: null,
  });
  const [visibleStages, setVisibleStages] = useState<VisibleStages>(INITIAL_VISIBLE_STAGES);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleStages(revealAllStages());
      return;
    }

    const observed = REVEAL_TRIGGER_STAGES.flatMap((stage) => {
      const element = triggerRefs.current[stage];
      return element ? [{ element, stage }] : [];
    });

    if (observed.length === 0) {
      return;
    }

    const revealNow = observed
      .filter(({ element }) => element.getBoundingClientRect().top < window.innerHeight * 0.58)
      .map(({ stage }) => stage);

    if (revealNow.length > 0) {
      setVisibleStages((current) => {
        const next = { ...current };
        revealNow.forEach((stage) => {
          revealStage(next, stage);
        });
        return next;
      });
    }

    const stageByElement = new Map<Element, RevealTriggerStage>(observed.map(({ element, stage }) => [element, stage]));
    const observer = new IntersectionObserver(
      (entries) => {
        const nextStages: RevealTriggerStage[] = [];

        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const stage = stageByElement.get(entry.target);
          if (!stage) {
            return;
          }

          nextStages.push(stage);
          observer.unobserve(entry.target);
        });

        if (nextStages.length === 0) {
          return;
        }

        setVisibleStages((current) => {
          const next = { ...current };
          nextStages.forEach((stage) => {
            revealStage(next, stage);
          });
          return next;
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -42% 0px",
        threshold: 0.01,
      },
    );

    observed.forEach(({ element, stage }) => {
      if (!revealNow.includes(stage)) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const setTriggerRef = (stage: RevealTriggerStage) => (element: HTMLDivElement | null) => {
    triggerRefs.current[stage] = element;
  };

  return { setTriggerRef, visibleStages };
}

function revealStage(next: VisibleStages, stage: RevealTriggerStage) {
  if (stage === "title") {
    next.title = true;
    return;
  }

  next.card01 = true;
  next.card02AndCharacter01 = true;
  next.card03AndCharacters = true;
}

function getBottomSpacerHeight(scale: number) {
  return Math.max(SECTION3_OVERLAP_HEIGHT, LAST_CHARACTER_EXTENSION * scale);
}

function createScaledFrameStyle(scale: number): CSSProperties {
  return {
    width: SECTION_BASE_WIDTH * scale,
    height: CARD_STACK_VISUAL_HEIGHT * scale + getBottomSpacerHeight(scale),
  };
}

function createScaledCanvasStyle(scale: number): CSSProperties {
  return {
    width: SECTION_BASE_WIDTH,
    height: SECTION_BASE_HEIGHT,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };
}

function createRevealStyle(isVisible: boolean, delayMs = 0): CSSProperties {
  return {
    filter: isVisible ? "blur(0)" : "blur(10px)",
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? "auto" : "none",
    transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 36px, 0) scale(0.985)",
    transition: `opacity 780ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform 780ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, filter 780ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
    willChange: "opacity, transform, filter",
  };
}

function FeatureTitle({ title }: { title: LpFeatureCard["title"] }) {
  return (
    <h3 className="whitespace-nowrap text-[48px] font-black leading-none tracking-[-0.96px] text-[#333333]" style={{ fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif' }}>
      {title.before ? <span>{title.before}</span> : null}
      <span>{title.accent}</span>
      {title.after ? <span>{title.after}</span> : null}
    </h3>
  );
}

function FeatureCardBody({ feature, layout }: { feature: LpFeatureCard; layout: FeatureLayout }) {
  const isRightAligned = layout.contentAlign === "right";
  const bodyStyle: CSSProperties = {
    alignItems: isRightAligned ? "flex-end" : "flex-start",
    paddingLeft: isRightAligned ? 260 : 0,
    paddingRight: 16,
  };

  return (
    <div className="relative z-20 flex flex-col justify-start overflow-hidden bg-[#fffcf9]" style={{ ...bodyStyle, height: CARD_BODY_HEIGHT }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img className="h-full w-full object-cover opacity-10" src={LP_SECTION2_ASSETS.cardBackgroundImage} alt="" />
      </div>

      <div className="relative flex flex-col gap-5 py-3">
        <div className="flex items-center gap-6">
          <div className="h-[96px] w-5 shrink-0" />
          <div className="shrink-0 font-['Montserrat',sans-serif] text-[96px] font-medium leading-[64px] tracking-[4.8px]" style={{ color: feature.accentColor }}>
            {feature.number}
          </div>
          <div className="shrink-0 pb-0.5">
            <p className="text-[20px] leading-normal tracking-[-0.4px] text-[#333333]" style={{ fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif' }}>
              {feature.pointLabel}
            </p>
            <FeatureTitle title={feature.title} />
          </div>
        </div>

        <div
          className="max-w-[900px] pl-[52px] pr-2 text-[24px] font-bold leading-[40px] tracking-[1.2px] text-[#333333]"
          style={{ fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif' }}
        >
          {feature.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCardCta({ align }: { align: FeatureLayout["contentAlign"] }) {
  return (
    <div
      className="relative z-20 flex items-center px-12 text-[20px] font-bold leading-[40px] tracking-[1px] text-[#fffcf9]"
      style={{ height: CTA_HEIGHT, backgroundColor: CTA_BAND_BACKGROUND, justifyContent: align === "right" ? "flex-end" : "flex-start" }}
    >
      <span style={{ fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif' }}>この機能を使ってみる→</span>
    </div>
  );
}

function FeatureCharacter({ delayMs = 0, feature, isVisible, layout }: { delayMs?: number; feature: LpFeatureCard; isVisible: boolean; layout: FeatureLayout }) {
  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{
        ...createRevealStyle(isVisible, delayMs),
        left: layout.characterLeft,
        pointerEvents: "none",
        top: layout.rowTop + layout.characterTop,
        width: layout.characterWidth,
        height: layout.characterHeight,
        zIndex: layout.zIndex + 5,
      }}
      aria-hidden="true"
    >
      <img src={feature.characterImage} alt="" className="h-full w-full select-none object-contain" style={{ objectPosition: layout.objectPosition }} />
    </div>
  );
}

function FeatureCard({ delayMs = 0, feature, isVisible }: { delayMs?: number; feature: LpFeatureCard; isVisible: boolean }) {
  const layout = FEATURE_LAYOUTS[feature.number];

  return (
    <a
      href={feature.href}
      className="group absolute left-0 block text-left outline-none focus-visible:ring-4 focus-visible:ring-white/80"
      style={{ ...createRevealStyle(isVisible, delayMs), left: layout.cardLeft, top: layout.rowTop, width: layout.cardWidth, height: CARD_HEIGHT, zIndex: layout.zIndex }}
      tabIndex={isVisible ? undefined : -1}
    >
      <div
        className="absolute inset-0 z-20 flex flex-col overflow-hidden rounded-[4px] bg-[#fffcf9] shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-[box-shadow,filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.004] group-hover:shadow-[0_26px_86px_rgba(0,0,0,0.24)] group-focus-visible:brightness-[1.004] group-focus-visible:shadow-[0_26px_86px_rgba(0,0,0,0.24)] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.004] motion-safe:group-focus-visible:-translate-y-1 motion-safe:group-focus-visible:scale-[1.004]"
        style={{
          height: CARD_BODY_HEIGHT + CTA_HEIGHT,
        }}
      >
        <FeatureCardBody feature={feature} layout={layout} />
        <FeatureCardCta align={layout.contentAlign} />
      </div>
    </a>
  );
}

function SectionHeader({ isVisible }: { isVisible: boolean }) {
  return (
    <header className="absolute left-2 top-[54px] h-[190px] w-[582px]" style={{ ...createRevealStyle(isVisible), zIndex: 5 }}>
      <div className="-rotate-3 py-4">
        <h2 id="lp-features-title" className="whitespace-nowrap font-['Montserrat',sans-serif] text-[64px] font-bold leading-normal tracking-[-1.28px] text-white">
          What You Can Do
        </h2>
        <p
          className="whitespace-nowrap text-[32px] leading-normal tracking-[-0.64px] text-white"
          style={{ fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif' }}
        >
          このサイトでできること
        </p>
      </div>
    </header>
  );
}

function RevealTrigger({ setTriggerRef, stage }: { setTriggerRef: (stage: RevealTriggerStage) => (element: HTMLDivElement | null) => void; stage: RevealTriggerStage }) {
  return <div ref={setTriggerRef(stage)} className="pointer-events-none absolute left-0 h-px w-px" style={{ top: STAGE_TRIGGER_TOPS[stage] }} aria-hidden="true" />;
}

export const WhatYouCanDoSection = forwardRef<HTMLElement>(function WhatYouCanDoSection(_props, ref) {
  const { containerRef, scale } = useUniformSectionScale();
  const { setTriggerRef, visibleStages } = useRevealStages();
  const feature01 = FEATURE_BY_NUMBER["01"];
  const feature02 = FEATURE_BY_NUMBER["02"];
  const feature03 = FEATURE_BY_NUMBER["03"];

  return (
    <section ref={ref} className="relative z-10 overflow-hidden bg-[#202020] text-white" aria-labelledby="lp-features-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img className="h-full w-full object-cover object-center" src={LP_SECTION2_ASSETS.backgroundImage} alt="" />
        <div className="absolute inset-0 bg-[#333333]/65" />
      </div>

      <div ref={containerRef} className="relative mx-auto w-full max-w-[1254px]">
        <div className="relative mx-auto overflow-visible" style={createScaledFrameStyle(scale)}>
          <div className="absolute left-0 top-0 overflow-visible" style={createScaledCanvasStyle(scale)}>
            {REVEAL_TRIGGER_STAGES.map((stage) => (
              <RevealTrigger key={stage} stage={stage} setTriggerRef={setTriggerRef} />
            ))}

            <SectionHeader isVisible={visibleStages.title} />
            <FeatureCard feature={feature01} isVisible={visibleStages.card01} />

            <FeatureCard delayMs={220} feature={feature02} isVisible={visibleStages.card02AndCharacter01} />
            <FeatureCharacter delayMs={330} feature={feature01} isVisible={visibleStages.card02AndCharacter01} layout={FEATURE_LAYOUTS["01"]} />

            <FeatureCard delayMs={500} feature={feature03} isVisible={visibleStages.card03AndCharacters} />
            <FeatureCharacter delayMs={620} feature={feature02} isVisible={visibleStages.card03AndCharacters} layout={FEATURE_LAYOUTS["02"]} />
            <FeatureCharacter delayMs={730} feature={feature03} isVisible={visibleStages.card03AndCharacters} layout={FEATURE_LAYOUTS["03"]} />
          </div>
        </div>
      </div>
    </section>
  );
});

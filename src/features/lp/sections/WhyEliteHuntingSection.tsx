import { type CSSProperties, type ReactNode } from "react";

import { useElementSize } from "../hooks";
import favoriteCharacterImage from "../assets/section4-favorite-character.jpg";
import openWorldImage from "../assets/section4-open-world.jpg";

const BASE_LAYOUT = {
  width: 775,
  height: 588,
} as const;

const FONT_FAMILY = {
  japanese: '"Zen Kaku Gothic New", "Noto Sans JP", "Hiragino Sans", sans-serif',
} as const;

const BENEFITS = [
  {
    key: "open-world",
    image: openWorldImage,
    imageAlt: "空に浮かぶ遺跡とキャラクターが見えるオープンワールド風景",
    imageClassName: "absolute left-[412px] top-[132px] h-[201px] w-[363px] overflow-hidden rounded-l-[13px]",
    headingClassName: "absolute left-[78px] top-[138px] w-[275px]",
    bodyClassName: "absolute left-[79px] top-[230px] w-[265px]",
    heading: (
      <>
        <span>オープンワールドを</span>
        <span>
          <span className="text-[#0874d1]">堪能</span>できる！
        </span>
      </>
    ),
    body: "螺旋や幽境と異なり、精鋭狩りは原神の特徴であるオープンワールドで行う競技のため、たくさんの景色を楽しみながら戦闘ができます。",
  },
  {
    key: "favorite-character",
    image: favoriteCharacterImage,
    imageAlt: "夜景を背景にしたキャラクター",
    imageClassName: "absolute left-0 top-[375px] h-[198px] w-[366px] overflow-hidden rounded-r-[13px]",
    headingClassName: "absolute left-[438px] top-[386px] w-[295px]",
    bodyClassName: "absolute left-[439px] top-[449px] w-[270px]",
    heading: (
      <>
        <span>
          好きなキャラで<span className="text-[#d09a02]">討伐</span>！
        </span>
      </>
    ),
    body: "螺旋や幽境と異なり、精鋭狩りは接待Bossなどが存在しないため、あなたの好みのキャラクターでタイムを突き詰めることができます。",
  },
] as const;

function createCanvasStyle(scale: number): CSSProperties {
  return {
    width: BASE_LAYOUT.width,
    height: BASE_LAYOUT.height,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };
}

function BenefitHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={`${className} flex flex-col text-[24px] font-black leading-[1.62] tracking-[0.04em] text-black`}
      style={{ fontFamily: FONT_FAMILY.japanese }}
    >
      {children}
    </h3>
  );
}

function BenefitBody({ body, className = "" }: { body: string; className?: string }) {
  return (
    <p className={`${className} text-[13px] font-bold leading-[2.35] tracking-[0.02em] text-black`} style={{ fontFamily: FONT_FAMILY.japanese }}>
      {body}
    </p>
  );
}

function DesktopBenefitSection() {
  const [containerRef, size] = useElementSize<HTMLDivElement>(BASE_LAYOUT);
  const scale = size.width / BASE_LAYOUT.width;

  return (
    <section
      ref={containerRef}
      className="relative hidden w-screen overflow-hidden bg-[#e9e9e9] md:block"
      style={{ height: BASE_LAYOUT.height * scale }}
      aria-labelledby="lp-why-elite-hunting-title"
    >
      <div className="absolute left-0 top-0" style={createCanvasStyle(scale)}>
        <header className="absolute left-0 top-[18px] w-full text-center">
          <h2
            id="lp-why-elite-hunting-title"
            className="max-w-full whitespace-nowrap pt-1 text-[50px] font-normal leading-[1.08] text-black [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]"
          >
            Why Elite Hunting
          </h2>
          <p className="mt-2 text-[18px] font-medium leading-none tracking-[0.08em] text-black" style={{ fontFamily: FONT_FAMILY.japanese }}>
            精鋭狩りRTAを始めるメリットとは？
          </p>
        </header>

        {BENEFITS.map((benefit) => (
          <div key={benefit.key}>
            <div className={benefit.imageClassName}>
              <img className="h-full w-full object-cover" src={benefit.image} alt={benefit.imageAlt} />
            </div>
            <BenefitHeading className={benefit.headingClassName}>{benefit.heading}</BenefitHeading>
            <BenefitBody className={benefit.bodyClassName} body={benefit.body} />
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileBenefitSection() {
  return (
    <section className="bg-[#e9e9e9] px-5 py-12 md:hidden" aria-labelledby="lp-why-elite-hunting-title-mobile">
      <header className="text-center">
        <h2
          id="lp-why-elite-hunting-title-mobile"
          className="max-w-full whitespace-nowrap pt-1 text-[43px] font-normal leading-[1.08] text-black [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]"
        >
          Why Elite Hunting
        </h2>
        <p className="mt-3 text-[15px] font-medium leading-[1.55] tracking-[0.04em] text-black" style={{ fontFamily: FONT_FAMILY.japanese }}>
          精鋭狩りRTAを始めるメリットとは？
        </p>
      </header>

      <div className="mt-9 flex flex-col gap-10">
        {BENEFITS.map((benefit, index) => (
          <article key={benefit.key} className="flex flex-col gap-5">
            <div className={`overflow-hidden rounded-[13px] ${index === 1 ? "order-first" : ""}`}>
              <img className="aspect-[1.84/1] w-full object-cover" src={benefit.image} alt={benefit.imageAlt} />
            </div>
            <div>
              <BenefitHeading className="text-[24px] leading-[1.5]">{benefit.heading}</BenefitHeading>
              <BenefitBody className="mt-4 text-[14px] leading-[2.2]" body={benefit.body} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WhyEliteHuntingSection() {
  return (
    <>
      <div className="h-3 w-full bg-[#d4d4d4]" aria-hidden="true" />
      <DesktopBenefitSection />
      <MobileBenefitSection />
    </>
  );
}

import type { CSSProperties } from "react";

import { LP_FEATURE_CARDS, LP_SECTION2_ASSETS, type LpFeatureCard } from "../content";

function FeatureTitle({ title, accentColor }: { title: LpFeatureCard["title"]; accentColor: string }) {
  return (
    <h3 className="flex flex-wrap items-baseline text-4xl font-black leading-tight text-[#333333] md:text-5xl">
      {title.before ? <span>{title.before}</span> : null}
      <span style={{ color: accentColor }}>{title.accent}</span>
      {title.after ? <span>{title.after}</span> : null}
    </h3>
  );
}

function FeatureCard({ feature }: { feature: LpFeatureCard }) {
  const isCharacterLeft = feature.characterSide === "left";

  return (
    <article className="relative min-h-[540px] w-full overflow-hidden md:min-h-[530px]">
      <div
        className={`relative z-10 flex min-h-[360px] w-full max-w-[1058px] flex-col justify-between overflow-hidden bg-[#fffcf9] shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:absolute md:top-0 ${
          isCharacterLeft ? "md:right-0" : "md:left-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img className="absolute inset-0 h-full w-full object-cover opacity-10" src={LP_SECTION2_ASSETS.cardBackgroundImage} alt="" />
        </div>

        <div className={`relative z-10 flex flex-col gap-8 px-6 pb-8 pt-8 md:py-12 ${isCharacterLeft ? "md:items-end md:pr-8 md:text-left" : "md:pl-12"}`}>
          <div className="flex items-center gap-5 md:gap-6">
            <div className="hidden w-5 self-stretch md:block" />
            <div className="font-['Montserrat',sans-serif] text-7xl font-medium leading-none text-[#333333] md:text-8xl">{feature.number}</div>
            <div className="min-w-0">
              <p className="mb-1 text-xl text-[#333333]">{feature.pointLabel}</p>
              <FeatureTitle title={feature.title} accentColor={feature.accentColor} />
            </div>
          </div>

          <div className="max-w-[780px] pl-0 text-xl font-bold leading-[1.9] text-[#333333] md:pl-13 md:text-2xl">
            {feature.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <a
          href={feature.href}
          className={`relative z-10 flex min-h-16 items-center bg-[var(--feature-accent)] px-8 text-lg font-bold text-[#fffcf9] transition-colors hover:brightness-95 md:px-12 md:text-xl ${
            isCharacterLeft ? "md:justify-end" : ""
          }`}
          style={{ "--feature-accent": feature.accentColor } as CSSProperties}
        >
          この機能を使ってみる→
        </a>
      </div>

      <div
        className={`pointer-events-none absolute bottom-0 z-20 flex max-w-[46%] md:top-0 md:max-w-none ${
          isCharacterLeft ? "left-0 justify-start" : "right-0 justify-end"
        }`}
        aria-hidden="true"
      >
        <img src={feature.characterImage} alt="" className={`${feature.characterClassName} select-none`} />
      </div>
    </article>
  );
}

export function WhatYouCanDoSection() {
  return (
    <section className="relative overflow-hidden bg-[#202020] px-5 pb-56 pt-14 text-white md:px-8 md:pb-64 md:pt-20" aria-labelledby="lp-features-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img className="h-full w-full object-cover object-center" src={LP_SECTION2_ASSETS.backgroundImage} alt="" />
        <div className="absolute inset-0 bg-[#333333]/65" />
      </div>

      <div className="relative mx-auto flex max-w-[1254px] flex-col gap-10">
        <header className="-rotate-3 self-start py-4">
          <h2 id="lp-features-title" className="font-['Montserrat',sans-serif] text-5xl font-bold leading-tight text-white md:text-6xl">
            What You Can Do
          </h2>
          <p className="text-2xl text-white md:text-3xl">このサイトでできること</p>
        </header>

        <div className="flex flex-col gap-10">
          {LP_FEATURE_CARDS.map((feature) => (
            <FeatureCard key={feature.number} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";

import { ChevronRightIcon, CrownIcon } from "../../components/UiIcons";
import { SearchIcon } from "../home/ui/icons";
import { HeroHeader } from "./sections/HeroHeader";
import { TopRecordsSection } from "./sections/TopRecordsSection";
import { WhatYouCanDoSection } from "./sections/WhatYouCanDoSection";

const LP_CTA_DELAY_MS = 640;

export function LpPage() {
  const section2Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const isCtaReady = useDelayedCtaReady();
  const isCtaSuppressed = useLpCtaSuppression(section2Ref, section3Ref);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3eee4] text-[#111116]">
      <HeroHeader />
      <WhatYouCanDoSection ref={section2Ref} />
      <TopRecordsSection ref={section3Ref} />
      <LpFloatingCtaStack isVisible={isCtaReady && !isCtaSuppressed} />
    </main>
  );
}

function useDelayedCtaReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsReady(true);
      return;
    }

    const timerId = window.setTimeout(() => {
      setIsReady(true);
    }, LP_CTA_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  return isReady;
}

function useLpCtaSuppression(section2Ref: RefObject<HTMLElement | null>, section3Ref: RefObject<HTMLElement | null>) {
  const [isSuppressed, setIsSuppressed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let animationFrame = 0;

    const updateSuppression = () => {
      animationFrame = 0;

      const section2 = section2Ref.current;
      if (!section2) {
        setIsSuppressed(false);
        return;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const section2Rect = section2.getBoundingClientRect();
      const section3Rect = section3Ref.current?.getBoundingClientRect();
      const isSection2ContentArea = section2Rect.top < viewportHeight * 0.72 && section2Rect.bottom > viewportHeight * 0.22;
      const isSection3Area = section3Rect ? section3Rect.top < viewportHeight * 0.78 : false;

      setIsSuppressed(isSection2ContentArea && !isSection3Area);
    };

    const requestUpdate = () => {
      if (animationFrame !== 0) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateSuppression);
    };

    updateSuppression();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [section2Ref, section3Ref]);

  return isSuppressed;
}

function createCtaStackStyle(isVisible: boolean): CSSProperties {
  return {
    filter: isVisible ? "blur(0)" : "blur(6px)",
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? "auto" : "none",
    transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 14px, 0)",
    transition: isVisible
      ? "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1), transform 620ms cubic-bezier(0.22, 1, 0.36, 1), filter 620ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "opacity 260ms ease, transform 260ms ease, filter 260ms ease",
    willChange: "opacity, transform, filter",
  };
}

function LpFloatingCtaStack({ isVisible }: { isVisible: boolean }) {
  return (
    <nav
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:right-6"
      style={createCtaStackStyle(isVisible)}
      aria-hidden={!isVisible}
      aria-label="LP quick navigation"
    >
      <LpFloatingCtaLink
        href="#home"
        ariaLabel="全ランキングへ移動"
        isVisible={isVisible}
        badge={
          <>
            <CrownIcon className="h-[11px] w-[11px] shrink-0" />
            Ranking
          </>
        }
      >
        全ランキング
      </LpFloatingCtaLink>
      <LpFloatingCtaLink
        href="#library"
        ariaLabel="記録を探すページへ移動"
        isVisible={isVisible}
        badge={
          <>
            <SearchIcon size={11} className="shrink-0" />
            Search
          </>
        }
      >
        記録を探す
      </LpFloatingCtaLink>
    </nav>
  );
}

function LpFloatingCtaLink({
  ariaLabel,
  badge,
  children,
  href,
  isVisible,
}: {
  ariaLabel: string;
  badge: ReactNode;
  children: ReactNode;
  href: string;
  isVisible: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      tabIndex={isVisible ? undefined : -1}
      className="flex w-[236px] items-center justify-between gap-3 border border-white/45 bg-[#111116] px-3.5 py-3 text-left text-white shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
    >
      <span className="flex items-center gap-1.5 border border-white/60 px-2 py-1 text-[9px] font-bold uppercase leading-none text-white/95">{badge}</span>
      <span className="cta-shine-text shrink-0 whitespace-nowrap text-[14px] font-black leading-none sm:text-[15px]">{children}</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-white" />
    </a>
  );
}

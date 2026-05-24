import { useRef } from "react";

import { AppFooter, AppFooterBottomSpacer } from "../../components/AppFooter";
import { LpFloatingCtaStack } from "./FloatingCtaStack";
import { useLpFloatingCtaVisibility } from "./hooks";
import { HeroHeader } from "./sections/HeroHeader";
import { SectionNavBand } from "./sections/SectionNavBand";
import { TopRecordsSection } from "./sections/TopRecordsSection";
import { WhatYouCanDoSection } from "./sections/WhatYouCanDoSection";
import { WhyEliteHuntingSection } from "./sections/WhyEliteHuntingSection";

export function LpPage() {
  const section2Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const isCtaVisible = useLpFloatingCtaVisibility(section2Ref, section3Ref);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3eee4] text-[#111116]">
      <HeroHeader />
      <SectionNavBand />
      <WhatYouCanDoSection ref={section2Ref} />
      <TopRecordsSection ref={section3Ref} />
      <WhyEliteHuntingSection />
      <AppFooter />
      <AppFooterBottomSpacer />
      <LpFloatingCtaStack isVisible={isCtaVisible} />
    </main>
  );
}

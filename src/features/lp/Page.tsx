import { HeroHeader } from "./sections/HeroHeader";
import { TopRecordsSection } from "./sections/TopRecordsSection";
import { WhatYouCanDoSection } from "./sections/WhatYouCanDoSection";

export function LpPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3eee4] text-[#111116]">
      <HeroHeader />
      <WhatYouCanDoSection />
      <TopRecordsSection />
    </main>
  );
}

import { TimerIcon } from "./UiIcons";

export function AppFooter() {
  return (
    <footer className="border-t border-[#e5e7eb] bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-[#8d93a3]">
        <div className="mb-4 flex items-center justify-center gap-2 text-[#5f6678]">
          <TimerIcon size={20} />
          <span className="text-lg font-bold">Teyvat EliteDB</span>
        </div>
        <p className="mb-2">Community Driven Elite Hunting RTA Database (Prototype)</p>
        <p>Created based on R&apos;s concept &amp; Community Feedback.</p>
      </div>
    </footer>
  );
}

export function AppFooterBottomSpacer() {
  return <div className="h-20 bg-[#EDECEC]" aria-hidden="true" />;
}

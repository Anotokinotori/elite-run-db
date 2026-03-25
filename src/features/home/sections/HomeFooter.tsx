import { TimerIcon } from "../homeIcons";

export function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#212121] py-12">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-white/52">
        <div className="mb-4 flex items-center justify-center gap-2 text-white/74">
          <TimerIcon size={20} />
          <span className="text-lg font-bold">Teyvat EliteDB</span>
        </div>
        <p className="mb-2">Community Driven Elite Hunting RTA Database (Prototype)</p>
        <p>Created based on R&apos;s concept &amp; Community Feedback.</p>
      </div>
    </footer>
  );
}

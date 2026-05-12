import { CalendarIcon } from "../ui/icons";

export function FestivalBanner() {
  return (
    <div className="bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] rounded-2xl p-8 mb-8 text-center relative overflow-hidden shadow-lg">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-white text-xs font-bold mb-3 border border-white/40 backdrop-blur-sm">
          <CalendarIcon size={12} /> VERSION EVENT
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md tracking-tight">Festival Event</h2>
        <p className="text-white/90 text-lg font-bold">ルール別のイベント記録をここに並べる構成です。</p>
      </div>
    </div>
  );
}

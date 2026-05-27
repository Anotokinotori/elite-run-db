import { COST_BRACKET_OPTIONS, UI } from '../config';
import type { NumericRange } from '../../../types';

export function LibrarySelectControl({
  title,
  value,
  options,
  placeholder,
  onChange,
}: {
  title: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <span className="mb-2 block text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-[8px] border border-[#d8dde6] bg-white px-3 pr-10 text-[14px] font-bold text-[#333333] outline-none transition-colors focus:border-[#9aa7ba] focus:bg-white"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] leading-none text-[#999999]">⌄</span>
      </span>
    </label>
  );
}

export function ChoiceFilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <p className="mb-2 text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(active ? null : option)}
              className={[
                "min-h-9 rounded-full border px-3 py-1.5 text-[12px] font-black transition-colors",
                active ? "border-[#111116] bg-[#111116] text-white" : "border-[#dcdcdc] bg-white text-[#333333] hover:bg-[#eeeeee]",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function RangeFilterControl({ title, value, limit, onChange }: { title: string; value: NumericRange; limit: NumericRange; onChange: (range: NumericRange) => void }) {
  const span = limit.max - limit.min;
  const leftPercent = ((value.min - limit.min) / span) * 100;
  const rightPercent = ((value.max - limit.min) / span) * 100;

  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</p>
        <p className="text-[12px] font-black text-[#333333]">{value.min}〜{value.max}</p>
      </div>
      <div className="relative mt-5 h-8">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#d9dde5]" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#111116]" style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }} />
        <input type="range" min={limit.min} max={limit.max} value={value.min} onChange={(event) => onChange({ min: Math.min(Number(event.target.value), value.max), max: value.max })} className="library-range-input absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 appearance-none bg-transparent accent-[#111116]" aria-label={`${title} 最小値`} />
        <input type="range" min={limit.min} max={limit.max} value={value.max} onChange={(event) => onChange({ min: value.min, max: Math.max(Number(event.target.value), value.min) })} className="library-range-input absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 appearance-none bg-transparent accent-[#111116]" aria-label={`${title} 最大値`} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-bold text-[#9a9a9a]">
        <span>{limit.min}</span>
        <span>{limit.max}</span>
      </div>
    </section>
  );
}

export function MaxValueSelector({ title, prefix, value, min = 0, max, onChange }: { title: string; prefix: "C" | "R"; value: number | null; min?: number; max: number; onChange: (value: number | null) => void }) {
  const options = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">{title}</p>
        <button type="button" onClick={() => onChange(null)} className="text-[11px] font-black text-[#999999] hover:text-[#333333]">解除</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button key={option} type="button" onClick={() => onChange(active ? null : option)} className={["h-9 min-w-11 rounded-full border px-3 text-[12px] font-black transition-colors", active ? "border-[#111116] bg-[#111116] text-white" : "border-[#dcdcdc] bg-white text-[#333333] hover:bg-[#eeeeee]"].join(" ")}>
              {prefix}{option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function CostBracketSelector({ value, onChange }: { value: 1 | 2 | 3 | 4 | null; onChange: (value: 1 | 2 | 3 | 4 | null) => void }) {
  return (
    <section className="rounded-[8px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[12px] font-black tracking-[0.08em] text-[#777777]">コスト階級</p>
        <button type="button" onClick={() => onChange(null)} className="text-[11px] font-black text-[#999999] hover:text-[#333333]">
          解除
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {COST_BRACKET_OPTIONS.map((option) => {
          const active = value === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(active ? null : option.key)}
              className={[
                "h-9 min-w-11 rounded-full border px-3 text-[12px] font-black transition-colors",
                active ? "border-[#111116] bg-[#111116] text-white" : "border-[#dcdcdc] bg-white text-[#333333] hover:bg-[#eeeeee]",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

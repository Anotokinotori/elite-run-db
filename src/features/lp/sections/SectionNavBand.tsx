const LP_SECTION_NAV_ITEMS = [
  { label: "\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9", href: "#home" },
  { label: "\u8a18\u9332\u56f3\u66f8\u9928", href: "#library" },
  { label: "\u30a4\u30d9\u30f3\u30c8\u60c5\u5831", href: "#event" },
  { label: "\u60c5\u5831\u4ea4\u63db", href: "#exchange" },
  { label: "\u72e9\u308a\u30c1\u30e3\u30c3\u30c8", href: "#chat" },
] as const;

export function SectionNavBand() {
  return (
    <nav className="relative z-20 border-y border-[#343434] bg-[#000000] text-[#d9d9d9] shadow-[0_14px_34px_rgba(0,0,0,0.28)]" aria-label="LP page links">
      <div className="overflow-x-auto">
        <div className="mx-auto flex h-[58px] w-max min-w-full items-center justify-center gap-1 px-4 md:h-[64px] md:w-full md:gap-3 md:px-8">
          {LP_SECTION_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative grid h-full shrink-0 place-items-center px-4 text-[14px] tracking-[0.08em] text-[#d9d9d9] transition-colors hover:text-[#d9d9d9] focus:outline-none focus-visible:text-[#d9d9d9] md:px-7 md:text-[16px]"
            >
              <span className="invisible col-start-1 row-start-1 font-bold">{item.label}</span>
              <span className="col-start-1 row-start-1 font-normal group-hover:font-bold group-focus-visible:font-bold">{item.label}</span>
              <span className="absolute inset-x-4 bottom-0 h-[3px] origin-center scale-x-0 bg-[#d9d9d9] transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100 md:inset-x-7" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

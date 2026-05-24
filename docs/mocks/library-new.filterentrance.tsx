import React, { useEffect, useMemo, useRef, useState } from "react";

const images = [
  "https://upload-os-bbs.hoyolab.com/upload/2025/01/26/fdd32de994246663d3329df80945351a_9019649747265555038.png?x-oss-process=image/auto-orient,0/interlace,1/format,webp/quality,q_70",
  "https://upload-os-bbs.hoyolab.com/upload/2024/04/12/91148e90e86c89e4d565c4d46c092352_7325119691657342334.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2022/09/18/98252c0073c87263e6fbb51447cb6d2e_7381897631492436601.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2022/06/22/20d03d5c03560a68a9b5ca1c5ddf2293_5646653669169504614.png?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
  "https://upload-os-bbs.hoyolab.com/upload/2026/04/30/25cc0894bf35a35b322dafbc722cf0b8_3127599890961230812.png?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",
];

const panels = [
  {
    no: "01",
    label: "キャラ・編成",
    meta: "CHARACTER / TEAM",
    lead: "キャラ・編成から探す",
    image: images[0],
    desktopImageClass: "left-1/2 bottom-[-7px] h-[272px] w-[214px] -translate-x-1/2 object-[50%_100%]",
    mobileImageClass: "right-[-20px] bottom-[-30px] h-[154px] w-[184px] object-[50%_100%]",
  },
  {
    no: "02",
    label: "武器",
    meta: "WEAPON",
    lead: "武器から探す",
    image: images[1],
    desktopImageClass: "left-1/2 bottom-[-5px] h-[272px] w-[222px] -translate-x-1/2 object-[48%_100%]",
    mobileImageClass: "right-[-24px] bottom-[-28px] h-[154px] w-[190px] object-[48%_100%]",
  },
  {
    no: "03",
    label: "凸・精錬",
    meta: "C / R",
    lead: "凸・精錬で絞る",
    image: images[2],
    desktopImageClass: "left-1/2 bottom-[-22px] h-[304px] w-[248px] -translate-x-1/2 object-[54%_100%]",
    mobileImageClass: "right-[-36px] bottom-[-44px] h-[178px] w-[218px] object-[54%_100%]",
  },
  {
    no: "04",
    label: "カテゴリ・期間",
    meta: "CATEGORY / SEASON",
    lead: "カテゴリ・期間で探す",
    image: images[3],
    desktopImageClass: "left-1/2 bottom-[-11px] h-[282px] w-[230px] -translate-x-1/2 object-[48%_100%]",
    mobileImageClass: "right-[-28px] bottom-[-36px] h-[164px] w-[198px] object-[48%_100%]",
  },
  {
    no: "05",
    label: "タグ",
    meta: "TAGS",
    lead: "タグから探す",
    image: images[4],
    desktopImageClass: "left-1/2 bottom-[-12px] h-[280px] w-[226px] -translate-x-1/2 object-[50%_100%]",
    mobileImageClass: "right-[-30px] bottom-[-36px] h-[166px] w-[202px] object-[50%_100%]",
  },
];

const MOBILE_LAYOUT = {
  width: 360,
  height: 640,
  cardWidth: 360,
  cardHeight: 120,
  gap: 10,
};

const DESKTOP_LAYOUT = {
  width: 828,
  height: 390,
  cardWidth: 156,
  cardHeight: 312,
  gap: 12,
};

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [query]);

  return matches;
}

function useFitScale(ref, baseWidth, maxScale = 1) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const availableWidth = node.clientWidth;
      const nextScale = Math.min(maxScale, availableWidth / baseWidth);
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(update);
      observer.observe(node);
      window.addEventListener("resize", update);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", update);
      };
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref, baseWidth, maxScale]);

  return scale;
}

function DownArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[28px] w-[28px] shrink-0"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.8 8.7v9.2" />
      <path d="M19.2 8.7v9.2" />
      <path d="M10 16.9 16 22.9l6-6" />
    </svg>
  );
}

function ActionButtons() {
  return (
    <button
      type="button"
      className="group mx-auto flex w-fit items-center justify-center gap-[16px] text-[#050505] transition duration-200 hover:-translate-y-[1px]"
      aria-label="この条件で絞り込む"
    >
      <span className="font-['Inter','Noto_Sans_JP',sans-serif] text-[18px] font-black leading-none tracking-[-0.04em] sm:text-[19px]">
        この条件で絞り込む
      </span>
      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-black text-white transition duration-200 group-hover:scale-[1.04] group-hover:bg-[#1a1a1a]">
        <DownArrowIcon />
      </span>
    </button>
  );
}

function SummaryCard({ item, isDesktop }) {
  const imageClass = isDesktop ? item.desktopImageClass : item.mobileImageClass;

  return (
    <button
      className="group relative shrink-0 text-left outline-none"
      style={{ width: isDesktop ? DESKTOP_LAYOUT.cardWidth : MOBILE_LAYOUT.cardWidth }}
      aria-label={`${item.label}で記録を探す`}
      type="button"
    >
      <div
        className="relative overflow-hidden rounded-[7px] bg-[#d9d9d7] shadow-[10px_13px_20px_rgba(30,32,35,0.14)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[14px_18px_26px_rgba(30,32,35,0.2)]"
        style={{
          width: isDesktop ? DESKTOP_LAYOUT.cardWidth : MOBILE_LAYOUT.cardWidth,
          height: isDesktop ? DESKTOP_LAYOUT.cardHeight : MOBILE_LAYOUT.cardHeight,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_45%,rgba(0,0,0,0.08))]" />
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#d6d6d4] via-[#d6d6d4]/72 to-transparent"
          style={{ height: isDesktop ? "45%" : "60%" }}
        />

        <div className="absolute left-[-2px] top-[-5px] z-20 font-['Arial_Narrow',Arial,sans-serif] text-[64px] font-black leading-[0.78] tracking-[-0.11em] text-white/92">
          {item.no}
        </div>

        {!isDesktop && (
          <div className="absolute left-[86px] top-[25px] z-20 flex max-w-[150px] flex-col items-start">
            <p className="font-['Arial_Narrow',Arial,sans-serif] text-[15px] font-black uppercase leading-none tracking-[-0.04em] text-[#3e4144]">
              {item.label}
            </p>
            <p className="mt-[6px] whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black uppercase tracking-[0.13em] text-[#7d7f80]">
              {item.meta}
            </p>
            <div className="mt-[8px] flex w-[126px] items-center justify-center gap-2">
              <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
              <span className="whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black tracking-[0.08em] text-[#868787]">
                {item.lead}
              </span>
              <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
            </div>
          </div>
        )}

        <img
          src={item.image}
          alt=""
          className={`absolute z-10 max-w-none object-contain transition duration-300 group-hover:scale-[1.045] ${imageClass}`}
        />
      </div>

      {isDesktop && (
        <div className="mt-[16px] flex flex-col items-center text-center">
          <p className="font-['Arial_Narrow',Arial,sans-serif] text-[15px] font-black uppercase leading-none tracking-[-0.04em] text-[#3e4144]">
            {item.label}
          </p>
          <p className="mt-[6px] whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black uppercase tracking-[0.13em] text-[#7d7f80]">
            {item.meta}
          </p>
          <div className="mt-[9px] flex w-[124px] items-center justify-center gap-2">
            <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
            <span className="whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[8px] font-black tracking-[0.08em] text-[#868787]">
              {item.lead}
            </span>
            <span className="h-[1.5px] flex-1 bg-[#6f7070]" />
          </div>
        </div>
      )}
    </button>
  );
}

export default function EliteLibrarySummaryMockup() {
  const scaleAreaRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const layout = isDesktop ? DESKTOP_LAYOUT : MOBILE_LAYOUT;
  const scale = useFitScale(scaleAreaRef, layout.width, 1);

  const scaledStageStyle = useMemo(
    () => ({
      width: layout.width,
      height: layout.height,
      transform: `translateX(-50%) scale(${scale})`,
      transformOrigin: "top center",
      left: "50%",
      top: 0,
    }),
    [layout.width, layout.height, scale],
  );

  return (
    <div className="w-full">
      <div ref={scaleAreaRef} className="w-full">
        <div
          className="relative mx-auto overflow-visible"
          style={{
            width: layout.width * scale,
            height: layout.height * scale,
          }}
        >
          <div className="absolute" style={scaledStageStyle}>
            <div
              className="flex"
              style={{
                width: layout.width,
                height: layout.height,
                flexDirection: isDesktop ? "row" : "column",
                gap: layout.gap,
                alignItems: isDesktop ? "flex-start" : "center",
                justifyContent: "flex-start",
              }}
            >
              {panels.map((item) => (
                <SummaryCard key={item.no} item={item} isDesktop={isDesktop} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[26px] flex w-full justify-center sm:mt-[30px]">
        <ActionButtons />
      </div>
    </div>
  );
}

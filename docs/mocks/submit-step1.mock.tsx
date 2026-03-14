function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[32px] text-black whitespace-nowrap">01</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#d9d9d9] text-[32px] whitespace-nowrap">02</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#d9d9d9] text-[32px] whitespace-nowrap">03</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative w-full">
          <Frame7 />
          <Frame8 />
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="relative shrink-0 size-[64px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <circle cx="32" cy="32" fill="var(--fill-0, #0F1419)" id="Ellipse 9" r="32" />
        </svg>
      </div>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-4px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 220 4">
            <line id="Line 3" stroke="var(--stroke-0, #D9D9D9)" strokeWidth="4" x2="220" y1="2" y2="2" />
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[64px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <circle cx="32" cy="32" fill="var(--fill-0, #D9D9D9)" id="Ellipse 9" r="32" />
        </svg>
      </div>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-4px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 220 4">
            <line id="Line 3" stroke="var(--stroke-0, #D9D9D9)" strokeWidth="4" x2="220" y1="2" y2="2" />
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[64px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <circle cx="32" cy="32" fill="var(--fill-0, #D9D9D9)" id="Ellipse 9" r="32" />
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-black whitespace-nowrap">基本情報</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d9d9d9] text-[16px] whitespace-nowrap">編成情報</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d9d9d9] text-[16px] whitespace-nowrap">詳細情報</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame2 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="max-w-[664px] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center max-w-[inherit] px-[16px] relative w-full">
          <Frame10 />
          <Frame3 />
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[32px] text-black whitespace-nowrap">1.基本情報の入力</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#9999b1] text-[20px] whitespace-nowrap">記録申請に必要な情報を入力して下さい。※この項目は必須項目です。</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full">
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-b border-solid inset-0 pointer-events-none" />
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-black whitespace-nowrap">基本情報</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[44px] items-start relative shrink-0 w-full">
      <Frame14 />
      <Frame15 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">カテゴリ</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative w-full">
          <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#c2c2c2] text-[24px] whitespace-nowrap">【Npui】400体</p>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">{`動画URL `}</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative w-full">
          <a className="block font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[0] relative shrink-0 text-[#c2c2c2] text-[24px] whitespace-nowrap" href="https://www.youtube.com/watch?">
            <p className="cursor-pointer">
              <span className="leading-[normal]">{`例) `}</span>
              <span className="leading-[normal]">{`https://www.youtube.com/watch?`}</span>
              <span className="leading-[normal]">{` `}</span>
              <span className="leading-[normal]">(記録に対応するYouTubeのリンクを入力)</span>
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame19 />
      <Frame21 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">プレイしているプラットフォーム</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#333] flex-[1_0_0] min-h-px min-w-px relative rounded-[42px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[16px] relative w-full">
          <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[24px] text-white whitespace-nowrap">
            <p className="leading-[normal]">PC+PCのSVD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#f2f2f2] flex-[1_0_0] min-h-px min-w-px relative rounded-[42px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[16px] relative w-full">
          <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
            <p className="leading-[normal]">PS5+PS5のSVD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#f2f2f2] flex-[1_0_0] min-h-px min-w-px relative rounded-[42px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[16px] relative w-full">
          <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
            <p className="leading-[normal]">スマホ+スマホのSVD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[32px] relative w-full">
          <Frame />
          <Frame22 />
          <Frame23 />
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame20 />
      <Frame24 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[44px] items-start relative shrink-0 w-full">
      <Frame25 />
      <Frame26 />
      <Frame27 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center justify-center relative shrink-0 w-full">
      <Frame11 />
      <Frame16 />
      <Frame28 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#333] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[16px] relative w-full">
          <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-white whitespace-nowrap">次へ</p>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="max-w-[500px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start max-w-[inherit] px-[32px] relative w-full">
        <Frame1 />
      </div>
    </div>
  );
}

export default function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-center relative size-full">
      <Frame29 />
      <Frame30 />
    </div>
  );
}
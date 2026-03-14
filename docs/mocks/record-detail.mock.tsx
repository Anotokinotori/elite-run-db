import imgImage11 from "figma:asset/fbf86253160319895242d21034080107ee03d3c6.png";

function Frame1() {
  return (
    <div className="h-[8.485px] relative shrink-0 w-[17.971px]">
      <div className="absolute inset-[-8.33%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9706 9.19239">
          <g id="Frame 3">
            <line id="Line 2" stroke="var(--stroke-0, black)" x1="0.353553" x2="8.83883" y1="0.353554" y2="8.83883" />
            <line id="Line 1" stroke="var(--stroke-0, black)" x1="9.13173" x2="17.617" y1="8.83883" y2="0.353553" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[24px] text-black whitespace-nowrap">luna3</p>
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[36px] text-black whitespace-nowrap">精鋭狩りDB仮</p>
      <Frame2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#333] content-stretch flex font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal gap-[8px] items-center justify-center not-italic px-[16px] py-[8px] relative rounded-[42px] shrink-0 text-[24px] text-white whitespace-nowrap">
      <div className="flex flex-col justify-center leading-[0] relative shrink-0">
        <p className="leading-[normal]">＋</p>
      </div>
      <p className="leading-[normal] relative shrink-0">記録提出</p>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[16px] h-[64px] items-center relative shrink-0" data-name="ヘッダー右半身">
      <Frame />
      <div className="relative shrink-0 size-[36px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" fill="var(--fill-0, #D9D9D9)" id="Ellipse 1" r="18" />
        </svg>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame3 />
      <Component />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <Frame4 />
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">
        <p className="leading-[normal]">【Npui】27:49 (high)</p>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">らんだむ</p>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[16px] items-end relative shrink-0">
      <div className="relative shrink-0 size-[48px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" fill="var(--fill-0, #D9D9D9)" id="Ellipse 7" r="24" />
        </svg>
      </div>
      <Frame42 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">いいねSVD</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">共有SVD</p>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame6 />
      <Frame43 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame45 />
      <Frame44 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame41 />
      <Frame46 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ver : Luna3</p>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">３日前</p>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">PCのSVD</p>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">PC</p>
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame50 />
      <Frame51 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[36px] items-center relative shrink-0">
      <Frame49 />
      <Frame48 />
      <Frame52 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="bg-[#f2f2f2] relative rounded-[16px] shrink-0 w-full">
      <div className="content-stretch flex items-start justify-between p-[16px] relative w-full">
        <Frame53 />
        <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black text-right whitespace-nowrap">
          <p className="leading-[normal]">...もっと見る</p>
        </div>
      </div>
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame47 />
      <Frame54 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">２件のコメント</p>
      </div>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">コメントする...</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">送信SVD</p>
      </div>
    </div>
  );
}

function Frame72() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[8px] relative w-full">
          <Frame71 />
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #D9D9D9)" id="Ellipse 8" r="20" />
        </svg>
      </div>
      <Frame72 />
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame70 />
      <Frame79 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">らんだむ</p>
      </div>
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[20px] text-center whitespace-nowrap">
        <p className="leading-[normal]">2日前</p>
      </div>
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame73 />
      <Frame74 />
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">とても参考になりそうです。</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center p-[4px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
        <p className="leading-[normal]">いいねSVD</p>
      </div>
    </div>
  );
}

function Frame56() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center p-[4px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
        <p className="leading-[normal]">返信</p>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame8 />
      <Frame56 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start justify-center min-h-px min-w-px relative">
      <Frame75 />
      <Frame76 />
      <Frame55 />
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[48px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" fill="var(--fill-0, #D9D9D9)" id="Ellipse 7" r="24" />
        </svg>
      </div>
      <Frame77 />
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">らんだむ</p>
      </div>
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[20px] text-center whitespace-nowrap">
        <p className="leading-[normal]">2日前</p>
      </div>
    </div>
  );
}

function Frame88() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame89 />
      <Frame90 />
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">とても参考になりそうです。</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center p-[4px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
        <p className="leading-[normal]">いいねSVD</p>
      </div>
    </div>
  );
}

function Frame58() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center p-[4px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
        <p className="leading-[normal]">返信</p>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame9 />
      <Frame58 />
    </div>
  );
}

function Frame85() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start justify-center min-h-px min-w-px relative">
      <Frame88 />
      <Frame91 />
      <Frame57 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[48px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" fill="var(--fill-0, #D9D9D9)" id="Ellipse 7" r="24" />
        </svg>
      </div>
      <Frame85 />
    </div>
  );
}

function Frame82() {
  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start relative shrink-0 w-full">
      <Frame78 />
      <Frame81 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start relative shrink-0 w-full">
      <Frame80 />
      <Frame82 />
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative">
      <div className="aspect-[669/380] relative shrink-0 w-full" data-name="image 11">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage11} />
      </div>
      <Frame69 />
      <Frame83 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">仕様編成</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">
        <p className="leading-[normal]">Mavuika</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">千烈の日輪</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[126px]">
      <Frame19 />
      <Frame20 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">C6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">R1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[4px] pt-[6px] relative shrink-0 w-[32px]">
      <Frame14 />
      <Frame21 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
      <Frame23 />
      <Frame22 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <div className="relative shrink-0 size-[72px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 72">
          <circle cx="36" cy="36" fill="var(--fill-0, #D9D9D9)" id="Ellipse 7" r="36" />
        </svg>
      </div>
      <Frame24 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">
        <p className="leading-[normal]">Mavuika</p>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">千烈の日輪</p>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[126px]">
      <Frame30 />
      <Frame31 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">C6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">R1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[4px] pt-[6px] relative shrink-0 w-[32px]">
      <Frame15 />
      <Frame33 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
      <Frame28 />
      <Frame32 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <div className="relative shrink-0 size-[72px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 72">
          <circle cx="36" cy="36" fill="var(--fill-0, #D9D9D9)" id="Ellipse 7" r="36" />
        </svg>
      </div>
      <Frame27 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">
        <p className="leading-[normal]">Mavuika</p>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">千烈の日輪</p>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[126px]">
      <Frame37 />
      <Frame38 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">C6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">R1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[4px] pt-[6px] relative shrink-0 w-[32px]">
      <Frame16 />
      <Frame40 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
      <Frame36 />
      <Frame39 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <div className="relative shrink-0 size-[72px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 72">
          <circle cx="36" cy="36" fill="var(--fill-0, #D9D9D9)" id="Ellipse 7" r="36" />
        </svg>
      </div>
      <Frame35 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">
        <p className="leading-[normal]">Mavuika</p>
      </div>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">千烈の日輪</p>
      </div>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[126px]">
      <Frame63 />
      <Frame64 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">C6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame66() {
  return (
    <div className="bg-[rgba(248,196,163,0.25)] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f09e78] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[normal]">R1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[4px] pt-[6px] relative shrink-0 w-[32px]">
      <Frame17 />
      <Frame66 />
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
      <Frame62 />
      <Frame65 />
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <div className="relative shrink-0 size-[72px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 72">
          <circle cx="36" cy="36" fill="var(--fill-0, #D9D9D9)" id="Ellipse 7" r="36" />
        </svg>
      </div>
      <Frame61 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
      <Frame25 />
      <Frame26 />
      <Frame34 />
      <Frame60 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f5f8f8] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[30px] items-start p-[16px] relative w-full">
        <Frame18 />
        <Frame29 />
      </div>
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">類似編成の記録</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
    </div>
  );
}

function Frame95() {
  return (
    <div className="h-[40px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start justify-between px-[8px] relative size-full">
        <Frame10 />
      </div>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">【Npui】27:49（hi...</p>
      </div>
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">らんだむ</p>
      </div>
    </div>
  );
}

function Frame101() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">・</p>
      </div>
    </div>
  );
}

function Frame102() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">一週間前</p>
      </div>
    </div>
  );
}

function Frame99() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame100 />
      <Frame101 />
      <Frame102 />
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <Frame98 />
      <Frame99 />
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex flex-col h-[66px] items-center relative shrink-0 w-[12px]">
      <div className="flex flex-col font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold justify-center leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center w-full">
        <p className="mb-0">・</p>
        <p className="mb-0">・</p>
        <p>・</p>
      </div>
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full">
      <Frame97 />
      <Frame103 />
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end relative shrink-0 w-full">
      <Frame95 />
      <Frame96 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
    </div>
  );
}

function Frame105() {
  return (
    <div className="h-[40px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start justify-between px-[8px] relative size-full">
        <Frame11 />
      </div>
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">【Npui】27:49（hi...</p>
      </div>
    </div>
  );
}

function Frame110() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">らんだむ</p>
      </div>
    </div>
  );
}

function Frame111() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">・</p>
      </div>
    </div>
  );
}

function Frame112() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">一週間前</p>
      </div>
    </div>
  );
}

function Frame109() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame110 />
      <Frame111 />
      <Frame112 />
    </div>
  );
}

function Frame107() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <Frame108 />
      <Frame109 />
    </div>
  );
}

function Frame113() {
  return (
    <div className="content-stretch flex flex-col h-[66px] items-center relative shrink-0 w-[12px]">
      <div className="flex flex-col font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold justify-center leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center w-full">
        <p className="mb-0">・</p>
        <p className="mb-0">・</p>
        <p>・</p>
      </div>
    </div>
  );
}

function Frame106() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full">
      <Frame107 />
      <Frame113 />
    </div>
  );
}

function Frame104() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end relative shrink-0 w-full">
      <Frame105 />
      <Frame106 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
    </div>
  );
}

function Frame115() {
  return (
    <div className="h-[40px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start justify-between px-[8px] relative size-full">
        <Frame12 />
      </div>
    </div>
  );
}

function Frame118() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">【Npui】27:49（hi...</p>
      </div>
    </div>
  );
}

function Frame120() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">らんだむ</p>
      </div>
    </div>
  );
}

function Frame121() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">・</p>
      </div>
    </div>
  );
}

function Frame122() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">一週間前</p>
      </div>
    </div>
  );
}

function Frame119() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame120 />
      <Frame121 />
      <Frame122 />
    </div>
  );
}

function Frame117() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <Frame118 />
      <Frame119 />
    </div>
  );
}

function Frame123() {
  return (
    <div className="content-stretch flex flex-col h-[66px] items-center relative shrink-0 w-[12px]">
      <div className="flex flex-col font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold justify-center leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center w-full">
        <p className="mb-0">・</p>
        <p className="mb-0">・</p>
        <p>・</p>
      </div>
    </div>
  );
}

function Frame116() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full">
      <Frame117 />
      <Frame123 />
    </div>
  );
}

function Frame114() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end relative shrink-0 w-full">
      <Frame115 />
      <Frame116 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #333333)" id="Ellipse 3" r="20" />
        </svg>
      </div>
    </div>
  );
}

function Frame125() {
  return (
    <div className="h-[40px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start justify-between px-[8px] relative size-full">
        <Frame13 />
      </div>
    </div>
  );
}

function Frame128() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">【Npui】27:49（hi...</p>
      </div>
    </div>
  );
}

function Frame130() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">らんだむ</p>
      </div>
    </div>
  );
}

function Frame131() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">・</p>
      </div>
    </div>
  );
}

function Frame132() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9999b1] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">一週間前</p>
      </div>
    </div>
  );
}

function Frame129() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame130 />
      <Frame131 />
      <Frame132 />
    </div>
  );
}

function Frame127() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <Frame128 />
      <Frame129 />
    </div>
  );
}

function Frame133() {
  return (
    <div className="content-stretch flex flex-col h-[66px] items-center relative shrink-0 w-[12px]">
      <div className="flex flex-col font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold justify-center leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center w-full">
        <p className="mb-0">・</p>
        <p className="mb-0">・</p>
        <p>・</p>
      </div>
    </div>
  );
}

function Frame126() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full">
      <Frame127 />
      <Frame133 />
    </div>
  );
}

function Frame124() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end relative shrink-0 w-full">
      <Frame125 />
      <Frame126 />
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
      <Frame94 />
      <Frame104 />
      <Frame114 />
      <Frame124 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f5f8f8] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[16px] relative w-full">
        <Frame67 />
        <Frame93 />
      </div>
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[388px]">
      <Frame59 />
      <Frame68 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="h-[1246px] relative shrink-0 w-full">
      <div className="content-stretch flex gap-[16px] items-start p-[16px] relative size-full">
        <Frame84 />
        <Frame92 />
      </div>
    </div>
  );
}

export default function Frame87() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full">
      <Frame5 />
      <Frame86 />
    </div>
  );
}
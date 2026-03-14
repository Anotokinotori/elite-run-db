function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#d9d9d9] text-[32px] whitespace-nowrap">01</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#d9d9d9] text-[32px] whitespace-nowrap">02</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#0f1419] text-[32px] whitespace-nowrap">03</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative w-full">
          <Frame6 />
          <Frame7 />
          <Frame8 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
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
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-4px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 220 4">
            <line id="Line 3" stroke="var(--stroke-0, #D9D9D9)" strokeWidth="4" x2="220" y1="2" y2="2" />
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[64px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <circle cx="32" cy="32" fill="var(--fill-0, #0F1419)" id="Ellipse 9" r="32" />
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d9d9d9] text-[16px] whitespace-nowrap">基本情報</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d9d9d9] text-[16px] whitespace-nowrap">編成情報</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f1419] text-[16px] whitespace-nowrap">詳細情報</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame1 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="max-w-[664px] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center max-w-[inherit] px-[16px] relative w-full">
          <Frame9 />
          <Frame2 />
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[32px] text-black whitespace-nowrap">3.詳細情報・ガイドライン</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#9999b1] text-[20px] w-[716px]">検索で見つけてもらいやすくするための項目です。</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full">
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame13 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center justify-center relative shrink-0 w-full">
      <Frame10 />
      <Frame15 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-b border-solid inset-0 pointer-events-none" />
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-black whitespace-pre">{`詳細情報  (任意)`}</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">メインアタッカーを選択 (一番与ダメージが高いものを選択)</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[24px] whitespace-nowrap">〇のSVD</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[32px] items-center p-[16px] relative w-full">
          <Frame25 />
          <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
            <p className="leading-[normal]">マーヴィカ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[24px] whitespace-nowrap">〇のSVD</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[32px] items-center p-[16px] relative w-full">
          <Frame28 />
          <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
            <p className="leading-[normal]">チャスカ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[24px] whitespace-nowrap">〇のSVD</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[32px] items-center p-[16px] relative w-full">
          <Frame32 />
          <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
            <p className="leading-[normal]">シトらり</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[24px] whitespace-nowrap">〇のSVD</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[32px] items-center p-[16px] relative w-full">
          <Frame34 />
          <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
            <p className="leading-[normal]">早袖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame26 />
      <Frame27 />
      <Frame29 />
      <Frame33 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame16 />
      <Frame30 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center p-[16px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
        <p className="leading-[normal]">#弓無し</p>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center p-[16px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
        <p className="leading-[normal]">#マーヴィカなし</p>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center p-[16px] relative rounded-[42px] shrink-0">
      <div className="flex flex-col font-['Noto_Sans_JP:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">
        <p className="leading-[normal]">#ナタキャラなし</p>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full">
      <Frame20 />
      <Frame38 />
      <Frame40 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#9999b1] text-[24px] w-full">検索用タグ</p>
      <Frame37 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#9999b1] text-[24px] whitespace-nowrap">コメント・概要</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#f6f6f6] h-[223px] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#c2c2c2] text-[24px] whitespace-nowrap">この記録でのコメントをどうぞ！</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[44px] items-start relative shrink-0 w-full">
      <Frame31 />
      <Frame35 />
      <Frame21 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame14 />
      <Frame36 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-b border-solid inset-0 pointer-events-none" />
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-black whitespace-nowrap">申請するにあたって</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[24px] whitespace-nowrap">チェックボックス</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[32px] items-center p-[16px] relative w-full">
          <Frame46 />
          <div className="flex flex-col font-['Noto_Sans_JP:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#333] text-[24px] whitespace-nowrap">
            <p className="leading-[normal]">ガイドラインに同意する</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#9999b1] text-[24px] w-full">ガイドライン</p>
      <Frame45 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d49fc] text-[24px] whitespace-nowrap">ガイドラインを確認</p>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      <Frame41 />
      <Frame47 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame19 />
      <Frame42 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col gap-[44px] items-start relative shrink-0 w-full">
      <Frame39 />
      <Frame43 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[16px] relative w-full">
          <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">下書きで保存</p>
        </div>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[176px]">
      <Frame50 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#333] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[16px] relative w-full">
          <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-white whitespace-nowrap">記録申請</p>
        </div>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame49 />
      <Frame />
    </div>
  );
}

function Frame23() {
  return (
    <div className="h-[61px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start justify-between px-[32px] relative size-full">
        <Frame48 />
      </div>
    </div>
  );
}

export default function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-center relative size-full">
      <Frame22 />
      <Frame44 />
      <Frame23 />
    </div>
  );
}
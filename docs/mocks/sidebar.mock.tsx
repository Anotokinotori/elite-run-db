import React, { useState } from 'react';
import { 
  Trophy, 
  MessageCircle, 
  HelpCircle, 
  Lightbulb, 
  Calendar, 
  ClipboardList, 
  Bell, 
  User, 
  MoreVertical,
  Menu,
  ChevronDown,
  Plus
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const menuSections = [
    {
      id: 'main',
      items: [
        { id: 'leaderboard', label: 'リーダーボード', icon: Trophy },
        { id: 'chat', label: '雑談', icon: MessageCircle },
        { id: 'question', label: '質問', icon: HelpCircle },
        { id: 'exchange', label: '情報交換', icon: Lightbulb },
        { id: 'event', label: 'イベント情報', icon: Calendar },
      ]
    },
    {
      id: 'sub',
      items: [
        { id: 'apply', label: '記録申請', icon: ClipboardList },
        { id: 'notification', label: '通知', icon: Bell },
        { id: 'account', label: 'アカウント', icon: User },
      ]
    }
  ];

  return (
    <div className={`
      fixed md:static inset-y-0 left-0 z-50
      bg-black text-[#d9d9d9] h-full flex flex-col overflow-y-auto 
      border-r border-[#333] shrink-0
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      w-[280px] md:w-[80px] lg:w-[320px] 
    `}>
      
      {/* プロフィールセクション */}
      <div className="w-full px-4 md:px-2 lg:px-8 py-8 lg:pt-16 lg:pb-8 border-b border-[#333] flex justify-start md:justify-center lg:justify-start">
        <div className="flex items-center justify-between w-full max-w-[240px] group cursor-pointer p-2 lg:p-3 rounded-full hover:bg-neutral-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 size-[36px] rounded-full bg-[#d9d9d9] flex items-center justify-center overflow-hidden">
              <User className="size-5 text-gray-500" />
            </div>
            {/* モバイル(md未満)とPC(lg以上)の時だけテキストを表示 */}
            <p className="block md:hidden lg:block font-bold text-[16px] whitespace-nowrap group-hover:text-white transition-colors">
              アカウント名
            </p>
          </div>
          <MoreVertical className="block md:hidden lg:block size-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
        </div>
      </div>

      {/* メインメニューセクション */}
      <div className="w-full px-4 md:px-2 lg:px-8 py-8 border-b border-[#333] flex flex-col items-start md:items-center lg:items-start gap-4 lg:gap-6">
        {menuSections[0].items.map((item) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id}
              className="flex items-center gap-4 w-full md:w-auto lg:w-full text-left group transition-all p-3 lg:px-4 lg:py-3 rounded-full hover:bg-neutral-800"
            >
              <Icon className="size-6 text-gray-400 group-hover:text-white shrink-0" />
              <p className="block md:hidden lg:block font-normal text-[20px] whitespace-nowrap group-hover:text-white transition-colors">
                {item.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* サブメニューセクション */}
      <div className="w-full px-4 md:px-2 lg:px-8 py-8 flex flex-col items-start md:items-center lg:items-start gap-4 lg:gap-6">
        {menuSections[1].items.map((item) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id}
              className="flex items-center gap-4 w-full md:w-auto lg:w-full text-left group transition-all p-3 lg:px-4 lg:py-3 rounded-full hover:bg-neutral-800"
            >
              <Icon className="size-6 text-gray-400 group-hover:text-white shrink-0" />
              <p className="block md:hidden lg:block font-normal text-[20px] whitespace-nowrap group-hover:text-white transition-colors">
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
      
    </div>
  );
};

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-black border-b border-[#333] px-4 py-4 flex items-center justify-between shrink-0 h-[80px]">
      {/* ヘッダー左側 */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* スマホ(md未満)の時だけハンバーガーメニューを表示 */}
        <button 
          className="md:hidden text-[#d9d9d9] hover:text-white transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="size-7" />
        </button>
        <h1 className="text-[#d9d9d9] text-[18px] sm:text-[20px] md:text-[24px] font-normal whitespace-nowrap">
          精鋭狩りDB仮
        </h1>
        <button className="flex items-center gap-1 text-[#d9d9d9] hover:text-white transition-colors group">
          <span className="text-[18px] sm:text-[20px] md:text-[24px] font-normal">luna3</span>
          <ChevronDown className="size-5 mt-1 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* ヘッダー右側 */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="bg-[#333] hover:bg-neutral-700 text-[#d9d9d9] px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
          <Plus className="size-5" />
          <span className="text-[16px] sm:text-[18px] md:text-[20px] font-normal hidden sm:block whitespace-nowrap">
            記録提出
          </span>
        </button>
        <button className="text-[#d9d9d9] hover:text-white transition-colors relative">
          <Bell className="size-6 sm:size-7" />
          {/* 通知ポッチ */}
          <span className="absolute top-0 right-0 size-2.5 bg-red-500 rounded-full border-2 border-black hidden"></span>
        </button>
        <button className="relative shrink-0 size-[32px] sm:size-[36px] rounded-full bg-[#d9d9d9] flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity">
          <User className="size-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#121212] font-['Noto_Sans_JP',sans-serif] overflow-hidden relative">
      
      {/* モバイル用背景オーバーレイ（透明度20%の黒） */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.2)] z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* サイドバー */}
      <Sidebar isOpen={isMobileMenuOpen} />

      {/* メインエリア（ヘッダー ＋ コンテンツ） */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        
        {/* ヘッダー */}
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* メインコンテンツエリア */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-md space-y-4">
            <Lightbulb className="size-16 text-yellow-400 mx-auto opacity-80" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">メインコンテンツエリア</h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              プレビュー画面の幅をドラッグして狭くしてみてください。<br/>
              スマホサイズになると左上のハンバーガーメニューが現れます。そこを押すと、サイドバーがX（Twitter）のようにスライドして表示されます！
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
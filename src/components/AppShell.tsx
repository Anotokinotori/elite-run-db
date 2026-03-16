import { type ReactNode, useEffect, useState } from "react";

type ShellRouteName =
  | "home"
  | "detail"
  | "submit"
  | "chat"
  | "question"
  | "exchange"
  | "event"
  | "notifications"
  | "account";

type ShellDestination = Exclude<ShellRouteName, "detail">;

type NavItem = {
  route: "home" | "chat" | "question" | "exchange" | "event";
  label: string;
  icon: (props: { className?: string }) => ReactNode;
};

const navSections: NavItem[][] = [
  [
    { route: "home", label: "リーダーボード", icon: TrophyIcon },
    { route: "chat", label: "雑談", icon: MessageIcon },
    { route: "question", label: "質問", icon: QuestionIcon },
  ],
  [
    { route: "exchange", label: "情報交換", icon: LightbulbIcon },
    { route: "event", label: "イベント情報", icon: CalendarIcon },
  ],
];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isNavActive(routeName: ShellRouteName, itemRoute: NavItem["route"]) {
  if (itemRoute === "home") {
    return routeName === "home" || routeName === "detail";
  }

  return routeName === itemRoute;
}

function ShellIcon({
  children,
  className,
  viewBox = "0 0 24 24",
}: {
  children: ReactNode;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={classNames("shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
      <path d="M6 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4" />
      <path d="M18 5h2a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
      <path d="M12 11v4" />
      <path d="M9 20h6" />
      <path d="M10 15h4l1 5H9l1-5Z" />
    </ShellIcon>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6A2.5 2.5 0 0 1 17.5 15H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 12.5v-6Z" />
    </ShellIcon>
  );
}

function QuestionIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.4 2.4 0 1 1 4.2 1.5c-.7.7-1.5 1.1-1.8 2.2" />
      <path d="M12 16.8h.01" />
    </ShellIcon>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <path d="M9 17.5h6" />
      <path d="M10 21h4" />
      <path d="M8.5 14.5c-1.2-1-2-2.6-2-4.4a5.5 5.5 0 1 1 11 0c0 1.8-.8 3.4-2 4.4-.8.7-1.3 1.6-1.5 2.4h-4c-.2-.8-.7-1.7-1.5-2.4Z" />
    </ShellIcon>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
      <path d="M8.5 14h.01" />
      <path d="M12 14h.01" />
      <path d="M15.5 14h.01" />
    </ShellIcon>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </ShellIcon>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <path d="M15 18H9" />
      <path d="M6 18h12" />
      <path d="M7 18v-5a5 5 0 1 1 10 0v5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </ShellIcon>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </ShellIcon>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={classNames("shrink-0", className)} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <path d="m6 9 6 6 6-6" />
    </ShellIcon>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <ShellIcon className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </ShellIcon>
  );
}

function SidebarSection({
  items,
  routeName,
  onNavigate,
}: {
  items: NavItem[];
  routeName: ShellRouteName;
  onNavigate: (route: ShellDestination) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4 px-4 py-8 md:items-center md:px-2 lg:items-start lg:gap-6 lg:px-8">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isNavActive(routeName, item.route);

        return (
            <button
              key={item.route}
              type="button"
              onClick={() => onNavigate(item.route)}
              className={classNames(
                "group flex w-full items-center gap-4 rounded-full p-3 text-left transition-all md:w-auto lg:w-full lg:px-4 lg:py-3",
                active ? "bg-neutral-800" : "hover:bg-neutral-800",
              )}
            >
            <Icon className={classNames("size-6 shrink-0", active ? "text-white" : "text-gray-400")} />
            <span
              className={classNames(
                "block whitespace-nowrap text-[20px] font-normal transition-colors md:hidden lg:block",
                active ? "text-white" : "text-[#d9d9d9] group-hover:text-white",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SidebarBody({
  routeName,
  onNavigate,
}: {
  routeName: ShellRouteName;
  onNavigate: (route: ShellDestination) => void;
}) {
  return (
    <>
      <div className="flex justify-start border-b border-[#333] px-4 py-8 md:justify-center md:px-2 lg:justify-start lg:px-8 lg:pt-16 lg:pb-8">
        <div className="flex w-full max-w-[240px] items-center justify-between rounded-full p-2 transition-colors hover:bg-neutral-800 lg:p-3">
          <div className="flex items-center gap-4">
            <div className="relative flex size-[36px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9]">
              <UserIcon className="size-5 text-gray-500" />
            </div>
            <p className="block whitespace-nowrap text-[16px] font-bold text-[#d9d9d9] md:hidden lg:block">アカウント名</p>
          </div>
          <MoreIcon className="block size-5 text-gray-500 md:hidden lg:block" />
        </div>
      </div>

      <div className="border-b border-[#333]">
        <SidebarSection items={navSections[0]} routeName={routeName} onNavigate={onNavigate} />
      </div>

      <SidebarSection items={navSections[1]} routeName={routeName} onNavigate={onNavigate} />
    </>
  );
}

function StaticSidebar({
  routeName,
  onNavigate,
}: {
  routeName: ShellRouteName;
  onNavigate: (route: ShellDestination) => void;
}) {
  return (
    <aside className="hidden shrink-0 border-r border-[#333] bg-black text-[#d9d9d9] md:sticky md:top-0 md:flex md:h-screen md:w-[80px] md:flex-col md:overflow-y-auto lg:w-[320px]">
      <SidebarBody routeName={routeName} onNavigate={onNavigate} />
    </aside>
  );
}

function MobileSidebar({
  isOpen,
  routeName,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  routeName: ShellRouteName;
  onClose: () => void;
  onNavigate: (route: ShellDestination) => void;
}) {
  const handleNavigate = (route: ShellDestination) => {
    onNavigate(route);
    onClose();
  };

  return (
    <aside
      className={classNames(
        "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-y-auto border-r border-[#333] bg-black text-[#d9d9d9] transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <SidebarBody routeName={routeName} onNavigate={handleNavigate} />
    </aside>
  );
}

function GlobalHeader({
  routeName,
  version,
  versionOptions,
  hasUnreadNotifications,
  onMenuClick,
  onNavigate,
  onRequestSubmit,
  onVersionChange,
}: {
  routeName: ShellRouteName;
  version: string;
  versionOptions: string[];
  hasUnreadNotifications: boolean;
  onMenuClick: () => void;
  onNavigate: (route: ShellDestination) => void;
  onRequestSubmit: () => void;
  onVersionChange: (version: string) => void;
}) {
  const utilityButtonClass =
    "relative rounded-full p-2 text-[#d9d9d9] transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#999]";

  return (
    <header className="sticky top-0 z-30 h-[80px] shrink-0 border-b border-[#333] bg-black">
      <div className="header-font flex h-full items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <button type="button" className="text-[#d9d9d9] transition-colors hover:text-white md:hidden" onClick={onMenuClick} aria-label="メニューを開く">
            <MenuIcon className="size-7" />
          </button>

          <h1 className="shrink-0 whitespace-nowrap text-[18px] font-normal text-[#d9d9d9] sm:text-[20px] md:text-[24px]">精鋭狩りDB</h1>

          <div className="relative min-w-0">
            <select
              value={version}
              onChange={(event) => onVersionChange(event.target.value)}
              className="min-w-[104px] appearance-none rounded-full border border-[#4a4a4a] bg-[#1a1a1a] py-2 pl-4 pr-10 text-[16px] font-normal text-[#d9d9d9] outline-none transition-colors hover:border-[#5c5c5c] focus:border-[#7a7a7a] sm:text-[18px] md:text-[20px]"
            >
              {versionOptions.map((option) => (
                <option key={option} value={option} className="bg-[#1a1a1a] text-[#d9d9d9]">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#a8a8a8]" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onRequestSubmit}
            className={classNames(
              "flex items-center gap-2 rounded-full px-3 py-2 transition-colors sm:px-4",
              routeName === "submit" ? "bg-[#454545] text-white" : "bg-[#333] text-[#d9d9d9] hover:bg-neutral-700",
            )}
          >
            <PlusIcon className="size-5" />
            <span className="hidden whitespace-nowrap text-[16px] font-normal sm:block md:text-[20px]">記録申請</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            aria-label="通知"
            className={classNames(utilityButtonClass, routeName === "notifications" && "bg-[#1d1d1d] text-white")}
          >
            <BellIcon className="size-6 sm:size-7" />
            {hasUnreadNotifications ? <span className="absolute top-1 right-1 block size-2.5 rounded-full border-2 border-black bg-red-500" /> : null}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("account")}
            aria-label="アカウント"
            className={classNames(
              "flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] transition-opacity hover:opacity-80 sm:size-[36px]",
              routeName === "account" && "ring-2 ring-[#7a7a7a]",
            )}
          >
            <UserIcon className="size-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function AppShell({
  routeName,
  version,
  versionOptions,
  hasUnreadNotifications,
  onNavigate,
  onRequestSubmit,
  onVersionChange,
  children,
}: {
  routeName: ShellRouteName;
  version: string;
  versionOptions: string[];
  hasUnreadNotifications: boolean;
  onNavigate: (route: ShellDestination) => void;
  onRequestSubmit: () => void;
  onVersionChange: (version: string) => void;
  children: ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="relative min-h-screen bg-[#121212] font-['Noto_Sans_JP',sans-serif] text-[#d9d9d9]">
      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.2)] transition-opacity md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      ) : null}

      <div className="flex min-h-screen">
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          routeName={routeName}
          onClose={() => setIsMobileMenuOpen(false)}
          onNavigate={onNavigate}
        />
        <StaticSidebar routeName={routeName} onNavigate={onNavigate} />

        <div className="flex min-w-0 flex-1 flex-col bg-[#121212]">
          <GlobalHeader
            routeName={routeName}
            version={version}
            versionOptions={versionOptions}
            hasUnreadNotifications={hasUnreadNotifications}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            onNavigate={onNavigate}
            onRequestSubmit={onRequestSubmit}
            onVersionChange={onVersionChange}
          />

          <main className="min-w-0 flex-1 bg-[#f0f2f5] text-[#333333]">{children}</main>
        </div>
      </div>
    </div>
  );
}

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

type IconProps = {
  className?: string;
  active?: boolean;
};

type InternalNavItem = {
  key: string;
  kind: "route";
  route: "home" | "chat" | "question" | "exchange" | "event";
  label: string;
  icon: (props: IconProps) => ReactNode;
};

type ExternalNavItem = {
  key: string;
  kind: "external";
  href: string;
  label: string;
  icon: (props: IconProps) => ReactNode;
};

type NavItem = InternalNavItem | ExternalNavItem;

const primaryNavItems: NavItem[] = [
  { key: "home", kind: "route", route: "home", label: "\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9", icon: TrophyIcon },
  { key: "event", kind: "route", route: "event", label: "\u30a4\u30d9\u30f3\u30c8\u60c5\u5831", icon: CalendarIcon },
  { key: "exchange", kind: "route", route: "exchange", label: "\u60c5\u5831\u4ea4\u63db", icon: LightbulbIcon },
  { key: "chat", kind: "route", route: "chat", label: "\u96d1\u8ac7", icon: MessageIcon },
  { key: "question", kind: "route", route: "question", label: "\u8cea\u554f", icon: QuestionIcon },
];

const externalToolItems: NavItem[] = [
  {
    key: "tsurumi-planner",
    kind: "external",
    href: "https://anotokinotori.github.io/Tsurumi-Map-Optimizer/",
    label: "\u9db4\u898b\u8abf\u6574\u30d7\u30e9\u30f3\u30ca\u30fc",
    icon: ExternalLinkIcon,
  },
  {
    key: "autosplit",
    kind: "external",
    href: "https://github.com/semaruebi/400ee_win_autosplit/releases",
    label: "AutoSplit",
    icon: ExternalLinkIcon,
  },
];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isNavActive(routeName: ShellRouteName, itemRoute: InternalNavItem["route"]) {
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

function TrophyIcon({ className, active = false }: IconProps) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" className={classNames("shrink-0", className)} fill="currentColor" aria-hidden="true">
        <path d="M7 4a1 1 0 0 0-1 1v2a6 6 0 0 0 5 5.92V15H9.8a1 1 0 0 0-.97.76l-.84 3.24A1 1 0 0 0 8.96 20h6.08a1 1 0 0 0 .97-1.25l-.84-3.24A1 1 0 0 0 14.2 15H13v-2.08A6 6 0 0 0 18 7V5a1 1 0 0 0-1-1H7Z" />
        <path d="M5 6H4.5A1.5 1.5 0 0 0 3 7.5V8a4 4 0 0 0 4 4h.06A7.96 7.96 0 0 1 5 8V6Z" />
        <path d="M19 6h.5A1.5 1.5 0 0 1 21 7.5V8a4 4 0 0 1-4 4h-.06A7.96 7.96 0 0 0 19 8V6Z" />
      </svg>
    );
  }

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

function MessageIcon({ className, active = false }: IconProps) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" className={classNames("shrink-0", className)} fill="currentColor" aria-hidden="true">
        <path d="M6.5 4A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H8v4l4.4-4h5.1A2.5 2.5 0 0 0 20 12.5v-6A2.5 2.5 0 0 0 17.5 4h-11Z" />
      </svg>
    );
  }

  return (
    <ShellIcon className={className}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6A2.5 2.5 0 0 1 17.5 15H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 12.5v-6Z" />
    </ShellIcon>
  );
}

function QuestionIcon({ className, active = false }: IconProps) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" className={classNames("shrink-0", className)} fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="currentColor" />
        <path
          d="M9.6 9.3a2.4 2.4 0 1 1 4.2 1.5c-.7.7-1.5 1.1-1.8 2.2"
          stroke="#212121"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 16.8h.01" stroke="#212121" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <ShellIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.4 2.4 0 1 1 4.2 1.5c-.7.7-1.5 1.1-1.8 2.2" />
      <path d="M12 16.8h.01" />
    </ShellIcon>
  );
}

function LightbulbIcon({ className, active = false }: IconProps) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" className={classNames("shrink-0", className)} fill="currentColor" aria-hidden="true">
        <path d="M12 3.5a5.5 5.5 0 0 0-3.85 9.43c.77.73 1.2 1.53 1.37 2.07h5c.17-.54.6-1.34 1.37-2.07A5.5 5.5 0 0 0 12 3.5Z" />
        <path d="M9 17a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Z" />
        <path d="M10 20a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2h-4Z" />
      </svg>
    );
  }

  return (
    <ShellIcon className={className}>
      <path d="M9 17.5h6" />
      <path d="M10 21h4" />
      <path d="M8.5 14.5c-1.2-1-2-2.6-2-4.4a5.5 5.5 0 1 1 11 0c0 1.8-.8 3.4-2 4.4-.8.7-1.3 1.6-1.5 2.4h-4c-.2-.8-.7-1.7-1.5-2.4Z" />
    </ShellIcon>
  );
}

function CalendarIcon({ className, active = false }: IconProps) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" className={classNames("shrink-0", className)} fill="currentColor" aria-hidden="true">
        <path d="M8 3a1 1 0 0 1 1 1v1h6V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Z" />
        <path d="M6 10.25h12v1.5H6Z" fill="#212121" opacity="0.35" />
      </svg>
    );
  }

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

function ExternalLinkIcon({ className }: IconProps) {
  return (
    <ShellIcon className={className}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
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

function DrawerSection({
  items,
  routeName,
  onNavigate,
  onExternalSelect,
}: {
  items: NavItem[];
  routeName: ShellRouteName;
  onNavigate: (route: ShellDestination) => void;
  onExternalSelect: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-8 sm:px-6">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.kind === "route" ? isNavActive(routeName, item.route) : false;
        const itemClassName = "group flex w-full items-center gap-4 rounded-full px-4 py-3 text-left transition-all hover:bg-[#272727]";
        const labelClassName = classNames(
          "whitespace-nowrap text-[20px] transition-colors",
          active ? "font-bold text-[#d9d9d9]" : "font-normal text-[#d9d9d9] group-hover:text-[#d9d9d9]",
        );

        if (item.kind === "external") {
          return (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={onExternalSelect}
              className={itemClassName}
            >
              <Icon className="size-6 shrink-0 text-[#8b95a7]" />
              <span className={labelClassName}>{item.label}</span>
            </a>
          );
        }

        return (
          <button key={item.key} type="button" onClick={() => onNavigate(item.route)} className={itemClassName}>
            <Icon active={active} className={classNames("size-6 shrink-0", active ? "text-[#d9d9d9]" : "text-[#8b95a7]")} />
            <span className={labelClassName}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DrawerBody({
  routeName,
  onNavigate,
  onClose,
}: {
  routeName: ShellRouteName;
  onNavigate: (route: ShellDestination) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex justify-start border-b border-[#343434] px-4 py-8 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate("account")}
          className="flex w-full max-w-[240px] flex-col gap-3 rounded-[24px] p-3 text-left transition-colors hover:bg-[#272727]"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex size-[36px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9]">
              <UserIcon className="size-5 text-gray-500" />
            </div>
            <span className="rounded-full p-1 text-[#8b95a7]" aria-hidden="true">
              <MoreIcon className="size-5" />
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="truncate text-[16px] font-bold text-[#d9d9d9]">{"アカウント名"}</p>
            <p className="truncate text-[12px] font-normal text-[#8b95a7]">{"いいねをもらった数：０"}</p>
          </div>
        </button>
      </div>

      <div className="border-b border-[#343434]">
        <DrawerSection items={primaryNavItems} routeName={routeName} onNavigate={onNavigate} onExternalSelect={onClose} />
      </div>

      <DrawerSection items={externalToolItems} routeName={routeName} onNavigate={onNavigate} onExternalSelect={onClose} />
    </>
  );
}

function GlobalDrawer({
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
        "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-y-auto border-r border-[#343434] bg-[#000000] text-[#d9d9d9] transition-transform duration-300 ease-in-out sm:w-[320px]",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
      aria-hidden={!isOpen}
    >
      <DrawerBody routeName={routeName} onNavigate={handleNavigate} onClose={onClose} />
    </aside>
  );
}

function GlobalHeader({
  routeName,
  version,
  versionOptions,
  hasUnreadNotifications,
  onMenuClick,
  onTitleClick,
  onNavigate,
  onRequestSubmit,
  onVersionChange,
}: {
  routeName: ShellRouteName;
  version: string;
  versionOptions: string[];
  hasUnreadNotifications: boolean;
  onMenuClick: () => void;
  onTitleClick: () => void;
  onNavigate: (route: ShellDestination) => void;
  onRequestSubmit: () => void;
  onVersionChange: (version: string) => void;
}) {
  const utilityButtonClass =
    "relative rounded-full p-2 text-[#d9d9d9] transition-colors hover:bg-[#272727] hover:text-[#d9d9d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6a6a6a]";

  return (
    <header className="sticky top-0 z-30 h-[80px] shrink-0 border-b border-[#343434] bg-[#000000]">
      <div className="header-font flex h-full items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <button type="button" className="text-[#d9d9d9] transition-colors hover:text-[#d9d9d9]" onClick={onMenuClick} aria-label="\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f">
            <MenuIcon className="size-7" />
          </button>

          <h1 className="shrink-0">
            <button
              type="button"
              onClick={onTitleClick}
              className="whitespace-nowrap text-[20px] font-semibold tracking-tight text-[#d9d9d9] transition-opacity hover:opacity-85 md:text-[32px]"
            >
              {"\u7cbe\u92ed\u72e9\u308aDB"}
            </button>
          </h1>

          <div className="relative min-w-0">
            <select
              value={version}
              onChange={(event) => onVersionChange(event.target.value)}
              className="min-w-[104px] appearance-none rounded-full border border-[#3a3a3a] bg-[#272727] py-2 pl-4 pr-10 text-[12px] font-normal text-[#d9d9d9] outline-none transition-colors hover:border-[#505050] focus:border-[#6a6a6a] sm:text-[14px] md:text-[16px]"
            >
              {versionOptions.map((option) => (
                <option key={option} value={option} className="bg-[#272727] text-[#d9d9d9]">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#8b95a7]" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onRequestSubmit}
            className={classNames(
              "flex items-center gap-2 rounded-full px-3 py-2 transition-colors sm:px-4",
              routeName === "submit" ? "bg-white text-[#111111]" : "bg-[#272727] text-[#d9d9d9] hover:bg-[#313131]",
            )}
          >
            <PlusIcon className="size-5" />
            <span className="hidden whitespace-nowrap text-[12px] font-normal sm:block md:text-[16px]">{"\u8a18\u9332\u7533\u8acb"}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            aria-label="\u901a\u77e5"
            className={classNames(utilityButtonClass, routeName === "notifications" && "bg-[#272727] text-[#d9d9d9] hover:bg-[#272727]")}
          >
            <BellIcon className="size-6 sm:size-7" />
            {hasUnreadNotifications ? <span className="absolute top-1 right-1 block size-2.5 rounded-full border-2 border-[#000000] bg-red-500" /> : null}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("account")}
            aria-label="\u30a2\u30ab\u30a6\u30f3\u30c8"
            className={classNames(
              "flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] transition-opacity hover:opacity-80 sm:size-[36px]",
              routeName === "account" && "ring-2 ring-[#657086]",
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
  onTitleClick,
  onRequestSubmit,
  onVersionChange,
  children,
}: {
  routeName: ShellRouteName;
  version: string;
  versionOptions: string[];
  hasUnreadNotifications: boolean;
  onNavigate: (route: ShellDestination) => void;
  onTitleClick: () => void;
  onRequestSubmit: () => void;
  onVersionChange: (version: string) => void;
  children: ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  const handleTitleClick = () => {
    setIsDrawerOpen(false);
    onTitleClick();
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fb] font-['Noto_Sans_JP',sans-serif] text-[#333333]">
      {isDrawerOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)] transition-opacity" onClick={() => setIsDrawerOpen(false)} />
      ) : null}

      <GlobalDrawer
        isOpen={isDrawerOpen}
        routeName={routeName}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={onNavigate}
      />

      <div className="flex min-h-screen">
        <div className="flex min-w-0 flex-1 flex-col bg-[#f8f9fb]">
          <GlobalHeader
            routeName={routeName}
            version={version}
            versionOptions={versionOptions}
            hasUnreadNotifications={hasUnreadNotifications}
            onMenuClick={() => setIsDrawerOpen(true)}
            onTitleClick={handleTitleClick}
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

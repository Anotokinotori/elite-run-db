import type { Platform } from "../data/mockRuns";

type IconProps = {
  className?: string;
};

export function LikeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 11v9H4v-9h3zm3.6-6.5L7 11v9h9.1c.8 0 1.5-.5 1.7-1.2l1.7-6.1c.3-1.1-.5-2.2-1.7-2.2H13V6c0-1.1-.9-2-2-2h-.4z" />
    </svg>
  );
}

export function ShareIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.9L15.7 6.4" />
      <path d="M8.2 13.1l7.5 4.5" />
    </svg>
  );
}

export function SendIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 3L10 14" />
      <path d="M21 3l-7 18-4-7-7-4 18-7z" />
    </svg>
  );
}

export function PlayIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 6.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

export function PauseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="7" y="6" width="3.5" height="12" rx="1" />
      <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
    </svg>
  );
}

export function PlatformPcIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
      <path d="M8 20.5h8" />
      <path d="M12 16.5v4" />
    </svg>
  );
}

export function PlatformMobileIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M11 5.5h2" />
      <path d="M11.5 18.5h1" />
    </svg>
  );
}

export function PlatformPs5Icon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 13c0-1.8 1.6-3 3.4-3h11.2c1.8 0 3.4 1.2 3.4 3v2.1c0 1.3-1.1 2.4-2.4 2.4-1.1 0-1.9-.7-2.3-1.5l-1-1.9H8.7l-1 1.9c-.4.8-1.2 1.5-2.3 1.5C4.1 17.5 3 16.4 3 15.1V13z" />
      <path d="M9.5 11.5h5" />
      <path d="M12 9.5v4" />
    </svg>
  );
}

export function PlatformIcon({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) {
  if (platform === "PS5") {
    return <PlatformPs5Icon className={className} />;
  }

  if (platform === "Mobile") {
    return <PlatformMobileIcon className={className} />;
  }

  return <PlatformPcIcon className={className} />;
}

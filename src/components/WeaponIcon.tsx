import { useEffect, useState } from "react";

export function WeaponIcon({
  alt,
  imageUrl,
  className = "",
  fallbackLabel,
  size,
}: {
  alt: string;
  imageUrl: string;
  className?: string;
  fallbackLabel?: string;
  size: number;
}) {
  const [hidden, setHidden] = useState(false);
  const fallbackText = Array.from(fallbackLabel ?? alt).slice(0, 3).join("");

  useEffect(() => {
    setHidden(false);
  }, [imageUrl]);

  if (hidden || !imageUrl) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center bg-[#eef0f4] font-bold tracking-[0.08em] text-[#9999b1] ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.24)) }}
        aria-hidden="true"
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`shrink-0 bg-[#eef0f4] object-contain ${className}`}
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={() => {
        setHidden(true);
      }}
    />
  );
}

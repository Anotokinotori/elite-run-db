import { useEffect, useMemo, useState } from "react";

const AMBR_NAME_MAP: Record<string, string> = {
  amber: "Ambor",
  bennett: "Bennett",
  citlali: "Citlali",
  collei: "Collei",
  furina: "Furina",
  keqing: "Keqing",
  mav: "Mavuika",
  xiangling: "Xiangling",
  xilonen: "Xilonen",
  xingqiu: "Xingqiu",
  zhongli: "Zhongli",
};

const UI_MIRRORS = [
  "https://api.ambr.top/assets/UI/",
  "https://enka.network/ui/",
  "http://file.microgg.cn/ui/",
] as const;

const IMAGE_PATTERNS = {
  circle: (name: string) => `UI_AvatarIcon_${name}_Circle.png`,
  icon: (name: string) => `UI_AvatarIcon_${name}.png`,
};

const VARIANT_FALLBACKS = {
  circle: ["circle", "icon"],
  icon: ["icon"],
} as const;

type CharacterIconVariant = keyof typeof VARIANT_FALLBACKS;

function getAmbrName(characterId: string) {
  return AMBR_NAME_MAP[characterId] ?? "Traveler";
}

function getCharacterImageCandidates(characterId: string, variant: CharacterIconVariant) {
  const ambrName = getAmbrName(characterId);
  const urls: string[] = [];

  VARIANT_FALLBACKS[variant].forEach((currentVariant) => {
    const pattern = IMAGE_PATTERNS[currentVariant];
    UI_MIRRORS.forEach((base) => {
      urls.push(`${base}${pattern(ambrName)}`);
    });
  });

  return urls;
}

export function CharacterIcon({
  alt,
  characterId,
  className = "",
  fallbackLabel,
  size,
  variant = "circle",
}: {
  alt: string;
  characterId: string;
  className?: string;
  fallbackLabel?: string;
  size: number;
  variant?: CharacterIconVariant;
}) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const urls = useMemo(() => getCharacterImageCandidates(characterId, variant), [characterId, variant]);
  const fallbackText = Array.from(fallbackLabel ?? alt ?? characterId).slice(0, 2).join("");

  useEffect(() => {
    setIndex(0);
    setHidden(false);
  }, [characterId, variant]);

  if (hidden || urls.length === 0) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-black/10 text-[#909399] ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.28)) }}
        aria-hidden="true"
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={urls[index]}
      alt={alt}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={() => {
        const nextIndex = index + 1;

        if (nextIndex < urls.length) {
          setIndex(nextIndex);
          return;
        }

        setHidden(true);
      }}
    />
  );
}

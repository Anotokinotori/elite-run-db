import { useEffect, useMemo, useState } from "react";

import { characterDb } from "../../../data/mockRuns";
import { getCharacterImageCandidates, type CharacterImageVariant } from "../media";

export function CharacterImage({
  characterId,
  className = "",
  alt = "",
  variant = "portrait",
}: {
  characterId: string;
  className?: string;
  alt?: string;
  variant?: CharacterImageVariant;
}) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const urls = useMemo(() => getCharacterImageCandidates(characterId, variant), [characterId, variant]);
  const fallbackSource = characterDb[characterId]?.name ?? alt ?? characterId ?? "?";
  const fallbackText = Array.from(fallbackSource).slice(0, 2).join("");

  useEffect(() => {
    setIndex(0);
    setHidden(false);
  }, [characterId, variant]);

  if (hidden || urls.length === 0) {
    if (variant === "portrait") {
      return null;
    }

    return (
      <div className={`bg-black/10 text-[#909399] rounded-full flex items-center justify-center ${className}`} aria-hidden="true">
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={urls[index]}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        const nextIndex = index + 1;
        if (nextIndex < urls.length) {
          setIndex(nextIndex);
        } else {
          setHidden(true);
        }
      }}
    />
  );
}

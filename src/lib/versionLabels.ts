const LUNA_SERIES_MAJOR_VERSION = 6;
const LUNA_SERIES_MAX_MINOR = 7;
const LUNA_RANK_BASE = 60;

// 6.x は原神側の正式名称では Luna シリーズとして扱われる。
// raw record には互換性維持のため "6.0" / "6.1" などが残るが、アプリ上では
// 6.0 = Luna1, 6.1 = Luna2, 6.7 = Luna8 と解釈する。raw record は書き換えない。
export function getLunaVersionNumber(version: string) {
  const normalized = String(version).trim();
  const lunaMatch = normalized.match(/^Luna\s*(\d+)$/i);

  if (lunaMatch) {
    return parseInt(lunaMatch[1], 10);
  }

  const romanMatch = normalized.match(/^Luna\s*([IVX]+)$/i);
  if (romanMatch) {
    return romanToNumber(romanMatch[1]);
  }

  const numericMatch = normalized.match(/^(\d+)\.(\d+)$/);
  if (!numericMatch) {
    return null;
  }

  const major = Number(numericMatch[1]);
  const minor = Number(numericMatch[2]);

  if (major !== LUNA_SERIES_MAJOR_VERSION || minor < 0 || minor > LUNA_SERIES_MAX_MINOR) {
    return null;
  }

  return minor + 1;
}

export function formatVersionLabel(version: string) {
  const lunaVersionNumber = getLunaVersionNumber(version);

  if (lunaVersionNumber !== null) {
    return `Luna${lunaVersionNumber}`;
  }

  return version;
}

export function versionRank(version: string) {
  if (!version) {
    return -1;
  }

  const lunaVersionNumber = getLunaVersionNumber(version);
  if (lunaVersionNumber !== null) {
    return LUNA_RANK_BASE + lunaVersionNumber;
  }

  const numeric = parseFloat(String(version).trim());
  if (Number.isFinite(numeric)) {
    return Math.round(numeric * 10);
  }

  return -1;
}

export function uniqueFormattedVersionLabels(versions: string[]) {
  return Array.from(new Set(versions.map(formatVersionLabel)));
}

function romanToNumber(value: string) {
  const romanValues: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
  };

  return value
    .toUpperCase()
    .split("")
    .reduce((total, current, index, chars) => {
      const currentValue = romanValues[current] ?? 0;
      const nextValue = romanValues[chars[index + 1]] ?? 0;

      return currentValue < nextValue ? total - currentValue : total + currentValue;
    }, 0);
}

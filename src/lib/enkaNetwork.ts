import { characterDb, weaponDb } from "../data/mockRuns";
import { resolveEnkaCharacterId } from "./enkaAvatarCatalog";
import { WEAPON_ID_BY_ENKA_ITEM_ID } from "./weaponCatalog";

const ENKA_CACHE_KEY_PREFIX = "elite-run-db.enkaProfile.";
const DEFAULT_ENKA_TTL_SECONDS = 300;
export const MAX_ENKA_PROFILE_CHARACTERS = 12;

type JsonRecord = Record<string, unknown>;

export type EnkaProfileCharacter = {
  avatarId: number;
  characterId: string | null;
  name: string;
  constellation: number | null;
  weaponId: string | null;
  weaponName: string | null;
  refinement: number | null;
  level: number | null;
  supported: boolean;
};

export type EnkaProfile = {
  uid: string;
  nickname: string;
  signature: string;
  characters: EnkaProfileCharacter[];
  fetchedAt: number;
  ttlSeconds: number;
};

function asRecord(value: unknown): JsonRecord | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }

  return null;
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeEnkaUid(uid: string) {
  return uid.normalize("NFKC").trim();
}

export function normalizeEnkaUidInput(uid: string) {
  return normalizeEnkaUid(uid).replace(/[^\d]/g, "").slice(0, 9);
}

function getWeaponRefinement(weapon: JsonRecord | null) {
  if (!weapon) {
    return null;
  }

  const weaponStats = asRecord(weapon.weapon);
  const affixMap = asRecord(weaponStats?.affixMap ?? weapon.affixMap);
  const values = Object.values(affixMap ?? {})
    .map(asNumber)
    .filter((value): value is number => value !== null);

  if (values.length === 0) {
    return null;
  }

  const highestValue = Math.max(...values);
  return highestValue <= 4 ? highestValue + 1 : highestValue;
}

function getCharacterName(characterId: string | null, avatarId: number) {
  if (characterId) {
    return characterDb[characterId]?.name ?? characterId;
  }

  return `Avatar ${avatarId}`;
}

function normalizeAvatar(avatar: JsonRecord): EnkaProfileCharacter | null {
  const avatarId = asNumber(avatar.avatarId ?? avatar.id);

  if (avatarId === null) {
    return null;
  }

  const characterId = resolveEnkaCharacterId(avatarId);
  const equipList = Array.isArray(avatar.equipList) ? avatar.equipList : [];
  const weapon = equipList
    .map(asRecord)
    .find((entry) => entry?.flat && asRecord(entry.flat)?.itemType === "ITEM_WEAPON") ?? null;
  const weaponFlat = asRecord(weapon?.flat);
  const weaponItemId = asNumber(weapon?.itemId ?? weaponFlat?.id ?? weaponFlat?.itemId);
  const weaponId = weaponItemId !== null ? WEAPON_ID_BY_ENKA_ITEM_ID[weaponItemId] ?? null : null;
  const level = asNumber(avatar.propMap && asRecord(avatar.propMap)?.["4001"] && asRecord(asRecord(avatar.propMap)?.["4001"])?.val);
  const constellation = Array.isArray(avatar.talentIdList)
    ? avatar.talentIdList.length
    : asNumber(avatar.constellationNum ?? avatar.constellations);

  return {
    avatarId,
    characterId,
    name: getCharacterName(characterId, avatarId),
    constellation: constellation ?? 0,
    weaponId,
    weaponName: weaponId ? weaponDb[weaponId]?.name ?? null : null,
    refinement: getWeaponRefinement(weapon),
    level,
    supported: characterId !== null,
  } satisfies EnkaProfileCharacter;
}

function normalizeShowcaseAvatar(avatar: JsonRecord): EnkaProfileCharacter | null {
  const avatarId = asNumber(avatar.avatarId ?? avatar.id);

  if (avatarId === null) {
    return null;
  }

  const characterId = resolveEnkaCharacterId(avatarId);

  return {
    avatarId,
    characterId,
    name: getCharacterName(characterId, avatarId),
    constellation: null,
    weaponId: null,
    weaponName: null,
    refinement: null,
    level: asNumber(avatar.level),
    supported: characterId !== null,
  } satisfies EnkaProfileCharacter;
}

function getCachedProfile(uid: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${ENKA_CACHE_KEY_PREFIX}${uid}`);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { expiresAt?: number; data?: EnkaProfile };

    if (!parsed?.expiresAt || !parsed.data || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(`${ENKA_CACHE_KEY_PREFIX}${uid}`);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function setCachedProfile(uid: string, profile: EnkaProfile) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const expiresAt = profile.fetchedAt + profile.ttlSeconds * 1000;
    window.localStorage.setItem(
      `${ENKA_CACHE_KEY_PREFIX}${uid}`,
      JSON.stringify({
        expiresAt,
        data: profile,
      }),
    );
  } catch {
    // Ignore cache failures and keep the live response.
  }
}

export function isValidEnkaUid(uid: string) {
  return /^\d{9}$/.test(normalizeEnkaUid(uid));
}

async function getResponseErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("text/html")) {
      return "Enka.Network 側で認証確認が入り、プロフィールを取得できませんでした。少し時間をおいてもう一度お試しください。";
    }

    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as JsonRecord;
      const message = payload.message;

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    } else {
      const text = await response.text();

      if (text.trim()) {
        return text.trim();
      }
    }
  } catch {
    // Ignore parse failures and fall back to the generic error below.
  }

  if (response.status === 404) {
    return "UIDに対応する公開プロフィールが見つかりませんでした。Enka.Network の公開設定を確認してください。";
  }

  if (response.status >= 500) {
    return "Enka.Network 側で一時的に取得できませんでした。時間をおいて再度お試しください。";
  }

  return null;
}

export async function fetchEnkaProfile(uid: string): Promise<EnkaProfile> {
  const normalizedUid = normalizeEnkaUid(uid);

  if (!isValidEnkaUid(normalizedUid)) {
    throw new Error("UIDは9桁の数字で入力してください。");
  }

  const cached = getCachedProfile(normalizedUid);

  if (cached) {
    return cached;
  }

  const response = await fetch(`/api/enka/uid/${normalizedUid}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error((await getResponseErrorMessage(response)) ?? "Enka.Network からプロフィールを取得できませんでした。");
  }

  const payload = (await response.json()) as JsonRecord;
  const playerInfo = asRecord(payload.playerInfo) ?? {};
  const detailedAvatars = Array.isArray(payload.avatarInfoList) ? payload.avatarInfoList : [];
  const showcaseAvatars = Array.isArray(playerInfo.showAvatarInfoList) ? playerInfo.showAvatarInfoList : [];
  const characters = (detailedAvatars.length > 0 ? detailedAvatars : showcaseAvatars)
    .map(asRecord)
    .map((avatar) => (detailedAvatars.length > 0 ? normalizeAvatar(avatar ?? {}) : normalizeShowcaseAvatar(avatar ?? {})))
    .filter((avatar): avatar is EnkaProfileCharacter => avatar !== null)
    .slice(0, MAX_ENKA_PROFILE_CHARACTERS);
  const ttlSeconds = asNumber(payload.ttl) ?? DEFAULT_ENKA_TTL_SECONDS;

  const profile: EnkaProfile = {
    uid: normalizedUid,
    nickname: String(playerInfo.nickname ?? ""),
    signature: String(playerInfo.signature ?? ""),
    characters,
    fetchedAt: Date.now(),
    ttlSeconds,
  };

  setCachedProfile(normalizedUid, profile);
  return profile;
}

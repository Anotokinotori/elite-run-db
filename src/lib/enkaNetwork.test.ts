import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchEnkaProfile, isValidEnkaUid, normalizeEnkaUidInput } from "./enkaNetwork";

const PROFILE_CACHE_KEY = "elite-run-db.enkaProfile.123456789";

describe("enkaNetwork", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("normalizes full-width digits and strips non-digits from UID input", () => {
    expect(normalizeEnkaUidInput("１２3-４５6 ７８9abc")).toBe("123456789");
  });

  it("accepts only 9-digit UIDs", () => {
    expect(isValidEnkaUid("123456789")).toBe(true);
    expect(isValidEnkaUid("１２３４５６７８９")).toBe(true);
    expect(isValidEnkaUid("12345678")).toBe(false);
  });

  it("rejects invalid UIDs before calling fetch", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(fetchEnkaProfile("123")).rejects.toThrow("UIDは9桁の数字で入力してください。");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns a cached profile without refetching", async () => {
    const cachedProfile = {
      uid: "123456789",
      nickname: "Cached",
      signature: "hello",
      characters: [],
      fetchedAt: 1000,
      ttlSeconds: 300,
    };
    const fetchSpy = vi.fn();

    window.localStorage.setItem(
      PROFILE_CACHE_KEY,
      JSON.stringify({
        expiresAt: Date.now() + 60_000,
        data: cachedProfile,
      }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    await expect(fetchEnkaProfile("123456789")).resolves.toEqual(cachedProfile);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("normalizes detailed avatar payloads and enforces the 12-character limit", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ttl: 120,
            playerInfo: {
              nickname: "Diluc Main",
              signature: "Ready",
            },
            avatarInfoList: Array.from({ length: 13 }, (_, index) => ({
              avatarId: index === 0 ? 10000016 : 10000003,
              propMap: {
                "4001": { val: String(90 - index) },
              },
              talentIdList: [1, 2],
              equipList: [
                {
                  itemId: 12502,
                  flat: {
                    itemType: "ITEM_WEAPON",
                  },
                  weapon: {
                    affixMap: { "1": 1 },
                  },
                },
              ],
            })),
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    const profile = await fetchEnkaProfile("123456789");

    expect(profile.nickname).toBe("Diluc Main");
    expect(profile.signature).toBe("Ready");
    expect(profile.characters).toHaveLength(12);
    expect(profile.characters[0]).toMatchObject({
      avatarId: 10000016,
      characterId: "diluc",
      weaponId: "wolfSGravestone",
      refinement: 2,
      level: 90,
      constellation: 2,
      supported: true,
    });
  });

  it("falls back to showcase avatars when detailed avatars are absent", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            playerInfo: {
              nickname: "Showcase",
              signature: "",
              showAvatarInfoList: [
                {
                  avatarId: 10000003,
                  level: 80,
                },
              ],
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    const profile = await fetchEnkaProfile("123456789");

    expect(profile.characters).toHaveLength(1);
    expect(profile.characters[0]).toMatchObject({
      avatarId: 10000003,
      characterId: "jean",
      level: 80,
      weaponId: null,
      constellation: null,
    });
  });

  it("uses response fallback messages for failed requests", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("", {
          status: 404,
          headers: {
            "Content-Type": "text/plain",
          },
        }),
      ),
    );

    await expect(fetchEnkaProfile("123456789")).rejects.toThrow(
      "UIDに対応する公開プロフィールが見つかりませんでした。Enka.Network の公開設定を確認してください。",
    );
  });
});

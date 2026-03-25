import { useEffect, useMemo, useState } from "react";

import type { EnkaProfile, EnkaProfileCharacter } from "../../lib/enkaNetwork";
import { CharacterIcon } from "../../components/CharacterIcon";
import { CHARACTER_OPTIONS, ELEMENT_FILTER_OPTIONS, WEAPON_OPTIONS } from "./submitConfig";
import { EmptyCharacterBadge, FieldError, SectionTitle } from "./submitUi";

export function CharacterPickerModal({
  isOpen,
  activeCharacterId,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  activeCharacterId: string;
  onClose: () => void;
  onSelect: (characterId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [elementFilter, setElementFilter] = useState<(typeof ELEMENT_FILTER_OPTIONS)[number]["key"]>("all");
  const filteredCharacters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return CHARACTER_OPTIONS.filter((character) => {
      const matchesElement = elementFilter === "all" || character.element === elementFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        character.name.toLowerCase().includes(normalizedQuery) ||
        character.id.toLowerCase().includes(normalizedQuery);

      return matchesElement && matchesQuery;
    });
  }, [elementFilter, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery("");
    setElementFilter("all");
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className="flex h-[720px] max-h-[calc(100vh-48px)] w-full max-w-[760px] flex-col rounded-[24px] border border-[#ebebeb] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.16)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionTitle
          title="キャラ選択"
          description="Step 2 の 1 / 2 / 3 / 4 はパーティスロットです。選択すると現在のスロットに反映されます。"
          action={
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f2f2] text-black"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          }
        />

        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="キャラ名で検索"
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#0f1419]"
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] font-medium text-black"
            >
              クリア
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ELEMENT_FILTER_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setElementFilter(option.key)}
                className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                  elementFilter === option.key ? "bg-[#0f1419] text-white" : "bg-[#f2f2f2] text-[#545468]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-[16px] bg-[#f6f7f9] p-3">
            <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
              {filteredCharacters.map((character) => {
                const isActive = character.id === activeCharacterId;

                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => onSelect(character.id)}
                    className={`rounded-[16px] border bg-white p-2 text-center transition hover:-translate-y-[1px] ${
                      isActive ? "border-[#0f1419] shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : "border-transparent"
                    }`}
                  >
                    <div className="flex justify-center">
                      <CharacterIcon characterId={character.id} alt={character.name} fallbackLabel={character.name} size={62} />
                    </div>
                    <div className="mt-2 text-[12px] font-medium text-black">{character.name}</div>
                  </button>
                );
              })}
            </div>

            {filteredCharacters.length === 0 ? (
              <div className="grid h-full min-h-[240px] place-items-center text-center text-[14px] text-[#7b7b8d]">
                条件に一致するキャラクターがありません。
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WeaponPickerModal({
  isOpen,
  activeWeaponId,
  options,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  activeWeaponId: string;
  options: typeof WEAPON_OPTIONS;
  onClose: () => void;
  onSelect: (weaponId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredWeapons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return options.filter((weapon) => {
      if (!normalizedQuery) {
        return true;
      }

      return weapon.name.toLowerCase().includes(normalizedQuery) || weapon.id.toLowerCase().includes(normalizedQuery);
    });
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery("");
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[72] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className="w-full max-w-[760px] rounded-[24px] border border-[#ebebeb] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.16)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionTitle
          title="武器選択"
          description="現在のキャラクターが装備できる武器だけを表示しています。"
          action={
            <button type="button" onClick={onClose} className="rounded-full bg-[#f2f2f2] px-4 py-2 text-[13px] font-medium text-black">
              閉じる
            </button>
          }
        />

        <div className="mt-6 flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="武器名で検索"
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#0f1419]"
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] font-medium text-black"
            >
              クリア
            </button>
          </div>

          <div className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto rounded-[16px] bg-[#f6f7f9] p-3 md:grid-cols-3">
            {filteredWeapons.map((weapon) => {
              const isActive = weapon.id === activeWeaponId;

              return (
                <button
                  key={weapon.id}
                  type="button"
                  onClick={() => onSelect(weapon.id)}
                  className={`rounded-[16px] border bg-white p-4 text-left transition hover:-translate-y-[1px] ${
                    isActive ? "border-[#0f1419] shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : "border-transparent"
                  }`}
                >
                  <div className="text-[28px] font-bold text-[#9999b1]">{weapon.shortLabel}</div>
                  <div className="mt-3 text-[15px] font-semibold text-black">{weapon.name}</div>
                  <div className="mt-1 text-[12px] text-[#7b7b8d]">
                    {weapon.weaponClass} / {weapon.tier === "five_star" ? "5 star" : "4 star"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UidCharacterPickerModal({
  isOpen,
  uid,
  onUidChange,
  profile,
  selectedCharacterIds,
  isLoading,
  fetchError,
  onClose,
  onFetch,
  onSelectCharacter,
  onClearSlot,
  onApply,
}: {
  isOpen: boolean;
  uid: string;
  onUidChange: (value: string) => void;
  profile: EnkaProfile | null;
  selectedCharacterIds: string[];
  isLoading: boolean;
  fetchError: string;
  onClose: () => void;
  onFetch: () => void;
  onSelectCharacter: (character: EnkaProfileCharacter) => void;
  onClearSlot: (index: number) => void;
  onApply: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  const selectedCharacters = selectedCharacterIds
    .map((characterId) => profile?.characters.find((character) => character.characterId === characterId))
    .filter((character): character is EnkaProfileCharacter => character !== undefined);
  const profileCharacters = Array.from({ length: 8 }, (_, index) => profile?.characters[index] ?? null);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[rgba(0,0,0,0.2)] px-4 py-6" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[36px] bg-white p-6 shadow-[0_24px_48px_rgba(0,0,0,0.18)] md:p-[52px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="text-center text-[28px] font-bold text-black md:text-[32px]">キャラクター選択</div>

        <div className="mt-10 flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto pr-1">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_376px] xl:items-end">
            <div className="flex flex-col gap-4">
              <div className="text-[22px] font-bold text-[#9999b1] md:text-[24px]">プロフィールキャラクター</div>
              <div className="rounded-[8px] border border-[rgba(0,0,0,0.4)] bg-[#f6f6f6] p-4">
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    value={uid}
                    onChange={(event) => onUidChange(event.target.value.replace(/[^\d]/g, "").slice(0, 9))}
                    inputMode="numeric"
                    placeholder="UID を入力"
                    className="w-full rounded-[8px] bg-white px-4 py-3 text-[18px] text-black outline-none md:text-[20px]"
                  />
                  <button
                    type="button"
                    onClick={onFetch}
                    disabled={isLoading}
                    className="inline-flex w-fit shrink-0 items-center justify-center self-start whitespace-nowrap rounded-[8px] bg-[#333333] px-5 py-3 text-[16px] text-white disabled:cursor-not-allowed disabled:opacity-60 md:self-auto"
                  >
                    {isLoading ? "取得中..." : "取得"}
                  </button>
                </div>
                {profile?.nickname ? (
                  <div className="mt-3 text-[13px] text-[#7b7b8d]">
                    {profile.nickname}
                    {profile.signature ? ` / ${profile.signature}` : ""}
                  </div>
                ) : (
                  <div className="mt-3 text-[13px] text-[#7b7b8d]">Enka.Network の公開プロフィールから最大 8 人を読み込みます。</div>
                )}
                <FieldError message={fetchError} />
              </div>

              <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4">
                {profileCharacters.map((character, index) => {
                  if (!character) {
                    return <div key={`profile-placeholder-${index}`} className="h-[93px] rounded-[8px] bg-[#f6f6f6]" />;
                  }

                  const isSelected = character.characterId ? selectedCharacterIds.includes(character.characterId) : false;
                  const order = character.characterId ? selectedCharacterIds.indexOf(character.characterId) + 1 : -1;

                  return (
                    <button
                      key={`${character.avatarId}-${character.characterId ?? "unknown"}`}
                      type="button"
                      disabled={!character.supported}
                      onClick={() => onSelectCharacter(character)}
                      className={`relative flex h-[93px] flex-col items-center justify-center rounded-[8px] bg-[#f6f6f6] px-3 py-2 transition ${
                        character.supported ? "hover:-translate-y-[1px]" : "cursor-not-allowed opacity-55"
                      }`}
                    >
                      {isSelected ? (
                        <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-[#0f1419] px-2 py-0.5 text-[11px] font-semibold text-white">
                          {order}
                        </div>
                      ) : null}
                      {character.characterId ? (
                        <CharacterIcon characterId={character.characterId} alt={character.name} fallbackLabel={character.name} size={54} />
                      ) : (
                        <EmptyCharacterBadge label="?" />
                      )}
                      <div className="mt-2 text-center text-[11px] font-medium text-[#666666]">{character.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[22px] font-bold text-[#9999b1] md:text-[24px]">使用キャラクター</div>
              <div className="text-[13px] leading-[1.7] text-[#7b7b8d]">
                左のキャラを押すと選択、右の枠を押すとその枠だけ解除します。4 人埋まっている状態では 5 人目は追加されません。
              </div>
              <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => {
                  const selectedCharacter = selectedCharacters[index] ?? null;

                  return (
                    <button
                      key={`uid-slot-${index}`}
                      type="button"
                      onClick={() => onClearSlot(index)}
                      className="flex h-[93px] flex-col items-center justify-center rounded-[8px] bg-[#f6f6f6] px-3 py-2"
                    >
                      {selectedCharacter?.characterId ? (
                        <>
                          <CharacterIcon
                            characterId={selectedCharacter.characterId}
                            alt={selectedCharacter.name}
                            fallbackLabel={selectedCharacter.name}
                            size={54}
                          />
                          <div className="mt-2 text-center text-[11px] font-medium text-[#666666]">{selectedCharacter.name}</div>
                        </>
                      ) : (
                        <div className="text-[48px] leading-none text-[#c2c2c2]">+</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-fit shrink-0 items-center justify-center self-end whitespace-nowrap rounded-[8px] border border-[#333333] bg-white px-6 py-4 text-[18px] text-black md:self-auto md:text-[24px]"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={onApply}
              disabled={selectedCharacters.length === 0}
              className="w-full rounded-[8px] bg-[#333333] px-6 py-4 text-[18px] text-white disabled:cursor-not-allowed disabled:opacity-50 md:w-[180px] md:text-[24px]"
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuidelineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className="w-full max-w-[720px] rounded-[24px] border border-[#ebebeb] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.16)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionTitle
          title="ガイドライン"
          description="内容は仮置きですが、導線と同意チェックの位置はこのまま実装しています。"
          action={
            <button type="button" onClick={onClose} className="rounded-full bg-[#f2f2f2] px-4 py-2 text-[13px] font-medium text-black">
              閉じる
            </button>
          }
        />

        <div className="mt-6 space-y-4 text-[14px] leading-[1.8] text-[#49495b]">
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            1. 動画 URL は公開 YouTube リンクを想定しています。限定公開や削除済みリンクは比較ビュー・詳細画面で再生できません。
          </div>
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            2. 編成・凸・武器・精錬は自己申告ベースです。UID からの取得は best effort なので、最終確認は提出者自身で行ってください。
          </div>
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            3. コメント、いいね、共有、実 submit 永続化はまだ仮実装です。提出後も下書きはブラウザに残ります。
          </div>
        </div>
      </div>
    </div>
  );
}

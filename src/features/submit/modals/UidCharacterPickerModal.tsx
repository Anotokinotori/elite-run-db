import { MAX_ENKA_PROFILE_CHARACTERS, normalizeEnkaUidInput, type EnkaProfile, type EnkaProfileCharacter } from "../../../lib/enkaNetwork";
import { CharacterIcon } from "../../../components/CharacterIcon";

import { EmptyCharacterBadge, FieldError } from "../ui";

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
  const profileCharacters = Array.from({ length: MAX_ENKA_PROFILE_CHARACTERS }, (_, index) => profile?.characters[index] ?? null);

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
                    onChange={(event) => onUidChange(normalizeEnkaUidInput(event.target.value))}
                    inputMode="numeric"
                    autoFocus
                    placeholder="UID を入力"
                    className="w-full rounded-[8px] bg-white px-4 py-3 text-[18px] text-black outline-none md:text-[20px]"
                  />
                  <button
                    type="button"
                    onClick={() => onFetch()}
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
                  <div className="mt-3 text-[13px] text-[#7b7b8d]">Enka.Network の公開プロフィールから最大 12 人を読み込みます。</div>
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

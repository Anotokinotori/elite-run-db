import type { Bracket } from "../../../data/mockRuns";
import { characterDb } from "../../../data/mockRuns";
import { CharacterIcon } from "../../../components/CharacterIcon";
import { WeaponIcon } from "../../../components/WeaponIcon";

import { BRACKET_META } from "../config";
import { normalizeEnkaUidInput } from "../../../lib/enkaNetwork";
import type { FieldErrors, SubmitDraft, SubmitPartySlot } from "../types";
import { CreateFieldBox, FieldError, FieldTitle, SearchActionIcon, StepHeroHeader } from "../ui";

type StepPartyProps = {
  activeCharacter: { name: string } | undefined;
  activeCharacterCost: number;
  activePartySlot: SubmitPartySlot;
  activeSlot: number;
  activeWeapon: { name: string; shortLabel: string; imageUrl: string } | undefined;
  activeWeaponCost: number;
  draft: SubmitDraft;
  errors: FieldErrors;
  summary: { bracket: Bracket; charCost: number; weaponCost: number; totalCost: number };
  uidError: string;
  updateBasicInfo: <Key extends keyof SubmitDraft["basicInfo"]>(key: Key, value: SubmitDraft["basicInfo"][Key]) => void;
  updatePartySlot: (slotIndex: number, patch: Partial<SubmitPartySlot>) => void;
  handleUidSearchSubmit: (event: { preventDefault: () => void }) => void;
  setUidError: (value: string) => void;
  setActiveSlot: (slotIndex: number) => void;
  setShowCharacterPicker: (value: boolean) => void;
  setShowWeaponPicker: (value: boolean) => void;
};

export function StepParty(props: StepPartyProps) {
  const {
    activeCharacter,
    activeCharacterCost,
    activePartySlot,
    activeSlot,
    activeWeapon,
    activeWeaponCost,
    draft,
    errors,
    summary,
    uidError,
    updateBasicInfo,
    updatePartySlot,
    handleUidSearchSubmit,
    setUidError,
    setActiveSlot,
    setShowCharacterPicker,
    setShowWeaponPicker,
  } = props;

  return (
<section className="mx-auto flex w-full max-w-[1180px] flex-col gap-8">
              <StepHeroHeader title="2.編成情報の入力" description="申請する狩りの記録で使用した編成を入力してください。" />

              <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-16">
                <div className="flex flex-1 flex-col gap-8 border-b-2 border-[#d9d9d9] pb-8 xl:min-h-[864px]">
                  <div>
                    <form onSubmit={handleUidSearchSubmit} className="relative rounded-[8px] bg-[#f6f6f6]">
                      <div className="pointer-events-none absolute inset-0 rounded-[8px] border border-[rgba(0,0,0,0.4)]" />
                      <div className="flex items-center gap-3 px-4 py-3">
                        <input
                          value={draft.basicInfo.uid}
                          onChange={(event) => {
                            updateBasicInfo("uid", normalizeEnkaUidInput(event.target.value));
                            setUidError("");
                          }}
                          inputMode="numeric"
                          placeholder="UID を入力"
                          className="min-w-0 flex-1 bg-transparent text-[18px] text-black outline-none md:text-[20px]"
                        />
                        <button
                          type="submit"
                          aria-label={"UID\u3092\u691c\u7d22"}
                          title={"UID\u3092\u691c\u7d22"}
                          className="group inline-flex h-[44px] shrink-0 items-center justify-center gap-[10px] rounded-[8px] bg-[#ececf2] px-4 text-[#5f6373] shadow-[inset_0_0_0_1px_rgba(123,123,141,0.14)] transition duration-150 hover:-translate-y-[1px] hover:bg-[#e4e5ec] hover:text-[#4d5160] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/10"
                        >
                          <SearchActionIcon />
                          <span className="text-[16px] font-medium leading-none md:text-[17px]">{"\u53d6\u5f97"}</span>
                        </button>
                      </div>
                    </form>
                    <FieldError message={uidError} />
                  </div>

                  <div className="border-b border-[#d9d9d9]">
                    <div className="flex gap-4 overflow-x-auto">
                      {draft.party.map((slot, index) => {
                        const active = activeSlot === index;
                        const slotCharacter = slot.characterId ? characterDb[slot.characterId] : null;

                        return (
                          <button
                            key={`slot-tab-${index}`}
                            type="button"
                            onClick={() => setActiveSlot(index)}
                            className={`relative flex shrink-0 items-center gap-2 px-6 py-4 ${active ? "border-b-[6px] border-black" : ""}`}
                          >
                            <span className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full ${slotCharacter ? "" : active ? "bg-black" : "bg-[#d9d9d9]"}`}>
                              {slotCharacter ? (
                                <CharacterIcon
                                  characterId={slot.characterId}
                                  alt={slotCharacter.name}
                                  fallbackLabel={slotCharacter.name}
                                  size={40}
                                />
                              ) : null}
                            </span>
                            <span className={`text-[32px] ${active ? "text-black" : "text-[#d9d9d9]"}`}>{index + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-[44px]">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-3 bg-[#9999b1]" />
                          <FieldTitle quiet>{`${activeSlot + 1}人目のキャラクター`}</FieldTitle>
                        </div>

                        <div className="rounded-[8px] bg-[#f6f6f6] p-4">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <button
                              type="button"
                              onClick={() => setShowCharacterPicker(true)}
                              className="flex h-[154px] w-[154px] items-center justify-center rounded-[4px] bg-white"
                            >
                              {activePartySlot.characterId ? (
                                <CharacterIcon
                                  characterId={activePartySlot.characterId}
                                  alt={activeCharacter?.name ?? activePartySlot.characterId}
                                  fallbackLabel={activeCharacter?.name ?? activePartySlot.characterId}
                                  size={120}
                                />
                              ) : (
                                <div className="text-[128px] leading-none text-[#c2c2c2]">+</div>
                              )}
                            </button>

                            <div className="flex w-full flex-col gap-6 md:w-[160px]">
                              <button
                                type="button"
                                onClick={() => setShowCharacterPicker(true)}
                                className="block w-full appearance-none bg-transparent p-0 text-left text-[32px] font-bold leading-none text-[#9999b1]"
                              >
                                {activeCharacter?.name ?? "キャラ未選択"}
                              </button>
                              <CreateFieldBox className="bg-white">
                                <select
                                  value={activePartySlot.cons}
                                  onChange={(event) => updatePartySlot(activeSlot, { cons: Number(event.target.value) })}
                                  disabled={!activePartySlot.characterId}
                                  className="w-full bg-transparent text-[20px] text-[#9999b1] outline-none md:text-[24px]"
                                >
                                  {Array.from({ length: 7 }, (_, index) => (
                                    <option key={index} value={index}>
                                      {index}凸
                                    </option>
                                  ))}
                                </select>
                              </CreateFieldBox>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="hidden h-[154px] w-px bg-[#c2c2c2] md:block" />
                            <div className="text-[28px] font-bold text-[#9999b1] md:text-[32px]">Cost : {activeCharacterCost}</div>
                          </div>
                        </div>
                          <FieldError message={errors[`party.${activeSlot}.characterId`]} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-3 bg-[#9999b1]" />
                          <FieldTitle quiet>{`${activeSlot + 1}人目の武器`}</FieldTitle>
                        </div>

                        <div className="rounded-[8px] bg-[#f6f6f6] p-4">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <button
                              type="button"
                              onClick={() => setShowWeaponPicker(true)}
                              disabled={!activePartySlot.characterId}
                              className="flex h-[154px] w-[154px] items-center justify-center rounded-[4px] bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {activeWeapon ? (
                                <WeaponIcon
                                  imageUrl={activeWeapon.imageUrl}
                                  alt={activeWeapon.name}
                                  fallbackLabel={activeWeapon.shortLabel}
                                  size={120}
                                  className="rounded-[12px] p-2"
                                />
                              ) : (
                                <div className="text-[128px] leading-none text-[#c2c2c2]">+</div>
                              )}
                            </button>

                            <div className="flex w-full flex-col gap-6 md:w-[160px]">
                              <button
                                type="button"
                                onClick={() => setShowWeaponPicker(true)}
                                disabled={!activePartySlot.characterId}
                                className="block w-full appearance-none bg-transparent p-0 text-center text-[28px] font-bold leading-none text-[#9999b1] disabled:cursor-not-allowed disabled:opacity-60 md:text-[32px]"
                              >
                                {activeWeapon?.name ?? "武器未選択"}
                              </button>
                              <div className="flex flex-col gap-3">
                                <CreateFieldBox className="bg-white">
                                  <select
                                    value={activePartySlot.refine}
                                    onChange={(event) => updatePartySlot(activeSlot, { refine: Number(event.target.value) })}
                                    disabled={!activePartySlot.weaponId}
                                    className="w-full bg-transparent text-[20px] text-[#9999b1] outline-none md:text-[24px]"
                                  >
                                    {Array.from({ length: 5 }, (_, index) => (
                                      <option key={index} value={index + 1}>
                                        精錬 {index + 1}
                                      </option>
                                    ))}
                                  </select>
                                </CreateFieldBox>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="hidden h-[154px] w-px bg-[#c2c2c2] md:block" />
                            <div className="text-[28px] font-bold text-[#9999b1] md:text-[32px]">Cost : {activeWeaponCost}</div>
                          </div>
                        </div>
                          <FieldError message={errors[`party.${activeSlot}.weaponId`]} />
                        </div>
                      </div>
                  </div>
                </div>

                <aside className="w-full self-start rounded-[8px] bg-[#f6f6f6] p-4 xl:w-[492px]">
                  <div className="rounded-[8px] bg-white">
                    <div className="px-4 py-8 text-center">
                      <div className={`text-[72px] font-bold md:text-[96px] ${BRACKET_META[summary.bracket].text}`}>
                        {BRACKET_META[summary.bracket].label}
                      </div>
                      <div className="mt-7 flex flex-col gap-6 text-left text-[22px] font-bold text-[#9999b1] md:text-[24px]">
                        <div>キャラクターCost : {summary.charCost}</div>
                        <div>武器Cost : {summary.weaponCost}</div>
                      </div>
                    </div>

                    <div className="mx-4 h-px bg-[#d9d9d9]" />

                    <div className="p-4">
                      <div className="grid gap-6 md:grid-cols-[118px_minmax(0,1fr)]">
                        <div className="space-y-6 text-[20px] font-bold md:text-[24px]">
                          <div className={summary.bracket === 1 ? "text-[#333333]" : "text-[#9999b1]"}>Low</div>
                          <div className={summary.bracket === 2 ? "text-[#333333]" : "text-[#9999b1]"}>Middle</div>
                          <div className={summary.bracket === 3 ? "text-[#333333]" : "text-[#9999b1]"}>High</div>
                          <div className={summary.bracket === 4 ? "text-[#333333]" : "text-[#9999b1]"}>Unlimited</div>
                        </div>
                        <div className="space-y-6 text-[20px] font-bold md:text-[24px]">
                          <div className={summary.bracket === 1 ? "text-[#333333]" : "text-[#9999b1]"}>キャラ≤3 & 武器≤1</div>
                          <div className={summary.bracket === 2 ? "text-[#333333]" : "text-[#9999b1]"}>キャラ≤6 & 武器≤2</div>
                          <div className={summary.bracket === 3 ? "text-[#333333]" : "text-[#9999b1]"}>キャラ≤12 & 武器≤3</div>
                          <div className={summary.bracket === 4 ? "text-[#333333]" : "text-[#9999b1]"}>その他</div>
                        </div>
                      </div>
                      <div className="mt-6 text-[14px] text-[#9999b1] md:text-[16px]">※限定星5の引いた数</div>
                    </div>
                  </div>

                </aside>
              </div>
              </section>
  );
}

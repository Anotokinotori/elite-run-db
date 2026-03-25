import { useEffect, useMemo, useState } from "react";

import { characterDb, weaponDb } from "../../data/mockRuns";
import { CharacterIcon } from "../../components/CharacterIcon";
import { fetchEnkaProfile, isValidEnkaUid, type EnkaProfile, type EnkaProfileCharacter } from "../../lib/enkaNetwork";
import {
  AUTO_SAVE_DELAY_MS,
  BRACKET_META,
  PLATFORM_OPTIONS,
  RULESET_OPTIONS,
  SEARCH_TAG_OPTIONS,
  WEAPON_OPTIONS,
  createEmptyPartySlot,
} from "./submitConfig";
import {
  applyUidSelectionToParty,
  clearUidSelectedCharacter,
  getInitialUidSelectedCharacterIds,
  getResolvedUidSelectedCharacterIds,
  selectUidCharacter,
} from "./submitUid";
import {
  getCharacterCostForSlot,
  getDefaultWeaponId,
  getSummaryForParty,
  getWeaponCostForSlot,
  isWeaponCompatible,
} from "./submitParty";
import { loadInitialDraftState, persistDraft } from "./submitStorage";
import { buildTimeInputValue, splitTimeInputValue } from "./submitTime";
import type { FieldErrors, PlayMode, SubmitDraft, SubmitPartySlot, SubmitStep } from "./types";
import { validateStep1, validateStep2, validateStep3 } from "./submitValidation";
import { CharacterPickerModal, GuidelineModal, UidCharacterPickerModal, WeaponPickerModal } from "./submitModals";
import {
  AttackerSelectionIndicator,
  BottomActionButtons,
  FieldError,
  FieldTitle,
  MockChoiceButton,
  MockFieldBox,
  PlatformChoiceContent,
  SearchActionIcon,
  SectionDivider,
  StepHeroHeader,
  StepIndicator,
  SubmitSurfaceScale,
} from "./submitUi";

export function RunSubmitPage({ onBack, embedded = false }: { onBack: () => void; embedded?: boolean }) {
  const [initialState] = useState(() => loadInitialDraftState());
  const [draft, setDraft] = useState<SubmitDraft>(initialState.draft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [activeSlot, setActiveSlot] = useState(0);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [showWeaponPicker, setShowWeaponPicker] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showUidModal, setShowUidModal] = useState(false);
  const [uidProfile, setUidProfile] = useState<EnkaProfile | null>(null);
  const [uidLoading, setUidLoading] = useState(false);
  const [uidError, setUidError] = useState("");
  const [uidSelectedCharacterIds, setUidSelectedCharacterIds] = useState<string[]>([]);

  const summary = useMemo(() => getSummaryForParty(draft.party), [draft.party]);
  const activePartySlot = draft.party[activeSlot];
  const activeCharacter = activePartySlot?.characterId ? characterDb[activePartySlot.characterId] : undefined;
  const activeWeapon = activePartySlot?.weaponId ? weaponDb[activePartySlot.weaponId] : undefined;
  const timeInput = splitTimeInputValue(draft.basicInfo.time);
  const activeCharacterCost = getCharacterCostForSlot(activePartySlot);
  const activeWeaponCost = getWeaponCostForSlot(activePartySlot);
  const compatibleWeapons = useMemo(() => {
    if (!activeCharacter) {
      return WEAPON_OPTIONS;
    }

    return WEAPON_OPTIONS.filter((weapon) => weapon.weaponClass === activeCharacter.weaponClass);
  }, [activeCharacter]);
  const availablePartyCharacters = useMemo(
    () =>
      draft.party
        .map((slot) => slot.characterId)
        .filter((characterId): characterId is string => Boolean(characterId))
        .filter((characterId, index, allCharacterIds) => allCharacterIds.indexOf(characterId) === index),
    [draft.party],
  );

  useEffect(() => {
    // ???????????????draft ?????????????
    const timerId = window.setTimeout(() => {
      persistDraft(draft);
    }, AUTO_SAVE_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [draft]);

  useEffect(() => {
    // Step 2 ???????????main attacker ?????????
    setDraft((currentDraft) => {
      const availableIds = new Set(
        currentDraft.party.map((slot) => slot.characterId).filter((characterId): characterId is string => Boolean(characterId)),
      );
      const filteredAttackers = currentDraft.details.mainAttackerIds.filter((characterId) => availableIds.has(characterId));
      const normalizedAttackers =
        currentDraft.basicInfo.playMode === "solo" ? filteredAttackers.slice(0, 1) : filteredAttackers;

      if (
        normalizedAttackers.length === currentDraft.details.mainAttackerIds.length &&
        normalizedAttackers.every((characterId, index) => characterId === currentDraft.details.mainAttackerIds[index])
      ) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        details: {
          ...currentDraft.details,
          mainAttackerIds: normalizedAttackers,
        },
      };
    });
  }, [draft.basicInfo.playMode, draft.party]);

  const clearErrors = (prefixes: string[]) => {
    setErrors((currentErrors) =>
      Object.fromEntries(
        Object.entries(currentErrors).filter(([key]) => !prefixes.some((prefix) => key.startsWith(prefix))),
      ),
    );
  };

  const updateBasicInfo = <Key extends keyof SubmitDraft["basicInfo"]>(
    key: Key,
    value: SubmitDraft["basicInfo"][Key],
  ) => {
    setDraft((currentDraft) => {
      const nextDraft: SubmitDraft = {
        ...currentDraft,
        basicInfo: {
          ...currentDraft.basicInfo,
          [key]: value,
        },
      };

      if (key === "playMode" && value === "solo") {
        nextDraft.details = {
          ...currentDraft.details,
          mainAttackerIds: currentDraft.details.mainAttackerIds.slice(0, 1),
        };
      }

      return nextDraft;
    });
    clearErrors([`basicInfo.${String(key)}`]);
  };

  const updateTimeInput = (part: "hours" | "minutes" | "seconds", value: string) => {
    updateBasicInfo("time", buildTimeInputValue({ ...timeInput, [part]: value }));
  };

  const updatePartySlot = (slotIndex: number, patch: Partial<SubmitPartySlot>) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      party: currentDraft.party.map((slot, index) => (index === slotIndex ? { ...slot, ...patch } : slot)),
    }));
    clearErrors([`party.${slotIndex}`]);
  };

  const handleCharacterSelect = (slotIndex: number, characterId: string) => {
    setDraft((currentDraft) => {
      const nextParty = currentDraft.party.map((slot, index) => {
        if (index !== slotIndex) {
          return slot;
        }

        const nextWeaponId = isWeaponCompatible(characterId, slot.weaponId) ? slot.weaponId : getDefaultWeaponId(characterId);

        return {
          characterId,
          cons: slot.characterId === characterId ? slot.cons : 0,
          weaponId: nextWeaponId,
          refine: nextWeaponId ? slot.refine || 1 : 1,
        };
      });

      return {
        ...currentDraft,
        party: nextParty,
      };
    });
    clearErrors([`party.${slotIndex}`]);
  };

  const validateCurrentStep = (step: SubmitStep) => {
    const nextErrors =
      step === 1 ? validateStep1(draft) : step === 2 ? validateStep2(draft) : validateStep3(draft);

    setErrors((currentErrors) => ({ ...currentErrors, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleStepAdvance = () => {
    if (!validateCurrentStep(draft.currentStep)) {
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      currentStep: Math.min(3, currentDraft.currentStep + 1) as SubmitStep,
    }));
  };

  const handleStepBack = () => {
    if (draft.currentStep === 1) {
      onBack();
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      currentStep: Math.max(1, currentDraft.currentStep - 1) as SubmitStep,
    }));
  };

  const handleManualSave = () => {
    persistDraft(draft);
  };

  const handleSubmit = () => {
    const nextErrors = {
      ...validateStep1(draft),
      ...validateStep2(draft),
      ...validateStep3(draft),
    };

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors["basicInfo.videoUrl"] || nextErrors["basicInfo.time"]) {
        setDraft((currentDraft) => ({ ...currentDraft, currentStep: 1 }));
      } else if (Object.keys(nextErrors).some((key) => key.startsWith("party."))) {
        setDraft((currentDraft) => ({ ...currentDraft, currentStep: 2 }));
      } else {
        setDraft((currentDraft) => ({ ...currentDraft, currentStep: 3 }));
      }

      return;
    }

    handleManualSave();
    window.alert("提出しました");
    onBack();
  };

  const toggleTag = (tag: string) => {
    setDraft((currentDraft) => {
      const currentTags = new Set(currentDraft.details.tagIds);

      if (currentTags.has(tag)) {
        currentTags.delete(tag);
      } else {
        currentTags.add(tag);
      }

      return {
        ...currentDraft,
        details: {
          ...currentDraft.details,
          tagIds: [...currentTags],
        },
      };
    });
  };

  const toggleMainAttacker = (characterId: string) => {
    setDraft((currentDraft) => {
      const currentAttackers = new Set(currentDraft.details.mainAttackerIds);

      if (currentAttackers.has(characterId)) {
        currentAttackers.delete(characterId);
      } else if (currentDraft.basicInfo.playMode === "multiplayer") {
        currentAttackers.add(characterId);
      } else {
        currentAttackers.clear();
        currentAttackers.add(characterId);
      }

      return {
        ...currentDraft,
        details: {
          ...currentDraft.details,
          mainAttackerIds: [...currentAttackers],
        },
      };
    });
  };

  const openUidModal = () => {
    setUidSelectedCharacterIds(getInitialUidSelectedCharacterIds(draft.party));
    setUidError("");
    setShowUidModal(true);
  };

  const handleFetchUid = async (uid = draft.basicInfo.uid) => {
    const normalizedUid = uid.trim();

    if (!isValidEnkaUid(normalizedUid)) {
      setUidError("UIDは9桁の数字で入力してください。");
      return;
    }

    setUidLoading(true);
    setUidError("");

    try {
      const profile = await fetchEnkaProfile(normalizedUid);
      const supportedCharacters = profile.characters.filter((character) => character.supported && character.characterId);

      setUidProfile(profile);
      setUidSelectedCharacterIds((currentSelectedIds) =>
        getResolvedUidSelectedCharacterIds(currentSelectedIds, profile, draft.party),
      );

      if (profile.characters.length === 0) {
        setUidError("公開プロフィールに表示中のキャラクターが見つかりませんでした。Enka.Network 側の公開設定を確認してください。");
      } else if (supportedCharacters.length === 0) {
        setUidError("プロフィールは取得できましたが、このプロトタイプで対応しているキャラクターが見つかりませんでした。");
      }
    } catch (error) {
      setUidProfile(null);
      setUidError(error instanceof Error ? error.message : "プロフィール取得に失敗しました。");
    } finally {
      setUidLoading(false);
    }
  };

  const handleUidSearchSubmit = (event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    openUidModal();
    void handleFetchUid(draft.basicInfo.uid);
  };

  const handleUidSelectCharacter = (character: EnkaProfileCharacter) => {
    setUidSelectedCharacterIds((currentSelectedIds) => selectUidCharacter(currentSelectedIds, character));
  };

  const handleUidClearSlot = (index: number) => {
    setUidSelectedCharacterIds((currentSelectedIds) => clearUidSelectedCharacter(currentSelectedIds, index));
  };

  const handleUidApply = () => {
    if (!uidProfile) {
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      party: applyUidSelectionToParty(uidProfile, uidSelectedCharacterIds),
    }));
    clearErrors(["party."]);
    setShowUidModal(false);
  };

  return (
    <>
      <main className="min-h-screen bg-white text-[#333333]">
        {embedded ? (
          <div className="border-b border-[#ebebeb] bg-white">
            <div className="header-font mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 py-2 md:px-6">
              <button
                type="button"
                onClick={onBack}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f2f2f2] text-black"
                aria-label="記録一覧へ戻る"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5" />
                  <path d="M11 6L5 12L11 18" />
                </svg>
              </button>
              <div className="text-[16px] font-semibold tracking-tight text-black md:text-[18px]">記録申請</div>
            </div>
          </div>
        ) : null}
        <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-[#ebebeb] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"}>
          <div className="header-font mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f2f2] text-black"
                aria-label="記録詳細へ戻る"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5" />
                  <path d="M11 6L5 12L11 18" />
                </svg>
              </button>
              <div>
                <div className="text-[24px] font-semibold tracking-tight text-black md:text-[34px]">記録提出</div>
              </div>
            </div>
          </div>
        </nav>

        <SubmitSurfaceScale>
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6">
            <StepIndicator currentStep={draft.currentStep} onBack={handleStepBack} />

            {draft.currentStep === 1 ? (
              <section className="mx-auto flex w-full max-w-[980px] flex-col gap-8">
              <StepHeroHeader
                title="1.基本情報の入力"
                description="記録申請に必要な情報を入力して下さい。※この項目は必須項目です。"
              />
              <SectionDivider label="基本情報" />

              <div className="flex flex-col gap-[44px]">
                <label className="block">
                  <FieldTitle quiet>カテゴリ</FieldTitle>
                  <MockFieldBox className="mt-2">
                    <select
                      value={draft.basicInfo.ruleset}
                      onChange={(event) => updateBasicInfo("ruleset", event.target.value)}
                      className="w-full bg-transparent text-[20px] text-black outline-none md:text-[24px]"
                    >
                      {RULESET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </MockFieldBox>
                  <FieldError message={errors["basicInfo.ruleset"]} />
                </label>

                <label className="block">
                  <FieldTitle quiet>動画URL</FieldTitle>
                  <MockFieldBox className="mt-2">
                    <input
                      value={draft.basicInfo.videoUrl}
                      onChange={(event) => updateBasicInfo("videoUrl", event.target.value)}
                      placeholder="例) https://www.youtube.com/watch?v="
                      className="w-full bg-transparent text-[18px] text-black outline-none md:text-[24px]"
                    />
                  </MockFieldBox>
                  <div className="mt-2 text-[13px] text-[#9999b1]">(記録に対応するYouTubeのリンクを入力)</div>
                  <FieldError message={errors["basicInfo.videoUrl"]} />
                </label>

                <label className="block">
                  <FieldTitle quiet>タイム</FieldTitle>
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 md:gap-3 md:px-8">
                    <MockFieldBox className="min-w-0">
                      <input
                        value={timeInput.hours}
                        onChange={(event) => updateTimeInput("hours", event.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        inputMode="numeric"
                        placeholder="00"
                        className="w-full bg-transparent text-center text-[20px] text-black outline-none md:text-[24px]"
                        aria-label="時間"
                      />
                    </MockFieldBox>
                    <span className="text-[24px] font-bold text-[#9999b1] md:text-[28px]">:</span>
                    <MockFieldBox className="min-w-0">
                      <input
                        value={timeInput.minutes}
                        onChange={(event) => updateTimeInput("minutes", event.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        inputMode="numeric"
                        placeholder="00"
                        className="w-full bg-transparent text-center text-[20px] text-black outline-none md:text-[24px]"
                        aria-label="分"
                      />
                    </MockFieldBox>
                    <span className="text-[24px] font-bold text-[#9999b1] md:text-[28px]">:</span>
                    <MockFieldBox className="min-w-0">
                      <input
                        value={timeInput.seconds}
                        onChange={(event) => updateTimeInput("seconds", event.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        inputMode="numeric"
                        placeholder="00"
                        className="w-full bg-transparent text-center text-[20px] text-black outline-none md:text-[24px]"
                        aria-label="秒"
                      />
                    </MockFieldBox>
                  </div>
                  <FieldError message={errors["basicInfo.time"]} />
                </label>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <div className="text-[15px] font-bold text-[#9999b1] md:text-[18px]">プレイ人数</div>
                    <div className="grid gap-3 md:grid-cols-2 md:px-8">
                      {[
                        { value: "solo", label: "Solo" },
                        { value: "multiplayer", label: "Multiplayer" },
                      ].map((option) => (
                        <MockChoiceButton
                          key={option.value}
                          active={draft.basicInfo.playMode === option.value}
                          onClick={() => updateBasicInfo("playMode", option.value as PlayMode)}
                          className="w-full"
                        >
                          {option.label}
                        </MockChoiceButton>
                      ))}
                    </div>
                  </div>

                  <div className="block">
                    <FieldTitle quiet>プレイしているプラットフォーム</FieldTitle>
                    <div className="mt-4 grid gap-3 md:grid-cols-3 md:px-8">
                      {PLATFORM_OPTIONS.map((option) => (
                        <MockChoiceButton
                          key={option}
                          active={draft.basicInfo.primaryPlatform === option}
                          onClick={() => updateBasicInfo("primaryPlatform", option)}
                          className="w-full"
                        >
                          <PlatformChoiceContent platform={option} />
                        </MockChoiceButton>
                      ))}
                    </div>
                  </div>

                  {draft.basicInfo.playMode === "multiplayer" ? (
                    <div className="block">
                      <FieldTitle quiet>2人目のプラットフォーム</FieldTitle>
                      <div className="mt-4 grid gap-3 md:grid-cols-3 md:px-8">
                        {PLATFORM_OPTIONS.map((option) => (
                          <MockChoiceButton
                            key={`secondary-${option}`}
                            active={draft.basicInfo.secondaryPlatform === option}
                            onClick={() => updateBasicInfo("secondaryPlatform", option)}
                            className="w-full"
                          >
                            <PlatformChoiceContent platform={option} />
                          </MockChoiceButton>
                        ))}
                      </div>
                      <FieldError message={errors["basicInfo.secondaryPlatform"]} />
                    </div>
                  ) : null}
                </div>

                <div className="h-px w-full bg-[#d9d9d9]" />
              </div>
              </section>
            ) : null}

            {draft.currentStep === 2 ? (
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
                            updateBasicInfo("uid", event.target.value.replace(/[^\d]/g, "").slice(0, 9));
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
                              <MockFieldBox className="bg-white">
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
                              </MockFieldBox>
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
                                <div className="text-[40px] font-bold text-[#9999b1]">{activeWeapon.shortLabel}</div>
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
                                <MockFieldBox className="bg-white">
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
                                </MockFieldBox>
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
            ) : null}

            {draft.currentStep === 3 ? (
              <section className="mx-auto flex w-full max-w-[980px] flex-col gap-8">
              <StepHeroHeader title="3.詳細情報・ガイドライン" description="検索で見つけてもらいやすくするための項目です。" />

              <div className="flex flex-col gap-[44px]">
                <div className="flex flex-col gap-8">
                  <SectionDivider label="詳細情報  (任意)" />

                  <div className="flex flex-col gap-[44px]">
                    <div className="flex flex-col gap-4">
                      <FieldTitle quiet>メインアタッカーを選択 (一番与ダメージが高いものを選択)</FieldTitle>
                      <div className="flex flex-col gap-4">
                        {availablePartyCharacters.length > 0 ? (
                          availablePartyCharacters.map((characterId) => {
                            const character = characterDb[characterId];
                            const isSelected = draft.details.mainAttackerIds.includes(characterId);
                            const isMultiSelect = draft.basicInfo.playMode === "multiplayer";

                            return (
                              <button
                                key={`attacker-${characterId}`}
                                type="button"
                                onClick={() => toggleMainAttacker(characterId)}
                                role={isMultiSelect ? "checkbox" : "radio"}
                                aria-checked={isSelected}
                                className={`flex items-center gap-8 rounded-[8px] bg-[#f6f6f6] px-4 py-4 text-left ${
                                  isSelected ? "ring-2 ring-[#333333]" : ""
                                }`}
                              >
                                <AttackerSelectionIndicator selected={isSelected} multiSelect={isMultiSelect} />
                                <div className="flex items-center gap-3 text-[20px] text-[#9999b1] md:text-[24px]">
                                  <CharacterIcon characterId={characterId} alt={character.name} fallbackLabel={character.name} size={36} />
                                  <span>{character.name}</span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="rounded-[8px] bg-[#f6f6f6] px-4 py-4 text-[16px] text-[#9999b1]">
                            Step 2 で編成を入力すると、ここで候補を選択できます。
                          </div>
                        )}
                      </div>
                      <div className="text-[13px] leading-[1.7] text-[#7b7b8d]">
                        {draft.basicInfo.playMode === "multiplayer"
                          ? "マルチ時は複数選択できます。通常時は単一選択です。"
                          : "通常時は単一選択です。未選択でも申請できます。"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <FieldTitle quiet>検索用タグ</FieldTitle>
                      <div className="flex flex-wrap gap-4 md:gap-6">
                        {SEARCH_TAG_OPTIONS.map((tag) => {
                          const isSelected = draft.details.tagIds.includes(tag);

                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`rounded-[42px] px-4 py-3 text-[18px] md:text-[24px] ${
                                isSelected ? "bg-[#333333] text-white" : "bg-[#f2f2f2] text-[#9999b1]"
                              }`}
                            >
                              #{tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="block">
                      <FieldTitle quiet>コメント・概要</FieldTitle>
                      <textarea
                        value={draft.details.notes}
                        onChange={(event) =>
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            details: {
                              ...currentDraft.details,
                              notes: event.target.value,
                            },
                          }))
                        }
                        placeholder="この記録でのコメントをどうぞ！"
                        className="mt-2 min-h-[223px] w-full rounded-[8px] bg-[#f6f6f6] px-4 py-4 text-[18px] text-black outline-none placeholder:text-[#c2c2c2] md:text-[24px]"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <SectionDivider label="申請するにあたって" />

                  <div className="flex flex-col gap-2">
                    <FieldTitle quiet>ガイドライン</FieldTitle>
                    <label className="rounded-[8px] bg-[#f6f6f6] px-4 py-4">
                      <div className="flex items-center gap-8">
                        <input
                          type="checkbox"
                          checked={draft.details.guidelineAccepted}
                          onChange={(event) => {
                            setDraft((currentDraft) => ({
                              ...currentDraft,
                              details: {
                                ...currentDraft.details,
                                guidelineAccepted: event.target.checked,
                              },
                            }));
                            clearErrors(["details.guidelineAccepted"]);
                          }}
                          className="h-5 w-5"
                        />
                        <span className="text-[18px] font-bold text-[#333333] md:text-[24px]">ガイドラインに同意する</span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGuidelines(true)}
                      className="text-center text-[18px] text-[#4d49fc] md:text-[24px]"
                    >
                      ガイドラインを確認
                    </button>
                    <div className="text-[13px] leading-[1.7] text-[#7b7b8d]">同意は submit 時のみ必須です。下書き保存では不要です。</div>
                    <FieldError message={errors["details.guidelineAccepted"]} />
                  </div>
                </div>
              </div>
              </section>
            ) : null}

            <div className="mt-8 flex flex-col gap-4">
              <BottomActionButtons
                currentStep={draft.currentStep}
                onSave={handleManualSave}
                onAdvance={handleStepAdvance}
                onSubmit={handleSubmit}
              />
              <div className="mx-auto w-full max-w-[500px] text-center text-[13px] leading-[1.7] text-[#7b7b8d]">
                下書きはブラウザに保持され、ダミー submit 後も自動では消しません。
              </div>
            </div>
          </div>
        </SubmitSurfaceScale>
      </main>

      <CharacterPickerModal
        isOpen={showCharacterPicker}
        activeCharacterId={activePartySlot.characterId}
        onClose={() => setShowCharacterPicker(false)}
        onSelect={(characterId) => {
          handleCharacterSelect(activeSlot, characterId);
          setShowCharacterPicker(false);
        }}
      />

      <WeaponPickerModal
        isOpen={showWeaponPicker}
        activeWeaponId={activePartySlot.weaponId}
        options={compatibleWeapons}
        onClose={() => setShowWeaponPicker(false)}
        onSelect={(weaponId) => {
          updatePartySlot(activeSlot, { weaponId, refine: 1 });
          setShowWeaponPicker(false);
        }}
      />

      <UidCharacterPickerModal
        isOpen={showUidModal}
        uid={draft.basicInfo.uid}
        onUidChange={(value) => updateBasicInfo("uid", value)}
        profile={uidProfile}
        selectedCharacterIds={uidSelectedCharacterIds}
        isLoading={uidLoading}
        fetchError={uidError}
        onClose={() => setShowUidModal(false)}
        onFetch={handleFetchUid}
        onSelectCharacter={handleUidSelectCharacter}
        onClearSlot={handleUidClearSlot}
        onApply={handleUidApply}
      />

      <GuidelineModal isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
    </>
  );
}

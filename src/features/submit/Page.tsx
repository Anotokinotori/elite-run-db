import { useEffect, useMemo, useState } from "react";

import { characterDb, weaponDb } from "../../data/mockRuns";
import { fetchEnkaProfile, isValidEnkaUid, normalizeEnkaUidInput, type EnkaProfile, type EnkaProfileCharacter } from "../../lib/enkaNetwork";

import { AUTO_SAVE_DELAY_MS, WEAPON_OPTIONS } from "./config";
import {
  applyUidSelectionToParty,
  buildTimeInputValue,
  clearUidSelectedCharacter,
  getCharacterCostForSlot,
  getDefaultWeaponId,
  getInitialUidSelectedCharacterIds,
  getResolvedUidSelectedCharacterIds,
  getSummaryForParty,
  getWeaponCostForSlot,
  isWeaponCompatible,
  loadInitialDraftState,
  persistDraft,
  selectUidCharacter,
  splitTimeInputValue,
  validateStep1,
  validateStep2,
  validateStep3,
} from "./logic";
import { CharacterPickerModal, GuidelineModal, UidCharacterPickerModal, WeaponPickerModal } from "./modals";
import { FooterActions } from "./sections/FooterActions";
import { Header } from "./sections/Header";
import { StepBasic } from "./sections/StepBasic";
import { StepDetails } from "./sections/StepDetails";
import { StepParty } from "./sections/StepParty";
import type { FieldErrors, SubmitDraft, SubmitPartySlot, SubmitStep } from "./types";
import { StepIndicator, SubmitSurfaceScale } from "./ui";

export function SubmitPage({ onBack, embedded = false }: { onBack: () => void; embedded?: boolean }) {
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
  const compatibleWeaponClass = activeCharacter?.weaponClass ?? null;
  const availablePartyCharacters = useMemo(
    () =>
      draft.party
        .map((slot) => slot.characterId)
        .filter((characterId): characterId is string => Boolean(characterId))
        .filter((characterId, index, allCharacterIds) => allCharacterIds.indexOf(characterId) === index),
    [draft.party],
  );

  useEffect(() => {
    // 入力途中でも復元できるように、draft は短い遅延で自動保存する。
    const timerId = window.setTimeout(() => {
      persistDraft(draft);
    }, AUTO_SAVE_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [draft]);

  useEffect(() => {
    // Step 2 の編成に存在しない attacker は残さず、solo 時は 1 人に正規化する。
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

  const updateNotes = (value: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      details: {
        ...currentDraft.details,
        notes: value,
      },
    }));
  };

  const updateGuidelineAccepted = (checked: boolean) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      details: {
        ...currentDraft.details,
        guidelineAccepted: checked,
      },
    }));
    clearErrors(["details.guidelineAccepted"]);
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
    const nextErrors = step === 1 ? validateStep1(draft) : step === 2 ? validateStep2(draft) : validateStep3(draft);

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
    window.alert("謠仙・縺励∪縺励◆");
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
    const normalizedUid = normalizeEnkaUidInput(uid);

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
        <Header embedded={embedded} onBack={onBack} />

        <SubmitSurfaceScale>
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6">
            <StepIndicator currentStep={draft.currentStep} onBack={handleStepBack} />

            {draft.currentStep === 1 ? (
              <StepBasic
                draft={draft}
                errors={errors}
                timeInput={timeInput}
                updateBasicInfo={updateBasicInfo}
                updateTimeInput={updateTimeInput}
              />
            ) : null}

            {draft.currentStep === 2 ? (
              <StepParty
                activeCharacter={activeCharacter}
                activeCharacterCost={activeCharacterCost}
                activePartySlot={activePartySlot}
                activeSlot={activeSlot}
                activeWeapon={activeWeapon}
                activeWeaponCost={activeWeaponCost}
                draft={draft}
                errors={errors}
                summary={summary}
                uidError={uidError}
                updateBasicInfo={updateBasicInfo}
                updatePartySlot={updatePartySlot}
                handleUidSearchSubmit={handleUidSearchSubmit}
                setUidError={setUidError}
                setActiveSlot={setActiveSlot}
                setShowCharacterPicker={setShowCharacterPicker}
                setShowWeaponPicker={setShowWeaponPicker}
              />
            ) : null}

            {draft.currentStep === 3 ? (
              <StepDetails
                availablePartyCharacters={availablePartyCharacters}
                draft={draft}
                errors={errors}
                onGuidelineAcceptedChange={updateGuidelineAccepted}
                onNotesChange={updateNotes}
                onOpenGuidelines={() => setShowGuidelines(true)}
                onToggleMainAttacker={toggleMainAttacker}
                onToggleTag={toggleTag}
              />
            ) : null}

            <FooterActions
              currentStep={draft.currentStep}
              onSave={handleManualSave}
              onAdvance={handleStepAdvance}
              onSubmit={handleSubmit}
            />
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
        options={WEAPON_OPTIONS}
        compatibleWeaponClass={compatibleWeaponClass}
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

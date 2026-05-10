import { useState } from "react";

import { WEAPON_OPTIONS } from "./config";
import { useSubmitDraft, useSubmitValidation, useUidImport } from "./hooks";
import { CharacterPickerModal, GuidelineModal, UidCharacterPickerModal, WeaponPickerModal } from "./modals";
import { FooterActions } from "./sections/FooterActions";
import { Header } from "./sections/Header";
import { StepBasic } from "./sections/StepBasic";
import { StepDetails } from "./sections/StepDetails";
import { StepParty } from "./sections/StepParty";
import { StepIndicator, SubmitSurfaceScale } from "./ui";

export function SubmitPage({ onBack, embedded = false }: { onBack: () => void; embedded?: boolean }) {
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [showWeaponPicker, setShowWeaponPicker] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const { clearErrors, errors, handleStepAdvance, handleSubmit } = useSubmitValidation();
  const {
    activeCharacter,
    activeCharacterCost,
    activePartySlot,
    activeSlot,
    activeWeapon,
    activeWeaponCost,
    applyUidParty,
    availablePartyCharacters,
    compatibleWeaponClass,
    draft,
    handleCharacterSelect,
    handleStepBack,
    saveDraft,
    setActiveSlot,
    setCurrentStep,
    summary,
    timeInput,
    toggleMainAttacker,
    toggleTag,
    updateBasicInfo,
    updateGuidelineAccepted,
    updateNotes,
    updatePartySlot,
    updateTimeInput,
  } = useSubmitDraft({
    clearErrors,
    onBack,
  });
  const {
    closeUidModal,
    handleFetchUid,
    handleUidApply,
    handleUidClearSlot,
    handleUidSearchSubmit,
    handleUidSelectCharacter,
    setUidError,
    showUidModal,
    uidError,
    uidLoading,
    uidProfile,
    uidSelectedCharacterIds,
  } = useUidImport({
    clearErrors,
  });

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
                handleUidSearchSubmit={(event) => handleUidSearchSubmit(draft.basicInfo.uid, draft.party, event)}
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
              onSave={saveDraft}
              onAdvance={() => handleStepAdvance(draft, setCurrentStep)}
              onSubmit={() =>
                handleSubmit(draft, {
                  onSubmitSuccess: () => {
                    window.alert(
                      "記録申請を受け付けました。\n\nこのサイトはUI/UX検証用プロトタイプのため、実際には送信・保存されません。入力内容はブラウザの下書きとして残ります。",
                    );
                    onBack();
                  },
                  saveDraft,
                  setCurrentStep,
                })
              }
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
        onClose={closeUidModal}
        onFetch={() => handleFetchUid(draft.basicInfo.uid, draft.party)}
        onSelectCharacter={handleUidSelectCharacter}
        onClearSlot={handleUidClearSlot}
        onApply={() => handleUidApply(applyUidParty)}
      />

      <GuidelineModal isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
    </>
  );
}

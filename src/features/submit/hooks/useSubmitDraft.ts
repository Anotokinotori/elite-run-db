import { useEffect, useMemo, useState } from "react";

import { characterDb, weaponDb } from "../../../data/mockRuns";

import { AUTO_SAVE_DELAY_MS } from "../config";
import {
  applyUidSelectionToParty,
  buildTimeInputValue,
  getCharacterCostForSlot,
  getDefaultWeaponId,
  getSummaryForParty,
  getWeaponCostForSlot,
  isWeaponCompatible,
  loadInitialDraftState,
  persistDraft,
  splitTimeInputValue,
} from "../logic";
import type { SubmitDraft, SubmitPartySlot, SubmitStep } from "../types";

export function useSubmitDraft({
  clearErrors,
  onBack,
}: {
  clearErrors: (prefixes: string[]) => void;
  onBack: () => void;
}) {
  const [initialState] = useState(() => loadInitialDraftState());
  const [draft, setDraft] = useState<SubmitDraft>(initialState.draft);
  const [activeSlot, setActiveSlot] = useState(0);

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
    const timerId = window.setTimeout(() => {
      persistDraft(draft);
    }, AUTO_SAVE_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [draft]);

  useEffect(() => {
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

  const setCurrentStep = (step: SubmitStep) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      currentStep: step,
    }));
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

  const handleStepBack = () => {
    if (draft.currentStep === 1) {
      onBack();
      return;
    }

    setCurrentStep(Math.max(1, draft.currentStep - 1) as SubmitStep);
  };

  const saveDraft = () => persistDraft(draft);

  const applyUidParty = (profile: Parameters<typeof applyUidSelectionToParty>[0], selectedCharacterIds: string[]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      party: applyUidSelectionToParty(profile, selectedCharacterIds),
    }));
  };

  return {
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
  };
}

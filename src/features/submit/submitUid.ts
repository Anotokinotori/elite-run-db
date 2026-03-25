import type { EnkaProfile, EnkaProfileCharacter } from "../../lib/enkaNetwork";
import { createEmptyPartySlot } from "./submitConfig";
import { getDefaultWeaponId, isWeaponCompatible } from "./submitParty";
import type { SubmitPartySlot } from "./types";

export function getInitialUidSelectedCharacterIds(party: SubmitPartySlot[]) {
  return party
    .map((slot) => slot.characterId)
    .filter((characterId): characterId is string => Boolean(characterId))
    .slice(0, 4);
}

export function getResolvedUidSelectedCharacterIds(
  currentSelectedIds: string[],
  profile: EnkaProfile,
  party: SubmitPartySlot[],
) {
  if (currentSelectedIds.length > 0) {
    return currentSelectedIds.filter((characterId) => profile.characters.some((character) => character.characterId === characterId));
  }

  return party
    .map((slot) => slot.characterId)
    .filter((characterId): characterId is string => Boolean(characterId))
    .filter((characterId) => profile.characters.some((character) => character.characterId === characterId))
    .slice(0, 4);
}

export function selectUidCharacter(currentSelectedIds: string[], character: EnkaProfileCharacter) {
  const characterId = character.characterId;

  if (!character.supported || !characterId) {
    return currentSelectedIds;
  }

  if (currentSelectedIds.includes(characterId)) {
    return currentSelectedIds;
  }

  if (currentSelectedIds.length >= 4) {
    return currentSelectedIds;
  }

  return [...currentSelectedIds, characterId];
}

export function clearUidSelectedCharacter(currentSelectedIds: string[], index: number) {
  return currentSelectedIds.filter((_, currentIndex) => currentIndex !== index);
}

export function applyUidSelectionToParty(profile: EnkaProfile, selectedCharacterIds: string[]) {
  const selectedCharacters = selectedCharacterIds
    .map((characterId) => profile.characters.find((character) => character.characterId === characterId))
    .filter((character): character is EnkaProfileCharacter => Boolean(character?.characterId))
    .slice(0, 4);

  return Array.from({ length: 4 }, (_, index) => {
    const selectedCharacter = selectedCharacters[index];

    if (!selectedCharacter?.characterId) {
      return createEmptyPartySlot();
    }

    const defaultWeaponId = getDefaultWeaponId(selectedCharacter.characterId);
    const weaponId = selectedCharacter.weaponId && isWeaponCompatible(selectedCharacter.characterId, selectedCharacter.weaponId)
      ? selectedCharacter.weaponId
      : defaultWeaponId;

    return {
      characterId: selectedCharacter.characterId,
      cons: Math.min(6, Math.max(0, selectedCharacter.constellation ?? 0)),
      weaponId,
      refine: Math.min(5, Math.max(1, selectedCharacter.refinement ?? 1)),
    };
  });
}

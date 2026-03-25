import { calcBracket, calcCharCost, calcWeaponCost, characterDb, weaponDb } from "../../../data/mockRuns";
import { DEFAULT_WEAPON_BY_CLASS } from "../submitConfig";
import type { SubmitPartySlot } from "../types";

export function getDefaultWeaponId(characterId: string) {
  const weaponClass = characterDb[characterId]?.weaponClass;

  if (!weaponClass) {
    return "";
  }

  return DEFAULT_WEAPON_BY_CLASS[weaponClass];
}

export function isWeaponCompatible(characterId: string, weaponId: string) {
  if (!characterId || !weaponId) {
    return false;
  }

  const character = characterDb[characterId];
  const weapon = weaponDb[weaponId];

  return Boolean(character && weapon && character.weaponClass === weapon.weaponClass);
}

export function getSummaryForParty(party: SubmitPartySlot[]) {
  const normalizedParty = party.map((slot) => ({
    characterId: slot.characterId,
    cons: slot.cons,
  }));
  const normalizedWeapons = party.map((slot) => ({
    weaponId: slot.weaponId,
    refine: slot.refine,
  }));
  const charCost = calcCharCost(normalizedParty);
  const weaponCost = calcWeaponCost(normalizedWeapons);
  const totalCost = charCost + weaponCost;
  const bracket = calcBracket(charCost, weaponCost);

  return {
    charCost,
    weaponCost,
    totalCost,
    bracket,
  };
}

export function getCharacterCostForSlot(slot: SubmitPartySlot) {
  if (!slot.characterId) {
    return 0;
  }

  return calcCharCost([
    {
      characterId: slot.characterId,
      cons: slot.cons,
    },
  ]);
}

export function getWeaponCostForSlot(slot: SubmitPartySlot) {
  if (!slot.weaponId) {
    return 0;
  }

  return calcWeaponCost([
    {
      weaponId: slot.weaponId,
      refine: slot.refine,
    },
  ]);
}

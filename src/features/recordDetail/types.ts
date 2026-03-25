export type PartyLoadoutEntry = {
  slot: number;
  characterId: string;
  characterName: string;
  cons: number;
  weaponName: string;
  refine: number;
  isMainAttacker: boolean;
};

export type SimilarActionState = Record<string, { liked: boolean; shared: boolean }>;

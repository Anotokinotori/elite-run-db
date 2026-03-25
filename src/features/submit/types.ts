import type { Platform } from "../../data/mockRuns";

export type SubmitStep = 1 | 2 | 3;
export type PlayMode = "solo" | "multiplayer";
export type FieldErrors = Record<string, string>;

export type SubmitPartySlot = {
  characterId: string;
  cons: number;
  weaponId: string;
  refine: number;
};

export type SubmitDraft = {
  version: 1;
  currentStep: SubmitStep;
  basicInfo: {
    ruleset: string;
    playMode: PlayMode;
    primaryPlatform: Platform;
    secondaryPlatform: Platform;
    time: string;
    videoUrl: string;
    uid: string;
  };
  party: SubmitPartySlot[];
  details: {
    mainAttackerIds: string[];
    tagIds: string[];
    notes: string;
    guidelineAccepted: boolean;
  };
};

export type LoadInitialDraftStateResult = {
  draft: SubmitDraft;
  restored: boolean;
};

export type TimeInputParts = {
  hours: string;
  minutes: string;
  seconds: string;
};

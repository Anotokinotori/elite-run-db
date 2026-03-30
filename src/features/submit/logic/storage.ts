import type { LoadInitialDraftStateResult, SubmitDraft } from "../types";
import { DEFAULT_DRAFT, SUBMIT_DRAFT_KEY, createEmptyPartySlot } from "../config";

export function cloneDefaultDraft(): SubmitDraft {
  return {
    ...DEFAULT_DRAFT,
    basicInfo: { ...DEFAULT_DRAFT.basicInfo },
    party: DEFAULT_DRAFT.party.map((slot) => ({ ...slot })),
    details: { ...DEFAULT_DRAFT.details, mainAttackerIds: [], tagIds: [] },
  };
}

export function mergeDraft(raw: unknown): SubmitDraft {
  const base = cloneDefaultDraft();

  if (!raw || typeof raw !== "object") {
    return base;
  }

  const source = raw as Partial<SubmitDraft>;
  const currentStep = source.currentStep;

  return {
    version: 1,
    currentStep: currentStep === 1 || currentStep === 2 || currentStep === 3 ? currentStep : 1,
    basicInfo: {
      ...base.basicInfo,
      ...(source.basicInfo ?? {}),
      playMode: source.basicInfo?.playMode === "multiplayer" ? "multiplayer" : "solo",
    },
    party: Array.isArray(source.party)
      ? Array.from({ length: 4 }, (_, index) => ({
          ...createEmptyPartySlot(),
          ...(source.party?.[index] ?? {}),
        }))
      : base.party,
    details: {
      ...base.details,
      ...(source.details ?? {}),
      mainAttackerIds: Array.isArray(source.details?.mainAttackerIds) ? source.details.mainAttackerIds : [],
      tagIds: Array.isArray(source.details?.tagIds) ? source.details.tagIds : [],
    },
  };
}

export function loadInitialDraftState(): LoadInitialDraftStateResult {
  if (typeof window === "undefined") {
    return {
      draft: cloneDefaultDraft(),
      restored: false,
    };
  }

  try {
    const raw = window.localStorage.getItem(SUBMIT_DRAFT_KEY);

    if (!raw) {
      return {
        draft: cloneDefaultDraft(),
        restored: false,
      };
    }

    return {
      draft: {
        ...mergeDraft(JSON.parse(raw)),
        currentStep: 1,
      },
      restored: true,
    };
  } catch {
    return {
      draft: cloneDefaultDraft(),
      restored: false,
    };
  }
}

export function persistDraft(draft: SubmitDraft) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(SUBMIT_DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}
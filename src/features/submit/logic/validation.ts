import { isYouTubeUrl } from "../../../lib/youtube";
import { isWeaponCompatible } from "./party";
import { parseTimeToSeconds } from "./time";
import type { FieldErrors, SubmitDraft } from "../types";

export function validateStep1(draft: SubmitDraft): FieldErrors {
  const errors: FieldErrors = {};

  if (!draft.basicInfo.ruleset) {
    errors["basicInfo.ruleset"] = "カテゴリを選択してください。";
  }

  if (!draft.basicInfo.time.trim()) {
    errors["basicInfo.time"] = "記録タイムを入力してください。";
  } else if (parseTimeToSeconds(draft.basicInfo.time) === null) {
    errors["basicInfo.time"] = "MM:SS または HH:MM:SS 形式で入力してください。";
  }

  if (!draft.basicInfo.videoUrl.trim()) {
    errors["basicInfo.videoUrl"] = "YouTube URL を入力してください。";
  } else if (!isYouTubeUrl(draft.basicInfo.videoUrl)) {
    errors["basicInfo.videoUrl"] = "YouTube URL のみ受け付けています。";
  }

  if (draft.basicInfo.playMode === "multiplayer" && !draft.basicInfo.secondaryPlatform) {
    errors["basicInfo.secondaryPlatform"] = "マルチ時の2人目プラットフォームを選択してください。";
  }

  return errors;
}

export function validateStep2(draft: SubmitDraft): FieldErrors {
  const errors: FieldErrors = {};

  draft.party.forEach((slot, index) => {
    const baseKey = `party.${index}`;

    if (!slot.characterId) {
      errors[`${baseKey}.characterId`] = `#${index + 1} のキャラクターを選択してください。`;
    }

    if (!slot.weaponId) {
      errors[`${baseKey}.weaponId`] = `#${index + 1} の武器を選択してください。`;
    } else if (!isWeaponCompatible(slot.characterId, slot.weaponId)) {
      errors[`${baseKey}.weaponId`] = "選択中のキャラクターと装備できる武器を合わせてください。";
    }
  });

  return errors;
}

export function validateStep3(draft: SubmitDraft): FieldErrors {
  if (!draft.details.guidelineAccepted) {
    return {
      "details.guidelineAccepted": "提出前にガイドラインへの同意が必要です。",
    };
  }

  return {};
}
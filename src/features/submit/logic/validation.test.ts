import { describe, expect, it } from "vitest";

import type { Platform } from "../../../data/mockRuns";

import { cloneDefaultDraft } from "./storage";
import { validateStep1, validateStep2, validateStep3 } from "./validation";

describe("submit validation", () => {
  it("validates required and formatted Step 1 fields", () => {
    const draft = cloneDefaultDraft();

    expect(validateStep1(draft)).toEqual({
      "basicInfo.time": "記録タイムを入力してください。",
      "basicInfo.videoUrl": "YouTube URL を入力してください。",
    });

    draft.basicInfo.time = "12";
    draft.basicInfo.videoUrl = "https://example.com/video";
    draft.basicInfo.playMode = "multiplayer";
    draft.basicInfo.secondaryPlatform = "" as Platform;

    expect(validateStep1(draft)).toEqual({
      "basicInfo.time": "MM:SS または HH:MM:SS 形式で入力してください。",
      "basicInfo.videoUrl": "YouTube URL のみ受け付けています。",
      "basicInfo.secondaryPlatform": "マルチ時の2人目プラットフォームを選択してください。",
    });
  });

  it("validates character and weapon selection in Step 2", () => {
    const draft = cloneDefaultDraft();

    expect(validateStep2(draft)).toEqual({
      "party.0.characterId": "#1 のキャラクターを選択してください。",
      "party.0.weaponId": "#1 の武器を選択してください。",
      "party.1.characterId": "#2 のキャラクターを選択してください。",
      "party.1.weaponId": "#2 の武器を選択してください。",
      "party.2.characterId": "#3 のキャラクターを選択してください。",
      "party.2.weaponId": "#3 の武器を選択してください。",
      "party.3.characterId": "#4 のキャラクターを選択してください。",
      "party.3.weaponId": "#4 の武器を選択してください。",
    });

    draft.party[0] = {
      characterId: "diluc",
      cons: 0,
      weaponId: "sacrificialSword",
      refine: 1,
    };

    expect(validateStep2(draft)).toMatchObject({
      "party.0.weaponId": "選択中のキャラクターと装備できる武器を合わせてください。",
    });
  });

  it("requires guideline agreement in Step 3", () => {
    const draft = cloneDefaultDraft();

    expect(validateStep3(draft)).toEqual({
      "details.guidelineAccepted": "提出前にガイドラインへの同意が必要です。",
    });

    draft.details.guidelineAccepted = true;
    expect(validateStep3(draft)).toEqual({});
  });
});

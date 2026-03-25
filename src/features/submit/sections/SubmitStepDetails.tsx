import { characterDb } from "../../../data/mockRuns";
import { CharacterIcon } from "../../../components/CharacterIcon";

import { SEARCH_TAG_OPTIONS } from "../submitConfig";
import type { FieldErrors, SubmitDraft } from "../types";
import { AttackerSelectionIndicator, FieldError, FieldTitle, SectionDivider, StepHeroHeader } from "../ui/submitUi";

type SubmitStepDetailsProps = {
  availablePartyCharacters: string[];
  draft: SubmitDraft;
  errors: FieldErrors;
  onGuidelineAcceptedChange: (checked: boolean) => void;
  onNotesChange: (value: string) => void;
  onOpenGuidelines: () => void;
  onToggleMainAttacker: (characterId: string) => void;
  onToggleTag: (tag: string) => void;
};

export function SubmitStepDetails({
  availablePartyCharacters,
  draft,
  errors,
  onGuidelineAcceptedChange,
  onNotesChange,
  onOpenGuidelines,
  onToggleMainAttacker,
  onToggleTag,
}: SubmitStepDetailsProps) {
  const toggleMainAttacker = onToggleMainAttacker;

  return (
<section className="mx-auto flex w-full max-w-[980px] flex-col gap-8">
              <StepHeroHeader title="3.詳細情報・ガイドライン" description="検索で見つけてもらいやすくするための項目です。" />

              <div className="flex flex-col gap-[44px]">
                <div className="flex flex-col gap-8">
                  <SectionDivider label="詳細情報  (任意)" />

                  <div className="flex flex-col gap-[44px]">
                    <div className="flex flex-col gap-4">
                      <FieldTitle quiet>メインアタッカーを選択 (一番与ダメージが高いものを選択)</FieldTitle>
                      <div className="flex flex-col gap-4">
                        {availablePartyCharacters.length > 0 ? (
                          availablePartyCharacters.map((characterId) => {
                            const character = characterDb[characterId];
                            const isSelected = draft.details.mainAttackerIds.includes(characterId);
                            const isMultiSelect = draft.basicInfo.playMode === "multiplayer";

                            return (
                              <button
                                key={`attacker-${characterId}`}
                                type="button"
                                onClick={() => toggleMainAttacker(characterId)}
                                role={isMultiSelect ? "checkbox" : "radio"}
                                aria-checked={isSelected}
                                className={`flex items-center gap-8 rounded-[8px] bg-[#f6f6f6] px-4 py-4 text-left ${
                                  isSelected ? "ring-2 ring-[#333333]" : ""
                                }`}
                              >
                                <AttackerSelectionIndicator selected={isSelected} multiSelect={isMultiSelect} />
                                <div className="flex items-center gap-3 text-[20px] text-[#9999b1] md:text-[24px]">
                                  <CharacterIcon characterId={characterId} alt={character.name} fallbackLabel={character.name} size={36} />
                                  <span>{character.name}</span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="rounded-[8px] bg-[#f6f6f6] px-4 py-4 text-[16px] text-[#9999b1]">
                            Step 2 で編成を入力すると、ここで候補を選択できます。
                          </div>
                        )}
                      </div>
                      <div className="text-[13px] leading-[1.7] text-[#7b7b8d]">
                        {draft.basicInfo.playMode === "multiplayer"
                          ? "マルチ時は複数選択できます。通常時は単一選択です。"
                          : "通常時は単一選択です。未選択でも申請できます。"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <FieldTitle quiet>検索用タグ</FieldTitle>
                      <div className="flex flex-wrap gap-4 md:gap-6">
                        {SEARCH_TAG_OPTIONS.map((tag) => {
                          const isSelected = draft.details.tagIds.includes(tag);

                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => onToggleTag(tag)}
                              className={`rounded-[42px] px-4 py-3 text-[18px] md:text-[24px] ${
                                isSelected ? "bg-[#333333] text-white" : "bg-[#f2f2f2] text-[#9999b1]"
                              }`}
                            >
                              #{tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="block">
                      <FieldTitle quiet>コメント・概要</FieldTitle>
                      <textarea
                        value={draft.details.notes}
                        onChange={(event) => onNotesChange(event.target.value)}
                        placeholder="この記録でのコメントをどうぞ！"
                        className="mt-2 min-h-[223px] w-full rounded-[8px] bg-[#f6f6f6] px-4 py-4 text-[18px] text-black outline-none placeholder:text-[#c2c2c2] md:text-[24px]"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <SectionDivider label="申請するにあたって" />

                  <div className="flex flex-col gap-2">
                    <FieldTitle quiet>ガイドライン</FieldTitle>
                    <label className="rounded-[8px] bg-[#f6f6f6] px-4 py-4">
                      <div className="flex items-center gap-8">
                        <input
                          type="checkbox"
                          checked={draft.details.guidelineAccepted}
                          onChange={(event) => onGuidelineAcceptedChange(event.target.checked)}
                          className="h-5 w-5"
                        />
                        <span className="text-[18px] font-bold text-[#333333] md:text-[24px]">ガイドラインに同意する</span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={onOpenGuidelines}
                      className="text-center text-[18px] text-[#4d49fc] md:text-[24px]"
                    >
                      ガイドラインを確認
                    </button>
                    <div className="text-[13px] leading-[1.7] text-[#7b7b8d]">同意は submit 時のみ必須です。下書き保存では不要です。</div>
                    <FieldError message={errors["details.guidelineAccepted"]} />
                  </div>
                </div>
              </div>
              </section>
  );
}

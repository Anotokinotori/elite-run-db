import { PLATFORM_OPTIONS, RULESET_OPTIONS } from "../submitConfig";
import type { FieldErrors, PlayMode, SubmitDraft, TimeInputParts } from "../types";
import { FieldError, FieldTitle, MockChoiceButton, MockFieldBox, PlatformChoiceContent, SectionDivider, StepHeroHeader } from "../ui/submitUi";

type SubmitStepBasicProps = {
  draft: SubmitDraft;
  errors: FieldErrors;
  timeInput: TimeInputParts;
  updateBasicInfo: <Key extends keyof SubmitDraft["basicInfo"]>(key: Key, value: SubmitDraft["basicInfo"][Key]) => void;
  updateTimeInput: (part: keyof TimeInputParts, value: string) => void;
};

export function SubmitStepBasic({ draft, errors, timeInput, updateBasicInfo, updateTimeInput }: SubmitStepBasicProps) {
  return (
<section className="mx-auto flex w-full max-w-[980px] flex-col gap-8">
              <StepHeroHeader
                title="1.基本情報の入力"
                description="記録申請に必要な情報を入力して下さい。※この項目は必須項目です。"
              />
              <SectionDivider label="基本情報" />

              <div className="flex flex-col gap-[44px]">
                <label className="block">
                  <FieldTitle quiet>カテゴリ</FieldTitle>
                  <MockFieldBox className="mt-2">
                    <select
                      value={draft.basicInfo.ruleset}
                      onChange={(event) => updateBasicInfo("ruleset", event.target.value)}
                      className="w-full bg-transparent text-[20px] text-black outline-none md:text-[24px]"
                    >
                      {RULESET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </MockFieldBox>
                  <FieldError message={errors["basicInfo.ruleset"]} />
                </label>

                <label className="block">
                  <FieldTitle quiet>動画URL</FieldTitle>
                  <MockFieldBox className="mt-2">
                    <input
                      value={draft.basicInfo.videoUrl}
                      onChange={(event) => updateBasicInfo("videoUrl", event.target.value)}
                      placeholder="例) https://www.youtube.com/watch?v="
                      className="w-full bg-transparent text-[18px] text-black outline-none md:text-[24px]"
                    />
                  </MockFieldBox>
                  <div className="mt-2 text-[13px] text-[#9999b1]">(記録に対応するYouTubeのリンクを入力)</div>
                  <FieldError message={errors["basicInfo.videoUrl"]} />
                </label>

                <label className="block">
                  <FieldTitle quiet>タイム</FieldTitle>
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 md:gap-3 md:px-8">
                    <MockFieldBox className="min-w-0">
                      <input
                        value={timeInput.hours}
                        onChange={(event) => updateTimeInput("hours", event.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        inputMode="numeric"
                        placeholder="00"
                        className="w-full bg-transparent text-center text-[20px] text-black outline-none md:text-[24px]"
                        aria-label="時間"
                      />
                    </MockFieldBox>
                    <span className="text-[24px] font-bold text-[#9999b1] md:text-[28px]">:</span>
                    <MockFieldBox className="min-w-0">
                      <input
                        value={timeInput.minutes}
                        onChange={(event) => updateTimeInput("minutes", event.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        inputMode="numeric"
                        placeholder="00"
                        className="w-full bg-transparent text-center text-[20px] text-black outline-none md:text-[24px]"
                        aria-label="分"
                      />
                    </MockFieldBox>
                    <span className="text-[24px] font-bold text-[#9999b1] md:text-[28px]">:</span>
                    <MockFieldBox className="min-w-0">
                      <input
                        value={timeInput.seconds}
                        onChange={(event) => updateTimeInput("seconds", event.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        inputMode="numeric"
                        placeholder="00"
                        className="w-full bg-transparent text-center text-[20px] text-black outline-none md:text-[24px]"
                        aria-label="秒"
                      />
                    </MockFieldBox>
                  </div>
                  <FieldError message={errors["basicInfo.time"]} />
                </label>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <div className="text-[15px] font-bold text-[#9999b1] md:text-[18px]">プレイ人数</div>
                    <div className="grid gap-3 md:grid-cols-2 md:px-8">
                      {[
                        { value: "solo", label: "Solo" },
                        { value: "multiplayer", label: "Multiplayer" },
                      ].map((option) => (
                        <MockChoiceButton
                          key={option.value}
                          active={draft.basicInfo.playMode === option.value}
                          onClick={() => updateBasicInfo("playMode", option.value as PlayMode)}
                          className="w-full"
                        >
                          {option.label}
                        </MockChoiceButton>
                      ))}
                    </div>
                  </div>

                  <div className="block">
                    <FieldTitle quiet>プレイしているプラットフォーム</FieldTitle>
                    <div className="mt-4 grid gap-3 md:grid-cols-3 md:px-8">
                      {PLATFORM_OPTIONS.map((option) => (
                        <MockChoiceButton
                          key={option}
                          active={draft.basicInfo.primaryPlatform === option}
                          onClick={() => updateBasicInfo("primaryPlatform", option)}
                          className="w-full"
                        >
                          <PlatformChoiceContent platform={option} />
                        </MockChoiceButton>
                      ))}
                    </div>
                  </div>

                  {draft.basicInfo.playMode === "multiplayer" ? (
                    <div className="block">
                      <FieldTitle quiet>2人目のプラットフォーム</FieldTitle>
                      <div className="mt-4 grid gap-3 md:grid-cols-3 md:px-8">
                        {PLATFORM_OPTIONS.map((option) => (
                          <MockChoiceButton
                            key={`secondary-${option}`}
                            active={draft.basicInfo.secondaryPlatform === option}
                            onClick={() => updateBasicInfo("secondaryPlatform", option)}
                            className="w-full"
                          >
                            <PlatformChoiceContent platform={option} />
                          </MockChoiceButton>
                        ))}
                      </div>
                      <FieldError message={errors["basicInfo.secondaryPlatform"]} />
                    </div>
                  ) : null}
                </div>

                <div className="h-px w-full bg-[#d9d9d9]" />
              </div>
              </section>
  );
}

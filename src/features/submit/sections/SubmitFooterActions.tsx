import type { SubmitStep } from "../types";
import { BottomActionButtons } from "../ui/submitUi";

export function SubmitFooterActions({
  currentStep,
  onAdvance,
  onSave,
  onSubmit,
}: {
  currentStep: SubmitStep;
  onAdvance: () => void;
  onSave: () => void;
  onSubmit: () => void;
}) {
  return (
<div className="mt-8 flex flex-col gap-4">
              <BottomActionButtons
                currentStep={currentStep}
                onSave={onSave}
                onAdvance={onAdvance}
                onSubmit={onSubmit}
              />
              <div className="mx-auto w-full max-w-[500px] text-center text-[13px] leading-[1.7] text-[#7b7b8d]">
                下書きはブラウザに保持され、ダミー submit 後も自動では消しません。
              </div>
            </div>
  );
}

import { useState } from "react";

import { validateStep1, validateStep2, validateStep3 } from "../logic";
import type { FieldErrors, SubmitDraft, SubmitStep } from "../types";

function getStepErrors(step: SubmitStep, draft: SubmitDraft) {
  if (step === 1) {
    return validateStep1(draft);
  }

  if (step === 2) {
    return validateStep2(draft);
  }

  return validateStep3(draft);
}

export function useSubmitValidation() {
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearErrors = (prefixes: string[]) => {
    setErrors((currentErrors) =>
      Object.fromEntries(
        Object.entries(currentErrors).filter(([key]) => !prefixes.some((prefix) => key.startsWith(prefix))),
      ),
    );
  };

  const validateCurrentStep = (draft: SubmitDraft) => {
    const nextErrors = getStepErrors(draft.currentStep, draft);

    setErrors((currentErrors) => ({ ...currentErrors, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleStepAdvance = (draft: SubmitDraft, setCurrentStep: (step: SubmitStep) => void) => {
    if (!validateCurrentStep(draft)) {
      return;
    }

    setCurrentStep(Math.min(3, draft.currentStep + 1) as SubmitStep);
  };

  const handleSubmit = (
    draft: SubmitDraft,
    {
      onSubmitSuccess,
      saveDraft,
      setCurrentStep,
    }: {
      onSubmitSuccess: () => void;
      saveDraft: () => void;
      setCurrentStep: (step: SubmitStep) => void;
    },
  ) => {
    const nextErrors = {
      ...validateStep1(draft),
      ...validateStep2(draft),
      ...validateStep3(draft),
    };

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors["basicInfo.videoUrl"] || nextErrors["basicInfo.time"]) {
        setCurrentStep(1);
      } else if (Object.keys(nextErrors).some((key) => key.startsWith("party."))) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }

      return;
    }

    saveDraft();
    onSubmitSuccess();
  };

  return {
    clearErrors,
    errors,
    handleStepAdvance,
    handleSubmit,
    validateCurrentStep,
  };
}

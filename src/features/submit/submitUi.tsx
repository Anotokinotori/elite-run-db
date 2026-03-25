import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

import type { Bracket, Platform } from "../../data/mockRuns";
import { PlatformIcon } from "../../components/UiIcons";
import { BRACKET_META, SUBMIT_SURFACE_SCALE } from "./submitConfig";
import type { SubmitStep } from "./types";

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-[13px] leading-[1.5] text-[#d24b5a]">{message}</p>;
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#ebebeb] pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-[24px] font-bold text-black md:text-[30px]">{title}</h2>
        {description ? <p className="mt-2 text-[14px] text-[#7b7b8d] md:text-[15px]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SearchActionIcon() {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center text-current">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="4.75" />
        <path d="M14.25 14.25L18.5 18.5" />
      </svg>
    </span>
  );
}

export function PlatformChoiceContent({ platform }: { platform: Platform }) {
  return (
    <>
      <PlatformIcon platform={platform} className="h-5 w-5 md:h-6 md:w-6" />
      <span>{platform}</span>
    </>
  );
}

export function StepIndicator({ currentStep, onBack }: { currentStep: SubmitStep; onBack: () => void }) {
  const steps = [
    { step: 1, label: "基本情報" },
    { step: 2, label: "編成情報" },
    { step: 3, label: "詳細情報" },
  ] as const;

  return (
    <div className="mx-auto grid w-full max-w-[980px] items-start gap-4 px-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-0">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 self-center rounded-full px-2 py-2 text-[16px] font-medium text-[#666666] transition hover:text-black md:justify-self-start"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5L8 12L15 19" />
        </svg>
        <span>戻る</span>
      </button>

      <div className="flex w-full max-w-[664px] flex-col gap-4 justify-self-center">
        <div className="grid grid-cols-[64px_minmax(0,1fr)_64px_minmax(0,1fr)_64px] items-center">
          {steps.flatMap((entry, index) => {
            const active = currentStep >= entry.step;

            return [
              <div
                key={`step-no-${entry.step}`}
                className={`text-center text-[28px] font-bold md:text-[32px] ${active ? "text-black" : "text-[#d9d9d9]"}`}
              >
                {String(entry.step).padStart(2, "0")}
              </div>,
              index < steps.length - 1 ? <div key={`step-no-spacer-${entry.step}`} /> : null,
            ];
          })}
        </div>

        <div className="grid grid-cols-[64px_minmax(0,1fr)_64px_minmax(0,1fr)_64px] items-center">
          {steps.flatMap((entry, index) => {
            const active = currentStep >= entry.step;
            const current = currentStep === entry.step;

            return [
              <div key={`step-circle-${entry.step}`} className="grid place-items-center">
                <div className={`h-16 w-16 rounded-full ${current ? "bg-[#0f1419]" : active ? "bg-[#333333]" : "bg-[#d9d9d9]"}`} />
              </div>,
              index < steps.length - 1 ? <div key={`step-line-${entry.step}`} className="h-1 w-full bg-[#d9d9d9]" /> : null,
            ];
          })}
        </div>

        <div className="grid grid-cols-[64px_minmax(0,1fr)_64px_minmax(0,1fr)_64px] items-center text-[14px] md:text-[16px]">
          {steps.flatMap((entry, index) => {
            const active = currentStep >= entry.step;

            return [
              <div key={`step-label-${entry.step}`} className={`text-center ${active ? "text-black" : "text-[#d9d9d9]"}`}>
                {entry.label}
              </div>,
              index < steps.length - 1 ? <div key={`step-label-spacer-${entry.step}`} /> : null,
            ];
          })}
        </div>
      </div>

      <div className="hidden md:block md:w-[70px]" aria-hidden="true" />
    </div>
  );
}

export function SubmitSurfaceScale({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = contentRef.current;

    if (!node) {
      return;
    }

    const updateHeight = () => {
      setScaledHeight(node.offsetHeight * SUBMIT_SURFACE_SCALE);
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full" style={scaledHeight ? { height: scaledHeight } : undefined}>
      <div ref={contentRef} style={{ transform: `scale(${SUBMIT_SURFACE_SCALE})`, transformOrigin: "top center" }}>
        {children}
      </div>
    </div>
  );
}

export function EmptyCharacterBadge({ label }: { label: string }) {
  return (
    <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#f2f2f2] text-[24px] font-medium text-[#b2b2c0]">
      {label}
    </div>
  );
}

export function BracketBadge({ bracket }: { bracket: Bracket }) {
  const meta = BRACKET_META[bracket];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${meta.accent} ${meta.text}`}>
      {meta.label}
    </span>
  );
}

export function AttackerSelectionIndicator({
  selected,
  multiSelect,
}: {
  selected: boolean;
  multiSelect: boolean;
}) {
  if (multiSelect) {
    return (
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border-2 transition md:h-8 md:w-8 ${
          selected ? "border-[#333333] bg-[#333333] text-white" : "border-[#9999b1] bg-white text-transparent"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5L9.5 17L19 7.5" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`grid h-7 w-7 place-items-center rounded-full border-2 transition md:h-8 md:w-8 ${
        selected ? "border-[#333333]" : "border-[#9999b1]"
      }`}
      aria-hidden="true"
    >
      <span className={`h-3 w-3 rounded-full transition md:h-3.5 md:w-3.5 ${selected ? "bg-[#333333]" : "bg-transparent"}`} />
    </span>
  );
}

export function StepHeroHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[28px] font-bold text-black md:text-[32px]">{title}</h2>
      <p className="text-[16px] leading-[1.8] text-[#9999b1] md:text-[20px]">{description}</p>
    </div>
  );
}

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 border-b border-[#d9d9d9]" />
      <div className="relative inline-flex bg-white pr-4 text-[22px] font-bold text-black md:text-[24px]">{label}</div>
    </div>
  );
}

export function FieldTitle({ children, quiet = false }: { children: ReactNode; quiet?: boolean }) {
  return (
    <div className={`text-[20px] font-bold md:text-[24px] ${quiet ? "text-[#9999b1]" : "text-black"}`}>{children}</div>
  );
}

export function MockFieldBox({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return <div className={`rounded-[8px] bg-[#f6f6f6] ${padded ? "px-4 py-4 md:px-5 md:py-4" : ""} ${className}`}>{children}</div>;
}

export function MockChoiceButton({
  active,
  children,
  onClick,
  className = "",
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-3 rounded-[42px] px-5 py-4 text-[18px] transition md:text-[24px] ${
        active ? "bg-[#333333] text-white" : "bg-[#f2f2f2] text-[#9999b1]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function BottomActionButtons({
  currentStep,
  onSave,
  onAdvance,
  onSubmit,
}: {
  currentStep: SubmitStep;
  onSave: () => void;
  onAdvance: () => void;
  onSubmit: () => void;
}) {
  const primaryLabel = currentStep < 3 ? "次へ" : "記録申請";

  return (
    <div className="mx-auto flex w-full max-w-[500px] flex-col gap-4">
      {currentStep === 3 ? (
        <div className="flex flex-col gap-4 md:flex-row">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex w-fit items-center justify-center self-start whitespace-nowrap rounded-[8px] border border-[#333333] bg-white px-6 py-4 text-[18px] font-medium text-black md:text-[24px]"
          >
            下書きで保存
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="w-full rounded-[8px] bg-[#333333] px-6 py-4 text-[20px] font-medium text-white md:flex-1 md:text-[24px]"
          >
            {primaryLabel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onAdvance}
          className="w-full rounded-[8px] bg-[#333333] px-6 py-4 text-[20px] font-medium text-white md:text-[24px]"
        >
          {primaryLabel}
        </button>
      )}
    </div>
  );
}

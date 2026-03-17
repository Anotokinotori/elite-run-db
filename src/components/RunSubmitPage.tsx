import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  type Bracket,
  type Platform,
  type WeaponClass,
  calcBracket,
  calcCharCost,
  calcWeaponCost,
  characterDb,
  weaponDb,
} from "../data/mockRuns";
import { fetchEnkaProfile, isValidEnkaUid, type EnkaProfile, type EnkaProfileCharacter } from "../lib/enkaNetwork";
import { isYouTubeUrl } from "../lib/youtube";
import { CharacterIcon } from "./CharacterIcon";
import { PlatformIcon } from "./UiIcons";

const SUBMIT_DRAFT_KEY = "elite-run-db.submitDraft.v1";
const AUTO_SAVE_DELAY_MS = 500;
const SUBMIT_SURFACE_SCALE = 0.6;
const CHARACTER_OPTIONS = Object.values(characterDb);
const WEAPON_OPTIONS = Object.values(weaponDb);
const RULESET_OPTIONS = ["NPUI", "PUI", "PUA", "Npui飯", "淵下宮", "マルチNpui", "マルチPui", "マルチPUA"];
const PLATFORM_OPTIONS: Platform[] = ["PC", "PS5", "Mobile"];
const SEARCH_TAG_OPTIONS = [
  "高難度",
  "祭典",
  "安定寄り",
  "高速処理",
  "短期決戦",
  "炎共鳴",
  "Natlan",
  "Budget",
  "OffMeta",
];
const ELEMENT_FILTER_OPTIONS = [
  { key: "all", label: "全て" },
  { key: "pyro", label: "炎" },
  { key: "hydro", label: "水" },
  { key: "electro", label: "雷" },
  { key: "cryo", label: "氷" },
  { key: "anemo", label: "風" },
  { key: "geo", label: "岩" },
  { key: "dendro", label: "草" },
] as const;
const DEFAULT_WEAPON_BY_CLASS: Record<WeaponClass, string> = {
  sword: "sacrificialSword",
  claymore: "serpentSpine",
  polearm: "theCatch",
  bow: "stringless",
  catalyst: "sacrificialFragments",
};
const BRACKET_META: Record<Bracket, { label: string; accent: string; text: string }> = {
  1: { label: "Low", accent: "bg-[#daf2dd]", text: "text-[#2c7b42]" },
  2: { label: "Middle", accent: "bg-[#e4edff]", text: "text-[#335da6]" },
  3: { label: "High", accent: "bg-[#efe6ff]", text: "text-[#6b3faf]" },
  4: { label: "Unlimited", accent: "bg-[#ffe9db]", text: "text-[#b6611e]" },
};

type SubmitStep = 1 | 2 | 3;
type PlayMode = "solo" | "multiplayer";
type FieldErrors = Record<string, string>;

type SubmitPartySlot = {
  characterId: string;
  cons: number;
  weaponId: string;
  refine: number;
};

type SubmitDraft = {
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

function createEmptyPartySlot(): SubmitPartySlot {
  return {
    characterId: "",
    cons: 0,
    weaponId: "",
    refine: 1,
  };
}

const DEFAULT_DRAFT: SubmitDraft = {
  version: 1,
  currentStep: 1,
  basicInfo: {
    ruleset: RULESET_OPTIONS[0] ?? "NPUI",
    playMode: "solo",
    primaryPlatform: "PC",
    secondaryPlatform: "PC",
    time: "",
    videoUrl: "",
    uid: "",
  },
  party: Array.from({ length: 4 }, () => createEmptyPartySlot()),
  details: {
    mainAttackerIds: [],
    tagIds: [],
    notes: "",
    guidelineAccepted: false,
  },
};

function cloneDefaultDraft(): SubmitDraft {
  return {
    ...DEFAULT_DRAFT,
    basicInfo: { ...DEFAULT_DRAFT.basicInfo },
    party: DEFAULT_DRAFT.party.map((slot) => ({ ...slot })),
    details: { ...DEFAULT_DRAFT.details, mainAttackerIds: [], tagIds: [] },
  };
}

function mergeDraft(raw: unknown): SubmitDraft {
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

function loadInitialDraftState() {
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
        currentStep: 1 as SubmitStep,
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

function persistDraft(draft: SubmitDraft) {
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

function getDefaultWeaponId(characterId: string) {
  const weaponClass = characterDb[characterId]?.weaponClass;

  if (!weaponClass) {
    return "";
  }

  return DEFAULT_WEAPON_BY_CLASS[weaponClass];
}

function isWeaponCompatible(characterId: string, weaponId: string) {
  if (!characterId || !weaponId) {
    return false;
  }

  const character = characterDb[characterId];
  const weapon = weaponDb[weaponId];

  return Boolean(character && weapon && character.weaponClass === weapon.weaponClass);
}

function parseTimeToSeconds(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(":").map((part) => Number(part));

  if (parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;

    if (seconds < 0 || seconds >= 60) {
      return null;
    }

    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;

    if (minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
      return null;
    }

    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
}

function splitTimeInputValue(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return {
      hours: "",
      minutes: "",
      seconds: "",
    };
  }

  const parts = normalized.split(":").map((part) => part.replace(/[^\d]/g, "").slice(0, 2));

  if (parts.length === 3) {
    return {
      hours: parts[0] ?? "",
      minutes: parts[1] ?? "",
      seconds: parts[2] ?? "",
    };
  }

  if (parts.length === 2) {
    return {
      hours: "",
      minutes: parts[0] ?? "",
      seconds: parts[1] ?? "",
    };
  }

  return {
    hours: "",
    minutes: parts[0] ?? "",
    seconds: "",
  };
}

function buildTimeInputValue(parts: { hours: string; minutes: string; seconds: string }) {
  const hours = parts.hours.replace(/[^\d]/g, "").slice(0, 2);
  const minutes = parts.minutes.replace(/[^\d]/g, "").slice(0, 2);
  const seconds = parts.seconds.replace(/[^\d]/g, "").slice(0, 2);

  if (!hours && !minutes && !seconds) {
    return "";
  }

  if (hours) {
    return `${hours}:${minutes || "0"}:${seconds || "0"}`;
  }

  return `${minutes || "0"}:${seconds || "0"}`;
}

function getSummaryForParty(party: SubmitPartySlot[]) {
  const normalizedParty = party.map((slot) => ({
    characterId: slot.characterId,
    cons: slot.cons,
  }));
  const normalizedWeapons = party.map((slot) => ({
    weaponId: slot.weaponId,
    refine: slot.refine,
  }));
  const charCost = calcCharCost(normalizedParty);
  const weaponCost = calcWeaponCost(normalizedWeapons);
  const totalCost = charCost + weaponCost;
  const bracket = calcBracket(charCost, weaponCost);

  return {
    charCost,
    weaponCost,
    totalCost,
    bracket,
  };
}

function getCharacterCostForSlot(slot: SubmitPartySlot) {
  if (!slot.characterId) {
    return 0;
  }

  return calcCharCost([
    {
      characterId: slot.characterId,
      cons: slot.cons,
    },
  ]);
}

function getWeaponCostForSlot(slot: SubmitPartySlot) {
  if (!slot.weaponId) {
    return 0;
  }

  return calcWeaponCost([
    {
      weaponId: slot.weaponId,
      refine: slot.refine,
    },
  ]);
}

function validateStep1(draft: SubmitDraft): FieldErrors {
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

function validateStep2(draft: SubmitDraft): FieldErrors {
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

function validateStep3(draft: SubmitDraft): FieldErrors {
  if (!draft.details.guidelineAccepted) {
    return {
      "details.guidelineAccepted": "提出前にガイドラインへの同意が必要です。",
    };
  }

  return {};
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-[13px] leading-[1.5] text-[#d24b5a]">{message}</p>;
}

function SectionTitle({
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

function SearchActionIcon() {
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

function PlatformChoiceContent({ platform }: { platform: Platform }) {
  return (
    <>
      <PlatformIcon platform={platform} className="h-5 w-5 md:h-6 md:w-6" />
      <span>{platform}</span>
    </>
  );
}

function StepIndicator({ currentStep, onBack }: { currentStep: SubmitStep; onBack: () => void }) {
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

function SubmitSurfaceScale({ children }: { children: ReactNode }) {
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

function EmptyCharacterBadge({ label }: { label: string }) {
  return (
    <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#f2f2f2] text-[24px] font-medium text-[#b2b2c0]">
      {label}
    </div>
  );
}

function BracketBadge({ bracket }: { bracket: Bracket }) {
  const meta = BRACKET_META[bracket];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${meta.accent} ${meta.text}`}>
      {meta.label}
    </span>
  );
}

function AttackerSelectionIndicator({
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

function CharacterPickerModal({
  isOpen,
  activeCharacterId,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  activeCharacterId: string;
  onClose: () => void;
  onSelect: (characterId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [elementFilter, setElementFilter] = useState<(typeof ELEMENT_FILTER_OPTIONS)[number]["key"]>("all");
  const filteredCharacters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return CHARACTER_OPTIONS.filter((character) => {
      const matchesElement = elementFilter === "all" || character.element === elementFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        character.name.toLowerCase().includes(normalizedQuery) ||
        character.id.toLowerCase().includes(normalizedQuery);

      return matchesElement && matchesQuery;
    });
  }, [elementFilter, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery("");
    setElementFilter("all");
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className="flex h-[720px] max-h-[calc(100vh-48px)] w-full max-w-[760px] flex-col rounded-[24px] border border-[#ebebeb] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.16)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionTitle
          title="キャラ選択"
          description="Step 2 の 1 / 2 / 3 / 4 はパーティスロットです。選択すると現在のスロットに反映されます。"
          action={
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f2f2] text-black"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          }
        />

        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="キャラ名で検索"
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#0f1419]"
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] font-medium text-black"
            >
              クリア
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ELEMENT_FILTER_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setElementFilter(option.key)}
                className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                  elementFilter === option.key ? "bg-[#0f1419] text-white" : "bg-[#f2f2f2] text-[#545468]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-[16px] bg-[#f6f7f9] p-3">
            <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
              {filteredCharacters.map((character) => {
                const isActive = character.id === activeCharacterId;

                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => onSelect(character.id)}
                    className={`rounded-[16px] border bg-white p-2 text-center transition hover:-translate-y-[1px] ${
                      isActive ? "border-[#0f1419] shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : "border-transparent"
                    }`}
                  >
                    <div className="flex justify-center">
                      <CharacterIcon characterId={character.id} alt={character.name} fallbackLabel={character.name} size={62} />
                    </div>
                    <div className="mt-2 text-[12px] font-medium text-black">{character.name}</div>
                  </button>
                );
              })}
            </div>

            {filteredCharacters.length === 0 ? (
              <div className="grid h-full min-h-[240px] place-items-center text-center text-[14px] text-[#7b7b8d]">
                条件に一致するキャラクターがありません。
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeaponPickerModal({
  isOpen,
  activeWeaponId,
  options,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  activeWeaponId: string;
  options: typeof WEAPON_OPTIONS;
  onClose: () => void;
  onSelect: (weaponId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredWeapons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return options.filter((weapon) => {
      if (!normalizedQuery) {
        return true;
      }

      return weapon.name.toLowerCase().includes(normalizedQuery) || weapon.id.toLowerCase().includes(normalizedQuery);
    });
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery("");
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[72] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className="w-full max-w-[760px] rounded-[24px] border border-[#ebebeb] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.16)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionTitle
          title="武器選択"
          description="現在のキャラクターが装備できる武器だけを表示しています。"
          action={
            <button type="button" onClick={onClose} className="rounded-full bg-[#f2f2f2] px-4 py-2 text-[13px] font-medium text-black">
              閉じる
            </button>
          }
        />

        <div className="mt-6 flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="武器名で検索"
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#0f1419]"
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-[12px] border border-[#d7d7df] bg-white px-4 py-3 text-[14px] font-medium text-black"
            >
              クリア
            </button>
          </div>

          <div className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto rounded-[16px] bg-[#f6f7f9] p-3 md:grid-cols-3">
            {filteredWeapons.map((weapon) => {
              const isActive = weapon.id === activeWeaponId;

              return (
                <button
                  key={weapon.id}
                  type="button"
                  onClick={() => onSelect(weapon.id)}
                  className={`rounded-[16px] border bg-white p-4 text-left transition hover:-translate-y-[1px] ${
                    isActive ? "border-[#0f1419] shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : "border-transparent"
                  }`}
                >
                  <div className="text-[28px] font-bold text-[#9999b1]">{weapon.shortLabel}</div>
                  <div className="mt-3 text-[15px] font-semibold text-black">{weapon.name}</div>
                  <div className="mt-1 text-[12px] text-[#7b7b8d]">
                    {weapon.weaponClass} / {weapon.tier === "five_star" ? "5 star" : "4 star"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function UidCharacterPickerModal({
  isOpen,
  uid,
  onUidChange,
  profile,
  selectedCharacterIds,
  isLoading,
  fetchError,
  onClose,
  onFetch,
  onSelectCharacter,
  onClearSlot,
  onApply,
}: {
  isOpen: boolean;
  uid: string;
  onUidChange: (value: string) => void;
  profile: EnkaProfile | null;
  selectedCharacterIds: string[];
  isLoading: boolean;
  fetchError: string;
  onClose: () => void;
  onFetch: () => void;
  onSelectCharacter: (character: EnkaProfileCharacter) => void;
  onClearSlot: (index: number) => void;
  onApply: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  const selectedCharacters = selectedCharacterIds
    .map((characterId) => profile?.characters.find((character) => character.characterId === characterId))
    .filter((character): character is EnkaProfileCharacter => character !== undefined);
  const profileCharacters = Array.from({ length: 8 }, (_, index) => profile?.characters[index] ?? null);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[rgba(0,0,0,0.2)] px-4 py-6" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[36px] bg-white p-6 shadow-[0_24px_48px_rgba(0,0,0,0.18)] md:p-[52px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="text-center text-[28px] font-bold text-black md:text-[32px]">キャラクター選択</div>

        <div className="mt-10 flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto pr-1">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_376px] xl:items-end">
            <div className="flex flex-col gap-4">
              <div className="text-[22px] font-bold text-[#9999b1] md:text-[24px]">プロフィールキャラクター</div>
              <div className="rounded-[8px] border border-[rgba(0,0,0,0.4)] bg-[#f6f6f6] p-4">
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    value={uid}
                    onChange={(event) => onUidChange(event.target.value.replace(/[^\d]/g, "").slice(0, 9))}
                    inputMode="numeric"
                    placeholder="UID を入力"
                    className="w-full rounded-[8px] bg-white px-4 py-3 text-[18px] text-black outline-none md:text-[20px]"
                  />
                  <button
                    type="button"
                    onClick={onFetch}
                    disabled={isLoading}
                    className="inline-flex w-fit shrink-0 items-center justify-center self-start whitespace-nowrap rounded-[8px] bg-[#333333] px-5 py-3 text-[16px] text-white disabled:cursor-not-allowed disabled:opacity-60 md:self-auto"
                  >
                    {isLoading ? "取得中..." : "取得"}
                  </button>
                </div>
                {profile?.nickname ? (
                  <div className="mt-3 text-[13px] text-[#7b7b8d]">
                    {profile.nickname}
                    {profile.signature ? ` / ${profile.signature}` : ""}
                  </div>
                ) : (
                  <div className="mt-3 text-[13px] text-[#7b7b8d]">Enka.Network の公開プロフィールから最大 8 人を読み込みます。</div>
                )}
                <FieldError message={fetchError} />
              </div>

              <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4">
                {profileCharacters.map((character, index) => {
                  if (!character) {
                    return <div key={`profile-placeholder-${index}`} className="h-[93px] rounded-[8px] bg-[#f6f6f6]" />;
                  }

                  const isSelected = character.characterId ? selectedCharacterIds.includes(character.characterId) : false;
                  const order = character.characterId ? selectedCharacterIds.indexOf(character.characterId) + 1 : -1;

                  return (
                    <button
                      key={`${character.avatarId}-${character.characterId ?? "unknown"}`}
                      type="button"
                      disabled={!character.supported}
                      onClick={() => onSelectCharacter(character)}
                      className={`relative flex h-[93px] flex-col items-center justify-center rounded-[8px] bg-[#f6f6f6] px-3 py-2 transition ${
                        character.supported ? "hover:-translate-y-[1px]" : "cursor-not-allowed opacity-55"
                      }`}
                    >
                      {isSelected ? (
                        <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-[#0f1419] px-2 py-0.5 text-[11px] font-semibold text-white">
                          {order}
                        </div>
                      ) : null}
                      {character.characterId ? (
                        <CharacterIcon characterId={character.characterId} alt={character.name} fallbackLabel={character.name} size={54} />
                      ) : (
                        <EmptyCharacterBadge label="?" />
                      )}
                      <div className="mt-2 text-center text-[11px] font-medium text-[#666666]">{character.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[22px] font-bold text-[#9999b1] md:text-[24px]">使用キャラクター</div>
              <div className="text-[13px] leading-[1.7] text-[#7b7b8d]">
                左のキャラを押すと選択、右の枠を押すとその枠だけ解除します。4 人埋まっている状態では 5 人目は追加されません。
              </div>
              <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => {
                  const selectedCharacter = selectedCharacters[index] ?? null;

                  return (
                    <button
                      key={`uid-slot-${index}`}
                      type="button"
                      onClick={() => onClearSlot(index)}
                      className="flex h-[93px] flex-col items-center justify-center rounded-[8px] bg-[#f6f6f6] px-3 py-2"
                    >
                      {selectedCharacter?.characterId ? (
                        <>
                          <CharacterIcon
                            characterId={selectedCharacter.characterId}
                            alt={selectedCharacter.name}
                            fallbackLabel={selectedCharacter.name}
                            size={54}
                          />
                          <div className="mt-2 text-center text-[11px] font-medium text-[#666666]">{selectedCharacter.name}</div>
                        </>
                      ) : (
                        <div className="text-[48px] leading-none text-[#c2c2c2]">+</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-fit shrink-0 items-center justify-center self-end whitespace-nowrap rounded-[8px] border border-[#333333] bg-white px-6 py-4 text-[18px] text-black md:self-auto md:text-[24px]"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={onApply}
              disabled={selectedCharacters.length === 0}
              className="w-full rounded-[8px] bg-[#333333] px-6 py-4 text-[18px] text-white disabled:cursor-not-allowed disabled:opacity-50 md:w-[180px] md:text-[24px]"
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidelineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className="w-full max-w-[720px] rounded-[24px] border border-[#ebebeb] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.16)] md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionTitle
          title="ガイドライン"
          description="内容は仮置きですが、導線と同意チェックの位置はこのまま実装しています。"
          action={
            <button type="button" onClick={onClose} className="rounded-full bg-[#f2f2f2] px-4 py-2 text-[13px] font-medium text-black">
              閉じる
            </button>
          }
        />

        <div className="mt-6 space-y-4 text-[14px] leading-[1.8] text-[#49495b]">
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            1. 動画 URL は公開 YouTube リンクを想定しています。限定公開や削除済みリンクは比較ビュー・詳細画面で再生できません。
          </div>
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            2. 編成・凸・武器・精錬は自己申告ベースです。UID からの取得は best effort なので、最終確認は提出者自身で行ってください。
          </div>
          <div className="rounded-[18px] bg-[#fafafb] p-4">
            3. コメント、いいね、共有、実 submit 永続化はまだ仮実装です。提出後も下書きはブラウザに残ります。
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeroHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[28px] font-bold text-black md:text-[32px]">{title}</h2>
      <p className="text-[16px] leading-[1.8] text-[#9999b1] md:text-[20px]">{description}</p>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 border-b border-[#d9d9d9]" />
      <div className="relative inline-flex bg-white pr-4 text-[22px] font-bold text-black md:text-[24px]">{label}</div>
    </div>
  );
}

function FieldTitle({ children, quiet = false }: { children: ReactNode; quiet?: boolean }) {
  return (
    <div className={`text-[20px] font-bold md:text-[24px] ${quiet ? "text-[#9999b1]" : "text-black"}`}>{children}</div>
  );
}

function MockFieldBox({
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

function MockChoiceButton({
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

function BottomActionButtons({
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

export function RunSubmitPage({ onBack, embedded = false }: { onBack: () => void; embedded?: boolean }) {
  const [initialState] = useState(() => loadInitialDraftState());
  const [draft, setDraft] = useState<SubmitDraft>(initialState.draft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [activeSlot, setActiveSlot] = useState(0);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [showWeaponPicker, setShowWeaponPicker] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showUidModal, setShowUidModal] = useState(false);
  const [uidProfile, setUidProfile] = useState<EnkaProfile | null>(null);
  const [uidLoading, setUidLoading] = useState(false);
  const [uidError, setUidError] = useState("");
  const [uidSelectedCharacterIds, setUidSelectedCharacterIds] = useState<string[]>([]);

  const summary = useMemo(() => getSummaryForParty(draft.party), [draft.party]);
  const activePartySlot = draft.party[activeSlot];
  const activeCharacter = activePartySlot?.characterId ? characterDb[activePartySlot.characterId] : undefined;
  const activeWeapon = activePartySlot?.weaponId ? weaponDb[activePartySlot.weaponId] : undefined;
  const timeInput = splitTimeInputValue(draft.basicInfo.time);
  const activeCharacterCost = getCharacterCostForSlot(activePartySlot);
  const activeWeaponCost = getWeaponCostForSlot(activePartySlot);
  const compatibleWeapons = useMemo(() => {
    if (!activeCharacter) {
      return WEAPON_OPTIONS;
    }

    return WEAPON_OPTIONS.filter((weapon) => weapon.weaponClass === activeCharacter.weaponClass);
  }, [activeCharacter]);
  const availablePartyCharacters = useMemo(
    () =>
      draft.party
        .map((slot) => slot.characterId)
        .filter((characterId): characterId is string => Boolean(characterId))
        .filter((characterId, index, allCharacterIds) => allCharacterIds.indexOf(characterId) === index),
    [draft.party],
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      persistDraft(draft);
    }, AUTO_SAVE_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [draft]);

  useEffect(() => {
    setDraft((currentDraft) => {
      const availableIds = new Set(
        currentDraft.party.map((slot) => slot.characterId).filter((characterId): characterId is string => Boolean(characterId)),
      );
      const filteredAttackers = currentDraft.details.mainAttackerIds.filter((characterId) => availableIds.has(characterId));
      const normalizedAttackers =
        currentDraft.basicInfo.playMode === "solo" ? filteredAttackers.slice(0, 1) : filteredAttackers;

      if (
        normalizedAttackers.length === currentDraft.details.mainAttackerIds.length &&
        normalizedAttackers.every((characterId, index) => characterId === currentDraft.details.mainAttackerIds[index])
      ) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        details: {
          ...currentDraft.details,
          mainAttackerIds: normalizedAttackers,
        },
      };
    });
  }, [draft.basicInfo.playMode, draft.party]);

  const clearErrors = (prefixes: string[]) => {
    setErrors((currentErrors) =>
      Object.fromEntries(
        Object.entries(currentErrors).filter(([key]) => !prefixes.some((prefix) => key.startsWith(prefix))),
      ),
    );
  };

  const updateBasicInfo = <Key extends keyof SubmitDraft["basicInfo"]>(
    key: Key,
    value: SubmitDraft["basicInfo"][Key],
  ) => {
    setDraft((currentDraft) => {
      const nextDraft: SubmitDraft = {
        ...currentDraft,
        basicInfo: {
          ...currentDraft.basicInfo,
          [key]: value,
        },
      };

      if (key === "playMode" && value === "solo") {
        nextDraft.details = {
          ...currentDraft.details,
          mainAttackerIds: currentDraft.details.mainAttackerIds.slice(0, 1),
        };
      }

      return nextDraft;
    });
    clearErrors([`basicInfo.${String(key)}`]);
  };

  const updateTimeInput = (part: "hours" | "minutes" | "seconds", value: string) => {
    updateBasicInfo("time", buildTimeInputValue({ ...timeInput, [part]: value }));
  };

  const updatePartySlot = (slotIndex: number, patch: Partial<SubmitPartySlot>) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      party: currentDraft.party.map((slot, index) => (index === slotIndex ? { ...slot, ...patch } : slot)),
    }));
    clearErrors([`party.${slotIndex}`]);
  };

  const handleCharacterSelect = (slotIndex: number, characterId: string) => {
    setDraft((currentDraft) => {
      const nextParty = currentDraft.party.map((slot, index) => {
        if (index !== slotIndex) {
          return slot;
        }

        const nextWeaponId = isWeaponCompatible(characterId, slot.weaponId) ? slot.weaponId : getDefaultWeaponId(characterId);

        return {
          characterId,
          cons: slot.characterId === characterId ? slot.cons : 0,
          weaponId: nextWeaponId,
          refine: nextWeaponId ? slot.refine || 1 : 1,
        };
      });

      return {
        ...currentDraft,
        party: nextParty,
      };
    });
    clearErrors([`party.${slotIndex}`]);
  };

  const validateCurrentStep = (step: SubmitStep) => {
    const nextErrors =
      step === 1 ? validateStep1(draft) : step === 2 ? validateStep2(draft) : validateStep3(draft);

    setErrors((currentErrors) => ({ ...currentErrors, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleStepAdvance = () => {
    if (!validateCurrentStep(draft.currentStep)) {
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      currentStep: Math.min(3, currentDraft.currentStep + 1) as SubmitStep,
    }));
  };

  const handleStepBack = () => {
    if (draft.currentStep === 1) {
      onBack();
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      currentStep: Math.max(1, currentDraft.currentStep - 1) as SubmitStep,
    }));
  };

  const handleManualSave = () => {
    persistDraft(draft);
  };

  const handleSubmit = () => {
    const nextErrors = {
      ...validateStep1(draft),
      ...validateStep2(draft),
      ...validateStep3(draft),
    };

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors["basicInfo.videoUrl"] || nextErrors["basicInfo.time"]) {
        setDraft((currentDraft) => ({ ...currentDraft, currentStep: 1 }));
      } else if (Object.keys(nextErrors).some((key) => key.startsWith("party."))) {
        setDraft((currentDraft) => ({ ...currentDraft, currentStep: 2 }));
      } else {
        setDraft((currentDraft) => ({ ...currentDraft, currentStep: 3 }));
      }

      return;
    }

    handleManualSave();
    window.alert("提出しました");
    onBack();
  };

  const toggleTag = (tag: string) => {
    setDraft((currentDraft) => {
      const currentTags = new Set(currentDraft.details.tagIds);

      if (currentTags.has(tag)) {
        currentTags.delete(tag);
      } else {
        currentTags.add(tag);
      }

      return {
        ...currentDraft,
        details: {
          ...currentDraft.details,
          tagIds: [...currentTags],
        },
      };
    });
  };

  const toggleMainAttacker = (characterId: string) => {
    setDraft((currentDraft) => {
      const currentAttackers = new Set(currentDraft.details.mainAttackerIds);

      if (currentAttackers.has(characterId)) {
        currentAttackers.delete(characterId);
      } else if (currentDraft.basicInfo.playMode === "multiplayer") {
        currentAttackers.add(characterId);
      } else {
        currentAttackers.clear();
        currentAttackers.add(characterId);
      }

      return {
        ...currentDraft,
        details: {
          ...currentDraft.details,
          mainAttackerIds: [...currentAttackers],
        },
      };
    });
  };

  const openUidModal = () => {
    setUidSelectedCharacterIds(
      draft.party
        .map((slot) => slot.characterId)
        .filter((characterId): characterId is string => Boolean(characterId))
        .slice(0, 4),
    );
    setUidError("");
    setShowUidModal(true);
  };

  const handleFetchUid = async (uid = draft.basicInfo.uid) => {
    const normalizedUid = uid.trim();

    if (!isValidEnkaUid(normalizedUid)) {
      setUidError("UIDは9桁の数字で入力してください。");
      return;
    }

    setUidLoading(true);
    setUidError("");

    try {
      const profile = await fetchEnkaProfile(normalizedUid);
      const supportedCharacters = profile.characters.filter((character) => character.supported && character.characterId);

      setUidProfile(profile);
      setUidSelectedCharacterIds((currentSelectedIds) => {
        if (currentSelectedIds.length > 0) {
          return currentSelectedIds.filter((characterId) =>
            profile.characters.some((character) => character.characterId === characterId),
          );
        }

        return draft.party
          .map((slot) => slot.characterId)
          .filter((characterId): characterId is string => Boolean(characterId))
          .filter((characterId) => profile.characters.some((character) => character.characterId === characterId))
          .slice(0, 4);
      });

      if (profile.characters.length === 0) {
        setUidError("公開プロフィールに表示中のキャラクターが見つかりませんでした。Enka.Network 側の公開設定を確認してください。");
      } else if (supportedCharacters.length === 0) {
        setUidError("プロフィールは取得できましたが、このプロトタイプで対応しているキャラクターが見つかりませんでした。");
      }
    } catch (error) {
      setUidProfile(null);
      setUidError(error instanceof Error ? error.message : "プロフィール取得に失敗しました。");
    } finally {
      setUidLoading(false);
    }
  };

  const handleUidSearchSubmit = (event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    openUidModal();
    void handleFetchUid(draft.basicInfo.uid);
  };

  const handleUidSelectCharacter = (character: EnkaProfileCharacter) => {
    const characterId = character.characterId;

    if (!character.supported || !characterId) {
      return;
    }

    setUidSelectedCharacterIds((currentSelectedIds) => {
      if (currentSelectedIds.includes(characterId)) {
        return currentSelectedIds;
      }

      if (currentSelectedIds.length >= 4) {
        return currentSelectedIds;
      }

      return [...currentSelectedIds, characterId];
    });
  };

  const handleUidClearSlot = (index: number) => {
    setUidSelectedCharacterIds((currentSelectedIds) => currentSelectedIds.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleUidApply = () => {
    if (!uidProfile) {
      return;
    }

    const selectedCharacters = uidSelectedCharacterIds
      .map((characterId) => uidProfile.characters.find((character) => character.characterId === characterId))
      .filter((character): character is EnkaProfileCharacter => Boolean(character?.characterId))
      .slice(0, 4);

    setDraft((currentDraft) => ({
      ...currentDraft,
      party: Array.from({ length: 4 }, (_, index) => {
        const selectedCharacter = selectedCharacters[index];

        if (!selectedCharacter?.characterId) {
          return createEmptyPartySlot();
        }

        const defaultWeaponId = getDefaultWeaponId(selectedCharacter.characterId);
        const weaponId = selectedCharacter.weaponId && isWeaponCompatible(selectedCharacter.characterId, selectedCharacter.weaponId)
          ? selectedCharacter.weaponId
          : defaultWeaponId;

        return {
          characterId: selectedCharacter.characterId,
          cons: Math.min(6, Math.max(0, selectedCharacter.constellation ?? 0)),
          weaponId,
          refine: Math.min(5, Math.max(1, selectedCharacter.refinement ?? 1)),
        };
      }),
    }));
    clearErrors(["party."]);
    setShowUidModal(false);
  };

  return (
    <>
      <main className="min-h-screen bg-white text-[#333333]">
        {embedded ? (
          <div className="border-b border-[#ebebeb] bg-white">
            <div className="header-font mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 py-2 md:px-6">
              <button
                type="button"
                onClick={onBack}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f2f2f2] text-black"
                aria-label="記録一覧へ戻る"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5" />
                  <path d="M11 6L5 12L11 18" />
                </svg>
              </button>
              <div className="text-[16px] font-semibold tracking-tight text-black md:text-[18px]">記録申請</div>
            </div>
          </div>
        ) : null}
        <nav className={embedded ? "hidden" : "sticky top-0 z-40 border-b border-[#ebebeb] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"}>
          <div className="header-font mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f2f2] text-black"
                aria-label="記録詳細へ戻る"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5" />
                  <path d="M11 6L5 12L11 18" />
                </svg>
              </button>
              <div>
                <div className="text-[24px] font-semibold tracking-tight text-black md:text-[34px]">記録提出</div>
              </div>
            </div>
          </div>
        </nav>

        <SubmitSurfaceScale>
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6">
            <StepIndicator currentStep={draft.currentStep} onBack={handleStepBack} />

            {draft.currentStep === 1 ? (
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
            ) : null}

            {draft.currentStep === 2 ? (
              <section className="mx-auto flex w-full max-w-[1180px] flex-col gap-8">
              <StepHeroHeader title="2.編成情報の入力" description="申請する狩りの記録で使用した編成を入力してください。" />

              <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-16">
                <div className="flex flex-1 flex-col gap-8 border-b-2 border-[#d9d9d9] pb-8 xl:min-h-[864px]">
                  <div>
                    <form onSubmit={handleUidSearchSubmit} className="relative rounded-[8px] bg-[#f6f6f6]">
                      <div className="pointer-events-none absolute inset-0 rounded-[8px] border border-[rgba(0,0,0,0.4)]" />
                      <div className="flex items-center gap-3 px-4 py-3">
                        <input
                          value={draft.basicInfo.uid}
                          onChange={(event) => {
                            updateBasicInfo("uid", event.target.value.replace(/[^\d]/g, "").slice(0, 9));
                            setUidError("");
                          }}
                          inputMode="numeric"
                          placeholder="UID を入力"
                          className="min-w-0 flex-1 bg-transparent text-[18px] text-black outline-none md:text-[20px]"
                        />
                        <button
                          type="submit"
                          aria-label={"UID\u3092\u691c\u7d22"}
                          title={"UID\u3092\u691c\u7d22"}
                          className="group inline-flex h-[44px] shrink-0 items-center justify-center gap-[10px] rounded-[8px] bg-[#ececf2] px-4 text-[#5f6373] shadow-[inset_0_0_0_1px_rgba(123,123,141,0.14)] transition duration-150 hover:-translate-y-[1px] hover:bg-[#e4e5ec] hover:text-[#4d5160] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/10"
                        >
                          <SearchActionIcon />
                          <span className="text-[16px] font-medium leading-none md:text-[17px]">{"\u53d6\u5f97"}</span>
                        </button>
                      </div>
                    </form>
                    <FieldError message={uidError} />
                  </div>

                  <div className="border-b border-[#d9d9d9]">
                    <div className="flex gap-4 overflow-x-auto">
                      {draft.party.map((slot, index) => {
                        const active = activeSlot === index;
                        const slotCharacter = slot.characterId ? characterDb[slot.characterId] : null;

                        return (
                          <button
                            key={`slot-tab-${index}`}
                            type="button"
                            onClick={() => setActiveSlot(index)}
                            className={`relative flex shrink-0 items-center gap-2 px-6 py-4 ${active ? "border-b-[6px] border-black" : ""}`}
                          >
                            <span className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full ${slotCharacter ? "" : active ? "bg-black" : "bg-[#d9d9d9]"}`}>
                              {slotCharacter ? (
                                <CharacterIcon
                                  characterId={slot.characterId}
                                  alt={slotCharacter.name}
                                  fallbackLabel={slotCharacter.name}
                                  size={40}
                                />
                              ) : null}
                            </span>
                            <span className={`text-[32px] ${active ? "text-black" : "text-[#d9d9d9]"}`}>{index + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-[44px]">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-3 bg-[#9999b1]" />
                          <FieldTitle quiet>{`${activeSlot + 1}人目のキャラクター`}</FieldTitle>
                        </div>

                        <div className="rounded-[8px] bg-[#f6f6f6] p-4">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <button
                              type="button"
                              onClick={() => setShowCharacterPicker(true)}
                              className="flex h-[154px] w-[154px] items-center justify-center rounded-[4px] bg-white"
                            >
                              {activePartySlot.characterId ? (
                                <CharacterIcon
                                  characterId={activePartySlot.characterId}
                                  alt={activeCharacter?.name ?? activePartySlot.characterId}
                                  fallbackLabel={activeCharacter?.name ?? activePartySlot.characterId}
                                  size={120}
                                />
                              ) : (
                                <div className="text-[128px] leading-none text-[#c2c2c2]">+</div>
                              )}
                            </button>

                            <div className="flex w-full flex-col gap-6 md:w-[160px]">
                              <button
                                type="button"
                                onClick={() => setShowCharacterPicker(true)}
                                className="block w-full appearance-none bg-transparent p-0 text-left text-[32px] font-bold leading-none text-[#9999b1]"
                              >
                                {activeCharacter?.name ?? "キャラ未選択"}
                              </button>
                              <MockFieldBox className="bg-white">
                                <select
                                  value={activePartySlot.cons}
                                  onChange={(event) => updatePartySlot(activeSlot, { cons: Number(event.target.value) })}
                                  disabled={!activePartySlot.characterId}
                                  className="w-full bg-transparent text-[20px] text-[#9999b1] outline-none md:text-[24px]"
                                >
                                  {Array.from({ length: 7 }, (_, index) => (
                                    <option key={index} value={index}>
                                      {index}凸
                                    </option>
                                  ))}
                                </select>
                              </MockFieldBox>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="hidden h-[154px] w-px bg-[#c2c2c2] md:block" />
                            <div className="text-[28px] font-bold text-[#9999b1] md:text-[32px]">Cost : {activeCharacterCost}</div>
                          </div>
                        </div>
                          <FieldError message={errors[`party.${activeSlot}.characterId`]} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-3 bg-[#9999b1]" />
                          <FieldTitle quiet>{`${activeSlot + 1}人目の武器`}</FieldTitle>
                        </div>

                        <div className="rounded-[8px] bg-[#f6f6f6] p-4">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <button
                              type="button"
                              onClick={() => setShowWeaponPicker(true)}
                              disabled={!activePartySlot.characterId}
                              className="flex h-[154px] w-[154px] items-center justify-center rounded-[4px] bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {activeWeapon ? (
                                <div className="text-[40px] font-bold text-[#9999b1]">{activeWeapon.shortLabel}</div>
                              ) : (
                                <div className="text-[128px] leading-none text-[#c2c2c2]">+</div>
                              )}
                            </button>

                            <div className="flex w-full flex-col gap-6 md:w-[160px]">
                              <button
                                type="button"
                                onClick={() => setShowWeaponPicker(true)}
                                disabled={!activePartySlot.characterId}
                                className="block w-full appearance-none bg-transparent p-0 text-center text-[28px] font-bold leading-none text-[#9999b1] disabled:cursor-not-allowed disabled:opacity-60 md:text-[32px]"
                              >
                                {activeWeapon?.name ?? "武器未選択"}
                              </button>
                              <div className="flex flex-col gap-3">
                                <MockFieldBox className="bg-white">
                                  <select
                                    value={activePartySlot.refine}
                                    onChange={(event) => updatePartySlot(activeSlot, { refine: Number(event.target.value) })}
                                    disabled={!activePartySlot.weaponId}
                                    className="w-full bg-transparent text-[20px] text-[#9999b1] outline-none md:text-[24px]"
                                  >
                                    {Array.from({ length: 5 }, (_, index) => (
                                      <option key={index} value={index + 1}>
                                        精錬 {index + 1}
                                      </option>
                                    ))}
                                  </select>
                                </MockFieldBox>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="hidden h-[154px] w-px bg-[#c2c2c2] md:block" />
                            <div className="text-[28px] font-bold text-[#9999b1] md:text-[32px]">Cost : {activeWeaponCost}</div>
                          </div>
                        </div>
                          <FieldError message={errors[`party.${activeSlot}.weaponId`]} />
                        </div>
                      </div>
                  </div>
                </div>

                <aside className="w-full self-start rounded-[8px] bg-[#f6f6f6] p-4 xl:w-[492px]">
                  <div className="rounded-[8px] bg-white">
                    <div className="px-4 py-8 text-center">
                      <div className={`text-[72px] font-bold md:text-[96px] ${BRACKET_META[summary.bracket].text}`}>
                        {BRACKET_META[summary.bracket].label}
                      </div>
                      <div className="mt-7 flex flex-col gap-6 text-left text-[22px] font-bold text-[#9999b1] md:text-[24px]">
                        <div>キャラクターCost : {summary.charCost}</div>
                        <div>武器Cost : {summary.weaponCost}</div>
                      </div>
                    </div>

                    <div className="mx-4 h-px bg-[#d9d9d9]" />

                    <div className="p-4">
                      <div className="grid gap-6 md:grid-cols-[118px_minmax(0,1fr)]">
                        <div className="space-y-6 text-[20px] font-bold md:text-[24px]">
                          <div className={summary.bracket === 1 ? "text-[#333333]" : "text-[#9999b1]"}>Low</div>
                          <div className={summary.bracket === 2 ? "text-[#333333]" : "text-[#9999b1]"}>Middle</div>
                          <div className={summary.bracket === 3 ? "text-[#333333]" : "text-[#9999b1]"}>High</div>
                          <div className={summary.bracket === 4 ? "text-[#333333]" : "text-[#9999b1]"}>Unlimited</div>
                        </div>
                        <div className="space-y-6 text-[20px] font-bold md:text-[24px]">
                          <div className={summary.bracket === 1 ? "text-[#333333]" : "text-[#9999b1]"}>キャラ≤3 & 武器≤1</div>
                          <div className={summary.bracket === 2 ? "text-[#333333]" : "text-[#9999b1]"}>キャラ≤6 & 武器≤2</div>
                          <div className={summary.bracket === 3 ? "text-[#333333]" : "text-[#9999b1]"}>キャラ≤12 & 武器≤3</div>
                          <div className={summary.bracket === 4 ? "text-[#333333]" : "text-[#9999b1]"}>その他</div>
                        </div>
                      </div>
                      <div className="mt-6 text-[14px] text-[#9999b1] md:text-[16px]">※限定星5の引いた数</div>
                    </div>
                  </div>

                </aside>
              </div>
              </section>
            ) : null}

            {draft.currentStep === 3 ? (
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
                              onClick={() => toggleTag(tag)}
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
                        onChange={(event) =>
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            details: {
                              ...currentDraft.details,
                              notes: event.target.value,
                            },
                          }))
                        }
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
                          onChange={(event) => {
                            setDraft((currentDraft) => ({
                              ...currentDraft,
                              details: {
                                ...currentDraft.details,
                                guidelineAccepted: event.target.checked,
                              },
                            }));
                            clearErrors(["details.guidelineAccepted"]);
                          }}
                          className="h-5 w-5"
                        />
                        <span className="text-[18px] font-bold text-[#333333] md:text-[24px]">ガイドラインに同意する</span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGuidelines(true)}
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
            ) : null}

            <div className="mt-8 flex flex-col gap-4">
              <BottomActionButtons
                currentStep={draft.currentStep}
                onSave={handleManualSave}
                onAdvance={handleStepAdvance}
                onSubmit={handleSubmit}
              />
              <div className="mx-auto w-full max-w-[500px] text-center text-[13px] leading-[1.7] text-[#7b7b8d]">
                下書きはブラウザに保持され、ダミー submit 後も自動では消しません。
              </div>
            </div>
          </div>
        </SubmitSurfaceScale>
      </main>

      <CharacterPickerModal
        isOpen={showCharacterPicker}
        activeCharacterId={activePartySlot.characterId}
        onClose={() => setShowCharacterPicker(false)}
        onSelect={(characterId) => {
          handleCharacterSelect(activeSlot, characterId);
          setShowCharacterPicker(false);
        }}
      />

      <WeaponPickerModal
        isOpen={showWeaponPicker}
        activeWeaponId={activePartySlot.weaponId}
        options={compatibleWeapons}
        onClose={() => setShowWeaponPicker(false)}
        onSelect={(weaponId) => {
          updatePartySlot(activeSlot, { weaponId, refine: 1 });
          setShowWeaponPicker(false);
        }}
      />

      <UidCharacterPickerModal
        isOpen={showUidModal}
        uid={draft.basicInfo.uid}
        onUidChange={(value) => updateBasicInfo("uid", value)}
        profile={uidProfile}
        selectedCharacterIds={uidSelectedCharacterIds}
        isLoading={uidLoading}
        fetchError={uidError}
        onClose={() => setShowUidModal(false)}
        onFetch={handleFetchUid}
        onSelectCharacter={handleUidSelectCharacter}
        onClearSlot={handleUidClearSlot}
        onApply={handleUidApply}
      />

      <GuidelineModal isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
    </>
  );
}

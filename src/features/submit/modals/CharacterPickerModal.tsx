import { useEffect, useMemo, useState } from "react";

import { CharacterIcon } from "../../../components/CharacterIcon";
import { ModalFrame } from "../../../components/ui";

import { CHARACTER_OPTIONS, ELEMENT_FILTER_OPTIONS } from "../config";

export function CharacterPickerModal({
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
    <ModalFrame
      onClose={onClose}
      title="キャラ選択"
      description="Step 2 の 1 / 2 / 3 / 4 はパーティスロットです。選択すると現在のスロットに反映されます。"
      className="h-[720px] max-w-[760px]"
    >

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
    </ModalFrame>
  );
}

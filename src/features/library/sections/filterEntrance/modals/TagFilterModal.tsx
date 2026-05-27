
import { useEffect, useState } from 'react';

import { HOME_FILTER_TAG_GROUP_DEFINITIONS } from '../../../../home/config';
import { UI } from '../config';
import { LibraryModalFrame } from './LibraryModalFrame';

export function LibraryTagFilterModal({
  title,
  initialTags,
  onClose,
  onApply,
}: {
  title: string;
  initialTags: string[];
  onClose: () => void;
  onApply: (tags: string[]) => void;
}) {
  const [draftTags, setDraftTags] = useState<string[]>(initialTags);

  useEffect(() => {
    setDraftTags([...initialTags]);
  }, [initialTags]);

  const toggleTag = (tag: string) => {
    setDraftTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  return (
    <LibraryModalFrame title={title} onClose={onClose} onReset={() => setDraftTags([])} onApply={() => onApply([...draftTags])}>
      <div className="mb-4 flex items-center justify-end text-[12px] font-black text-[#777777]">{draftTags.length}件選択中</div>
      <div className="grid gap-3 lg:grid-cols-2">
        {HOME_FILTER_TAG_GROUP_DEFINITIONS.map((group) => (
          <section key={group.key} className="rounded-[12px] border bg-[#f7f7f7] p-3" style={{ borderColor: UI.panelBorder }}>
            <p className="mb-2 text-[12px] font-black tracking-[0.08em] text-[#777777]">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => {
                const active = draftTags.includes(tag);
                return (
                  <button
                    key={`${group.key}-${tag}`}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={[
                      "inline-flex min-h-9 items-center rounded-full border px-3 py-2 text-[12px] font-medium transition-colors",
                      active ? "border-transparent bg-[#111827] text-white" : "border-[#d8dde6] bg-white text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#333333]",
                    ].join(" ")}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </LibraryModalFrame>
  );
}

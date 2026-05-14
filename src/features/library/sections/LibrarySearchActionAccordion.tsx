import { useState } from "react";

import { EmptyState } from "../../../components/ui";
import type { RunRecord } from "../../../data/mockRuns";
import type { LibraryActionAccordionKey, LibrarySearchHistoryEntry } from "../logic/actionStorage";
import { BookmarkIcon, ChevronIcon, ClockIcon, EyeIcon, XIcon } from "../ui/searchResultsUi";

export function LibrarySearchActionAccordion({
  searchHistory,
  viewHistoryRuns,
  watchLaterRuns,
  onApplySearchHistory,
  onRemoveSearchHistory,
  onSelectRun,
  onRemoveViewHistory,
  onRemoveWatchLater,
}: {
  searchHistory: LibrarySearchHistoryEntry[];
  viewHistoryRuns: RunRecord[];
  watchLaterRuns: RunRecord[];
  onApplySearchHistory: (entry: LibrarySearchHistoryEntry) => void;
  onRemoveSearchHistory: (signature: string) => void;
  onSelectRun: (runId: string) => void;
  onRemoveViewHistory: (runId: string) => void;
  onRemoveWatchLater: (runId: string) => void;
}) {
  const [openKey, setOpenKey] = useState<LibraryActionAccordionKey | null>(null);
  const actionRows: Array<{ key: LibraryActionAccordionKey; icon: typeof ClockIcon; label: string; count: number }> = [
    { key: "search", icon: ClockIcon, label: "検索履歴", count: searchHistory.length },
    { key: "browse", icon: EyeIcon, label: "閲覧履歴", count: viewHistoryRuns.length },
    { key: "watch", icon: BookmarkIcon, label: "あとで見る", count: watchLaterRuns.length },
  ];

  return (
    <section className="overflow-hidden rounded-[8px] border border-[#dfe3ea] bg-white shadow-[0_12px_26px_rgba(21,27,38,0.06)]">
      <h3 className="border-b border-[#eef1f5] px-5 py-4 text-[15px] font-black text-[#111827]">検索アクション</h3>
      <div className="divide-y divide-[#eef1f5]">
        {actionRows.map((item) => {
          const Icon = item.icon;
          const isOpen = item.key === openKey;

          return (
            <div key={item.key}>
              <button
                type="button"
                onClick={() => setOpenKey((current) => (current === item.key ? null : item.key))}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-5 py-3 text-left text-[13px] font-bold text-[#374151] transition hover:text-[#ff3b1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111116]/40"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-[#8b95a7]" />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-[12px] text-[#8b95a7]">
                  {item.count}
                  <ChevronIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </span>
              </button>
              {isOpen ? (
                <div className="px-3 pb-3">
                  {item.key === "search" ? (
                    <SearchHistoryList entries={searchHistory} onApply={onApplySearchHistory} onRemove={onRemoveSearchHistory} />
                  ) : null}
                  {item.key === "browse" ? (
                    <ActionRunList runs={viewHistoryRuns} emptyLabel="まだ閲覧履歴がありません。" onSelectRun={onSelectRun} onRemove={onRemoveViewHistory} />
                  ) : null}
                  {item.key === "watch" ? (
                    <ActionRunList runs={watchLaterRuns} emptyLabel="あとで見る記録はまだありません。" onSelectRun={onSelectRun} onRemove={onRemoveWatchLater} />
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SearchHistoryList({
  entries,
  onApply,
  onRemove,
}: {
  entries: LibrarySearchHistoryEntry[];
  onApply: (entry: LibrarySearchHistoryEntry) => void;
  onRemove: (signature: string) => void;
}) {
  if (entries.length === 0) {
    return <ActionEmptyState label="まだ検索履歴がありません。" />;
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div key={entry.signature} className="flex items-center gap-2 rounded-[8px] border border-[#edf0f4] bg-[#fbfcfd] p-2">
          <button type="button" onClick={() => onApply(entry)} className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40">
            <p className="truncate text-[12px] font-black text-[#111827]">{entry.label}</p>
            <p className="mt-0.5 truncate text-[10px] font-bold text-[#8d93a3]">
              {entry.summary} / {formatHistoryDate(entry.createdAt)}
            </p>
          </button>
          <button
            type="button"
            onClick={() => onRemove(entry.signature)}
            aria-label={`${entry.label} を検索履歴から削除`}
            title="削除"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#7b8493] transition hover:bg-[#eef1f5] hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ActionRunList({
  runs,
  emptyLabel,
  onSelectRun,
  onRemove,
}: {
  runs: RunRecord[];
  emptyLabel: string;
  onSelectRun: (runId: string) => void;
  onRemove: (runId: string) => void;
}) {
  if (runs.length === 0) {
    return <ActionEmptyState label={emptyLabel} />;
  }

  return (
    <div className="space-y-2">
      {runs.map((run) => (
        <div key={`action-${run.id}`} className="flex items-center gap-2 rounded-[8px] border border-[#edf0f4] bg-[#fbfcfd] p-2">
          <button type="button" onClick={() => onSelectRun(run.id)} className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40">
            <p className="truncate text-[12px] font-black text-[#111827]">{run.title}</p>
            <p className="mt-0.5 truncate text-[10px] font-bold text-[#8d93a3]">
              {run.userName} / {run.time}
            </p>
          </button>
          <button
            type="button"
            onClick={() => onRemove(run.id)}
            aria-label={`${run.title} をリストから削除`}
            title="削除"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#7b8493] transition hover:bg-[#eef1f5] hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ActionEmptyState({ label }: { label: string }) {
  return <EmptyState title={label} className="rounded-[8px] bg-[#fbfcfd] px-3 py-5 text-[12px]" />;
}

function formatHistoryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

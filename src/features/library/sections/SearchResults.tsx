import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

import { CharacterIcon } from "../../../components/CharacterIcon";
import { CompareViewIcon, PauseIcon, PlayIcon } from "../../../components/UiIcons";
import { appRuns, getAppRunById } from "../../../data/appRuns";
import { characterDb, type RunRecord } from "../../../data/mockRuns";
import { getYouTubeVideoId } from "../../../lib/youtube";
import { formatVersionLabel } from "../../../lib/versionLabels";
import { getBracketLabel } from "../../home/logic";
import { SearchIcon } from "../../home/ui/icons";
import { getPartyBuildItems, postYouTubeCommand } from "../../recordDetail/logic";
import { CircleAvatar, DETAIL_MUTED_SURFACE_CLASS, PartyBuildItemCard, PlatformLabel, SidebarPanel, SidebarSectionHeader, TagChip, VideoFrame } from "../../recordDetail/ui";
import { LIBRARY_COMPARE_CANDIDATE_LIMIT, type LibraryActionAccordionKey, type LibrarySearchHistoryEntry } from "../logic/actionStorage";
import { filterLibraryRuns, hasActiveLibrarySearchFilters } from "../logic/searchResults";
import type { LibrarySearchFilters } from "../types";

type LibrarySearchResultsProps = {
  filters: LibrarySearchFilters;
  keyword: string;
  compareCandidateIds: string[];
  watchLaterIds: string[];
  searchHistory: LibrarySearchHistoryEntry[];
  viewHistoryIds: string[];
  onAddCandidate: (runId: string) => void;
  onRemoveCandidate: (runId: string) => void;
  onClearCandidates: () => void;
  onToggleWatchLater: (runId: string) => void;
  onApplySearchHistory: (entry: LibrarySearchHistoryEntry) => void;
  onRemoveSearchHistory: (signature: string) => void;
  onRemoveViewHistory: (runId: string) => void;
  onSelectRun: (runId: string) => void;
};

export function LibrarySearchResults({
  filters,
  keyword,
  compareCandidateIds,
  watchLaterIds,
  searchHistory,
  viewHistoryIds,
  onAddCandidate,
  onRemoveCandidate,
  onClearCandidates,
  onToggleWatchLater,
  onApplySearchHistory,
  onRemoveSearchHistory,
  onRemoveViewHistory,
  onSelectRun,
}: LibrarySearchResultsProps) {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const visibleRuns = useMemo(() => filterLibraryRuns(appRuns, filters, keyword), [filters, keyword]);
  const compareCandidates = useMemo(() => compareCandidateIds.map((runId) => getAppRunById(runId)).filter((run): run is RunRecord => Boolean(run)), [compareCandidateIds]);
  const watchLaterRuns = useMemo(() => watchLaterIds.map((runId) => getAppRunById(runId)).filter((run): run is RunRecord => Boolean(run)), [watchLaterIds]);
  const viewHistoryRuns = useMemo(() => viewHistoryIds.map((runId) => getAppRunById(runId)).filter((run): run is RunRecord => Boolean(run)), [viewHistoryIds]);
  const hasSearchCriteria = hasActiveLibrarySearchFilters(filters) || keyword.trim().length > 0;
  const heading = hasSearchCriteria ? "検索結果" : "最近の投稿";
  const lead = hasSearchCriteria ? "指定した条件に一致する記録を新しい順に表示しています。" : "おすすめ機能が入るまでの代替として、新しい投稿から表示しています。";
  const canOpenCompare = compareCandidates.length === LIBRARY_COMPARE_CANDIDATE_LIMIT;

  useEffect(() => {
    if (!canOpenCompare) {
      setIsCompareOpen(false);
    }
  }, [canOpenCompare]);

  return (
    <section className="mx-auto max-w-[1340px] px-4 pb-16 pt-8 lg:px-8">
      <div className="border-t border-[#d4d4d4] pt-7 md:pt-8">
        <h2 className="max-w-full overflow-hidden whitespace-nowrap text-[43px] font-normal leading-[40px] text-black md:text-[50px] lg:text-[69px] lg:leading-[62px] [font-family:'Bebas_Neue','Arial_Narrow','Space_Grotesk',sans-serif]">
          RECORDS
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-[20px] font-black tracking-[-0.03em] text-[#111827] md:text-[24px]">{heading}</span>
          <span className="inline-flex h-8 items-center rounded-full border border-[#d8dde6] bg-white px-3 text-[12px] font-black text-[#5f6678]">{visibleRuns.length}件</span>
        </div>
        <p className="mt-2 max-w-[560px] text-[12px] font-bold leading-5 text-[#7b8493] md:text-[13px]">{lead}</p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        {visibleRuns.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleRuns.map((run) => (
              <LibraryRecordCard
                key={run.id}
                run={run}
                candidateLimitReached={compareCandidateIds.length >= LIBRARY_COMPARE_CANDIDATE_LIMIT}
                isCandidate={compareCandidateIds.includes(run.id)}
                isWatchLater={watchLaterIds.includes(run.id)}
                onAddCandidate={onAddCandidate}
                onToggleWatchLater={onToggleWatchLater}
                onSelectRun={onSelectRun}
              />
            ))}
          </div>
        ) : (
          <LibraryEmptyResults />
        )}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <CompareCandidatePanel
            candidates={compareCandidates}
            canOpenCompare={canOpenCompare}
            onSelectRun={onSelectRun}
            onRemove={onRemoveCandidate}
            onClear={onClearCandidates}
            onOpenCompare={() => {
              if (canOpenCompare) {
                setIsCompareOpen(true);
              }
            }}
          />
          <LibrarySearchActionAccordion
            searchHistory={searchHistory}
            viewHistoryRuns={viewHistoryRuns}
            watchLaterRuns={watchLaterRuns}
            onApplySearchHistory={onApplySearchHistory}
            onRemoveSearchHistory={onRemoveSearchHistory}
            onSelectRun={onSelectRun}
            onRemoveViewHistory={onRemoveViewHistory}
            onRemoveWatchLater={onToggleWatchLater}
          />
        </aside>
      </div>

      <LibraryCompareDrawer
        baseRun={compareCandidates[0] ?? null}
        comparedRun={compareCandidates[1] ?? null}
        isOpen={isCompareOpen && canOpenCompare}
        onClose={() => setIsCompareOpen(false)}
      />
    </section>
  );
}

function LibraryRecordCard({
  run,
  candidateLimitReached,
  isCandidate,
  isWatchLater,
  onAddCandidate,
  onToggleWatchLater,
  onSelectRun,
}: {
  run: RunRecord;
  candidateLimitReached: boolean;
  isCandidate: boolean;
  isWatchLater: boolean;
  onAddCandidate: (runId: string) => void;
  onToggleWatchLater: (runId: string) => void;
  onSelectRun: (runId: string) => void;
}) {
  const versionLabel = formatVersionLabel(run.versionLabel || run.season);
  const visibleTags = run.tags.slice(0, 5);
  const bracketLabel = formatCompactBracketLabel(getBracketLabel(run.bracket));
  const openDetail = () => onSelectRun(run.id);
  const compareDisabled = !isCandidate && candidateLimitReached;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openDetail();
  };

  const handleAddCandidate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (compareDisabled) {
      return;
    }

    onAddCandidate(run.id);
  };

  const handleToggleWatchLater = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleWatchLater(run.id);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer overflow-hidden rounded-[8px] border border-[#dfe3ea] bg-white text-left shadow-[0_12px_28px_rgba(21,27,38,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(21,27,38,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50"
      aria-label={`${run.title} の詳細を見る`}
    >
      <Thumbnail run={run} />
      <div className="p-4">
        <h3 className="line-clamp-1 text-[16px] font-black tracking-[-0.03em] text-[#111827]">{run.title}</h3>

        <div className="mt-4 flex items-center gap-2">
          {run.party.map((member) => {
            const characterName = characterDb[member.characterId]?.name ?? member.characterId;
            return (
              <div key={`${run.id}-${member.characterId}`} className="relative">
                <CharacterIcon characterId={member.characterId} alt={characterName} fallbackLabel={characterName} size={42} className="border border-white bg-[#f4f4f4] shadow-[0_0_0_1px_rgba(17,24,39,0.08)]" />
                <span className="absolute -bottom-1 -right-1 rounded-full bg-[#eef1f5] px-1.5 py-0.5 text-[9px] font-black leading-none text-[#6b7280] shadow-[0_0_0_1px_rgba(255,255,255,0.9)]">C{member.cons}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-bold text-[#5f6678]">
          <span className="inline-flex max-w-full items-center gap-1.5 truncate">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#eef1f5] text-[10px] text-[#6b7280]">{Array.from(run.userName)[0] ?? "?"}</span>
            <span className="truncate">{run.userName}</span>
          </span>
          <span className="h-3 w-px bg-[#d1d5db]" />
          <PlatformLabel platform={run.platform} iconClassName="h-[13px] w-[13px]" />
          <span className="h-3 w-px bg-[#d1d5db]" />
          <span>{versionLabel}</span>
        </div>

        <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-[4px] border border-[#e5e7eb] bg-[#f7f8fa] px-3 py-2 text-[11px] font-black text-[#5f6678]">
          <CostMetric label="Char" value={run.charCost} />
          <CostMetric label="Weapon" value={run.weaponCost} />
          <CostMetric label="Bracket" value={bracketLabel} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span key={`${run.id}-${tag}`} className="max-w-full truncate rounded-full bg-[#f0f2f5] px-2.5 py-1 text-[11px] font-black text-[#5b6472]">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-4 border-t border-[#edf0f4] pt-3 text-[12px] font-black text-[#374151]">
          <button
            type="button"
            onClick={handleAddCandidate}
            aria-disabled={compareDisabled || isCandidate}
            className={`flex items-center gap-1.5 transition ${compareDisabled ? "cursor-not-allowed text-[#a2a8b3]" : "hover:text-[#ff3b1f]"} ${isCandidate ? "text-[#5f6678]" : ""}`}
          >
            {isCandidate ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
            {isCandidate ? "追加済み" : compareDisabled ? "2件まで" : "比較に追加"}
          </button>
          <button type="button" onClick={handleToggleWatchLater} aria-pressed={isWatchLater} className="flex items-center gap-1.5 transition hover:text-[#ff3b1f]">
            <BookmarkIcon className={isWatchLater ? "h-4 w-4 fill-current" : "h-4 w-4"} />
            {isWatchLater ? "保存済み" : "あとで見る"}
          </button>
        </div>
      </div>
    </article>
  );
}

function CompareCandidatePanel({
  candidates,
  canOpenCompare,
  onSelectRun,
  onRemove,
  onClear,
  onOpenCompare,
}: {
  candidates: RunRecord[];
  canOpenCompare: boolean;
  onSelectRun: (runId: string) => void;
  onRemove: (runId: string) => void;
  onClear: () => void;
  onOpenCompare: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[8px] border border-[#dfe3ea] bg-white shadow-[0_12px_26px_rgba(21,27,38,0.06)]">
      <header className="border-b border-[#eef1f5] p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-black text-[#111827]">比較候補の記録</h3>
          <span className="shrink-0 text-[11px] font-black text-[#5b6472]">{candidates.length}/{LIBRARY_COMPARE_CANDIDATE_LIMIT}件</span>
        </div>
        <p className="mt-2 text-[11px] font-bold leading-5 text-[#7b8493]">比較したい記録だけをここに一時保存します。</p>
      </header>
      {candidates.length > 0 ? (
        <div className="space-y-3 p-3">
          {candidates.map((run) => (
            <CompareCandidateCard key={run.id} run={run} onSelectRun={onSelectRun} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <CompareEmptyState />
      )}
      <div className="grid grid-cols-2 border-t border-[#eef1f5]">
        <button type="button" onClick={onClear} disabled={candidates.length === 0} className="h-11 border-r border-[#eef1f5] text-[12px] font-black text-[#7b8493] transition hover:bg-[#fafbfc] hover:text-[#ff3b1f] disabled:cursor-not-allowed disabled:text-[#c1c7d0] disabled:hover:bg-transparent">
          候補をクリア
        </button>
        <button
          type="button"
          onClick={onOpenCompare}
          disabled={!canOpenCompare}
          className="hidden h-11 items-center justify-center gap-1.5 text-[12px] font-black text-[#111827] transition hover:bg-[#fafbfc] hover:text-[#ff3b1f] disabled:cursor-not-allowed disabled:text-[#c1c7d0] disabled:hover:bg-transparent lg:flex"
        >
          比較画面を開く
          <ChevronIcon className="h-4 w-4" />
        </button>
        <button type="button" disabled className="h-11 text-[12px] font-black text-[#c1c7d0] lg:hidden">
          PC専用
        </button>
      </div>
    </section>
  );
}

function CompareCandidateCard({ run, onSelectRun, onRemove }: { run: RunRecord; onSelectRun: (runId: string) => void; onRemove: (runId: string) => void }) {
  return (
    <article className="relative overflow-hidden rounded-[8px] border border-[#e2e6ee] bg-[#fbfcfd]">
      <button
        type="button"
        onClick={() => onRemove(run.id)}
        aria-label={`${run.title} を比較候補から削除`}
        title="削除"
        className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white shadow transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        <XIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => onSelectRun(run.id)} className="block w-full text-left transition hover:bg-[#f7f8fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111116]/40">
        <div className="relative h-[88px] bg-[#111827]">
          <img src={getYouTubeThumbnailUrl(run.videoUrl) ?? ""} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.68))]" />
          <span className="absolute bottom-2 right-2 rounded-full bg-white px-2 py-1 text-[11px] font-black text-black shadow">{run.time}</span>
        </div>
        <div className="p-3">
          <p className="line-clamp-1 text-[12px] font-black text-[#111827]">{run.title}</p>
          <div className="mt-1 flex min-w-0 items-center gap-2 text-[10px] font-bold text-[#7b8493]">
            <span className="truncate">{run.userName}</span>
            <span className="h-2.5 w-px shrink-0 bg-[#d1d5db]" />
            <span>{run.platform}</span>
            <span className="h-2.5 w-px shrink-0 bg-[#d1d5db]" />
            <span>{formatVersionLabel(run.versionLabel || run.season)}</span>
          </div>
          <div className="mt-3 flex -space-x-1">
            {run.party.map((member) => {
              const characterName = characterDb[member.characterId]?.name ?? member.characterId;
              return <CharacterIcon key={`${run.id}-candidate-${member.characterId}`} characterId={member.characterId} alt={characterName} fallbackLabel={characterName} size={24} className="border border-white bg-white" />;
            })}
          </div>
        </div>
      </button>
    </article>
  );
}

function LibrarySearchActionAccordion({
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
  return <div className="rounded-[8px] border border-dashed border-[#dfe3ea] bg-[#fbfcfd] px-3 py-5 text-center text-[12px] font-bold text-[#8d93a3]">{label}</div>;
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

function SearchActionPanel({
  hasSearchCriteria,
  watchLaterRuns,
  onSelectRun,
  onRemoveWatchLater,
}: {
  hasSearchCriteria: boolean;
  watchLaterRuns: RunRecord[];
  onSelectRun: (runId: string) => void;
  onRemoveWatchLater: (runId: string) => void;
}) {
  const actionRows = [
    { key: "search", icon: ClockIcon, label: "検索履歴", count: hasSearchCriteria ? 1 : 0 },
    { key: "browse", icon: EyeIcon, label: "閲覧履歴", count: 0 },
    { key: "watch", icon: BookmarkIcon, label: "あとで見る", count: watchLaterRuns.length },
  ];

  return (
    <section className="rounded-[8px] border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_26px_rgba(21,27,38,0.06)]">
      <h3 className="mb-3 text-[15px] font-black text-[#111827]">検索アクション</h3>
      <div className="divide-y divide-[#eef1f5]">
        {actionRows.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex w-full items-center justify-between py-3 text-left text-[13px] font-bold text-[#374151]">
              <span className="flex min-w-0 items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-[#8b95a7]" />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-[12px] text-[#8b95a7]">
                {item.count}
                <ChevronIcon className="h-4 w-4" />
              </span>
            </div>
          );
        })}
      </div>
      {watchLaterRuns.length > 0 ? (
        <div className="mt-3 space-y-2 border-t border-[#eef1f5] pt-3">
          {watchLaterRuns.slice(0, 4).map((run) => (
            <div key={`watch-later-${run.id}`} className="flex items-center gap-2 rounded-[8px] border border-[#edf0f4] bg-[#fbfcfd] p-2">
              <button type="button" onClick={() => onSelectRun(run.id)} className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40">
                <p className="truncate text-[12px] font-black text-[#111827]">{run.title}</p>
                <p className="mt-0.5 truncate text-[10px] font-bold text-[#8d93a3]">
                  {run.userName} / {run.time}
                </p>
              </button>
              <button type="button" onClick={() => onRemoveWatchLater(run.id)} aria-label={`${run.title} をあとで見るから削除`} title="削除" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#7b8493] transition hover:bg-[#eef1f5] hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function LibraryCompareDrawer({
  baseRun,
  comparedRun,
  isOpen,
  onClose,
}: {
  baseRun: RunRecord | null;
  comparedRun: RunRecord | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [syncPlaying, setSyncPlaying] = useState(false);
  const baseIframeRef = useRef<HTMLIFrameElement | null>(null);
  const comparedIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSyncPlaying(false);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !baseRun || !comparedRun) {
    return null;
  }

  const toggleSync = () => {
    const nextPlaying = !syncPlaying;
    const command = nextPlaying ? "playVideo" : "pauseVideo";
    setSyncPlaying(nextPlaying);

    window.setTimeout(() => {
      postYouTubeCommand(baseIframeRef.current, command);
      postYouTubeCommand(comparedIframeRef.current, command);
    }, 300);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-[80px] z-40 hidden bg-[#f5f6f8] text-[#333333] shadow-[0_-20px_40px_rgba(31,41,55,0.18)] lg:block" aria-modal="false" role="complementary">
      <div className="flex h-full flex-col border-t border-[#e5e7eb]">
        <div className="flex min-h-[52px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4 py-2">
          <div className="min-w-0">
            <div className="text-[18px] font-semibold text-[#111827]">比較ビュー</div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleSync} className="inline-flex h-9 items-center justify-center gap-2 rounded-[42px] border border-[#d8dde6] bg-[#f7f8fa] px-4 text-[13px] font-medium text-[#333333] transition hover:bg-[#eef1f5]">
              {syncPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              <span>{syncPlaying ? "同期停止" : "同時再生"}</span>
            </button>
            <button type="button" aria-label="比較ビューを閉じる" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[#d8dde6] bg-[#f7f8fa] text-[#333333] transition hover:bg-[#eef1f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-[#e5e7eb]">
          <LibraryCompareRunPane run={baseRun} iframeRef={baseIframeRef} label="基準記録" />
          <LibraryCompareRunPane run={comparedRun} iframeRef={comparedIframeRef} label="比較記録" muted />
        </div>
      </div>
    </div>
  );
}

function LibraryCompareRunPane({
  run,
  iframeRef,
  label,
  muted = false,
}: {
  run: RunRecord;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  label: string;
  muted?: boolean;
}) {
  const partyBuildItems = getPartyBuildItems(run);

  return (
    <div className="min-h-0 overflow-y-auto bg-[#f5f6f8] px-3 py-3">
      <div className="mb-3 inline-flex rounded-full border border-[#d8dde6] bg-white px-3 py-1 text-[12px] font-black text-[#5f6678]">{label}</div>
      <VideoFrame title={run.title} videoUrl={run.videoUrl} iframeRef={iframeRef} mute={muted} />
      <div className="mt-4 flex flex-col gap-[12px]">
        <div className="text-[18px] font-bold leading-tight text-[#111827]">{run.title}</div>
        <div className="flex items-center justify-between gap-[12px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <CircleAvatar label={run.userName} size={40} />
            <div className="truncate text-[18px] font-bold leading-none text-[#111827]">{run.userName}</div>
          </div>
          <div className="inline-flex shrink-0 items-center gap-[6px] rounded-[42px] border border-[#d8dde6] bg-white px-[10px] py-[5px] text-[13px] text-[#333333]">
            <PlatformLabel platform={run.platform} iconClassName="h-[13px] w-[13px]" />
          </div>
        </div>
        <div className={`w-full ${DETAIL_MUTED_SURFACE_CLASS} p-[12px]`}>
          <div className="flex items-center gap-x-[18px] overflow-x-auto whitespace-nowrap text-[14px] text-[#5f6678]">
            <span>ver : {formatVersionLabel(run.versionLabel)}</span>
            <span>{run.postedLabel}</span>
            <PlatformLabel platform={run.platform} />
          </div>
          <p className="mt-[12px] whitespace-pre-line text-[15px] leading-[1.75] text-[#333333]">{run.summary}</p>
          <div className="mt-[12px] flex flex-wrap gap-[12px]">
            {run.tags.map((tag) => (
              <TagChip key={`${run.id}-${tag}`} tag={tag} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <SidebarPanel>
          <div className="flex flex-col gap-[16px]">
            <SidebarSectionHeader title="使用編成" meta={`${partyBuildItems.length}メンバー`} />
            <div className="flex flex-col gap-[12px]">
              {partyBuildItems.map((entry) => (
                <PartyBuildItemCard key={`${run.id}-${entry.characterName}-${entry.slot}`} entry={entry} />
              ))}
            </div>
          </div>
        </SidebarPanel>
      </div>
    </div>
  );
}

function CompareEmptyState() {
  return (
    <div className="px-4 py-8 text-center">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#f0f2f5] text-[#7b8493]">
        <CompareViewIcon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-[13px] font-black text-[#111827]">候補なし</p>
      <p className="mt-1 text-[11px] font-bold leading-5 text-[#8d93a3]">結果カードの下部から追加できます。</p>
    </div>
  );
}

function Thumbnail({ run }: { run: RunRecord }) {
  const thumbnailUrl = getYouTubeThumbnailUrl(run.videoUrl);

  return (
    <div className="relative aspect-video overflow-hidden bg-[#111827]">
      {thumbnailUrl ? <img src={thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" referrerPolicy="no-referrer" /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.08)_46%,rgba(0,0,0,0.66)_100%)]" />
      <div className="absolute bottom-3 left-3 right-3 min-w-0 text-white">
        <p className="truncate text-[12px] font-black text-white/72">
          {run.ruleset} / {formatVersionLabel(run.versionLabel || run.season)}
        </p>
        <p className="mt-0.5 truncate text-[16px] font-black tracking-[-0.03em]">{run.title}</p>
      </div>
    </div>
  );
}

function CostMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
      <span className="text-[10px] uppercase tracking-[0.08em] text-[#8d93a3]">{label}</span>
      <span className="truncate text-[12px] text-[#8d93a3]">{value}</span>
    </span>
  );
}

function formatCompactBracketLabel(label: string) {
  return label.length > 4 ? `${label.slice(0, 3)}.` : label;
}

function LibraryEmptyResults() {
  return (
    <div className="rounded-[16px] border border-dashed border-[#dcdfe6] bg-white py-16 text-center">
      <SearchIcon size={46} className="mx-auto mb-4 text-[#dcdfe6]" />
      <h3 className="text-[18px] font-black text-[#606266]">該当する記録がありません</h3>
      <p className="mt-2 text-[13px] font-bold text-[#909399]">条件を減らすか、検索ワードを変えてください。</p>
    </div>
  );
}

function getYouTubeThumbnailUrl(videoUrl: string) {
  const videoId = getYouTubeVideoId(videoUrl);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4V4Z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

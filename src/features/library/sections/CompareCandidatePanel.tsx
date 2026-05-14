import { CharacterIcon } from "../../../components/CharacterIcon";
import { CardShell, IconButton } from "../../../components/ui";
import { characterDb, type RunRecord } from "../../../data/mockRuns";
import { formatVersionLabel } from "../../../lib/versionLabels";
import { LIBRARY_COMPARE_CANDIDATE_LIMIT } from "../logic/actionStorage";
import { getYouTubeThumbnailUrl } from "../logic/searchResultDisplay";
import { ChevronIcon, CompareEmptyState, XIcon } from "../ui/searchResultsUi";

export function CompareCandidatePanel({
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
    <CardShell className="relative overflow-hidden rounded-[8px] bg-[#fbfcfd] shadow-none">
      <IconButton
        type="button"
        onClick={() => onRemove(run.id)}
        aria-label={`${run.title} を比較候補から削除`}
        title="削除"
        variant="overlay"
        size="sm"
        className="absolute right-2 top-2 z-10 h-7 w-7 shadow"
      >
        <XIcon className="h-4 w-4" />
      </IconButton>
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
    </CardShell>
  );
}

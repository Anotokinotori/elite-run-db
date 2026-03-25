import type { FormEvent } from "react";

import type { RunRecord } from "../../data/mockRuns";
import { LikeIcon, ShareIcon } from "../../components/UiIcons";

import { collapsedCopyStyle, DETAIL_LIKE_ACTIVE_ICON_CLASS } from "./recordDetailConfig";
import { CircleAvatar, DETAIL_MUTED_SURFACE_CLASS, PillButton, PlatformLabel, SectionTitle, TagChip, VideoFrame } from "./recordDetailUi";

export function RecordDetailMainColumn({
  currentRun,
  comments,
  commentDraft,
  commentLikeState,
  compareOpen,
  forceMobileLayout,
  descriptionExpanded,
  liked,
  shared,
  canExpandDescription,
  shouldShowExpandedArea,
  visibleTags,
  mainVideoIframeRef,
  onToggleLike,
  onToggleShare,
  onToggleDescription,
  onCommentDraftChange,
  onCommentSubmit,
  onCommentLike,
}: {
  currentRun: RunRecord;
  comments: RunRecord["comments"];
  commentDraft: string;
  commentLikeState: Record<string, boolean>;
  compareOpen: boolean;
  forceMobileLayout: boolean;
  descriptionExpanded: boolean;
  liked: boolean;
  shared: boolean;
  canExpandDescription: boolean;
  shouldShowExpandedArea: boolean;
  visibleTags: string[];
  mainVideoIframeRef: React.RefObject<HTMLIFrameElement | null>;
  onToggleLike: () => void;
  onToggleShare: () => void;
  onToggleDescription: () => void;
  onCommentDraftChange: (value: string) => void;
  onCommentSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCommentLike: (commentId: string) => void;
}) {
  return (
    <section className={`flex min-w-0 flex-1 flex-col gap-[18px] ${compareOpen ? "lg:flex-none" : "lg:flex-[1_1_auto]"}`}>
      <VideoFrame title={currentRun.title} videoUrl={currentRun.videoUrl} iframeRef={mainVideoIframeRef} autoplay mute />

      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[12px]">
          <div className="text-[16px] font-bold leading-none text-white md:text-[18px]">{currentRun.title}</div>
          <div className={`flex gap-[12px] ${compareOpen ? "flex-col items-start" : "items-center justify-between"}`}>
            <div className="flex min-w-0 items-center gap-[12px]">
              <CircleAvatar label={currentRun.userName} size={40} />
              <div className="truncate text-[16px] font-bold leading-none text-white md:text-[18px]">{currentRun.userName}</div>
            </div>
            <div className={`flex gap-[12px] md:gap-[12px] ${compareOpen ? "w-full shrink min-w-0 flex-wrap" : "shrink-0 flex-nowrap"}`}>
              <PillButton
                active={liked}
                onClick={onToggleLike}
                className={`min-h-[36px] min-w-[92px] ${liked ? "border border-white/10 bg-[#272727] text-white/90 hover:bg-[#303030]" : ""}`}
              >
                <LikeIcon filled={liked} className={`h-4 w-4 ${liked ? DETAIL_LIKE_ACTIVE_ICON_CLASS : ""}`} />
                <span>いいね</span>
              </PillButton>
              <PillButton active={shared} onClick={onToggleShare} className="min-h-[36px] min-w-[92px]">
                <ShareIcon className="h-4 w-4" />
                <span>共有</span>
              </PillButton>
            </div>
          </div>
        </div>

        <div className={`w-full ${DETAIL_MUTED_SURFACE_CLASS} p-[12px]`}>
          <div className={`flex gap-[16px] ${compareOpen ? "flex-col items-start whitespace-normal" : "items-center justify-between whitespace-nowrap"}`}>
            <div className={`flex min-w-0 gap-x-[16px] text-[13px] text-white/74 md:gap-x-[18px] md:text-[14px] ${compareOpen ? "flex-wrap items-center gap-y-[6px]" : "items-center"}`}>
              <span>ver : {currentRun.versionLabel}</span>
              <span>{currentRun.postedLabel}</span>
              <PlatformLabel platform={currentRun.platform} />
            </div>
            {canExpandDescription && !descriptionExpanded ? (
              <button
                type="button"
                onClick={onToggleDescription}
                className={`shrink-0 text-right text-white/78 ${forceMobileLayout ? "text-[13px]" : "text-[13px] md:text-[14px]"}`}
              >
                ...もっと見る
              </button>
            ) : null}
          </div>

          {shouldShowExpandedArea ? (
            <div className="mt-[12px] space-y-[12px]">
              <p className={`whitespace-pre-line leading-[1.75] text-white/88 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`} style={descriptionExpanded ? undefined : collapsedCopyStyle}>
                {currentRun.summary}
              </p>
              <div className="flex flex-wrap gap-[10px] md:gap-[12px]">
                {visibleTags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[12px]">
          <SectionTitle>{comments.length}件のコメント</SectionTitle>
          <form onSubmit={onCommentSubmit} className="flex w-full items-center gap-[8px]">
            <CircleAvatar label="You" size={36} />
            <div className="flex flex-1 items-center justify-between border-b border-white/12 p-[8px] transition focus-within:border-white/30">
              <input
                value={commentDraft}
                onChange={(event) => onCommentDraftChange(event.target.value)}
                placeholder="コメントする..."
                className={`min-w-0 flex-1 border-none bg-transparent text-white outline-none placeholder:text-white/36 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}
              />
              <PillButton className="ml-[8px] min-h-[30px] shrink-0 whitespace-nowrap px-[12px] py-[5px] text-[12px] md:text-[13px]">送信</PillButton>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-[20px] md:gap-[24px]">
          {comments.map((comment) => (
            <article key={comment.id} className="flex items-start gap-[12px]">
              <CircleAvatar label={comment.userName} size={40} />
              <div className="flex min-w-0 flex-1 flex-col gap-[8px] justify-center">
                <div className={`flex flex-wrap items-center gap-[8px] text-white/88 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}>
                  <span>{comment.userName}</span>
                  <span className="text-white/42">{comment.postedLabel}</span>
                </div>
                <div className={`leading-[1.75] text-white/74 ${forceMobileLayout ? "text-[14px]" : "text-[14px] md:text-[15px]"}`}>{comment.body}</div>
                <div className={`flex gap-[12px] md:gap-[12px] ${compareOpen ? "w-full shrink min-w-0 flex-wrap" : "shrink-0 flex-nowrap"}`}>
                  <PillButton className="px-[8px] py-[4px] text-[11px] md:text-[12px]" onClick={() => onCommentLike(comment.id)}>
                    <LikeIcon filled={Boolean(commentLikeState[comment.id])} className={`h-3 w-3 ${commentLikeState[comment.id] ? DETAIL_LIKE_ACTIVE_ICON_CLASS : ""}`} />
                    <span>いいね</span>
                  </PillButton>
                  <PillButton className="px-[8px] py-[4px] text-[11px] md:text-[12px]">返信</PillButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

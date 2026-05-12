import { useCallback, useEffect, useRef, useState } from "react";

type UseTopCarouselOptions = {
  enabled: boolean;
  contentKey: string;
  topPanelAutoscrollMs: number;
  featuredPanelAutoscrollMs: number;
  scrollDurationMs: number;
};

type InternalCarouselIndex = 0 | 1 | 2;
type VisibleCarouselIndex = 0 | 1;

const SCROLL_SETTLE_MS = 140;

function easeInOut(progress: number) {
  return 0.5 - Math.cos(progress * Math.PI) / 2;
}

export function useTopCarousel({
  enabled,
  contentKey,
  topPanelAutoscrollMs,
  featuredPanelAutoscrollMs,
  scrollDurationMs,
}: UseTopCarouselOptions) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const measureFrameRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const autoScrollTimerRef = useRef<number | null>(null);
  const scrollSettleTimerRef = useRef<number | null>(null);
  const programmaticScrollRef = useRef(false);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [index, setIndex] = useState<InternalCarouselIndex>(0);
  const [settleVersion, setSettleVersion] = useState(0);

  const clearAutoScrollTimer = useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);

  const clearScrollSettleTimer = useCallback(() => {
    if (scrollSettleTimerRef.current !== null) {
      window.clearTimeout(scrollSettleTimerRef.current);
      scrollSettleTimerRef.current = null;
    }
  }, []);

  const cancelScrollAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const getPanels = useCallback(() => {
    if (!rowRef.current) {
      return [] as HTMLElement[];
    }

    return Array.from(rowRef.current.querySelectorAll<HTMLElement>("[data-top-panel]"));
  }, []);

  const updateOffsets = useCallback(() => {
    const panels = getPanels();
    const firstOffset = panels[0]?.offsetLeft ?? 0;

    setOffsets(panels.map((panel) => panel.offsetLeft - firstOffset));
  }, [getPanels]);

  const getNearestIndex = useCallback((): InternalCarouselIndex => {
    const viewport = viewportRef.current;

    if (!viewport || offsets.length === 0) {
      return 0;
    }

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    offsets.forEach((offset, offsetIndex) => {
      const distance = Math.abs(viewport.scrollLeft - offset);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = offsetIndex;
      }
    });

    return Math.min(nearestIndex, 2) as InternalCarouselIndex;
  }, [offsets]);

  const settleScrollPosition = useCallback(() => {
    const viewport = viewportRef.current;
    const nearestIndex = getNearestIndex();

    if (nearestIndex === 2 && viewport && offsets[0] !== undefined) {
      programmaticScrollRef.current = true;
      viewport.scrollTo({ left: offsets[0], behavior: "auto" });
      setIndex(0);

      window.setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 0);
    } else {
      programmaticScrollRef.current = false;
      setIndex(nearestIndex === 1 ? 1 : 0);
    }

    setSettleVersion((version) => version + 1);
  }, [getNearestIndex, offsets]);

  const scheduleScrollSettle = useCallback(() => {
    clearScrollSettleTimer();
    scrollSettleTimerRef.current = window.setTimeout(() => {
      scrollSettleTimerRef.current = null;
      settleScrollPosition();
    }, SCROLL_SETTLE_MS);
  }, [clearScrollSettleTimer, settleScrollPosition]);

  const animateScrollTo = useCallback(
    (targetOffset: number) => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      cancelScrollAnimation();
      clearScrollSettleTimer();
      programmaticScrollRef.current = true;

      const startOffset = viewport.scrollLeft;
      const distance = targetOffset - startOffset;

      if (Math.abs(distance) < 1) {
        viewport.scrollTo({ left: targetOffset, behavior: "auto" });
        scheduleScrollSettle();
        return;
      }

      const startTime = window.performance.now();

      const step = (time: number) => {
        const progress = Math.min((time - startTime) / scrollDurationMs, 1);
        viewport.scrollLeft = startOffset + distance * easeInOut(progress);

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        animationFrameRef.current = null;
        scheduleScrollSettle();
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    },
    [cancelScrollAnimation, clearScrollSettleTimer, scheduleScrollSettle, scrollDurationMs],
  );

  const scrollToIndex = useCallback(
    (nextIndex: InternalCarouselIndex) => {
      const targetOffset = offsets[nextIndex];

      if (targetOffset === undefined) {
        return;
      }

      clearAutoScrollTimer();
      setIndex(nextIndex);
      animateScrollTo(targetOffset);
    },
    [animateScrollTo, clearAutoScrollTimer, offsets],
  );

  useEffect(() => {
    if (!enabled || !rowRef.current) {
      return;
    }

    clearAutoScrollTimer();
    clearScrollSettleTimer();
    cancelScrollAnimation();
    programmaticScrollRef.current = true;
    setIndex(0);
    setSettleVersion((version) => version + 1);

    if (measureFrameRef.current !== null) {
      window.cancelAnimationFrame(measureFrameRef.current);
    }

    measureFrameRef.current = window.requestAnimationFrame(() => {
      updateOffsets();
      viewportRef.current?.scrollTo({ left: 0, behavior: "auto" });
      programmaticScrollRef.current = false;
    });

    const observer = new ResizeObserver(() => {
      updateOffsets();
    });

    observer.observe(rowRef.current);
    getPanels().forEach((panel) => observer.observe(panel));

    return () => {
      clearAutoScrollTimer();
      clearScrollSettleTimer();
      cancelScrollAnimation();
      observer.disconnect();

      if (measureFrameRef.current !== null) {
        window.cancelAnimationFrame(measureFrameRef.current);
        measureFrameRef.current = null;
      }
    };
  }, [
    cancelScrollAnimation,
    clearAutoScrollTimer,
    clearScrollSettleTimer,
    contentKey,
    enabled,
    getPanels,
    updateOffsets,
  ]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!enabled || !viewport || offsets.length < 3 || programmaticScrollRef.current) {
      return;
    }

    const targetIndex = index === 2 ? 0 : index;
    const targetOffset = offsets[targetIndex];

    if (targetOffset !== undefined && Math.abs(viewport.scrollLeft - targetOffset) > 1) {
      viewport.scrollTo({ left: targetOffset, behavior: "auto" });
    }
  }, [enabled, index, offsets]);

  useEffect(() => {
    if (!enabled || offsets.length < 3 || index === 2) {
      return;
    }

    clearAutoScrollTimer();

    const waitMs = index === 0 ? topPanelAutoscrollMs : featuredPanelAutoscrollMs;
    autoScrollTimerRef.current = window.setTimeout(() => {
      scrollToIndex(index === 0 ? 1 : 2);
    }, waitMs);

    return clearAutoScrollTimer;
  }, [
    clearAutoScrollTimer,
    enabled,
    featuredPanelAutoscrollMs,
    index,
    offsets.length,
    scrollToIndex,
    settleVersion,
    topPanelAutoscrollMs,
  ]);

  const handleScroll = useCallback(() => {
    if (!enabled) {
      return;
    }

    if (!programmaticScrollRef.current) {
      clearAutoScrollTimer();
      cancelScrollAnimation();
    }

    scheduleScrollSettle();
  }, [cancelScrollAnimation, clearAutoScrollTimer, enabled, scheduleScrollSettle]);

  const jumpTo = (nextIndex: VisibleCarouselIndex) => {
    scrollToIndex(nextIndex);
  };

  return {
    index: index === 1 ? 1 : 0,
    viewportRef,
    rowRef,
    handleScroll,
    jumpTo,
  };
}

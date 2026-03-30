import { useEffect, useRef, useState } from "react";

type UseTopCarouselOptions = {
  enabled: boolean;
  contentKey: string;
  topPanelAutoscrollMs: number;
  featuredPanelAutoscrollMs: number;
  scrollDurationMs: number;
};

export function useTopCarousel({
  enabled,
  contentKey,
  topPanelAutoscrollMs,
  featuredPanelAutoscrollMs,
  scrollDurationMs,
}: UseTopCarouselOptions) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const measureFrameRef = useRef<number | null>(null);
  const autoScrollTimerRef = useRef<number | null>(null);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const clearAutoScrollTimer = () => {
    if (autoScrollTimerRef.current !== null) {
      window.clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  };

  const getPanels = () => {
    if (!rowRef.current) {
      return [] as HTMLElement[];
    }

    return Array.from(rowRef.current.querySelectorAll<HTMLElement>("[data-top-panel]"));
  };

  const updateOffsets = () => {
    setOffsets(getPanels().map((panel) => panel.offsetLeft));
  };

  useEffect(() => {
    if (!enabled || !rowRef.current) {
      return;
    }

    clearAutoScrollTimer();
    setTransitionEnabled(false);
    setIndex(0);

    if (measureFrameRef.current !== null) {
      window.cancelAnimationFrame(measureFrameRef.current);
    }

    measureFrameRef.current = window.requestAnimationFrame(() => {
      updateOffsets();
    });

    const observer = new ResizeObserver(() => {
      updateOffsets();
    });

    observer.observe(rowRef.current);
    getPanels().forEach((panel) => observer.observe(panel));

    return () => {
      clearAutoScrollTimer();
      observer.disconnect();
      if (measureFrameRef.current !== null) {
        window.cancelAnimationFrame(measureFrameRef.current);
        measureFrameRef.current = null;
      }
    };
  }, [contentKey, enabled]);

  useEffect(() => {
    if (!enabled || offsets.length < 3 || index === 2) {
      return;
    }

    clearAutoScrollTimer();

    const waitMs = index === 0 ? topPanelAutoscrollMs : featuredPanelAutoscrollMs;
    autoScrollTimerRef.current = window.setTimeout(() => {
      setTransitionEnabled(true);
      setIndex(index === 0 ? 1 : 2);
    }, waitMs);

    return clearAutoScrollTimer;
  }, [enabled, featuredPanelAutoscrollMs, index, offsets, topPanelAutoscrollMs]);

  const jumpTo = (nextIndex: 0 | 1) => {
    clearAutoScrollTimer();
    setTransitionEnabled(true);
    setIndex(nextIndex);
  };

  const handleTransitionEnd = () => {
    if (index !== 2) {
      return;
    }

    // 3 枚目は 1 枚目の複製。アニメーション後に 0 へ戻して無限ループ風に見せる。
    setTransitionEnabled(false);
    setIndex(0);
  };

  return {
    rowRef,
    style: {
      transform: `translateX(-${offsets[index] ?? 0}px)`,
      transitionProperty: "transform",
      transitionDuration: transitionEnabled ? `${scrollDurationMs}ms` : "0ms",
      transitionTimingFunction: "ease-in-out",
    },
    handleTransitionEnd,
    jumpTo,
  };
}

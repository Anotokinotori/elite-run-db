import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ElementSize = {
  width: number;
  height: number;
};

export function useElementSize<TElement extends HTMLElement>(initialSize: ElementSize) {
  const ref = useRef<TElement | null>(null);
  const [size, setSize] = useState<ElementSize>(initialSize);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return [ref, size] as const;
}

export function useUniformScale({
  baseWidth,
  horizontalInset = 0,
}: {
  baseWidth: number;
  horizontalInset?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportSafeWidth = Math.max(0, viewportWidth - horizontalInset);
    return Math.min(1, viewportSafeWidth / baseWidth);
  });

  useLayoutEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    const updateScale = () => {
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportSafeWidth = Math.max(0, viewportWidth - horizontalInset);
      const availableWidth = Math.min(containerElement.clientWidth || viewportSafeWidth, viewportSafeWidth);
      setScale(Math.min(1, availableWidth / baseWidth));
    };

    updateScale();
    const animationFrame = window.requestAnimationFrame(updateScale);
    const resizeObserver = new ResizeObserver(updateScale);

    resizeObserver.observe(containerElement);
    window.addEventListener("resize", updateScale);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [baseWidth, horizontalInset]);

  return { containerRef, scale };
}

export function useOneShotReveal<TElement extends HTMLElement = HTMLDivElement>({
  initialViewportRatio = 0.7,
  rootMargin = "0px 0px -30% 0px",
  threshold = 0.01,
  triggerKey,
}: {
  initialViewportRatio?: number;
  rootMargin?: string;
  threshold?: number;
  triggerKey?: string;
} = {}) {
  const ref = useRef<TElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || typeof window === "undefined") {
      return;
    }

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    if (element.getBoundingClientRect().top < window.innerHeight * initialViewportRatio) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      {
        root: null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [initialViewportRatio, isVisible, rootMargin, threshold, triggerKey]);

  return { isVisible, ref };
}

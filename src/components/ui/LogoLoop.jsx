// src/components/ui/LogoLoop.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import "./LogoLoop.css"; // keep your CSS file

/********************
 * Config & helpers
 ********************/
const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const toCssLength = (value) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;
const nearlyEqual = (a, b, eps = 0.5) => Math.abs(a - b) < eps;

/********************
 * Hooks (optimized)
 ********************/

/**
 * useRafResizeObserver
 * - Debounced using requestAnimationFrame
 * - Works with ResizeObserver if available, otherwise falls back to window resize
 */
const useRafResizeObserver = (cb, refs = [], deps = []) => {
  const rafRef = useRef(null);

  useEffect(() => {
    const run = () => {
      rafRef.current = null;
      cb();
    };

    if (typeof ResizeObserver === "undefined") {
      const handler = () => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(run);
      };
      window.addEventListener("resize", handler, { passive: true });
      // initial
      handler();
      return () => {
        window.removeEventListener("resize", handler);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const observers = refs.map((ref) => {
      if (!ref?.current) return null;
      const ro = new ResizeObserver(() => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(run);
      });
      ro.observe(ref.current);
      return ro;
    });

    // initial call
    if (!rafRef.current) rafRef.current = requestAnimationFrame(run);

    return () => {
      observers.forEach((o) => o?.disconnect?.());
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, ...refs, ...deps]);
};

/**
 * useImageLoader
 * - Waits until imgs inside seqRef are loaded, then calls onLoad
 * - Uses { once: true } listeners to avoid allocations per frame
 */
const useImageLoader = (seqRef, onLoad, deps = []) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remaining = images.length;
    const once = () => {
      remaining -= 1;
      if (remaining <= 0) onLoad();
    };
    images.forEach((img) => {
      if (img.complete) {
        once();
      } else {
        img.addEventListener("load", once, { once: true });
        img.addEventListener("error", once, { once: true });
      }
    });
    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", once);
        img.removeEventListener("error", once);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seqRef, onLoad, ...deps]);
};

/**
 * useAnimationLoop
 * - Stable, uses RAF
 * - Clamps large delta times and smooths velocity
 * - Minimizes writes to `track.style.transform`
 */
const useAnimationLoop = (
  trackRef,
  targetVelocity,
  seqWidth,
  seqHeight,
  isHovered,
  hoverSpeed,
  isVertical
) => {
  const rafRef = useRef(null);
  const lastTsRef = useRef(0);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Browser hint
    track.style.willChange = "transform";

    const seqSize = isVertical ? seqHeight : seqWidth;
    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const initTf = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = initTf;
    }

    const SMOOTH_TAU = ANIMATION_CONFIG.SMOOTH_TAU;

    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      let delta = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      // clamp delta to avoid huge jumps (tab inactive)
      if (delta > 0.05) delta = 0.05;

      const effectiveTarget =
        isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      // exponential smoothing
      const alpha = 1 - Math.exp(-delta / SMOOTH_TAU);
      velocityRef.current += (effectiveTarget - velocityRef.current) * alpha;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * delta;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;

        if (!nearlyEqual(nextOffset, offsetRef.current)) {
          offsetRef.current = nextOffset;
          const tf = isVertical
            ? `translate3d(0, ${-offsetRef.current}px, 0)`
            : `translate3d(${-offsetRef.current}px, 0, 0)`;
          track.style.transform = tf;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTsRef.current = 0;
      // keep willChange (optional), clearing can cause repaint
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trackRef,
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    hoverSpeed,
    isVertical,
  ]);
};

/********************
 * LogoLoop component
 ********************/
function LogoLoop({
  logos = [],
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 48,
  gap = 32,
  pauseOnHover = true,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Partner logos",
  className,
  style,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  // compute effective hover speed
  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover === true) return 0;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const isVertical = useMemo(
    () => direction === "up" || direction === "down",
    [direction]
  );

  // signed velocity (pixels/second)
  const targetVelocity = useMemo(() => {
    const mag = Math.abs(speed);
    let dirMul;
    if (isVertical) {
      dirMul = direction === "up" ? 1 : -1;
    } else {
      dirMul = direction === "left" ? 1 : -1;
    }
    const speedMul = speed < 0 ? -1 : 1;
    return mag * dirMul * speedMul;
  }, [speed, direction, isVertical]);

  // update dimensions (stable callback)
  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    const seqEl = seqRef.current;
    if (!container || !seqEl) return;

    const containerWidth = container.clientWidth || 0;
    const seqRect = seqEl.getBoundingClientRect();
    const sequenceWidth = Math.round(seqRect.width || 0);
    const sequenceHeight = Math.round(seqRect.height || 0);

    if (isVertical) {
      const parentHeight = container.parentElement?.clientHeight ?? 0;
      if (parentHeight > 0) {
        const targetHeight = Math.ceil(parentHeight);
        if (container.style.height !== `${targetHeight}px`) {
          container.style.height = `${targetHeight}px`;
        }
      }
      if (sequenceHeight > 0) {
        setSeqHeight(sequenceHeight);
        const viewport = container.clientHeight || parentHeight || sequenceHeight;
        const copiesNeeded =
          Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    } else {
      if (sequenceWidth > 0) {
        setSeqWidth(sequenceWidth);
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }
  }, [isVertical]);

  // observe sizes (optimized)
  useRafResizeObserver(updateDimensions, [containerRef, seqRef], [
    logos,
    gap,
    logoHeight,
    isVertical,
  ]);

  // wait for images to load inside seqRef
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);

  // start animation (optimized)
  useAnimationLoop(
    trackRef,
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    effectiveHoverSpeed,
    isVertical
  );

  // css variables and root class (memoized)
  const cssVariables = useMemo(
    () => ({
      "--logoloop-gap": `${gap}px`,
      "--logoloop-logoHeight": `${logoHeight}px`,
      ...(fadeOutColor ? { "--logoloop-fadeColor": fadeOutColor } : {}),
    }),
    [gap, logoHeight, fadeOutColor]
  );

  const rootClassName = useMemo(() => {
    return [
      "logoloop",
      isVertical ? "logoloop--vertical" : "logoloop--horizontal",
      fadeOut && "logoloop--fade",
      scaleOnHover && "logoloop--scale-hover",
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }, [isVertical, fadeOut, scaleOnHover, className]);

  const handleMouseEnter = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(true);
  }, [effectiveHoverSpeed]);

  const handleMouseLeave = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(false);
  }, [effectiveHoverSpeed]);

  // render item helpers (memoized to avoid re-creating closures)
  const renderDefaultItem = useCallback((item, key) => {
    const isNodeItem = "node" in item || "icon" in item;
    const content = isNodeItem ? (
      <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
        {item.node ?? item.icon}
      </span>
    ) : (
      <img
        src={item.src}
        srcSet={item.srcSet}
        sizes={item.sizes}
        width={item.width}
        height={item.height}
        alt={item.alt ?? ""}
        title={item.title}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );

    const itemAriaLabel = isNodeItem ? item.ariaLabel ?? item.title : item.alt ?? item.title;
    const itemContent = item.href ? (
      <a
        className="logoloop__link"
        href={item.href}
        aria-label={itemAriaLabel || "logo link"}
        target="_blank"
        rel="noreferrer noopener"
      >
        {content}
      </a>
    ) : (
      content
    );

    return (
      <li className="logoloop__item" key={key} role="listitem">
        {itemContent}
      </li>
    );
  }, []);

  const renderLogoItem = useCallback(
    (item, key) => {
      if (renderItem) {
        // keep the list wrapper at this level so LogoLoop's DOM shape remains stable
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {renderItem(item, key)}
          </li>
        );
      }
      return renderDefaultItem(item, key);
    },
    [renderItem, renderDefaultItem]
  );

  // memoize the repeated lists - only recalculates when copyCount / logos / renderLogoItem change
  const logoLists = useMemo(() => {
    // create an array of list copies
    const arr = new Array(copyCount);
    for (let copyIndex = 0; copyIndex < copyCount; copyIndex++) {
      arr[copyIndex] = (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) =>
            renderLogoItem(item, `${copyIndex}-${itemIndex}`)
          )}
        </ul>
      );
    }
    return arr;
  }, [copyCount, logos, renderLogoItem]);

  const containerStyle = useMemo(
    () => ({
      width: isVertical
        ? toCssLength(width) === "100%"
          ? undefined
          : toCssLength(width)
        : toCssLength(width) ?? "100%",
      ...cssVariables,
      ...style,
    }),
    [width, cssVariables, style, isVertical]
  );

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {logoLists}
      </div>
    </div>
  );
}

/* export default the memoized component so consumers can import default */
const MemoLogoLoop = memo(LogoLoop);
MemoLogoLoop.displayName = "LogoLoop";
export default MemoLogoLoop;

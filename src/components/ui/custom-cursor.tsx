/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Cursor targets use hover-only affordances. */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cursor targets are decorative hover zones. */

"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  type MotionValue,
  type SpringOptions,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import React, {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_CURSOR_COLOR = "#ff4c24";
const HOVER_FILL_COLOR = "#ff0000";

// Snappy cubic-bezier curve for sub-0.2s state transitions
const CURSOR_EASE = [0.2, 0.9, 0.3, 1.2] as const;

// Base geometry for transform-only animations (never animate width/height)
const BASE_DIAMETER = 88;

const customCursorVariants = cva("relative select-none", {
  variants: {
    layout: {
      default: "",
      demo: "flex min-h-72 items-center justify-center",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

const customCursorTargetVariants = cva(
  "flex items-center justify-center text-foreground transition-opacity hover:opacity-80",
  {
    variants: {
      size: {
        sm: "size-10",
        md: "size-14",
        lg: "size-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface CustomCursorContextValue {
  setIsHovering: (isHovering: boolean) => void;
  setLabel: (label: string) => void;
}

const CustomCursorContext = createContext<CustomCursorContextValue | null>(
  null
);

function useCustomCursorContext() {
  const context = useContext(CustomCursorContext);

  if (!context) {
    throw new Error(
      "CustomCursorTarget must be used within a CustomCursor provider."
    );
  }

  return context;
}

function useCoarsePointer() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setIsCoarsePointer(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return isCoarsePointer;
}

interface CursorState {
  isHovering: boolean;
  isPressed: boolean;
  label: string;
}

interface CursorViewProps {
  cursorState: CursorState;
  color: string;
  hoverColor: string;
  size: number;
  hoverSize: number;
  invertOnHover: boolean;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  cursorOpacity: MotionValue<number>;
}

/**
 * High-Performance Cursor View
 * Memoized with React.memo so mouse movement never re-renders React.
 * All animations execute entirely on the GPU compositor via transforms and opacity.
 */
const CursorView = React.memo(function CursorView({
  cursorState,
  color,
  hoverColor,
  size,
  hoverSize,
  invertOnHover,
  cursorX,
  cursorY,
  springX,
  springY,
  cursorOpacity,
}: CursorViewProps) {
  const { isHovering, isPressed, label } = cursorState;

  // Transform scale math against fixed 88px base
  let targetScale = size / BASE_DIAMETER; // ~17/88 (0.1932)
  if (label) {
    targetScale = 1.0; // 88px labeled pill
  } else if (isHovering) {
    targetScale = hoverSize / BASE_DIAMETER; // ~48/88 (0.5455)
  }

  if (isPressed) {
    targetScale *= 0.9;
  }

  // Calculate inset border thickness so on 88px base scaled to `size` (17px), visual stroke is 1.5px
  const idleBorderWidth = Math.round(1.5 * (BASE_DIAMETER / size) * 10) / 10;

  return (
    <>
      {/* 1. Instant 0-latency hardware dot (tracks raw pointer coordinates, no spring) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[101] will-change-transform transform-gpu rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: 3,
          height: 3,
          backgroundColor: color,
          opacity: cursorOpacity,
        }}
        animate={{
          scale: isHovering || Boolean(label) ? 0 : 1,
        }}
        transition={{
          duration: 0.15,
          ease: CURSOR_EASE,
        }}
      />

      {/* 2. Snappy follower circle (88px fixed base, animated solely with transform scale & opacity) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] will-change-transform transform-gpu flex items-center justify-center rounded-full overflow-hidden text-center"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: BASE_DIAMETER,
          height: BASE_DIAMETER,
          opacity: cursorOpacity,
        }}
        animate={{
          scale: targetScale,
          backgroundColor: label
            ? color
            : isHovering
            ? hoverColor
            : "transparent",
          boxShadow: isHovering || Boolean(label)
            ? "none"
            : `inset 0 0 0 ${idleBorderWidth}px ${color}`,
          mixBlendMode: isHovering && !label && invertOnHover ? "difference" : "normal",
        }}
        transition={{
          scale: { duration: 0.2, ease: CURSOR_EASE },
          backgroundColor: { duration: 0.2, ease: CURSOR_EASE },
          mixBlendMode: { duration: 0.1 },
        }}
      >
        {/* 3. Labeled state content (fade duration 0.15s) */}
        {label ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="text-[11px] font-mono font-bold uppercase tracking-wider text-white select-none px-2 line-clamp-1 max-w-[80px]"
          >
            {label}
          </motion.span>
        ) : null}
      </motion.div>
    </>
  );
});

export interface CustomCursorProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof customCursorVariants> {
  children?: ReactNode;
  /** Cursor border color in idle state. Defaults to #ff4c24. */
  color?: string;
  /** Hover fill color. Defaults to #ff0000. */
  hoverColor?: string;
  /** Idle outer circle diameter in px. Defaults to 17. */
  size?: number;
  /** Hover outer circle diameter in px. Defaults to 48. */
  hoverSize?: number;
  /** Whether to invert background content on hover with difference blend. Defaults to true. */
  invertOnHover?: boolean;
  /** Spring stiffness for near-instant follow. Defaults to 700. */
  followStiffness?: number;
  /** Spring damping for near-instant follow. Defaults to 45. */
  followDamping?: number;
  /** Spring mass for near-instant follow. Defaults to 0.25. */
  mass?: number;
  /** Override spring options for pointer follow. */
  followTransition?: SpringOptions;
}

function CustomCursor({
  children,
  className,
  color = DEFAULT_CURSOR_COLOR,
  hoverColor = HOVER_FILL_COLOR,
  size = 17,
  hoverSize = 48,
  invertOnHover = true,
  followStiffness = 700,
  followDamping = 45,
  mass = 0.25,
  followTransition,
  layout = "default",
  ...props
}: CustomCursorProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();

  // Cursor state triggers React re-renders ONLY on hover on/off, pressed on/off, or label changes
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isPressed: false,
    label: "",
  });

  // Motion values track pointer position directly without triggering React re-renders
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorOpacity = useMotionValue(0);

  // Stiffer, tighter spring for near-instant follower ring
  const springTransition = useMemo<SpringOptions>(
    () =>
      followTransition ?? {
        stiffness: followStiffness,
        damping: followDamping,
        mass: mass,
      },
    [followTransition, followStiffness, followDamping, mass]
  );

  const springX = useSpring(cursorX, springTransition);
  const springY = useSpring(cursorY, springTransition);

  // Context setters for CustomCursorTarget
  const setIsHovering = useCallback((isHovering: boolean) => {
    setCursorState((prev) =>
      prev.isHovering === isHovering ? prev : { ...prev, isHovering }
    );
  }, []);

  const setLabel = useCallback((label: string) => {
    setCursorState((prev) =>
      prev.label === label ? prev : { ...prev, label }
    );
  }, []);

  const contextValue = useMemo<CustomCursorContextValue>(
    () => ({
      setIsHovering,
      setLabel,
    }),
    [setIsHovering, setLabel]
  );

  // Refs for requestAnimationFrame throttling of pointerover / hover detection
  const stateRef = useRef(cursorState);
  stateRef.current = cursorState;

  useEffect(() => {
    if (isCoarsePointer || prefersReducedMotion) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    document.body.classList.add("custom-cursor-active");

    // 1. Passive pointermove updates motion values only - ZERO React state changes
    const handlePointerMove = (event: PointerEvent) => {
      // Reveal cursor on first movement without React re-render
      if (cursorOpacity.get() === 0) {
        cursorOpacity.set(1);
      }

      // Check coalesced events if available for high-poll-rate mice
      const coalesced = event.getCoalescedEvents?.();
      const latestEvent = coalesced && coalesced.length > 0
        ? coalesced[coalesced.length - 1]
        : event;

      cursorX.set(latestEvent.clientX);
      cursorY.set(latestEvent.clientY);
    };

    // 2. Tactile pressed state on pointerdown/up
    const handlePointerDown = () => {
      setCursorState((prev) => (prev.isPressed ? prev : { ...prev, isPressed: true }));
    };

    const handlePointerUp = () => {
      setCursorState((prev) => (!prev.isPressed ? prev : { ...prev, isPressed: false }));
    };

    // 3. Throttled hover & label detection: closest() runs at most ONCE per frame
    let rAFId = 0;
    let pendingTarget: HTMLElement | null = null;

    const processTarget = () => {
      rAFId = 0;
      if (!pendingTarget) return;

      const targetEl = pendingTarget;
      const interactiveEl = targetEl.closest<HTMLElement>(
        '[data-cursor], [data-cursor-label], [data-label], a, button, input, textarea, select, [role="button"], .folder-file-card, .profile-card, .cap-card, .gallery-card, .motion-toggle, .skip-link, .channel-link'
      );

      const nextHovering = Boolean(interactiveEl);
      const nextLabel =
        interactiveEl?.getAttribute("data-cursor-label") ||
        interactiveEl?.getAttribute("data-label") ||
        "";

      // Bail out early if hover and label states are unchanged
      const current = stateRef.current;
      if (current.isHovering !== nextHovering || current.label !== nextLabel) {
        setCursorState((prev) => ({
          ...prev,
          isHovering: nextHovering,
          label: nextLabel,
        }));
      }
    };

    const handlePointerOver = (event: MouseEvent) => {
      pendingTarget = event.target as HTMLElement | null;
      if (!rAFId) {
        rAFId = requestAnimationFrame(processTarget);
      }
    };

    const handlePointerOut = (event: MouseEvent) => {
      const related = event.relatedTarget as HTMLElement | null;
      if (!related || !document.body.contains(related)) {
        pendingTarget = null;
        if (!rAFId) {
          rAFId = requestAnimationFrame(processTarget);
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("mouseover", handlePointerOver, { passive: true });
    window.addEventListener("mouseout", handlePointerOut, { passive: true });

    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("mouseover", handlePointerOver);
      window.removeEventListener("mouseout", handlePointerOut);
    };
  }, [cursorX, cursorY, cursorOpacity, isCoarsePointer, prefersReducedMotion]);

  return (
    <CustomCursorContext.Provider value={contextValue}>
      <div
        className={cn(customCursorVariants({ layout, className }))}
        {...props}
      >
        {isCoarsePointer || prefersReducedMotion ? null : (
          <CursorView
            cursorState={cursorState}
            color={color}
            hoverColor={hoverColor}
            size={size}
            hoverSize={hoverSize}
            invertOnHover={invertOnHover}
            cursorX={cursorX}
            cursorY={cursorY}
            springX={springX}
            springY={springY}
            cursorOpacity={cursorOpacity}
          />
        )}
        {children}
      </div>
    </CustomCursorContext.Provider>
  );
}

export interface CustomCursorTargetProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof customCursorTargetVariants> {
  children?: ReactNode;
  /** Optional label displayed inside the cursor on hover. */
  label?: string;
}

function CustomCursorTarget({
  children,
  className,
  size,
  label = "",
  ...props
}: CustomCursorTargetProps) {
  const { setIsHovering, setLabel } = useCustomCursorContext();

  return (
    <div
      className={cn(customCursorTargetVariants({ size, className }))}
      data-cursor=""
      data-cursor-label={label}
      onMouseEnter={() => {
        setIsHovering(true);
        if (label) setLabel(label);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        if (label) setLabel("");
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  CustomCursor,
  CustomCursorTarget,
  customCursorTargetVariants,
  customCursorVariants,
};

export default CustomCursor;

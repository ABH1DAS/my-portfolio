/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Cursor targets use hover-only affordances. */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cursor targets are decorative hover zones. */

"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  type SpringOptions,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type MotionDivAnimate = NonNullable<
  ComponentProps<typeof motion.div>["animate"]
>;

const DEFAULT_CURSOR_COLOR = "#ff4c24";
const HOVER_FILL_COLOR = "#ff0000";

const CURSOR_EASE = [0.2, 0.9, 0.3, 1.2] as const;

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

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) {
    return `rgba(255, 76, 36, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

interface CursorAppearanceOptions {
  size?: number;
  hoverSize?: number;
  hoverColor?: string;
  invertOnHover?: boolean;
}

function resolveCursorAppearance(
  isHovering: boolean,
  color: string,
  options?: CursorAppearanceOptions
): MotionDivAnimate {
  const size = options?.size ?? 17;
  const hoverSize = options?.hoverSize ?? 44;
  const hoverColor = options?.hoverColor ?? HOVER_FILL_COLOR;
  const invert = options?.invertOnHover ?? true;

  if (!isHovering) {
    return {
      width: size,
      height: size,
      borderRadius: 9999,
      backgroundColor: "transparent",
      borderColor: color,
      borderWidth: 1.5,
      mixBlendMode: "normal",
      boxShadow: "none",
    };
  }

  return {
    width: hoverSize,
    height: hoverSize,
    borderRadius: 9999,
    backgroundColor: hoverColor,
    borderColor: "transparent",
    borderWidth: 0,
    mixBlendMode: invert ? "difference" : "normal",
    boxShadow: "none",
  };
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

export interface CustomCursorProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof customCursorVariants> {
  children?: ReactNode;
  /** Cursor border color in idle state. */
  color?: string;
  /** Hover fill color. Defaults to #ff0000. */
  hoverColor?: string;
  /** Idle outer circle diameter in px. Defaults to 17. */
  size?: number;
  /** Hover outer circle diameter in px. Defaults to 44. */
  hoverSize?: number;
  /** Whether to invert background content on hover. Defaults to true. */
  invertOnHover?: boolean;
  /** Spring damping for pointer follow. */
  followDamping?: number;
  /** Spring stiffness for pointer follow. */
  followStiffness?: number;
  /** Override spring options for pointer follow. */
  followTransition?: SpringOptions;
}

function CustomCursor({
  children,
  className,
  color = DEFAULT_CURSOR_COLOR,
  hoverColor = HOVER_FILL_COLOR,
  size = 17,
  hoverSize = 44,
  invertOnHover = true,
  followDamping = 22,
  followStiffness = 150,
  followTransition,
  layout = "default",
  ...props
}: CustomCursorProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springTransition = followTransition ?? {
    damping: followDamping,
    stiffness: followStiffness,
    mass: 0.8,
  };

  const springX = useSpring(cursorX, springTransition);
  const springY = useSpring(cursorY, springTransition);

  const contextValue = useMemo<CustomCursorContextValue>(
    () => ({
      setIsHovering,
    }),
    []
  );

  useEffect(() => {
    if (isCoarsePointer || prefersReducedMotion) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    document.body.classList.add("custom-cursor-active");

    const handlePointerMove = (event: PointerEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    const handlePointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          '[data-cursor], a, button, input, textarea, select, [role="button"], .folder-file-card, .profile-card, .cap-card, .gallery-card, .motion-toggle, .skip-link, .channel-link'
        )
      ) {
        setIsHovering(true);
      }
    };

    const handlePointerOut = (event: MouseEvent) => {
      const related = event.relatedTarget as HTMLElement | null;
      if (
        !related ||
        !related.closest(
          '[data-cursor], a, button, input, textarea, select, [role="button"], .folder-file-card, .profile-card, .cap-card, .gallery-card, .motion-toggle, .skip-link, .channel-link'
        )
      ) {
        setIsHovering(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mouseover", handlePointerOver);
    window.addEventListener("mouseout", handlePointerOut);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseover", handlePointerOver);
      window.removeEventListener("mouseout", handlePointerOut);
    };
  }, [cursorX, cursorY, isCoarsePointer, prefersReducedMotion, isVisible]);

  const appearance = resolveCursorAppearance(isHovering, color, {
    size,
    hoverSize,
    hoverColor,
    invertOnHover,
  });

  return (
    <CustomCursorContext.Provider value={contextValue}>
      <div
        className={cn(customCursorVariants({ layout, className }))}
        {...props}
      >
        {isCoarsePointer || prefersReducedMotion ? null : (
          <motion.div
            animate={appearance}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[100] border flex items-center justify-center"
            initial={false}
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
              opacity: isVisible ? 1 : 0,
            }}
            transition={{
              duration: 0.375,
              ease: CURSOR_EASE,
            }}
          >
            <motion.div
              animate={{
                opacity: isHovering ? 0 : 1,
                scale: isHovering ? 0 : 1,
              }}
              aria-hidden="true"
              className="pointer-events-none rounded-full"
              style={{
                width: 3,
                height: 3,
                backgroundColor: color,
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
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
}

function CustomCursorTarget({
  children,
  className,
  size,
  ...props
}: CustomCursorTargetProps) {
  const { setIsHovering } = useCustomCursorContext();

  return (
    <div
      className={cn(customCursorTargetVariants({ size, className }))}
      data-cursor=""
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
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

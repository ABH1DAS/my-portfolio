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

const DEFAULT_CURSOR_COLOR = "#ff4b1f";
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

function resolveCursorAppearance(
  isHovering: boolean,
  color: string
): MotionDivAnimate {
  if (!isHovering) {
    return {
      width: 17,
      height: 17,
      borderRadius: 9999,
      backgroundColor: "transparent",
      borderColor: color,
      borderWidth: 1.5,
      mixBlendMode: "normal",
      boxShadow: "none",
    };
  }

  return {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: "#ff0000",
    borderColor: "transparent",
    borderWidth: 0,
    mixBlendMode: "difference",
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
  /** Cursor fill and border color. */
  color?: string;
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
  followDamping = 22,
  followStiffness = 180,
  followTransition,
  layout = "default",
  ...props
}: CustomCursorProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springTransition = followTransition ?? {
    damping: followDamping,
    stiffness: followStiffness,
    mass: 0.8,
  };

  const springX = useSpring(cursorX, springTransition);
  const springY = useSpring(cursorY, springTransition);

  // Faster spring for inner 4px dot
  const springDotX = useSpring(cursorX, { damping: 30, stiffness: 350 });
  const springDotY = useSpring(cursorY, { damping: 30, stiffness: 350 });

  const contextValue = useMemo<CustomCursorContextValue>(
    () => ({
      setIsHovering,
    }),
    []
  );

  useEffect(() => {
    if (isCoarsePointer || prefersReducedMotion) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const el = event.target as Element | null;
      if (
        el?.closest(
          'a, button, input, textarea, select, [role="button"], h1, h2, h3, h4, p, li, b, small, [data-cursor], .folder-file-card, .profile-card, .depth-card, .cap-card, .proj, .gallery-card, [tabindex="0"]'
        )
      ) {
        setIsHovering(true);
      }
    };

    const handlePointerOut = (event: PointerEvent) => {
      const related = event.relatedTarget as Element | null;
      if (
        !related?.closest(
          'a, button, input, textarea, select, [role="button"], h1, h2, h3, h4, p, li, b, small, [data-cursor], .folder-file-card, .profile-card, .depth-card, .cap-card, .proj, .gallery-card, [tabindex="0"]'
        )
      ) {
        setIsHovering(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, [cursorX, cursorY, isCoarsePointer, prefersReducedMotion]);

  const appearance = resolveCursorAppearance(isHovering, color);

  return (
    <CustomCursorContext.Provider value={contextValue}>
      <div
        className={cn(customCursorVariants({ layout, className }))}
        {...props}
      >
        {isCoarsePointer || prefersReducedMotion ? null : (
          <>
            <motion.div
              animate={appearance}
              aria-hidden="true"
              className="pointer-events-none fixed top-0 left-0 z-[100]"
              initial={false}
              style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              transition={{
                duration: 0.26,
                ease: CURSOR_EASE,
              }}
            />
            <motion.div
              animate={{
                opacity: isHovering ? 0 : 1,
                scale: isHovering ? 0 : 1,
              }}
              aria-hidden="true"
              className="pointer-events-none fixed top-0 left-0 z-[101] size-1 rounded-full"
              initial={false}
              style={{
                x: springDotX,
                y: springDotY,
                backgroundColor: color,
                translateX: "-50%",
                translateY: "-50%",
              }}
              transition={{ duration: 0.2 }}
            />
          </>
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

"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
  type MotionValue,
} from "motion/react";

type CursorFollowContextValue = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};

const CursorFollowContext = createContext<CursorFollowContextValue | null>(null);

type CursorFollowProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "className" | "onPointerMove" | "onPointerLeave" | "onPointerCancel"
> & {
  children: ReactNode;
  className?: string;
};

export const CursorFollow = forwardRef<HTMLDivElement, CursorFollowProps>(
  function CursorFollow({ children, className, ...props }, ref) {
    const shouldReduceMotion = useReducedMotion();
    const targetX = useMotionValue(0);
    const targetY = useMotionValue(0);
    const springX = useSpring(targetX, {
      stiffness: 120,
      damping: 20,
      mass: 0.4,
    });
    const springY = useSpring(targetY, {
      stiffness: 120,
      damping: 20,
      mass: 0.4,
    });

    const reset = () => {
      targetX.set(0);
      targetY.set(0);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse" || shouldReduceMotion !== false) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

      targetX.set(Math.max(-1, Math.min(1, normalizedX)) * 4);
      targetY.set(Math.max(-1, Math.min(1, normalizedY)) * 4);
    };

    useEffect(() => {
      if (!shouldReduceMotion) {
        return;
      }

      targetX.jump(0);
      targetY.jump(0);
      springX.jump(0);
      springY.jump(0);
    }, [shouldReduceMotion, springX, springY, targetX, targetY]);

    return (
      <CursorFollowContext.Provider value={{ x: springX, y: springY }}>
        <div
          ref={ref}
          {...props}
          className={className}
          onPointerMove={handlePointerMove}
          onPointerLeave={reset}
          onPointerCancel={reset}
        >
          {children}
        </div>
      </CursorFollowContext.Provider>
    );
  },
);

export type CursorFollowTargetProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "style"
> & {
  children: ReactNode;
};

export function CursorFollowTarget({ children, ...props }: CursorFollowTargetProps) {
  const context = useContext(CursorFollowContext);
  if (!context) {
    throw new Error("CursorFollowTarget must be rendered inside CursorFollow.");
  }

  return (
    <motion.div {...props} style={{ x: context.x, y: context.y }}>
      {children}
    </motion.div>
  );
}

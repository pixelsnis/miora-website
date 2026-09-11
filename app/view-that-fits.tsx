"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type ViewThatFitsProps = {
  children: ReactNode;
  maxWidthFraction?: number;
  className?: string;
};

type FittedSize = {
  scale: number;
  width: number;
  height: number;
};

export function ViewThatFits({
  children,
  maxWidthFraction = 1,
  className,
}: ViewThatFitsProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitted, setFitted] = useState<FittedSize | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) {
      return;
    }

    const update = () => {
      const width = content.offsetWidth;
      const height = content.offsetHeight;
      const availableWidth = frame.clientWidth * maxWidthFraction;
      const scale = width > 0 ? Math.min(1, availableWidth / width) : 1;

      setFitted((current) => {
        if (
          current &&
          Math.abs(current.scale - scale) < 0.001 &&
          current.width === width &&
          current.height === height
        ) {
          return current;
        }

        return { scale, width, height };
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(content);

    return () => observer.disconnect();
  }, [maxWidthFraction]);

  return (
    <div
      ref={frameRef}
      className={["flex items-center justify-center", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="relative overflow-hidden"
        style={
          fitted
            ? {
                width: fitted.width * fitted.scale,
                height: fitted.height * fitted.scale,
              }
            : { visibility: "hidden" }
        }
      >
        <div
          ref={contentRef}
          className="w-max origin-top-left"
          style={{
            transform: fitted ? `scale(${fitted.scale})` : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useId, useRef } from "react";
import { RotateCcw, RotateCw } from "lucide-react";

const SkipAnimation = ({ direction, onAnimationEnd, duration = 600 }) => {
  // default duration bumped to 600ms for better UX; caller can override
  const id =
    typeof useId === "function"
      ? useId().replace(/[:]/g, "-")
      : `skip-${Math.random().toString(36).slice(2, 8)}`;
  const endedRef = useRef(false);
  const timeoutRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!direction) return;

    endedRef.current = false;
    clearTimeout(timeoutRef.current);

    const fallback = prefersReducedMotion ? 80 : duration + 150; // buffer
    timeoutRef.current = setTimeout(() => {
      if (!endedRef.current) {
        endedRef.current = true;
        onAnimationEnd?.();
      }
    }, fallback);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [direction, duration, onAnimationEnd, prefersReducedMotion]);

  if (!direction) return null;

  const spinName = `skip-spin-${id}`;
  const scaleName = `skip-scale-${id}`;

  const positionClass =
    direction === "forward"
      ? "justify-end right-6 sm:right-10"
      : "justify-start left-6 sm:left-10";

  const handleAnimationEnd = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    clearTimeout(timeoutRef.current);
    onAnimationEnd?.();
  };

  // make popup scale slightly longer than icon spin to allow icon to finish nicely.
  const scaleDuration = Math.round(duration * 1.15);
  const spinDuration = Math.round(duration * 1.5); // one rotation takes `duration` ms

  return (
    <div
      className={`absolute inset-y-0 flex items-center pointer-events-none z-50 ${positionClass}`}
      role="status"
      aria-live="polite"
      aria-label={
        direction === "forward"
          ? "Skipped forward 10 seconds"
          : "Skipped backward 10 seconds"
      }
    >
      <style>{`
        @keyframes ${scaleName} {
          0% { transform: scale(0.88); opacity: 0; }
          18% { transform: scale(1); opacity: 1; }
          82% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.92); opacity: 0; }
        }
        @keyframes ${spinName} {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .${scaleName} { animation: none !important; }
          .${spinName} { animation: none !important; }
        }
      `}</style>

      <div
        className="relative flex items-center justify-center rounded-full p-2 sm:p-3 bg-[var(--color-dark)]/80 shadow-md"
        style={
          prefersReducedMotion
            ? undefined
            : {
                animation: `${scaleName} ${scaleDuration}ms cubic-bezier(.2,.8,.2,1) both`,
              }
        }
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex items-center justify-center gap-1.5 text-[var(--color-primary)]">
          {direction === "forward" ? (
            <>
              <RotateCw
                className={`w-3 h-3 sm:w-5 sm:h-5 ${spinName}`}
                aria-hidden
                style={
                  prefersReducedMotion
                    ? undefined
                    : {
                        animation: `${spinName} ${spinDuration}ms cubic-bezier(.25,.8,.25,1) 1 both`,
                        transformOrigin: "50% 50%",
                      }
                }
              />
              <span className="text-xs sm:text-sm font-semibold pointer-events-none">
                +10s
              </span>
            </>
          ) : (
            <>
              <RotateCcw
                className={`w-3 h-3 sm:w-5 sm:h-5 ${spinName}`}
                aria-hidden
                style={
                  prefersReducedMotion
                    ? undefined
                    : {
                        animation: `${spinName} ${spinDuration}ms cubic-bezier(1,.25,.8,.25) 1 both`,
                        animationDirection: "reverse",
                        transformOrigin: "50% 50%",
                      }
                }
              />
              <span className="text-xs sm:text-sm font-semibold pointer-events-none">
                -10s
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkipAnimation;

import React, { useEffect, useRef } from "react";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && containerRef.current) {
      containerRef.current.style.animation =
        "scaleIn 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both";
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.style.animation = "";
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center p-4"
      role="alert"
      aria-label="Page not found"
    >
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.88); opacity: 0; }
          18% { transform: scale(1); opacity: 1; }
          82% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.92); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scaleIn { animation: none !important; }
        }
      `}</style>
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center gap-4 sm:gap-6 text-center bg-[var(--color-dark)]/90 rounded-xl shadow-lg p-6 sm:p-8 max-w-[98vw] sm:max-w-[90vw] lg:max-w-[60vw]"
      >
        <AlertTriangle
          size={48}
          className="text-[var(--color-primary)]"
          aria-hidden="true"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-100">404</h1>
        <p className="text-xs sm:text-sm font-mono text-purple-100">
          Oops! The page you're looking for cannot be found.
        </p>
        
      </div>
    </div>
  );
};

export default NotFound;

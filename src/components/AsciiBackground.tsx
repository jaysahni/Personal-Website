"use client";

import { useCallback, useEffect, useRef } from "react";

const CHAR_SET = [".", ":", ";", "+", "*", "~", "/", "\\", "|", "-", "_", "^"];
const CHAR_WIDTH = 8.4;
const CHAR_HEIGHT = 16;
const FONT_SIZE = 14;
const SWAP_INTERVAL = 200;
const SWAP_PERCENT = 0.05;

function randomChar(): string {
  return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
}

export default function AsciiBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLSpanElement[]>([]);
  const dimsRef = useRef<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildGrid = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth * 1.15;
    const height = window.innerHeight * 1.15;
    const cols = Math.ceil(width / CHAR_WIDTH);
    const rows = Math.ceil(height / CHAR_HEIGHT);

    dimsRef.current = { cols, rows };

    // Clear existing content
    container.innerHTML = "";
    gridRef.current = [];

    const totalChars = cols * rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const span = document.createElement("span");
        span.textContent = randomChar();
        container.appendChild(span);
      }
      // Add a line break after each row
      const br = document.createElement("br");
      container.appendChild(br);
    }

    // Collect all span elements for quick access during animation
    gridRef.current = Array.from(container.querySelectorAll("span"));
  }, []);

  const startAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const spans = gridRef.current;
      const total = spans.length;
      if (total === 0) return;

      const swapCount = Math.max(1, Math.floor(total * SWAP_PERCENT));

      for (let i = 0; i < swapCount; i++) {
        const idx = Math.floor(Math.random() * total);
        spans[idx].textContent = randomChar();
      }
    }, SWAP_INTERVAL);
  }, []);

  useEffect(() => {
    buildGrid();
    startAnimation();

    const handleResize = () => {
      buildGrid();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [buildGrid, startAnimation]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        fontFamily: "monospace",
        fontSize: `${FONT_SIZE}px`,
        lineHeight: `${CHAR_HEIGHT}px`,
        letterSpacing: "0px",
        color: "#71717A",
        opacity: 0.455,
        whiteSpace: "pre",
        userSelect: "none",
        width: "110vw",
        height: "110vh",
      }}
    />
  );
}

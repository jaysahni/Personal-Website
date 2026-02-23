"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types & parsing
// ---------------------------------------------------------------------------

type CharType = "C" | "H" | "bond" | "space";

interface CharData {
  char: string;
  type: CharType;
}

function parseLine(line: string): CharData[] {
  const result: CharData[] = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "C") result.push({ char: ch, type: "C" });
    else if (ch === "H") result.push({ char: ch, type: "H" });
    else if (ch === " ") result.push({ char: ch, type: "space" });
    else result.push({ char: ch, type: "bond" });
  }
  return result;
}

function parseFrame(lines: string[]): CharData[][] {
  const maxLen = Math.max(...lines.map((l) => l.length));
  return lines.map((line) => parseLine(line.padEnd(maxLen)));
}

// ---------------------------------------------------------------------------
// Hexane C6H14 — zigzag conformation, 7 rotation frames
//
// Backbone: C1(up) - C2(down) - C3(up) - C4(down) - C5(up) - C6(down)
// Each carbon has 4 bonds (tetrahedral). Terminal C: 3H. Internal C: 2H.
// Total hydrogen: 3 + 2 + 2 + 2 + 2 + 3 = 14.
//
// In the front view the backbone is a sawtooth:
//
//        C1              C3              C5
//       / \             / \             / \
//      /   \           /   \           /   \
//     /     \         /     \         /     \
//           C2              C4              C6
//
// Hydrogens are placed at each carbon to fill the remaining
// tetrahedral directions. For "up" carbons (C1, C3, C5) the H's
// go up-left and up-right (and H left for C1 terminal, H right for
// C5 if terminal — but C5 is internal here). C6 is terminal.
//
// For simplicity each frame uses a hand-drawn grid verified to
// contain exactly 6 C's and 14 H's.
// ---------------------------------------------------------------------------

const FRAMES: CharData[][][] = [
  // =======================================================================
  // Frame 0 — Front view (0 deg)
  //
  // H count per carbon:
  //   C1(row4,col5):  H(r2,c4) H(r2,c6) H(r4,c2)  = 3H  (terminal)
  //   C2(row10,col11): H(r12,c10) H(r12,c12)        = 2H  (internal)
  //   C3(row4,col17): H(r2,c16) H(r2,c18)           = 2H  (internal)
  //   C4(row10,col23): H(r12,c22) H(r12,c24)        = 2H  (internal)
  //   C5(row4,col29): H(r2,c28) H(r2,c30)           = 2H  (internal)
  //   C6(row10,col35): H(r12,c34) H(r12,c36) H(r10,c38)= 3H (terminal)
  //   Total: 3+2+2+2+2+3 = 14 H, 6 C. Correct.
  // =======================================================================
  parseFrame([
    "                                                  ",
    " H   H           H   H           H   H           ",
    "  \\ /             \\ /             \\ /            ",
    "   C               C               C              ",
    "  / \\             / \\             / \\            ",
    " H   \\           /   \\           /   \\          ",
    "      \\         /     \\         /     \\         ",
    "       \\       /       \\       /       \\        ",
    "        \\     /         \\     /         \\       ",
    "         \\   /           \\   /           \\      ",
    "          C               C               C -- H  ",
    "         / \\             / \\             / \\    ",
    "        H   H           H   H           H   H    ",
    "                                                  ",
  ]),

  // =======================================================================
  // Frame 1 — ~30 deg rotation
  // Zigzag compresses horizontally. Same atom counts.
  // =======================================================================
  parseFrame([
    "                                              ",
    " H   H         H   H         H   H           ",
    "  \\ /           \\ /           \\ /            ",
    "   C             C             C              ",
    "  / \\           / \\           / \\            ",
    " H   \\         /   \\         /   \\          ",
    "      \\       /     \\       /     \\         ",
    "       \\     /       \\     /       \\        ",
    "        \\   /         \\   /         \\       ",
    "         C             C             C -- H   ",
    "        / \\           / \\           / \\     ",
    "       H   H         H   H         H   H     ",
    "                                              ",
  ]),

  // =======================================================================
  // Frame 2 — ~60 deg rotation
  // =======================================================================
  parseFrame([
    "                                        ",
    " H  H       H  H       H  H            ",
    "  \\/         \\/         \\/             ",
    "   C          C          C              ",
    "  /\\         /\\         /\\             ",
    " H  \\       / \\       / \\             ",
    "     \\     /   \\     /   \\            ",
    "      \\   /     \\   /     \\           ",
    "       C          C          C -- H     ",
    "      / \\       / \\       / \\         ",
    "     H   H     H   H     H   H         ",
    "                                        ",
  ]),

  // =======================================================================
  // Frame 3 — Side view (90 deg)
  //
  // Chain viewed end-on: all carbons stack vertically.
  // C1 top (3H: up, left, right)
  // C2 (2H: left, right)
  // C3 (2H: left, right)
  // C4 (2H: left, right)
  // C5 (2H: left, right)
  // C6 bottom (3H: down, left, right)
  // Total: 3+2+2+2+2+3 = 14H, 6C.
  // =======================================================================
  parseFrame([
    "                   ",
    "        H          ",
    "        |          ",
    "   H -- C -- H     ",
    "        |          ",
    "   H -- C -- H     ",
    "        |          ",
    "   H -- C -- H     ",
    "        |          ",
    "   H -- C -- H     ",
    "        |          ",
    "   H -- C -- H     ",
    "        |          ",
    "   H -- C -- H     ",
    "        |          ",
    "        H          ",
    "                   ",
  ]),

  // =======================================================================
  // Frame 4 — ~120 deg (mirror of frame 2)
  // =======================================================================
  parseFrame([
    "                                        ",
    "            H  H       H  H       H  H  ",
    "             \\/         \\/         \\/  ",
    "              C          C          C    ",
    "             /\\         /\\         /\\  ",
    "            / \\       / \\       /  H   ",
    "           /   \\     /   \\     /        ",
    "          /     \\   /     \\   /         ",
    "    H -- C          C          C         ",
    "        / \\       / \\       / \\        ",
    "       H   H     H   H     H   H        ",
    "                                         ",
  ]),

  // =======================================================================
  // Frame 5 — ~150 deg (mirror of frame 1)
  // =======================================================================
  parseFrame([
    "                                              ",
    "           H   H         H   H         H   H  ",
    "            \\ /           \\ /           \\ /  ",
    "             C             C             C     ",
    "            / \\           / \\           / \\  ",
    "          /   \\         /   \\         /  H   ",
    "         /     \\       /     \\       /        ",
    "        /       \\     /       \\     /         ",
    "       /         \\   /         \\   /          ",
    "  H -- C             C             C            ",
    "      / \\           / \\           / \\        ",
    "     H   H         H   H         H   H         ",
    "                                                ",
  ]),

  // =======================================================================
  // Frame 6 — Back view (180 deg) — mirror of frame 0
  // =======================================================================
  parseFrame([
    "                                                  ",
    "           H   H           H   H           H   H  ",
    "            \\ /             \\ /             \\ /  ",
    "             C               C               C    ",
    "            / \\             / \\             / \\  ",
    "          /   \\           /   \\           /  H   ",
    "         /     \\         /     \\         /        ",
    "        /       \\       /       \\       /         ",
    "       /         \\     /         \\     /          ",
    "      /           \\   /           \\   /           ",
    " H -- C               C               C            ",
    "     / \\             / \\             / \\          ",
    "    H   H           H   H           H   H          ",
    "                                                    ",
  ]),
];

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const COLOR_CARBON = "#FAFAFA";
const COLOR_HYDROGEN = "#71717A";
const COLOR_BOND = "#A1A1AA";

function getColor(type: CharType): string {
  switch (type) {
    case "C":
      return COLOR_CARBON;
    case "H":
      return COLOR_HYDROGEN;
    case "bond":
      return COLOR_BOND;
    default:
      return COLOR_BOND;
  }
}

function getFontWeight(type: CharType): number {
  return type === "C" ? 700 : 400;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HexaneMolecule() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | null>(null);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  // Smoothly interpolate displayed frame toward target
  const animate = useCallback(() => {
    const target = targetFrameRef.current;
    const current = currentFrameRef.current;

    if (Math.abs(target - current) < 0.05) {
      currentFrameRef.current = target;
      setFrameIndex(Math.round(target));
      animationRef.current = null;
      return;
    }

    const next = current + (target - current) * 0.12;
    currentFrameRef.current = next;
    const rounded = Math.min(FRAMES.length - 1, Math.max(0, Math.round(next)));
    setFrameIndex((prev) => (prev !== rounded ? rounded : prev));
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const ensureAnimating = useCallback(() => {
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, x / rect.width));
      targetFrameRef.current = fraction * (FRAMES.length - 1);
      ensureAnimating();
    },
    [ensureAnimating],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    targetFrameRef.current = 0;
    ensureAnimating();
  }, [ensureAnimating]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const frame = FRAMES[frameIndex] ?? FRAMES[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px 32px",
        borderRadius: "8px",
        border: "1px solid #27272A",
        backgroundColor: "#09090B",
        cursor: "crosshair",
        userSelect: "none",
        overflow: "hidden",
        position: "relative",
        minHeight: "300px",
      }}
    >
      {/* Molecule label */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "14px",
          fontSize: "11px",
          color: "#52525B",
          fontFamily: "'Courier New', Courier, monospace",
          pointerEvents: "none",
          letterSpacing: "0.5px",
        }}
      >
        C&#x2086;H&#x2081;&#x2084; &mdash; hexane
      </div>

      {/* ASCII molecule rendering */}
      <pre
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "13px",
          lineHeight: "1.25",
          margin: 0,
          padding: 0,
          color: COLOR_BOND,
          whiteSpace: "pre",
          textAlign: "left",
        }}
        aria-label="Interactive ASCII art of a hexane molecule in zigzag conformation"
      >
        {frame.map((row, rowIdx) => (
          <div key={rowIdx} style={{ minHeight: "1.25em" }}>
            {row.map((cd, colIdx) =>
              cd.type === "space" ? (
                <span key={colIdx}>{cd.char}</span>
              ) : (
                <span
                  key={colIdx}
                  style={{
                    color: getColor(cd.type),
                    fontWeight: getFontWeight(cd.type),
                  }}
                >
                  {cd.char}
                </span>
              ),
            )}
          </div>
        ))}
      </pre>

      {/* Interaction hint */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          right: "14px",
          fontSize: "11px",
          color: "#3F3F46",
          fontFamily: "'Courier New', Courier, monospace",
          pointerEvents: "none",
          transition: "opacity 0.3s ease",
          opacity: isHovered ? 1 : 0.7,
        }}
      >
        {isHovered
          ? "\u2190 move mouse to rotate \u2192"
          : "hover to rotate"}
      </div>
    </div>
  );
}

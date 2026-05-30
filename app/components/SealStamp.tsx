"use client";

import { useId } from "react";

export function SealStamp({
  size = 156,
  pct,
  ringText = "VESSELIQ • CERTIFIED PASSPORT • VESSELIQ • CERTIFIED PASSPORT • ",
}: {
  size?: number;
  pct: number;
  ringText?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = cx - 6;
  const innerR = outerR - 14;
  const textPathR = outerR - 9;
  const scoreR = innerR - 16;
  const scoreC = 2 * Math.PI * scoreR;
  const scoreDash = (pct / 100) * scoreC;

  // Each SealStamp instance gets its own unique path id so multiple seals
  // on the same page (mobile + desktop responsive duplication, or several
  // seals in a guided tour panel) do not collide on a single id. Before
  // this, two seals shared id="seal-ring-path" and the desktop seal would
  // render its rotating text along the mobile seal's smaller circle path.
  const reactId = useId();
  const pathId = `seal-ring-path-${reactId.replace(/:/g, "")}`;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="absolute inset-0"
      >
        <defs>
          <path
            id={pathId}
            d={`M ${cx},${cy} m -${textPathR},0 a ${textPathR},${textPathR} 0 1,1 ${
              textPathR * 2
            },0 a ${textPathR},${textPathR} 0 1,1 -${textPathR * 2},0`}
          />
        </defs>
        <g className="seal-rotating" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="var(--brand-ink)" strokeWidth="1" />
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="none"
            stroke="var(--brand-ink)"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
          <text
            fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
            fontSize="8.5"
            letterSpacing="2.4"
            fill="var(--brand-ink)"
          >
            <textPath href={`#${pathId}`} startOffset="0">
              {ringText}
            </textPath>
          </text>
        </g>
        <circle
          cx={cx}
          cy={cy}
          r={scoreR}
          fill="none"
          stroke="var(--brand-line-strong)"
          strokeWidth="2"
        />
        <circle
          cx={cx}
          cy={cy}
          r={scoreR}
          fill="none"
          stroke="var(--brand-teal)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${scoreDash} ${scoreC}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="label" style={{ fontSize: Math.max(7.5, size * 0.055) }}>
          Confidence
        </span>
        <span
          className="font-serif text-ink leading-none"
          style={{ fontSize: Math.round(size * 0.22), marginTop: 4 }}
        >
          {pct}
        </span>
        <span className="label mt-1" style={{ fontSize: Math.max(7.5, size * 0.055) }}>
          of 100
        </span>
      </div>
    </div>
  );
}

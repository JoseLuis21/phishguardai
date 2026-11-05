import { useId } from "react";

import { cn } from "@/app/_utils/cn";

/**
 * Brand isotype from docs/logo/phishshield-isotipo.svg: an envelope inside
 * scan brackets with a checked shield. The shield takes the shell colour so it
 * reads as a cut-out over the envelope in both themes. Gradient ids are
 * per-instance because header and footer render it on the same page.
 */
export function Isotipo({ className }: { className?: string }) {
  const id = useId();
  const sobre = `${id}-sobre`;
  const marco = `${id}-marco`;

  return (
    <svg
      viewBox="88 74 350 370"
      aria-hidden
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={sobre} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="0.52" stopColor="#a8c8ff" />
          <stop offset="1" stopColor="#2679ff" />
        </linearGradient>
        <linearGradient id={marco} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#bb55ff" />
          <stop offset="1" stopColor="#713cff" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${marco})`} strokeWidth="17" strokeLinecap="square">
        <path d="M102 154V108Q102 88 122 88H173" />
        <path d="M339 88H390Q410 88 410 108V154" />
        <path d="M102 358V404Q102 424 122 424H173" />
      </g>
      <rect
        x="139"
        y="154"
        width="241"
        height="207"
        rx="27"
        fill="none"
        stroke={`url(#${sobre})`}
        strokeWidth="18"
      />
      <path
        d="M151 183L252 263L367 183"
        fill="none"
        stroke={`url(#${sobre})`}
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M150 345L217 276" fill="none" stroke="#3188ff" strokeWidth="16" strokeLinecap="round" />
      <path
        d="M285 262Q325 258 354 229Q383 258 423 262V329Q421 390 354 430Q287 390 285 329Z"
        fill="var(--shell)"
        stroke={`url(#${marco})`}
        strokeWidth="17"
        strokeLinejoin="round"
      />
      <path
        d="M321 329L344 352L389 303"
        fill="none"
        stroke={`url(#${marco})`}
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

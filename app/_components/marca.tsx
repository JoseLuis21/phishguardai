import Link from "next/link";

import { Isotipo } from "./isotipo";

export function Marca({ href = "/panel" }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="PhishGuardAI"
      className="flex items-center gap-2 text-[1.15rem] font-extrabold tracking-[0.04em] text-white uppercase [font-stretch:75%]"
    >
      <Isotipo className="size-7" />
      <span aria-hidden>
        PhishGuard<span className="text-shell-figure">AI</span>
      </span>
    </Link>
  );
}

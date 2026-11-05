"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * J / K move to the next / previous stub, like a reader's queue. Ignored while
 * typing so the note field keeps those letters.
 */
export function TecladoTalonario({
  hrefs,
  actual,
}: {
  hrefs: string[];
  actual: number;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const siguiente =
        key === "j" ? actual + 1 : key === "k" ? actual - 1 : null;

      if (siguiente === null || siguiente < 0 || siguiente >= hrefs.length) {
        return;
      }

      event.preventDefault();
      router.push(hrefs[siguiente], { scroll: false });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hrefs, actual, router]);

  return null;
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ENABLE_GPT } from "@/lib/ads";
import { destroyGPTSlot, queueGPTRefresh, setupGPT, type GPTSlotLike } from "@/lib/gpt-client";

type Size = [number, number];

export function GPTSlot({
  index,
  sizes = [[300, 250]],
  fallback
}: {
  index: number;
  sizes?: Size[];
  fallback: React.ReactNode;
}) {
  const reactId = useId().replace(/:/g, "");
  const divId = `gpt-slot-${index}-${reactId}`;
  const slotRef = useRef<GPTSlotLike | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ENABLE_GPT) return;

    const target = containerRef.current;
    if (!target) return;

    let alive = true;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || requested || !alive) return;

      setRequested(true);

      setupGPT().then(() => {
        if (!alive) return;

        window.googletag?.cmd.push(() => {
          const networkCode = process.env.NEXT_PUBLIC_GAM_NETWORK_CODE || "1234567";
          const prefix = process.env.NEXT_PUBLIC_GAM_AD_UNIT_PREFIX || `/${networkCode}/atz`;
          const adUnitPath = `${prefix}/slot-${index % 12}`;

          const slot = window.googletag?.defineSlot(adUnitPath, sizes, divId);
          if (!slot) return;

          slot.addService(window.googletag!.pubads());
          slotRef.current = slot;

          window.googletag!.display(divId);
          queueGPTRefresh(slot);
        });
      });
    }, {
      root: null,
      rootMargin: "350px 0px",
      threshold: 0.01
    });

    observer.observe(target);

    return () => {
      alive = false;
      observer.disconnect();
      destroyGPTSlot(slotRef.current);
      slotRef.current = null;
    };
  }, [divId, index, mounted, requested, sizes]);

  // Critical: render the exact same fallback on the server and first client render.
  // GPT upgrades only after mount, preventing hydration mismatch.
  if (!mounted || !ENABLE_GPT) return <>{fallback}</>;

  return (
    <div ref={containerRef} className="gpt-shell">
      <div id={divId} />
      {!requested ? fallback : null}
    </div>
  );
}

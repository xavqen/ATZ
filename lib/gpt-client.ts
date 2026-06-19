"use client";

export type GPTSlotLike = {
  addService: (service: unknown) => GPTSlotLike;
};

type GoogleTagLike = {
  cmd: Array<() => void>;
  setConfig?: (config: { singleRequest?: boolean }) => void;
  pubads: () => {
    enableSingleRequest?: () => void;
    enableLazyLoad: (config: {
      fetchMarginPercent: number;
      renderMarginPercent: number;
      mobileScaling: number;
    }) => void;
    disableInitialLoad: () => void;
    refresh: (slots: GPTSlotLike[]) => void;
  };
  enableServices: () => void;
  defineSlot: (adUnitPath: string, sizes: Array<[number, number]>, divId: string) => GPTSlotLike | null;
  display: (divId: string) => void;
  destroySlots: (slots: GPTSlotLike[]) => boolean;
};

declare global {
  interface Window {
    googletag?: GoogleTagLike;
  }
}

let gptReadyPromise: Promise<void> | null = null;
let flushTimer: number | null = null;
let queuedSlots: GPTSlotLike[] = [];

export function setupGPT() {
  if (gptReadyPromise) return gptReadyPromise;

  gptReadyPromise = new Promise<void>((resolve) => {
    window.googletag = window.googletag || ({ cmd: [] } as unknown as GoogleTagLike);

    const existing = document.querySelector<HTMLScriptElement>("script[data-gpt='true']");
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.dataset.gpt = "true";
      document.head.appendChild(script);
    }

    window.googletag.cmd.push(() => {
      const gpt = window.googletag!;
      const pubads = gpt.pubads();

      // New GPT API. Fallback kept for older GPT builds.
      if (typeof gpt.setConfig === "function") {
        gpt.setConfig({ singleRequest: true });
      } else {
        pubads.enableSingleRequest?.();
      }

      pubads.enableLazyLoad({
        fetchMarginPercent: 100,
        renderMarginPercent: 50,
        mobileScaling: 2
      });
      pubads.disableInitialLoad();

      gpt.enableServices();
      resolve();
    });
  });

  return gptReadyPromise;
}

export function queueGPTRefresh(slot: GPTSlotLike) {
  queuedSlots.push(slot);

  if (flushTimer !== null) return;

  flushTimer = window.setTimeout(() => {
    const slots = queuedSlots.splice(0, queuedSlots.length);
    flushTimer = null;

    if (!slots.length) return;

    window.googletag?.cmd.push(() => {
      window.googletag?.pubads().refresh(slots);
    });
  }, 180);
}

export function destroyGPTSlot(slot: GPTSlotLike | null) {
  if (!slot) return;

  window.googletag?.cmd.push(() => {
    window.googletag?.destroySlots([slot]);
  });
}

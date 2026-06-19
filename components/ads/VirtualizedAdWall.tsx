"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList as List, type ListOnScrollProps } from "react-window";
import { AD_CLUSTER_COUNT, AD_ROW_HEIGHT, ADS, ADS_PER_CLUSTER, VISIBLE_AD_OVERSCAN } from "@/lib/ads";
import { GPTSlot } from "@/components/ads/GPTSlot";
import { RawBannerAd, ReferralBanner, SmartlinkCard } from "@/components/ads/AdUnits";

function CompactAdCluster({ clusterIndex }: { clusterIndex: number }) {
  const base = clusterIndex * ADS_PER_CLUSTER;
  const gifFirst = clusterIndex % 2 === 0;

  return (
    <div className="ad-cluster">
      <div className="cluster-grid cluster-grid-2 compact-gap">
        <SmartlinkCard title={`Sponsored Offer #${base + 1}`} text="Open promoted content in one click." />
        <SmartlinkCard title={`More Offers #${base + 2}`} text="Explore another sponsored destination." />
      </div>

      <div className="compact-gap">
        <RawBannerAd size="728x90" label={`Top Banner #${base + 3}`} />
      </div>

      <div className="cluster-grid cluster-grid-2 compact-gap">
        <RawBannerAd size="320x50" label={`Mobile Banner #${base + 4}`} />
        <RawBannerAd size="468x60" label={`Compact Banner #${base + 5}`} />
      </div>

      <div className="cluster-grid cluster-grid-main compact-gap">
        <GPTSlot
          index={base + 6}
          sizes={[[300, 250], [320, 50]]}
          fallback={<RawBannerAd size="300x250" label={`Main Box #${base + 6}`} />}
        />
        {gifFirst ? <ReferralBanner variant="gif" /> : <ReferralBanner variant="png" />}
      </div>

      <div className="cluster-grid cluster-grid-4 compact-gap compact-bottom">
        <RawBannerAd size="160x300" label={`Vertical #${base + 7}`} />
        <RawBannerAd size="160x300" label={`Skyscraper #${base + 8}`} />
        <SmartlinkCard title={`Sponsored Smartlink #${base + 9}`} text="Fast sponsor click destination." />
        <SmartlinkCard title={`Extra Offers #${base + 10}`} text="See more monetized content quickly." />
      </div>
    </div>
  );
}

function Row({ index, style }: { index: number; style: React.CSSProperties }) {
  return (
    <div style={style} className="ad-row-cluster">
      <CompactAdCluster clusterIndex={index} />
    </div>
  );
}

function StaticBootAds() {
  return (
    <div className="static-boot-ads" aria-hidden="true">
      <CompactAdCluster clusterIndex={0} />
    </div>
  );
}

export function VirtualizedAdWall({ pageName }: { pageName: string }) {
  const listRef = useRef<List | null>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [height, setHeight] = useState(760);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setHeight(Math.min(900, Math.max(640, Math.floor(window.innerHeight * 0.84))));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const speedPxPerSecond = height / 2;

  function onScroll(props: ListOnScrollProps) {
    offsetRef.current = props.scrollOffset;
  }

  function stopAutoScroll() {
    setIsAutoScrolling(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    previousTimeRef.current = null;
  }

  function tick(time: number) {
    if (previousTimeRef.current === null) previousTimeRef.current = time;
    const deltaSeconds = (time - previousTimeRef.current) / 1000;
    previousTimeRef.current = time;

    const maxOffset = AD_CLUSTER_COUNT * AD_ROW_HEIGHT - height;
    const nextOffset = Math.min(offsetRef.current + speedPxPerSecond * deltaSeconds, maxOffset);

    offsetRef.current = nextOffset;
    listRef.current?.scrollTo(nextOffset);

    if (nextOffset >= maxOffset) return stopAutoScroll();
    rafRef.current = requestAnimationFrame(tick);
  }

  function startAutoScroll() {
    if (rafRef.current || !mounted) return;
    setIsAutoScrolling(true);
    previousTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section className="virtual-shell" aria-label={`${pageName} virtual ad wall`} suppressHydrationWarning>
      <Script src={ADS.popunder} strategy="lazyOnload" />
      <Script src={ADS.socialBar} strategy="lazyOnload" />

      <div className="ad-wall-head">
        <span>{pageName} · Compact Dense Ad Wall</span>
        <strong>{AD_CLUSTER_COUNT.toLocaleString()} virtual clusters · {ADS_PER_CLUSTER} ads each</strong>
      </div>

      <div className="auto-scroll-panel">
        <span>Compact multi-ad rows · more ads visible in one screen</span>
        <div className="btn-row no-margin">
          <button className="btn primary" type="button" onClick={startAutoScroll} disabled={isAutoScrolling || !mounted}>Start Auto Scroll</button>
          <button className="btn" type="button" onClick={stopAutoScroll}>Stop</button>
        </div>
      </div>

      <div className="virtual-window compact-window">
        {!mounted ? (
          <StaticBootAds />
        ) : (
          <List
            ref={listRef}
            height={height}
            width="100%"
            itemCount={AD_CLUSTER_COUNT}
            itemSize={AD_ROW_HEIGHT}
            overscanCount={VISIBLE_AD_OVERSCAN}
            onScroll={onScroll}
          >
            {Row}
          </List>
        )}
      </div>

      <p className="note warn">Compact layout applied: more ads are shown together on each screen while virtualization keeps the browser stable.</p>
    </section>
  );
}

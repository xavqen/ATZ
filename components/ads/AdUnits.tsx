import type { CSSProperties } from "react";
import { ADS, type BannerSize } from "@/lib/ads";

function bannerSrcDoc(size: BannerSize) {
  const config = ADS.banners[size];

  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=${config.width}, initial-scale=1">
<style>
html,body{margin:0;padding:0;width:${config.width}px;height:${config.height}px;overflow:hidden;background:transparent;}
body{display:flex;align-items:flex-start;justify-content:center;}
</style>
</head>
<body>
<script>
window.atOptions = {
  key: '${config.key}',
  format: 'iframe',
  height: ${config.height},
  width: ${config.width},
  params: {}
};
<\/script>
<script src="${config.src}"><\/script>
</body>
</html>`;
}

export function RawBannerAd({ size, label }: { size: BannerSize; label: string }) {
  const config = ADS.banners[size];

  return (
    <div
      className={`ad-card ad-${size}`}
      style={{ "--adw": `${config.width}px`, "--adh": `${config.height}px` } as CSSProperties}
    >
      <div className="ad-label"><span>{label}</span><span>{size}</span></div>
      <div className="ad-stage">
        <iframe
          className="ad-frame"
          title={`${label} ${size}`}
          width={config.width}
          height={config.height}
          loading="lazy"
          scrolling="no"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          srcDoc={bannerSrcDoc(size)}
        />
      </div>
    </div>
  );
}

export function ReferralBanner({ variant }: { variant: "gif" | "png" }) {
  const src = variant === "gif" ? ADS.referralGif : ADS.referralPng;

  // Plain <img> is intentional here. Next/Image optimizer rejects this CDN in some
  // networks because it resolves through NAT64/private-mapped addresses locally.
  return (
    <a className="referral-banner" href={ADS.smartlink} target="_blank" rel="nofollow sponsored noopener">
      <img
        src={src}
        alt="Sponsored referral banner"
        loading="lazy"
        decoding="async"
        width={728}
        height={90}
      />
    </a>
  );
}

export function SmartlinkCard({ title = "Sponsored Smartlink", text = "Open a promoted offer." }) {
  return (
    <a className="promo-card" href={ADS.smartlink} target="_blank" rel="nofollow sponsored noopener">
      <small>Smartlink</small>
      <strong>{title}</strong>
      <span>{text}</span>
    </a>
  );
}

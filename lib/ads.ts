export const AD_TARGET_COUNT = 1_000_000;
export const ADS_PER_CLUSTER = 10;
export const AD_CLUSTER_COUNT = Math.ceil(AD_TARGET_COUNT / ADS_PER_CLUSTER);
export const VISIBLE_AD_OVERSCAN = 1;
export const AD_ROW_HEIGHT = 760;

export const ADS = {
  popunder: "https://formssternlystately.com/0f/e7/5e/0fe75e359454467021ebdfb406a06c3c.js",
  socialBar: "https://formssternlystately.com/7e/d4/5a/7ed45a929a698521e2b4ebef4e46be07.js",
  smartlink: "https://formssternlystately.com/a7s969rxvz?key=2b7badfb224863fdaea4ba3075a10d23",
  referralGif: "https://landings-cdn.adsterratech.com/referralBanners/gif/720x90_adsterra_reff.gif",
  referralPng: "https://landings-cdn.adsterratech.com/referralBanners/png/728%20x%2090%20px.png",
  nativeBanner: {
    src: "https://formssternlystately.com/bec744bc25cbda5e4f778f2276240cbb/invoke.js",
    containerId: "container-bec744bc25cbda5e4f778f2276240cbb"
  },
  banners: {
    "468x60": { key: "1eecd03162fe428b0a6fdf70383353c6", width: 468, height: 60, src: "https://formssternlystately.com/1eecd03162fe428b0a6fdf70383353c6/invoke.js" },
    "300x250": { key: "646c5344eedefc527a4c7f36a8f8eb57", width: 300, height: 250, src: "https://formssternlystately.com/646c5344eedefc527a4c7f36a8f8eb57/invoke.js" },
    "160x600": { key: "0b6a765c12dd919314368e632fe59fce", width: 160, height: 600, src: "https://formssternlystately.com/0b6a765c12dd919314368e632fe59fce/invoke.js" },
    "160x300": { key: "949ee31d2f40967241f0cad18094ca9d", width: 160, height: 300, src: "https://formssternlystately.com/949ee31d2f40967241f0cad18094ca9d/invoke.js" },
    "728x90": { key: "24c697c54aaf3163c1928ebcddb34469", width: 728, height: 90, src: "https://formssternlystately.com/24c697c54aaf3163c1928ebcddb34469/invoke.js" },
    "320x50": { key: "3f78e22761bf608a51af9d125d89bd7c", width: 320, height: 50, src: "https://formssternlystately.com/3f78e22761bf608a51af9d125d89bd7c/invoke.js" }
  }
} as const;

export type BannerSize = keyof typeof ADS.banners;
export const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
export const ENABLE_GPT = process.env.NEXT_PUBLIC_ENABLE_GPT === "true";

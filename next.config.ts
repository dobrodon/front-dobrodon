import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    remotePatterns: [new URL('https://avatars.mds.yandex.net/get-images-cbir/401730/Ewk_OUlHY6Hvo8OyUERdwg137/ocr')],
  },
}
export default nextConfig;

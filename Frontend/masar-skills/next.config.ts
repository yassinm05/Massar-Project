import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5236", // important if your backend runs on 5236
        pathname: "/photos/**",
      },
    ],
    domains: [
      "masarskillsapi-production-v1-ashfbxekhaeffba7.canadacentral-01.azurewebsites.net",
    ],
  },
};


export default nextConfig;

import type { NextConfig } from "next";
const { i18n } = require('./next-i18next.config');
//import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  i18n,
   eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
    images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
      },
    ],
  },
 
};


//export default withFlowbiteReact(nextConfig);
export default (nextConfig)
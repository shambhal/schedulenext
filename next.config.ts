import type { NextConfig } from "next";

//import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig: NextConfig = {
  /* config options here */

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
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig)
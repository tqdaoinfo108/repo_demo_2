/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || "/repo_demo_2";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
};

export default nextConfig;

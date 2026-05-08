import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // => génère un site statique (dossier "out")
  basePath: "/focus",      // => le site vit sous /focus/
  assetPrefix: "/focus/",  // => les assets (JS/CSS/images) pointent aussi sous /focus/
};

export default nextConfig;
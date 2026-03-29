import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Opción para corregir la detección de raíz en monorepo
  turbopack: {
    root: "../../"
  }
};

export default nextConfig;

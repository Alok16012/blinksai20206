import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The indicator sits bottom-left, exactly where the sticky mobile CTA bar lives
  // (PRD §8 thumb zone), so it hides the thing that most needs reviewing.
  devIndicators: false,
};

export default nextConfig;

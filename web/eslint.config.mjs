import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber's render loop is imperative by design: `useFrame` runs outside
    // React's render pass and its whole job is to mutate scene objects — a CanvasTexture's
    // `needsUpdate` flag, a material's `emissiveIntensity`, the WebGL canvas cursor. The
    // compiler's immutability rule assumes a pure render model and flags all of that.
    //
    // Scoped to this directory only, and only to that one rule — `set-state-in-effect`,
    // `refs`, `exhaustive-deps` and everything else stay on here.
    files: ["components/three/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", "legacy-src/**", "next-env.d.ts", "design-sources/**", "tests/e2e/output/**"],
  },
  {
    rules: {
      "no-console": ["error", { allow: ["error", "warn"] }],
    },
  },
  {
    // Rechtstexte (Rechtsagent): Apostrophe im Fließtext sind gewollt und werden korrekt dargestellt.
    files: ["src/content/legal/**"],
    rules: { "react/no-unescaped-entities": "off" },
  },
  {
    files: ["scripts/**", "tests/**"],
    rules: { "no-console": "off" },
  },
];

export default config;

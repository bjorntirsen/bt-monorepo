import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Workaround for eslint-plugin-react incompatibility with ESLint v10.
    // eslint-plugin-react calls the removed context.getFilename() API for React
    // version auto-detection. Explicitly setting the version bypasses that.
    // Track: https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
    settings: {
      react: { version: "19" },
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;

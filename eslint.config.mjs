import baseConfig from "@wyattades/eslint-config";

export default [
  ...baseConfig,
  {
    rules: {
      "no-console": "off",
      "react/no-unknown-property": "off", // @react-three/fiber breaks this
    },
  },
  {
    files: ["src/lib/sketches/**/*", "src/lib/fluid.ts"],
    rules: {
      "@typescript-eslint/no-use-before-define": "off",
      "prefer-const": "off",
    },
  },
  {
    files: ["scripts/**/*"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
];

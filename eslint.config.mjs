import baseConfig from "@wyattades/eslint-config";

export default [
  baseConfig,
  {
    rules: {
      "react/jsx-filename-extension": "off",
      "react/no-unknown-property": "off", // @react-three/fiber breaks this
    },
  },
  {
    files: ["lib/sketches/**/*", "lib/fluid.js"],
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

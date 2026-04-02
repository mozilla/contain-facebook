import js from "@eslint/js";
import globals from "globals";
import noUnsanitized from "eslint-plugin-no-unsanitized";

const sharedRules = {
  "indent": ["error", 2],
  "linebreak-style": ["error", "unix"],
  "quotes": ["error", "double"],
  "semi": ["error", "always"],
};

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2017,
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    plugins: {
      "no-unsanitized": noUnsanitized,
    },
    rules: {
      ...sharedRules,
      "no-console": "warn",
      "no-unused-vars": ["error", { "caughtErrors": "none" }],
      "no-unsanitized/method": "error",
      "no-unsanitized/property": ["error", {
        escape: { taggedTemplates: ["escaped"] },
      }],
    },
  },
  {
    files: ["test/features/**/*.test.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.mocha,
        expect: "readonly",
        loadWebExtension: "readonly",
        sinon: "readonly",
      },
    },
    rules: sharedRules,
  },
];

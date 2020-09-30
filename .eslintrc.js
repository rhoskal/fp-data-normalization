module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["prettier", "react", "@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "import/newline-after-import": 2,
    "import/no-cycle": 2,
    "import/no-relative-parent-imports": 2,
    "import/order": [
      2,
      {
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "index", "sibling"],
        ],
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "src/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal"],
      },
    ],
    "prettier/prettier": "error",
    "react/jsx-curly-brace-presence": [2, { props: "never", children: "never" }],
    "react/jsx-filename-extension": [1, { extensions: [".ts", ".tsx"] }],
    "react/jsx-sort-props": [2],
    "react/prop-types": [0],
    "react/sort-prop-types": [2],
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true,
      },
    ],
    "react/react-in-jsx-scope": [0],
    "react/no-unescaped-entities": [0],
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
};

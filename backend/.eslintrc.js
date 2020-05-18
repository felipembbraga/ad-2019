module.exports = {
    parser: "@typescript-eslint/parser",
    env: {
        es6: true,
        node: true
    },
    plugins: ["@typescript-eslint"],
    extends: ["plugin:@typescript-eslint/recommended", "prettier/@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    rules: {
        semi: ["error", "always"],
        quotes: ["warn", "double"],
        // 'comma-dangle': ['error', 'always'],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        // "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-this-alias": "off"
    }
};

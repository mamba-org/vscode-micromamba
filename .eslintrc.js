module.exports = {
    env: {
        amd: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    plugins: ['@typescript-eslint'],
    root: true,
    ignorePatterns: ['out']
};

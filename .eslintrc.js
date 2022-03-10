module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2],
    'max-len': ['error', {
      code: 120,
    }],
    'multiline-ternary': ['error', 'always'],
    'no-multi-spaces': ['error'],
    'no-redeclare': ['off'],
    'operator-linebreak': ['error', 'before'],
  },
}

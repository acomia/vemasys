module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        semi: 'off',
        'comma-dangle': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        curly: ['error', 'multi-line'],
        radix: 'off',
      },
    },
  ],
}

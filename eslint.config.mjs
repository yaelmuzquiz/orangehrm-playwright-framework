import tseslint from 'typescript-eslint';

export default [
  {
    files: ['playwright.config.ts', 'src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: { '@typescript-eslint/no-floating-promises': 'error' },
  },
];

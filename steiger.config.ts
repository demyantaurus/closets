import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ['./src/**'],
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
  {
    files: ['./src/shared/styles/**'],
    rules: {
      'fsd/public-api': 'off',
    },
  },
  {
    files: ['./src/shared/actions/**'],
    rules: {
      'fsd/segments-by-purpose': 'off',
    },
  },
  {
    ignores: ['./src/app/**', './src/payload/**'],
  },
])

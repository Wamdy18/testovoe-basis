import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const srcDir = fileURLToPath(new URL('./app', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~': srcDir,
      '@': srcDir,
    },
  },
  test: {
    environment: 'node',
    include: ['app/tests/**/*.test.ts'],
    globals: false,
    restoreMocks: true,
  },
})

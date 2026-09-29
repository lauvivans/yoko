import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: {
    alias: { '@': '/src' },
  },
  test: {
    environment: 'jsdom',
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.spec.ts', 'src/main.tsx'],
    },
  },
});

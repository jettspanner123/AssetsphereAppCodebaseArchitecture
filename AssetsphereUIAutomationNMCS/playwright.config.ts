import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*Test.ts',
  fullyParallel: true,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://assetsphere-weplm.vercel.app',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

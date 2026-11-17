import { defineConfig, devices } from '@playwright/test'

// Port dédié : on ne réutilise pas par erreur un `npm run dev` lancé depuis un autre checkout (autre branche).
// Next interdit deux `next dev` dans un même dossier : si un `npm run dev` tourne déjà ici,
// l'arrêter, ou le réutiliser avec `E2E_PORT=3000 npm run test:e2e`.
const PORT = Number(process.env.E2E_PORT) || 3100
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})

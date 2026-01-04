import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright設定
 *
 * E2Eテスト用ポート: 3010
 * ※ 通常の開発サーバー（3011）との競合を避けるため、E2Eテストでは3010を使用
 * ※ CI環境ではBASE_URL環境変数で上書き可能
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* テスト実行時の最大並列数 */
  fullyParallel: true,
  /* CI環境ではリトライしない */
  forbidOnly: !!process.env.CI,
  /* 失敗時のリトライ回数 */
  retries: process.env.CI ? 2 : 0,
  /* 並列ワーカー数 */
  workers: process.env.CI ? 1 : undefined,
  /* レポーター設定 */
  reporter: 'list',
  /* 共通設定 */
  use: {
    /* テスト対象のベースURL（E2Eテスト用にポート3010を使用） */
    baseURL: process.env.BASE_URL || 'http://localhost:3010',
    /* テスト失敗時にトレースを収集 */
    trace: 'on-first-retry',
    /* スクリーンショット設定 */
    screenshot: 'only-on-failure'
  },

  /* ブラウザ設定 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  /* テスト実行前にdev serverを起動（CI環境以外） */
  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm dev --port 3010',
        url: 'http://localhost:3010',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000
      }
})

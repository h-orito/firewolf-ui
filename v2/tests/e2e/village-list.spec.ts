import { test, expect } from '@playwright/test'

test.describe('村一覧ページ', () => {
  test('村一覧ページが正しく表示される', async ({ page }) => {
    await page.goto('/firewolf/village-list')

    // h1要素の存在確認
    await expect(page.locator('h1')).toBeVisible()

    // ページがエラーなく表示されることを確認
    await expect(page).toHaveTitle(/FIREWOLF/)

    // JavaScriptエラーがないことを確認
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('JavaScript error:', msg.text())
      }
    })
  })
})

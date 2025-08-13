import { test, expect } from '@playwright/test'

test.describe('認証不要ページ', () => {
  test('ルールページが正しく表示される', async ({ page }) => {
    await page.goto('/rule')

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

  test('FAQページが正しく表示される', async ({ page }) => {
    await page.goto('/faq')

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

  test('aboutページが正しく表示される', async ({ page }) => {
    await page.goto('/about')

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

  test('リリースノートページが正しく表示される', async ({ page }) => {
    await page.goto('/release-note')

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

  test('キャラチップ一覧ページが正しく表示される', async ({ page }) => {
    await page.goto('/charachip-list')

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

  test('利用規約ページが正しく表示される', async ({ page }) => {
    await page.goto('/terms')

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

  test('プライバシーポリシーページが正しく表示される', async ({ page }) => {
    await page.goto('/privacy')

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

import { test, expect } from '@playwright/test'

test.describe('ホームページ', () => {
  test('ホームページが正しく表示される', async ({ page }) => {
    await page.goto('/')

    // タイトルの確認
    await expect(page).toHaveTitle(/FIREWOLF/)

    // ヘッダーの確認
    await expect(page.getByText('FIREWOLF')).toBeVisible()

    // 村一覧セクションの確認
    await expect(page.getByText('村一覧')).toBeVisible()
  })

  test('ナビゲーションが正しく動作する', async ({ page }) => {
    await page.goto('/')

    // ルールページへのナビゲーション
    await page.getByText('ルール').click()
    await expect(page).toHaveURL(/.*rule/)
    await expect(page.getByText('人狼ゲームのルール')).toBeVisible()

    // ホームに戻る
    await page.getByText('FIREWOLF').click()
    await expect(page).toHaveURL('/')
  })

  test('レスポンシブデザインが正しく動作する', async ({ page }) => {
    // デスクトップビューの確認
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/')
    await expect(page.getByText('FIREWOLF')).toBeVisible()

    // モバイルビューの確認
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.getByText('FIREWOLF')).toBeVisible()
  })
})

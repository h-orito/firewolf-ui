import { test, expect } from '@playwright/test'

test.describe('村一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    // APIレスポンスをモック（実際のAPIが無い場合）
    await page.route('**/api/villages*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: 'テスト村1',
              status: 'IN_PROGRESS',
              participantsCount: 8,
              capacity: 12,
              daysCount: 3,
              createdDatetime: '2025-01-01T10:00:00Z',
              settings: {
                time: {
                  startDatetime: '2025-01-01T20:00:00Z',
                },
                organizations: {
                  organization: '村人7,人狼2,占い師1,霊能者1,狩人1',
                },
              },
            },
          ],
          totalCount: 1,
        }),
      })
    })
  })

  test('村一覧が正しく表示される', async ({ page }) => {
    await page.goto('/')

    // 村カードの確認
    await expect(page.getByText('テスト村1')).toBeVisible()
    await expect(page.getByText('進行中')).toBeVisible()
    await expect(page.getByText('8/12人')).toBeVisible()
    await expect(page.getByText('3日目')).toBeVisible()
  })

  test('村の詳細ページへのナビゲーション', async ({ page }) => {
    await page.goto('/')

    // 村カードをクリック
    await page.getByText('テスト村1').click()

    // 村の詳細ページに遷移することを確認
    await expect(page).toHaveURL(/.*village\/1/)
  })

  test('ページネーションが正しく動作する', async ({ page }) => {
    // 多くの村データをモック
    await page.route('**/api/villages*', async (route) => {
      const villages = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `テスト村${i + 1}`,
        status: 'IN_PROGRESS',
        participantsCount: 8,
        capacity: 12,
        daysCount: 3,
        createdDatetime: '2025-01-01T10:00:00Z',
        settings: {
          time: {
            startDatetime: '2025-01-01T20:00:00Z',
          },
          organizations: {
            organization: '村人7,人狼2,占い師1,霊能者1,狩人1',
          },
        },
      }))

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: villages,
          totalCount: 25,
        }),
      })
    })

    await page.goto('/')

    // ページネーションの確認
    await expect(page.getByText(/1-10 件/)).toBeVisible()
    await expect(page.getByText('次のページ')).toBeVisible()

    // 次のページに移動
    await page.getByText('次のページ').click()
    await expect(page.getByText(/11-20 件/)).toBeVisible()
  })
})

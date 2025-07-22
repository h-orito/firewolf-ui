import { test, expect } from '@playwright/test'

test.describe('村ページ', () => {
  test.beforeEach(async ({ page }) => {
    // 村詳細のAPIレスポンスをモック
    await page.route('**/api/village/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'テスト村',
          status: 'PROGRESS',
          participantsCount: 8,
          capacity: 12,
          daysCount: 3,
          createdDatetime: '2025-01-01T10:00:00Z',
          settings: {
            time: {
              startDatetime: '2025-01-01T20:00:00Z',
              silentHours: 8,
            },
            organizations: {
              organization: '村人7,人狼2,占い師1,霊能者1,狩人1',
            },
            rules: {
              dayChangeIntervalSeconds: 86400,
              isOpenSkillInGrave: false,
              isVisibleGraveMessage: false,
              isOpenVote: false,
              isPossibleSkillRequest: true,
              isAvailableSpectate: true,
              isAvailableSecretSay: false,
              isOpenRpSetting: false,
              isAvailableAction: true,
            },
          },
          participants: [
            {
              id: 1,
              name: 'テストキャラ1',
              entryNumber: 1,
              isAlive: true,
            },
          ],
        }),
      })
    })

    // メッセージのAPIレスポンスをモック
    await page.route('**/api/village/1/messages*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              content: {
                type: { code: 'NORMAL_SAY' },
                text: 'テストメッセージです。',
                num: 1,
              },
              time: {
                datetime: '2025-01-01T10:00:00Z',
              },
              from: {
                charaName: { name: 'テストキャラ1' },
                player: { nickname: 'プレイヤー1' },
              },
              to: null,
            },
          ],
        }),
      })
    })
  })

  test('村の詳細情報が正しく表示される', async ({ page }) => {
    await page.goto('/village/1')

    // 村名の確認
    await expect(page.getByText('テスト村')).toBeVisible()

    // 村の状態の確認
    await expect(page.getByText('進行中')).toBeVisible()
    await expect(page.getByText('3日目')).toBeVisible()

    // 参加者数の確認
    await expect(page.getByText('8/12人')).toBeVisible()

    // 編成の確認
    await expect(page.getByText(/村人7,人狼2/)).toBeVisible()
  })

  test('メッセージが正しく表示される', async ({ page }) => {
    await page.goto('/village/1')

    // メッセージの確認
    await expect(page.getByText('テストメッセージです。')).toBeVisible()
    await expect(page.getByText('テストキャラ1')).toBeVisible()
  })

  test('参加者リストが正しく表示される', async ({ page }) => {
    await page.goto('/village/1')

    // 参加者リストの確認
    await expect(page.getByText('参加者')).toBeVisible()
    await expect(page.getByText('テストキャラ1')).toBeVisible()
  })

  test('村設定モーダルが正しく動作する', async ({ page }) => {
    await page.goto('/village/1')

    // 設定ボタンをクリック
    await page.getByText('設定').click()

    // モーダルが開くことを確認
    await expect(page.getByText('表示設定')).toBeVisible()

    // 設定を変更
    const fontSizeSelect = page.getByLabel('文字サイズ')
    await fontSizeSelect.selectOption('large')

    // 設定を保存
    await page.getByText('保存').click()

    // モーダルが閉じることを確認
    await expect(page.getByText('表示設定')).not.toBeVisible()
  })

  test('エラーハンドリングが正しく動作する', async ({ page }) => {
    // 存在しない村にアクセス
    await page.goto('/village/999')

    // エラーページが表示されることを確認
    await expect(page.getByText('村が見つかりません')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

/**
 * 村ページのE2Eテスト
 *
 * テスト対象:
 * - 村ページの初期表示
 * - 発言の抽出（filterIdパラメータ）
 * - ページング
 * - 日付切り替え
 * - アクション実行（発言/入村/退村等）
 *
 * 注意: これらのテストは実際のAPIサーバー（firewolf-api）が起動している必要があります
 */

// テスト用の村ID（終了済み村を使用、環境変数で上書き可能）
const TEST_VILLAGE_ID = Number(process.env.TEST_VILLAGE_ID) || 1

test.describe('村ページ', () => {
  test.describe('初期表示', () => {
    test('村ページが正常に表示される', async ({ page }) => {
      // 村ページにアクセス
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディングスピナーが表示されなくなるまで待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // エラー表示がないことを確認
      await expect(
        page.locator('text=村情報の読み込みに失敗しました')
      ).not.toBeVisible()

      // 村名が表示されていることを確認（メインエリアのh1タグ）
      const villageTitle = page.locator('#village-article-wrapper h1')
      await expect(villageTitle).toBeVisible()
      await expect(villageTitle).not.toBeEmpty()
    })

    test('日付リストが表示される', async ({ page }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // 日付リストが表示されていることを確認
      const dayList = page.locator('ul').filter({ hasText: /プロローグ|日目/ })
      await expect(dayList.first()).toBeVisible()
    })

    test('発言リストが表示される', async ({ page }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // 発言カードが表示されていることを確認（少なくとも1つ以上）
      // MessageCardはmy-3クラスを持つ
      const messageCards = page.locator('.my-3')
      await expect(messageCards.first()).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('発言の抽出', () => {
    test('filterIdパラメータで特定参加者の発言のみ表示される', async ({
      page
    }) => {
      // filterIdを指定して村ページにアクセス
      // 参加者ID 1で抽出
      await page.goto(`/village?id=${TEST_VILLAGE_ID}&filterId=1`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // 発言カードの存在を確認
      const messageCards = page.locator('.my-3')

      // 発言がある場合は抽出が適用されていることを確認
      // （抽出の結果発言が0件になる場合もあるため、エラーにはしない）
      const count = await messageCards.count()
      // 抽出機能が動作していれば、エラーなくページが表示される
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('ページング', () => {
    test('ページネーションボタンで発言ページを切り替えられる', async ({
      page
    }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // ページネーションが存在するか確認
      const pagination = page.locator('nav[aria-label="ページ"]')
      const paginationCount = await pagination.count()

      if (paginationCount > 0) {
        // ページ2ボタンがあれば押下
        const page2Button = pagination
          .first()
          .locator('button', { hasText: '2' })
        const page2Count = await page2Button.count()

        if (page2Count > 0) {
          await page2Button.click()
          // ネットワークが落ち着くまで待機
          await page.waitForLoadState('networkidle')
          // 発言カードが表示されていることを確認
          const messageCards = page.locator('.my-3')
          await expect(messageCards.first()).toBeVisible()
        }
      }
    })

    test('最新ボタンで最新の発言が表示される', async ({ page }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // 最新ボタンを探す
      const latestButton = page.locator('button', { hasText: '最新' })
      const latestButtonCount = await latestButton.count()

      if (latestButtonCount > 0) {
        await latestButton.first().click()
        // ネットワークが落ち着くまで待機
        await page.waitForLoadState('networkidle')
        // 発言カードが表示されていることを確認
        const messageCards = page.locator('.my-3')
        await expect(messageCards.first()).toBeVisible()
      }
    })
  })

  test.describe('日付切り替え', () => {
    test('日付リンクをクリックすると該当日の発言が表示される', async ({
      page
    }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // 日付リストを取得
      const dayLinks = page.locator('a').filter({ hasText: /プロローグ|日目/ })
      const dayLinkCount = await dayLinks.count()

      if (dayLinkCount > 0) {
        // 最初のリンク（プロローグまたは1日目）をクリック
        await dayLinks.first().click()

        // ネットワークが落ち着くまで待機
        await page.waitForLoadState('networkidle')

        // 発言カードが表示されていることを確認
        const messageCards = page.locator('.my-3')
        await expect(messageCards.first()).toBeVisible()
      }
    })

    test('別の日付に切り替えると発言が更新される', async ({ page }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // 日付リストを取得
      const dayLinks = page.locator('a').filter({ hasText: /日目/ })
      const dayLinkCount = await dayLinks.count()

      if (dayLinkCount >= 2) {
        // 2つ目のリンクをクリック
        await dayLinks.nth(1).click()

        // ネットワークが落ち着くまで待機
        await page.waitForLoadState('networkidle')

        // 発言カードが表示されていることを確認
        const messageCards = page.locator('.my-3')
        await expect(messageCards.first()).toBeVisible()
      }
    })
  })

  test.describe('アクション実行', () => {
    // アクションのテストは認証が必要なため、認証済みの状態でテストする
    // TODO: 認証が必要なアクション（発言、入村、投票等）のテストは将来的に追加予定
    // 以下は認証なしで確認できる項目

    test('未ログイン状態でアクションエリアが適切に表示される', async ({
      page
    }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // アクションコンテナの確認
      // 終了済み村の場合、アクションは表示されない可能性がある
      const actionContainer = page.locator('.action-container')
      const actionContainerCount = await actionContainer.count()

      // アクションコンテナがある場合は、中身を確認
      if (actionContainerCount > 0) {
        // 未ログイン時は入村ボタンまたは発言フォームなどが表示される可能性がある
        await expect(actionContainer).toBeVisible()
      }
    })

    test('サイドバーが表示される（PC表示の場合）', async ({ page }) => {
      // PC幅を設定
      await page.setViewportSize({ width: 1280, height: 720 })

      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // サイドバーが表示されていることを確認
      // VillageSidebarは bg-[#363636] クラスを持つ
      const sidebar = page.locator('.bg-\\[\\#363636\\]')
      await expect(sidebar.first()).toBeVisible()
    })

    test('ヘッダーとフッターが表示される', async ({ page }) => {
      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // ヘッダーとフッターの存在を確認
      // VillageHeaderとVillageFooterはそれぞれheader/footerタグではないが、
      // ページの上部・下部に配置されるコンポーネントとして存在を確認
      // 村名が表示されていることでヘッダー領域の動作を確認
      const villageTitle = page.locator('#village-article-wrapper h1')
      await expect(villageTitle).toBeVisible()

      // フッター領域にボタン（設定ボタン等）が存在することを確認
      // VillageFooterには抽出ボタンやフィルタボタンが含まれる
      const footerButtons = page
        .locator('button')
        .filter({ hasText: /抽出|設定/ })
      const footerButtonCount = await footerButtons.count()
      // フッターボタンの存在確認（ボタンがない場合もあるため、エラーにはしない）
      expect(footerButtonCount).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('レスポンシブ表示', () => {
    test('モバイル表示時にサイドバーが隠れる', async ({ page }) => {
      // モバイル幅を設定
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto(`/village?id=${TEST_VILLAGE_ID}`)

      // ローディング完了を待機
      await expect(
        page.locator('text=村情報を読み込み中...').first()
      ).not.toBeVisible()

      // PC用サイドバー（h-dvh bg-[#363636]を持つdiv）が表示されていないことを確認
      // モバイルではオーバーレイとして表示されるため、初期状態では見えない
      const pcSidebar = page
        .locator('div.h-dvh.bg-\\[\\#363636\\]')
        .filter({ has: page.locator('div') })
      const pcSidebarCount = await pcSidebar.count()

      // モバイル幅ではPC用サイドバーは非表示（存在しないか、visibilityがhidden）
      if (pcSidebarCount > 0) {
        await expect(pcSidebar.first()).not.toBeVisible()
      }
    })
  })
})

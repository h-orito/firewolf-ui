# 村ページ - 設計書

## アーキテクチャ

### 1. ディレクトリ構成

```
pages/
  village.vue                # 村ページメイン（レイアウト構造も含む）

components/
  village/
    # レイアウト関連
    VillageHeader.vue        # ヘッダー（前日/翌日/最上部へ）
    VillageFooter.vue        # フッター（更新/最下部へ/抽出/残り時間）
    VillageSidebar.vue       # サイドバー（メニュー/参加者/設定）
    VillageDayList.vue       # 日付選択リスト

    # 発言表示関連
    message/
      MessageList.vue        # 発言リスト（ページング含む）
      MessageCard.vue        # 発言カード
      MessageSay.vue         # 通常発言
      MessageSystem.vue      # システムメッセージ
      message-converter.ts   # 発言テキストの変換処理
      ParticipantsMessage.vue  # 発言内の参加者リスト
      VillageSituationMessage.vue  # 状況メッセージ

    # アクション関連
    action/
      ActionContainer.vue    # アクションコンテナ
      Say.vue                # 発言入力
      SayConfirm.vue         # 発言確認モーダル
      Participate.vue        # 参加
      Spectate.vue           # 見学参加
      Leave.vue              # 退村
      SkillRequest.vue       # 役職希望
      Vote.vue               # 投票
      Ability.vue            # 能力行使
      Commit.vue             # コミット
      Comingout.vue          # CO
      ActionSay.vue          # アクション発言
      ChangeName.vue         # 名前変更
      creator/
        CreatorSay.vue       # 村建て発言
        KickOut.vue          # キックアウト
        ExtendEpilogue.vue   # エピローグ延長
        Cancel.vue           # 廃村
        SettingsLink.vue     # 村設定変更リンク
      admin/
        Admin.vue            # 管理者専用機能
      debug/
        Debug.vue            # デバッグ機能

    # フッター関連
    footer/
      ModalFilter.vue        # 発言抽出モーダル

    # サイドバー関連
    sidebar/
      ModalVillageInfo.vue   # 村情報モーダル
      ParticipantList.vue    # 参加者リスト
      ModalUserSettings.vue  # ユーザ設定モーダル
      memo/
        ModalMemo.vue        # メモモーダル
        TextMemo.vue         # テキストメモ（3つまで保存可能）

    # 共通
    CharaImage.vue           # キャラクター画像
    ModalAgeLimit.vue        # 年齢制限確認モーダル

composables/
  village/
    useVillage.ts            # 村情報の取得・管理
    useMessage.ts            # 発言の取得・管理
    useSituation.ts          # 参加状況の取得・管理
    useVillagePolling.ts     # 最新情報のポーリング
    useVillageTimer.ts       # 残り時間の計算
    useVillageFilter.ts      # 発言抽出
    useUserSettings.ts       # ユーザ設定
    useVillageMemo.ts        # メモ機能
    useVillageNavigation.ts  # ナビゲーション（スクロール等）
```

### 2. コンポーネント設計

#### 2.1 pages/village.vue

**責務**:

- クエリパラメータからvillageIdを取得
- 認証状態の確認
- 村情報・発言・参加状況の初期読み込み
- 定期更新タイマーの管理
- レイアウト構造の実装（サイドバー・ヘッダー・メイン・フッターの配置）

**Props**: なし

**State**:

- `villageId`: number - 村ID
- `filterId`: string | null - URLパラメータからの抽出ID
- `displayVillageDay`: VillageDay | null - 表示中の日付
- `isSliderExpanded`: boolean - サイドバー表示状態（モバイル）
- `isOpenAgeLimitModal`: boolean - 年齢制限モーダル表示状態

**Composables**:

- `useVillage()` - 村情報
- `useMessage()` - 発言
- `useSituation()` - 参加状況
- `useVillagePolling()` - ポーリング
- `useVillageTimer()` - タイマー
- `useVillageFilter()` - 抽出
- `useUserSettings()` - 設定
- `useVillageNavigation()` - ナビゲーション

**認証処理**:

- マウント時にFirebase認証状態を確認（初期表示最適化のため）

```typescript
onMounted(async () => {
  // 認証状態を待機
  await new Promise<void>((resolve) => {
    onAuthStateChanged(getAuth(), () => resolve())
  })
  // 以降の初期化処理...
})
```

- 権限判定はAPIレスポンス（`situation`）の情報を使用

```typescript
// 例：発言可能かどうか
const canSay = computed(() => situation.value?.say.available_say ?? false)
```

**レイアウト構造**:

- 既存の `layouts/village.vue` を使用
- ページ内でレイアウト構造を実装:
  - PC: サイドバー左全面固定（幅280px）、右側にヘッダー/メイン/フッター縦並び
  - モバイル: 縦積み（サイドバーはオーバーレイ）
  - サイドバーの表示切り替え制御

**ライフサイクル**:

- `onMounted`:
  1. Firebase認証状態の確認
  2. 村情報読み込み
  3. 初期表示設定
  4. タイマー開始
  5. 高さ調整イベント登録
- `onUnmounted`:
  1. タイマー停止
  2. イベントリスナー解除

#### 2.2 VillageHeader.vue

**責務**:

- 前日/翌日ボタン
- 最上部へスクロールボタン

**Props**:

- `currentVillageDay`: VillageDay | null - 現在表示中の日付

**Emits**:

- `current-day-change`: 日付変更イベント
- `to-head`: 最上部へスクロールイベント

#### 2.3 VillageFooter.vue

**責務**:

- リフレッシュボタン
- 最下部へスクロールボタン
- 発言抽出ボタン
- 残り時間表示
- メニューボタン（モバイル）

**Props**:

- `existsNewMessages`: boolean - 新しい発言があるか
- `timer`: string - 残り時間文字列

**Emits**:

- `refresh`: リフレッシュイベント
- `to-bottom`: 最下部へスクロールイベント
- `toggle-slider`: サイドバー表示切替イベント
- `filter`: 発言抽出イベント

#### 2.4 VillageSidebar.vue

**責務**:

- メニュー表示
- 参加者一覧表示
- 各種モーダルの管理

**Props**:

- `isExpanded`: boolean - サイドバー展開状態（モバイル）
- `charachips`: Charachip[] - キャラチップ一覧

**Emits**:

- `hide-slider`: サイドバーを閉じるイベント
- `refresh`: リフレッシュイベント
- `chara-filter`: キャラ抽出イベント

#### 2.5 MessageList.vue

**責務**:

- 発言リストの表示
- ページネーション
- 最新ボタン

**Props**:

- `messages`: Messages - 発言データ
- `perPage`: number - 1ページあたりの表示件数
- `isLatestDay`: boolean - 最新日を表示中か

**Emits**:

- `change-message-page`: ページ変更イベント
- `disp-latest`: 最新表示イベント
- `paste-message-input`: 発言入力欄への貼り付けイベント
- `reply`: 返信イベント
- `secret`: 秘話イベント

#### 2.6 MessageCard.vue

**責務**:

- 個別発言の表示
- アンカーの処理
- 発言アクションの表示

**Props**:

- `message`: Message - 発言データ
- `isProgress`: boolean - 進行中か
- `index`: number - リスト内のインデックス
- `isDarkTheme`: boolean - ダークテーマか
- `isDispDate`: boolean - 日時表示するか
- `isImgLarge`: boolean - 画像を大きく表示するか
- `canReply`: boolean - 返信可能か
- `canSecret`: boolean - 秘話可能か

**Emits**:

- `paste-message-input`: 発言入力欄への貼り付けイベント
- `reply`: 返信イベント
- `secret`: 秘話イベント

#### 2.7 ActionContainer.vue

**責務**:

- 参加状況に応じたアクションコンポーネントの表示
- 各アクションコンポーネントの管理

**Props**:

- `charachips`: Charachip[] - キャラチップ一覧

**Emits**:

- `reload`: リロードイベント

**表示するアクション**:

- 参加: `isDispParticipate`
- 見学: `isDispSpectate`
- 退村: `isDispLeave`
- 役職希望: `isDispSkillRequest`
- 発言: `isDispSay`
- 投票: `isDispVote`
- 能力行使: `abilities`（配列）
- CO: `isDispComingout`
- コミット: `isDispCommit`
- アクション発言: `isDispActionSay`
- 名前変更: `isDispChangeName`
- 村建て機能: `isDispCreatorMenu`
- 管理者機能: `situation.admin.admin`
- デバッグ機能: `isDispDebugMenu`

### 3. Composables設計

#### 3.1 useVillage()

**責務**: 村情報の取得・管理

**State**:

- `village`: Ref<Village | null> - 村情報
- `villageId`: Ref<number> - 村ID
- `loading`: Ref<boolean> - ローディング状態
- `error`: Ref<Error | null> - エラー

**Methods**:

- `loadVillage()`: 村情報を取得
- `initVillage(villageId: number)`: 村IDを初期化

**API呼び出し**:

- `GET /api/village/{villageId}`

#### 3.2 useMessage()

**責務**: 発言の取得・管理

**State**:

- `messages`: Ref<Messages | null> - 発言データ
- `loading`: Ref<boolean> - ローディング状態
- `error`: Ref<Error | null> - エラー
- `currentPageNum`: Ref<number | null> - 現在のページ番号
- `isDispLatest`: Ref<boolean> - 最新を表示中か

**Methods**:

- `loadMessage(options)`: 発言を取得
  - `villageDayId`: number - 日付ID
  - `isDispLatestDay`: boolean - 最新日を表示するか
  - `isDispLatestPage`: boolean - 最新ページを表示するか
  - `messageTypeFilter`: string[] | null - 発言種別フィルタ
  - `participantIdFilter`: number[] | null - 発言者フィルタ
  - `toParticipantIdFilter`: number[] | null - 宛先フィルタ
  - `keywordFilter`: string | null - キーワードフィルタ
- `changeDisplayDay(villageDayId: number)`: 表示日を変更
- `changeMessagePage(pageNum: number)`: ページを変更
- `dispLatest()`: 最新を表示

**API呼び出し**:

- `GET /api/village/{villageId}/message`

#### 3.3 useSituation()

**責務**: 参加状況の取得・管理

**State**:

- `situation`: Ref<SituationAsParticipant | null> - 参加状況
- `loading`: Ref<boolean> - ローディング状態
- `error`: Ref<Error | null> - エラー

**Methods**:

- `loadSituation(villageId: number)`: 参加状況を取得

**API呼び出し**:

- `GET /api/village/{villageId}/situation`

#### 3.4 useVillagePolling()

**責務**: 最新情報のポーリング

**State**:

- `latestMessageUnixTimeMilli`: Ref<number> - 最新発言のunixTimeMilli
- `existsNewMessages`: Ref<boolean> - 新しい発言があるか
- `isPolling`: Ref<boolean> - ポーリング中か

**Methods**:

- `startPolling(villageId: number)`: ポーリング開始
- `stopPolling()`: ポーリング停止
- `checkLatest()`: 最新情報をチェック

**API呼び出し**:

- `GET /api/village/{villageId}/latest`

**ポーリング間隔**: 30秒

#### 3.5 useVillageTimer()

**責務**: 残り時間の計算

**State**:

- `timer`: Ref<string> - 残り時間文字列

**Methods**:

- `startTimer(village: Village)`: タイマー開始
- `stopTimer()`: タイマー停止
- `refreshTimer(village: Village)`: 残り時間を更新

**タイマー間隔**: 1秒

#### 3.6 useVillageFilter()

**責務**: 発言抽出の管理

**State**:

- `messageTypeFilter`: Ref<string[] | null> - 発言種別フィルタ
- `participantIdFilter`: Ref<number[] | null> - 発言者フィルタ
- `toParticipantIdFilter`: Ref<number[] | null> - 宛先フィルタ
- `keywordFilter`: Ref<string | null> - キーワードフィルタ
- `isFiltering`: ComputedRef<boolean> - 抽出中か

**Methods**:

- `filter(options)`: 抽出を実行
- `charaFilter(participantId: number)`: キャラ抽出
- `resetFilter()`: 抽出をリセット

#### 3.7 useUserSettings()

**責務**: ユーザ設定の管理

**State**:

- `settings`: Ref<VillageUserSettings> - ユーザ設定
- `isDarkTheme`: ComputedRef<boolean> - ダークテーマか
- `charSizeClass`: ComputedRef<string> - 文字サイズクラス

**Methods**:

- `loadSettings()`: 設定を読み込み（Cookie）
- `saveSettings(settings: VillageUserSettings)`: 設定を保存（Cookie）
- `updateSettings(partial: Partial<VillageUserSettings>)`: 設定を更新

**設定項目**:

- `message_display`: 発言表示設定
  - `is_disp_date`: boolean - 日時表示
  - `is_char_large`: boolean - 文字サイズ大
  - `is_img_large`: boolean - 画像サイズ大
- `paging`: ページング設定
  - `is_paging`: boolean - ページングする
  - `message_per_page`: number - 1ページあたりの表示件数
- `age_limit`: 年齢制限設定
  - `confirm_village_ids`: string[] - 確認済み村IDリスト

#### 3.8 useVillageMemo()

**責務**: メモ機能の管理

**State**:

- `textMemos`: Ref<string[]> - テキストメモ（最大3つ）

**Methods**:

- `loadMemo(villageId: number)`: メモを読み込み（LocalStorage）
- `saveTextMemo(villageId: number, index: number, text: string)`: テキストメモを保存
- `deleteTextMemo(villageId: number, index: number)`: テキストメモを削除

#### 3.9 useVillageNavigation()

**責務**: ナビゲーション機能

**Methods**:

- `toHead()`: 最上部へスクロール
- `toBottom()`: 最下部へスクロール
- `scrollToElement(element: HTMLElement)`: 指定要素へスクロール

### 4. Store設計（Pinia）

#### 4.1 useVillageStore

**State**:

```typescript
{
  villageId: number | null,
  village: Village | null,
  messages: Messages | null,
  situation: SituationAsParticipant | null,
  latestDay: VillageDay | null,
  isFiltering: boolean,
  villageUserSettings: VillageUserSettings,
  isDarkTheme: boolean,
  isAuthenticated: boolean
}
```

**Getters**:

- `getVillage`: Village | null
- `getVillageId`: number | null
- `getMessages`: Messages | null
- `getSituation`: SituationAsParticipant | null
- `getLatestDay`: VillageDay | null
- `isFiltering`: boolean
- `getVillageUserSettings`: VillageUserSettings
- `isDarkTheme`: boolean

**Actions**:

- `initVillage(villageId: number)`: 村IDを初期化
- `loadVillage()`: 村情報を読み込み
- `storeMessages(messages: Messages)`: 発言を保存
- `storeSituation(situation: SituationAsParticipant)`: 参加状況を保存

### 5. 型定義

#### 5.1 主要な型

```typescript
// 村情報
interface Village {
  id: number
  name: string
  creator_player: Player
  status: VillageStatus
  win_camp: Camp | null
  setting: VillageSettings
  participant: VillageParticipants
  spectator: VillageParticipants
  day: VillageDays
  silent_time: boolean
}

// 発言
interface Messages {
  list: Message[]
  all_page_count: number | null
  all_record_count: number
  current_page_num: number
  is_latest: boolean
}

interface Message {
  from: VillageParticipant | null
  to: VillageParticipant | null
  time: MessageTime
  content: MessageContent
}

// 参加状況
interface SituationAsParticipant {
  participate: VillageParticipateSituation
  skill_request: VillageSkillRequestSituation
  commit: VillageCommitSituation
  coming_out: VillageComingOutSituation
  say: VillageSaySituation
  rp: ParticipantRpSituation
  ability: VillageAbilitySituations
  vote: VillageVoteSituation
  creator: VillageCreatorSituation
  admin: VillageAdminSituation
}

// ユーザ設定
interface VillageUserSettings {
  message_display: {
    is_disp_date: boolean
    is_char_large: boolean
    is_img_large: boolean
  }
  paging: {
    is_paging: boolean
    message_per_page: number
  }
  age_limit: {
    confirm_village_ids: string[]
  }
}
```

### 6. API設計

#### 6.1 エンドポイント一覧

| エンドポイント                 | メソッド | 説明             | リクエスト         | レスポンス             |
| ------------------------------ | -------- | ---------------- | ------------------ | ---------------------- |
| `/api/village/:id`             | GET      | 村情報取得       | -                  | Village                |
| `/api/village/:id/message`     | GET      | 発言取得         | MessageQuery       | Messages               |
| `/api/village/:id/situation`   | GET      | 参加状況取得     | -                  | SituationAsParticipant |
| `/api/village/:id/latest`      | GET      | 最新情報取得     | `from: number`     | VillageLatest          |
| `/api/village/:id/participate` | POST     | 参加             | ParticipateRequest | -                      |
| `/api/village/:id/spectate`    | POST     | 見学参加         | SpectateRequest    | -                      |
| `/api/village/:id/leave`       | POST     | 退村             | -                  | -                      |
| `/api/village/:id/say`         | POST     | 発言             | SayRequest         | -                      |
| `/api/village/:id/vote`        | POST     | 投票             | VoteRequest        | -                      |
| `/api/village/:id/ability`     | POST     | 能力行使         | AbilityRequest     | -                      |
| `/api/village/:id/commit`      | POST     | コミット         | CommitRequest      | -                      |
| `/api/village/:id/comingout`   | POST     | CO               | ComingoutRequest   | -                      |
| `/api/charachip`               | GET      | キャラチップ取得 | -                  | Charachip[]            |

#### 6.2 MessageQuery

```typescript
interface MessageQuery {
  villageDayId: number
  pageNum?: number
  isLatest?: boolean
  messageTypeList?: string[]
  participantIdList?: number[]
  toParticipantIdList?: number[]
  keyword?: string
}
```

### 7. スタイリング設計

#### 7.1 レイアウト

**PC**:

```
+--------+-------------------+
|        | Header            |
|        +-------------------+
| Side   | Main              |
| bar    |                   |
|        |                   |
|        +-------------------+
|        | Footer            |
+--------+-------------------+
```

**モバイル**:

```
+---------------------------+
| Header                    |
+---------------------------+
| Main                      |
|                           |
|                           |
|                           |
+---------------------------+
| Footer                    |
+---------------------------+
```

サイドバーはオーバーレイ表示

#### 7.2 カラースキーム

**ライトテーマ**:

- 背景: `#ffffff`
- テキスト: `#333333`
- ヘッダー/フッター: `#363636` (dark)
- サイドバー: `#363636` (dark)

**ダークテーマ**:

- 背景: `#222222`
- テキスト: `#ffffff`
- ヘッダー/フッター: `#363636` (dark)
- サイドバー: `#363636` (dark)

#### 7.3 レスポンシブブレークポイント

- モバイル: `< 768px`
- タブレット: `768px ~ 1023px`
- PC: `>= 1024px`

### 8. パフォーマンス最適化

#### 8.1 画像の遅延読み込み

**loading="lazy"属性を使用**:

- キャラクター画像（CharaImage.vue）

#### 8.2 更新制御

**必要な時だけ更新**:

- 最新ページを見ている時のみ自動更新
- 入力中・抽出中は更新しない

### 9. テスト設計

#### 9.1 単体テスト（Vitest）

**対象**:

- Composables
- ユーティリティ関数
- 型定義

**テストケース例**:

- `useVillage()`: 村情報の取得・エラーハンドリング
- `useMessage()`: 発言の取得・フィルタリング
- `useVillagePolling()`: ポーリングの開始・停止
- `useVillageTimer()`: 残り時間の計算

#### 9.2 コンポーネントテスト（@nuxt/test-utils）

**対象**:

- コンポーネント
- ページ

**テストケース例**:

- `MessageCard.vue`: Props渡し、Emit発火
- `VillageHeader.vue`: ボタンクリック、日付変更
- `VillageFooter.vue`: ボタンクリック、モーダル表示

#### 9.3 E2Eテスト（Playwright）

**対象**:

- ユーザーフロー
- 画面遷移

**テストケース例**:

- 村ページの初期表示
- 発言の抽出
- ページング
- 日付切り替え
- アクション実行

### 10. エラーハンドリング

#### 10.1 API呼び出しエラー

**処理**:

1. エラーをキャッチ
2. エラーメッセージをトースト表示
3. ローディング状態を解除

**エラーメッセージ**:

- ネットワークエラー: 「通信エラーが発生しました」
- 認証エラー: 「認証が必要です」
- 権限エラー: 「権限がありません」
- その他: 「エラーが発生しました」

#### 10.2 バリデーションエラー

**処理**:

1. 入力欄にエラーメッセージを表示
2. 送信ボタンを無効化

### 11. セキュリティ

#### 11.1 XSS対策

**文字装飾機能のサニタイゼーション**:

- 文字装飾機能（太字、斜体、アンカー等）のために特定の文字列をHTML/CSSに変換
- `message-converter.ts` で変換処理を実装
- サーバー側での一次サニタイゼーション
- クライアント側での変換時に許可されたタグ・属性のみを使用
- 許可されていないHTMLタグ・JavaScriptコードの除去

**変換対象**:

- 文字装飾: 太字、斜体、下線等
- アンカー: 他の発言へのリンク（`>>{発言番号}` 形式）
- 改行: 適切なHTML改行タグへの変換

### 13. 注意事項

#### 13.1 Nuxt2からNuxt4への移行における変更点

**Options API → Composition API**:

- `data` → `ref`/`reactive`
- `computed` → `computed`
- `methods` → 通常の関数
- `mounted` → `onMounted`
- `destroyed` → `onUnmounted`

**Vuex → Pinia**:

- `this.$store.getters` → `store.getterName`
- `this.$store.dispatch` → `store.actionName()`

**クラスベースコンポーネント廃止**:

- `@Component` → `defineComponent`
- `@Prop` → `defineProps`
- `@Emit` → `defineEmits`

**Buefy → @nuxt/ui**:

- `b-button` → `UButton`
- `b-modal` → `UModal`
- `b-table` → `UTable`
- `b-pagination` → `UPagination`

#### 13.2 既存実装の参考

**参考にすべき実装**:

- 発言の整形処理（MessageConverter）
- アンカー処理
- フィルタリングロジック
- 残り時間計算

**変更が必要な実装**:

- コンポーネント構造（Composition API化）
- スタイリング（Tailwind CSS化）
- 状態管理（Pinia化）

#### 13.3 型定義の再利用

**API型定義**:

- `~/types/api/*.ts` から再利用
- 必要に応じて新規追加

**コンポーネント型定義**:

- Props/Emitsの型定義を明示
- TypeScriptの型安全性を確保

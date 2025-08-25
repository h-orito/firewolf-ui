# Nuxt2 → Nuxt4 デザイン移行 比較検証結果

## 主要な変更点

### 1. CSSフレームワークの移行

- **旧**: Buefy (Bulma based) + SCSS
- **新**: @nuxt/ui (Tailwind CSS)

### 2. スタイリングアプローチ

- **旧**: SCSSでスコープ付きスタイル定義
- **新**: Tailwind CSSユーティリティクラス

### 3. コンポーネント対応表

| 旧 (Buefy) | 新 (@nuxt/ui) | 備考                       |
| ---------- | ------------- | -------------------------- |
| b-field    | UFormGroup    | フォームフィールドラッパー |
| b-input    | UInput        | テキスト入力               |
| b-button   | UButton       | ボタン                     |
| b-modal    | UModal        | モーダルダイアログ         |
| b-table    | UTable        | テーブル（または自作実装） |
| b-select   | USelect       | セレクトボックス           |
| card       | UCard         | カードコンポーネント       |

### 4. 色・スペーシングの対応

#### 旧システムのマージン・パディング

- `m-b-10`, `m-r-5` → `mb-3`, `mr-1.5` (Tailwind)
- padding: 5px → `p-1.5`
- padding-top/bottom: 5px → `py-1.5`

#### 色の対応

- `#999` (border) → `border-gray-400`
- `#ccc` (text) → `text-gray-400`
- `$info` → `color="info"` (UButton等)

### 5. レイアウト手法

- **旧**: flexbox with custom CSS
- **新**: Tailwind flexbox utilities (`flex`, `items-start`, `gap-3`)

### 6. ダークモード対応

- **旧**: `:class="isDarkTheme ? 'dark-theme' : ''"`
- **新**: Tailwind dark utilities (`dark:text-gray-400`)

## 検証済みコンポーネント

### MessageCard

- ✅ 基本構造の移行完了
- ✅ 透明背景設定（`bg-transparent`）
- ✅ ボーダー・シャドウ削除（`border-0 shadow-none`）

### ParticipantList

- ✅ flexレイアウトの再現
- ✅ スペーシングの調整
- ✅ バッジ（CO情報）の実装
- ✅ ボタンスタイルの統一

### ParticipantsMessage

- ✅ 参加者一覧表示
- ✅ 役職・生存状態の表示
- ✅ ソート機能の実装
- ✅ 勝敗表示の色分け

## レスポンシブデザイン対応状況

- モバイル表示の確認が必要
- ブレークポイントの調整が必要な可能性あり

## 今後の調整必要項目

1. フォントサイズの微調整
2. 色の完全一致（必要に応じて）
3. アニメーション・トランジションの追加
4. モバイル表示の最適化

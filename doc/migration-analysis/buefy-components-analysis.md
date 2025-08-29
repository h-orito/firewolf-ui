# Buefy コンポーネント使用状況分析

## 概要

現行システム（Nuxt 2 + Buefy）で使用されているBuefyコンポーネントの詳細な分析結果です。
@nuxt/ui への移行時に参照するコンポーネント一覧とその使用パターンを記録します。

## Buefy設定

- **Module**: `nuxt-buefy` (materialDesignIcons: false)
- **Base**: Bulma SCSS framework
- **カスタム色定義**: firewolf.scss で人狼ゲーム固有の色を定義

## 使用中のBuefyコンポーネント一覧

### 1. レイアウト・構造コンポーネント

#### b-field

- **使用箇所**: 63箇所
- **主要用途**: フォーム要素のラッパー
- **特徴**: ラベル、バリデーション表示、水平レイアウト対応
- **属性**: `class`, `label`, `:horizontal`, `custom-class`

#### b-modal

- **使用箇所**: 21箇所
- **主要用途**: モーダルダイアログ表示
- **特徴**: 確認画面、設定画面、村詳細表示など
- **実装パターン**:
  - 村作成確認 (`modal-confirm.vue`)
  - ユーザー設定 (`modal-user-settings.vue`)
  - 村情報表示 (`modal-village-info.vue`)

#### b-collapse

- **使用箇所**: 5箇所
- **主要用途**: 折りたたみ表示
- **実装例**: 参加者リスト、アクション詳細表示

### 2. ナビゲーション・表示コンポーネント

#### b-tabs / b-tab-item

- **使用箇所**: 2箇所（memo機能）
- **主要用途**: タブ表示
- **属性**: `type="is-boxed"`, `size="is-small"`

#### b-table / b-table-column

- **使用箇所**: 9箇所
- **主要用途**: データテーブル表示
- **実装例**:
  - 村一覧 (`village-list.vue`)
  - スキル一覧 (`rule/skill.vue`)
  - 参加村一覧 (`participate-village-list.vue`)
- **属性**: `:mobile-cards="false"`, フィールド指定

#### b-pagination

- **使用箇所**: 2箇所
- **主要用途**: ページネーション
- **実装例**: メッセージ表示の前後ページ切り替え

### 3. フォーム入力コンポーネント

#### b-input

- **使用箇所**: 22箇所
- **主要用途**: テキスト入力、パスワード入力、テキストエリア
- **属性**:
  - `size="is-small"`（小サイズ）
  - `type="password"` (パスワード)
  - `type="textarea"` (複数行)
  - `expanded` (幅拡張)

#### b-select

- **使用箇所**: 20箇所
- **主要用途**: 選択肢ドロップダウン
- **実装例**: キャラ選択、スキル選択、参加者選択
- **属性**: `expanded`, `size="is-small"`

#### b-checkbox / b-checkbox-button

- **使用箇所**: 15箇所
- **主要用途**: チェックボックス、ボタン型チェックボックス
- **実装例**: フィルター条件設定、確認チェック

#### b-switch

- **使用箇所**: 10箇所
- **主要用途**: ON/OFF切り替え
- **実装例**: ユーザー設定（ページ分割、テーマ設定など）

#### b-radio-button

- **使用箇所**: 3箇所
- **主要用途**: ボタン型ラジオボタン
- **実装例**: 発言種別選択

#### b-datetimepicker

- **使用箇所**: 1箇所
- **主要用途**: 日時選択
- **実装例**: 村開始日時設定

#### b-slider / b-slider-tick

- **使用箇所**: 1箇所
- **主要用途**: スライダー設定
- **実装例**: ページ分割数設定

### 4. アクション・ボタンコンポーネント

#### b-button

- **使用箇所**: 58箇所
- **主要用途**: アクション実行ボタン
- **サイズ**: `size="is-small"` (主に小サイズ)
- **タイプ**:
  - `type="is-primary"` (プライマリ)
  - `type="is-secondary"` (セカンダリ)
  - `type="is-danger"` (削除・退村など)
- **実装例**: 確認、キャンセル、実行、保存ボタン

### 5. 表示・通知コンポーネント

#### b-notification

- **使用箇所**: 3箇所
- **主要用途**: 通知メッセージ表示
- **属性**: `type="is-warning"`, `:closable="false"`

#### b-icon

- **使用箇所**: 15箇所
- **主要用途**: アイコン表示
- **パッケージ**: Font Awesome (`pack="fas"`)
- **実装例**: メニューアイコン、状態表示

## カスタム色定義

### 発言種別用カラー

```scss
$normal-say: #ffffff; // 通常発言
$werewolf-say: #f2cece; // 人狼発言
$sympathize-say: #cef2ce; // 共感者発言
$lovers-say: #f2dede; // 恋人発言
$monologue-say: #ddd; // 独り言
$grave-say: #ceedf2; // 墓場発言
$spectate-say: #f2f2ce; // 見学発言
$action-say: #dfdfc9; // アクション
$secret-say: #cecef2; // 秘話
```

### システムメッセージ用カラー

```scss
$private-system-bg: #eee; // プライベート
$seer-system-bg: #efe; // 占い師
$psychic-system-bg: #eef; // 霊媒師
$werewolf-system-bg: #fee; // 人狼
$mason-system-bg: #fec; // 共有者
$lovers-system-bg: #fef; // 恋人
```

### プライマリカラー

```scss
$primary: #3991f4; // メインカラー
$primary-dark: rgb(20, 180, 255); // ダークテーマ用
```

## ダークテーマ対応

現行システムではダークテーマに対応済み。各カラーに `-dark` サフィックス付きの色が定義されており、
ユーザー設定で切り替え可能。

## 移行時の注意点

### 高使用頻度コンポーネント（優先対応）

1. **b-button** (58箇所) - @nuxt/ui の UButton
2. **b-field** (63箇所) - @nuxt/ui の FormGroup または独自実装
3. **b-input** (22箇所) - @nuxt/ui の UInput
4. **b-select** (20箇所) - @nuxt/ui の USelect
5. **b-modal** (21箇所) - @nuxt/ui の UModal

### 特殊対応が必要なコンポーネント

1. **b-checkbox-button** - @nuxt/ui には直接対応なし、UButton + UCheckbox で実装
2. **b-radio-button** - @nuxt/ui には直接対応なし、UButton + URadio で実装
3. **b-datetimepicker** - @nuxt/ui には標準なし、サードパーティまたは独自実装
4. **b-slider** - @nuxt/ui には標準なし、サードパーティまたは独自実装

### カスタムスタイル継続

人狼ゲーム固有の色定義は Tailwind CSS のカスタムカラーとして移行必須。

---

**作成日**: 2025-01-24  
**更新者**: Claude Code  
**調査基準**: .old-nuxt2 ディレクトリの全 .vue ファイル

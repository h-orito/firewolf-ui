# 村作成機能 実装計画書

## 概要

村作成ページは多数の設定項目を持つ複雑なフォームです。段階的に実装を進めるため、詳細な実装計画を策定します。

## フォーム構成要素

### 1. 基本情報セクション

- **村名** (village_name)
  - 必須入力
  - 最大文字数制限あり
  - テキスト入力フィールド

### 2. 時間設定セクション

- **開始日時** (start_datetime)
  - 日付時刻ピッカー
  - デフォルト: 7日後の0時
- **沈黙時間** (silent_hours)
  - 0-23の範囲
  - 数値入力

### 3. キャラチップ設定セクション

- **キャラチップ選択** (charachip_ids)
  - 複数選択可能
  - 最低1つ必須
- **ダミーキャラ選択** (dummy_chara_id)
  - 選択したキャラチップから選択
- **ダミーキャラ名** (dummy_chara_name)
  - カスタム名称設定
  - 最大40文字
- **ダミーキャラ略称** (dummy_chara_short_name)
  - 1文字略称
  - 必須

### 4. ダミーキャラ発言設定

- **プロローグ発言** (day0_message)
  - 最大1000文字
  - 必須
- **1日目発言** (day1_message)
  - 最大1000文字
  - 任意

### 5. 編成設定セクション

- **編成** (organization)
  - 定員設定
  - 役職配分設定
  - プリセット選択機能
- **役欠け** (available_dummy_skill)
  - ON/OFFスイッチ

### 6. 詳細ルール設定

- **記名投票** (open_vote)
- **役職希望** (available_skill_request)
- **見学** (available_spectate)
- **墓下公開** (open_skill_in_grave)
- **墓下発言公開** (visible_grave_message)
- **突然死** (available_suddenly_death)
- **時短** (available_commit)
- **アクション** (available_action)
- **秘話** (available_secret_say)
- **連続護衛** (available_guard_same_target)

### 7. 発言制限設定

各発言タイプごとに回数・文字数・行数を設定：

- **通常発言** (normal)
- **囁き** (whisper)
- **共鳴** (sympathize)
- **恋人発言** (lovers)
- **墓下発言** (grave)
- **独り言** (monologue)
- **見学発言** (spectate)
- **アクション** (action)

### 8. その他設定

- **年齢制限** (age_limit)
  - プルダウン選択
- **参加パスワード** (join_password)
  - 任意設定

## API仕様

### リクエスト構造

```typescript
interface VillageRegisterBody {
  village_name: string
  setting: VillageSettingRegisterBody
}

interface VillageSettingRegisterBody {
  time: VillageTimeCreateBody
  organization: VillageOrganizationCreateBody
  charachip: VillageCharachipCreateBody
  rule: VillageRuleCreateBody
  tags: VillageTagCreateBody
}
```

## 実装フェーズ

### Phase 1: 基本構造とレイアウト

1. ページコンポーネント作成
2. セクション分割
3. 基本レイアウト実装

### Phase 2: 基本フォーム要素

1. 村名入力フィールド
2. 時間設定フィールド
3. 基本的なバリデーション

### Phase 3: キャラチップ設定

1. キャラチップ一覧取得
2. キャラチップ選択UI
3. ダミーキャラ選択UI
4. キャラ画像プレビュー

### Phase 4: 編成設定

1. 編成テンプレート機能
2. カスタム編成入力
3. 人数と役職の整合性チェック

### Phase 5: ルール設定

1. 各種スイッチコンポーネント
2. 発言制限入力フィールド
3. 相互依存するルールの制御

### Phase 6: プレビューと確認

1. 設定内容プレビュー画面
2. 確認モーダル
3. バリデーションサマリー

### Phase 7: API連携

1. データ整形処理
2. API呼び出し
3. エラーハンドリング
4. 成功後のリダイレクト

## バリデーション要件

### 必須項目

- 村名
- 開始日時
- キャラチップ（最低1つ）
- ダミーキャラ
- ダミーキャラ名・略称
- プロローグ発言
- 編成（最低定員数）

### 相互依存バリデーション

- 編成の定員と役職数の整合性
- キャラチップ選択とダミーキャラの整合性
- 発言制限の妥当性チェック

## コンポーネント構成

### 再利用可能な共通コンポーネント設計

村作成（`/create-village`）と設定変更（`/setting`）で共通利用するため、コンポーネントを以下のように設計：

```
/pages/create-village.vue                    # 村作成ページ
/pages/setting.vue                           # 設定変更ページ

/components/village-settings/                # 共通設定コンポーネント
  ├── VillageBasicInfo.vue                  # 基本情報セクション
  │   props: { modelValue, readonly?, editable? }
  ├── VillageTimeSettings.vue               # 時間設定セクション
  │   props: { modelValue, readonly?, editable? }
  ├── VillageCharachipSettings.vue          # キャラチップ設定
  │   props: { modelValue, readonly?, editable? }
  ├── VillageDummyCharaSettings.vue         # ダミーキャラ設定
  │   props: { modelValue, readonly?, editable? }
  ├── VillageOrganizationSettings.vue       # 編成設定
  │   props: { modelValue, readonly?, editable? }
  ├── VillageRuleSettings.vue               # ルール設定
  │   props: { modelValue, readonly?, editable? }
  ├── VillageMessageRestrictions.vue        # 発言制限設定
  │   props: { modelValue, readonly?, editable? }
  ├── VillageOtherSettings.vue              # その他設定
  │   props: { modelValue, readonly?, editable? }
  └── VillageSettingsPreview.vue            # プレビュー
      props: { settings }

/components/pages/create-village/            # 村作成専用
  └── VillageCreateConfirmModal.vue         # 確認モーダル

/components/pages/setting/                   # 設定変更専用
  └── VillageSettingConfirmModal.vue        # 変更確認モーダル
```

### コンポーネント設計原則

1. **Props設計**
   - `modelValue`: v-modelで双方向バインディング
   - `readonly`: 読み取り専用モード（プレビュー時）
   - `editable`: 編集可能な項目の制御（設定変更時の制限）
   - `villageId`: 既存村の設定取得用（設定変更時）

2. **emit設計**
   - `update:modelValue`: 値の更新
   - `validate`: バリデーション結果の通知
   - `change`: 変更検知

3. **状態管理の分離**
   - 村作成用: `useCreateVillageStore`
   - 設定変更用: `useVillageSettingsStore`（既存）
   - 共通ロジック: `useVillageSettingsComposable`

### 再利用パターン

#### 村作成時（/create-village）

```vue
<VillageBasicInfo
  v-model="createVillageStore.basicInfo"
  :editable="{ all: true }"
/>
```

#### 設定変更時（/setting）

```vue
<VillageBasicInfo
  v-model="villageSettingsStore.basicInfo"
  :editable="{ villageName: false, startDatetime: false }"
  :village-id="villageId"
/>
```

#### プレビュー時

```vue
<VillageBasicInfo v-model="settings.basicInfo" :readonly="true" />
```

## 編集可能項目の仕様

### 村作成時（/create-village）

全ての項目が編集可能

### 設定変更時（/setting）

#### 編集不可能な項目（村作成後は変更できない）

- **キャラチップセクション全体** (`modifiableChara: false`)
  - キャラチップ選択
  - ダミーキャラ選択
  - ダミーキャラ名
  - ダミーキャラ略称
  - プロローグ発言（0日目発言）

#### 編集可能な項目

- **基本情報**
  - 村名（※実装により異なる可能性あり）
  - 開始日時（※実装により異なる可能性あり）
  - 沈黙時間
- **ダミーキャラ発言**
  - 1日目発言のみ編集可能
- **編成**
  - 全項目編集可能
- **詳細ルール**
  - 全項目編集可能
- **発言制限**
  - 全項目編集可能
- **その他設定**
  - 年齢制限
  - 参加パスワード（※毎回空になるため要注意）

## 技術的考慮事項

### 状態管理

- Pinia storeで一時的にフォームデータを管理
- 各セクションコンポーネントはstoreと双方向バインディング

### バリデーション

- vee-validate v4を使用
- カスタムバリデーションルールの実装
- リアルタイムバリデーション

### UX考慮事項

- プログレスインジケーター
- セクション折りたたみ機能
- 設定のプリセット機能
- 入力内容の一時保存（LocalStorage）

## テスト項目

1. 各フィールドの入力・選択動作
2. バリデーションエラー表示
3. プレビュー表示の正確性
4. API送信データの整合性
5. エラー時のリトライ処理
6. 成功時のリダイレクト

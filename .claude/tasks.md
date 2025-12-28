# FIREWOLF Nuxt4移行 タスク一覧

## 概要

FIREWOLF Nuxt4移行プロジェクトの全タスクをフェーズ別に管理します。

## Phase 4: 機能移行 (Week 8-11)

### Week 8: 基本ページ実装

- [x] トップページ（`/`）実装
  - [x] 村一覧表示機能
  - [x] プレイヤー統計表示
  - [x] キャラチップ情報表示
- [x] ルール・ドキュメントページ実装
- [x] FAQ・Aboutページ実装
- [x] 静的ページのSEO対応

### Week 9: 村一覧・検索機能

- [x] 村一覧ページ（`/village-list`）実装
- [x] フィルタリング機能実装
- [x] ソート機能実装
- [x] ページネーション実装

### Week 10: キャラチップ機能

- [x] キャラチップ一覧ページ（`/charachip-list`）実装
  - [x] キャラチップ一覧表示
  - [x] ~~フィルタリング機能~~（既存にないため実装せず）
- [x] キャラチップ詳細ページ（`/charachip`）実装
  - [x] キャラチップ詳細情報表示
  - [x] キャラクター一覧表示

### Week 11: 村作成機能

- [x] 村作成ページ（`/create-village`）実装
  - [x] 基本構造・レイアウト実装
  - [x] Pinia storeセットアップ
  - [x] API型定義追加
  - [x] 基本情報セクション（村名・時間設定）
  - [x] キャラチップ設定セクション
  - [x] ダミーキャラ発言設定
  - [x] 編成設定セクション
  - [x] 詳細ルール設定
  - [x] 発言制限設定
  - [x] その他設定（年齢制限・パスワード）
- [x] 村作成フォーム実装
  - [x] 各種入力コンポーネント作成
  - [x] フォーム状態管理
- [x] vee-validate v4によるバリデーション実装
  - [x] 必須項目チェック
  - [x] 相互依存バリデーション
- [x] 各セクションコンポーネントのエラー表示改善
  - [x] BasicInfoSection - エラー表示を各項目の下に表示
  - [x] DummyMessageSection - エラー表示を各項目の下に表示
  - [x] OrganizationSection - エラー表示を各項目の下に表示
  - [x] CharachipSection - エラー表示を各項目の下に表示
  - [x] RuleSection - エラー表示を各項目の下に表示（Switchのみのためエラー表示不要）
  - [x] MessageRestrictionSection - エラー表示を各項目の下に表示
  - [x] JoinPasswordSection - エラー表示を各項目の下に表示
  - [x] RpSection - エラー表示を各項目の下に表示
- [x] 編成バリデーションの修正
  - [x] 既存実装（.old-nuxt2/components/create-village/setting.vue）から編成バリデーションロジックを抽出
  - [x] 正しい編成フォーマットの検証（例: "11人：村村村村村占霊狩狼狼狂"）
  - [x] 人数と役職数の一致チェック
  - [x] 必須役職の存在チェック（狼系最低1名、村人最低1名など）
  - [x] 役職バランスチェック（狼系が過半数を超えない）
- [x] 村設定プレビュー機能実装
- [x] キャラチップ選択機能実装
- [x] ダミーキャラクター選択モーダル実装
  - [x] 「画像から選ぶ」ボタン追加
  - [x] キャラクター画像一覧モーダル作成
  - [x] モーダルからの選択機能実装
- [x] ダミーキャラ発言セクションの画像表示機能実装
  - [x] 選択されたダミーキャラの画像を表示
  - [x] プロローグ発言の左側に画像表示
  - [x] 1日目発言の左側に画像表示
  - [x] ダミーキャラ変更時の画像自動更新
- [x] 村作成API連携
- [x] 画面初期表示時のバリデーションエラー表示を修正
  - [x] 初期表示時はバリデーションエラーを表示しない
  - [x] フィールドがtouchedになった後のみエラー表示
  - [x] submitボタン押下時に全フィールドのエラーを表示
- [x] APIエラー表示機能実装
  - [x] APIからエラーレスポンスを受け取った際の処理
  - [x] 画面上部にエラーメッセージを表示するコンポーネント作成
  - [x] 複数エラーの表示対応
- [x] 開始日時をUTCでなくJSTで送信する
  - [x] サーバー側がLocalDateTimeで受け取っているため、UTCで送ると9時間ずれてしまっている問題を修正

### Week 12: 村機能・設定ページ（最重要機能）

#### 村ページ（`/village`）実装

##### Phase 1: 基本構造の実装

###### 1.1 型定義の確認

- [x] API型定義の確認
  - `lib/api/types.ts` の確認（自動生成される型定義）
  - Village型、Messages型、SituationAsParticipant型等が利用可能か確認
  - 型定義は自動生成されるため手動での追加は不要

###### 1.2 Composablesの実装

- [x] `composables/village/useVillage.ts` の作成
  - 村情報の取得・管理
  - `GET /api/village/{villageId}` の呼び出し
  - ローディング・エラー状態管理
  - VillageStoreとの統合

- [x] `composables/village/useMessage.ts` の作成
  - 発言の取得・管理
  - `GET /api/village/{villageId}/message` の呼び出し
  - ページング制御
  - 日付変更処理
  - フィルタ条件の適用

- [x] `composables/village/useSituation.ts` の作成
  - 参加状況の取得・管理
  - `GET /api/village/{villageId}/situation` の呼び出し
  - situationベースの権限判定
  - VillageStoreとの統合

- [x] `composables/village/useVillageTimer.ts` の作成
  - 残り時間の計算
  - 1秒間隔のタイマー処理
  - 状態に応じた表示文字列生成
  - onUnmountedでのクリーンアップ
  - 村ステータス定数の使用

- [x] `composables/village/useVillageNavigation.ts` の作成
  - スクロール処理（最上部・最下部）
  - 特定要素へのスクロール
  - コンテナ指定スクロール対応

- [x] `composables/village/useVillagePolling.ts` の作成
  - 30秒間隔のポーリング
  - `GET /api/village/{villageId}/latest` の呼び出し
  - 新着発言の検知
  - 日付変更の検知
  - VillageStoreとの統合
  - onUnmountedでのクリーンアップ

- [x] `composables/village/useVillageMessageFilter.ts` の作成（旧useVillageFilter）
  - 抽出条件の管理
  - 抽出の実行・リセット
  - キャラ抽出
  - VillageMessageFilterStoreとの統合
  - 発言種別反転機能の実装

- [x] `composables/village/useUserSettings.ts` の作成
  - Cookie保存・読み込み
  - 設定の更新
  - ページング設定、発言表示設定、ダークテーマ等
  - VillageUserSettingsStoreとの統合

- [x] `composables/village/useVillageMemo.ts` の作成
  - LocalStorage保存・読み込み
  - テキストメモの保存（最大3つ）
  - メモの削除
  - @vueuse/coreのuseLocalStorageを使用

###### 1.3 Storeの実装

- [x] `stores/village.ts` の作成
  - State定義（villageId, village, situation, villageLatest）
  - Computed定義（latestDay, restrictCountMap）
  - Actions定義（init, saveVillage, saveSituation, saveVillageLatest, reset）
  - readonlyによる状態保護

- [x] `stores/village-message-filter.ts` の作成
  - フィルタ状態管理（messageTypeGroups, participantIdFilter等）
  - MESSAGE_TYPE_GROUP_MAPによる発言種別マッピング
  - Computed定義（messageTypeFilter, isFiltering）
  - Actions定義（setMessageFilter, resetMessageFilter）

- [x] `stores/village-user-settings.ts` の作成
  - ユーザー設定状態管理
  - Actions定義（updateSettings）

###### 1.4 村ページレイアウトコンポーネントの作成

- [x] `components/pages/village/VillageHeader.vue` の作成
  - 日付切り替えボタン（前日・翌日）
  - 最上部スクロールボタン
  - タイトル表示

- [x] `components/pages/village/VillageFooter.vue` の作成
  - 更新ボタン
  - 最下部スクロールボタン
  - 抽出ボタン
  - 残り時間表示
  - サイドバー切り替えボタン（Mobile）

- [x] `components/pages/village/VillageSidebar.vue` の作成
  - 村の設定モーダル起動
  - 参加者リスト表示切り替え
  - メモモーダル起動
  - ユーザ設定モーダル起動
  - トップページリンク

###### 1.5 ページの実装

- [x] `pages/village.vue` の作成
  - URLクエリパラメータ `id` の取得
  - `useAuth` composableを使用した認証状態の取得
  - 各Composablesの統合
  - 既存の `layouts/village.vue` の使用
  - ページ内でのレイアウト構造実装
    - サイドバー・ヘッダー・メイン・フッターの配置
    - レスポンシブ対応（PC: サイドバー左固定、Mobile: オーバーレイ）
    - サイドバーの表示切り替え制御

###### ex1: @nuxt/ui・@nuxt/icon 依存削除

**目的**: @nuxt/uiと@nuxt/iconへの依存をなくし、Tailwind CSS + 独自実装でUIコンポーネントを提供する

**実装方針**:

- アイコン: `@heroicons/vue` を使用（heroicons以外は個別SVG対応）
- セレクト: ネイティブselectをラッパーで包む（将来のカスタム化に対応可能）
- その他: Tailwind CSSで独自実装

####### ex1.1 アイコンコンポーネントの実装

- [x] `@heroicons/vue` パッケージのインストール
- [x] `components/ui/icon/Icon.vue` の作成
  - @heroicons/vueをラップ
  - Props: name, size, class
  - heroicons以外のアイコン（twitter, google等）は個別SVGで対応
- [x] UIcon使用箇所をIconコンポーネントに置き換え
  - VillageHeader.vue
  - VillageFooter.vue
  - VillageSidebar.vue
  - NavBarSlider.vue
  - Modal.vue
  - PreviewModal.vue
  - SigninModal.vue
  - Alert.vue

####### ex1.2 ボタンコンポーネントの独自実装

- [x] `components/ui/button/index.vue` を独自実装に変更
  - UButtonへの依存を削除
  - Tailwind CSSでスタイリング
  - Props: color, variant, size, disabled, loading, block, icon, type, class
- [x] UButton直接使用箇所をUiButtonに統一
  - NavBar.vue
  - NavBarSlider.vue
  - VillageHeader.vue
  - VillageFooter.vue
  - VillageSidebar.vue
  - OrganizationSection.vue
  - ModalFilter.vue
  - その他

####### ex1.3 入力コンポーネントの独自実装

- [x] `components/ui/form/FormInput.vue` の作成（テキスト入力）
  - Tailwind CSSでスタイリング
  - Props: modelValue, type, placeholder, required, disabled, readonly, size, maxlength, error, id, name, min, max, step
  - Events: update:modelValue, blur
  - $attrs透過対応（class等を親から受け取り可能）
- [x] `components/ui/form/FormNumberInput.vue` を独自実装に変更
  - UInputへの依存を削除
  - FormInputコンポーネントをラップして実装
  - NaNハンドリングを追加
- [x] `components/ui/form/FormTextarea.vue` の作成
  - UTextareaの代替
  - Props: modelValue, placeholder, rows, maxlength, required, disabled, readonly, size, error, id, name
  - Events: update:modelValue, blur
  - $attrs透過対応（class等を親から受け取り可能）
- [x] UInput/UTextarea使用箇所を置き換え
  - BasicInfoSection.vue
  - JoinPasswordSection.vue
  - OrganizationSection.vue
  - DummyMessageSection.vue
  - ModalFilter.vue

####### ex1.4 スイッチ・チェックボックスコンポーネントの独自実装

- [x] `components/ui/form/FormSwitch.vue` を独自実装に変更
  - USwitchへの依存を削除
  - Tailwind CSSでトグルスイッチを実装
- [x] `components/ui/form/FormCheckbox.vue` の作成
  - UCheckboxの代替
  - Tailwind CSSでスタイリング
- [x] 使用箇所を置き換え
  - RuleSection.vue
  - RpSection.vue
  - OrganizationSection.vue
  - ModalFilter.vue

####### ex1.5 セレクトコンポーネントの独自実装

- [x] `components/ui/form/FormSelect.vue` の作成
  - USelect/USelectMenuの代替
  - ネイティブselectをラッパーで包む（将来のカスタム化に対応可能）
  - Props: modelValue, options, placeholder, disabled, size
  - Tailwind CSSでスタイリング
- [x] `components/ui/form/FormMultiSelect.vue` の作成
  - 複数選択用セレクトコンポーネント
  - ネイティブselect(multiple)をラッパーで包む
  - 選択済みアイテムの青色スタイリング
- [x] 使用箇所を置き換え
  - RpSection.vue
  - CharachipSection.vue

####### ex1.6 モーダルコンポーネントの独自実装

- [x] `components/ui/modal/Modal.vue` を独自実装に変更
  - UModalへの依存を削除
  - Teleport + Tailwind CSSで実装
  - アクセシビリティ対応（ESCキー、aria-label）
- [x] 使用箇所の確認と動作検証
  - PolicyModal.vue
  - TermModal.vue
  - KampaModal.vue
  - SigninModal.vue
  - LinkModal.vue
  - PreviewModal.vue

####### ex1.7 アコーディオンコンポーネントの独自実装

- [x] `components/ui/accordion/Accordion.vue` の作成
  - UAccordionの代替
  - Tailwind CSSでスタイリング
  - 開閉アニメーション
- [x] 使用箇所を置き換え
  - VillageSidebar.vue

####### ex1.8 バッジコンポーネントの独自実装

- [x] `components/ui/badge/index.vue` を独自実装に変更
  - UBadgeへの依存を削除
  - Tailwind CSSでスタイリング
  - Props: color, variant, size

####### ex1.9 アイコンコンポーネントの拡張（Font Awesome・MDI対応）

**方針**: 独自SVG実装（依存追加なし）、ファイル分離構成

**ファイル構成**:

```
app/components/ui/icon/
├── Icon.vue          # メインコンポーネント（約150行）
├── heroicons.ts      # @heroicons/vue のマッピング（既存を分離）
└── svg-icons.ts      # FA/MDI用SVGパス定義（新規）
```

- [x] `components/ui/icon/heroicons.ts` の作成
  - 既存Icon.vueの@heroicons/vueマッピングを分離
- [x] `components/ui/icon/svg-icons.ts` の作成
  - FA/MDIアイコンのSVGパス定義
  - 対象アイコン:
    - `fa6-solid:spinner` (ローディング)
    - `fa6-solid:image` (画像)
    - `fa6-solid:book` (本)
    - `fa6-solid:circle-question` (FAQ)
    - `fa6-solid:wrench` (設定)
    - `fa6-solid:gift` (ギフト)
    - `fa6-solid:book-open` (ドキュメント)
    - `fa6-solid:chart-bar` (統計)
    - `fa6-solid:right-from-bracket` (ログアウト)
    - `fa6-brands:twitter` (Twitter/X)
    - `fa6-brands:google` (Google)
    - `mdi:alert-circle` (警告)
    - `mdi:account` (アカウント)
- [x] `components/ui/icon/Icon.vue` の更新
  - heroicons.ts, svg-icons.ts をインポート
  - SVGアイコンとheroiconsコンポーネントの両方を描画可能に
  - アイコン名を短縮形式（`spinner`, `twitter`等）で指定可能に
- [x] 使用箇所の動作確認・短縮形式への更新
  - index.vue
  - Intro.vue
  - Charachip.vue
  - IndexFooter.vue
  - PlayerStats.vue
  - LinkModal.vue
  - SigninModal.vue
  - DummyMessageSection.vue
  - CharaSelectModal.vue
  - OrganizationSection.vue
  - CharachipSection.vue
  - MessageRestrictionSection.vue
  - BasicInfoSection.vue

####### ex1.10 ラジオグループコンポーネントの独自実装

- [x] `components/ui/form/FormRadioGroup.vue` の作成
  - URadioGroupの代替
  - Tailwind CSSでスタイリング
  - Props: modelValue, options, orientation
  - v-model対応
- [x] SayForm.vue の URadioGroup を置き換え

####### ex1.11 フォームグループコンポーネントの独自実装

- [x] `components/ui/form/FormGroup.vue` の作成
  - UFormGroupの代替
  - ラベル + コンテンツのラッパー
  - Props: label, required
  - slot でコンテンツを受け取る（default, help, error）
- [x] SayForm.vue の UFormGroup を置き換え
- [x] SayForm.vue の USelect を FormSelect.vue に置き換え
- [x] SayForm.vue の UTextarea を FormTextarea.vue に置き換え

####### ex1.12 app.vue の UApp 削除

- [x] `app/app.vue` の更新
  - UApp をシンプルな構造に置き換え
  - NuxtLayout + NuxtPageのみに

####### ex1.13 設定ファイルの更新

- [x] `nuxt.config.ts` の更新
  - @nuxt/uiモジュールを削除
  - @nuxt/iconモジュールを削除
- [x] `app.config.ts` の更新
  - ui設定を削除
- [x] `package.json` の更新
  - @nuxt/ui依存を削除
  - @nuxt/icon依存を削除
- [x] `app/assets/css/main.css` の更新
  - @nuxt/ui用のCSS importを削除
  - 独自スタイルを整理

####### ex1.14 動作確認

- [x] `pnpm lint && pnpm format && pnpm type-check` パス
- [x] `pnpm dev` で起動確認
- [x] 主要ページの動作確認
  - トップページ（アイコン表示）
  - 村作成ページ（フォーム）
  - 村ページ（SayForm）

###### 1.6 初期表示フローの実装

- [x] 初期表示フローの実装
  - [x] 村情報の取得（`initVillage()`）
  - [x] 参加状況の取得（`loadSituation()`）
  - [x] キャラチップ情報の取得（`initVillage()` 内）
  - [x] 残り時間表示タイマーの開始（`VillageFooter.vue`）
  - 最新日・最新ページの発言取得 → 2.1で実装
  - 年齢制限モーダルの表示判定 → 5.5で実装

##### Phase 2: 発言機能の実装

###### 2.1 発言表示の基本実装

- [x] `components/pages/village/VillageDayList.vue` の作成
  - 日付選択リスト
  - 発言の先頭と末尾に配置

- [x] `components/pages/village/message/MessageList.vue` の作成
  - 発言リストの表示
  - ページネーション
  - 最新ボタン
  - `useMessage`のwatch有効化による初期表示時の発言取得

- [x] `components/pages/village/message/MessageCard.vue` の作成
  - 個別発言の表示
  - アンカーの処理
  - 発言アクションの表示

###### 2.2 発言種別対応

- [x] `components/pages/village/message/SayMessage.vue` の作成（MessageSay.vueから名称変更）
  - 通常発言の表示
  - 発言種別に応じたスタイリング
  - キャラクター情報の表示

- [x] `components/pages/village/message/SystemMessage.vue` の作成（MessageSystem.vueから名称変更）
  - システムメッセージの表示
  - 公開/非公開システムの判定

- [x] `components/pages/village/message/message-converter.ts` の作成
  - 発言テキストのHTML/CSS変換処理
  - 文字装飾（太字、斜体等）の変換
  - アンカー（`>>{発言番号}`）の変換
  - XSS対策（許可されたタグ・属性のみ使用）

###### 2.3 発言関連のUI実装

- [x] `components/pages/village/message/ParticipantsMessage.vue` の作成
  - 発言内の参加者リスト表示

- [x] `components/pages/village/message/VillageSituationMessage.vue` の作成
  - 状況メッセージの表示

###### 2.4 ページング・日付切り替え

- [x] ページング機能の実装
  - 1ページあたりの表示件数制御
  - ページ番号での表示切り替え（最大5つまで表示、省略記号削除）
  - << >> ボタンで先頭/末尾ページへジャンプ
  - 「最新」ボタンで最新の日に移動して最新ページを表示

- [x] 日付切り替え機能の実装
  - 前日/翌日ボタンでの日付変更
  - 日付リストからの選択

##### Phase 3: 抽出機能の実装

###### 3.1 抽出モーダル

- [x] `components/pages/village/footer/ModalFilter.vue` の作成
  - 発言種別の選択
  - 発言者の選択（全てON/OFF/反転）
  - 宛先の選択（全てON/OFF/反転/自分宛）
  - キーワード入力

###### 3.2 個別抽出・URLパラメータ対応

- [x] 個別抽出機能の実装
  - サイドバー参加者リストからの抽出
  - 新規タブ設定の考慮

- [x] URLパラメータでの抽出対応
  - `?filterId=参加者ID` での直接抽出
  - 初期表示時の抽出適用

##### Phase 4: アクション機能の実装

###### 4.1 アクションコンテナ

- [x] `components/pages/village/action/ActionContainer.vue` の作成
  - situationベースの表示制御
  - 各アクションコンポーネントの管理
  - useActionReset composableによるリセット処理

###### 4.2 参加・見学・退村

- [x] `components/pages/village/action/Participate.vue` の作成
  - キャラクター選択
  - 役職希望選択
  - 入村パスワード入力

- [x] `components/pages/village/action/Spectate.vue` の作成
  - 見学参加処理

- [x] `components/pages/village/action/Leave.vue` の作成
  - 退村処理

###### 4.3 発言入力

- [x] `components/pages/village/action/Say.vue` の作成
  - 発言種別選択
  - 発言内容入力
  - 文字装飾ボタン
  - アンカー挿入
  - 表情種別選択

- [x] `components/pages/village/action/SayConfirm.vue` の作成
  - 発言確認モーダル

- [x] `components/pages/village/action/ActionTypeSay.vue` の作成
  - アクション発言入力
  - 短い行動メッセージの入力

###### 4.4 役職希望・名前変更

- [x] `components/pages/village/action/SkillRequest.vue` の作成
  - 第一希望・第二希望選択
  - 役職希望変更処理

- [ ] `components/pages/village/action/ChangeName.vue` の作成
  - キャラ名変更
  - 1文字略称変更

###### 4.5 管理者機能

- [ ] `components/pages/village/action/admin/Admin.vue` の作成
  - デバッグ用村情報表示

###### 4.6 デバッグ機能（ローカル環境のみ）

- [ ] `components/pages/village/action/debug/Debug.vue` の作成
  - N人参加
  - ダミーログイン
  - 突然死なし設定
  - 日付進行
  - 100回発言

###### 4.7 投票・能力行使

- [ ] `components/pages/village/action/Vote.vue` の作成
  - 投票対象選択
  - 投票処理

- [ ] `components/pages/village/action/Ability.vue` の作成
  - 能力種別に応じた対象選択
  - 能力行使処理

###### 4.8 コミット・CO

- [ ] `components/pages/village/action/Commit.vue` の作成
  - コミット処理

- [ ] `components/pages/village/action/Comingout.vue` の作成
  - 役職選択
  - CO処理

###### 4.9 村建て機能

- [ ] `components/pages/village/action/creator/CreatorSay.vue` の作成
  - 村建て発言入力

- [ ] `components/pages/village/action/creator/KickOut.vue` の作成
  - 参加者選択
  - キックアウト処理

- [ ] `components/pages/village/action/creator/ExtendEpilogue.vue` の作成
  - エピローグ延長処理

- [ ] `components/pages/village/action/creator/Cancel.vue` の作成
  - 廃村処理

- [ ] `components/pages/village/action/creator/SettingsLink.vue` の作成
  - 村設定変更画面へのリンク
  - プロローグ中のみ表示

##### Phase 5: 補助機能の実装

###### 5.1 サイドバー機能

- [ ] `components/pages/village/sidebar/ParticipantList.vue` の作成
  - 生存者・死亡者・見学者のリスト表示
  - CO情報の表示
  - 発言回数の表示
  - 個別抽出リンク

- [ ] `components/pages/village/sidebar/ModalVillageInfo.vue` の作成
  - 村の設定情報表示
  - 参加人数表示（状態による切り替え）
  - 役職編成表示（状態による切り替え）

###### 5.2 ユーザ設定

- [ ] `components/pages/village/sidebar/ModalUserSettings.vue` の作成
  - ページング設定
  - 発言表示設定
  - ダークテーマ切り替え

###### 5.3 メモ機能

- [ ] `components/pages/village/sidebar/memo/ModalMemo.vue` の作成
  - メモ一覧表示
  - メモ編集UI

- [ ] `components/pages/village/sidebar/memo/TextMemo.vue` の作成
  - テキストメモ入力
  - 文字数カウント

###### 5.4 ポーリング・通知

- [ ] トースト通知の実装
  - 日付変更通知
  - 最新発言取得通知
  - エラー通知
  - アクションパネルでの処理成功通知

###### 5.5 年齢制限確認

- [ ] `components/pages/village/ModalAgeLimit.vue` の作成
  - R指定村の確認モーダル
  - Cookie保存での確認済み記録
  - 村ページ（`village.vue`）への統合と表示判定ロジック

###### 5.6 未実装項目の追加実装

- [ ] メッセージ内のアンカークリック時の動作
- [ ] メッセージ右下の返信ボタン
- [ ] メッセージ右下の秘話ボタン

##### Phase 6: 最適化・テスト

###### 6.1 パフォーマンス最適化

- [ ] 更新制御の実装
  - 最新ページ表示時のみ自動更新
  - 入力中・抽出中は更新しない

###### 6.2 レスポンシブ対応

- [ ] PC表示の確認
  - サイドバー左全面固定の動作確認
  - ヘッダー/メイン/フッターの縦並び確認

- [ ] モバイル表示の確認
  - サイドバーオーバーレイの動作確認
  - ヘッダー・メイン・フッターの縦積み確認

- [ ] Safari対策
  - アドレスバー対応の動的高さ調整
  - セーフエリア対応のフッター余白

###### 6.3 テスト

- [ ] 単体テスト（Vitest）
  - Composablesのテスト
  - message-converter.ts のテスト

- [ ] コンポーネントテスト（@nuxt/test-utils）
  - MessageCard.vue のテスト
  - VillageHeader.vue のテスト
  - VillageFooter.vue のテスト

- [ ] E2Eテスト（Playwright）
  - 村ページの初期表示
  - 発言の抽出
  - ページング
  - 日付切り替え
  - アクション実行

###### 6.4 品質チェック

- [ ] コードレビュー
  - TypeScript型定義の確認
  - エラーハンドリングの確認
  - XSS対策の確認

- [ ] 既存実装との比較確認
  - 機能の完全性確認
  - UI/UXの一致確認

##### 注意事項

- 実装時は必ず `doc/village/requirements.md` と `doc/village/designs.md` を参照
- 型定義は `~/types/api/*.ts` から再利用
- 既存実装（`.old-nuxt2` 配下）の発言整形処理・アンカー処理・フィルタリングロジック・残り時間計算は参考にする
- situationのAPIレスポンスに基づいて権限制御を行う
- 各Phase完了時に動作確認を実施

#### 設定ページ（`/setting`）実装

- [ ] プレイヤー設定
- [ ] 通知設定
- [ ] 表示設定

### Week 13: プレイヤー戦績機能

- [ ] プレイヤー戦績（`/player-record`）実装
  - [x] 基本的な戦績表示機能
  - [ ] ドーナツチャートによる勝敗表示
  - [ ] 自己紹介編集機能（モーダル）

### 📋 Week 8-13完了基準

- [ ] 全機能が現行と同等に動作
- [ ] Class Components → Composition API移行完了
- [ ] 機能テストが全て通過
- [ ] エラーが発生しない

---

## Phase 5: 最適化・本番準備 (Week 14-15)

### Week 14: パフォーマンス最適化

- [ ] バンドルサイズ分析・最適化
- [ ] 遅延ローディング実装
- [ ] 画像最適化実装
- [ ] キャッシュ戦略実装
- [ ] Lighthouse スコア測定・改善
- [ ] PWA対応（@vite-pwa/nuxt）
- [ ] Service Worker実装
- [ ] オフライン対応実装

### Week 15: テスト・デプロイ準備

- [ ] Vitest単体テスト実装
  - [ ] コンポーネントテスト
  - [ ] ストアテスト
  - [ ] ユーティリティ関数テスト
- [ ] Playwright E2Eテスト実装
  - [ ] 主要フローテスト
  - [ ] 回帰テスト
- [ ] 環境変数設定
- [ ] ビルド設定最適化
- [ ] CI/CD設定
- [ ] エラー監視設定
- [ ] 本番環境デプロイテスト

### 📋 Week 14-15完了基準

- [ ] Lighthouse Score 90以上
- [ ] テストカバレッジ 80%以上
- [ ] 本番環境で正常動作
- [ ] パフォーマンス要件達成

---

## 🚨 リスク対応タスク

### 高優先度リスク対応

- [ ] @nuxt/ui非対応時の代替計画実行準備
- [ ] Firebase認証移行のロールバック計画作成
- [ ] デザイン再現困難時の対応策準備

### 継続監視タスク

- [ ] 週次リスク評価実施
- [ ] パフォーマンス継続監視
- [ ] 品質メトリクス測定

---

## 📝 ドキュメント更新タスク

### 開発中の更新

- [ ] 技術課題・解決策の記録
- [ ] APIドキュメントの更新
- [ ] コンポーネント仕様書の作成

### 完了時の更新

- [ ] 最終的な技術選定結果の記録
- [ ] 移行完了レポートの作成
- [ ] 運用・メンテナンス手順書の作成

---

## 🐛 バグ修正タスク

### 村作成フォームのリファクタリング ✅ 完了

- [x] stores/create-village.ts の不要なstore管理を削除
  - [x] フォーム状態管理の削除（既存にない機能）
  - [x] 必要最小限の状態管理に変更
  - [x] 最終的にstore自体を削除してページ内で直接API呼び出しに変更
- [x] components/village-settings 配下のコンポーネントを移動
  - [x] components/pages/create-village/ ディレクトリを作成
  - [x] village-settings 配下のコンポーネントをpages/create-village/に移動
  - [x] import文の修正
  - [x] 不要になったvillage-settingsディレクトリを削除

---

## 🔧 コンポーネント構造リファクタリング

### コンポーネント配置ガイドラインへの準拠

#### UIコンポーネントのディレクトリ整理

- [x] components/ui/ ディレクトリ構造の作成
  - [x] components/ui/feedback/ ディレクトリを作成
  - [x] components/ui/modal/ ディレクトリを作成
  - [x] components/ui/form/ ディレクトリを作成
  - [x] components/ui/button/ ディレクトリを作成
  - [x] components/ui/card/ ディレクトリを作成
  - [x] components/ui/navigation/ ディレクトリを作成
  - [x] components/ui/table/ ディレクトリを作成

#### 既存コンポーネントの移動

- [x] Alert.vue の移動とリファクタリング
  - [x] app/components/Alert.vue を app/components/ui/feedback/Alert.vue に移動
  - [x] 使用箇所のimport文を修正（明示的importを追加）
  - [x] コンポーネント名の確認（必要に応じて変更）
- [x] Loading.vue の移動とリファクタリング
  - [x] app/components/Loading.vue を app/components/ui/feedback/LoadingSpinner.vue にリネームして移動
  - [x] 使用箇所のimport文を修正（明示的importを追加）
  - [x] コンポーネント名の確認（必要に応じて変更）
- [x] Modal.vue の移動とリファクタリング
  - [x] app/components/Modal.vue を app/components/ui/modal/BaseModal.vue にリネームして移動
  - [x] 使用箇所のimport文を修正（明示的importを追加）
  - [x] コンポーネント名の確認（必要に応じて変更）

#### import文の一括更新

- [x] 全ファイルでコンポーネントのimport文を検索・更新
  - [x] Alert.vue の参照を更新（明示的importを追加）
  - [x] LoadingSpinner.vue の参照を更新（明示的importを追加）
  - [x] BaseModal.vue の参照を更新（明示的importを追加）
  - [x] Auto Importの設定確認（明示的importを使用）

#### テスト・動作確認

- [x] 各ページでコンポーネントが正常に表示されることを確認
  - [x] Alert表示の確認
  - [x] Loading表示の確認
  - [x] Modal表示の確認
- [x] playwrightでの動作確認
- [x] コンソールエラーがないことを確認

---

## 🎯 品質チェックポイント

### 各フェーズ共通

- [ ] 開発コマンド品質チェック
  - [ ] `pnpm lint` - ESLint警告・エラーなし
  - [ ] `pnpm format` - コードフォーマット統一
  - [ ] `pnpm type-check` - TypeScript型エラーなし
- [ ] 単体テスト通過
- [ ] デザインレビュー合格
- [ ] パフォーマンス基準達成

### 最終チェック

- [ ] 全機能動作確認
- [ ] クロスブラウザ動作確認
- [ ] モバイル対応確認
- [ ] アクセシビリティ基準達成
- [ ] SEO設定確認

---

## 🔄 切り替え・統合タスク

### 段階的切り替え準備

- [ ] 機能別切り替えタイミングの計画
  - [ ] 静的ページから順次切り替え
  - [ ] 重要機能は最後に切り替え
- [ ] ドメイン・URL切り替え計画
- [ ] データベース・API切り替え計画
- [ ] ユーザーへの告知・移行案内

### 最終統合作業

- [ ] 新システムの本格運用開始
- [ ] 現行システムの段階的停止
- [ ] 旧ファイルの整理・アーカイブ
- [ ] ドキュメント・README更新

## ⏰ 緊急時対応タスク

### @nuxt/ui使用不可時

- [ ] Gitブランチでのロールバック
- [ ] Tailwind CSS + Headless UI構成に即座切り替え
- [ ] 独自コンポーネント実装計画の実行
- [ ] スケジュール調整

### 重大バグ発生時

- [ ] 問題の特定・分析
- [ ] 影響範囲の調査
- [ ] 修正方針の決定・実行
- [ ] 再発防止策の実装

### データ・設定の緊急復旧

- [ ] 退避ディレクトリからの設定復旧
- [ ] 環境変数・設定ファイルの復旧
- [ ] ユーザーデータの整合性確認

---

**最終更新**: 2025年1月  
**総タスク数**: 120+項目  
**推定工数**: 約3.5ヶ月（Phase 0含む15週間）

## 📁 作業ディレクトリ構造

```
firewolf-ui/                 # 作業ディレクトリ (feature/nuxt4ブランチ)
├── .old-nuxt2/             # 退避した旧ファイル群
│   ├── nuxt.config.ts      # 旧Nuxt 2設定
│   ├── package.json        # 旧依存関係
│   └── components/         # 旧コンポーネント（参照用）
├── nuxt.config.ts          # 新Nuxt 4設定
├── package.json            # 新しい依存関係
├── components/             # 新@nuxt/uiコンポーネント
└── ...
```

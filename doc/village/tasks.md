# 村ページ - 実装タスク

このドキュメントは村ページの実装タスクを管理します。

## Phase 1: 基本構造の実装

### 1.1 型定義の確認

- [ ] API型定義の確認
  - `lib/api/types.ts` の確認（自動生成される型定義）
  - Village型、Messages型、SituationAsParticipant型等が利用可能か確認
  - 型定義は自動生成されるため手動での追加は不要

### 1.2 Composablesの実装

- [ ] `composables/village/useVillage.ts` の作成
  - 村情報の取得・管理
  - `GET /api/village/{villageId}` の呼び出し
  - ローディング・エラー状態管理

- [ ] `composables/village/useMessage.ts` の作成
  - 発言の取得・管理
  - `GET /api/village/{villageId}/message` の呼び出し
  - ページング制御
  - 日付変更処理

- [ ] `composables/village/useSituation.ts` の作成
  - 参加状況の取得・管理
  - `GET /api/village/{villageId}/situation` の呼び出し
  - situationベースの権限判定

- [ ] `composables/village/useVillageTimer.ts` の作成
  - 残り時間の計算
  - 1秒間隔のタイマー処理
  - 状態に応じた表示文字列生成

- [ ] `composables/village/useVillageNavigation.ts` の作成
  - スクロール処理（最上部・最下部）
  - 特定要素へのスクロール

- [ ] `composables/village/useVillagePolling.ts` の作成
  - 30秒間隔のポーリング
  - `GET /api/village/{villageId}/latest` の呼び出し
  - 新着発言の検知
  - 日付変更の検知

- [ ] `composables/village/useVillageFilter.ts` の作成
  - 抽出条件の管理
  - 抽出の実行・リセット
  - キャラ抽出

- [ ] `composables/village/useUserSettings.ts` の作成
  - Cookie保存・読み込み
  - 設定の更新
  - ページング設定、発言表示設定、ダークテーマ等

- [ ] `composables/village/useVillageMemo.ts` の作成
  - LocalStorage保存・読み込み
  - テキストメモの保存（最大3つ）
  - メモの削除

### 1.3 Storeの実装

- [ ] `stores/village.ts` の作成
  - State定義（village, messages, situation, isFiltering等）
  - Getters定義
  - Actions定義（村情報・発言・参加状況の保存）

### 1.4 レイアウトとコンポーネントの基本実装

- [ ] `layouts/VillageLayout.vue` の作成
  - サイドバー・ヘッダー・メイン・フッターの配置
  - レスポンシブ対応（PC: サイドバー左固定、Mobile: オーバーレイ）
  - サイドバーの表示切り替え制御

- [ ] `components/village/VillageHeader.vue` の作成
  - 日付切り替えボタン（前日・翌日）
  - 最上部スクロールボタン
  - タイトル表示

- [ ] `components/village/VillageFooter.vue` の作成
  - 更新ボタン
  - 最下部スクロールボタン
  - 抽出ボタン
  - 残り時間表示
  - サイドバー切り替えボタン（Mobile）

- [ ] `components/village/VillageSidebar.vue` の作成
  - 村の設定モーダル起動
  - 参加者リスト表示切り替え
  - メモモーダル起動
  - ユーザ設定モーダル起動
  - トップページリンク

### 1.5 ページの実装

- [ ] `pages/village.vue` の作成
  - URLクエリパラメータ `id` の取得
  - Firebase認証状態の確認（onMounted）
  - 各Composablesの統合
  - VillageLayout の使用

### 1.6 初期表示フローの実装

- [ ] 初期表示フローの実装
  - Firebase認証状態の確認
  - 村情報の取得
  - 最新日・最新ページの発言取得
  - 参加状況の取得
  - キャラチップ情報の取得
  - 残り時間表示タイマーの開始
  - 年齢制限モーダルの表示判定

## Phase 2: 発言機能の実装

### 2.1 発言表示の基本実装

- [ ] `components/village/VillageDayList.vue` の作成
  - 日付選択リスト
  - 発言の先頭と末尾に配置

- [ ] `components/village/message/MessageList.vue` の作成
  - 発言リストの表示
  - ページネーション
  - 最新ボタン

- [ ] `components/village/message/MessageCard.vue` の作成
  - 個別発言の表示
  - アンカーの処理
  - 発言アクションの表示

### 2.2 発言種別対応

- [ ] `components/village/message/MessageSay.vue` の作成
  - 通常発言の表示
  - 発言種別に応じたスタイリング
  - キャラクター情報の表示

- [ ] `components/village/message/MessageSystem.vue` の作成
  - システムメッセージの表示
  - 公開/非公開システムの判定

- [ ] `components/village/message/message-converter.ts` の作成
  - 発言テキストのHTML/CSS変換処理
  - 文字装飾（太字、斜体等）の変換
  - アンカー（`>>{発言番号}`）の変換
  - XSS対策（許可されたタグ・属性のみ使用）

### 2.3 発言関連のUI実装

- [ ] `components/village/message/ParticipantsMessage.vue` の作成
  - 発言内の参加者リスト表示

- [ ] `components/village/message/VillageSituationMessage.vue` の作成
  - 状況メッセージの表示

### 2.4 ページング・日付切り替え

- [ ] ページング機能の実装
  - 1ページあたりの表示件数制御
  - ページ番号での表示切り替え
  - 「最新」での表示切り替え

- [ ] 日付切り替え機能の実装
  - 前日/翌日ボタンでの日付変更
  - 日付リストからの選択

## Phase 3: 抽出機能の実装

### 3.1 抽出モーダル

- [ ] `components/village/footer/ModalFilter.vue` の作成
  - 発言種別の選択
  - 発言者の選択（全てON/OFF/反転）
  - 宛先の選択（全てON/OFF/反転/自分宛）
  - キーワード入力

### 3.2 個別抽出・URLパラメータ対応

- [ ] 個別抽出機能の実装
  - サイドバー参加者リストからの抽出
  - 新規タブ設定の考慮

- [ ] URLパラメータでの抽出対応
  - `?filterId=参加者ID` での直接抽出
  - 初期表示時の抽出適用

## Phase 4: アクション機能の実装

### 4.1 アクションコンテナ

- [ ] `components/village/action/ActionContainer.vue` の作成
  - situationベースの表示制御
  - 各アクションコンポーネントの管理

### 4.2 参加・見学・退村

- [ ] `components/village/action/Participate.vue` の作成
  - キャラクター選択
  - 役職希望選択
  - 入村パスワード入力

- [ ] `components/village/action/Spectate.vue` の作成
  - 見学参加処理

- [ ] `components/village/action/Leave.vue` の作成
  - 退村処理

### 4.3 発言入力

- [ ] `components/village/action/Say.vue` の作成
  - 発言種別選択
  - 発言内容入力
  - 文字装飾ボタン
  - アンカー挿入
  - 表情種別選択

- [ ] `components/village/action/SayConfirm.vue` の作成
  - 発言確認モーダル

- [ ] `components/village/action/ActionSay.vue` の作成
  - アクション発言入力
  - 短い行動メッセージの入力

### 4.4 投票・能力行使

- [ ] `components/village/action/Vote.vue` の作成
  - 投票対象選択
  - 投票処理

- [ ] `components/village/action/Ability.vue` の作成
  - 能力種別に応じた対象選択
  - 能力行使処理

### 4.5 コミット・CO

- [ ] `components/village/action/Commit.vue` の作成
  - コミット処理

- [ ] `components/village/action/Comingout.vue` の作成
  - 役職選択
  - CO処理

### 4.6 役職希望・名前変更

- [ ] `components/village/action/SkillRequest.vue` の作成
  - 第一希望・第二希望選択
  - 役職希望変更処理

- [ ] `components/village/action/ChangeName.vue` の作成
  - キャラ名変更
  - 1文字略称変更

### 4.7 村建て機能

- [ ] `components/village/action/creator/CreatorSay.vue` の作成
  - 村建て発言入力

- [ ] `components/village/action/creator/KickOut.vue` の作成
  - 参加者選択
  - キックアウト処理

- [ ] `components/village/action/creator/ExtendEpilogue.vue` の作成
  - エピローグ延長処理

- [ ] `components/village/action/creator/Cancel.vue` の作成
  - 廃村処理

- [ ] `components/village/action/creator/SettingsLink.vue` の作成
  - 村設定変更画面へのリンク
  - プロローグ中のみ表示

### 4.8 管理者機能

- [ ] `components/village/action/admin/Admin.vue` の作成
  - デバッグ用村情報表示

### 4.9 デバッグ機能（ローカル環境のみ）

- [ ] `components/village/action/debug/Debug.vue` の作成
  - N人参加
  - ダミーログイン
  - 突然死なし設定
  - 日付進行
  - 100回発言

## Phase 5: 補助機能の実装

### 5.1 サイドバー機能

- [ ] `components/village/sidebar/ParticipantList.vue` の作成
  - 生存者・死亡者・見学者のリスト表示
  - CO情報の表示
  - 発言回数の表示
  - 個別抽出リンク

- [ ] `components/village/sidebar/ModalVillageInfo.vue` の作成
  - 村の設定情報表示
  - 参加人数表示（状態による切り替え）
  - 役職編成表示（状態による切り替え）

### 5.2 ユーザ設定

- [ ] `components/village/sidebar/ModalUserSettings.vue` の作成
  - ページング設定
  - 発言表示設定
  - ダークテーマ切り替え

### 5.3 メモ機能

- [ ] `components/village/sidebar/memo/ModalMemo.vue` の作成
  - メモ一覧表示
  - メモ編集UI

- [ ] `components/village/sidebar/memo/TextMemo.vue` の作成
  - テキストメモ入力
  - 文字数カウント

### 5.4 ポーリング・通知

- [ ] トースト通知の実装
  - 日付変更通知
  - 最新発言取得通知
  - エラー通知

### 5.5 年齢制限確認

- [ ] `components/village/ModalAgeLimit.vue` の作成
  - R指定村の確認モーダル
  - Cookie保存での確認済み記録

## Phase 6: 最適化・テスト

### 6.1 パフォーマンス最適化

- [ ] 更新制御の実装
  - 最新ページ表示時のみ自動更新
  - 入力中・抽出中は更新しない

### 6.2 レスポンシブ対応

- [ ] PC表示の確認
  - サイドバー左全面固定の動作確認
  - ヘッダー/メイン/フッターの縦並び確認

- [ ] モバイル表示の確認
  - サイドバーオーバーレイの動作確認
  - ヘッダー・メイン・フッターの縦積み確認

- [ ] Safari対策
  - アドレスバー対応の動的高さ調整
  - セーフエリア対応のフッター余白

### 6.3 テスト

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

### 6.4 品質チェック

- [ ] コードレビュー
  - TypeScript型定義の確認
  - エラーハンドリングの確認
  - XSS対策の確認

- [ ] 既存実装との比較確認
  - 機能の完全性確認
  - UI/UXの一致確認

## 注意事項

- 実装時は必ず `doc/village/requirements.md` と `doc/village/designs.md` を参照
- 型定義は `~/types/api/*.ts` から再利用
- 既存実装（`.old-nuxt2` 配下）の発言整形処理・アンカー処理・フィルタリングロジック・残り時間計算は参考にする
- situationのAPIレスポンスに基づいて権限制御を行う
- 各Phase完了時に動作確認を実施

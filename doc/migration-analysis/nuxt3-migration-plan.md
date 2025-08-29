# FIREWOLF Nuxt4移行設計書

## 1. プロジェクト概要

- **現行システム**: Nuxt 2.15 + TypeScript + Vue 2 (Class Components)
- **目標システム**: Nuxt 4 + TypeScript + Vue 3 (Composition API) + Node 22
- **移行方針**: 技術スタックの更新のみで、機能・UI/UXは現行システムと完全同一を維持
- **採用UI技術**: @nuxt/ui (Tailwind CSS + Headless UI) - 決定済み

## 2. 現行技術スタック

### フレームワーク・言語

- Nuxt.js 2.15 (SPA mode)
- TypeScript (strict mode, noImplicitAny: false)
- Vue Class Components (vue-property-decorator)

### UI・スタイリング

- Buefy (Bulma ベース)
- SASS/SCSS
- Font Awesome

### 状態管理・認証

- Vuex + Vuexfire
- Firebase Authentication

### その他ツール

- axios (API通信)
- dayjs (日付処理)
- vee-validate (バリデーション)
- PWA対応

## 3. 主要機能（現行維持）

### ページ構成（変更なし）

- **トップページ** (`/`)
  - 村一覧表示
  - プレイヤー統計
  - キャラチップ情報
- **村関連**
  - 村一覧 (`/village-list`)
  - 村作成 (`/create-village`)
  - 村画面 (`/village`)
    - メッセージ表示・投稿
    - アクション実行
    - 日付切り替え
    - 参加者一覧

- **情報ページ**
  - ルール (`/rule`)
  - ドキュメント (`/document`)
  - FAQ (`/faq`)
  - リリースノート (`/release-note`)

- **プレイヤー機能**
  - 戦績 (`/player-record`)
  - 設定 (`/setting`)
- **その他**
  - キャラチップ一覧 (`/charachip-list`)
  - キャラチップ詳細 (`/charachip`)
  - スクラップ (`/scrap`)

## 4. Nuxt4移行技術選定

### コアフレームワーク

- **Nuxt 4.0+** (最新版)
- **Vue 3.5+**
- **TypeScript 5.7+** (strict mode)
- **Node.js 22 LTS**

### UIフレームワーク

#### 【決定】@nuxt/ui (Tailwind CSS + Headless UI)

- **選定理由**
  - Tailwind CSSベースで開発効率が高い
  - Nuxt公式UIライブラリで長期サポート期待
  - TypeScript完全対応
  - 豊富なコンポーネント
  - 開発者のTailwind CSS習熟度を活用

- **実装方針**
  - 現行のカスタム色をTailwind設定に移植
  - @nuxt/uiコンポーネントをベースに現行デザインを再現
  - 人狼ゲーム固有の色分けを完全維持

- **期待効果**
  - 開発効率の向上
  - モダンな開発体験
  - バンドルサイズの最適化
  - 長期的なメンテナンス性向上

### 状態管理

- **Pinia** (Vuexの公式後継)
  - TypeScript サポート優秀
  - Composition API との親和性
  - DevTools 対応

### ビルドツール・開発環境

- **Vite** (Nuxt 3標準)
- **pnpm** (推奨パッケージマネージャー)
- **ESLint 9+** + **Prettier 3+**
- **Vitest** (単体テスト)
- **Playwright** (E2Eテスト)

### 主要パッケージの移行マッピング

| 現行パッケージ          | 移行先                         | 備考                          |
| ----------------------- | ------------------------------ | ----------------------------- |
| @nuxtjs/axios           | $fetch / ofetch                | Nuxt 4組み込み                |
| nuxt-property-decorator | Composition API + script setup | 完全書き換え必要              |
| Vuex                    | Pinia                          | ストア構造は維持、APIのみ変更 |
| Vuexfire                | VueFire                        | Firebase統合の最新版          |
| Buefy                   | @nuxt/ui (決定済み)            | Tailwindで見た目再現          |
| vee-validate v3         | vee-validate v4                | API変更あり                   |
| @nuxtjs/pwa             | @vite-pwa/nuxt                 | Vite版PWA                     |
| vue-scrollto            | @vueuse/core                   | より軽量な代替                |
| dayjs                   | dayjs (継続)                   | そのまま利用可能              |
| Firebase v10            | Firebase v10 (継続)            | 変更不要                      |

## 5. ディレクトリ構造の変更

### 現行構造

```
/components/       # コンポーネント
/pages/           # ページコンポーネント
/store/           # Vuex
  /modules/
/middleware/      # ミドルウェア
/plugins/         # プラグイン
/assets/          # SCSS、画像
/static/          # 静的ファイル
```

### Nuxt 4構造

```
/components/      # Auto-import対応
/pages/          # ファイルベースルーティング
/stores/         # Pinia stores
/server/         # サーバーAPI (必要に応じて)
/composables/    # Composition関数
/utils/          # ユーティリティ関数
/middleware/     # ルートミドルウェア
/plugins/        # クライアント/サーバープラグイン
/assets/         # ビルド処理されるアセット
/public/         # 静的ファイル (staticの代替)
```

## 6. 移行戦略

### Phase 1: 環境構築 (1週間)

1. Nuxt 4プロジェクト初期化
   - `nuxi init firewolf-ui-v4`
   - TypeScript設定
   - ESLint/Prettier設定
2. 基本的なディレクトリ構造の作成
3. 開発環境の動作確認

### Phase 2: 基盤移行 (2週間)

1. **認証システム**
   - Firebase SDK統合
   - 認証ミドルウェアの実装
   - ユーザー情報管理

2. **状態管理**
   - Piniaストア設計
   - auth store
   - village store
   - village-settings store

3. **API通信層**
   - API clientの実装 ($fetch wrapper)
   - エラーハンドリング
   - インターセプター

### Phase 3: UIコンポーネント移行 (3-4週間)

1. **@nuxt/ui + Tailwind CSS導入**
   - @nuxt/uiとTailwind CSSのセットアップ
   - 現行カスタム色の移植（人狼ゲーム固有色を含む）
   - @nuxt/uiコンポーネントのカスタマイズ設定

2. **共通コンポーネント（@nuxt/uiベース）**
   - Loading（現行と同一）
   - Modal（現行と同一）
   - Toast/Notification（現行と同一）
   - Form要素（現行と同一）

3. **レイアウト（現行構成維持）**
   - デフォルトレイアウト（現行と同一）
   - 村専用レイアウト（現行と同一）
   - エラーページ（現行と同一）

### Phase 4: 機能移行 (3-4週間)

#### Week 1: 基本ページ

- トップページ
- ルール・ドキュメント
- FAQ・About

#### Week 2: 村一覧・検索

- 村一覧表示
- フィルタリング機能
- ページネーション

#### Week 3: 村作成

- 村作成フォーム
- バリデーション
- プレビュー機能

#### Week 4: 村機能

- メッセージ表示
- アクション実行
- リアルタイム更新

### Phase 5: 最適化・テスト (1-2週間)

1. **パフォーマンス最適化**
   - バンドルサイズ削減
   - 遅延ローディング
   - キャッシュ戦略

2. **PWA設定**
   - Service Worker
   - マニフェスト
   - オフライン対応

3. **テスト実装**
   - 単体テスト (Vitest)
   - E2Eテスト (Playwright)

4. **デプロイ設定**
   - CI/CD パイプライン
   - 環境変数管理
   - ビルド最適化

## 7. 技術的課題と対策

### Class Components → Composition API

- **課題**: 全コンポーネントの書き換えが必要
- **対策**:
  - 段階的な移行
  - composablesを活用した共通ロジックの抽出
  - TypeScript型定義の強化
  - 既存ロジックの完全維持

### Buefy → @nuxt/ui + Tailwind CSS

- **課題**: 現行デザインの@nuxt/uiでの再現
- **対策**:
  - 現行カスタム色をTailwind設定に移植
  - @nuxt/uiコンポーネントを現行デザインに合わせてカスタマイズ
  - 人狼ゲーム固有の発言色・システム色を完全移植

### Vuex → Pinia

- **課題**: ストアAPIの変更
- **対策**:
  - 既存のストア構造を維持
  - Vuex APIをPinia APIに置き換え
  - 機能の完全互換性を保証

## 8. リスク管理

### 高リスク項目

1. **Firebase認証の移行**
   - 既存ユーザーへの影響
   - セッション管理の変更

2. **リアルタイム通信**
   - WebSocket接続の安定性
   - パフォーマンスへの影響

### 中リスク項目

1. **SEOへの影響**
   - SPAからSSR/SSGへの変更検討
   - メタタグ管理

2. **ブラウザ互換性**
   - Vue 3/Nuxt 4の要件確認
   - ポリフィルの検討

## 9. 成功指標

### 機能要件

- **全機能の完全動作**: 現行システムと100%同一
- **UI/UXの完全維持**: デザイン変更なし
- **既存ユーザーへの影響**: ゼロ

### パフォーマンス

- Lighthouse Score: 90以上（現行同等以上）
- 初期表示時間: 3秒以内（現行同等以上）
- バンドルサイズ: 現行同等または改善

### 開発効率

- TypeScript カバレッジ: 100%
- テストカバレッジ: 80%以上
- ビルド時間: 現行比50%短縮

### ユーザー体験

- エラー率: 1%以下（現行同等）
- レスポンス時間: 200ms以内（現行同等）
- PWA機能の完全動作（現行同等）

## 10. スケジュール

### 全体工程: 約2-3ヶ月

| Phase             | 期間    | 開始予定 | 完了予定 |
| ----------------- | ------- | -------- | -------- |
| Phase 1: 環境構築 | 1週間   | Week 1   | Week 1   |
| Phase 2: 基盤移行 | 2週間   | Week 2   | Week 3   |
| Phase 3: UI移行   | 3-4週間 | Week 4   | Week 7   |
| Phase 4: 機能移行 | 3-4週間 | Week 8   | Week 11  |
| Phase 5: 最適化   | 1-2週間 | Week 12  | Week 13  |

## 11. 移行の重要原則

1. **機能の完全性**: 現行の全機能を維持
2. **見た目の一致**: UIデザインの変更なし
3. **動作の互換性**: ユーザー体験の維持
4. **データの継続性**: 既存データの完全移行
5. **段階的移行**: リスクを最小化

## 12. UIフレームワーク選定結果

**採用決定**: @nuxt/ui (Tailwind CSS + Headless UI)

**決定要因**:

- Tailwind CSS習熟済みによる開発効率の向上
- Nuxt公式サポートによる長期安定性
- 豊富なコンポーネントと高いカスタマイズ性
- TypeScript完全対応
- 現行カスタム色の移植が容易

## 13. Tailwind CSS移行時のデザイン再現戦略

### 現行カスタマイズ色の抽出と移植

1. **現行SASSファイルから色定義を抽出**
   - `assets/sass/firewolf.scss`から使用色を特定
   - カスタムテーマ色を完全に移植
2. **Tailwind設定への移植（現行色を使用）**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 現行のカスタム色を完全移植
        primary: '#3991f4',
        'primary-dark': 'rgb(20, 180, 255)',

        // 人狼ゲーム固有の発言色
        'werewolf-say': '#f2cece',
        'werewolf-say-dark': '#f2aeae',
        'sympathize-say': '#cef2ce',
        'sympathize-say-dark': '#aef2ae',
        'lovers-say': '#f2dede',
        'lovers-say-text': '#cc2222',
        'monologue-say': '#ddd',
        'grave-say': '#ceedf2',
        'spectate-say': '#f2f2ce',
        'action-say': '#dfdfc9',
        'secret-say': '#cecef2',

        // システムメッセージ色
        'private-system': '#eee',
        'seer-system': '#efe',
        'psychic-system': '#eef',
        'werewolf-system': '#fee',
        'mason-system': '#fec',
        'lovers-system': '#fef',
        'fox-system': '#ffc',
        'creator-say': '#fef',

        // ダークモード対応色
        'primary-dark-bg': '#404040',
        'werewolf-dark-bg': '#403333',
        'seer-dark-bg': '#334033'
        // ... 他のダークモード色
      }
    }
  }
}
```

### 人狼ゲーム固有の色設計

現行プロジェクトは人狼ゲーム特有の色分けが豊富に実装されています：

- **発言種別の色分け**: 人狼発言、共鳴発言、恋人発言など役職に応じた背景色
- **システムメッセージ色**: 占い師、霊媒師、人狼、共鳴者、恋人、狐などの役職別色
- **ダークモード対応**: 各色のダークバリアント

これらの色はTailwind CSSのカスタムカラーとして定義し、現行と同一の見た目を維持します。

### 移行時の利点

- Bulmaのデフォルト色に依存していないため、Tailwind CSSへの移行が容易
- 既にカスタマイズが完成しているため、デザインシステムの再構築が不要
- 現行の色定義をそのまま移植可能

## 14. 次のステップ

1. **@nuxt/uiのNuxt 4対応状況の確認**
   - 公式ロードマップの確認
   - Nuxt 4 RCでの動作検証
2. **現行コンポーネントの調査**
   - Buefyコンポーネントの使用状況調査
   - 必要な@nuxt/uiコンポーネントのリスト作成
3. **Tailwind設定の準備**
   - 現行カスタム色の完全移植
   - 人狼ゲーム固有色の定義
4. **プロトタイプ作成**
   - @nuxt/ui + 現行色での検証
   - デザイン再現度の確認
5. **移行開始**

## 15. 参考資料

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Nuxt 3 to 4 Migration Guide](https://nuxt.com/docs/getting-started/upgrade)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [VueFire Documentation](https://vuefire.vuejs.org/)
- [@nuxt/ui Documentation](https://ui.nuxt.com/)
- [Oruga UI Documentation](https://oruga.io/)
- [PrimeVue Documentation](https://primevue.org/)

# FIREWOLF Nuxt4移行 技術選定根拠書

## 1. 概要

本資料は、FIREWOLFをNuxt2からNuxt4に移行するにあたっての技術選定の根拠を詳しく説明したものです。

## 2. UIフレームワーク選定

### 最終決定: 独自実装 + Tailwind CSS

プロジェクト固有の要件に最適化するため、Tailwind CSSをベースに独自のUIコンポーネントを実装する方針を採用しました。

#### 決定理由

1. **プロジェクト固有要件への最適化**
   - 人狼ゲーム特有のUI要件に完全対応
   - 不要な依存関係を排除し、軽量な実装を実現
   - コンポーネントの挙動を完全に制御可能

2. **開発効率の最大化**
   - Tailwind CSSに習熟済みのため、開発スピードが向上
   - 必要なコンポーネントのみを実装

3. **長期的な安定性**
   - 外部UIライブラリのバージョン依存がない
   - TypeScript完全対応
   - モダンな技術スタック

4. **現行デザインの完全再現**
   - 現行のカスタム色体系を完全移植可能
   - Tailwind CSSの柔軟性により細かなカスタマイズに対応
   - 人狼ゲーム固有のUI要件を満たせる

#### 独自UIコンポーネント構成

`app/components/ui/` 配下に以下のコンポーネントを実装:

| カテゴリ  | コンポーネント                                                                                                             | 説明               |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| button    | Button                                                                                                                     | ボタン             |
| form      | FormInput, FormTextarea, FormSelect, FormCheckbox, FormSwitch, FormRadioGroup, FormNumberInput, FormMultiSelect, FormGroup | フォーム要素       |
| modal     | Modal                                                                                                                      | モーダルダイアログ |
| icon      | Icon                                                                                                                       | アイコン表示       |
| accordion | Accordion                                                                                                                  | 折りたたみ表示     |
| badge     | Badge                                                                                                                      | バッジ             |
| feedback  | Alert, LoadingSpinner                                                                                                      | 通知・ローディング |

#### CSS/SCSS移行における重要事項

**Tailwind CSS v4移行のポイント:**

- **設定方法変更**: `tailwind.config.js` → `@theme` ディレクティブによるCSS変数定義
- **カスタムカラー**: 従来のネスト構造 (`say.werewolf`) → フラット構造 (`--color-say-werewolf`)
- **使用方法**: クラス名は `bg-say-werewolf` の形式で変更なし

**Bulma/SCSS → Tailwind CSS代用表:**

| 従来（SCSS） | 新（Tailwind CSS）    | 説明                            |
| ------------ | --------------------- | ------------------------------- |
| `.m-t-10`    | `mt-2.5`              | マージントップ10px              |
| `.m-l-15`    | `ml-3.5`              | マージンレフト15px              |
| `.p-r-20`    | `pr-5`                | パディングライト20px            |
| `$primary`   | `--color-primary`変数 | カスタムカラー                  |
| Bulmaカラー  | カスタムCSS変数       | `primary`, `error`, `success`等 |

**移行完了事項:**

- ✅ firewolf.scss削除（Bulma/Buefy依存解消）
- ✅ カスタムカラー変数をCSS変数に移行
- ✅ システムメッセージ色・恋人関連色の移行
- ✅ Village layout変数の移行

5. **技術負債の解消**
   - Vue 2 → Vue 3への移行
   - レガシーなビルドツールからViteへの移行
   - モダンな開発体験の実現

## 3. 状態管理選定

### 決定: Pinia

#### 選定理由

- Vuexの公式後継
- Vue 3 Composition APIとの親和性
- TypeScript完全対応
- 既存のVuexコードからの移行が比較的容易

## 4. バリデーション選定

### 決定: vee-validate v4

#### 選定理由

- 現行のvee-validate v3からの移行
- Vue 3完全対応
- Composition API対応
- TypeScript対応

## 5. その他の技術選定

### CSS処理

- **Tailwind CSS**: UIフレームワークとして採用
- **PostCSS**: Tailwindの処理に使用

### 開発ツール

- **Vite**: Nuxt 4標準のビルドツール
- **ESLint 9+**: 最新のリンティング
- **Prettier 3+**: コードフォーマッティング
- **TypeScript 5.7+**: 型安全性の確保

### テスト

- **Vitest**: 単体テスト（Viteネイティブ）
- **Playwright**: E2Eテスト

### PWA

- **@vite-pwa/nuxt**: Vite対応のPWAモジュール

## 6. 技術選定のリスク評価

### 中リスク要素

#### デザイン再現の完全性

- **リスク**: 現行デザインを100%再現できない可能性
- **対策**:
  - プロトタイプ段階で主要コンポーネントの再現度を検証
  - 独自コンポーネントによる柔軟な調整

#### パフォーマンスへの影響

- **リスク**: 新しい技術スタックでのパフォーマンス劣化
- **対策**: 段階的な移行とベンチマーク測定

## 7. 結論

**独自実装 + Tailwind CSS** を採用することで、以下を実現：

1. **開発効率の向上**: Tailwind CSS習熟度を活用
2. **長期安定性**: 外部UIライブラリへの依存がない
3. **デザイン完全再現**: カスタム色の完全移植と柔軟なカスタマイズ
4. **モダンな開発体験**: TypeScript + Composition API + Vite
5. **軽量な実装**: 必要なコンポーネントのみを実装

独自実装により、プロジェクト固有の要件に最適化された技術選定となっています。

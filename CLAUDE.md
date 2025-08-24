# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Project Status: Nuxt4 Migration in Progress

**このプロジェクトは現在Nuxt 2からNuxt 4への移行作業中です。**

### 📋 移行関連ドキュメント

- **[移行計画書](./doc/nuxt3-migration-plan.md)**: プロジェクト全体の移行戦略・スケジュール
- **[技術選定根拠書](./doc/tech-selection-rationale.md)**: UIフレームワーク等の選定理由
- **[実装計画](./doc/migration-phases.md)**: フェーズ別の詳細タスク
- **[リスク管理書](./doc/risk-management.md)**: リスク要因と対策
- **[環境構築手順](./doc/development-setup.md)**: 新環境のセットアップ方法
- **[タスクリスト](./.claude/tasks.md)**: 実装タスクの詳細チェックリスト

### 🎯 移行方針

- **技術スタック更新**: Nuxt 2 → Nuxt 4, Buefy → @nuxt/ui + Tailwind CSS
- **機能完全維持**: 現行システムと100%同一の機能・UI/UXを維持
- **採用技術**: @nuxt/ui (Tailwind CSS + Headless UI) + Pinia + Firebase

### 開発フロー

1. **features.md の新規要件を確認**
   1. `{project_root}/.claude/features.md` の新規要件を確認
   2. 要件に基づいて必要な設計ドキュメントを doc/ 配下に作成・更新
   3. 要件を具体的なタスクに分解して `{project_root}/.claude/tasks.md` に追加
   4. `{project_root}/.claude/features.md` から内容を削除
2. **bugs.md の新規バグを確認**:
   1. `{project_root}/.claude/bugs.md` のバグ内容を確認
   2. バグを修正タスクに分解して `{project_root}/.claude/tasks.md` に追加
   3. `{project_root}/.claude/features.md` から内容を削除
3. **TASK.md のタスクを確認**:
   1. `{project_root}/.claude/tasks.md` を参照してタスクを確認
   2. **🚨重要**: 一度に実装するのは**taskの1セクション（###で区切られた範囲）まで**
   3. タスクに記載されている作業を実施
   4. 実装したページを playwright で確認し、エラーが発生しないことを確認
      1. エラーが発生する場合、ユーザーに確認
   5. タスクが完了したら、`{project_root}/.claude/tasks.md` のチェックボックスに記録
4. **ドキュメンテーション**:
   1. 必要に応じて doc/ディレクトリに記録
5. **commit 前作業**:
   1. **commit 前に必ず lint・format・type-check を実行** - `pnpm lint && pnpm format && pnpm type-check` を実行
   2. **API型定義が最新であることを確認** - 必要に応じて `pnpm generate:api-types` を実行
6. **ユーザーに確認を依頼**:
   1. commit 前にユーザーに修正内容の確認を依頼する
7. **適切な粒度で commit**:
   1. ユーザーの承認を得られたら、機能追加、バグ修正、リファクタリングなど論理的な単位で commit
   2. **commit message に絵文字を使用しない** - シンプルで読みやすいメッセージにする
8. `{project_root}/.claude/tasks.md` のタスクがなくなるまでこのフローを 1 から繰り返す
   1. 途中で features や bugs に追記されることがある

## Project Overview

FIREWOLFは人狼ゲームが無料で遊べるWebサービスです。現在はNuxt.js 2.x (TypeScript) で構築されたSPAで、Firebaseを認証に使用し、APIサーバー(firewolf-api)と連携して動作します。

## Tech Stack

### 🔄 Current (Legacy)

- **Framework**: Nuxt.js 2.x (SPA mode)
- **Language**: TypeScript
- **UI**: Buefy (Bulma based)
- **CSS**: SASS/SCSS
- **State**: Vuex + Vuexfire
- **Auth**: Firebase
- **Package Manager**: npm

### 🎯 Target (Migration)

- **Framework**: Nuxt 4 + Node.js 22 LTS
- **Language**: TypeScript 5.7+
- **UI**: @nuxt/ui (Tailwind CSS + Headless UI)
- **CSS**: Tailwind CSS
- **State**: Pinia + VueFire
- **Auth**: Firebase (継続)
- **Package Manager**: pnpm (推奨)

## Commands

### Development

```bash
npm ci          # 初回セットアップ
npm run dev     # 開発サーバー起動 (http://localhost:3000)
```

### Build & Production

```bash
npm run build   # プロダクションビルド
npm run start   # プロダクションサーバー起動
npm run generate # 静的サイト生成
```

### Code Quality

```bash
npm run lint    # ESLintでコード検証（必須）
```

## Code Style

- セミコロンなし
- シングルクォート使用
- インデント: スペース2つ
- TypeScript strict mode (noImplicitAny: false)
- Vue Class Components (vue-property-decorator使用)

## 🔥 API型定義の使用ルール（重要）

**🚨 必須事項: OpenAPI自動生成型の正しい活用**

1. **型定義の自動生成**
   - APIサーバーのOpenAPI定義から自動生成される型定義を必ず使用する
   - 生成コマンド: `pnpm generate:api-types`
   - 生成ファイル: `types/api/schema.ts`

2. **型の使用方法**
   - ✅ **推奨**: types/api配下にラッパー型を定義してから使用
   - ❌ **禁止**: components['schemas']['ModelName'] を直接使用

   ```typescript
   // ✅ 正しい使用例
   // types/api/village.ts
   import type { components } from './schema'
   export type VillageView = components['schemas']['VillageView']
   export type VillageRegisterBody =
     components['schemas']['VillageRegisterBody']

   // Vue コンポーネントで使用
   import type { VillageView } from '~/types/api/village'
   ```

3. **API通信の型安全性**
   - API呼び出し時は必ず生成された型を使用
   - リクエストボディ・レスポンスの両方で型チェックを行う
   - $fetch 使用時は適切な型注釈を付ける

4. **型定義の更新管理**
   - APIサーバー側の変更後は即座に `pnpm generate:api-types` を実行
   - ビルド前に自動で最新型定義を取得（prebuildフック）
   - 型エラーが発生した場合は必ずAPI仕様書との整合性を確認

5. **開発フロー統合**
   - 新機能実装前に最新のAPI型定義を生成
   - Pinia store実装時は生成された型を活用
   - 型安全性を損なうany型の使用は禁止

## Architecture

```
/components/       # 再利用可能なVueコンポーネント
  common/         # 共通コンポーネント
  village/        # 村関連コンポーネント
  create-village/ # 村作成関連
/pages/           # ルーティング用ページコンポーネント
/store/           # Vuexストア (旧) → /stores/ (新Pinia)
  modules/        # ストアモジュール
/middleware/      # 認証、バージョン管理など
/plugins/         # axios、バリデーションなど
/assets/          # SCSS、CSS、画像
/static/          # 静的ファイル
/types/           # 型定義ファイル
  api/            # API関連型定義
    schema.ts     # OpenAPI自動生成型定義（直接編集禁止）
    village.ts    # 村関連型のラッパー
    player.ts     # プレイヤー関連型のラッパー
    chara.ts      # キャラクター関連型のラッパー
    index.ts      # 型定義のre-export
```

### API型定義ファイルの構成例

```typescript
// types/api/village.ts - 村関連型のラッパー
import type { components, operations } from './schema'

// レスポンス型
export type VillageView = components['schemas']['VillageView']
export type VillagesView = components['schemas']['VillagesView']
export type VillageStatus = components['schemas']['VillageStatus']

// リクエスト型
export type VillageRegisterBody = components['schemas']['VillageRegisterBody']
export type VillageParticipateBody =
  components['schemas']['VillageParticipateBody']

// オペレーション型
export type RegisterVillageOperation = operations['registerVillage']
export type VillageListOperation = operations['villageList']

// types/api/index.ts - 統合エクスポート
export * from './village'
export * from './player'
export * from './chara'
```

## Development Notes

- APIサーバー(firewolf-api)を事前に起動する必要があります
- 環境変数は.envファイルで管理
- Firebase設定が必要（FIREBASE_API_KEY等）
- PWA対応済み

## Migration Progress Tracking

移行作業の進捗は以下で管理:

1. **[.claude/tasks.md](./.claude/tasks.md)** - 詳細タスクの進捗確認
2. **[doc/migration-phases.md](./doc/migration-phases.md)** - フェーズ別進捗状況
3. **週次進捗レビュー** - 各Phase完了時の検証

## Task Completion

### 🔄 Legacy System (移行完了まで)

新しいコードを追加・修正した際は以下を実行:

1. `npm run lint` - エラーがないことを確認
2. `npm run dev` - 開発サーバーで動作確認
3. ブラウザコンソールにエラーがないことを確認

### 🎯 New System (移行後)

新しいコードを追加・修正した際は以下を実行:

1. `pnpm lint` - ESLint・TypeScriptエラーなし確認
2. `pnpm dev` - Nuxt 4開発サーバーで動作確認
3. `pnpm type-check` - TypeScript型エラーなし確認
4. ブラウザコンソールにエラーがないことを確認

## Important Notes for Migration

- 📋 **必須**: 新機能開発前に移行計画書を確認
- ⚠️ **注意**: 現行システムと新システムで機能・デザイン100%同一を維持
- 🔍 **参照**: デザイン確認が必要な場合は本番環境スクリーンショット使用
- 📝 **記録**: 移行中の技術課題・解決策は適宜ドキュメント化

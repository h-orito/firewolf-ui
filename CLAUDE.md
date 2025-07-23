# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

FIREWOLF UI は、人狼ゲームが無料で遊べる Web サービスのフロントエンドプロジェクトです。

## v1 プロジェクト（既存）

v1 は Nuxt.js 2.x + TypeScript + Vue.js 2.x で構築されています。

詳細なドキュメントは以下を参照してください：

- 📚 **[v1 ドキュメント](./doc/v1/README.md)** - v1 プロジェクトの総合ドキュメント
  - [開発環境セットアップ](./doc/v1/setup.md)
  - [アーキテクチャ](./doc/v1/architecture.md)
  - [技術スタック](./doc/v1/tech-stack.md)
  - [開発ガイド](./doc/v1/development-guide.md)
  - [API 通信](./doc/v1/api-communication.md)
  - [状態管理](./doc/v1/state-management.md)

## v2 プロジェクト（新規作成予定）

v2 は既存の v1 プロジェクトを刷新して作成する予定です。

### v2 プロジェクトのドキュメント構成

v2 プロジェクトの開発にあたり、以下のドキュメントで管理します：

#### 計画・設計フェーズ

- **`.claude/features.md`** - 新機能要望の管理
  - ユーザーからの新機能要望を記載
  - 要望は requirements, designs, tasks に反映後、対応済みとして管理
- **`.claude/requirements.md`** - v2 プロジェクトの要件定義
  - 機能要件、非機能要件、制約事項などを記載
- **`.claude/designs.md`** - v2 プロジェクトの設計書
  - アーキテクチャ設計、技術選定、実装方針などを記載
- **`.claude/tasks.md`** - v2 プロジェクトのタスク管理
  - 実装タスクの一覧、優先順位、進捗状況などを記載

#### 実装フェーズ

v2 の実装を進める際は、**`doc/v2/`** ディレクトリに以下のドキュメントを作成・更新してください：

- **`doc/v2/README.md`** - v2 プロジェクトの概要
- **`doc/v2/setup.md`** - 開発環境のセットアップ手順
- **`doc/v2/architecture.md`** - 実装されたアーキテクチャの詳細
- **`doc/v2/api-integration.md`** - API 統合の実装詳細
- **`doc/v2/components.md`** - コンポーネント設計と実装ガイド
- **`doc/v2/state-management.md`** - 状態管理の実装詳細
- **`doc/v2/testing.md`** - テスト戦略と実装
- **`doc/v2/deployment.md`** - デプロイメント手順
- **`doc/v2/migration-guide.md`** - v1 からの移行ガイド

これらのドキュメントを参照・更新しながら v2 の開発を進めてください。

### v2 開発ルール

v2 の実装を進める際は、以下のルールに従ってください：

1. **タスクの特定と実装**

   - **最優先**: `.claude/bugs.md` で不具合報告があるかを確認
   - 不具合がある場合は `bugs.md` のタスクを最優先で処理
   - 不具合がない場合は以下の手順で進行：
     1. `.claude/features.md` で新機能要望があるかを確認
     2. 新機能要望がある場合は、その内容を `.claude/requirements.md`、`.claude/designs.md`、`.claude/tasks.md` に反映し、features.md からその内容を削除
     3. `.claude/tasks.md` を参照して実装するタスクを特定
   - タスクの優先順位と依存関係を確認
   - 選択したタスクのステータスを「実装中」に更新

2. **コーディング規約**

   - 実装前に `.claude/designs.md` で設計方針を確認
   - TypeScript の型定義を必ず記述
   - コンポーネントは関数コンポーネントで実装
   - カスタムフックでロジックを分離

3. **タスク完了時の処理**

   - 各タスク完了時は以下の順序で処理：
     1. 品質チェック（lint, format, type-check）を実行
     2. エラーや警告をすべて解消
     3. `.claude/tasks.md` のタスクステータスを「完了」に更新
     4. 変更内容をコミット
     5. 次のタスクへ進行

4. **品質管理**

   - 実装後は必ず以下のコマンドを実行：

     ```bash
     # Lintの実行
     pnpm lint

     # コードフォーマット
     pnpm format

     # 型チェック
     pnpm type-check
     ```

   - エラーや警告はすべて解消してからコミット

5. **コミット規約**

   - 適切な単位（機能単位、ファイル単位）でコミット
   - コミットメッセージは日本語で記述
   - **絵文字は使用しない**
   - プレフィックスを使用：
     - `feat:` 新機能
     - `fix:` バグ修正
     - `refactor:` リファクタリング
     - `docs:` ドキュメント更新
     - `style:` コードスタイルの変更
     - `test:` テストの追加・修正
     - `chore:` ビルドプロセスやツールの変更
   - 例: `feat: ログイン機能を実装`

6. **ドキュメント更新**

   - 実装完了後は `doc/v2/` 配下の関連ドキュメントを更新
   - 必要に応じて設計書やアーキテクチャドキュメントを更新

7. **テスト**

   - ユニットテストを必ず作成
   - 重要な機能は統合テストも追加
   - `pnpm test` でテストが通ることを確認

8. **バグ修正処理**
   - `.claude/bugs.md` で報告された不具合の対応完了時は以下の順序で処理：
     1. 品質チェック（lint, format, type-check）を実行
     2. エラーや警告をすべて解消
     3. ユーザーに動作確認を依頼
     4. 確認完了後、`.claude/bugs.md` から対応済み項目を削除
     5. 変更内容をコミット

## ブランチ戦略

- メインブランチ: `master`
- 開発ブランチ: `master` から作成
- 機能ブランチ: `feature/{変更内容}`

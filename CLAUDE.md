# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FIREWOLFは人狼ゲームが無料で遊べるWebサービスです。Nuxt.js (TypeScript) で構築されたSPAで、Firebaseを認証に使用し、APIサーバー(firewolf-api)と連携して動作します。

## 🚀 Project Status: Nuxt4 Migration in Progress

**このプロジェクトは現在Nuxt 2からNuxt 4への移行作業中です。**

### 📋 関連ドキュメント

- **[タスクリスト](./.claude/tasks.md)**: 実装タスクの詳細チェックリスト
- **[開発環境セットアップ](./doc/development-setup.md)**: 環境構築手順とコマンド
- **[ドキュメント構成](./doc/README.md)**: プロジェクトドキュメントの全体構成

### 🎯 移行方針

- **技術スタック**: Nuxt 2 → Nuxt 4, Buefy → Tailwind CSS + 独自実装
- **機能完全維持**: 現行システムと100%同一の機能・UI/UXを維持
- **採用技術**: Tailwind CSS + Pinia + Firebase

## 開発フロー

1. **実装**:
   1. 指定されたタスクを `implementer` で実施
   2. 実装できたら、サブエージェント `reviewer` でレビューし、指摘事項がある場合、再度 `implementer` に修正させる
   3. タスクが完了したら、ユーザーに確認を依頼

2. **品質チェック**:
   1. `doc/guidelines` の開発ガイドラインに沿っているか確認
   2. **commit 前に必ず実行**: `pnpm lint && pnpm format && pnpm type-check`

3. **コミット**:
   1. ユーザーの承認を得てから、適切な粒度でコミット
      1. **commit message に絵文字を使用しない**

## 開発ガイドライン

### コードスタイル

詳細は[コードスタイルガイドライン](./doc/guidelines/code-style-guidelines.md)を参照

### API型定義

詳細は[API型定義ガイドライン](./doc/guidelines/api-types-guidelines.md)を参照

### コンポーネント配置

詳細は[コンポーネント配置ガイドライン](./doc/guidelines/component-guidelines.md)を参照

### 実装方針

詳細は[実装ガイドライン](./doc/guidelines/implementation-guidelines.md)を参照

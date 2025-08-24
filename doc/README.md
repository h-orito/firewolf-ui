# FIREWOLF Nuxt4移行 ドキュメント一覧

## 概要

FIREWOLF（人狼ゲームサービス）をNuxt 2からNuxt 4に移行するプロジェクトの設計書類一覧です。

## ドキュメント構成

### 📋 主要設計書

#### 1. [移行設計書](./nuxt3-migration-plan.md)
- **目的**: プロジェクト全体の移行計画・戦略
- **内容**: 現行分析、技術選定、移行戦略、スケジュール
- **対象**: プロジェクトマネージャー、開発チーム全体

#### 2. [技術選定根拠書](./tech-selection-rationale.md) 
- **目的**: UIフレームワーク等の技術選定の根拠説明
- **内容**: 候補技術比較、評価基準、決定理由、リスク評価
- **対象**: 技術責任者、アーキテクト

### 📅 実装計画書

#### 3. [フェーズ別実装計画](./migration-phases.md)
- **目的**: 5フェーズに分けた詳細実装計画
- **内容**: Phase 1-5の作業項目、成果物、成功基準
- **対象**: 開発者、プロジェクトマネージャー

### ⚠️ リスク管理書

#### 4. [リスク管理・対策書](./risk-management.md)
- **目的**: プロジェクトリスクの特定と対策
- **内容**: リスク分類、対策、緊急時対応、監視体制
- **対象**: プロジェクトマネージャー、品質管理者

### 🛠️ 環境構築書

#### 5. [開発環境構築手順書](./development-setup.md)
- **目的**: 開発環境の構築手順
- **内容**: Node.js、@nuxt/ui、Tailwind CSS、Firebase等の設定
- **対象**: 開発者、新規参画者

## プロジェクト概要

### 現行システム
- **フレームワーク**: Nuxt 2.15 + TypeScript
- **UIライブラリ**: Buefy (Bulmaベース)
- **状態管理**: Vuex + Vuexfire
- **認証**: Firebase Authentication

### 目標システム
- **フレームワーク**: Nuxt 4 + TypeScript + Node.js 22
- **UIライブラリ**: @nuxt/ui (Tailwind CSS + Headless UI)
- **状態管理**: Pinia + VueFire
- **認証**: Firebase Authentication (継続)

### 移行方針
技術スタックの更新のみで、**機能・UI/UXは現行システムと完全同一を維持**

## 技術決定事項

### 確定済み技術選定
- ✅ **UIフレームワーク**: @nuxt/ui (Tailwind CSS + Headless UI)
- ✅ **状態管理**: Pinia
- ✅ **バリデーション**: vee-validate v4
- ✅ **テスト**: Vitest + Playwright
- ✅ **パッケージマネージャー**: pnpm

### 検証待ち項目
- ⏳ @nuxt/uiのNuxt 4対応状況確認

## プロジェクトスケジュール

| Phase | 期間 | 主要作業 | 成果物 |
|-------|------|----------|---------|
| **Phase 1** | Week 1 | 環境構築 | 開発環境 |
| **Phase 2** | Week 2-3 | 基盤移行 | 認証・API・状態管理 |
| **Phase 3** | Week 4-7 | UI移行 | コンポーネント群 |
| **Phase 4** | Week 8-11 | 機能移行 | 全機能実装 |
| **Phase 5** | Week 12-13 | 最適化 | 本番リリース |

**総期間**: 約3ヶ月

## 成功指標

### 機能要件
- ✅ 全機能の完全動作（現行システムと100%同一）
- ✅ UI/UXの完全維持（デザイン変更なし）
- ✅ 既存ユーザーへの影響ゼロ

### 品質基準
- 🎯 Lighthouse Score: 90以上
- 🎯 テストカバレッジ: 80%以上
- 🎯 TypeScript カバレッジ: 100%

## 次のステップ

1. **@nuxt/uiのNuxt 4対応確認** (最優先)
2. 現行コンポーネント使用状況調査
3. 開発環境構築（development-setup.md参照）
4. Phase 1開始

## ドキュメント管理

### 更新履歴
- 2024-12-XX: 初版作成
- 技術選定確定: @nuxt/ui採用決定

### 関連資料
- [現行プロジェクト CLAUDE.md](../CLAUDE.md)
- [現行 package.json](../package.json)
- [現行 nuxt.config.ts](../nuxt.config.ts)

---

**作成者**: Claude Code  
**最終更新**: 2024年12月  
**プロジェクト**: FIREWOLF Nuxt4移行
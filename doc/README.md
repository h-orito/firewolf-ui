# FIREWOLF ドキュメント構成

## 概要

FIREWOLF（人狼ゲームサービス）のNuxt 4移行プロジェクトに関するドキュメント群です。

## ディレクトリ構成

```
doc/
├── README.md                # このファイル（ドキュメント全体の構成説明）
├── development-setup.md     # 開発環境セットアップ手順
│
├── implementation-plans/    # ページ別実装計画
│   └── create-village-implementation-plan.md  # 村作成機能実装計画
│
├── migration-analysis/      # 移行分析・初期計画
│   ├── api-communication-analysis.md    # API通信パターン分析
│   ├── buefy-components-analysis.md     # Buefyコンポーネント分析
│   ├── vuex-store-analysis.md          # Vuex Store構造分析
│   ├── nuxt3-migration-plan.md         # Nuxt移行計画書
│   ├── nuxt4-compatibility-verification.md  # Nuxt4互換性検証
│   └── tech-selection-rationale.md     # 技術選定根拠書
│
└── guidelines/              # 開発ガイドライン・実装方針
    ├── api-usage-guidelines.md          # API使用ガイドライン
    ├── ui-guidelines.md                 # UI実装ガイドライン
    ├── implementation-guidelines.md     # 全般的な実装ガイドライン
    ├── code-style-guidelines.md        # コードスタイルガイドライン
    ├── api-types-guidelines.md         # API型定義ガイドライン
    └── component-guidelines.md          # コンポーネント配置ガイドライン
```

## ドキュメントの役割

### 1. ルートレベル

**開発の即座に必要な情報**

- `development-setup.md`: 新規開発者がすぐに環境構築できる手順

### 2. implementation-plans/

**ページ・機能別の詳細実装計画**

- 各ページの実装仕様
- コンポーネント設計
- API連携仕様
- 実装時の注意事項

### 3. migration-analysis/

**移行プロジェクトの分析・計画段階の資料**

- 現行システムの分析結果
- 移行戦略・計画
- 技術検証結果
- 主に参照用として保管

### 4. guidelines/

**日常的な開発で参照するガイドライン**

- コーディング規約
- 実装パターン
- ベストプラクティス
- 開発者が頻繁に参照する実装指針

## プロジェクト概要

### 現行システム（Nuxt 2）

- **Framework**: Nuxt.js 2.x (SPA mode)
- **UI**: Buefy (Bulma based)
- **State**: Vuex + Vuexfire
- **Auth**: Firebase

### 目標システム（Nuxt 4）

- **Framework**: Nuxt 4 + Node.js 22 LTS
- **UI**: @nuxt/ui (Tailwind CSS + Headless UI)
- **State**: Pinia + VueFire
- **Auth**: Firebase (継続)

### 移行方針

- 技術スタックの更新のみ
- **機能・UI/UXは現行システムと100%同一を維持**

## 開発者向けクイックリンク

### 🚀 開発を始める

1. [開発環境セットアップ](./development-setup.md)
2. [タスクリスト](../.claude/tasks.md)

### 📖 実装時に参照

- [コンポーネント配置ルール](./guidelines/component-guidelines.md)
- [API型定義の使い方](./guidelines/api-types-guidelines.md)
- [UI実装ガイド](./guidelines/ui-guidelines.md)

### 🔍 詳細を調べる

- [移行計画全体](./migration-analysis/nuxt3-migration-plan.md)
- [技術選定理由](./migration-analysis/tech-selection-rationale.md)

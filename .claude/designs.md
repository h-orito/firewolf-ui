# v2 プロジェクト設計書

## 概要

FIREWOLF UI v2 プロジェクトの設計書です。v1 から刷新したアーキテクチャと技術選定、実装方針を記載します。

## アーキテクチャ設計

### 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **UI**: React 19
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **フォーム**: React Hook Form + Zod
- **API 通信**: TanStack Query (React Query) + Axios
- **認証**: Firebase Auth
- **テスト**: Jest + React Testing Library + Playwright
- **パッケージマネージャー**: pnpm

### ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証が必要なページ
│   ├── (public)/          # 公開ページ
│   └── api/               # API Routes
├── components/            # コンポーネント
│   ├── ui/               # 汎用UIコンポーネント
│   ├── pages/            # ページ固有コンポーネント
│   └── layout/           # レイアウトコンポーネント
├── hooks/                # カスタムフック
├── lib/                  # ユーティリティライブラリ
├── stores/               # 状態管理
├── types/                # 型定義
└── utils/                # ユーティリティ関数
```

## UI/UX 設計

#### UI コンポーネント設計

**トグルスイッチによる ON/OFF 設定**

- 各設定項目にはトグルスイッチを使用
- ON 状態と OFF 状態が視覚的に分かりやすいデザイン
- 設定項目のラベルとヘルプテキストを併記
- 既存の`ToggleSlider`コンポーネントを活用

#### UI コンポーネント設計

### バリデーション機能の実装方針

**Zod スキーマ定義**

```typescript
const messageRestrictSettingSchema = z.object({
  maxCount: z
    .number()
    .min(0, "回数は0以上で入力してください")
    .max(999, "回数は999以下で入力してください"),
  maxLength: z
    .number()
    .min(1, "文字数は1以上で入力してください")
    .max(10000, "文字数は10000以下で入力してください"),
});

const messageRestrictSettingsSchema = z.object({
  normalSay: messageRestrictSettingSchema,
  werewolfSay: messageRestrictSettingSchema,
  monologueSay: messageRestrictSettingSchema,
  spectateSay: messageRestrictSettingSchema,
  graveSay: messageRestrictSettingSchema,
  secretSay: messageRestrictSettingSchema,
  creatorSay: messageRestrictSettingSchema,
});

const ruleSettingsSchema = z.object({
  isOpenVote: z.boolean(),
  isAvailableSpectate: z.boolean(),
  isAvailableSuddenlyDeath: z.boolean(),
  isAvailableCommit: z.boolean(),
  isAvailableGuardSameTarget: z.boolean(),
});
```

**リアルタイムバリデーション**

- 入力値変更時に即座にバリデーション実行
- エラーメッセージをフィールド下部に表示
- フォーム送信時の最終バリデーション

**エラーハンドリング**

- バリデーションエラーの適切な表示
- フィールドごとのエラー状態管理
- アクセシビリティを考慮したエラー表示

### 数値入力コンポーネント

**NumberInput コンポーネント**

```typescript
interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  error?: string;
  placeholder?: string;
}
```

**特徴**

- 数値のみ入力可能
- 最小値・最大値の制限
- 単位表示（回/日、文字/回）
- エラー状態の表示

## 実装優先順位

1. **Phase 1**: 基本的なトグルスイッチ設定

   - RuleSettingsSection の拡張
   - トグルスイッチ UI 実装
   - 基本的なフォーム状態管理

2. **Phase 2**: 発言制限設定 UI

   - MessageRestrictSettingsSection の実装
   - 数値入力コンポーネントの作成
   - レイアウトとスタイリング

3. **Phase 3**: バリデーション機能

   - Zod スキーマの実装
   - リアルタイムバリデーション
   - エラーハンドリング

4. **Phase 4**: 統合とテスト
   - コンポーネント統合
   - ユニットテスト作成
   - E2E テスト作成

## ダミーキャラクター選択モーダルのページング機能

### 概要
表示キャラクター数が多い場合の画像表示負荷を軽減するため、クライアントサイドページングを実装する。

### 技術方針

**コンポーネント設計**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

interface DummyCharacterModalProps {
  isOpen: boolean;
  characters: Character[];
  onSelect: (character: Character) => void;
  onClose: () => void;
}
```

**ページング仕様**
- 1ページあたり表示数: 20キャラクター
- ページネーション UI: 前/次ボタンとページ番号表示
- 遅延ローディング: 画像の lazy loading 実装
- 検索機能: キャラクター名での絞り込み対応

**パフォーマンス最適化**
- `React.memo` による不要な再レンダリング防止
- 画像の `loading="lazy"` 属性使用
- 仮想化スクロール（大量データの場合）

### 実装手順

1. **ページング機能の基盤実装**
   - usePagination カスタムフック作成
   - Pagination コンポーネント実装

2. **モーダル内ページング統合**
   - DummyCharacterModal の拡張
   - キャラクターリストの分割表示

3. **パフォーマンス最適化**
   - 画像の遅延読み込み実装
   - レンダリング最適化

## 発言制限設定機能の設計

### 概要
村作成画面のルール設定セクションの次に、発言制限設定セクションを追加する。各発言種別ごとに1日の発言回数と1回の発言ごとの最大文字数を設定可能にする。

### UI設計

**レイアウト構成**
```
発言制限設定
├── 説明文
│   ├── 回数は 0〜1000（通常発言は 1〜1000）で設定できます。
│   └── 文字数は 1〜1000 で設定できます。
└── 発言種別ごとの設定
    ├── 通常発言
    ├── 人狼の囁き
    ├── 共鳴発言
    ├── 死者の呻き
    ├── 独り言
    └── 見学発言
```

**各発言種別の設定項目**
- 発言種別名
- 回数設定（数値入力フィールド）
- 文字数設定（数値入力フィールド）

**デフォルト値**
```typescript
const defaultMessageRestrictSettings = {
  normalSay: { maxCount: 20, maxLength: 200 },
  werewolfSay: { maxCount: 40, maxLength: 200 },
  sympathizeSay: { maxCount: 40, maxLength: 200 },
  graveSay: { maxCount: 40, maxLength: 200 },
  monologueSay: { maxCount: 100, maxLength: 200 },
  spectateSay: { maxCount: 40, maxLength: 200 }
};
```

### バリデーション設計

**入力値制限**
- 通常発言の回数: 1〜1000
- その他発言の回数: 0〜1000
- 文字数: 1〜1000（全発言種別共通）

**バリデーションメッセージ**
- 回数が範囲外の場合: 「回数は{min}〜{max}で入力してください」
- 文字数が範囲外の場合: 「文字数は1〜1000で入力してください」

### コンポーネント設計

**MessageRestrictSettingsSection**
```typescript
interface MessageRestrictSettingsProps {
  settings: MessageRestrictSettings;
  onChange: (settings: MessageRestrictSettings) => void;
}
```

**MessageRestrictSettingItem**
```typescript
interface MessageRestrictSettingItemProps {
  label: string;
  setting: MessageRestrictSetting;
  onChange: (setting: MessageRestrictSetting) => void;
  minCount?: number; // 通常発言のみ1、その他は0
}
```

### 実装方針

1. **段階的実装**: UI作成 → バリデーション追加 → 統合テスト
2. **再利用性**: NumberInputコンポーネントを活用
3. **アクセシビリティ**: ラベル、エラーメッセージの適切な関連付け
4. **レスポンシブ**: モバイル表示での適切なレイアウト

## 注意事項

- 既存のデザインシステムとの一貫性を保つ
- アクセシビリティガイドラインに準拠
- モバイル対応を考慮したレスポンシブデザイン
- パフォーマンスを考慮した実装（不要な再レンダリングの回避）

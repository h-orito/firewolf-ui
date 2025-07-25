# v2プロジェクト設計書

## 概要

FIREWOLF UI v2プロジェクトの設計書です。v1から刷新したアーキテクチャと技術選定、実装方針を記載します。

## アーキテクチャ設計

### 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **UI**: React 18
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **フォーム**: React Hook Form + Zod
- **API通信**: TanStack Query (React Query) + Axios
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

## UI/UX設計

### ルール設定セクションのUI/UX設計

#### 基本設定項目

ルール設定セクションでは以下の5つの基本設定項目を提供します：

1. **記名投票**: 投票者が誰に投票したかを公開するかの設定
2. **見学可能**: 村への見学参加を許可するかの設定
3. **突然死あり**: プレイヤーの突然死（離脱）を許可するかの設定
4. **時短希望可能**: 時短希望の投票を許可するかの設定
5. **連続護衛可能**: 同じ対象を連続して護衛できるかの設定

#### UIコンポーネント設計

**トグルスイッチによるON/OFF設定**
- 各設定項目にはトグルスイッチを使用
- ON状態とOFF状態が視覚的に分かりやすいデザイン
- 設定項目のラベルとヘルプテキストを併記
- 既存の`ToggleSlider`コンポーネントを活用

**初期値の設定と表示方法**
```typescript
interface RuleSettings {
  isOpenVote: boolean;           // 記名投票（初期値: false）
  isAvailableSpectate: boolean;  // 見学可能（初期値: true）
  isAvailableSuddenlyDeath: boolean; // 突然死あり（初期値: true）
  isAvailableCommit: boolean;    // 時短希望可能（初期値: true）
  isAvailableGuardSameTarget: boolean; // 連続護衛可能（初期値: false）
}
```

#### レイアウト設計

```
[ルール設定]
┌─────────────────────────────────────┐
│ □ 記名投票                           │
│   投票者が公開されます              │
│                                     │
│ ■ 見学可能                           │
│   見学者の参加を許可します          │
│                                     │
│ ■ 突然死あり                         │
│   プレイヤーの離脱を許可します      │
│                                     │
│ ■ 時短希望可能                       │
│   時短希望の投票ができます          │
│                                     │
│ □ 連続護衛可能                       │
│   同じ対象を連続護衛できます        │
└─────────────────────────────────────┘
```

### 発言制限設定の設計

#### 発言種別と制限項目

7つの発言種別それぞれに対して回数制限と文字数制限を設定できます：

1. **通常発言**: 昼間の通常発言
2. **囁き**: 人狼間の秘密会話
3. **独り言**: 個人のメモ的発言
4. **見学者発言**: 見学者の発言
5. **死者発言**: 死亡後の発言
6. **秘話**: 特定の相手との秘密会話
7. **村建て発言**: 村建て人の管理発言

#### 制限設定の種類

**回数制限**
- 1日あたりの発言回数上限
- 範囲: 0〜999回
- 0の場合は発言禁止を意味

**文字数制限**
- 1回の発言あたりの文字数上限
- 範囲: 1〜10000文字
- デフォルト値: 200文字

#### UIコンポーネント設計

**数値入力コンポーネント**
```typescript
interface MessageRestrictSetting {
  messageType: string;      // 発言種別
  maxCount: number;         // 最大回数（0-999）
  maxLength: number;        // 最大文字数（1-10000）
}

interface MessageRestrictSettings {
  normalSay: MessageRestrictSetting;    // 通常発言
  werewolfSay: MessageRestrictSetting;  // 囁き
  monologueSay: MessageRestrictSetting; // 独り言
  spectateSay: MessageRestrictSetting;  // 見学者発言
  graveSay: MessageRestrictSetting;     // 死者発言
  secretSay: MessageRestrictSetting;    // 秘話
  creatorSay: MessageRestrictSetting;   // 村建て発言
}
```

**バリデーション機能**
- 回数: 0〜999の範囲チェック
- 文字数: 1〜10000の範囲チェック
- リアルタイムバリデーション
- エラーメッセージの表示

#### レイアウト設計

```
[発言制限設定]
┌─────────────────────────────────────┐
│ 通常発言                            │
│ 回数: [___20___] 回/日               │
│ 文字数: [___200___] 文字/回          │
│                                     │
│ 囁き                                │
│ 回数: [___20___] 回/日               │
│ 文字数: [___200___] 文字/回          │
│                                     │
│ 独り言                              │
│ 回数: [___20___] 回/日               │
│ 文字数: [___200___] 文字/回          │
│                                     │
│ 見学者発言                          │
│ 回数: [___20___] 回/日               │
│ 文字数: [___200___] 文字/回          │
│                                     │
│ 死者発言                            │
│ 回数: [___5___] 回/日                │
│ 文字数: [___200___] 文字/回          │
│                                     │
│ 秘話                                │
│ 回数: [___20___] 回/日               │
│ 文字数: [___200___] 文字/回          │
│                                     │
│ 村建て発言                          │
│ 回数: [___20___] 回/日               │
│ 文字数: [___200___] 文字/回          │
└─────────────────────────────────────┘
```

## コンポーネント設計

### RuleSettingsSection コンポーネントの拡張

**既存機能**
- 基本的なルール設定のUI表示
- フォーム状態管理

**拡張機能**
```typescript
interface RuleSettingsSectionProps {
  ruleSettings: RuleSettings;
  onRuleSettingsChange: (settings: RuleSettings) => void;
  messageRestrictSettings: MessageRestrictSettings;
  onMessageRestrictSettingsChange: (settings: MessageRestrictSettings) => void;
}
```

**実装方針**
- 既存のRuleSettingsSectionを拡張
- トグルスイッチ設定セクションを追加
- フォーム状態はReact Hook Formで管理
- バリデーションはZodスキーマで実装

### MessageRestrictSettingsSection コンポーネントの新規作成

**責務**
- 発言制限設定のUI表示
- 数値入力フォームの管理
- バリデーション処理
- エラー表示

**Props定義**
```typescript
interface MessageRestrictSettingsSectionProps {
  settings: MessageRestrictSettings;
  onChange: (settings: MessageRestrictSettings) => void;
  errors?: Record<string, string>;
}
```

**内部コンポーネント**
```typescript
// 個別の発言制限設定
interface MessageRestrictItemProps {
  label: string;
  setting: MessageRestrictSetting;
  onChange: (setting: MessageRestrictSetting) => void;
  errors?: {
    maxCount?: string;
    maxLength?: string;
  };
}
```

### バリデーション機能の実装方針

**Zodスキーマ定義**
```typescript
const messageRestrictSettingSchema = z.object({
  maxCount: z.number()
    .min(0, "回数は0以上で入力してください")
    .max(999, "回数は999以下で入力してください"),
  maxLength: z.number()
    .min(1, "文字数は1以上で入力してください")
    .max(10000, "文字数は10000以下で入力してください")
});

const messageRestrictSettingsSchema = z.object({
  normalSay: messageRestrictSettingSchema,
  werewolfSay: messageRestrictSettingSchema,
  monologueSay: messageRestrictSettingSchema,
  spectateSay: messageRestrictSettingSchema,
  graveSay: messageRestrictSettingSchema,
  secretSay: messageRestrictSettingSchema,
  creatorSay: messageRestrictSettingSchema
});

const ruleSettingsSchema = z.object({
  isOpenVote: z.boolean(),
  isAvailableSpectate: z.boolean(),
  isAvailableSuddenlyDeath: z.boolean(),
  isAvailableCommit: z.boolean(),
  isAvailableGuardSameTarget: z.boolean()
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
   - RuleSettingsSectionの拡張
   - トグルスイッチUI実装
   - 基本的なフォーム状態管理

2. **Phase 2**: 発言制限設定UI
   - MessageRestrictSettingsSectionの実装
   - 数値入力コンポーネントの作成
   - レイアウトとスタイリング

3. **Phase 3**: バリデーション機能
   - Zodスキーマの実装
   - リアルタイムバリデーション
   - エラーハンドリング

4. **Phase 4**: 統合とテスト
   - コンポーネント統合
   - ユニットテスト作成
   - E2Eテスト作成

## 注意事項

- 既存のデザインシステムとの一貫性を保つ
- アクセシビリティガイドラインに準拠
- モバイル対応を考慮したレスポンシブデザイン
- パフォーマンスを考慮した実装（不要な再レンダリングの回避）
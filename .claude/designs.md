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

### 共通 UI コンポーネント

#### RadioGroup コンポーネント

汎用的なラジオボタングループコンポーネント。セグメントコントロール風のボタンスタイルを提供。

**特徴**

- ボタン風のセグメントコントロールデザイン
- 選択されたボタンは primary 色（青）背景で強調表示
- アクセシビリティ対応（sr-only）
- 型安全な実装（ジェネリック型対応）
- 横並びレイアウト（inline-flex）
- スムーズなトランジション効果

**使用例**

```typescript
const options: RadioOption<"small" | "medium" | "large">[] = [
  { value: "small", label: "小" },
  { value: "medium", label: "中" },
  { value: "large", label: "大" },
];

<RadioGroup
  name="size"
  value={selectedSize}
  options={options}
  onChange={setSelectedSize}
/>;
```

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

### 村作成確認モーダルの設計

**VillageCreateConfirmModal コンポーネント**

村作成前の最終確認を行うモーダルダイアログ。サーバーサイドバリデーション後に表示する。

**設計要件**:
- `/village/confirm` API でのバリデーション実行
- 確認モーダル内での設定内容表示
- 最終確認後の村作成処理
- エラーハンドリングとユーザーフィードバック

**フロー設計**:
1. 村作成フォーム送信
2. `/village/confirm` API 呼び出し（バリデーション）
3. バリデーション成功時に確認モーダル表示
4. 設定内容確認後、「村作成」ボタンで実際の村作成API実行
5. 村作成完了時の遷移処理

**API統合**:
```typescript
interface VillageConfirmRequest {
  // 村作成フォームの全データ
  name: string;
  settings: VillageSettings;
  // その他必要なフィールド
}

interface VillageConfirmResponse {
  // 確認用の設定内容
  confirmedSettings: VillageSettings;
  // バリデーション結果
  isValid: boolean;
  // エラーメッセージ（ある場合）
  errors?: string[];
}
```

**UI/UX設計**:
- 設定内容の分かりやすい表示
- 重要な設定項目のハイライト
- キャンセル/確認の明確な選択肢
- レスポンシブデザイン（モバイル対応）

## 注意事項

- 既存のデザインシステムとの一貫性を保つ
- アクセシビリティガイドラインに準拠
- モバイル対応を考慮したレスポンシブデザイン
- パフォーマンスを考慮した実装（不要な再レンダリングの回避）

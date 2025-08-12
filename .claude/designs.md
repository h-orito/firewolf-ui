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

**UI/UX 設計**:

- 設定内容の分かりやすい表示
- 重要な設定項目のハイライト
- キャンセル/確認の明確な選択肢
- レスポンシブデザイン（モバイル対応）

## 村画面の設計方針

村画面は FIREWOLF UI v2 の中核となる画面であり、詳細な設計ドキュメントを **[`doc/v2/village/`](../doc/v2/village/)** に整備しています。

### 主要な設計方針

#### アーキテクチャ設計
- **左右分割レイアウト**: PC では左側メニュー（固定幅）+ 右側メインコンテンツ
- **レスポンシブ設計**: スマホではハンバーガーメニュー形式に変更
- **コンポーネント分離**: 機能ごとの独立したコンポーネント設計

#### 状態管理設計
- **Zustand**: クライアント状態（UI状態、フィルタ設定等）
- **TanStack Query**: サーバー状態（村情報、発言データ等）
- **Cookie 永続化**: ユーザー設定、メモ機能

#### パフォーマンス設計
- **仮想化**: 大量の発言データに対する効率的な表示
- **適応的ポーリング**: ページの可視状態に応じた更新頻度調整
- **最適化されたキャッシュ戦略**: 過去日は長期キャッシュ、現在日は短期キャッシュ

### 詳細設計ドキュメント参照

設計の詳細は以下のドキュメントを参照してください：

- **[村画面設計概要](../doc/v2/village/README.md)**
- **[コンポーネント設計](../doc/v2/village/components.md)**
- **[状態管理設計](../doc/v2/village/state-management.md)**
- **[API連携設計](../doc/v2/village/api-integration.md)**
- **[レスポンシブ設計](../doc/v2/village/responsive.md)**
- **[広告配置設計](../doc/v2/village/ads.md)**
- **[メッセージ表示設計](../doc/v2/village/message.md)**
- **[アクション機能設計](../doc/v2/village/actions.md)**
- **[モーダル設計](../doc/v2/village/modals.md)**

### 広告統合設計

#### Google AdSense 統合
- **サイドバー広告**: 260x90px のディスプレイ広告
  - data-ad-client: `ca-pub-0917187897820609`
  - data-ad-slot: `2365194990`
- **メインコンテンツ広告**: レスポンシブ広告（fluid）
  - data-ad-layout-key: `-hm-c+2i-1u-38`
  - data-ad-slot: `5122687444`
- **配置**: サイドバー下部、発言欄下部

### メッセージ表示設計

#### メッセージ変換・装飾機能
- **エスケープ処理**: XSS 対策のための HTML エスケープ
- **デコレーション機能**: 文字装飾タグの変換処理
  - 太字、文字サイズ、打ち消し線、ルビ、隠し文字、色指定
- **アンカー機能**: 発言参照リンクの生成と処理

#### 発言種別ごとのスタイリング
- **通常発言**: 白背景 (#fff)
- **人狼の囁き**: 赤系背景 (#f2cece)
- **共鳴発言**: 緑系背景 (#cef2ce)
- **恋人発言**: ピンク系背景 (#f2dede)、赤文字 (#c22)
- **見学発言**: 黄系背景 (#f2f2ce)
- **独り言**: グレー背景 (#ddd)
- **死者の呻き**: 青系背景 (#ceedf2)

#### システムメッセージのスタイリング
- 役職別のボーダーカラー設定
- 透明または薄い色の背景設定
- 参加者一覧の特別表示（PARTICIPANTS メッセージ）

### アクション機能設計

#### 発言機能
- **発言種別選択**: 利用可能な発言種別のラジオグループ
- **デコレーション機能**: ツールバーからの文字装飾
- **文字数カウンター**: リアルタイム更新
- **残り回数表示**: 発言制限の可視化

#### 入村・見学機能
- **キャラクター選択**: ビジュアル選択とドロップダウン
- **役職希望**: 第1希望・第2希望の設定
- **入村発言**: デコレーション機能付きテキストエリア

#### 能力行使機能
- **役職ごとのパネル表示**: 使用可能な能力のみ表示
- **対象選択**: 能力対象となる参加者の選択
- **襲撃担当者設定**: 人狼陣営の場合の担当者設定

#### その他のアクション
- **カミングアウト**: 最大2役職までのCO機能
- **コミット**: 時短希望の設定
- **村建てメニュー**: 村建て固有の機能
- **管理メニュー**: 管理者向け機能
- **デバッグメニュー**: 開発用機能

### モーダル設計

#### 発言確認モーダル
- **プレビュー表示**: 実際の表示形式でのプレビュー
- **誤爆防止機能**: 発言種別の再確認
- **確認ボタン**: 誤操作防止のための2段階確認

#### 入村確認モーダル
- **規約同意チェック**: 必須チェック項目
- **設定確認**: 突然死設定等の重要事項確認
- **最終確認**: 入村前の最終確認

## 村画面の包括設計

村画面はFIREWOLF UI v2の中核となる画面であり、人狼ゲームのメイン体験を提供します。

### 全体アーキテクチャ

#### レイアウト戦略
- **デスクトップ**: 左側固定サイドバー（320px） + 右側メインコンテンツ
- **モバイル**: ハンバーガーメニュー + 全幅メインコンテンツ
- **タブレット**: 中間サイズでの適応的レイアウト
- **共通ヘッダーを非表示**: 村専用のクリーンな体験を提供

#### コンポーネント階層設計
```
VillagePage (メインエントリ)
├── VillageErrorBoundary (エラー境界)
├── VillageLayout (レイアウト管理)
│   ├── Sidebar (左側メニュー)
│   │   ├── VillageInfo (村情報・設定)
│   │   ├── ParticipantList (参加者一覧)
│   │   ├── MemoSection (メモ機能)
│   │   ├── UserSettings (ユーザー設定)
│   │   ├── NavigationLinks (リンク集)
│   │   └── Advertisement (サイドバー広告)
│   └── MainContent (メインコンテンツ)
│       ├── TopFixedMenu (上部固定メニュー)
│       ├── VillageHeader (村名・日付ナビ)
│       ├── MessageList (発言一覧)
│       │   ├── MessageItem (個別発言)
│       │   ├── VirtualizedList (仮想化)
│       │   └── InfiniteScroll (無限スクロール)
│       ├── GameActions (ゲームアクション群)
│       └── BottomFixedMenu (下部固定メニュー)
└── Modals (モーダル群)
    ├── MessageFilterModal (発言抽出)
    ├── MessageConfirmModal (発言確認)
    ├── ParticipateConfirmModal (入村確認)
    └── CharacterSelectModal (キャラ選択)
```

### 状態管理アーキテクチャ

#### データフロー設計
1. **サーバー状態** (TanStack Query)
   - 村情報、参加者データ、発言データ
   - キャッシュ戦略: 過去日(30分)、現在日(10秒)
   - 楽観的更新: 発言投稿、能力行使等
   - エラー境界: ネットワークエラー・APIエラー処理

2. **クライアント状態** (Zustand)
   - UIの開閉状態、フィルタ設定、ユーザー設定
   - 軽量・高パフォーマンス
   - React DevToolsとの連携

3. **永続化状態** (Cookie のみ)
   - ユーザー設定: 1年間のCookie保存
   - メモ機能: 30日間のCookie保存（最大3個）
   - フィルタ・日付状態: セッション状態（別タブ独立、同一画面内では保持）

#### リアルタイム更新戦略
- **適応的ポーリング**: ページ表示状態に応じた更新頻度調整
- **残り時間表示**: 1秒間隔の高頻度更新
- **発言データ**: 30秒間隔の定期更新（サーバー負荷軽減）
- **村情報**: 60秒間隔の低頻度更新

### UI/UX設計原則

#### アクセシビリティ優先設計
- **WCAG 2.1 AA準拠**: コントラスト比、フォーカス管理
- **キーボードナビゲーション**: Tab順序、ショートカットキー
- **スクリーンリーダー対応**: セマンティックHTML、ARIA属性
- **色のみに依存しない情報伝達**: 発言種別の識別

#### パフォーマンス最適化
- **仮想化**: react-window による大量データの効率的表示
- **メモ化**: React.memo、useMemo、useCallbackの適切な利用
- **コード分割**: 動的importによるモーダルコンポーネント分割
- **画像最適化**: 遅延読み込み、適応的サイズ調整

#### レスポンシブデザイン
- **ブレークポイント**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px  
  - Desktop: > 1024px
- **タッチ最適化**: 44px以上のタッチターゲット
- **コンテンツ適応**: 画面サイズに応じた情報密度調整

### 広告統合戦略

#### Google AdSense実装
- **サイドバー広告**: 260x90px ディスプレイ広告
  - data-ad-client: "ca-pub-0917187897820609"
  - data-ad-slot: "2365194990"
- **メインコンテンツ広告**: レスポンシブ広告(fluid)
  - data-ad-layout-key: "-hm-c+2i-1u-38"
  - data-ad-slot: "5122687444"
- **配置戦略**: サイドバー下部、発言一覧下部の自然な位置
- **広告ブロッカー対応**: フォールバック表示、UX劣化の防止

### メッセージ表示システム

#### セキュリティとパフォーマンス
- **XSS対策**: DOMPurifyによるHTMLサニタイゼーション
- **デコレーション処理**: 安全なタグ変換システム
- **アンカーシステム**: 発言参照リンクの効率的な処理

#### 発言種別別スタイリング

**発言系メッセージ**
```css
.message-normal { background: #fff; color: #0a0a0a; }           /* 通常発言 */
.message-werewolf { background: #f2cece; color: #0a0a0a; }      /* 人狼の囁き */
.message-resonance { background: #cef2ce; color: #0a0a0a; }     /* 共鳴発言 */
.message-lover { background: #f2dede; color: #c22; }            /* 恋人発言 */
.message-spectate { background: #f2f2ce; color: #0a0a0a; }      /* 見学発言 */
.message-monologue { background: #ddd; color: #0a0a0a; }        /* 独り言 */
.message-grave { background: #ceedf2; color: #0a0a0a; }         /* 死者の呻き */
```

**システムメッセージ（役職別窓発言）**
```css
.message-private-seer { border-color: #0f0; background: #efe; color: #0a0a0a; }        /* 占い師の窓 */
.message-private-werewolf { border-color: red; background: #fee; color: #0a0a0a; }     /* 人狼の窓 */
.message-private-psychic { border-color: #00f; background: #eef; color: #0a0a0a; }     /* 霊媒師の窓 */
.message-private-ability { border-color: #ccc; background: #eee; color: #0a0a0a; }     /* 能力結果 */
.message-private-mason { border-color: #fa0; background: #fec; color: #0a0a0a; }       /* 共有者の窓 */
.message-private-sympathizer { border-color: #fa0; background: #fec; color: #0a0a0a; } /* 共鳴者の窓 */
.message-private-fox { border-color: #fa0; background: #ffc; color: #0a0a0a; }         /* 妖狐の窓 */
.message-private-lovers { border-color: #f0a; background: #fef; color: #0a0a0a; }      /* 恋人の窓 */
.message-public-system { border-color: #ccc; background: transparent; color: #0a0a0a; } /* 公開システム */
.message-participants { border-color: #ccc; background: transparent; color: #0a0a0a; }  /* 参加者一覧 */
```

### アクション機能設計

#### パネルシステム
- **開閉可能**: 各アクションはCollapsibleパネル
- **固定表示**: 重要なアクションの画面下部固定
- **権限ベース表示**: SituationAsParticipantに基づく動的表示

#### 発言システム
- **リアルタイムバリデーション**: 文字数・行数制限の即座フィードバック
- **デコレーションツールバー**: 直感的な文字装飾機能
- **確認システム**: 誤投稿防止の2段階確認

### エラーハンドリング戦略

#### 段階的エラー処理
1. **コンポーネントレベル**: ErrorBoundaryによる局所的エラー処理
2. **API レベル**: TanStack Queryの自動リトライ・フォールバック
3. **アプリケーションレベル**: グローバルエラー状態管理
4. **ユーザーフィードバック**: toast通知・インライン表示

#### 復旧戦略
- **状態リセット**: エラー時の適切な状態初期化
- **セッション継続**: 可能な限りユーザーセッションを維持
- **オフライン対応**: キャッシュデータでの部分的機能提供

### テスト戦略

#### 多層テストアプローチ
1. **ユニットテスト**: コンポーネント・フック・ユーティリティ
2. **統合テスト**: ストア連携・API通信
3. **E2Eテスト**: 重要ユーザーフローの自動化
4. **パフォーマンステスト**: 大量データでの動作確認
5. **アクセシビリティテスト**: axe-coreによる自動検証

## コーディング規約・ファイル命名戦略

### ファイル命名規則

**v2 プロジェクトの統一命名規則**

- **React コンポーネント (.tsx)**: PascalCase
  - `MessageList.tsx`、`VillageInfo.tsx`、`ParticipantList.tsx`
  - コンポーネント名とファイル名を一致させる
  
- **TypeScript ファイル (.ts)**: kebab-case  
  - `village-api.ts`、`message-utils.ts`、`user-settings-store.ts`
  - ユーティリティ、型定義、API層、ストア等

- **設定ファイル**: 既存の規則に従う
  - `package.json`、`tsconfig.json`、`tailwind.config.js`

### 既存ファイルの統一化方針

**統一対象**
- v2 ディレクトリ内のファイルで命名規則が混在している箇所
- camelCase と PascalCase が混在しているコンポーネントファイル
- 新規作成時は必ず統一規則を適用

**統一手順**
1. 現在の命名状況の調査
2. PascalCase への変更（.tsx ファイル）
3. kebab-case への変更（.ts ファイル）
4. import 文の更新
5. 関連ファイルの参照更新

### 実装原則

- 新規ファイル作成時は統一規則を厳格に適用
- 既存ファイルの修正時に合わせて命名も統一
- TypeScript の型定義も命名規則に従う（PascalCase for types/interfaces）

## 注意事項

- 既存のデザインシステムとの一貫性を保つ
- アクセシビリティガイドラインに準拠
- モバイル対応を考慮したレスポンシブデザイン
- パフォーマンスを考慮した実装（不要な再レンダリングの回避）
- ファイル命名規則の厳守

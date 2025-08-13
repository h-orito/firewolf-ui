# テスト戦略と実装

このドキュメントでは、FIREWOLF UI v2のテスト戦略、実装アプローチ、実行方法について説明します。

## テスト戦略

### テストピラミッド

FIREWOLF UI v2では、効率的なテスト戦略として以下のテストピラミッドに従います：

```
    /\
   /  \  E2Eテスト（少数・重要フロー）
  /____\
 /      \ 統合テスト（中程度・API連携）
/________\
  単体テスト（多数・詳細ロジック）
```

### テスト種別と責任範囲

1. **単体テスト（Unit Tests）**
   - **対象**: 個別の関数、コンポーネント、カスタムフック
   - **ツール**: Jest + Testing Library
   - **カバレッジ目標**: 80%以上
   - **実行頻度**: 開発時常時

2. **統合テスト（Integration Tests）**
   - **対象**: API統合、複数コンポーネントの連携
   - **ツール**: Jest + MSW (Mock Service Worker)
   - **カバレッジ目標**: 主要APIエンドポイント全て
   - **実行頻度**: PR作成時

3. **E2Eテスト（End-to-End Tests）**
   - **対象**: ユーザーの重要フロー、クリティカルパス
   - **ツール**: Playwright
   - **カバレッジ目標**: 主要ユーザーフロー全て
   - **実行頻度**: PR作成時、デプロイ前

## 単体テスト

### 実行方法

```bash
# 全テスト実行
pnpm test

# ウォッチモード（開発時推奨）
pnpm test:watch

# カバレッジ測定
pnpm test:coverage

# 特定ファイルのテスト
pnpm test MessageItem.test.tsx

# 特定パターンのテスト
pnpm test --testPathPattern=components/village
```

### テスト対象

#### コンポーネント
- **UIコンポーネント**: 表示内容、プロパティによる動作変化
- **イベントハンドリング**: クリック、フォーム送信等
- **条件分岐**: 権限による表示切り替え、エラー状態等

例：
```typescript
// MessageItem.test.tsx
describe('MessageItem', () => {
  it('発言内容が正しく表示される', () => {
    render(<MessageItem message={mockMessage} />);
    expect(screen.getByText('テスト発言')).toBeInTheDocument();
  });

  it('発言種別によってスタイルが変わる', () => {
    render(<MessageItem message={{...mockMessage, messageType: 'WEREWOLF_SAY'}} />);
    expect(screen.getByTestId('message-item')).toHaveClass('bg-red-50');
  });
});
```

#### カスタムフック
- **状態変更**: 状態の初期値、更新ロジック
- **副作用**: API呼び出し、ローカルストレージ操作
- **返り値**: 期待される値と型

例：
```typescript
// useVillageStore.test.ts
describe('useVillageStore', () => {
  it('村IDが正しく設定される', () => {
    const { result } = renderHook(() => useVillageStore());
    
    act(() => {
      result.current.setVillageId(123);
    });
    
    expect(result.current.villageId).toBe(123);
  });
});
```

#### ユーティリティ関数
- **入出力**: 様々な入力に対する期待される出力
- **エッジケース**: null、undefined、空配列等
- **エラーハンドリング**: 不正な入力に対する動作

例：
```typescript
// messageUtils.test.ts
describe('convertToHtml', () => {
  it('基本的なテキストがHTMLに変換される', () => {
    expect(convertToHtml('テスト')).toBe('<p>テスト</p>');
  });

  it('デコレーションが正しく変換される', () => {
    expect(convertToHtml('**太字**')).toBe('<p><strong>太字</strong></p>');
  });
});
```

### モック戦略

#### API呼び出し
```typescript
// API関数のモック
jest.mock('../lib/api/village', () => ({
  fetchVillageInfo: jest.fn(),
  postMessage: jest.fn(),
}));
```

#### ストア
```typescript
// Zustandストアのモック
jest.mock('../stores/village-store', () => ({
  useVillageStore: () => ({
    villageId: 123,
    setVillageId: jest.fn(),
  }),
}));
```

#### ルーター
```typescript
// Next.js routerのモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));
```

## 統合テスト

### 実行方法

```bash
# API統合テスト実行
pnpm test:integration

# 特定のAPI群のテスト
pnpm test --testPathPattern=integration/api
```

### テスト対象

#### API統合
- **リクエスト**: 正しいエンドポイント、パラメータ
- **レスポンス**: データ変換、エラーハンドリング
- **状態管理**: TanStack Queryとの連携

例：
```typescript
// village-api.integration.test.ts
describe('Village API Integration', () => {
  beforeEach(() => {
    server.use(
      rest.get('/api/village/:id', (req, res, ctx) => {
        return res(ctx.json(mockVillageData));
      })
    );
  });

  it('村情報が正しく取得される', async () => {
    const { result } = renderHook(() => useVillageQuery(123), {
      wrapper: QueryClientProvider,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockVillageData);
    });
  });
});
```

#### フォーム送信
- **バリデーション**: Zodスキーマとの連携
- **送信処理**: API呼び出し、成功・失敗時の動作
- **UI更新**: 送信後の画面遷移、メッセージ表示

#### 状態管理
- **ストア間連携**: 複数ストアの協調動作
- **永続化**: Cookie、LocalStorageとの連携
- **初期化**: URLパラメータからの状態復元

## E2Eテスト

### 実行方法

```bash
# Playwrightブラウザインストール（初回のみ）
pnpm exec playwright install

# 全E2Eテスト実行
pnpm test:e2e

# UI付きでテスト実行（デバッグ用）
pnpm test:e2e:ui

# 特定ブラウザでテスト
pnpm test:e2e --project=chromium

# ヘッドレスモードを無効にして実行
pnpm test:e2e --headed

# 特定テストファイル実行
pnpm test:e2e tests/e2e/village-page.spec.ts
```

### テスト対象

#### ページ初期表示
- **基本表示**: ページの読み込み、主要要素の表示確認
- **認証状態**: ログイン有無による表示切り替え
- **エラー処理**: ネットワークエラー、APIエラー時の動作

#### ユーザーフロー
1. **認証フロー**
   - ログイン・ログアウト
   - 認証後のリダイレクト

2. **村参加フロー**
   - 村一覧から詳細表示
   - キャラクター選択・入村
   - 退村

3. **村内アクションフロー**
   - 発言投稿
   - 投票実行
   - 能力使用

4. **村作成フロー**
   - 村設定入力
   - 村作成確認・実行

### テスト設定

#### 環境設定
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

#### テストデータ
```typescript
// tests/e2e/fixtures/test-data.ts
export const testVillage = {
  id: 1,
  name: 'テスト村',
  status: 'RECRUITING',
  // ...
};

export const testUser = {
  id: 'test-user',
  name: 'テストユーザー',
  // ...
};
```

## アクセシビリティテスト

### 実行方法

```bash
# axe-coreを使用したアクセシビリティテスト
pnpm test:a11y

# 特定ページのテスト
pnpm test:a11y --testPathPattern=village-page
```

### テスト対象

- **キーボードナビゲーション**: Tab、Enter、Escapeキーでの操作
- **スクリーンリーダー**: aria-label、role属性の適切な設定
- **色・コントラスト**: WCAG 2.1 AA準拠の色使い
- **フォーカス管理**: 適切なフォーカスの移動と表示

例：
```typescript
// accessibility.test.ts
describe('Accessibility', () => {
  it('村ページがアクセシビリティ基準を満たす', async () => {
    render(<VillagePage villageId={1} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## パフォーマンステスト

### 実行方法

```bash
# パフォーマンステスト実行
pnpm test:performance

# 大量データでのテスト
pnpm test:performance --testPathPattern=large-data
```

### テスト対象

#### レンダリング性能
- **初期表示**: ページ読み込み時間
- **大量データ**: 1000件以上のメッセージ表示
- **スクロール**: 仮想化の動作確認

#### メモリ使用量
- **メモリリーク**: 長時間利用時のメモリ増加
- **ガベージコレクション**: 不要なオブジェクトの解放

例：
```typescript
// performance.test.ts
describe('Performance', () => {
  it('1000件のメッセージが3秒以内に表示される', async () => {
    const start = performance.now();
    
    render(<MessageList messages={generateMessages(1000)} />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('message-item')).toHaveLength(1000);
    });
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(3000);
  });
});
```

## CI/CD連携

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test:coverage
      - run: pnpm test:e2e
```

### テスト実行順序

開発フロー内での推奨実行順序：

1. **開発時**: `pnpm test:watch`（単体テストのみ）
2. **コミット前**: `pnpm lint && pnpm type-check && pnpm test`
3. **PR作成時**: `pnpm test:e2e`（CI内で自動実行）

## ベストプラクティス

### テスト作成時
1. **AAA パターン**: Arrange（準備）、Act（実行）、Assert（検証）
2. **テスト名**: 日本語で「何をテストするか」を明確に
3. **単一責任**: 1つのテストで1つの事柄のみをテスト
4. **独立性**: テスト間で状態を共有しない

### モック使用時
1. **最小限**: 必要最小限のモックに留める
2. **リアルな動作**: 実際のAPIレスポンスに近いモックデータ
3. **エラーケース**: 正常系だけでなく異常系もテスト

### パフォーマンス
1. **並列実行**: テストの並列実行を活用
2. **適切なタイムアウト**: 必要以上に長いタイムアウトを避ける
3. **クリーンアップ**: テスト後の適切なリソース解放

## トラブルシューティング

### よくある問題

#### テストが不安定（flaky）
- **原因**: 非同期処理の待機不足、タイムアウト設定
- **解決**: `waitFor`、`findBy*`の適切な使用

#### モックが効かない
- **原因**: モックの設定タイミング、スコープの問題
- **解決**: `beforeEach`での適切な初期化

#### Playwrightで要素が見つからない
- **原因**: 要素の読み込み待ち、セレクター間違い
- **解決**: `page.waitForSelector`、`data-testid`の活用

### デバッグ手法

#### 単体テスト
```typescript
// screen.debug()でDOM構造を確認
screen.debug();

// 特定要素の詳細確認
screen.debug(screen.getByTestId('message-item'));
```

#### E2Eテスト
```typescript
// ページの状態をスクリーンショット
await page.screenshot({ path: 'debug.png' });

// ブラウザを表示してデバッグ
await page.pause();
```

## まとめ

FIREWOLF UI v2のテスト戦略は、品質向上と開発効率のバランスを重視しています。

- **単体テスト**: 高速フィードバックによる開発効率向上
- **統合テスト**: API連携の確実性確保
- **E2Eテスト**: ユーザー体験の品質保証

継続的な品質向上のため、テストカバレッジの監視と、実際のバグに基づくテスト追加を心がけています。
# コーディング規約・スタイル

## TypeScript規約

- **型定義**: 必ず記述、any型の使用を避ける
- **厳格モード**: strict: true で設定済み
- **インポート**: `@/*` エイリアス使用（src配下）
- **命名**: PascalCase（コンポーネント、型）、camelCase（変数、関数）

## React規約

- **コンポーネント**: 関数コンポーネントのみ使用
- **ロジック分離**: カスタムフックでビジネスロジックを分離
- **プロップス**: interfaceで型定義
- **エクスポート**: default exportを使用

## コンポーネント設計

- **Atomic Design原則**に従う
  - Atoms: `src/components/ui/` （基本UI）
  - Molecules: 小さな機能単位
  - Organisms: 複数のMoleculesを組み合わせた機能
  - Pages: ページレベルのコンポーネント

## スタイリング規約

- **Tailwind CSS**: Utility-Firstアプローチ
- **shadcn/ui**: 基本コンポーネントとして優先使用
- **カスタムCSS**: 極力避ける、必要時はTailwindのカスタマイズ
- **レスポンシブ**: mobile-first設計

## 状態管理規約

- **サーバー状態**: TanStack Query使用
- **グローバル状態**: Zustand使用
- **ローカル状態**: React.useState使用
- **フォーム**: React Hook Form + Zod使用

## フォーマット設定

- **セミコロン**: なし (semi: false)
- **クォート**: シングルクォート (singleQuote: true)
- **タブ幅**: 2スペース (tabWidth: 2)
- **行末カンマ**: ES5準拠 (trailingComma: "es5")
- **行幅**: 100文字 (printWidth: 100)

## ファイル・ディレクトリ命名

- **コンポーネント**: kebab-case（ファイル名）、PascalCase（コンポーネント名）
- **フック**: useXxx形式
- **ユーティリティ**: camelCase
- **型定義**: PascalCase、末尾にType/Interface

## コメント規約

- **JSDoc**: 公開関数・コンポーネントには必須
- **インライン**: 複雑なロジックのみ
- **TODO**: 必要に応じて使用、Issue番号も併記

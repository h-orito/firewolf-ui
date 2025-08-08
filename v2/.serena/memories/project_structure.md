# プロジェクト構造

## ルートディレクトリ構成

```
/Users/h-orito/ort/wolf/workspace/firewolf-ui/
├── v1/                     # 既存のNuxt.js版
├── v2/                     # Next.js版（メイン開発対象）
├── doc/                    # ドキュメント
│   ├── v1/                 # v1関連ドキュメント
│   └── v2/                 # v2関連ドキュメント
├── .claude/                # Claude管理ファイル
│   ├── features.md         # 新機能要望
│   ├── requirements.md     # 要件定義
│   ├── designs.md          # 設計書
│   ├── tasks.md           # タスク管理
│   └── bugs.md            # バグ管理
└── static/                 # 静的ファイル
```

## v2ディレクトリ詳細（開発対象）

```
v2/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/      # 認証不要ページ
│   │   │   ├── page.tsx           # トップページ
│   │   │   ├── village/[id]/      # 村詳細
│   │   │   ├── village-list/      # 村一覧
│   │   │   ├── charachip/         # キャラチップ
│   │   │   ├── player-record/     # プレイヤー戦績
│   │   │   └── layout.tsx         # パブリックレイアウト
│   │   ├── (auth)/        # 認証必要ページ
│   │   │   ├── village/create/    # 村作成
│   │   │   ├── mypage/            # マイページ
│   │   │   ├── setting/           # 設定
│   │   │   └── layout.tsx         # 認証レイアウト
│   │   ├── api/           # API Routes
│   │   ├── layout.tsx     # ルートレイアウト
│   │   └── globals.css    # グローバルスタイル
│   ├── components/        # Reactコンポーネント
│   │   ├── ui/           # 基本UIコンポーネント（shadcn/ui）
│   │   ├── layout/       # レイアウトコンポーネント
│   │   ├── village/      # 村関連コンポーネント
│   │   ├── pages/        # ページ固有コンポーネント
│   │   ├── auth/         # 認証関連コンポーネント
│   │   └── providers/    # コンテキストプロバイダー
│   ├── hooks/            # カスタムフック
│   ├── lib/              # ユーティリティ・設定
│   │   ├── api/         # API関連ユーティリティ
│   │   ├── validation/  # バリデーションロジック
│   │   └── utils/       # 汎用ユーティリティ
│   ├── stores/           # Zustandストア
│   ├── types/            # TypeScript型定義
│   │   └── generated/   # 自動生成された型
│   ├── data/            # 静的データ
│   └── utils/           # ユーティリティ関数
├── public/               # 静的アセット
├── tests/                # E2Eテスト
└── 設定ファイル群
```

## 重要ファイル

- `package.json`: 依存関係とスクリプト定義
- `tsconfig.json`: TypeScript設定
- `.eslintrc.json`: ESLint設定
- `.prettierrc.json`: Prettier設定
- `tailwind.config.ts`: Tailwind CSS設定
- `next.config.js`: Next.js設定

## 開発作業ディレクトリ

開発作業は基本的に `/Users/h-orito/ort/wolf/workspace/firewolf-ui/v2/` で行う

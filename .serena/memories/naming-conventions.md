# FIREWOLF プロジェクト命名規則

## 禁止事項

### ディレクトリ・ファイル名
- **「common」という名前は禁止** - 具体的で意味のある名前を使用すること
  - ❌ `components/common/` 
  - ✅ `components/layout/` - レイアウト関連コンポーネント

## 推奨事項

### コンポーネントディレクトリ構造
- **レイアウト関連は全てlayout配下に統合**
  - ✅ `components/layout/` - 全レイアウト関連コンポーネント
    - GoogleAds.vue - 広告コンポーネント
    - SiteFooter.vue - サイトフッター
    - NavBar.vue - ナビゲーションバー
    - NavBarSlider.vue - サイドメニュー
    - KampaModal.vue, TermModal.vue, PolicyModal.vue - モーダル類
  - ✅ `components/village/` - 人狼ゲーム専用
  - ✅ `components/ui/` - 汎用UIコンポーネント  
  - ✅ `components/form/` - フォーム関連

### 命名の基本原則
- 機能・目的が明確にわかる名前を付ける
- 曖昧で汎用的な名前（common, util, misc等）は避ける
- 具体的で検索しやすい名前にする
- **レイアウトに関連するコンポーネントは全てlayout配下に配置する**
  - ナビゲーション、モーダル、ヘッダー、フッターなど

### 実装済み構成例
```
app/components/
├── layout/           # 全レイアウト関連コンポーネント
│   ├── GoogleAds.vue
│   ├── SiteFooter.vue
│   ├── NavBar.vue
│   ├── NavBarSlider.vue
│   ├── KampaModal.vue
│   ├── TermModal.vue
│   └── PolicyModal.vue
├── Loading.vue       # 汎用ローディング
└── Modal.vue        # 汎用モーダル基底
```

この方針は今後すべての開発で適用する。
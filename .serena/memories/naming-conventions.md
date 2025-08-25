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
- **ページ専用コンポーネントはpages配下に分類**
  - ✅ `components/pages/{page-name}/` - 各ページ専用コンポーネント
    - 例: `components/pages/village/` - 村ページ専用
    - 例: `components/pages/create-village/` - 村作成ページ専用
    - 例: `components/pages/player-record/` - 戦績ページ専用
- **機能別コンポーネント分類**
  - ✅ `components/ui/` - 汎用UIコンポーネント  
  - ✅ `components/form/` - フォーム関連コンポーネント

### 命名の基本原則
- 機能・目的が明確にわかる名前を付ける
- 曖昧で汎用的な名前（common, util, misc等）は避ける
- 具体的で検索しやすい名前にする
- **レイアウトに関連するコンポーネントは全てlayout配下に配置する**
  - ナビゲーション、モーダル、ヘッダー、フッターなど
- **ページ専用コンポーネントはpages/{page-name}/配下に配置する**
  - そのページでのみ使用されるコンポーネント
  - 複数ページで使用される場合は適切な機能別ディレクトリに移動

### 実装済み構成例
```
app/components/
├── layout/                    # 全レイアウト関連コンポーネント
│   ├── GoogleAds.vue
│   ├── SiteFooter.vue
│   ├── NavBar.vue
│   ├── NavBarSlider.vue
│   ├── KampaModal.vue
│   ├── TermModal.vue
│   └── PolicyModal.vue
├── pages/                     # ページ専用コンポーネント
│   ├── village/              # 村ページ専用コンポーネント
│   │   ├── MessageCard.vue
│   │   ├── ActionForm.vue
│   │   ├── PlayerList.vue
│   │   ├── CharaImage.vue    # キャラクター画像
│   │   ├── VillageStatus.vue # 村の状態表示
│   │   └── VillageHeader.vue # 村ヘッダー（日付切り替え等）
│   ├── create-village/       # 村作成ページ専用コンポーネント
│   │   ├── SettingsForm.vue
│   │   └── CharaChipSelect.vue
│   └── player-record/        # 戦績ページ専用コンポーネント
│       ├── StatsSummary.vue
│       └── GameHistory.vue
├── ui/                       # 汎用UIコンポーネント
├── form/                     # フォーム関連コンポーネント
├── Loading.vue               # 汎用ローディング
└── Modal.vue                # 汎用モーダル基底
```

### コンポーネント配置の判断基準

1. **layout/**: レイアウト・UI構造に関するもの
   - ナビゲーション、ヘッダー、フッター、モーダル、広告など
   - アプリ全体の構造や外観に関わるコンポーネント

2. **pages/{page-name}/**: 特定のページでのみ使用
   - そのページの機能に特化したコンポーネント
   - 人狼ゲーム関連コンポーネントも各ページ配下に配置
   - 例: CharaImage.vue, VillageStatus.vue → components/pages/village/

3. **ui/**: 汎用的なUIコンポーネント
   - ボタン、カード、リストなど
   - アプリケーション全体で使い回すコンポーネント

4. **form/**: フォーム関連の汎用コンポーネント
   - 入力フィールド、バリデーション、送信フォームなど
   - フォーム機能に特化した再利用可能コンポーネント

この方針は今後すべての開発で適用する。
# FIREWOLF Nuxt4移行 タスク一覧

## 📁 作業ディレクトリ構造

```
firewolf-ui/                 # 作業ディレクトリ (feature/nuxt4ブランチ)
├── .old-nuxt2/             # 退避した旧ファイル群
│   ├── nuxt.config.ts      # 旧Nuxt 2設定
│   ├── package.json        # 旧依存関係
│   └── components/         # 旧コンポーネント（参照用）
├── nuxt.config.ts          # 新Nuxt 4設定
├── package.json            # 新しい依存関係
├── components/             # 新@nuxt/uiコンポーネント
└── ...
```

## 🔄 移行漏れ機能の実装

### [x] 発言種別変更時の表情自動切り替え機能

**対象ファイル**: [Say.vue](app/components/pages/village/action/Say.vue)

**概要**: 発言種別（通常発言、人狼の囁き、共鳴発言等）を切り替えた際に、対応するデフォルト表情に自動で切り替える機能を実装する。

**参考**: [旧実装 say-card.vue](.old-nuxt2/components/village/action/say/say-card.vue#L198-L206, L420-L435)

**実装内容**:
- [x] 発言種別と表情のマッピング定義を追加
  ```typescript
  const messageTypeFaceTypeMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, 'NORMAL'],
    [MESSAGE_TYPE.WEREWOLF_SAY, 'WEREWOLF'],
    [MESSAGE_TYPE.LOVERS_SAY, 'LOVER'],
    [MESSAGE_TYPE.SPECTATE_SAY, 'NORMAL'],
    [MESSAGE_TYPE.SECRET_SAY, 'SECRET'],
    [MESSAGE_TYPE.MONOLOGUE_SAY, 'MONOLOGUE'],
    [MESSAGE_TYPE.GRAVE_SAY, 'GRAVE'],
    [MESSAGE_TYPE.SYMPATHIZE_SAY, 'NORMAL'],  // 共鳴発言は通常表情
  ])
  ```
- [x] デフォルト表情を取得するヘルパー関数を追加
  - マッピングから期待される表情タイプを取得
  - キャラクターがその表情を持っているか確認
  - 持っていない場合は'NORMAL'にフォールバック
- [x] `selectedMessageType`のwatcherを追加し、変更時に表情を自動切り替え
- [x] 初期化時（`initializeForm`）でも発言種別に応じた表情を設定
- [x] 表情選択モーダルの画像を中央揃えに修正

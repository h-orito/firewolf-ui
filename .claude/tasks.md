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

[x] SayMessage右下の秘話ボタンを押しても発言欄にスクロールされない不具合を修正
[x] 全ページのタイトルにFIREWOLFを含める対応
[x] VillageSidebarにTwitterシェアボタンを追加
[x] VillageSidebarにGoogle Adsense広告ユニットを追加
[x] MessageListにGoogle Adsense広告ユニットを追加

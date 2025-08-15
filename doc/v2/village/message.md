# メッセージ表示仕様

## 概要

村画面におけるメッセージ（発言、システムメッセージ）の表示仕様を定義します。

## 共通仕様

### ユーザー設定対応

- **文字サイズ**: `文字を大きく表示する` 設定が ON の場合、大きめの文字で表示

### 発言内容の変換処理

#### 1. エスケープ処理

XSS 対策のため、HTML タグをエスケープ処理

```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

#### 2. デコレーション機能

文字装飾タグを HTML に変換

| タグ                                     | 説明       | 変換後                                    |
| ---------------------------------------- | ---------- | ----------------------------------------- |
| `[[b]]text[[/b]]`                        | 太字       | `<strong>text</strong>`                   |
| `[[large]]text[[/large]]`                | 大きい文字 | `<span class="text-lg">text</span>`       |
| `[[small]]text[[/small]]`                | 小さい文字 | `<span class="text-sm">text</span>`       |
| `[[s]]text[[/s]]`                        | 打ち消し線 | `<del>text</del>`                         |
| `[[ruby]]text[[rt]]ruby[[/rt]][[/ruby]]` | ルビ       | `<ruby>text<rt>ruby</rt></ruby>`          |
| `[[cw]]text[[/cw]]`                      | 隠し文字   | `<span class="spoiler">text</span>`       |
| `[[#ff0000]]text[[/#]]`                  | 色指定     | `<span style="color:#ff0000">text</span>` |

#### 3. アンカー機能

アンカー文字列をリンクに変換

- `>>1234` → 通常発言へのアンカー
- `>>*1234` → 人狼の囁きへのアンカー
- `>>=1234` → 共鳴発言へのアンカー
- `>>?1234` → 恋人発言へのアンカー
- `>>@1234` → 見学発言へのアンカー
- `>>-1234` → 独り言へのアンカー
- `>>+1234` → 死者の呻きへのアンカー

## 発言系メッセージ

### レイアウト構成

#### 上部（ヘッダー）

```
[発言アンカー] [発言者名] [プレイヤー名] (発言回数) 日時
```

- **発言アンカー**: クリック時の動作はユーザー設定に依存
  - `アンカークリック時に発言欄に貼り付ける` ON: 発言欄に貼り付け
  - OFF: クリップボードにコピー
- **発言者名**: `[{short_name}] {name}` 形式で太字表示
- **プレイヤー名**: 存在する場合のみ表示、Twitter リンク付き
- **発言回数**: `(現在回数/最大回数)` 形式、右揃え
- **日時**: ユーザー設定で日付表示切り替え可能、右揃え

#### 中部（本文）

左側：キャラ画像

- API レスポンスのサイズ使用
- `キャラ画像を大きく表示する` ON 時は 1.5 倍

右側：発言内容

- `min-height` はキャラ画像の高さに合わせる
- `word-break: break-word; white-space: pre-wrap;` で改行
- `border: 1px solid #ddd; border-radius:5px;`

#### 下部（アクション）

右揃えで `>>返信` `>>秘話` ボタンを配置

- **返信**: アンカー文字列を発言欄に貼り付け、発言欄へスクロール
- **秘話**: 秘話モードに切り替え、発言者を秘話相手に設定

### 発言種別ごとのスタイリング

| 発言種別   | アンカー形式 | 背景色  | 文字色  | 略称付与 |
| ---------- | ------------ | ------- | ------- | -------- |
| 通常発言   | `>>1234`     | #fff    | #0a0a0a | あり     |
| 人狼の囁き | `>>*1234`    | #f2cece | #0a0a0a | なし     |
| 共鳴発言   | `>>=1234`    | #cef2ce | #0a0a0a | なし     |
| 恋人発言   | `>>?1234`    | #f2dede | #c22    | なし     |
| 見学発言   | `>>@1234`    | #f2f2ce | #0a0a0a | あり     |
| 独り言     | `>>-1234`    | #ddd    | #0a0a0a | あり     |
| 死者の呻き | `>>+1234`    | #ceedf2 | #0a0a0a | あり     |

※独り言はエピローグ前はアンカー非表示

## システムメッセージ

### 共通仕様

- 発言内容のみで構成（ヘッダー、フッターなし）
- 文字色: #0a0a0a（ダークテーマでは #fff）

### メッセージタイプ別スタイリング

| タイプ              | ボーダー色 | 背景色      |
| ------------------- | ---------- | ----------- |
| PRIVATE_SEER        | #0f0       | #efe        |
| PRIVATE_WEREWOLF    | red        | #fee        |
| PUBLIC_SYSTEM       | #ccc       | transparent |
| PARTICIPANTS        | #ccc       | transparent |
| PRIVATE_PSYCHIC     | #00f       | #eef        |
| PRIVATE_ABILITY     | #ccc       | #eee        |
| PRIVATE_MASON       | #fa0       | #fec        |
| PRIVATE_SYMPATHIZER | #fa0       | #fec        |
| PRIVATE_FOX         | #fa0       | #ffc        |
| PRIVATE_LOVERS      | #f0a       | #fef        |

### 参加者一覧（PARTICIPANTS）の特別表示

参加者ごとに以下の情報を表示：

#### レイアウト

```
[キャラ画像] | [キャラ名] [プレイヤー名]     [生存状況]   [戦績ボタン]
             | [役職名] (役職希望)             [勝敗]
```

#### 表示内容

- **キャラ画像**: API レスポンスの 1/2 サイズ
- **キャラ名**: `[{short_name}] {name}` 形式
- **プレイヤー名**: Twitter リンク付き（存在する場合）
- **生存状況**:
  - 死亡: `2d襲撃` 等（無惨は danger 色、処刑・突然死は info 色）
  - 生存: `生存`
- **役職名**: 太字表示
- **役職希望**: `(第1希望/第2希望希望)` 形式
- **勝敗**: 勝利は success 色、敗北は danger 色
- **戦績ボタン**: `/player-record?id={player_id}` へのリンク（target="\_blank"）

## React コンポーネント設計

### Message コンポーネント

```typescript
interface MessageProps {
  message: VillageMessage;
  userSettings: UserSettings;
  onAnchorClick: (anchor: string) => void;
  onReply: (message: VillageMessage) => void;
  onSecretChat: (participant: Participant) => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  userSettings,
  onAnchorClick,
  onReply,
  onSecretChat,
}) => {
  // 発言種別に応じたスタイリング
  const getMessageStyle = () => {
    switch (message.type) {
      case "NORMAL_SAY":
        return "bg-white text-black";
      case "WEREWOLF_SAY":
        return "bg-red-50 text-black";
      // ...
    }
  };

  // デコレーション変換
  const convertedContent = useMemo(() => {
    return convertToDecoratedText(escapeHtml(message.content));
  }, [message.content]);

  return (
    <div className={`message ${getMessageStyle()}`}>
      {/* ヘッダー */}
      {/* 本文 */}
      {/* フッター */}
    </div>
  );
};
```

## 注意事項

1. **セキュリティ**: XSS 対策のため必ずエスケープ処理を実施
2. **パフォーマンス**: メッセージ変換処理はメモ化して再計算を防ぐ
3. **アクセシビリティ**: スクリーンリーダー対応を考慮
4. **レスポンシブ**: モバイル表示時のレイアウト調整

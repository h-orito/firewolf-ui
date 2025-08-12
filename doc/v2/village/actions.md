# アクション機能仕様

## 概要

村画面における各種アクション機能（発言、入村、能力行使等）の仕様を定義します。

## 基本仕様

### 表示制御

- `SituationAsParticipant` の状態に応じて各アクションの表示/非表示を制御
- 各アクションは Panel コンポーネントで表示（開閉可能）
- 最大1つのパネルを画面最下部に固定表示可能

## アクション一覧

### 1. 発言機能

#### 表示条件
`situation.say` が存在する場合

#### UI構成

```
[参加者名（太字）]

発言種別: ○通常発言 ○囁き ○共鳴 ...

[デコレーションツールバー]
[B] [大] [小] [取消] [ルビ] [隠] [赤] [橙] [黄] [緑] [水] [青] [紫]

[キャラ画像] | [発言入力エリア]
             | 残り回数: 20/20, 行数: 1/20, 文字数: 0/200

[発言する]
```

#### 機能詳細

**発言種別選択**
- `say.selectable_message_type_list` から選択可能
- ラジオグループで実装

**デコレーション機能**

| ボタン | 機能 | 挿入テキスト |
|--------|------|-------------|
| B | 太字 | `[[b]]選択テキスト[[/b]]` |
| 大 | 文字を大きく | `[[large]]選択テキスト[[/large]]` |
| 小 | 文字を小さく | `[[small]]選択テキスト[[/small]]` |
| 取消 | 打ち消し線 | `[[s]]選択テキスト[[/s]]` |
| ルビ | ルビ | `[[ruby]]選択テキスト[[rt]][[/rt]][[/ruby]]` |
| 隠 | 隠し文字 | `[[cw]]選択テキスト[[/cw]]` |
| 赤〜紫 | 色指定 | `[[#カラーコード]]選択テキスト[[/#]]` |

**文字数カウンター**
- 残り回数: `最大回数 - 今日の発言回数`
- 行数: 改行数 + 1（最大20行）
- 文字数: 改行を除く文字数

**発言ボタン**
- 文字数1以上かつ制限内で活性化
- クリックで発言確認モーダル表示

### 2. 入村機能

#### 表示条件
`situation.participate` が存在し、まだ参加していない場合

#### UI構成

```
キャラクター: [選択] [画像で選択]
キャラ名: [________] (40文字以内)
略称: [_] (1文字)
第1希望: [役職選択]
第2希望: [役職選択]

入村発言:
[デコレーションツールバー]
[発言入力エリア]

[入村確認]
```

#### 機能詳細

- キャラ選択：ドロップダウンまたはビジュアル選択モーダル
- 役職希望：`situation.skill_request.selectable_skill_list` から選択
- 入村発言：最大20行200文字

### 3. 見学機能

入村とほぼ同じ仕様（`situation.spectate` が存在する場合）

### 4. 役職希望変更

#### 表示条件
`situation.skill_request.available_skill_request` が true

#### UI構成

```
第1希望: [現在の希望]
第2希望: [現在の希望]

[役職希望変更]
```

### 5. 退村機能

#### 表示条件
`situation.leave` が存在する場合

#### UI構成

```
[退村する]（danger ボタン）
```

確認ダイアログで「本当に退村しますか？」を表示

### 6. アクション発言

#### UI構成

```
対象: [参加者選択/全員]
内容: [自由入力]

[アクション発言する]
```

発言内容：`[{short_name}] {name}は、{対象}{内容}`

### 7. 名前変更

#### 表示条件
`situation.rp.is_available_change_name` が true

#### UI構成

```
名前: [現在の名前]
略称: [現在の略称]

[名前変更する]
```

### 8. 村建てメニュー

#### 表示条件
`situation.creator` のいずれかが true

#### 機能一覧

**村建て発言**
- 最大40行400文字
- デコレーション機能付き

**村設定変更**
- `/setting?id={village_id}` へのリンク

**強制退村**
- 参加者選択
- 確認ダイアログ表示

**廃村**
- 確認ダイアログ表示

**エピローグ延長**
- 確認ダイアログ表示

### 9. 管理メニュー

#### 表示条件
`situation.admin.admin` が true

#### UI構成

参加者ごとに以下を表示：
- キャラ名
- nickname
- twitter_user_name（リンク付き）
- 役職

### 10. 能力行使

#### 表示条件
`situation.ability.list` に `usable: true` の能力が存在

#### UI構成

```
[死亡アラート]（死亡時のみ）

役職説明: ...

襲撃担当者: [選択]（人狼系のみ）

現在の{能力名}先: なし
対象: [参加者選択]

[{能力名}セットする]
```

### 11. カミングアウト

#### UI構成

```
現在のカミングアウト: 村人と占い師

CO1: [役職選択/取り消す]
CO2: [役職選択/取り消す]

[カミングアウトする]
```

最大2役職まで選択可能

### 12. コミット（時短希望）

#### UI構成

```
現在の状態: 時短希望していません

[時短希望する/取り消す]
```

### 13. デバッグメニュー

開発環境でのみ表示される各種テスト機能：

- 参加させる（テストユーザー複数入村）
- ダミーログイン（特定プレイヤーでログイン）
- 突然死なしにする
- 日付を進める
- 100回発言する

## API 連携

### 主要エンドポイント

| アクション | エンドポイント |
|-----------|--------------|
| 発言 | `/village/{villageId}/say` |
| 発言確認 | `/village/{villageId}/say-confirm` |
| 入村 | `/village/{villageId}/participate` |
| 入村確認 | `/village/{villageId}/participate-confirm` |
| 退村 | `/village/{villageId}/leave` |
| 役職希望 | `/village/{villageId}/skill-request` |
| 名前変更 | `/village/{villageId}/change-name` |
| 能力行使 | `/village/{villageId}/ability` |
| カミングアウト | `/village/{villageId}/comingout` |
| コミット | `/village/{villageId}/commit` |

## React コンポーネント設計

### ActionPanel コンポーネント

```typescript
interface ActionPanelProps {
  title: string
  isFixed?: boolean
  onToggleFixed?: () => void
  children: React.ReactNode
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  title,
  isFixed,
  onToggleFixed,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="action-panel">
      <div className="panel-header">
        <button onClick={() => setIsOpen(!isOpen)}>
          {title}
        </button>
        {onToggleFixed && (
          <button onClick={onToggleFixed}>
            {isFixed ? '固定解除' : '固定表示'}
          </button>
        )}
      </div>
      {isOpen && (
        <div className="panel-content">
          {children}
        </div>
      )}
    </div>
  )
}
```

### SayAction コンポーネント

```typescript
const SayAction: React.FC = () => {
  const [messageType, setMessageType] = useState<MessageType>('NORMAL_SAY')
  const [content, setContent] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDecoration = (type: DecorationType) => {
    // デコレーション処理
  }

  const handleSubmit = async () => {
    const confirmed = await confirmSay({
      messageType,
      content
    })
    if (confirmed) {
      await say({ messageType, content })
    }
  }

  return (
    <ActionPanel title="発言">
      {/* 発言フォーム */}
    </ActionPanel>
  )
}
```

## 注意事項

1. **バリデーション**: クライアント側とサーバー側の両方で実施
2. **エラーハンドリング**: API エラー時の適切なフィードバック
3. **UX**: 操作の結果を明確にフィードバック
4. **アクセシビリティ**: キーボード操作、スクリーンリーダー対応
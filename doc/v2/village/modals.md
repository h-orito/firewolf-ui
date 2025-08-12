# モーダル仕様

## 概要

村画面で使用される各種モーダル（確認ダイアログ）の仕様を定義します。

## 発言確認モーダル

### 概要

発言前の最終確認と誤爆防止のためのモーダル

### UI構成

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
この内容で発言しますか？
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[メッセージプレビュー]
（実際の表示形式でプレビュー表示）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
誤爆防止確認
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

発言しようとしている種別を選択してください：

○ 通常発言
○ 人狼の囁き
○ 共鳴発言
○ 恋人発言
○ 見学発言
○ 独り言
○ 死者の呻き

[キャンセル] [発言する]
```

### 機能詳細

#### メッセージプレビュー

- 実際の表示形式（デコレーション適用済み）で表示
- 発言者名、キャラ画像を含む
- アンカー、返信、秘話ボタンは非表示

#### 誤爆防止確認

- 発言可能な種別をすべて表示
- 初期状態は未選択
- 正しい種別を選択した場合のみ「発言する」ボタンが活性化

### API連携

1. `/village/{villageId}/say-confirm` で確認情報取得
2. 確認後、`/village/{villageId}/say` で発言送信

## 入村確認モーダル

### 概要

入村前の規約同意と設定確認のためのモーダル

### UI構成

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
入村確認
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[キャラクター画像] [{short_name}] {name}
役職希望: {第1希望} / {第2希望}

[入村発言プレビュー]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
以下の項目をすべて確認してください
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 利用規約およびルールを確認し、禁止事項について理解しました。

□ 他者への礼節を欠いたり、正常な運営を妨げる行為を行った場合、
  管理人の裁量により処罰される可能性があることについて理解しました。

□ 発言可能時間および突然死の設定を確認し、進行中該当の時間に
  発言しなければ突然死してしまう可能性があることを理解しました。

[キャンセル] [入村する]
```

### 機能詳細

#### チェック項目

- すべてのチェックボックスにチェックが必要
- 「利用規約」クリックで利用規約モーダル表示
- 「ルール」クリックでルールページを別タブで開く

#### 入村ボタン

- すべてのチェック項目が選択されている場合のみ活性化

### API連携

1. `/village/{villageId}/participate-confirm` で確認情報取得
2. 確認後、`/village/{villageId}/participate` で入村

## キャラクター選択モーダル

### 概要

ビジュアルでキャラクターを選択するためのモーダル

### UI構成

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
キャラクター選択
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[キャラチップグループ選択タブ]

┌─────┬─────┬─────┬─────┐
│[画像]│[画像]│[画像]│[画像]│
│ 名前 │ 名前 │ 名前 │ 名前 │
├─────┼─────┼─────┼─────┤
│[画像]│[画像]│[画像]│[画像]│
│ 名前 │ 名前 │ 名前 │ 名前 │
└─────┴─────┴─────┴─────┘

選択中: {キャラクター名}

[キャンセル] [選択]
```

### 機能詳細

- グリッド表示でキャラクターを一覧表示
- 選択可能なキャラクターのみ表示（既に使用されているものは非表示またはdisabled）
- クリックで選択、ダブルクリックで選択して閉じる

## 汎用確認ダイアログ

### 概要

各種アクションの確認に使用する汎用ダイアログ

### 使用例

#### 退村確認

```
本当に退村しますか？

[キャンセル] [退村する]
```

#### 強制退村確認

```
{participant_name} を本当に強制退村させますか？

[キャンセル] [強制退村させる]
```

#### 廃村確認

```
本当に廃村にしますか？
この操作は取り消せません。

[キャンセル] [廃村にする]
```

#### カミングアウト確認

```
本当にカミングアウトしますか？
CO: {役職1}, {役職2}

[キャンセル] [カミングアウトする]
```

## React コンポーネント設計

### Modal コンポーネント

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
```

### SayConfirmModal コンポーネント

```typescript
interface SayConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  message: MessagePreview
  onConfirm: (selectedType: MessageType) => void
}

const SayConfirmModal: React.FC<SayConfirmModalProps> = ({
  isOpen,
  onClose,
  message,
  onConfirm
}) => {
  const [selectedType, setSelectedType] = useState<MessageType | null>(null)
  const [confirmData, setConfirmData] = useState<ConfirmData | null>(null)

  useEffect(() => {
    if (isOpen) {
      // API呼び出しで確認データ取得
      fetchConfirmData()
    }
  }, [isOpen])

  const handleConfirm = () => {
    if (selectedType === message.type) {
      onConfirm(selectedType)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="発言確認"
      footer={
        <>
          <button onClick={onClose}>キャンセル</button>
          <button 
            onClick={handleConfirm}
            disabled={selectedType !== message.type}
          >
            発言する
          </button>
        </>
      }
    >
      <div className="message-preview">
        {/* メッセージプレビュー */}
      </div>
      <div className="anti-misfire">
        <h3>誤爆防止確認</h3>
        <p>発言しようとしている種別を選択してください：</p>
        {/* ラジオボタングループ */}
      </div>
    </Modal>
  )
}
```

## スタイリング

### モーダルオーバーレイ

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
```

### モーダルコンテンツ

```css
.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## 注意事項

1. **アクセシビリティ**
   - ESC キーでモーダルを閉じる
   - フォーカストラップの実装
   - スクリーンリーダー対応

2. **UX**
   - モーダル表示時は背景スクロールを無効化
   - オーバーレイクリックで閉じる（重要な操作の場合は無効化）
   - アニメーション効果でスムーズな表示/非表示

3. **レスポンシブ**
   - モバイル表示時は全画面表示
   - タブレット以上は中央配置

4. **エラーハンドリング**
   - API エラー時の適切なエラー表示
   - ローディング状態の表示
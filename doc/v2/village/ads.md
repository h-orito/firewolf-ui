# 広告配置仕様

## 概要

村画面における Google AdSense 広告の配置と実装仕様を定義します。

## 広告配置位置

### 1. サイドバー広告

**配置位置**: 左側サイドバーの下部  
**広告タイプ**: ディスプレイ広告  
**サイズ**: 260x90px（固定）

#### 実装詳細

```html
<div class="slider-ads">
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  ></script>
  <!-- firewolf-slider -->
  <ins
    class="adsbygoogle"
    style="display:inline-block;width:260px;height:90px"
    data-ad-client="ca-pub-0917187897820609"
    data-ad-slot="2365194990"
  ></ins>
  <script>
    ;(adsbygoogle = window.adsbygoogle || []).push({})
  </script>
</div>
```

### 2. メインコンテンツ広告

**配置位置**: メインコンテンツエリアの発言欄下部  
**広告タイプ**: レスポンシブ広告（fluid）  
**レイアウト**: 自動調整

#### 実装詳細

```html
<div>
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  ></script>
  <ins
    class="adsbygoogle"
    style="display:block"
    data-ad-format="fluid"
    data-ad-layout-key="-hm-c+2i-1u-38"
    data-ad-client="ca-pub-0917187897820609"
    data-ad-slot="5122687444"
  ></ins>
  <script>
    ;(adsbygoogle = window.adsbygoogle || []).push({})
  </script>
</div>
```

## React コンポーネント実装

### GoogleAdsense コンポーネント

```typescript
interface GoogleAdsenseProps {
  type: 'sidebar' | 'main-content'
}

const GoogleAdsense: React.FC<GoogleAdsenseProps> = ({ type }) => {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  if (type === 'sidebar') {
    return (
      <div className="slider-ads">
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: 260, height: 90 }}
          data-ad-client="ca-pub-0917187897820609"
          data-ad-slot="2365194990"
        />
      </div>
    )
  }

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-hm-c+2i-1u-38"
        data-ad-client="ca-pub-0917187897820609"
        data-ad-slot="5122687444"
      />
    </div>
  )
}
```

## レスポンシブ対応

### モバイル表示

- サイドバー広告はモバイル時にハンバーガーメニュー内に配置
- メインコンテンツ広告は fluid 設定により自動調整

### タブレット表示

- サイドバー広告は表示領域に応じて配置
- メインコンテンツ広告は fluid 設定により自動調整

## 注意事項

1. **広告ブロッカー対策**
   - 広告がブロックされた場合でもレイアウトが崩れないよう配慮
   - エラーハンドリングの実装

2. **パフォーマンス**
   - 非同期読み込みによるページ表示速度への影響を最小化
   - 広告読み込みの遅延による UI のガタつき防止

3. **ユーザビリティ**
   - 広告とコンテンツの明確な区別
   - 誤クリック防止のための適切な余白確保

4. **Next.js での実装**
   - Script コンポーネントを使用した AdSense スクリプトの読み込み
   - SSR 環境での適切な処理

## テスト

1. 広告が正しく表示されることを確認
2. レスポンシブ時の表示確認
3. 広告ブロッカー使用時のレイアウト確認
4. ページ読み込み速度への影響測定
<template>
  <div />
</template>

<script setup lang="ts">
// Environment check
const isProduction = computed(() => {
  return process.env.NODE_ENV === 'production'
})

/**
 * Google Adsスクリプトを遅延読み込み
 * ユーザーインタラクション後または一定時間後に読み込むことでLCPを改善
 */
const loadGoogleAds = () => {
  // 既に読み込み済みの場合はスキップ
  if (document.querySelector('script[data-ad-client]')) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  script.setAttribute('data-ad-client', 'ca-pub-0917187897820609')
  // crossoriginを追加してCORS対応
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

// Load Google Ads script when component mounts in production
// 遅延読み込みでLCP/FIDを改善
onMounted(() => {
  if (isProduction.value && import.meta.client) {
    // requestIdleCallbackがサポートされている場合は使用
    // ブラウザのアイドル時間に読み込むことでメインスレッドをブロックしない
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        () => {
          loadGoogleAds()
        },
        { timeout: 3000 } // 最大3秒待機
      )
    } else {
      // フォールバック: 2秒後に読み込み
      setTimeout(loadGoogleAds, 2000)
    }
  }
})
</script>

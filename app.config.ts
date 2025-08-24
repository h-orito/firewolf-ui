export default defineAppConfig({
  ui: {
    // 既存Bulma色の@nuxt/ui v3マッピング
    colors: {
      primary: 'blue', // カスタム #3991f4 (CSS変数で上書き)
      info: 'cyan', // #209cee
      success: 'green', // #23d160
      warning: 'yellow', // #ffdd57
      error: 'red', // #ff3860
      neutral: 'slate'
    },
    // Toaster設定
    toaster: {
      position: 'top-right',
      duration: 4000, // 4秒で自動消去
      expand: true // ホバー時の展開有効
    },
    // アイコン設定
    icons: {
      close: 'i-lucide-x'
    }
  }
})

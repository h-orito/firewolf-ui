export default defineAppConfig({
  ui: {
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

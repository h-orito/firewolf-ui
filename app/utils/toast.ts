/**
 * Toast通知のユーティリティ
 *
 * 旧村Toast機能をNuxt UIのtoast機能で再実装
 * 使用例:
 * - showInfoToast('情報メッセージ')
 * - showSuccessToast('成功メッセージ')
 * - showErrorToast('エラーメッセージ')
 */

export const showInfoToast = (message: string) => {
  const toast = useToast()
  toast.add({
    title: '情報',
    description: message,
    color: 'primary',
    icon: 'i-lucide-info'
  })
}

export const showSuccessToast = (message: string) => {
  const toast = useToast()
  toast.add({
    title: '成功',
    description: message,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

export const showErrorToast = (message: string) => {
  const toast = useToast()
  toast.add({
    title: 'エラー',
    description: message,
    color: 'error',
    icon: 'i-lucide-alert-circle'
  })
}

/**
 * 旧村Toast互換インターフェース
 *
 * 旧コードでの村Toast使用パターンを継続使用するための
 * 互換性レイヤー。段階的にnewインターフェースに移行することを推奨。
 */
export const villageToast = {
  info: (message: string) => showInfoToast(message),
  success: (message: string) => showSuccessToast(message),
  danger: (message: string) => showErrorToast(message)
}

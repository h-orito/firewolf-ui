/**
 * Toast通知のユーティリティ
 *
 * TODO: 独自のtoast実装を追加する
 * 現在は console.log でデバッグ出力のみ
 *
 * 使用例:
 * - showInfoToast('情報メッセージ')
 * - showSuccessToast('成功メッセージ')
 * - showErrorToast('エラーメッセージ')
 */

export const showInfoToast = (message: string) => {
  // TODO: 独自のtoast UIを実装
  console.info('[Toast Info]', message)
}

export const showSuccessToast = (message: string) => {
  // TODO: 独自のtoast UIを実装
  console.info('[Toast Success]', message)
}

export const showErrorToast = (message: string) => {
  // TODO: 独自のtoast UIを実装
  console.error('[Toast Error]', message)
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

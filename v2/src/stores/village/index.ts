/**
 * 村画面の状態管理エントリーポイント
 *
 * 各ストアの統合管理と初期化処理を提供
 */

// ストアのエクスポート
export { useVillageStore, initializeVillageState, resetVillageState } from './villageStore'
export {
  useMessageFilterStore,
  initializeMessageFilterFromUrl,
  isDefaultFilterState,
  getFilterUrlParams,
} from './message-filter-store'
export { useUserSettingsStore, exportUserSettings, importUserSettings } from './user-settings-store'
export {
  useMemoStore,
  createMemoSafe,
  updateMemoSafe,
  deleteMemoSafe,
  exportMemos,
  importMemos,
  getSortedMemos,
  searchMemos,
} from './memoStore'

// 初期化関数
import { initializeVillageState, resetVillageState } from './villageStore'
import { initializeMessageFilterFromUrl } from './message-filter-store'

/**
 * 村画面の状態初期化
 *
 * 設計方針に基づく初期化：
 * - フィルタ・日付状態は永続化しない（デフォルト状態から開始）
 * - ユーザー設定・メモのみ永続化された値を復元（Zustand persistが自動実行）
 * - URLパラメータでの初期化をサポート
 */
export const initializeVillageStores = (params: {
  villageId: number
  initialDay?: number
  // URLパラメータからのフィルタ初期化
  participantId?: number
  keyword?: string
  onlyToMe?: boolean
}) => {
  // 村基本情報の初期化
  initializeVillageState(params.villageId, params.initialDay)

  // URLパラメータからのフィルタ初期化
  if (params.participantId || params.keyword || params.onlyToMe !== undefined) {
    initializeMessageFilterFromUrl({
      participantId: params.participantId,
      keyword: params.keyword,
      onlyToMe: params.onlyToMe,
    })
  }
}

/**
 * 村画面離脱時のクリーンアップ
 *
 * セッション状態をリセット：
 * - 村基本情報のリセット
 * - フィルタ状態のリセット
 * - 永続化されている設定（ユーザー設定・メモ）は維持
 */
export const cleanupVillageStores = () => {
  // 村基本情報のリセット
  resetVillageState()

  // フィルタ状態のリセット
  const { reset: resetMessageFilter } =
    require('./message-filter-store').useMessageFilterStore.getState()
  resetMessageFilter()
}

/**
 * 別タブでの村画面オープン時の初期化
 * 各タブが独立した状態を持つように設計
 */
export const initializeNewTabVillageStores = (params: {
  villageId: number
  initialDay?: number
  participantId?: number
  keyword?: string
  onlyToMe?: boolean
}) => {
  // 既存の状態をリセットしてから初期化
  cleanupVillageStores()
  initializeVillageStores(params)
}

/**
 * ストアの健全性チェック
 * 開発時やデバッグ時に状態の確認に使用
 */
export const validateStoreState = (): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  // 村ストアの検証
  const villageState = require('./villageStore').useVillageStore.getState()
  if (!villageState.villageId || villageState.villageId <= 0) {
    errors.push('Village ID is not set or invalid')
  }
  if (villageState.currentDay <= 0) {
    errors.push('Current day is invalid')
  }

  // メモストアの検証
  const memoState = require('./memoStore').useMemoStore.getState()
  if (memoState.memos.length > 3) {
    errors.push('Too many memos (max 3 allowed)')
  }

  // ユーザー設定の検証
  const userSettingsState = require('./userSettingsStore').useUserSettingsStore.getState()
  if (
    userSettingsState.display.messagesPerPage < 10 ||
    userSettingsState.display.messagesPerPage > 200
  ) {
    errors.push('Messages per page is out of valid range (10-200)')
  }
  if (
    userSettingsState.operation.autoUpdateInterval < 10 ||
    userSettingsState.operation.autoUpdateInterval > 300
  ) {
    errors.push('Auto update interval is out of valid range (10-300 seconds)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * ストア状態のデバッグ情報取得
 * 開発時のデバッグに使用
 */
export const getStoreDebugInfo = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return {
    village: require('./villageStore').useVillageStore.getState(),
    messageFilter: require('./message-filter-store').useMessageFilterStore.getState(),
    userSettings: require('./user-settings-store').useUserSettingsStore.getState(),
    memo: require('./memoStore').useMemoStore.getState(),
    validation: validateStoreState(),
  }
}

/**
 * 全ストアのリセット（テスト用）
 * E2Eテストや開発時のリセットに使用
 */
export const resetAllStores = () => {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    console.warn('resetAllStores should only be used in development or test environment')
    return
  }

  // 各ストアのリセット
  require('./villageStore').useVillageStore.getState().reset()
  require('./message-filter-store').useMessageFilterStore.getState().reset()
  require('./user-settings-store').useUserSettingsStore.getState().resetAll()
  require('./memoStore').useMemoStore.getState().clearAllMemos()
}

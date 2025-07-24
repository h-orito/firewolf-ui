/**
 * 村のステータス定数
 * API仕様に基づく正しい値を定義
 */
export const VILLAGE_STATUS = {
  /** プロローグ */
  PROLOGUE: 'PROLOGUE',
  /** 進行中 */
  IN_PROGRESS: 'IN_PROGRESS',
  /** エピローグ */
  EPILOGUE: 'EPILOGUE',
  /** 終了 */
  COMPLETED: 'COMPLETED',
  /** 廃村 */
  CANCEL: 'CANCEL',
} as const

export type VillageStatus = (typeof VILLAGE_STATUS)[keyof typeof VILLAGE_STATUS]

/**
 * よく使用される村ステータスの組み合わせ
 */
/**
 * 村ステータスの表示ラベル
 */
export const VILLAGE_STATUS_LABELS = {
  [VILLAGE_STATUS.PROLOGUE]: 'プロローグ',
  [VILLAGE_STATUS.IN_PROGRESS]: '進行中',
  [VILLAGE_STATUS.EPILOGUE]: 'エピローグ',
  [VILLAGE_STATUS.COMPLETED]: '終了',
  [VILLAGE_STATUS.CANCEL]: '廃村',
} as const

/**
 * 村ステータスの選択肢（フィルター用）
 */
export const VILLAGE_STATUS_OPTIONS = [
  { value: VILLAGE_STATUS.PROLOGUE, label: VILLAGE_STATUS_LABELS[VILLAGE_STATUS.PROLOGUE] },
  { value: VILLAGE_STATUS.IN_PROGRESS, label: VILLAGE_STATUS_LABELS[VILLAGE_STATUS.IN_PROGRESS] },
  { value: VILLAGE_STATUS.EPILOGUE, label: VILLAGE_STATUS_LABELS[VILLAGE_STATUS.EPILOGUE] },
  { value: VILLAGE_STATUS.COMPLETED, label: VILLAGE_STATUS_LABELS[VILLAGE_STATUS.COMPLETED] },
  { value: VILLAGE_STATUS.CANCEL, label: VILLAGE_STATUS_LABELS[VILLAGE_STATUS.CANCEL] },
] as const

/**
 * よく使用される村ステータスの組み合わせ
 */
export const VILLAGE_STATUS_GROUPS = {
  /** 開催中の村（プロローグ、進行中、エピローグ） */
  ACTIVE: [VILLAGE_STATUS.PROLOGUE, VILLAGE_STATUS.IN_PROGRESS, VILLAGE_STATUS.EPILOGUE],
  /** 完了した村（エピローグ、終了） */
  FINISHED: [VILLAGE_STATUS.EPILOGUE, VILLAGE_STATUS.COMPLETED],
  /** 全ての村 */
  ALL: [
    VILLAGE_STATUS.PROLOGUE,
    VILLAGE_STATUS.IN_PROGRESS,
    VILLAGE_STATUS.EPILOGUE,
    VILLAGE_STATUS.COMPLETED,
    VILLAGE_STATUS.CANCEL,
  ],
} as const

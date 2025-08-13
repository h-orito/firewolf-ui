/**
 * 村画面関連の型定義
 * 村画面の状態管理、UI、アクション等で使用される型を一元管理
 */

import { VillageStatus } from './village-status'

// =============================================================================
// 基本的な村画面の状態管理型
// =============================================================================

/**
 * 村画面の基本状態
 */
export interface VillageState {
  /** 村ID */
  villageId: number
  /** 現在表示している日 */
  currentDay: number
  /** サイドバーの開閉状態 */
  isSidebarOpen: boolean
}

/**
 * メッセージフィルタの状態
 * 各タブで独立したセッション状態を持つ（永続化なし）
 */
export interface MessageFilterState {
  /** 発言種別フィルタ（11種類の発言種別） */
  messageTypes: {
    normalSay: boolean
    werewolfSay: boolean
    sympathizeSay: boolean
    graveSay: boolean
    monologueSay: boolean
    spectateSay: boolean
    systemMessage: boolean
    privateSystem: boolean
    participantMessage: boolean
    psychicMessage: boolean
    hunterMessage: boolean
  }
  /** 発言者フィルタ */
  participants: {
    selectedParticipantIds: number[]
    /** 個人抽出モード */
    isPersonalExtraction: boolean
    /** 個人抽出の対象ID */
    personalExtractionTargetId?: number
  }
  /** 宛先フィルタ */
  target: {
    /** 私宛のみ表示 */
    onlyToMe: boolean
  }
  /** キーワード検索 */
  keyword: string
}

/**
 * ユーザー設定（Cookie保存対象）
 */
export interface UserSettings {
  /** 表示設定 */
  display: DisplaySettings
  /** 操作設定 */
  operation: OperationSettings
  /** Webhook設定 */
  webhook: WebhookSettings
}

/**
 * 表示設定
 */
export interface DisplaySettings {
  /** キャラクターアイコン表示 */
  showCharacterIcon: boolean
  /** 発言時刻表示 */
  showTimestamp: boolean
  /** 発言番号表示 */
  showMessageNumber: boolean
  /** システムメッセージ表示 */
  showSystemMessage: boolean
  /** 1ページあたりの発言数 */
  messagesPerPage: number
  /** テーマ設定 */
  theme: 'light' | 'dark' | 'auto'
}

/**
 * 操作設定
 */
export interface OperationSettings {
  /** アンカークリック時の動作 */
  anchorClickAction: 'paste' | 'copy'
  /** 発言確認ダイアログ表示 */
  showConfirmDialog: boolean
  /** 自動更新間隔（秒） */
  autoUpdateInterval: number
  /** パネル固定表示 */
  fixedActionPanel: boolean
}

/**
 * Webhook設定
 */
export interface WebhookSettings {
  /** Webhook URL */
  webhookUrl?: string
  /** 通知対象の発言種別 */
  notificationTypes: string[]
  /** 通知対象のキーワード */
  keywords: string[]
}

/**
 * メモの状態（最大3個、Cookie保存）
 */
export interface MemoState {
  memos: Memo[]
}

export interface Memo {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// =============================================================================
// 発言・メッセージ関連の型
// =============================================================================

/**
 * 発言種別（11種類の発言種別に対応）
 */
export type MessageType =
  | 'NORMAL_SAY' // 通常発言
  | 'WEREWOLF_SAY' // 人狼の囁き
  | 'SYMPATHIZE_SAY' // 共鳴発言
  | 'GRAVE_SAY' // 死者の呻き
  | 'MONOLOGUE_SAY' // 独り言
  | 'SPECTATE_SAY' // 見学発言
  | 'ACTION_SAY' // アクション発言
  | 'SYSTEM_MESSAGE' // システムメッセージ
  | 'PRIVATE_SYSTEM' // プライベートシステムメッセージ
  | 'PARTICIPANTS' // 参加者メッセージ
  | 'PSYCHIC_MESSAGE' // 占い結果
  | 'HUNTER_MESSAGE' // 狩人メッセージ

/**
 * デコレーション種別（11種類の装飾に対応）
 */
export type DecorationType =
  | 'BOLD' // 太字
  | 'ITALIC' // 斜体
  | 'STRIKE' // 取り消し線
  | 'COLOR_RED' // 赤文字
  | 'COLOR_BLUE' // 青文字
  | 'COLOR_GREEN' // 緑文字
  | 'SIZE_LARGE' // 大文字
  | 'SIZE_SMALL' // 小文字
  | 'RAINBOW' // レインボー
  | 'STRONG' // 強調
  | 'SECRET' // 秘密

/**
 * アンカー種別（7種類のアンカー形式）
 */
export type AnchorType =
  | 'MESSAGE_ANCHOR' // 発言アンカー >>123
  | 'PARTICIPANT_ANCHOR' // 参加者アンカー @ニックネーム
  | 'DAY_ANCHOR' // 日付アンカー #1日目
  | 'TIME_ANCHOR' // 時刻アンカー [HH:MM]
  | 'URL_ANCHOR' // URLアンカー
  | 'SKILL_ANCHOR' // 役職アンカー
  | 'CHARACTER_ANCHOR' // キャラクターアンカー

// =============================================================================
// アクション・権限関連の型
// =============================================================================

/**
 * 参加者としての状況（権限ベース表示制御用）
 */
export interface SituationAsParticipant {
  /** 発言可能な種別リスト */
  availableSayTypes: MessageType[]
  /** 投票可能かどうか */
  canVote: boolean
  /** 能力行使可能かどうか */
  canUseAbility: boolean
  /** コミット可能かどうか */
  canCommit: boolean
  /** 退村可能かどうか */
  canLeave: boolean
  /** 名前変更可能かどうか */
  canChangeName: boolean
  /** 役職希望変更可能かどうか */
  canChangeSkillRequest: boolean
  /** カミングアウト可能かどうか */
  canComingOut: boolean
  /** 村建て権限があるかどうか */
  isCreator: boolean
  /** 管理権限があるかどうか */
  isAdmin: boolean
}

/**
 * アクション種別
 */
export type ActionType =
  | 'SAY' // 発言
  | 'PARTICIPATE' // 入村
  | 'SPECTATE' // 見学
  | 'LEAVE' // 退村
  | 'VOTE' // 投票
  | 'ABILITY' // 能力行使
  | 'COMMIT' // コミット
  | 'CHANGE_NAME' // 名前変更
  | 'SKILL_REQUEST' // 役職希望
  | 'COMING_OUT' // カミングアウト
  | 'CREATOR_ACTION' // 村建てアクション
  | 'ADMIN_ACTION' // 管理アクション

// =============================================================================
// UI状態関連の型
// =============================================================================

/**
 * モーダルの種別
 */
export type ModalType =
  | 'MESSAGE_FILTER' // 発言抽出モーダル
  | 'MESSAGE_CONFIRM' // 発言確認モーダル
  | 'PARTICIPATE_CONFIRM' // 入村確認モーダル
  | 'CHARACTER_SELECT' // キャラクター選択モーダル
  | 'VILLAGE_SETTINGS' // 村設定表示モーダル
  | 'USER_SETTINGS' // ユーザー設定モーダル
  | 'LEAVE_CONFIRM' // 退村確認モーダル
  | 'VILLAGE_CANCEL_CONFIRM' // 廃村確認モーダル

/**
 * タブ種別（発言抽出での別タブ対応）
 */
export type TabType = 'SAME_TAB' | 'NEW_TAB'

/**
 * ページネーション状態
 */
export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

/**
 * 無限スクロール状態
 */
export interface InfiniteScrollState {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
}

// =============================================================================
// API関連の型（将来的にAPI型定義から生成される想定）
// =============================================================================

/**
 * 村情報（API応答）
 */
export interface Village {
  id: number
  name: string
  status: VillageStatus
  dayCount: number
  participantCount: number
  capacity: number
  creator: {
    id: number
    name: string
  }
  settings: VillageSettings
  createdAt: Date
  updatedAt: Date
}

/**
 * 村設定
 */
export interface VillageSettings {
  /** キャラクターチップID */
  charachipId: number
  /** 組織設定 */
  organization: string
  /** 役職構成 */
  skillComposition: Record<string, number>
  /** 時間設定 */
  timeSettings: {
    startDatetime?: Date
    dayChangeIntervalSeconds: number
    voteTimeIntervalSeconds?: number
  }
  /** 参加設定 */
  participantSettings: {
    password?: string
    isDummyCharacterDisabled: boolean
  }
  /** RP設定 */
  rpSettings: {
    isOriginalCharacterDisabled: boolean
  }
  /** 発言制限設定 */
  messageRestrictions: {
    normalSayMaxLength: number
    normalSayMaxLengthPerDay: number
    werewolfSayMaxLength: number
    // ... 他の発言種別の制限
  }
  /** ルール設定 */
  ruleSettings: {
    availableSkillRequests: string[]
    allowSkillRequestChange: boolean
    // ... 他のルール設定
  }
}

/**
 * 参加者情報
 */
export interface Participant {
  id: number
  name: string
  characterName: string
  characterImageUrl: string
  isAlive: boolean
  skill?: {
    name: string
    shortName: string
  }
  skillRequest?: {
    first: string
    second: string
  }
  lastAccessDatetime?: Date
  comingOuts: string[]
  memo?: string
}

/**
 * 発言情報
 */
export interface Message {
  id: number
  type: MessageType
  content: string
  participantId?: number
  participantName?: string
  characterName?: string
  characterImageUrl?: string
  day: number
  datetime: Date
  messageNumber: number
  isConverted: boolean
}

// =============================================================================
// リアルタイム更新関連の型
// =============================================================================

/**
 * リアルタイム更新の間隔設定
 */
export interface RealtimeUpdateIntervals {
  /** 残り時間更新間隔（秒） */
  remainingTime: number
  /** 新着発言確認間隔（秒） */
  newMessages: number
  /** 村情報更新間隔（秒） */
  villageInfo: number
}

/**
 * 残り時間情報
 */
export interface RemainingTime {
  /** 次の日時変更までの残り秒数 */
  untilNextDay: number
  /** 投票締切までの残り秒数 */
  untilVoteDeadline?: number
  /** 更新日時 */
  updatedAt: Date
}

// =============================================================================
// エラーハンドリング関連の型
// =============================================================================

/**
 * 村画面でのエラー種別
 */
export type VillageErrorType =
  | 'VILLAGE_NOT_FOUND' // 村が見つからない
  | 'PARTICIPANT_NOT_FOUND' // 参加者が見つからない
  | 'PERMISSION_DENIED' // 権限なし
  | 'MESSAGE_POST_FAILED' // 発言投稿失敗
  | 'NETWORK_ERROR' // ネットワークエラー
  | 'SERVER_ERROR' // サーバーエラー
  | 'VALIDATION_ERROR' // バリデーションエラー

/**
 * 村画面でのエラー情報
 */
export interface VillageError {
  type: VillageErrorType
  message: string
  detail?: string
  timestamp: Date
}

// =============================================================================
// パフォーマンス最適化関連の型
// =============================================================================

/**
 * 仮想化設定
 */
export interface VirtualizationConfig {
  /** 仮想化を有効にするアイテム数の閾値 */
  threshold: number
  /** アイテムの高さ */
  itemHeight: number
  /** バッファサイズ */
  bufferSize: number
}

/**
 * メモ化設定
 */
export interface MemoizationConfig {
  /** メッセージアイテムのメモ化 */
  messageItem: boolean
  /** 参加者アイテムのメモ化 */
  participantItem: boolean
  /** フィルタ結果のメモ化 */
  filterResults: boolean
}

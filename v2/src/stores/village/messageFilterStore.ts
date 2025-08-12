import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MessageFilterState } from '@/types/village'

interface MessageFilterStoreState extends MessageFilterState {
  // Actions
  setMessageTypeFilter: (type: keyof MessageFilterState['messageTypes'], enabled: boolean) => void
  toggleMessageTypeFilter: (type: keyof MessageFilterState['messageTypes']) => void
  setAllMessageTypes: (enabled: boolean) => void
  toggleAllMessageTypes: () => void

  setSelectedParticipants: (participantIds: number[]) => void
  addSelectedParticipant: (participantId: number) => void
  removeSelectedParticipant: (participantId: number) => void
  clearSelectedParticipants: () => void

  setPersonalExtraction: (isPersonalExtraction: boolean, targetId?: number) => void

  setOnlyToMe: (onlyToMe: boolean) => void

  setKeyword: (keyword: string) => void

  resetToDefaults: () => void
  reset: () => void
}

/**
 * デフォルトのフィルタ状態（最新日・全フィルタON）
 */
const getDefaultState = (): MessageFilterState => ({
  messageTypes: {
    normalSay: true,
    werewolfSay: true,
    sympathizeSay: true,
    graveSay: true,
    monologueSay: true,
    spectateSay: true,
    systemMessage: true,
    privateSystem: true,
    participantMessage: true,
    psychicMessage: true,
    hunterMessage: true,
  },
  participants: {
    selectedParticipantIds: [],
    isPersonalExtraction: false,
    personalExtractionTargetId: undefined,
  },
  target: {
    onlyToMe: false,
  },
  keyword: '',
})

/**
 * メッセージフィルタの状態を管理するストア
 *
 * 重要な設計方針：
 * - 永続化は行わない（別タブ独立性のため）
 * - 各タブはデフォルト状態から開始（最新日・全フィルタON）
 * - URLパラメータでの初期化をサポート（個人抽出・日付指定）
 * - セッション内での状態保持（同一画面内での操作結果を保持）
 */
export const useMessageFilterStore = create<MessageFilterStoreState>()(
  devtools(
    (set, get) => ({
      // Initial State (デフォルト状態)
      ...getDefaultState(),

      // Message Type Filter Actions
      setMessageTypeFilter: (type, enabled) => {
        set(
          (state) => ({
            messageTypes: {
              ...state.messageTypes,
              [type]: enabled,
            },
          }),
          false,
          'messageFilter/setMessageTypeFilter'
        )
      },

      toggleMessageTypeFilter: (type) => {
        set(
          (state) => ({
            messageTypes: {
              ...state.messageTypes,
              [type]: !state.messageTypes[type],
            },
          }),
          false,
          'messageFilter/toggleMessageTypeFilter'
        )
      },

      setAllMessageTypes: (enabled) => {
        set(
          (state) => ({
            messageTypes: Object.keys(state.messageTypes).reduce(
              (acc, key) => ({
                ...acc,
                [key]: enabled,
              }),
              state.messageTypes
            ),
          }),
          false,
          'messageFilter/setAllMessageTypes'
        )
      },

      toggleAllMessageTypes: () => {
        const { messageTypes } = get()
        const allEnabled = Object.values(messageTypes).every(Boolean)
        get().setAllMessageTypes(!allEnabled)
      },

      // Participant Filter Actions
      setSelectedParticipants: (selectedParticipantIds) => {
        set(
          (state) => ({
            participants: {
              ...state.participants,
              selectedParticipantIds,
            },
          }),
          false,
          'messageFilter/setSelectedParticipants'
        )
      },

      addSelectedParticipant: (participantId) => {
        set(
          (state) => {
            const { selectedParticipantIds } = state.participants
            if (selectedParticipantIds.includes(participantId)) {
              return state // 既に選択済みの場合は何もしない
            }
            return {
              participants: {
                ...state.participants,
                selectedParticipantIds: [...selectedParticipantIds, participantId],
              },
            }
          },
          false,
          'messageFilter/addSelectedParticipant'
        )
      },

      removeSelectedParticipant: (participantId) => {
        set(
          (state) => ({
            participants: {
              ...state.participants,
              selectedParticipantIds: state.participants.selectedParticipantIds.filter(
                (id) => id !== participantId
              ),
            },
          }),
          false,
          'messageFilter/removeSelectedParticipant'
        )
      },

      clearSelectedParticipants: () => {
        set(
          (state) => ({
            participants: {
              ...state.participants,
              selectedParticipantIds: [],
            },
          }),
          false,
          'messageFilter/clearSelectedParticipants'
        )
      },

      // Personal Extraction Actions
      setPersonalExtraction: (isPersonalExtraction, personalExtractionTargetId) => {
        set(
          (state) => ({
            participants: {
              ...state.participants,
              isPersonalExtraction,
              personalExtractionTargetId: isPersonalExtraction
                ? personalExtractionTargetId
                : undefined,
            },
          }),
          false,
          'messageFilter/setPersonalExtraction'
        )
      },

      // Target Filter Actions
      setOnlyToMe: (onlyToMe) => {
        set(
          (state) => ({
            target: {
              ...state.target,
              onlyToMe,
            },
          }),
          false,
          'messageFilter/setOnlyToMe'
        )
      },

      // Keyword Filter Actions
      setKeyword: (keyword) => {
        set({ keyword }, false, 'messageFilter/setKeyword')
      },

      // Reset Actions
      resetToDefaults: () => {
        set(getDefaultState(), false, 'messageFilter/resetToDefaults')
      },

      reset: () => {
        set(getDefaultState(), false, 'messageFilter/reset')
      },
    }),
    {
      name: 'message-filter-store',
    }
  )
)

/**
 * URLパラメータからフィルタ状態を初期化するヘルパー関数
 * 個人抽出や日付指定での直接アクセスに対応
 */
export const initializeMessageFilterFromUrl = (params: {
  participantId?: number
  keyword?: string
  onlyToMe?: boolean
}) => {
  const { setPersonalExtraction, setKeyword, setOnlyToMe } = useMessageFilterStore.getState()

  // 個人抽出の初期化
  if (params.participantId) {
    setPersonalExtraction(true, params.participantId)
  }

  // キーワード検索の初期化
  if (params.keyword) {
    setKeyword(params.keyword)
  }

  // 私宛のみフィルタの初期化
  if (params.onlyToMe !== undefined) {
    setOnlyToMe(params.onlyToMe)
  }
}

/**
 * 現在のフィルタ条件が全てデフォルト状態かどうかを判定
 */
export const isDefaultFilterState = (): boolean => {
  const state = useMessageFilterStore.getState()
  const defaultState = getDefaultState()

  // メッセージタイプフィルタの比較
  const messageTypesMatch = Object.keys(defaultState.messageTypes).every(
    (key) =>
      state.messageTypes[key as keyof typeof state.messageTypes] ===
      defaultState.messageTypes[key as keyof typeof defaultState.messageTypes]
  )

  // 参加者フィルタの比較
  const participantsMatch =
    state.participants.selectedParticipantIds.length === 0 &&
    !state.participants.isPersonalExtraction &&
    state.participants.personalExtractionTargetId === undefined

  // その他フィルタの比較
  const otherMatch = !state.target.onlyToMe && state.keyword === ''

  return messageTypesMatch && participantsMatch && otherMatch
}

/**
 * 現在のフィルタ設定をURLパラメータ用のオブジェクトに変換
 */
export const getFilterUrlParams = (): Record<string, string> => {
  const state = useMessageFilterStore.getState()
  const params: Record<string, string> = {}

  // 個人抽出
  if (state.participants.isPersonalExtraction && state.participants.personalExtractionTargetId) {
    params.participant = state.participants.personalExtractionTargetId.toString()
  }

  // キーワード検索
  if (state.keyword) {
    params.keyword = state.keyword
  }

  // 私宛のみ
  if (state.target.onlyToMe) {
    params.onlyToMe = 'true'
  }

  return params
}

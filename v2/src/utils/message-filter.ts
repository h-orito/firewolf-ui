/**
 * メッセージフィルタリング用ユーティリティ
 */

import type { components } from '@/types/generated/api'
import type { MessageFilterState } from '@/types/village'

type MessageView = components['schemas']['MessageView']
type MessageType = components['schemas']['MessageType']

/**
 * メッセージタイプのマッピング
 * ストアの型名とAPIの型名（コード）を対応させる
 */
const MESSAGE_TYPE_MAP: Record<keyof MessageFilterState['messageTypes'], string[]> = {
  normalSay: ['NORMAL_SAY'],
  werewolfSay: ['WEREWOLF_SAY'],
  sympathizeSay: ['SYMPATHIZE_SAY'],
  graveSay: ['GRAVE_SAY'],
  monologueSay: ['MONOLOGUE_SAY'],
  spectateSay: ['SPECTATE_SAY'],
  systemMessage: [
    'PUBLIC_SYSTEM',
    'SECRET_SAY', // 秘話もシステムメッセージとして扱う
    'ACTION', // アクションメッセージ
  ],
  privateSystem: [
    'PRIVATE_SEER',
    'PRIVATE_PSYCHIC',
    'PRIVATE_CORONER',
    'PRIVATE_GURU',
    'PRIVATE_WISE',
  ],
  participantMessage: ['PARTICIPANTS'],
  psychicMessage: ['PRIVATE_PSYCHIC'],
  hunterMessage: ['PRIVATE_WISE'],
}

/**
 * フィルタ状態に基づいてメッセージをフィルタリングする
 *
 * @param messages フィルタリング対象のメッセージ配列
 * @param filterState フィルタ状態
 * @param currentUserId 現在のユーザーID（私宛のみフィルタで使用）
 * @returns フィルタリングされたメッセージ配列
 */
export const filterMessages = (
  messages: MessageView[],
  filterState: MessageFilterState,
  currentUserId?: number
): MessageView[] => {
  return messages.filter((message) => {
    // 1. メッセージタイプフィルタ
    if (!isMessageTypeAllowed(message, filterState.messageTypes)) {
      return false
    }

    // 2. 発言者フィルタ
    if (!isParticipantAllowed(message, filterState.participants)) {
      return false
    }

    // 3. 私宛のみフィルタ
    if (filterState.target.onlyToMe && currentUserId) {
      if (!isMessageToMe(message, currentUserId)) {
        return false
      }
    }

    // 4. キーワードフィルタ
    if (filterState.keyword) {
      if (!containsKeyword(message, filterState.keyword)) {
        return false
      }
    }

    return true
  })
}

/**
 * メッセージタイプがフィルタで許可されているかチェック
 */
const isMessageTypeAllowed = (
  message: MessageView,
  messageTypeFilters: MessageFilterState['messageTypes']
): boolean => {
  const messageTypeCode = message.content.type.code

  // MESSAGE_TYPE_MAPから該当するフィルタキーを探す
  for (const [filterKey, allowedTypeCodes] of Object.entries(MESSAGE_TYPE_MAP)) {
    if (allowedTypeCodes.includes(messageTypeCode)) {
      // 該当するフィルタキーがONかチェック
      return messageTypeFilters[filterKey as keyof MessageFilterState['messageTypes']]
    }
  }

  // マッピングにないタイプは表示する（安全側に倒す）
  return true
}

/**
 * 発言者がフィルタで許可されているかチェック
 */
const isParticipantAllowed = (
  message: MessageView,
  participantFilters: MessageFilterState['participants']
): boolean => {
  // 個人抽出モードの場合
  if (participantFilters.isPersonalExtraction && participantFilters.personalExtractionTargetId) {
    // 指定された参加者の発言のみ表示
    const messageParticipantId = message.from?.id
    return messageParticipantId === participantFilters.personalExtractionTargetId
  }

  // 参加者選択モードの場合
  if (participantFilters.selectedParticipantIds.length > 0) {
    const messageParticipantId = message.from?.id
    if (!messageParticipantId) {
      // システムメッセージなど参加者IDがない場合は表示
      return true
    }
    return participantFilters.selectedParticipantIds.includes(messageParticipantId)
  }

  // フィルタが設定されていない場合はすべて表示
  return true
}

/**
 * メッセージが自分宛かチェック
 */
const isMessageToMe = (message: MessageView, currentUserId: number): boolean => {
  // メッセージ内容に@mention形式やアンカーがあるかチェック
  const messageText = message.content.text || ''

  // 参加者IDを使った宛先指定があるか（実際のアンカー形式に依存）
  // TODO: 実際のアンカー形式に合わせて実装を調整
  const anchorPattern = new RegExp(`@${currentUserId}\\b`, 'g')
  if (anchorPattern.test(messageText)) {
    return true
  }

  // 返信先が自分のメッセージか
  // TODO: APIで返信先の情報が提供される場合に実装

  return false
}

/**
 * メッセージがキーワードを含むかチェック
 */
const containsKeyword = (message: MessageView, keyword: string): boolean => {
  if (!keyword.trim()) {
    return true
  }

  const messageText = message.content.text || ''
  const lowerKeyword = keyword.toLowerCase()
  const lowerText = messageText.toLowerCase()

  // 部分一致検索
  return lowerText.includes(lowerKeyword)
}

/**
 * フィルタ状態の要約を取得（UIでの表示用）
 */
export const getFilterSummary = (filterState: MessageFilterState): string => {
  const summaryParts: string[] = []

  // メッセージタイプフィルタの要約
  const activeMessageTypes = Object.entries(filterState.messageTypes)
    .filter(([_, enabled]) => enabled)
    .map(([type]) => type)

  const totalMessageTypes = Object.keys(filterState.messageTypes).length
  if (activeMessageTypes.length < totalMessageTypes) {
    summaryParts.push(`発言種別: ${activeMessageTypes.length}/${totalMessageTypes}種`)
  }

  // 参加者フィルタの要約
  if (filterState.participants.isPersonalExtraction) {
    summaryParts.push('個人抽出中')
  } else if (filterState.participants.selectedParticipantIds.length > 0) {
    summaryParts.push(`参加者: ${filterState.participants.selectedParticipantIds.length}人選択`)
  }

  // 私宛のみフィルタ
  if (filterState.target.onlyToMe) {
    summaryParts.push('私宛のみ')
  }

  // キーワードフィルタ
  if (filterState.keyword) {
    summaryParts.push(`キーワード: "${filterState.keyword}"`)
  }

  return summaryParts.length > 0 ? summaryParts.join(' / ') : 'すべて表示'
}

/**
 * フィルタが適用されているかチェック
 */
export const hasActiveFilter = (filterState: MessageFilterState): boolean => {
  // メッセージタイプフィルタがすべてONでない場合
  const allMessageTypesOn = Object.values(filterState.messageTypes).every(Boolean)
  if (!allMessageTypesOn) {
    return true
  }

  // 参加者フィルタが設定されている場合
  if (
    filterState.participants.isPersonalExtraction ||
    filterState.participants.selectedParticipantIds.length > 0
  ) {
    return true
  }

  // 私宛のみフィルタが設定されている場合
  if (filterState.target.onlyToMe) {
    return true
  }

  // キーワードフィルタが設定されている場合
  if (filterState.keyword) {
    return true
  }

  return false
}
